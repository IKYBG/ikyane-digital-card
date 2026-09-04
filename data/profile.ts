export const profile = {
  name: 'Ikyane', initials: 'IK', username: '@ikyane',
  headline: 'Étudiant en informatique', specialty: 'Développeur · IA',
  location: 'Lyon, France', school: 'EPITA',
  photo: '',
  availability: 'Ouvert aux collaborations ambitieuses',
  email: 'hello@ikyane.dev', phone: '',
  url: 'https://ikyane-digital-card.brown-wand-1699.chatgpt.site/card',
  now: [
    { label: 'Je développe', value: 'StudyOS', detail: 'Une façon plus sereine d’organiser la vie étudiante.' },
    { label: 'J’apprends', value: 'C / Linux', detail: 'Comprendre la machine, une couche après l’autre.' },
    { label: 'J’explore', value: 'IA appliquée', detail: 'Des systèmes utiles et précis, loin des démonstrations bruyantes.' },
  ],
  projects: [
    { name: 'StudyOS', index: '01', description: 'Un espace concentré pour les cours, les notes et la progression.', tags: ['Produit', 'TypeScript'], href: '#studyos', tone: 'lime' },
    { name: 'Signal', index: '02', description: 'Une expérimentation légère qui transforme le bruit en décisions claires.', tags: ['IA', 'Interface'], href: '#signal', tone: 'violet' },
  ],
  links: [
    { label: 'GitHub', handle: 'ikyane', href: 'https://github.com/ikyane' },
    { label: 'LinkedIn', handle: 'Ikyane', href: 'https://www.linkedin.com' },
    { label: 'Discord', handle: '@ikyane', href: 'https://discord.com' },
    { label: 'Instagram', handle: '@ikyane', href: 'https://instagram.com/ikyane' },
    { label: 'Spotify', handle: 'À l’écoute', href: 'https://open.spotify.com' },
    { label: 'Portfolio', handle: 'Projets choisis', href: 'https://ikyane.dev' },
  ],
} as const;

export type Profile = typeof profile;
