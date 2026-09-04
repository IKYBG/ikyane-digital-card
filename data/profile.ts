export const profile = {
  name: 'Ikyane', initials: 'IK', username: '@ikyane',
  headline: 'Étudiant en informatique', level: 'Bac + 1',
  location: 'Lyon, France', school: 'EPITA Lyon',
  photo: '',
  availability: 'Ouvert aux collaborations ambitieuses',
  email: 'ikyane.mha@gmail.com', phone: '0638174716',
  url: '/card',
  journey: [
    { label: 'École primaire', value: 'École Croix-Luizet', detail: 'Villeurbanne' },
    { label: 'Collège', value: 'Collège Jean-Macé', detail: 'Villeurbanne' },
    { label: 'Lycée', value: 'Lycée Édouard-Herriot', detail: 'Lyon' },
    { label: 'Enseignement supérieur', value: 'EPITA', detail: 'Lyon · Informatique' },
  ],
  now: [
    { label: 'Sport', value: 'Musculation & judo', detail: 'En salle et en club.' },
    { label: 'Création', value: 'Design & expérimentation', detail: 'Photoshop, motion design et vibe coding.' },
    { label: 'Langue', value: 'Japonais', detail: 'Une langue que j’apprends progressivement.' },
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
    tiktok: { username: 'ikyane_prvv', webUrl: 'https://www.tiktok.com/@ikyane_prvv' },
  },
} as const;

export type Profile = typeof profile;
