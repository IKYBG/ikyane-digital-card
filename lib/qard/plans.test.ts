import { describe, expect, it } from 'vitest';
import { hasFeature } from './plans';
describe('hasFeature', () => {
  it('limite correctement Free', () =>
    expect(hasFeature('free', 'remove_branding')).toBe(false));
  it('active les fonctions Pro', () =>
    expect(hasFeature('pro', 'extended_analytics')).toBe(true));
});
