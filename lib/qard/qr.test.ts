import { describe, expect, it } from 'vitest';
import { contrastRatio } from './qr';

describe('contrastRatio', () => {
  it('accepte un QR noir sur blanc', () =>
    expect(contrastRatio('#000000', '#ffffff')).toBe(21));
  it('détecte deux couleurs trop proches', () =>
    expect(contrastRatio('#777777', '#777777')).toBe(1));
});
