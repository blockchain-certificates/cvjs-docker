import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
const { VERIFICATION_STATUSES } = certVerifierJs;

export default async function basicVerification (req, res, certificate) {
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
        statusCode: 500,
        error: err
      });
    });
}
