import fetch from 'node-fetch-commonjs';
import type { APIPayload } from '../../src/models/APIPayload';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import type { APIResponse } from '../../src/models/APIResponse';
import type { VerboseVerificationAPIResponse } from '../../src/middlewares/verbose-verification';

describe('basic verification endpoint', function () {
  const BASIC_ENDPOINT_URL = 'http://localhost:9000/credentials/verify';

  describe('when the returnCredential property is set to true', function () {
    it('should return the verified credential', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch(BASIC_ENDPOINT_URL, {
        body: JSON.stringify({
          verifiableCredential: fixture,
          options: {returnCredential: true}
        } as APIPayload),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }).then((res) => res.json());

      expect((output as APIResponse).verifiedCredential).toEqual(fixture);
    });
  });

  describe('when the returnCredential property is set to false', function () {
    it('should not return the verified credential', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch(BASIC_ENDPOINT_URL, {
        body: JSON.stringify({
          verifiableCredential: fixture,
          options: {returnCredential: false}
        } as APIPayload),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }).then((res) => res.json());

      expect((output as APIResponse).verifiedCredential).toBeUndefined();
    });
  });

  describe('when the returnCredential property is not set', function () {
    it('should not return the verified credential', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch(BASIC_ENDPOINT_URL, {
        body: JSON.stringify({
          verifiableCredential: fixture,
          options: {}
        } as APIPayload),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }).then((res) => res.json());

      expect((output as APIResponse).verifiedCredential).toBeUndefined();
    });
  });
});


describe('verbose verification endpoint', function () {
  const VERBOSE_ENDPOINT_URL = 'http://localhost:9000/credentials/verify/verbose';

  describe('when the returnCredential property is set to true', function () {
    it('should return the verified credential', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch(VERBOSE_ENDPOINT_URL, {
        body: JSON.stringify({
          verifiableCredential: fixture,
          options: {returnCredential: true}
        } as APIPayload),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }).then((res) => res.json());

      expect((output as VerboseVerificationAPIResponse).verifiedCredential).toEqual(fixture);
    });
  });

  describe('when the returnCredential property is set to false', function () {
    it('should not return the verified credential', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch(VERBOSE_ENDPOINT_URL, {
        body: JSON.stringify({
          verifiableCredential: fixture,
          options: {returnCredential: false}
        } as APIPayload),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }).then((res) => res.json());

      expect((output as VerboseVerificationAPIResponse).verifiedCredential).toBeUndefined();
    });
  });

  describe('when the returnCredential property is not set', function () {
    it('should not return the verified credential', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch(VERBOSE_ENDPOINT_URL, {
        body: JSON.stringify({
          verifiableCredential: fixture,
          options: {}
        } as APIPayload),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }).then((res) => res.json());

      expect((output as VerboseVerificationAPIResponse).verifiedCredential).toBeUndefined();
    });
  });
});
