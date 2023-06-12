const fetch = require('node-fetch-commonjs');
const singleSignatureCert = require('../fixtures/single-signature-cert.json');

describe('basic verification docker endpoint test suite', function () {
  it('should return the expected payload', async function () {
    const output = await fetch('http://localhost:9000/verification', {
      body: JSON.stringify({
        certificate: singleSignatureCert
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
