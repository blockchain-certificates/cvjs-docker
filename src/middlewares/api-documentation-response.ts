import type { Request, Response } from 'express';

export default function apiDocumentationResponse (req: Request, res: Response<string>) {
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
        "id": "urn:uuid:13172c8c-efa5-49e1-9f69-a67ba6bd9937",
        "status": "success",
        "message": {
          "label": "Verified",
          "description": "This is a valid \${chain} certificate.",
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
                "proofType": "MerkleProof2019",
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
            "code": "identityVerification",
            "label": "Identity verification",
            "labelPending": "Verifying identity",
            "subSteps": [
              {
                "code": "controlVerificationMethod",
                "status": "success",
                "parentStep": "identityVerification",
                "label": "Controlling Verification Method"
              }
            ],
            "suites": [
              {
                "proofType": "MerkleProof2019",
                "subSteps": [
                  {
                    "code": "deriveIssuingAddressFromPublicKey",
                    "status": "success",
                    "parentStep": "identityVerification",
                    "label": "Deriving Issuing Address from Public Key"
                  },
                  {
                    "code": "compareIssuingAddress",
                    "status": "success",
                    "parentStep": "identityVerification",
                    "label": "Comparing addresses"
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
        ],
        "issuanceDate": "2022-02-02T15:00:00Z",
        "signers": [
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
        ],
        "metadata": {
          "schema": {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
              "displayOrder": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "certificate": {
                "order": [],
                "type": "object",
                "properties": {
                  "testText": {
                    "title": "TestText",
                    "description": "TestText",
                    "type": "string",
                    "default": ""
                  }
                }
              },
              "recipient": {
                "properties": {
                  "middlename": {
                    "title": "middlename",
                    "type": "string"
                  },
                  "city": {
                    "title": "city",
                    "type": "string"
                  },
                  "country": {
                    "title": "country",
                    "type": "string"
                  }
                }
              }
            }
          },
          "certificate": {
            "testText": ""
          },
          "recipient": {
            "middlename": "P",
            "city": "Dallas",
            "country": "United States"
          },
          "displayOrder": [
            "certificate.testText"
          ]
        }
      }
    
  `);
}
