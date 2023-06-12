const verboseVerification = require('../../src/middlewares/verbose-verification');
const singleSignatureCert = require('../fixtures/single-signature-cert.json');
const failingSignatureCert = require('../fixtures/failing-signature-cert.json');
const multipleSignatureCert = require('../fixtures/multiple-signature-cert.json');
const singleSignatureCertVerifiedStepAssertion = require('../assertions/single-signature-cert-verified-steps.json');
const multipleSignatureCertVerifiedStepAssertion = require('../assertions/multiple-signature-cert-verified-steps.json');
const failingSignatureCertVerifiedStepAssertion = require('../assertions/failing-signature-cert-verified-steps.json');

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

  describe('given it is called with a multiple signature cert', function () {
    it('should provide a verbose feedback of the verification process', async function () {
      let result;

      const req = {
        body: {
          certificate: multipleSignatureCert
        }
      };

      const res = {
        json: function (verificationResult) {
          result = verificationResult;
        }
      }
      await verboseVerification(req, res);
      expect(result.verificationSteps).toEqual(multipleSignatureCertVerifiedStepAssertion);
    });
  });

  describe('given it is called with a failing signature cert', function () {
    it('should provide a verbose feedback of the verification process', async function () {
      let result;

      const req = {
        body: {
          certificate: failingSignatureCert
        }
      };

      const res = {
        json: function (verificationResult) {
          result = verificationResult;
        }
      }
      await verboseVerification(req, res);
      expect(result.verificationSteps).toEqual(failingSignatureCertVerifiedStepAssertion);
    });
  });
});
