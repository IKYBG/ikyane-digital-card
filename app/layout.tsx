import type { Metadata, Viewport } from 'next';
import './globals.css';
import './studio.css';
import './experience.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Qard — Une nouvelle façon de se présenter',
    template: '%s | Qard',
  },
  description: 'Crée ta carte de contact numérique et partage-la en un scan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Aller au contenu
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
