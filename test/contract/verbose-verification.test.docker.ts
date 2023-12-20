import fetch from 'node-fetch-commonjs';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import singleSignatureCertVerifiedStepAssertion from '../assertions/single-signature-cert-verified-steps.json';
import failingSignatureCert from '../fixtures/failing-signature-cert.json';
import failingSignatureCertVerifiedStepAssertion from '../assertions/failing-signature-cert-verified-steps.json';

describe('verbose verification docker endpoint test suite', function () {
  let output;

  describe('given the certificate is valid', function () {
    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      output = await fetch('http://localhost:9000/verification/verbose', {
        body: JSON.stringify({
          certificate: fixture
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(async (res) => await res.json());
    });

    afterAll(function () {
      output = null;
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
        // eslint-disable-next-line no-template-curly-in-string
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
          signingDate: '2022-04-05T13:43:10.870521',
          signatureSuiteType: 'MerkleProof2019',
          issuerPublicKey: 'mgdWjvq4RYAAP5goUNagTRMx7Xw534S5am',
          issuerName: 'Blockcerts Organization',
          issuerProfileDomain: 'www.blockcerts.org',
          issuerProfileUrl: 'https://www.blockcerts.org/samples/3.0/issuer-blockcerts.json',
          chain: {
            code: 'testnet',
            blinkCode: 'btc',
            name: 'Bitcoin Testnet',
            signatureValue: 'bitcoinTestnet',
            transactionTemplates: {
              full: 'https://testnet.blockchain.info/tx/{transaction_id}',
              raw: 'https://testnet.blockchain.info/rawtx/{transaction_id}'
            }
          },
          transactionId: '140ee9382a5c84433b9c89a5d9fea26c47415838b5841deb0c36a8a4b9121f2e',
          transactionLink: 'https://testnet.blockchain.info/tx/140ee9382a5c84433b9c89a5d9fea26c47415838b5841deb0c36a8a4b9121f2e',
          rawTransactionLink: 'https://testnet.blockchain.info/rawtx/140ee9382a5c84433b9c89a5d9fea26c47415838b5841deb0c36a8a4b9121f2e'
        }
      ]);
    });

    it('should expose the document\'s metadata', function () {
      expect(output.metadata).toEqual({
        classOf: '2022'
      });
    });
  });

  describe('given the certificate is invalid', function () {
    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(failingSignatureCert));
      output = await fetch('http://localhost:9000/verification/verbose', {
        body: JSON.stringify({
          certificate: fixture
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(async (res) => await res.json());
    });

    afterAll(function () {
      output = null;
    });

    it('should expose the id of the certificate', function () {
      expect(output.id).toBe('13172c8c-efa5-49e1-9f69-a67ba6bd9937');
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
      expect(output.issuanceDate).toBe('2022-02-02T15:00:00Z');
    });

    it('should expose the signers\' information', function () {
      expect(output.signers).toEqual([
        {
          signingDate: '2022-03-08T12:20:39.213837',
          signatureSuiteType: 'MerkleProof2019',
          issuerPublicKey: 'mgdWjvq4RYAAP5goUNagTRMx7Xw534S5am',
          issuerName: 'Blockcerts Organization',
          issuerProfileDomain: 'www.blockcerts.org',
          issuerProfileUrl: 'https://www.blockcerts.org/samples/3.0/issuer-blockcerts.json',
          chain: {
            code: 'testnet',
            blinkCode: 'btc',
            name: 'Bitcoin Testnet',
            signatureValue: 'bitcoinTestnet',
            transactionTemplates: {
              full: 'https://testnet.blockchain.info/tx/{transaction_id}',
              raw: 'https://testnet.blockchain.info/rawtx/{transaction_id}'
            }
          },
          transactionId: '3315506b4fcc1fd297c3314ff8c406a4eabfd2108ba1563bbad4488ce53775d0',
          transactionLink: 'https://testnet.blockchain.info/tx/3315506b4fcc1fd297c3314ff8c406a4eabfd2108ba1563bbad4488ce53775d0',
          rawTransactionLink: 'https://testnet.blockchain.info/rawtx/3315506b4fcc1fd297c3314ff8c406a4eabfd2108ba1563bbad4488ce53775d0'
        }
      ]);
    });

    it('should expose the document\'s metadata', function () {
      expect(output.metadata).toEqual({
        classOf: '2022'
      });
    });
  });
});
