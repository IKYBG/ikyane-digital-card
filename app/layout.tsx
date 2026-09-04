import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ikyane — Digital Identity',
  description:
    'Étudiant en informatique en Bac +1 à EPITA Lyon.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
