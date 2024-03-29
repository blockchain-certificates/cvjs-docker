import type { VERIFICATION_STATUSES } from '@blockcerts/cert-verifier-js';

export interface APIResponse {
  id: string;
  status: VERIFICATION_STATUSES;
  message: string;
}
