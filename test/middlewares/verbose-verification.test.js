const verboseVerification = require('../../src/middlewares/verbose-verification');
const singleSignatureCert = require('../fixtures/single-signature-cert.json');
const failingSignatureCert = require('../fixtures/failing-signature-cert.json');
const multipleSignatureCert = require('../fixtures/multiple-signature-cert.json');
const singleSignatureCertVerifiedStepAssertion = require('../assertions/single-signature-cert-verified-steps.json');
const multipleSignatureCertVerifiedStepAssertion = require('../assertions/multiple-signature-cert-verified-steps.json');
const failingSignatureCertVerifiedStepAssertion = require('../assertions/failing-signature-cert-verified-steps.json');

describe('Verbose verification middleware test suite', function () {
  describe.only('given it is called with a cert', function () {
    let result;

    beforeAll(async function () {
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
    });

    it('should provide the id of the cert in the response', function () {
      expect(result.id).toBe('urn:uuid:13172c8c-efa5-49e1-9f69-a67ba6bd9937');
    });

    it('should provide the status of the verification in the response', function () {
      expect(result.status).toBe('success');
    });

    it('should provide the message of the verification in the response', function () {
      expect(result.message).toEqual({
        label: 'Verified',
        description: 'This is a valid ${chain} certificate.',
        linkText: 'View transaction link'
      });
    });

    it('should expose the blockchain(s) of the signature(s) of the certificate in the response', function () {
      expect(result.chain).toEqual(['Bitcoin Testnet']);
    });

    it('should expose the issuance date of the certificate in the response', function () {
      expect(result.issuanceDate).toBe('2022-02-02T15:00:00Z');
    });
  });

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
