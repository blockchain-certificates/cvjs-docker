const express = require('express');
const bodyParser = require('body-parser');
const certVerifierJs = require('@blockcerts/cert-verifier-js/dist/verifier-node');

const server = express();
server.use(bodyParser.json({ limit: '5mb' }));

const port = 4000;

server.get('/', (req, res) => {
  res.send(`Cert-verifier-js server is running. POST to /verification endpoint to verify your blockcerts.
    expected payload: 
    
    {
      body: JSON.stringify({
        certificate // blockcerts document, only one document at a time
      }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
  `);
});

server.post('/verification', async (req, res) => {
  if (req.body.certificate) {
    const certData = req.body.certificate;
    const certificate = new certVerifierJs.Certificate(certData);
    await certificate.init();
    await certificate
      .verify()
      .then(({ status, message }) => {
        console.log('Status:', status);

        if (status === 'failure') {
          console.log(`The certificate ${req.body.blockcerts.id} is not valid. Error: ${message}`);
        }

        return res.json({
          id: req.body.blockcerts.id,
          status,
          message
        });
      })
      .catch(err => {
        console.log(err);
        res.json({
          statusCode: 500,
          error: err
        });
      });
  }
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
