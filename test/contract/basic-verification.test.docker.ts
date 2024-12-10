import fetch from 'node-fetch-commonjs';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import failingSignatureCert from '../fixtures/failing-signature-cert.json';
import verifiablePresentationFixture from '../fixtures/mocknet-verifiable-presentation.json';
import failingVerifiablePresentationFixture from '../fixtures/mocknet-verifiable-presentation-failing-credential.json';
import type { APIPayload } from '../../src/models/APIPayload';

describe('basic verification docker endpoint test suite', function () {
  describe('when the certificate is valid', function () {
    it('should return the expected payload', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch('http://localhost:9000/credentials/verify', {
        body: JSON.stringify({
          verifiableCredential: fixture
        } as APIPayload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());

      expect(output).toEqual({
        checks: [
          "assertProofValidity",
          "getTransactionId",
          "computeLocalHash",
          "fetchRemoteHash",
          "compareHashes",
          "checkMerkleRoot",
          "checkReceipt",
          "parseIssuerKeys",
          "checkAuthenticity",
          "checkRevokedStatus",
          "checkExpiresDate",
          "ensureValidityPeriodStarted"
        ],
        errors: [],
        id: 'urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c',
        status: 'success',
        message: {
          label: 'Verified',
          description: 'This is a valid ${chain} certificate.',
          linkText: 'View transaction link'
        }
      });
    });
  });

  describe('when the certificate is invalid', function () {
    it('should return the expected payload', async function () {
      const fixture = JSON.parse(JSON.stringify(failingSignatureCert));
      const output = await fetch('http://localhost:9000/credentials/verify', {
        body: JSON.stringify({
          verifiableCredential: fixture
        } as APIPayload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());

      expect(output).toEqual({
        checks: [
          "assertProofValidity",
          "getTransactionId",
          "computeLocalHash",
          "fetchRemoteHash"
        ],
        errors: ['compareHashes: Computed hash does not match remote hash'],
        id: 'urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c',
        status: 'failure',
        message: 'Computed hash does not match remote hash'
      });
    });
  });

  describe('when the certificate is a verifiable presentation', function () {
    describe('and it is valid', function () {
      it('should return the expected payload', async function () {
        const output = await fetch('http://localhost:9000/credentials/verify', {
          body: JSON.stringify({
            verifiableCredential: verifiablePresentationFixture as any
          } as APIPayload),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json());

        expect(output).toEqual({
          checks: [
            "assertProofValidity",
            "computeLocalHash",
            "compareHashes",
            "checkReceipt",
            "checkRevokedStatus",
            "checkExpiresDate",
            "validateDateFormat"
          ],
          errors: [],
          id: 'urn:uuid:bbba9667-8ec1-445f-82c9-a57251dd731c',
          status: 'success',
          message: {
            description: 'Mocknet credentials are used for test purposes only. They are not recorded on a blockchain, and they should not be considered verified Blockcerts.',
            label: 'This Mocknet credential passed all checks',
          }
        });
      });
    });
  });

  describe('when the certificate is a verifiable presentation', function () {
    describe('and it is not valid', function () {
      it('should return the expected payload', async function () {
        const output = await fetch('http://localhost:9000/credentials/verify', {
          body: JSON.stringify({
            verifiableCredential: failingVerifiablePresentationFixture as any
          } as APIPayload),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json());

        expect(output).toEqual({
          checks: [
            "assertProofValidity",
            "computeLocalHash",
            "compareHashes",
            "checkReceipt",
            "checkRevokedStatus",
            "checkExpiresDate",
            "validateDateFormat"
          ],
          errors: [],
          id: 'urn:uuid:bbba9667-8ec1-445f-82c9-a57251dd731c',
          status: 'failure',
          message: 'Credential with id urn:uuid:4f5f0100-ccbf-4ca9-9cfc-4f5fc3052d28 failed verification. Error: This certificate does not conform with the provided credential schema'
        });
      });
    });
  });
});
