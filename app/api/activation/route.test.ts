import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';
import { createClient } from '@/lib/supabase/server';
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
beforeEach(() => vi.clearAllMocks());
const request = () =>
  new Request(
    `http://localhost/api/activation?since=${new Date().toISOString()}`,
  );
describe('activation counts privacy', () => {
  it('rejects an anonymous request without reading profiles or events', async () => {
    const from = vi.fn();
    vi.mocked(createClient).mockResolvedValue({
      auth: { getClaims: vi.fn().mockResolvedValue({ data: null }) },
      from,
    } as never);
    expect((await GET(request())).status).toBe(401);
    expect(from).not.toHaveBeenCalled();
  });
  it('scopes every count to the current owner and the QR source', async () => {
    const eventQueries: Array<{ eq: ReturnType<typeof vi.fn> }> = [];
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi
        .fn()
        .mockResolvedValue({ data: { id: 'owned-profile' }, error: null }),
    };
    const from = vi.fn((table: string) => {
      if (table === 'qard_profiles') return profileQuery;
      const query = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockResolvedValue({ count: 1, error: null }),
      };
      eventQueries.push(query);
      return query;
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getClaims: vi
          .fn()
          .mockResolvedValue({ data: { claims: { sub: 'owner' } } }),
      },
      from,
    } as never);
    const response = await GET(request());
    expect(profileQuery.eq).toHaveBeenCalledWith('user_id', 'owner');
    expect(eventQueries).toHaveLength(2);
    for (const query of eventQueries) {
      expect(query.eq).toHaveBeenCalledWith('profile_id', 'owned-profile');
      expect(query.eq).toHaveBeenCalledWith('referrer', 'qard:qr');
    }
    expect(await response.json()).toEqual({ views: 1, contactRequests: 1 });
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });
  it('rejects invalid dates', async () => {
    expect(
      (await GET(new Request('http://localhost/api/activation?since=invalid')))
        .status,
    ).toBe(400);
    expect(createClient).not.toHaveBeenCalled();
  });
});
