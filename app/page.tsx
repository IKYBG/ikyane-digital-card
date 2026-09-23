import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  Eye,
  Link2,
  MousePointerClick,
  Palette,
  PencilLine,
  Plus,
  Zap,
} from 'lucide-react';
import { LandingJourney } from '@/components/qard/LandingJourney';
import { ContactConvergenceHero } from '@/components/qard/ContactConvergenceHero';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';
import { SocialIcon } from '@/components/qard/SocialIcon';
import AnimatedGradient from '@/components/ui/animated-gradient';
import styles from './landing.module.css';

const features = [
  {
    title: 'Un lien pour tout',
    text: 'Vos contacts, sans application.',
    visual: 'links',
  },
  {
    title: 'Modifiez en quelques secondes',
    text: 'Le lien et le QR restent identiques.',
    visual: 'update',
  },
  {
    title: 'À votre image',
    text: 'Une identité qui vous ressemble.',
    visual: 'style',
  },
  {
    title: 'Mesurez l’intérêt',
    text: 'Vues et clics, en un regard.',
    visual: 'stats',
  },
];

function FeatureVisual({ type }: { type: string }) {
  if (type === 'links') {
    return (
      <div
        className={`${styles.featureVisual} ${styles.linkVisual}`}
        aria-hidden="true"
      >
        <div className={styles.linkHub}>
          <Link2 size={28} />
        </div>
        <div className={styles.networkOrbit}>
          {[
            'instagram',
            'snapchat',
            'discord',
            'tiktok',
            'github',
            'linkedin',
          ].map((platform, index) => (
            <span
              key={platform}
              style={{ '--network-index': index } as CSSProperties}
            >
              <SocialIcon platform={platform} size={21} />
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (type === 'update') {
    return (
      <div
        className={`${styles.featureVisual} ${styles.updateVisual}`}
        aria-hidden="true"
      >
        <div className={styles.cardTrail}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.liveEditCard}>
          <span />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.quickTools}>
          <span>
            <Plus size={20} />
          </span>
          <span>
            <PencilLine size={20} />
          </span>
          <span>
            <Zap size={20} />
          </span>
        </div>
      </div>
    );
  }
  if (type === 'style') {
    return (
      <div
        className={`${styles.featureVisual} ${styles.styleVisual}`}
        aria-hidden="true"
      >
        <Palette size={24} />
        <i />
        <i />
        <i />
      </div>
    );
  }
  return (
    <div
      className={`${styles.featureVisual} ${styles.statsVisual}`}
      aria-hidden="true"
    >
      <div>
        <Eye size={20} />
        <strong>
          <span>1 284</span>
          <span>1 319</span>
        </strong>
      </div>
      <div>
        <MousePointerClick size={20} />
        <strong>
          <span>327</span>
          <span>341</span>
        </strong>
      </div>
      <span>
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className={`qard-site ${styles.site}`}>
      <AnimatedGradient
        className={styles.landingBackground}
        config={{ color1: '#f8fbff', color2: '#dfe8ff', color3: '#e9e1ff' }}
        noise={{ opacity: 0.025, scale: 1.3 }}
      />
      <MarketingNav />
      <ContactConvergenceHero />

      <section className={styles.process} id="fonctionnement">
        <header className={styles.sectionHeader}>
          <span>Comment ça fonctionne</span>
          <h2>Créez votre Qard. Partagez-la en un geste.</h2>
        </header>
        <LandingJourney />
      </section>

      <section className={styles.features}>
        <header className={styles.sectionHeader}>
          <span>Vos avantages</span>
          <h2>Un lien qui travaille pour vous.</h2>
        </header>
        <div className={styles.featureGrid}>
          {features.map(({ title, text, visual }) => (
            <article key={title}>
              <div className={styles.featureCopy}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <FeatureVisual type={visual} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <span>Quelques minutes suffisent.</span>
          <h2>Soyez plus facile à contacter dès aujourd’hui.</h2>
        </div>
        <Link className={styles.primary} href="/signup" prefetch={false}>
          Créer ma Qard gratuitement
        </Link>
      </section>
      <footer className={styles.footer}>
        <QardLogo />
        <p>© 2026 Qard</p>
        <nav>
          <Link href="/privacy" prefetch={false}>
            Confidentialité
          </Link>
          <Link href="/terms" prefetch={false}>
            Conditions
          </Link>
        </nav>
      </footer>
    </main>
  );
}
