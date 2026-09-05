import { describe, expect, it } from 'vitest';
import { slugSchema } from './validation';
describe('slugSchema', () => { it('normalise un slug valide', () => expect(slugSchema.parse('Lucas_01')).toBe('lucas_01')); it('refuse les routes réservées', () => expect(() => slugSchema.parse('dashboard')).toThrow()); it('refuse les caractères non sûrs', () => expect(() => slugSchema.parse('lucas martin')).toThrow()); });
