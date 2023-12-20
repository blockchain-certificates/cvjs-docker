import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
import type { APIResponse } from '../models/APIResponse';
import type { Request, Response } from 'express';
import type { APIPayload } from '../models/APIPayload';
import type { Certificate } from '@blockcerts/cert-verifier-js';

const { VERIFICATION_STATUSES } = certVerifierJs;

export default async function basicVerification (req: Request<unknown, unknown, APIPayload>, res: Response<APIResponse>, certificate: Certificate): void {
  await certificate
    .verify()
    .then(({ status, message }) => {
      console.log('Status:', status);

      if (status === VERIFICATION_STATUSES.FAILURE) {
        console.log(`The certificate ${req.body.certificate.id} is not valid. Error: ${message}`);
      }

      return res.json({
        id: req.body.certificate.id,
        status,
        message
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        id: req.body.certificate.id,
        status: VERIFICATION_STATUSES.FAILURE,
        message: err
      });
    });
}
