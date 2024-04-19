import { ProblemDetails } from '../helpers/invalid-certificate-problem-details-generator';

export default function handleCertificateProblemDetails (req, res, problemDetails: ProblemDetails) {
  console.error('An error occured receiving the certificate definition');
  res
    .status(problemDetails.statusCode)
    .header('Content-Type','application/problem+json')
    .json({
      title: problemDetails.title,
      detail: problemDetails.detail
    });
  return;
}
