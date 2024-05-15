import type { CertificateInitError } from '../helpers/init-cert-verifier-js';
import type { Request } from 'express';
import type { APIPayload } from '../models/APIPayload';

export default function handleCertificateError (req: Request<{}, {}, APIPayload>, res, initializationResult) {
  console.error('An error occured initializing the certificate verifier', initializationResult);
  res.json({
    id: req.body.verifiableCredential.id,
    status: (initializationResult as CertificateInitError).status,
    message: (initializationResult as CertificateInitError).message
  });
}
