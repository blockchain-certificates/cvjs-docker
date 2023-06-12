const certVerifierJs = require('@blockcerts/cert-verifier-js/dist/verifier-node');
const { Certificate, VERIFICATION_STATUSES } = certVerifierJs;

async function basicVerification (req, res) {
  if (req.body.certificate) {
    const certData = req.body.certificate;
    const certificate = new Certificate(certData);
    await certificate.init();
    await certificate
      .verify()
      .then(({ status, message }) => {
        console.log('Status:', status);

        if (status === VERIFICATION_STATUSES.FAILURE) {
          console.log(`The certificate ${req.body.blockcerts.id} is not valid. Error: ${message}`);
        }

        return res.json({
          id: req.body.blockcerts.id,
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
}

module.exports = basicVerification;
