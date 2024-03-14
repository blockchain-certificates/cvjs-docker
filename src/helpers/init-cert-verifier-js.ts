import {
  Certificate as TCertificate,
  VERIFICATION_STATUSES as E_VERIFICATION_STATUSES
} from '@blockcerts/cert-verifier-js';
import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';

const { Certificate, VERIFICATION_STATUSES } = certVerifierJs;

export interface CertificateInitError {
  hasError: boolean;
  message: string;
  error: string;
  status: E_VERIFICATION_STATUSES.FAILURE;
}

export default async function initCertVerifierJs (req): Promise<TCertificate | CertificateInitError> {
  if (!req.body.certificate) {
    return null;
  }

  if (typeof req.body.certificate !== 'object') {
    return null;
  }

  if (Object.keys(req.body.certificate).length === 0) {
    return null;
  }

  if (Array.isArray(req.body.certificate)) {
    return null;
  }

  const certData = req.body.certificate;
  try {
    const certificate = new Certificate(certData, req.body.options);
    await certificate.init();
    return certificate;
  } catch (e) {
    console.log('An error occurred while initializing the verification library:');
    console.error(e);
    return {
      hasError: true,
      message: e.message,
      error: JSON.stringify(e.stack, null, 2),
      status: VERIFICATION_STATUSES.FAILURE
    }
  }
}
