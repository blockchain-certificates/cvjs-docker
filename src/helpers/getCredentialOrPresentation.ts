export default function getCredentialOrPresentation(req) {
  return req.body.verifiableCredential ?? req.body.verifiablePresentation;
}
