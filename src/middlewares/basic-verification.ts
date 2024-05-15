import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
import type { APIResponse } from '../models/APIResponse';
import type { Request, Response } from 'express';
import type { APIPayload } from '../models/APIPayload';
import type { Certificate, IVerificationStepCallbackAPI } from '@blockcerts/cert-verifier-js';

const { VERIFICATION_STATUSES } = certVerifierJs;

// export interface IVerificationStepCallbackAPI {
//   code: string;
//   label: string;
//   status: VERIFICATION_STATUSES;
//   errorMessage?: string;
//   parentStep: string;
// }

function verificationCbFactory (checks: string[], errors: string[]) {
  return function verificationCb (verificationEvent: IVerificationStepCallbackAPI) {
    if (verificationEvent.status === VERIFICATION_STATUSES.SUCCESS) {
      checks.push(verificationEvent.code);
    } else if (verificationEvent.status === VERIFICATION_STATUSES.FAILURE) {
      errors.push(`${verificationEvent.code}: ${verificationEvent.errorMessage}`);
    }
  };
}

function createResponseBody (
  req: Request<{}, {}, APIPayload>,
  status: typeof VERIFICATION_STATUSES,
  message: string,
  checks: string[],
  errors: string[]
): APIResponse {
  const id = req.body.verifiableCredential.id;
  const verifiedCredential = req.body.options?.returnCredential ? req.body.verifiableCredential : undefined;
  return {
    id,
    status,
    message,
    verifiedCredential,
    checks,
    errors
  };
}

export default async function basicVerification (req: Request<{}, {}, APIPayload>, res: Response<APIResponse>, certificate: Certificate) {
  const checks: string[] = [];
  const errors: string[] = [];

  await certificate
    .verify(verificationCbFactory(checks, errors))
    .then(({ status, message }) => {
      console.log('Verification status:', status);

      if (status === VERIFICATION_STATUSES.FAILURE) {
        console.error(`The certificate ${req.body.verifiableCredential.id} is not valid. Error: ${message}`);
      }

      return res.json(createResponseBody(req, status, message, checks, errors));
    })
    .catch(err => {
      console.error(err);
      res.json(createResponseBody(req, VERIFICATION_STATUSES.FAILURE, err, checks, errors));
    });
}
