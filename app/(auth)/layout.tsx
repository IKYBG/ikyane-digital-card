import Link from 'next/link';
import Image from 'next/image';
import { Link2, QrCode, ShieldCheck } from 'lucide-react';
import { QardLogo } from '@/components/qard/QardLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="qard-site auth-shell auth-shell-v2">
      <div className="auth-background-veil" aria-hidden="true" />
      <header>
        <QardLogo />
        <Link href="/">Retour à l’accueil</Link>
      </header>
      <section>
        <aside className="auth-product-panel" aria-label="Aperçu d’une Qard">
          <Image
            className="auth-product-image"
            src="/qard-prisma-campus.png"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 52vw"
          />
          <div className="auth-product-overlay" aria-hidden="true" />
          <div className="auth-product-copy">
            <span>Qard</span>
            <h1>Toutes vos coordonnées. Un seul geste.</h1>
            <p>
              Votre carte de contact reste à jour, même après l’avoir partagée.
            </p>
          </div>
          <div className="auth-benefits" aria-hidden="true">
            <span>
              <Link2 size={18} /> Lien permanent
            </span>
            <span>
              <QrCode size={18} /> QR prêt à partager
            </span>
            <span>
              <ShieldCheck size={18} /> Données maîtrisées
            </span>
          </div>
          <div className="auth-live-pill" aria-hidden="true">
            <i /> Toujours à jour
          </div>
        </aside>
        <div className="auth-card-frame">{children}</div>
      </section>
    </main>
  );
}
