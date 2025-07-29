import type { Request } from 'express';
import type { APIPayload } from '../models/APIPayload';
import getCredentialOrPresentation from "./getCredentialOrPresentation";

export interface ProblemDetails {
  title: string;
  detail: string;
  statusCode: number;
  hasProblemDetails: boolean;
}

export default function invalidCertificateProblemDetailsGenerator (req: Request<{}, {}, APIPayload>): ProblemDetails {
  const title = 'Invalid certificate definition';
  let detail = '';

  const credentialOrPresentation = getCredentialOrPresentation(req);

  if (!credentialOrPresentation) {
    detail = 'No certificate definition provided.';
  } else if (typeof credentialOrPresentation !== 'object') {
    detail = 'Certificate definition must be an object.';
  } else if (Array.isArray(credentialOrPresentation)) {
    detail = 'Certificate definition must be an object, not an array.';
  } else if (Object.keys(credentialOrPresentation).length === 0) {
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
