const express = require('express');
const bodyParser = require('body-parser');
const verboseVerification = require('./middlewares/verbose-verification');
const basicVerification = require('./middlewares/basic-verification');
const apiDocumentationResponse = require('./middlewares/api-documentation-response');
const certVerifierJs = require('@blockcerts/cert-verifier-js/dist/verifier-node');
const { Certificate, VERIFICATION_STATUSES } = certVerifierJs;

const server = express();
server.use(bodyParser.json({ limit: '5mb' }));

const port = 4000;

server.get('/', (req, res) => {
  apiDocumentationResponse(req, res);
});

async function initCertVerifierJs (req) {
  if (req.body.certificate) {
    const certData = req.body.certificate;
    try {
      const certificate = new Certificate(certData);
      await certificate.init();
      return certificate;
    } catch (e) {
      console.log('An error occurred while initializing the verification library:');
      console.error(e);
      return {
        hasError: true,
        message: e.message,
        error: JSON.stringify(e.stack, null, 2),
        status: VERIFICATION_STATUSES.FAILURE
      }
    }
  }

  return null;
}

server.post('/verification', async (req, res) => {
  console.log('calling basic verification endpoint');
  const certificate = await initCertVerifierJs(req);
  if (certificate == null) {
    return;
  }

  if (certificate.hasError) {
    return res.json({
      id: req.body.certificate.id,
      ...certificate
    });
  }

  await basicVerification(req, res, certificate);
});
server.post('/verification/verbose', async (req, res) => {
  console.log('calling verbose verification endpoint');
  const certificate = await initCertVerifierJs(req);
  if (certificate == null) {
    return;
  }

  if (certificate.hasError) {
    return res.json({
      id: req.body.certificate.id,
      ...certificate
    });
  }

  await verboseVerification(req, res, certificate);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
