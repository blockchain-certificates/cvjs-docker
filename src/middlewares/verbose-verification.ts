// export interface IVerificationStepCallbackAPI {
//   code: string;
//   label: string;
//   status: VERIFICATION_STATUSES;
//   errorMessage?: string;
//   parentStep: string;
// }

import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
import type {
  Certificate,
  Signers,
  Blockcerts,
  IVerificationMapItem,
  VerificationSubstep,
  BlockcertsV3,
  BlockcertsV2
} from '@blockcerts/cert-verifier-js'
import type { Request, Response } from 'express';
import type { APIResponse } from '../models/APIResponse';
import type { APIPayload } from  '../models/APIPayload';
import getCredentialOrPresentation from "../helpers/getCredentialOrPresentation";

const { VERIFICATION_STATUSES } = certVerifierJs;

export interface VerboseVerificationAPIResponse extends APIResponse {
  verificationSteps: IVerificationMapItem[];
  issuanceDate: string;
  signers: Signers[];
  metadata: string | null;
}

function initializeVerificationSteps (certificate: Certificate): IVerificationMapItem[] {
  const steps = JSON.parse(JSON.stringify(certificate.verificationSteps));
  return steps.map((step, i) => ({
    ...step,
    isLast: i === steps.length - 1,
    status: VERIFICATION_STATUSES.DEFAULT
  }));
}


function stepVerificationIsSuccessful (step: VerificationSubstep): boolean {
  return step.status === VERIFICATION_STATUSES.SUCCESS;
}

function stepVerificationIsFailure (step: VerificationSubstep): boolean {
  return step.status === VERIFICATION_STATUSES.FAILURE;
}

function oneChildIsSuccess (parent: IVerificationMapItem): boolean {
  let suiteVerification = true;
  if (parent.suites?.length) {
    suiteVerification = parent.suites?.flatMap(suite => suite.subSteps).some(stepVerificationIsSuccessful);
  }
  return suiteVerification || parent.subSteps.some(stepVerificationIsSuccessful);
}

function allChildrenAreSuccess (parent: IVerificationMapItem): boolean {
  let suiteVerification = true;
  if (parent.suites?.length) {
    suiteVerification = parent.suites?.flatMap(suite => suite.subSteps).every(stepVerificationIsSuccessful);
  }
  return suiteVerification && parent.subSteps.every(stepVerificationIsSuccessful);
}

function oneChildIsFailure (parent: IVerificationMapItem): boolean {
  let suiteVerification = false;
  if (parent.suites?.length) {
    suiteVerification = parent.suites?.flatMap(suite => suite.subSteps).some(stepVerificationIsFailure);
  }
  return suiteVerification || parent.subSteps.some(stepVerificationIsFailure);
}

function updateParentStepStatus (verificationSteps: IVerificationMapItem[], parentStepCode: string) {
  if (parentStepCode == null) {
    return;
  }

  const parent = getParentStep(verificationSteps, parentStepCode);
  let status = parent.status;

  if (status === VERIFICATION_STATUSES.DEFAULT && oneChildIsSuccess(parent)) {
    status = VERIFICATION_STATUSES.STARTING;
  }

  if (status !== VERIFICATION_STATUSES.DEFAULT && allChildrenAreSuccess(parent)) {
    status = VERIFICATION_STATUSES.SUCCESS;
  }

  if (oneChildIsFailure(parent)) {
    status = VERIFICATION_STATUSES.FAILURE;
  }

  parent.status = status;
}

function getParentStep (verificationSteps: IVerificationMapItem[], parentStepCode: string): IVerificationMapItem {
  return verificationSteps.find(step => step.code === parentStepCode);
}

function updateSubstepIn (parent: IVerificationMapItem, substep: VerificationSubstep): void {
  let substepIndex = parent.subSteps.findIndex(s => s.code === substep.code);
  if (substepIndex > -1) {
    parent.subSteps[substepIndex] = substep;
    return;
  }
  if (parent.suites?.length) {
    parent.suites.forEach(suite => {
      substepIndex = suite.subSteps.findIndex(s => s.code === substep.code);
      if (substepIndex > -1) {
        suite.subSteps[substepIndex] = substep;
      }
    });
  }
}

function getSigners (certificate: Certificate): Signers[] {
  return certificate.signers ?? [];
}

function getBaseDocument (certificate: Certificate): Blockcerts {
  return certificate.certificateJson;
}

function getIssuanceDate (certificate: Certificate): string {
  const initialDocument = getBaseDocument(certificate);
  return (initialDocument as BlockcertsV3).issuanceDate ?? (initialDocument as BlockcertsV2).issuedOn;
}

function getMetadata (certificate: Certificate): string | null {
  try {
    return JSON.parse(certificate.metadataJson);
  } catch {
    return null;
  }

  return null;
}

function stepVerified (verificationSteps: IVerificationMapItem[], step: VerificationSubstep): IVerificationMapItem[] {
  const { parentStep } = step;
  const storedParentState = getParentStep(verificationSteps, parentStep);
  updateSubstepIn(storedParentState, step);
  updateParentStepStatus(verificationSteps, parentStep)

  return verificationSteps;
}

function createResponseBody (
  req: Request<{}, {}, APIPayload>,
  status: typeof VERIFICATION_STATUSES,
  message: string,
  verificationSteps: IVerificationMapItem[],
  certificate: Certificate,
  checks: string[],
  errors: string[]
): VerboseVerificationAPIResponse {
  const id = getCredentialOrPresentation(req).id;
  const verifiedCredential = req.body.options?.returnCredential ? getCredentialOrPresentation(req) : undefined;
  return {
    id,
    status,
    message,
    verifiedCredential,
    verificationSteps,
    issuanceDate: getIssuanceDate(certificate),
    signers: getSigners(certificate),
    metadata: getMetadata(certificate),
    checks,
    errors
  };
}

export default async function verboseVerification (req: Request<{}, {}, APIPayload>, res: Response<VerboseVerificationAPIResponse>, certificate: Certificate): Promise<void> {
  let verificationSteps = initializeVerificationSteps(certificate);
  const errors: string[] = [];
  const checks: string[] = [];

  function verificationCb (verifiedStep) {
    stepVerified(verificationSteps, verifiedStep);
    if (verifiedStep.status === VERIFICATION_STATUSES.SUCCESS) {
      checks.push(verifiedStep.code);
    } else if (verifiedStep.status === VERIFICATION_STATUSES.FAILURE) {
      errors.push(`${verifiedStep.code}: ${verifiedStep.errorMessage}`);
    }
  }

  await certificate
    .verify(verificationCb)
    .then(({ status, message }) => {
      console.log('Verification status:', status);

      if (status === VERIFICATION_STATUSES.FAILURE) {
        console.error(`The certificate ${getCredentialOrPresentation(req).id} is not valid. Error: ${message}`);
        if (errors.length === 0) {
          errors.push('credentialVerification: ' + message);
        }
      }
      res.json(createResponseBody(req, status, message, verificationSteps, certificate, checks, errors));
    }).catch(err => {
      console.error(err);
      res.json(createResponseBody(req, VERIFICATION_STATUSES.FAILURE, err, verificationSteps, certificate, checks, errors));
    });
}
