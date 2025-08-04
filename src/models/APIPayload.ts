import type { Blockcerts, CertificateOptions, VerifiableCredential } from '@blockcerts/cert-verifier-js';

interface VerifiablePresentation extends VerifiableCredential {
  verifiableCredential: (VerifiableCredential | Blockcerts)[];
}

interface APIPayloadOptions extends CertificateOptions {
  returnCredential?: boolean;
}

export interface APIPayload {
  verifiableCredential?: VerifiableCredential | Blockcerts;
  verifiablePresentation?: VerifiablePresentation;
  options?: APIPayloadOptions;
}
