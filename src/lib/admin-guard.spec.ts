import { describe, expect, it } from 'vitest';
import { adminAccessAllowed, isAdminPath } from './admin-guard';

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
  it('admits an allowlisted host carrying the header', () => {
    expect(adminAccessAllowed(u('https://vancity.dev/admin'), withHeader, false)).toBe(true);
  });
  it('rejects an allowlisted host without the header', () => {
    expect(adminAccessAllowed(u('https://vancity.dev/admin'), none, false)).toBe(false);
  });
  it('rejects a forged header on any other host', () => {
    for (const host of ['vancity-dev.workers.dev', 'www.vancity.dev', '1.2.3.4', 'x.vancity.dev']) {
      expect(adminAccessAllowed(u(`https://${host}/admin`), withHeader, false)).toBe(false);
    }
  });
  it('lets everything through in dev', () => {
    expect(adminAccessAllowed(u('http://127.0.0.1:5173/admin'), none, true)).toBe(true);
  });
});
