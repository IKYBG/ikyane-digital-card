import { describe, expect, it } from 'vitest';
import { getPublicProfileUrl } from './url';
describe('getPublicProfileUrl', () => {
  it('construit une route multi-tenant', () =>
    expect(getPublicProfileUrl('lucas')).toMatch(/\/u\/lucas$/));
  it('encode le segment', () =>
    expect(getPublicProfileUrl('lucas_test')).toContain('/u/lucas_test'));
});
