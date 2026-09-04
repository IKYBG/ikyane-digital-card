const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ikyane-digital-card.brown-wand-1699.chatgpt.site').replace(/\/$/, '');

export const profile = {
  name: 'Ikyane', initials: 'IK', username: '@ikyane',
  headline: 'Étudiant en informatique', level: 'Bac + 1',
  location: 'Lyon, France', school: 'EPITA Lyon',
  photo: '',
  availability: 'Ouvert aux collaborations ambitieuses',
  email: 'ikyane.mha@gmail.com', phone: '',
  url: `${siteOrigin}/card`,
  now: [
    { label: 'Je développe', value: 'StudyOS', detail: 'Une façon plus sereine d’organiser la vie étudiante.' },
    { label: 'J’apprends', value: 'C / Linux', detail: 'Comprendre la machine, une couche après l’autre.' },
    { label: 'J’explore', value: 'IA appliquée', detail: 'Des systèmes utiles et précis, loin des démonstrations bruyantes.' },
  ],
  projects: [
    { name: 'StudyOS', index: '01', description: 'Un espace concentré pour les cours, les notes et la progression.', tags: ['Produit', 'TypeScript'], href: '#studyos', tone: 'lime' },
    { name: 'Signal', index: '02', description: 'Une expérimentation légère qui transforme le bruit en décisions claires.', tags: ['IA', 'Interface'], href: '#signal', tone: 'violet' },
  ],
  links: {
    discord: { username: 'skylone2.0', appUrl: 'discord://friends', webUrl: 'https://discord.com/channels/@me' },
    snapchat: { username: 'ikyane.hsb', webUrl: 'https://www.snapchat.com/add/ikyane.hsb' },
    instagram: { username: 'ikyane.hsb', webUrl: 'https://www.instagram.com/ikyane.hsb/' },
    github: { username: 'IKYBGB', webUrl: 'https://github.com/IKYBGB' },
  },
} as const;

export type Profile = typeof profile;
