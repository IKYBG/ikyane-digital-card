import Link from 'next/link';
import { Check, Link2, QrCode, UserRound } from 'lucide-react';
import { QardLogo } from '@/components/qard/QardLogo';
import AnimatedGradient from '@/components/ui/animated-gradient';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="qard-site auth-shell auth-shell-v2">
      <AnimatedGradient
        className="auth-animated-bg"
        config={{
          color1: '#f8fbff',
          color2: '#dce7ff',
          color3: '#e9e0ff',
          speed: 28,
          distortion: 3,
          swirl: 13,
          swirlIterations: 2,
          softness: 94,
          shape: 'Edge',
          shapeSize: 64,
        }}
        noise={{ opacity: 0.02 }}
        style={{ position: 'fixed', zIndex: 0 }}
      />
      <div className="auth-background-veil" aria-hidden="true" />
      <header>
        <QardLogo />
        <Link href="/">Retour à l’accueil</Link>
      </header>
      <section>
        <aside className="auth-product-panel" aria-label="Aperçu d’une Qard">
          <div className="auth-product-copy">
            <span>Votre identité numérique</span>
            <h1>Un lien simple. Une présence claire.</h1>
            <p>Créez, personnalisez et partagez votre Qard depuis un seul espace.</p>
          </div>
          <div className="auth-mini-qard" aria-hidden="true">
            <div className="auth-mini-banner"><b>Qard</b><small>Des gens<br />Des projets<br />Un monde plus ouvert</small></div>
            <div className="auth-mini-body">
              <span className="auth-mini-avatar"><UserRound size={34} /></span>
              <strong>Votre nom <i><Check size={11} /></i></strong>
              <small>Votre activité</small>
              <div><Link2 size={15} /> Tous vos contacts</div>
              <button type="button">Entrer en contact</button>
            </div>
            <span className="auth-mini-qr"><QrCode size={34} /></span>
          </div>
        </aside>
        <div className="auth-card-frame">{children}</div>
      </section>
    </main>
  );
}
