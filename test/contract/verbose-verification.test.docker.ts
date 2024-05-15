import fetch from 'node-fetch-commonjs';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import singleSignatureCertVerifiedStepAssertion from '../assertions/single-signature-cert-verified-steps.json';
import failingSignatureCert from '../fixtures/failing-signature-cert.json';
import failingSignatureCertVerifiedStepAssertion from '../assertions/failing-signature-cert-verified-steps.json';
import type { APIPayload } from '../../src/models/APIPayload';

describe('verbose verification docker endpoint test suite', function () {
  let output;

  describe('given the certificate is valid', function () {
    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      output = await fetch('http://localhost:9000/credentials/verify/verbose', {
        body: JSON.stringify({
          verifiableCredential: fixture
        } as APIPayload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());
    });

    afterAll(function () {
      output = null;
    });

    it('should expose the id of the certificate', function () {
      expect(output.id).toBe('urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c');
    });

    it('should expose the status of the verification', function () {
      expect(output.status).toBe('success');
    });

    it('should expose the message of the verification', function () {
      expect(output.message).toEqual({
        label: 'Verified',
        description: 'This is a valid ${chain} certificate.',
        linkText: 'View transaction link'
      });
    });

    it('should expose the verificationSteps detail', function () {
      expect(output.verificationSteps).toEqual(singleSignatureCertVerifiedStepAssertion);
    });

    it('should expose the issuance date of the certificate in the response', function () {
      expect(output.issuanceDate).toBe('2022-08-18T14:04:24Z');
    });

    it('should expose the signers\' information', function () {
      expect(output.signers).toEqual([
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
      expect(output.metadata).toEqual(null);
    });
  });

  describe('given the certificate is invalid', function () {
    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(failingSignatureCert));
      output = await fetch('http://localhost:9000/credentials/verify/verbose', {
        body: JSON.stringify({
          verifiableCredential: fixture
        } as APIPayload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());
    });

    afterAll(function () {
      output = null;
    });

    it('should expose the id of the certificate', function () {
      expect(output.id).toBe('urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c');
    });

    it('should expose the status of the verification', function () {
      expect(output.status).toBe('failure');
    });

    it('should expose the message of the verification', function () {
      expect(output.message).toEqual('Computed hash does not match remote hash');
    });

    it('should expose the verificationSteps detail', function () {
      expect(output.verificationSteps).toEqual(failingSignatureCertVerifiedStepAssertion);
    });

    it('should expose the issuance date of the certificate in the response', function () {
      expect(output.issuanceDate).toBe('2022-08-18T14:04:24Z');
    });

    it('should expose the signers\' information', function () {
      expect(output.signers).toEqual([
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
      expect(output.metadata).toEqual(null);
    });
  });
});
