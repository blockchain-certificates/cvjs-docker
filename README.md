## building the image

```shell
    docker build . -t cert-verifier-js ## or whatever name
```

## running the image
```shell
    docker run -p 9000:4000 -d cert-verifier-js ## 9000 or whatever local machine port
```

## example call (outputs expected API data)
```shell
    curl -i localhost:9000
```

## `/verification` endpoint

A basic endpoint that gives the verification status of a certificate.

*Request*:

```javascript
    const verificationStatus = await fetch('http://localhost:9000/verification', {
        body: JSON.stringify({
            certificate: blockcerts
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json());
```

*Response*:

```json
{
  "id": "https://blockcerts.learningmachine.com/certificate/ab56912734bb5784bced00b7e0e82ac9",
  "status": "success",
  "message": {
    "label": "Verified",
    "description": "This is a valid ${chain} certificate.",
    "linkText": "View transaction link"
  }
}
```

## `/verification/verbose` endpoint

This endpoints provides the `verificationSteps` object, which is an array detailing the various verification steps taken
and their status.

*Request*: 

```javascript
  const verificationStatus = await fetch('http://localhost:9000/verification/verbose', {
        body: JSON.stringify({
            certificate: blockcerts
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json());
```

*Response*:

```json
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
```
