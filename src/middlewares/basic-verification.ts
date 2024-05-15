import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
import type { APIResponse } from '../models/APIResponse';
import type { Request, Response } from 'express';
import type { APIPayload } from  '../models/APIPayload';
import type { Certificate } from '@blockcerts/cert-verifier-js';

const { VERIFICATION_STATUSES } = certVerifierJs;

function createResponseBody (req: Request<{}, {}, APIPayload>, status: typeof VERIFICATION_STATUSES, message: string): APIResponse {
  const id = req.body.verifiableCredential.id;
  const verifiedCredential = req.body.options?.returnCredential ? req.body.verifiableCredential : undefined;
  return {
    id,
    status,
    message,
    verifiedCredential
  };
}

export default async function basicVerification (req: Request<{}, {}, APIPayload>, res: Response<APIResponse>, certificate: Certificate) {
  await certificate
    .verify()
    .then(({ status, message }) => {
      console.log('Verification status:', status);

      if (status === VERIFICATION_STATUSES.FAILURE) {
        console.error(`The certificate ${req.body.verifiableCredential.id} is not valid. Error: ${message}`);
      }

      return res.json(createResponseBody(req, status, message));
    })
    .catch(err => {
      console.error(err);
      res.json(createResponseBody(req, VERIFICATION_STATUSES.FAILURE, err));
    });
}
