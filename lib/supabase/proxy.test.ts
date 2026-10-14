import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { updateSession } from './proxy';

const { getClaims } = vi.hoisted(() => ({ getClaims: vi.fn() }));
vi.mock('@supabase/ssr', () => ({
  createServerClient: (_url: string, _key: string, options: { cookies: { setAll: (values: unknown[]) => void } }) => {
    options.cookies.setAll([{ name: 'session', value: 'refreshed', options: { httpOnly: true, path: '/' } }]);
    return { auth: { getClaims } };
  },
}));

describe('session navigation', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-key');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('redirects connected visitors home to their space and preserves refreshed cookies', async () => {
    getClaims.mockResolvedValue({ data: { claims: { sub: 'user-1' } } });
    const response = await updateSession(new NextRequest('https://qard.test/'));
    expect(response.headers.get('location')).toBe('https://qard.test/dashboard');
    expect(response.cookies.get('session')?.value).toBe('refreshed');
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('keeps the landing accessible to visitors', async () => {
    getClaims.mockResolvedValue({ data: { claims: null } });
    const response = await updateSession(new NextRequest('https://qard.test/'));
    expect(response.headers.get('location')).toBeNull();
  });

  it('does not redirect a connected user already in their space', async () => {
    getClaims.mockResolvedValue({ data: { claims: { sub: 'user-1' } } });
    const response = await updateSession(new NextRequest('https://qard.test/dashboard'));
    expect(response.headers.get('location')).toBeNull();
  });
});
