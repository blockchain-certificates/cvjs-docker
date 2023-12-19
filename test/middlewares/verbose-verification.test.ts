import verboseVerification from '../../src/middlewares/verbose-verification';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import failingSignatureCert from '../fixtures/failing-signature-cert.json';
import multipleSignatureCert from '../fixtures/multiple-signature-cert.json';
import singleSignatureCertVerifiedStepAssertion from '../assertions/single-signature-cert-verified-steps.json';
import multipleSignatureCertVerifiedStepAssertion from '../assertions/multiple-signature-cert-verified-steps.json';
import failingSignatureCertVerifiedStepAssertion from '../assertions/failing-signature-cert-verified-steps.json';
import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
const { Certificate } = certVerifierJs;

describe('Verbose verification middleware test suite', function () {
  describe('given it is called with a cert', function () {
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

      const certificate = new Certificate(singleSignatureCert);
      await certificate.init();
      await verboseVerification(req as any, res as any, certificate);
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

    it('should expose the issuance date of the certificate in the response', function () {
      expect(result.issuanceDate).toBe('2022-02-02T15:00:00Z');
    });

    it('should expose the signers of the certificate in the response', function () {
      expect(result.signers).toEqual([
        {
          "signingDate": "2022-04-05T13:43:10.870521",
          "signatureSuiteType": "MerkleProof2019",
          "issuerPublicKey": "mgdWjvq4RYAAP5goUNagTRMx7Xw534S5am",
          "issuerName": "Blockcerts Organization",
          "issuerProfileDomain": "www.blockcerts.org",
          "issuerProfileUrl": "https://www.blockcerts.org/samples/3.0/issuer-blockcerts.json",
          "chain": {
            "code": "testnet",
            "blinkCode": "btc",
            "name": "Bitcoin Testnet",
            "signatureValue": "bitcoinTestnet",
            "transactionTemplates": {
              "full": "https://testnet.blockchain.info/tx/{transaction_id}",
              "raw": "https://testnet.blockchain.info/rawtx/{transaction_id}"
            }
          },
          "transactionId": "140ee9382a5c84433b9c89a5d9fea26c47415838b5841deb0c36a8a4b9121f2e",
          "transactionLink": "https://testnet.blockchain.info/tx/140ee9382a5c84433b9c89a5d9fea26c47415838b5841deb0c36a8a4b9121f2e",
          "rawTransactionLink": "https://testnet.blockchain.info/rawtx/140ee9382a5c84433b9c89a5d9fea26c47415838b5841deb0c36a8a4b9121f2e"
        }
      ]);
    });

    it('should expose the document\'s metadata', function () {
      expect(result.metadata).toEqual({
        classOf: "2022"
      });
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

      const certificate = new Certificate(singleSignatureCert);
      await certificate.init();
      await verboseVerification(req as any, res as any, certificate);
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
      const certificate = new Certificate(multipleSignatureCert);
      await certificate.init();
      await verboseVerification(req as any, res as any, certificate);
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
      const certificate = new Certificate(failingSignatureCert);
      await certificate.init();
      await verboseVerification(req as any, res as any, certificate);
      expect(result.verificationSteps).toEqual(failingSignatureCertVerifiedStepAssertion);
    });
  });
});
