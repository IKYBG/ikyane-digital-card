import { describe, expect, it } from 'vitest';
import { onboardingSchema } from './validation';
const form = {
  display_name: 'Camille',
  job_title: '',
  contact_type: 'email',
  contact: 'camille@example.com',
};
describe('minimal onboarding', () => {
  it('requires a useful public contact', () => {
    expect(onboardingSchema.safeParse({ ...form, contact: '' }).success).toBe(
      false,
    );
    expect(
      onboardingSchema.safeParse({ ...form, contact: 'invalid' }).success,
    ).toBe(false);
    expect(onboardingSchema.safeParse(form).success).toBe(true);
  });
  it('accepts a phone number but rejects text or an overlong number', () => {
    expect(
      onboardingSchema.safeParse({
        ...form,
        contact_type: 'phone',
        contact: '+33 6 12 34 56 78',
      }).success,
    ).toBe(true);
    expect(
      onboardingSchema.safeParse({
        ...form,
        contact_type: 'phone',
        contact: 'call me',
      }).success,
    ).toBe(false);
    expect(
      onboardingSchema.safeParse({
        ...form,
        contact_type: 'phone',
        contact: '1'.repeat(20),
      }).success,
    ).toBe(false);
  });
});
