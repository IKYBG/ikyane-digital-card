import Link from 'next/link';
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
          color1: '#070a0f',
          color2: '#10243e',
          color3: '#315b8d',
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
        <div className="auth-card-frame">{children}</div>
      </section>
    </main>
  );
}
