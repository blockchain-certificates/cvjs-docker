import type { Request } from 'express';
import type { APIPayload } from '../models/APIPayload';

export interface ProblemDetails {
  title: string;
  detail: string;
  statusCode: number;
  hasProblemDetails: boolean;
}

export default function invalidCertificateProblemDetailsGenerator (req: Request<{}, {}, APIPayload>): ProblemDetails {
  const title = 'Invalid certificate definition';
  let detail = '';

  if (!req.body.verifiableCredential) {
    detail = 'No certificate definition provided.';
  } else if (typeof req.body.verifiableCredential !== 'object') {
    detail = 'Certificate definition must be an object.';
  } else if (Array.isArray(req.body.verifiableCredential)) {
    detail = 'Certificate definition must be an object, not an array.';
  } else if (Object.keys(req.body.verifiableCredential).length === 0) {
    detail = 'Certificate definition must not be an empty object.';
  }

  if (detail !== '') {
    return {
      statusCode: 400,
      title,
      detail,
      hasProblemDetails: true
    }
  }

  return null;
}
