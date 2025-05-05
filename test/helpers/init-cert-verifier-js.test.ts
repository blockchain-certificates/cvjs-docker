import { describe, expect, it, beforeAll } from 'vitest';
import { APIPayload } from '../../src/models/APIPayload';
import fixture from '../fixtures/single-signature-cert.json';
import initCertVerifierJs from '../../src/helpers/init-cert-verifier-js';
import type { CertificateInitSuccess } from '../../src/helpers/init-cert-verifier-js';
import type { Request } from 'express';

describe('initCertVerifierJs test suite', function () {
  describe('locale option', function () {
    describe('when the locale is set as an option in the request', function () {
      it('should pass the information to the CVJS library', async function () {
        const req: Partial<Request<unknown, unknown, APIPayload>> = {
          body: {
            verifiableCredential: fixture,
            options: {
              locale: 'fr-FR'
            }
          }
        };
        const result = await initCertVerifierJs(req as any);
        expect((result as CertificateInitSuccess).certificate.locale).toBe('fr');
      });
    });

    describe('when the locale is not set as an option in the request', function () {
      it('should use the default language', async function () {
        const req: Partial<Request<unknown, unknown, APIPayload>> = {
          body: {
            verifiableCredential: fixture
          }
        };
        const result = await initCertVerifierJs(req as any);
        expect((result as CertificateInitSuccess).certificate.locale).toBe('en-US');
      });
    });
  });
});
