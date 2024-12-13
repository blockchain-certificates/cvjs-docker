import fetch from 'node-fetch-commonjs';
import verifiablePresentationFixture from '../fixtures/mocknet-verifiable-presentation.json';
import validVerifiablePresentationVerifiedStepAssertion from '../assertions/valid-verifiable-presentation-verified-steps.json';
import failingVerifiablePresentationFixture from '../fixtures/mocknet-verifiable-presentation-failing-credential.json';
import invalidVerifiablePresentationVerifiedStepAssertion from '../assertions/invalid-verifiable-presentation-verified-steps.json';
import type { APIPayload } from '../../src/models/APIPayload';

describe('verbose verification docker endpoint test suite', function () {
  let output;

  describe('given the verifiable presentation is valid', function () {
    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(verifiablePresentationFixture));
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
      expect(output.id).toBe('urn:uuid:bbba9667-8ec1-445f-82c9-a57251dd731c');
    });

    it('should expose the status of the verification', function () {
      expect(output.status).toBe('success');
    });

    it('should expose the message of the verification', function () {
      expect(output.message).toEqual({
        description: 'Mocknet credentials are used for test purposes only. They are not recorded on a blockchain, and they should not be considered verified Blockcerts.',
        label: 'This Mocknet credential passed all checks',
      });
    });

    it('should expose the verificationSteps detail', function () {
      expect(output.verificationSteps).toEqual(validVerifiablePresentationVerifiedStepAssertion);
    });

    it('should expose the signers\' information', function () {
      expect(output.signers).toEqual([
        {
          "signingDate": "2024-11-18T16:55:15Z",
          "signatureSuiteType": "MerkleProof2019",
          "issuerPublicKey": "This mock chain does not support issuing addresses",
          "issuerName": "Blockcerts Organization",
          "issuerProfileDomain": "www.blockcerts.org",
          "issuerProfileUrl": "https://www.blockcerts.org/samples/3.0/issuer-blockcerts.json",
          "chain": {
            "blinkCode": "mocknet",
            "code": "mocknet",
            "name": "Mocknet",
            "signatureValue": "mockchain",
            "test": true,
            "transactionTemplates": {
              "full": "",
              "raw": ""
            }
          },
          "transactionId": "undefined",
          "transactionLink": "",
          "rawTransactionLink": ""
        }
      ]);
    });

    it('should expose the document\'s metadata', function () {
      expect(output.metadata).toEqual(null);
    });

    it('should expose the checks array to conform with VC-API', function () {
      expect(output.checks).toEqual([
        "assertProofValidity",
        "computeLocalHash",
        "compareHashes",
        "checkReceipt",
        "checkRevokedStatus",
        "checkExpiresDate",
        "validateDateFormat"
      ]);
    });

    it('should expose an empty errors array to conform with VC-API', function () {
      expect(output.errors).toEqual([]);
    });
  });

  describe('given the certificate is invalid', function () {
    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(failingVerifiablePresentationFixture));
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
      expect(output.id).toBe('urn:uuid:bbba9667-8ec1-445f-82c9-a57251dd731c');
    });

    it('should expose the status of the verification', function () {
      expect(output.status).toBe('failure');
    });

    it('should expose the message of the verification', function () {
      expect(output.message).toEqual('Credential with id urn:uuid:4f5f0100-ccbf-4ca9-9cfc-4f5fc3052d28 failed verification. Error: This certificate does not conform with the provided credential schema');
    });

    it('should expose the verificationSteps detail', function () {
      expect(output.verificationSteps).toEqual(invalidVerifiablePresentationVerifiedStepAssertion);
    });

    it('should expose the signers\' information', function () {
      expect(output.signers).toEqual([
        {
          "signingDate": "2024-11-19T14:39:26Z",
          "signatureSuiteType": "MerkleProof2019",
          "issuerPublicKey": "This mock chain does not support issuing addresses",
          "issuerName": "Blockcerts Organization",
          "issuerProfileDomain": "www.blockcerts.org",
          "issuerProfileUrl": "https://www.blockcerts.org/samples/3.0/issuer-blockcerts.json",
          "chain": {
            "blinkCode": "mocknet",
            "code": "mocknet",
            "name": "Mocknet",
            "signatureValue": "mockchain",
            "test": true,
            "transactionTemplates": {
              "full": "",
              "raw": ""
            }
          },
          "transactionId": "undefined",
          "transactionLink": "",
          "rawTransactionLink": ""
        }
      ]);
    });

    it('should expose the document\'s metadata', function () {
      expect(output.metadata).toEqual(null);
    });

    it('should expose the checks array to conform with VC-API', function () {
      expect(output.checks).toEqual([
        "assertProofValidity",
        "computeLocalHash",
        "compareHashes",
        "checkReceipt",
        "checkRevokedStatus",
        "checkExpiresDate",
        "validateDateFormat"
      ]);
    });

    it('should expose the errors array to conform with VC-API', function () {
      expect(output.errors).toEqual(['credentialVerification: Credential with id urn:uuid:4f5f0100-ccbf-4ca9-9cfc-4f5fc3052d28 failed verification. Error: This certificate does not conform with the provided credential schema']);
    });
  });
});
