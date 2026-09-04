import type { Profile } from '@/data/profile';

const escapeValue = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

export function createVCard(profile: Profile) {
  return [
    'BEGIN:VCARD', 'VERSION:3.0', `FN:${escapeValue(profile.name)}`,
    `N:${escapeValue(profile.name)};;;;`,
    `TITLE:${escapeValue(`${profile.headline} · ${profile.level}`)}`,
    `ORG:${escapeValue(profile.school)}`, `EMAIL;TYPE=INTERNET:${escapeValue(profile.email)}`,
    profile.phone ? `TEL;TYPE=CELL:${escapeValue(profile.phone)}` : null,
    `URL:${escapeValue(profile.url)}`, `ADR;TYPE=WORK:;;;${escapeValue(profile.location)};;;`, 'END:VCARD',
  ].filter(Boolean).join('\r\n');
}

export function downloadVCard(profile: Profile) {
  const blob = new Blob([createVCard(profile)], { type: 'text/vcard;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href; link.download = `${profile.name.toLowerCase()}.vcf`;
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(href);
}
