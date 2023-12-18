const fetch = require('node-fetch-commonjs');
const singleSignatureCert = require('../fixtures/single-signature-cert.json');

describe('failure handling docker endpoint test suite', function () {
  describe('when there is a failure getting the issuer profile', function () {
    it('should return the correct status and error message', async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      fixture.issuer.id = 'https://this.url.leads.to.nowhere';
      const output = await fetch('http://localhost:9000/verification', {
        body: JSON.stringify({
          certificate: fixture
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());

      expect(output).toEqual({
        error: "\"Error: Unable to get issuer profile\\n    at Certificate.parseJson (/usr/src/app/node_modules/@blockcerts/cert-verifier-js/dist/verifier-node/index-2eAfsb3K.js:6874:19)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async Certificate.init (/usr/src/app/node_modules/@blockcerts/cert-verifier-js/dist/verifier-node/index-2eAfsb3K.js:6853:9)\\n    at async initCertVerifierJs (/usr/src/app/src/server.js:266:7)\\n    at async /usr/src/app/src/server.js:285:23\"",
        hasError: true,
        id: 'urn:uuid:13172c8c-efa5-49e1-9f69-a67ba6bd9937',
        status: 'failure',
        message: 'Unable to get issuer profile'
      });
    });
  });
});
