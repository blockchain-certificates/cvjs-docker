import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import verboseVerification, { type VerboseVerificationAPIResponse } from './middlewares/verbose-verification';
import basicVerification from './middlewares/basic-verification';
import apiDocumentationResponse from './middlewares/api-documentation-response';
import initCertVerifierJs, { type CertificateInitError } from './helpers/init-cert-verifier-js';
import type { Certificate } from '@blockcerts/cert-verifier-js';
import type { APIResponse } from './models/APIResponse';
import type { APIPayload } from  './models/APIPayload';

const server = express();
server.use(bodyParser.json({ limit: '5mb' }));

const port = 4000;

server.get('/', (req, res) => {
  apiDocumentationResponse(req, res);
});

server.post('/verification', async (req: Request<{}, {}, APIPayload>, res: Response<APIResponse>): Promise<void> => {
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

  await basicVerification(req, res, certificate as Certificate);
});
server.post('/verification/verbose', async (req: Request<{}, {}, APIPayload>, res: Response<VerboseVerificationAPIResponse | APIResponse>): Promise<void> => {
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

  await verboseVerification(req, res, certificate as Certificate);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
