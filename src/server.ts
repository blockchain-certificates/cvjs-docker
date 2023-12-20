import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import verboseVerification, { type VerboseVerificationAPIResponse } from './middlewares/verbose-verification';
import basicVerification from './middlewares/basic-verification';
import apiDocumentationResponse from './middlewares/api-documentation-response';
import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
import type { Certificate as TCertificate, VERIFICATION_STATUSES as E_VERIFICATION_STATUSES } from '@blockcerts/cert-verifier-js';
import type { APIResponse } from './models/APIResponse';
import type { APIPayload } from './models/APIPayload';

const { Certificate, VERIFICATION_STATUSES } = certVerifierJs;

const server = express();
server.use(bodyParser.json({ limit: '5mb' }));

const port = 4000;

server.get('/', (req, res) => {
  apiDocumentationResponse(req, res);
});

export interface CertificateInitError {
  hasError: boolean;
  message: string;
  error: string;
  status: E_VERIFICATION_STATUSES.FAILURE;
}

async function initCertVerifierJs (req): Promise<TCertificate | CertificateInitError> {
  if (req.body.certificate) {
    const certData = req.body.certificate;
    try {
      const certificate = new Certificate(certData);
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
      };
    }
  }

  return null;
}

server.post('/verification', async (req: Request<unknown, unknown, APIPayload>, res: Response<APIResponse>): void => {
  console.log('calling basic verification endpoint');
  const certificate = await initCertVerifierJs(req);
  if (certificate == null) {
    return;
  }

  if ((certificate as CertificateInitError).hasError) {
    res.json({
      id: req.body.certificate.id,
      status: (certificate as CertificateInitError).status,
      message: (certificate as CertificateInitError).message
    });
    return;
  }

  basicVerification(req, res, certificate as TCertificate);
});
server.post('/verification/verbose', async (req: Request<unknown, unknown, APIPayload>, res: Response<VerboseVerificationAPIResponse | APIResponse>): void => {
  console.log('calling verbose verification endpoint');
  const certificate = await initCertVerifierJs(req);
  if (certificate == null) {
    return;
  }

  if ((certificate as CertificateInitError).hasError) {
    res.json({
      id: req.body.certificate.id,
      status: (certificate as CertificateInitError).status,
      message: (certificate as CertificateInitError).message
    });
    return;
  }

  await verboseVerification(req, res, certificate as TCertificate);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
