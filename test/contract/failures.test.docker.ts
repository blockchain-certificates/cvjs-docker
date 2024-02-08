import fetch from 'node-fetch-commonjs';
import singleSignatureCert from '../fixtures/single-signature-cert.json';

describe('failure handling docker endpoint test suite', function () {
  describe('when there is a failure getting the issuer profile', function () {
    let output;

    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      fixture.issuer = 'https://this.url.leads.to.nowhere';
      output = await fetch('http://localhost:9000/verification', {
        body: JSON.stringify({
          certificate: fixture
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());
    });

    it('should return the id of the certificate', function () {
      expect(output.id).toBe('urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c');
    });

    it('should return the verification status', function () {
      expect(output.status).toBe('failure');
    });

    it('should return the specific error message', function () {
      expect(output.message).toBe('Unable to get issuer profile');
    });
  });
});
