export interface ProblemDetails {
  title: string;
  detail: string;
  statusCode: number;
}

export default function invalidCertificateProblemDetailsGenerator (req): ProblemDetails {
  const title = 'Invalid certificate definition';
  let detail = '';

  if (!req.body.certificate) {
    detail = 'No certificate definition provided.';
  } else if (typeof req.body.certificate !== 'object') {
    detail = 'Certificate definition must be an object.';
  } else if (Array.isArray(req.body.certificate)) {
    detail = 'Certificate definition must be an object, not an array.';
  } else if (Object.keys(req.body.certificate).length === 0) {
    detail = 'Certificate definition must not be an empty object.';
  }

  if (detail !== '') {
    return {
      statusCode: 400,
      title,
      detail
    }
  }

  return null;
}
