const verboseVerification = require('../../src/middlewares/verbose-verification');
const singleSignatureCert = require('../fixtures/single-signature-cert.json');
const singleSignatureCertVerifiedStepAssertion = require('../assertions/single-signature-cert-verified-steps.json');

describe('Verbose verification middleware test suite', function () {
  describe('given it is called with a single signature cert', function () {
    it('should provide a verbose feedback of the verification process', async function () {
      let result;

      const req = {
        body: {
          certificate: singleSignatureCert
        }
      };

      const res = {
        json: function (verificationResult) {
          result = verificationResult;
        }
      }
      await verboseVerification(req, res);
      expect(result.verificationSteps).toEqual(singleSignatureCertVerifiedStepAssertion);
    });
  });
});
