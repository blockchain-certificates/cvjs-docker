const fetch = require('node-fetch-commonjs');
const singleSignatureCert = require('../fixtures/single-signature-cert.json');
const singleSignatureCertVerifiedStepAssertion = require('../assertions/single-signature-cert-verified-steps.json');

describe('basic verification docker endpoint test suite', function () {
  let output;

  beforeAll(async function () {
    output = await fetch('http://localhost:9000/verification/verbose', {
      body: JSON.stringify({
        certificate: singleSignatureCert
      }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json());
  });

  it('should expose the id of the certificate', function () {
    expect(output.id).toBe('urn:uuid:13172c8c-efa5-49e1-9f69-a67ba6bd9937');
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

  it('should expose the blockchain(s) of the signature(s) of the certificate', function () {
    expect(output.chain).toEqual(['Bitcoin Testnet']);
  });
});
