import type { Profile, SocialLink } from '@/types/database';
import { getContactLinks } from './contacts';

const escape = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

// RFC 2426: fold long content lines without splitting a UTF-8 character.
function fold(line: string) {
  const encoder = new TextEncoder();
  let result = '',
    bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) {
      result += '\r\n ';
      bytes = 1;
    }
    result += char;
    bytes += size;
  }
  return result;
}

export function createVCard(
  profile: Profile,
  links: SocialLink[] = [],
  profileUrl?: string,
) {
  const contacts = getContactLinks(profile, links);
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escape(profile.display_name)}`,
    `N:${escape(profile.last_name ?? '')};${escape(profile.first_name || (!profile.last_name ? profile.display_name : ''))};;;`,
  ];
  for (const contact of contacts) {
    if (contact.platform === 'phone')
      lines.push(`TEL;TYPE=CELL:${escape(contact.url.replace(/^tel:/, ''))}`);
    else if (contact.platform === 'email')
      lines.push(
        `EMAIL;TYPE=INTERNET:${escape(contact.url.replace(/^mailto:/, '').split('?')[0])}`,
      );
    else lines.push(`URL:${escape(contact.url)}`);
  }
  if (profile.company) lines.push(`ORG:${escape(profile.company)}`);
  if (profile.job_title || profile.headline)
    lines.push(`TITLE:${escape(profile.job_title || profile.headline || '')}`);
  if (profileUrl && !contacts.some((link) => link.url === profileUrl))
    lines.push(`URL:${escape(profileUrl)}`);
  lines.push('END:VCARD');
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
