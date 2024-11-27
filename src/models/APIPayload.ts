import type { Blockcerts, CertificateOptions, VerifiableCredential } from '@blockcerts/cert-verifier-js';

interface APIPayloadOptions extends CertificateOptions {
  returnCredential?: boolean;
}

export interface APIPayload {
  verifiableCredential: VerifiableCredential | Blockcerts;
  options?: APIPayloadOptions;
}
