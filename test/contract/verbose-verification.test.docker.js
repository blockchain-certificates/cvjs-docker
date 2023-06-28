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

  it('should expose the issuance date of the certificate in the response', function () {
    expect(output.issuanceDate).toBe('2022-02-02T15:00:00Z');
  });

  it('should expose the signers\' information', function () {
    expect(output.signers).toEqual([
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
    expect(output.metadata).toEqual({});
  });
});
