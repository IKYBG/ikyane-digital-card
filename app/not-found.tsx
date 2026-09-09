import Link from 'next/link';
import { QardLogo } from '@/components/qard/QardLogo';
export default function NotFound() {
  return (
    <main className="qard-site global-error">
      <QardLogo />
      <span>404</span>
      <h1>Cette page n’existe pas.</h1>
      <p>La rencontre a peut-être changé d’adresse.</p>
      <Link className="button" href="/">
        Retour à Qard
      </Link>
    </main>
  );
}
