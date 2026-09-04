export const profile = {
  name: 'Ikyane', initials: 'IK', username: '@ikyane',
  headline: 'Computer Science Student', specialty: 'Developer / AI',
  location: 'Lyon, France', school: 'EPITA',
  photo: '',
  availability: 'Open to thoughtful collaborations',
  email: 'hello@ikyane.dev', phone: '',
  url: 'https://ikyane-digital-card.brown-wand-1699.chatgpt.site/card',
  now: [
    { label: 'Building', value: 'StudyOS', detail: 'A calmer way to organize student life.' },
    { label: 'Learning', value: 'C / Linux', detail: 'Closer to the machine, one layer at a time.' },
    { label: 'Exploring', value: 'Applied AI', detail: 'Small, useful systems over loud demos.' },
  ],
  projects: [
    { name: 'StudyOS', index: '01', description: 'A focused operating system for coursework, notes, and momentum.', tags: ['Product', 'TypeScript'], href: '#studyos', tone: 'lime' },
    { name: 'Signal', index: '02', description: 'A lightweight experiment in turning noisy inputs into clear decisions.', tags: ['AI', 'Interface'], href: '#signal', tone: 'violet' },
  ],
  links: [
    { label: 'GitHub', handle: 'ikyane', href: 'https://github.com/ikyane' },
    { label: 'LinkedIn', handle: 'Ikyane', href: 'https://www.linkedin.com' },
    { label: 'Discord', handle: '@ikyane', href: 'https://discord.com' },
    { label: 'Instagram', handle: '@ikyane', href: 'https://instagram.com/ikyane' },
    { label: 'Spotify', handle: 'Listening now', href: 'https://open.spotify.com' },
    { label: 'Portfolio', handle: 'Selected work', href: 'https://ikyane.dev' },
  ],
} as const;

export type Profile = typeof profile;
