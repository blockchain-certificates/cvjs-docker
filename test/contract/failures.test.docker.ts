import fetch from 'node-fetch-commonjs';
import singleSignatureCert from '../fixtures/single-signature-cert.json';
import { ProblemDetails } from '../../src/helpers/invalid-certificate-problem-details-generator';

describe('failure handling docker endpoint test suite', function () {
  describe('when there is a failure getting the issuer profile', function () {
    let output;

    beforeAll(async function () {
      const fixture = JSON.parse(JSON.stringify(singleSignatureCert));
      fixture.issuer = 'https://this.url.leads.to.nowhere';
      output = await fetch('http://localhost:9000/credentials/verify', {
        body: JSON.stringify({
          certificate: fixture
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => res.json());
    });

    it('should return the id of the certificate', function () {
      expect(output.id).toBe('urn:uuid:bbba8553-8ec1-445f-82c9-a57251dd731c');
    });

    it('should return the verification status', function () {
      expect(output.status).toBe('failure');
    });

    it('should return the specific error message', function () {
      expect(output.message).toBe('Unable to get issuer profile');
    });
  });

  describe('/verification endpoint', function () {
    describe('when the payload is invalid', function () {
      describe('an empty string', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: ''
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('a string', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: 'certificate'
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', async function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object.');
        });
      });

      describe('a boolean', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: true
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', async function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object.');
        });
      });

      describe('a number', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: 42
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', async function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object.');
        });
      });

      describe('an array', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: ['certificate']
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', async function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object, not an array.');
        });
      });

      describe('an empty array', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: []
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', async function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object, not an array.');
        });
      });

      describe('undefined', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: undefined
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('body as an empty array', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify([]),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('null', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: null
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('an empty object', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify', {
            body: JSON.stringify({
              certificate: {}
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must not be an empty object.');
        });
      });
    });
  });

  describe('/verification/verbose endpoint', function () {
    describe('when the payload is invalid', function () {
      describe('an empty string', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: ''
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('a string', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: 'certificate'
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object.');
        });
      });

      describe('a boolean', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: true
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object.');
        });
      });

      describe('a number', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: 42
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object.');
        });
      });

      describe('an array', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: ['certificate']
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object, not an array.');
        });
      });

      describe('an empty array', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: []
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must be an object, not an array.');
        });
      });

      describe('undefined', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({}),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('body as an empty array', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify([]),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('null', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: null
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('No certificate definition provided.');
        });
      });

      describe('an empty object', function () {
        let output;

        beforeAll(async function () {
          output = await fetch('http://localhost:9000/credentials/verify/verbose', {
            body: JSON.stringify({
              certificate: {}
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }).then(async (res) => {
            const message = await res.json();
            return {
              status: res.status,
              message
            };
          });
        });

        it('should return a 400 bad request response', function () {
          expect(output.status).toBe(400);
        });

        it('should set the correct problem details title', function () {
          expect((output.message as ProblemDetails).title).toBe('Invalid certificate definition');
        });

        it('should set the correct problem details detail', function () {
          expect((output.message as ProblemDetails).detail).toBe('Certificate definition must not be an empty object.');
        });
      });
    });
  });
});
