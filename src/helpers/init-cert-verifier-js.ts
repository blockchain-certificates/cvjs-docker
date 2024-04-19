import {
  Certificate as TCertificate,
  VERIFICATION_STATUSES as E_VERIFICATION_STATUSES
} from '@blockcerts/cert-verifier-js';
import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
import invalidCertificateProblemDetailsGenerator, {ProblemDetails} from "./invalid-certificate-problem-details-generator";

const { Certificate, VERIFICATION_STATUSES } = certVerifierJs;

export interface CertificateInitError {
  hasError: boolean;
  message: string;
  error: string;
  status: E_VERIFICATION_STATUSES.FAILURE;
  statusCode: number;
}

export interface CertificateInitSuccess {
  certificate: TCertificate;
  statusCode: number;
}

export default async function initCertVerifierJs (req): Promise<CertificateInitSuccess | CertificateInitError | ProblemDetails> {
  const problemDetails = invalidCertificateProblemDetailsGenerator(req);
  if (problemDetails !== null) {
    return problemDetails;
  }

  const certData = req.body.certificate;
  try {
    const certificate = new Certificate(certData, req.body.options);
    await certificate.init();
    return {
      certificate,
      statusCode: 200
    };
  } catch (e) {
    console.log('An error occurred while initializing the verification library:');
    console.error(e);
    return {
      hasError: true,
      message: e.message,
      error: JSON.stringify(e.stack, null, 2),
      status: VERIFICATION_STATUSES.FAILURE,
      statusCode: 200
    }
  }
}
