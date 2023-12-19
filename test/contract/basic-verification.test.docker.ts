import fetch from 'node-fetch-commonjs';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import failingSignatureCert from '../fixtures/failing-signature-cert.json';

describe('basic verification docker endpoint test suite', function () {
  describe('when the certificate is valid', function () {
    it('should return the expected payload', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      const output = await fetch('http://localhost:9000/verification', {
        body: JSON.stringify({
          certificate: fixture
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());

      expect(output).toEqual({
        id: 'urn:uuid:13172c8c-efa5-49e1-9f69-a67ba6bd9937',
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
      const output = await fetch('http://localhost:9000/verification', {
        body: JSON.stringify({
          certificate: fixture
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());

      expect(output).toEqual({
        id: '13172c8c-efa5-49e1-9f69-a67ba6bd9937',
        status: 'failure',
        message: 'Computed hash does not match remote hash'
      });
    });
  });
});
