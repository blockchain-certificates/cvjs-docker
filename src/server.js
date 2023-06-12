const express = require('express');
const bodyParser = require('body-parser');
const verboseVerification = require('./middlewares/verbose-verification');
const basicVerification = require('./middlewares/verbose-verification');

const server = express();
server.use(bodyParser.json({ limit: '5mb' }));

const port = 4000;

server.get('/', (req, res) => {
  res.send(`Cert-verifier-js server is running. 
  
  ** POST to /verification endpoint to verify your blockcerts.
    - expected request payload: 
    
    {
      body: JSON.stringify({
        certificate // blockcerts document, only one document at a time
      }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
    
    - example response payload:
    
    {
      "id": "https://blockcerts.learningmachine.com/certificate/ab56912734bb5784bced00b7e0e82ac9",
      "status": "success",
      "message": {
        "label": "Verified",
        "description": "This is a valid \${chain} certificate.",
        "linkText": "View transaction link"
      }
    }
  
  ** POST to /verification/verbose endpoint to verify your blockcerts and get a detailed verification process information.
    - expected request payload: 
    
    {
      body: JSON.stringify({
        certificate // blockcerts document, only one document at a time
      }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
    
    - example response payload:
    {
      "id": "https://blockcerts.learningmachine.com/certificate/ab56912734bb5784bced00b7e0e82ac9",
      "status": "success",
      "message": {
        "label": "Verified",
        "description": "This is a valid ${chain} certificate.",
        "linkText": "View transaction link"
      },
      "verificationSteps": [
        {
          "code": "proofVerification",
          "label": "Proof Verification",
          "labelPending": "Verifying Proof",
          "subSteps": [],
          "suites": [
            {
              "proofType": "MerkleProof2017",
              "subSteps": [
                {
                  "code": "getTransactionId",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Getting transaction ID"
                },
                {
                  "code": "computeLocalHash",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Computing local hash"
                },
                {
                  "code": "fetchRemoteHash",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Fetching remote hash"
                },
                {
                  "code": "compareHashes",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Comparing hashes"
                },
                {
                  "code": "checkMerkleRoot",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Checking Merkle Root"
                },
                {
                  "code": "checkReceipt",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Checking Receipt"
                },
                {
                  "code": "parseIssuerKeys",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Parsing issuer keys"
                },
                {
                  "code": "checkAuthenticity",
                  "status": "success",
                  "parentStep": "proofVerification",
                  "label": "Checking Authenticity"
                }
              ]
            }
          ],
          "isLast": false,
          "status": "success"
        },
        {
          "code": "statusCheck",
          "label": "Status check",
          "labelPending": "Checking record status",
          "subSteps": [
            {
              "code": "checkRevokedStatus",
              "status": "success",
              "parentStep": "statusCheck",
              "label": "Checking Revoked Status"
            },
            {
              "code": "checkExpiresDate",
              "status": "success",
              "parentStep": "statusCheck",
              "label": "Checking Expiration Date"
            }
          ],
          "isLast": true,
          "status": "success"
        }
      ]
    }
    
  `);
});

server.post('/verification', async (req, res) => {
  await basicVerification(req, res);
});
server.post('/verification/verbose', async (req, res) => {
  await verboseVerification(req, res);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
