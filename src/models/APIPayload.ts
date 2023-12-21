import type { Blockcerts, CertificateOptions } from '@blockcerts/cert-verifier-js';

export interface APIPayload {
  certificate: Blockcerts;
  options?: CertificateOptions;
}
