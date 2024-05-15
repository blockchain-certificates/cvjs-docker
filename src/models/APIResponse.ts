import type { VERIFICATION_STATUSES } from '@blockcerts/cert-verifier-js';

export interface APIResponse {
  id?: string;
  status?: VERIFICATION_STATUSES;
  message?: string;

  // VC-API
  verifiedCredential?: any; // at risk, might become `credential`: https://github.com/w3c-ccg/vc-api/issues/381
  checks: string[];
  errors: string[];
  warnings?: string[];

  // RFC9457
  title?: string;
  detail?: string;

}
