import type { Blockcerts, CertificateOptions } from '@blockcerts/cert-verifier-js';

export interface APIPayload {
  verifiableCredential: Blockcerts;
  options?: CertificateOptions;
}
