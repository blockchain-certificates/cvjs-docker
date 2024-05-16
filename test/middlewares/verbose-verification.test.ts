import verboseVerification from '../../src/middlewares/verbose-verification';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import failingSignatureCert from '../fixtures/failing-signature-cert.json';
import multipleSignatureCert from '../fixtures/multiple-signature-cert.json';
import singleSignatureCertVerifiedStepAssertion from '../assertions/single-signature-cert-verified-steps.json';
import multipleSignatureCertVerifiedStepAssertion from '../assertions/multiple-signature-cert-verified-steps.json';
import failingSignatureCertVerifiedStepAssertion from '../assertions/failing-signature-cert-verified-steps.json';
import certVerifierJs from '@blockcerts/cert-verifier-js/dist/verifier-node';
import type { APIPayload } from "../../src/models/APIPayload";
import type { Request } from 'express';

const { Certificate } = certVerifierJs;

describe('Verbose verification middleware test suite', function () {
  describe('given it is called with a cert', function () {
    let result;

    beforeAll(async function () {
      const req: Partial<Request<{}, {}, APIPayload>> = {
        body: {
          verifiableCredential: singleSignatureCert
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
      expect(result.id).toBe('urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c');
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
      expect(result.issuanceDate).toBe('2022-08-18T14:04:24Z');
    });

    it('should expose the signers of the certificate in the response', function () {
      expect(result.signers).toEqual([
        {
          "signingDate": "2023-03-30T15:08:26.139158",
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
          "transactionId": "188bd8713c62c0f1f1f8abf48291c33b5503dcd5b9e0ab18c0f969bb790b571a",
          "transactionLink": "https://testnet.blockchain.info/tx/188bd8713c62c0f1f1f8abf48291c33b5503dcd5b9e0ab18c0f969bb790b571a",
          "rawTransactionLink": "https://testnet.blockchain.info/rawtx/188bd8713c62c0f1f1f8abf48291c33b5503dcd5b9e0ab18c0f969bb790b571a"
        }
      ]);
    });

    it('should expose the document\'s metadata', function () {
      expect(result.metadata).toEqual(null);
    });
  });

  describe('given it is called with a single signature cert', function () {
    it('should provide a verbose feedback of the verification process', async function () {
      let result;

      const req: Partial<Request<{}, {}, APIPayload>> = {
        body: {
          verifiableCredential: singleSignatureCert
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

      const req: Partial<Request<{}, {}, APIPayload>> = {
        body: {
          verifiableCredential: multipleSignatureCert
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

      const req: Partial<Request<{}, {}, APIPayload>> = {
        body: {
          verifiableCredential: failingSignatureCert
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
