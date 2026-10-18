import { describe, expect, it } from 'vitest';
import { adminAccessAllowed, isAdminPath, isAdminRequest } from './admin-guard';

const u = (s: string) => new URL(s);
const withHeader = new Headers({ 'cf-access-jwt-assertion': 'x' });
const none = new Headers();

describe('isAdminPath', () => {
  it('matches /admin and anything beneath it, nothing else', () => {
    expect(isAdminPath('/admin')).toBe(true);
    expect(isAdminPath('/admin/')).toBe(true);
    expect(isAdminPath('/admin/prospects')).toBe(true);
    expect(isAdminPath('/administrator')).toBe(false);
    expect(isAdminPath('/p')).toBe(false);
    expect(isAdminPath('/')).toBe(false);
  });

  it('matches the path the router will see, not the encoded form it arrived in', () => {
    expect(isAdminPath('/%61dmin')).toBe(true);
    expect(isAdminPath('/%61dmin/x')).toBe(true);
    expect(isAdminPath('/adm%69n')).toBe(true);
    expect(isAdminPath('/%41dmin')).toBe(false); // /Admin is not the /admin route
  });

  it('decodes once, as SvelteKit does: /%2561dmin routes to /%61dmin, which is no route', () => {
    expect(isAdminPath('/%2561dmin')).toBe(false);
  });

  it('fails closed on a malformed escape', () => {
    expect(isAdminPath('/%zz')).toBe(true);
    expect(isAdminPath('/%')).toBe(true);
  });
});

describe('adminAccessAllowed', () => {
  const AUD = 'aud-tag-from-the-access-application';

  it('admits an allowlisted host carrying the header once Access is configured', () => {
    expect(adminAccessAllowed(u('https://vancity.dev/admin'), withHeader, false, AUD)).toBe(true);
  });
  it('rejects an allowlisted host without the header', () => {
    expect(adminAccessAllowed(u('https://vancity.dev/admin'), none, false, AUD)).toBe(false);
  });
  it('rejects a forged header on any other host', () => {
    for (const host of ['vancity-dev.workers.dev', 'www.vancity.dev', '1.2.3.4', 'x.vancity.dev']) {
      expect(adminAccessAllowed(u(`https://${host}/admin`), withHeader, false, AUD)).toBe(false);
    }
  });
  it('lets everything through in dev', () => {
    expect(adminAccessAllowed(u('http://127.0.0.1:5173/admin'), none, true, undefined)).toBe(true);
  });

  // Until an Access application exists, nothing sets the header legitimately, so presence alone
  // would admit anyone who knows to send it. Fail closed instead.
  it('rejects even a correct-looking header on the apex when Access is not configured', () => {
    expect(adminAccessAllowed(u('https://vancity.dev/admin'), withHeader, false, undefined)).toBe(
      false
    );
    expect(adminAccessAllowed(u('https://vancity.dev/admin'), withHeader, false, '')).toBe(false);
  });
  it('still admits localhost without the AUD, since that is the production-build test harness', () => {
    expect(adminAccessAllowed(u('http://localhost:4173/admin'), withHeader, false, undefined)).toBe(
      true
    );
  });
});

describe('isAdminRequest', () => {
  it('guards on route.id alone, even when the pathname would not match', () => {
    expect(isAdminRequest('/something-else', '/admin')).toBe(true);
    expect(isAdminRequest('/something-else', '/admin/prospects')).toBe(true);
    expect(isAdminRequest('/', '/admin/[id]')).toBe(true);
  });
  it('guards on the decoded path alone, even when route.id is /site or null', () => {
    expect(isAdminRequest('/admin', '/site')).toBe(true); // prospect subdomain stays refused
    expect(isAdminRequest('/%61dmin', null)).toBe(true);
    expect(isAdminRequest('/%zz', undefined)).toBe(true);
  });
  it('lets non-admin requests through', () => {
    expect(isAdminRequest('/p', '/p')).toBe(false);
    expect(isAdminRequest('/', null)).toBe(false);
    expect(isAdminRequest('/administrator', '/administrator')).toBe(false);
  });
});
