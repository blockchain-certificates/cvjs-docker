import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import verboseVerification, { type VerboseVerificationAPIResponse } from './middlewares/verbose-verification';
import basicVerification from './middlewares/basic-verification';
import apiDocumentationResponse from './middlewares/api-documentation-response';
import initCertVerifierJs, { type CertificateInitError, type CertificateInitSuccess } from './helpers/init-cert-verifier-js';
import type { APIResponse } from './models/APIResponse';
import type { APIPayload } from  './models/APIPayload';
import type { ProblemDetails } from './helpers/invalid-certificate-problem-details-generator';
import handleCertificateProblemDetails from './middlewares/handle-certificate-problem-details';
import handleCertificateError from './middlewares/handle-certificate-error';

const server = express();
server.use(bodyParser.json({ limit: '5mb' }));

const port = 4000;

server.get('/', (req, res) => {
  apiDocumentationResponse(req, res);
});

async function basicVerify (req: Request<{}, {}, APIPayload>, res: Response<APIResponse>): Promise<void> {
  console.log('calling basic verification endpoint');
  const initializationResult = await initCertVerifierJs(req);
  if ((initializationResult as ProblemDetails).hasProblemDetails) {
    handleCertificateProblemDetails(req, res, initializationResult as ProblemDetails);
    return;
  }

  if ((initializationResult as CertificateInitError).hasError) {
    handleCertificateError(req, res, initializationResult as CertificateInitError);
    return;
  }

  await basicVerification(req, res, (initializationResult as CertificateInitSuccess).certificate);
}

server.post('/credentials/verify', basicVerify);
server.post('/presentations/verify', basicVerify);


async function verboseVerify (req: Request<{}, {}, APIPayload>, res: Response<VerboseVerificationAPIResponse | APIResponse>): Promise<void> {
  console.log('calling verbose verification endpoint');
  const initializationResult = await initCertVerifierJs(req);
  if ((initializationResult as ProblemDetails).hasProblemDetails) {
    handleCertificateProblemDetails(req, res, initializationResult as ProblemDetails);
    return;
  }

  if ((initializationResult as CertificateInitError).hasError) {
    handleCertificateError(req, res, initializationResult as CertificateInitError);
    return;
  }

  await verboseVerification(req, res, (initializationResult as CertificateInitSuccess).certificate);
}
server.post('/credentials/verify/verbose', verboseVerify);
server.post('/presentations/verify/verbose', verboseVerify);

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
