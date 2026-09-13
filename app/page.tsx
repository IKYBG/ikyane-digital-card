import Image from 'next/image';
import Link from 'next/link';
import {
  AtSign,
  Eye,
  Link2,
  Mail,
  MousePointerClick,
  Palette,
  PencilLine,
  Phone,
  QrCode,
} from 'lucide-react';
import { LandingJourney } from '@/components/qard/LandingJourney';
import { LandingQardDemo } from '@/components/qard/LandingQardDemo';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';
import AnimatedGradient from '@/components/ui/animated-gradient';
import styles from './landing.module.css';

const features = [
  { title: 'Un lien pour tout', text: 'Vos contacts, sans application.', visual: 'links' },
  { title: 'Toujours modifiable', text: 'Le lien et le QR restent identiques.', visual: 'update' },
  { title: 'À votre image', text: 'Une identité qui vous ressemble.', visual: 'style' },
  { title: 'Mesurez l’intérêt', text: 'Vues et clics, en un regard.', visual: 'stats' },
];

function CardSample() {
  return (
    <figure className={styles.productStage} aria-label="Démonstration interactive d’une Qard tenue en main">
      <figcaption className={styles.demoLabel}>Démonstration réelle <span>Touchez la carte</span></figcaption>
      <div className={styles.handStage}>
        <Image
          className={styles.handPhone}
          src="/qard-hand-phone.png"
          width={1024}
          height={1536}
          alt="Une main tenant un téléphone affichant une Qard"
          sizes="(max-width: 680px) 620px, (max-width: 1050px) 680px, 720px"
          priority
        />
        <div className={styles.screenOverlay}>
          <div className={styles.phoneChrome} aria-hidden="true"><i /><span>myqard.vercel.app</span><i /></div>
          <div className={styles.cardViewport}>
            <div className={`${styles.qardDemo} landing-demo-card`}><LandingQardDemo /></div>
          </div>
        </div>
      </div>
      <div className={styles.qrNote}>
        <Image src="/ikyane-qr.png" width={68} height={68} alt="QR code d’exemple" sizes="68px" />
        <span><strong>Scannez</strong><small>La carte s’ouvre dans le navigateur</small></span>
      </div>
    </figure>
  );
}

function FeatureVisual({ type }: { type: string }) {
  if (type === 'links') {
    return <div className={`${styles.featureVisual} ${styles.linkVisual}`} aria-hidden="true"><div className={styles.linkHub}><Link2 size={28} /></div><span><Mail size={20} /></span><span><Phone size={20} /></span><span><AtSign size={20} /></span></div>;
  }
  if (type === 'update') {
    return <div className={`${styles.featureVisual} ${styles.updateVisual}`} aria-hidden="true"><div className={styles.editCard}><i /><i /><i /></div><PencilLine size={25} /><div className={styles.permanentQr}><QrCode size={58} /></div></div>;
  }
  if (type === 'style') {
    return <div className={`${styles.featureVisual} ${styles.styleVisual}`} aria-hidden="true"><Palette size={24} /><i /><i /><i /></div>;
  }
  return (
    <div className={`${styles.featureVisual} ${styles.statsVisual}`} aria-hidden="true">
      <div><Eye size={20} /><strong>1 284</strong></div>
      <div><MousePointerClick size={20} /><strong>327</strong></div>
      <span><i /><i /><i /><i /><i /><i /><i /></span>
    </div>
  );
}

export default function Home() {
  return (
    <main className={`qard-site ${styles.site}`}>
      <AnimatedGradient
        className={styles.landingBackground}
        config={{ color1: '#fffaf2', color2: '#f4d8c0', color3: '#efa173' }}
        noise={{ opacity: 0.025, scale: 1.3 }}
      />
      <MarketingNav />
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Qard / carte de contact numérique</span>
          <h1>Vos coordonnées. Une seule carte.</h1>
          <p className={styles.heroLead}>Rassemblez ce qui permet de vous joindre, personnalisez votre profil et partagez-le par lien ou QR code.</p>
          <div className={styles.actions}><Link className={styles.primary} href="/signup" prefetch={false}>Créer ma Qard</Link><Link className={styles.secondary} href="/card" prefetch={false}>Ouvrir l’exemple</Link></div>
          <dl className={styles.proof}><div><dt>1</dt><dd>lien permanent</dd></div><div><dt>0</dt><dd>application requise</dd></div><div><dt>∞</dt><dd>mises à jour</dd></div></dl>
        </div>
        <CardSample />
      </section>

      <section className={styles.manifesto}>
        <span>Une présence facile à retrouver</span>
        <h2>La bonne information reste à portée de main.</h2>
        <p>Votre activité évolue, vos coordonnées aussi. Vous les modifiez une fois ; les personnes qui possèdent votre lien retrouvent toujours la version actuelle.</p>
      </section>

      <section className={styles.process} id="fonctionnement">
        <header className={styles.sectionHeader}><span>Comment ça fonctionne</span><h2>Créez. Partagez. Restez joignable.</h2></header>
        <LandingJourney />
      </section>

      <section className={styles.features}>
        <header className={styles.sectionHeader}><span>Au quotidien</span><h2>Une carte utile après le premier partage.</h2></header>
        <div className={styles.featureGrid}>
          {features.map(({ title, text, visual }) => <article key={title}><div className={styles.featureCopy}><h3>{title}</h3><p>{text}</p></div><FeatureVisual type={visual} /></article>)}
        </div>
      </section>

      <section className={styles.finalCta}><div><span>Votre Qard peut être prête aujourd’hui.</span><h2>Commencez par l’essentiel.</h2></div><Link className={styles.primary} href="/signup" prefetch={false}>Créer ma Qard gratuitement</Link></section>
      <footer className={styles.footer}><QardLogo /><p>© 2026 Qard</p><nav><Link href="/privacy" prefetch={false}>Confidentialité</Link><Link href="/terms" prefetch={false}>Conditions</Link></nav></footer>
    </main>
  );
}
