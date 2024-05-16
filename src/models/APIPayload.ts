import type { Blockcerts, CertificateOptions } from '@blockcerts/cert-verifier-js';

interface APIPayloadOptions extends CertificateOptions {
  returnCredential?: boolean;
}

export interface APIPayload {
  verifiableCredential: Blockcerts;
  options?: APIPayloadOptions;
}
