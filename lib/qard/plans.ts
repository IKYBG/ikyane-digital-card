export type Plan = 'free' | 'pro';
export type Feature = 'advanced_themes' | 'remove_branding' | 'extended_analytics' | 'custom_domain';

const features: Record<Plan, ReadonlySet<Feature>> = {
  free: new Set(),
  pro: new Set(['advanced_themes', 'remove_branding', 'extended_analytics', 'custom_domain']),
};

export function hasFeature(plan: Plan, feature: Feature) {
  return features[plan].has(feature);
}
