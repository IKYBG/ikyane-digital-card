import type { Profile, SocialLink } from '@/types/database';
import { isSafePublicUrl } from './social';

export type ContactLink = Pick<
  SocialLink,
  'id' | 'platform' | 'label' | 'url' | 'username'
>;

/** Public, enabled contacts only; direct contact methods precede social networks. */
export function getContactLinks(
  profile: Profile,
  links: SocialLink[],
): ContactLink[] {
  const enabled = links.filter(
    (link) => link.enabled && isSafePublicUrl(link.platform, link.url),
  );
  const direct: ContactLink[] = [];
  const fields = [
    ['email', profile.email_public, 'Écrire', 'mailto:'],
    ['phone', profile.phone_public, 'Appeler', 'tel:'],
    ['website', profile.website, 'Voir mon site', ''],
  ] as const;
  for (const [platform, value, label, prefix] of fields) {
    if (value && isSafePublicUrl(platform, `${prefix}${value}`)) {
      direct.push({
        id: `profile-${platform}`,
        platform,
        label,
        url: `${prefix}${value}`,
        username: value,
      });
    } else {
      const link = enabled.find((item) => item.platform === platform);
      if (link) direct.push(link);
    }
  }
  const used = new Set(direct.map((link) => link.url));
  return [...direct, ...enabled.filter((link) => !used.has(link.url))];
}
