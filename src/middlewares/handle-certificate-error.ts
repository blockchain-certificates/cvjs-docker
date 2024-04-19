import type { CertificateInitError } from '../helpers/init-cert-verifier-js';

export default function handleCertificateError (req, res, initializationResult) {
  console.error('An error occured initializing the certificate verifier', initializationResult);
  res.json({
    id: req.body.certificate.id,
    status: (initializationResult as CertificateInitError).status,
    message: (initializationResult as CertificateInitError).message
  });
}
