// export interface IVerificationStepCallbackAPI {
//   code: string;
//   label: string;
//   status: VERIFICATION_STATUSES;
//   errorMessage?: string;
//   parentStep: string;
// }

const certVerifierJs = require('@blockcerts/cert-verifier-js/dist/verifier-node');
const { Certificate, VERIFICATION_STATUSES } = certVerifierJs;

function initializeVerificationSteps (definition) {
  const steps = JSON.parse(JSON.stringify(definition.verificationSteps));
  return steps.map((step, i) => ({
    ...step,
    isLast: i === steps.length - 1,
    status: VERIFICATION_STATUSES.DEFAULT
  }));
}


function stepVerificationIsSuccessful (step) {
  return step.status === VERIFICATION_STATUSES.SUCCESS;
}

function stepVerificationIsFailure (step) {
  return step.status === VERIFICATION_STATUSES.FAILURE;
}

function oneChildIsSuccess (parent) {
  let suiteVerification = true;
  if (parent.suites?.length) {
    suiteVerification = parent.suites?.flatMap(suite => suite.subSteps).some(stepVerificationIsSuccessful);
  }
  return suiteVerification || parent.subSteps.some(stepVerificationIsSuccessful);
}

function allChildrenAreSuccess (parent) {
  let suiteVerification = true;
  if (parent.suites?.length) {
    suiteVerification = parent.suites?.flatMap(suite => suite.subSteps).every(stepVerificationIsSuccessful);
  }
  return suiteVerification && parent.subSteps.every(stepVerificationIsSuccessful);
}

function oneChildIsFailure (parent) {
  let suiteVerification = false;
  if (parent.suites?.length) {
    suiteVerification = parent.suites?.flatMap(suite => suite.subSteps).some(stepVerificationIsFailure);
  }
  return suiteVerification || parent.subSteps.some(stepVerificationIsFailure);
}

function updateParentStepStatus (verificationSteps, parentStepCode) {
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

function getParentStep (verificationSteps, parentStepCode) {
  return verificationSteps.find(step => step.code === parentStepCode);
}

function updateSubstepIn (parent, substep) {
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

function getSigners (certificate) {
  return certificate.signers ?? [];
}

function getBaseDocument (certificate) {
  return certificate.certificateJson;
}

function getIssuanceDate (certificate) {
  const initialDocument = getBaseDocument(certificate);
  return initialDocument.issuanceDate;
}

function getMetadata (certificate) {
  try {
    return JSON.parse(certificate.metadataJson);
  } catch {
    return null;
  }

  return null;
}

function stepVerified (verificationSteps, step) {
  const { parentStep } = step;
  const storedParentState = getParentStep(verificationSteps, parentStep);
  updateSubstepIn(storedParentState, step);
  updateParentStepStatus(verificationSteps, parentStep)

  return verificationSteps;
}

async function verboseVerification (req, res) {
  if (req.body.certificate) {
    const certData = req.body.certificate;
    const certificate = new Certificate(certData);
    await certificate.init();
    let verificationSteps = initializeVerificationSteps(certificate);
    function verificationCb (verifiedStep) {
      stepVerified(verificationSteps, verifiedStep);
    }

    const verification = await certificate.verify(verificationCb);

    res.json({
      id: req.body.certificate.id,
      status: verification.status,
      message: verification.message,
      verificationSteps,
      issuanceDate: getIssuanceDate(certificate),
      signers: getSigners(certificate),
      metadata: getMetadata(certificate)
    });
  }
}

module.exports = verboseVerification;
