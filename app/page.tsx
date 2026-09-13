import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  AtSign,
  BarChart3,
  Check,
  Eye,
  Link2,
  Mail,
  MousePointerClick,
  Palette,
  PencilLine,
  RefreshCw,
  ScanLine,
  Share2,
  Smartphone,
  UserRound,
} from 'lucide-react';
import { LandingQardDemo } from '@/components/qard/LandingQardDemo';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';
import styles from './landing.module.css';

const steps = [
  {
    number: '01',
    title: 'Créez votre identité',
    text: 'Un nom, une photo et les moyens utiles pour vous joindre.',
  },
  {
    number: '02',
    title: 'Partagez votre Qard',
    text: 'Envoyez votre lien ou présentez votre QR code permanent.',
  },
  {
    number: '03',
    title: 'Ils accèdent à vos contacts',
    text: 'Après un scan ou un clic, votre Qard s’ouvre et vos coordonnées sont prêtes à être utilisées.',
  },
];

const features = [
  {
    icon: Link2,
    title: 'Un seul lien',
    text: 'Tous vos contacts restent accessibles sans application.',
    visual: 'links',
  },
  {
    icon: RefreshCw,
    title: 'Très facile à modifier',
    text: 'Mettez votre profil à jour en quelques secondes. Le lien et le QR ne changent pas.',
    visual: 'update',
  },
  {
    icon: Palette,
    title: 'Personnalisable',
    text: 'Une apparence cohérente avec votre personnalité ou votre activité.',
    visual: 'style',
  },
  {
    icon: BarChart3,
    title: 'Suivez les interactions',
    text: 'Suivez les vues, les clics et les moyens de contact les plus utilisés.',
    visual: 'stats',
  },
];

function CardSample() {
  return (
    <div className={styles.productStage} aria-label="Démonstration interactive d’une Qard">
      <span className={styles.liveBadge}>
        <Check size={14} /> Aperçu interactif
      </span>
      <div className={styles.phoneShell}>
        <div className={styles.phoneHardware} aria-hidden="true">
          <i /><span>9:41</span><b />
        </div>
        <div className={styles.phoneScreen}>
          <div className={`${styles.qardDemo} landing-demo-card`}>
            <LandingQardDemo />
          </div>
        </div>
        <span className={styles.phoneHome} aria-hidden="true" />
      </div>
      <p className={styles.demoHint}>Touchez ou glissez la carte pour voir les contacts.</p>
      <div className={styles.qrTicket}>
        <Image
          src="/ikyane-qr.png"
          width={72}
          height={72}
          alt="QR code d’exemple"
          sizes="72px"
        />
        <span>
          <strong>Un scan suffit</strong>
          <small>La Qard s’ouvre aussitôt</small>
        </span>
      </div>
    </div>
  );
}

function StepVisual({ number }: { number: string }) {
  if (number === '01') {
    return (
      <div className={`${styles.stepVisual} ${styles.identityVisual}`}>
        <div className={styles.miniAvatar}><UserRound size={22} /></div>
        <span><small>Nom</small><strong>Camille Morel</strong></span>
        <span><small>Contact</small><strong>camille@exemple.fr</strong></span>
      </div>
    );
  }
  if (number === '02') {
    return (
      <div className={`${styles.stepVisual} ${styles.shareVisual}`}>
        <Image src="/ikyane-qr.png" width={76} height={76} alt="" sizes="76px" />
        <span><small>Votre lien permanent</small><strong>myqard.vercel.app/u/camille</strong></span>
        <Share2 size={18} />
      </div>
    );
  }
  return (
    <div className={`${styles.stepVisual} ${styles.accessVisual}`}>
      <ScanLine size={26} />
      <div><span><Mail size={15} /> Email</span><span><Smartphone size={15} /> Appeler</span></div>
      <Check size={17} />
    </div>
  );
}

function FeatureVisual({ type }: { type: string }) {
  if (type === 'links') {
    return (
      <div className={`${styles.featureVisual} ${styles.linkVisual}`}>
        <span><Mail size={16} /> Email <Check size={14} /></span>
        <span><AtSign size={16} /> Instagram <Check size={14} /></span>
        <span><Link2 size={16} /> Portfolio <Check size={14} /></span>
      </div>
    );
  }
  if (type === 'update') {
    return (
      <div className={`${styles.featureVisual} ${styles.updateVisual}`}>
        <div><PencilLine size={17} /><span><small>Poste</small><strong>Lead Product Designer</strong></span></div>
        <p><Check size={15} /> Modification publiée</p>
      </div>
    );
  }
  if (type === 'style') {
    return (
      <div className={`${styles.featureVisual} ${styles.styleVisual}`}>
        <i /><i /><i />
        <span><b /><b /><b /></span>
      </div>
    );
  }
  return (
    <div className={`${styles.featureVisual} ${styles.statsVisual}`}>
      <div><Eye size={15} /><span><strong>1 284</strong><small>vues</small></span></div>
      <div><MousePointerClick size={15} /><span><strong>327</strong><small>clics</small></span></div>
      <span><i /><i /><i /><i /><i /><i /></span>
    </div>
  );
}

export default function Home() {
  return (
    <main className={`qard-site ${styles.site}`}>
      <div className={styles.ambient} aria-hidden="true" />
      <MarketingNav />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Qard · identité numérique</span>
          <h1>
            Votre contact,
            <br />sans détour.
          </h1>
          <p className={styles.heroLead}>
            Un profil clair, un lien unique et un QR permanent. Vous changez,
            votre Qard suit.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/signup" prefetch={false}>
              Créer ma Qard <ArrowRight size={18} />
            </Link>
            <Link className={styles.secondary} href="/card" prefetch={false}>
              Voir une vraie Qard
            </Link>
          </div>
          <div className={styles.proof}>
            <span><Check size={14} /> Gratuit pour commencer</span>
            <span><Check size={14} /> Sans application</span>
            <span><Check size={14} /> Prête en quelques minutes</span>
          </div>
        </div>
        <CardSample />
      </section>

      <section className={styles.manifesto}>
        <span>Moins de présentation.</span>
        <h2>Plus de vraies connexions.</h2>
        <p>
          Qard ne cherche pas à devenir un réseau social. Elle donne simplement
          la bonne information, au bon moment.
        </p>
      </section>

      <section className={styles.process} id="fonctionnement">
        <header className={styles.sectionHeader}>
          <span>Comment ça marche</span>
          <h2>De vous à leur téléphone.</h2>
        </header>
        <div className={styles.steps}>
          {steps.map(({ number, title, text }) => (
            <article key={number}>
              <StepVisual number={number} />
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <header className={styles.sectionHeader}>
          <span>Nos avantages</span>
          <h2>Utile dès le premier partage.</h2>
        </header>
        <div className={styles.featureGrid}>
          {features.map(({ icon: Icon, title, text, visual }) => (
            <article key={title}>
              <FeatureVisual type={visual} />
              <div className={styles.featureTitle}><Icon size={19} /><h3>{title}</h3></div>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <QardLogo linked={false} />
        <h2>Une identité que l’on retient.</h2>
        <p>Créez votre Qard aujourd’hui. Elle restera à jour demain.</p>
        <Link className={styles.primary} href="/signup" prefetch={false}>
          Commencer gratuitement <ArrowRight size={18} />
        </Link>
      </section>

      <footer className={styles.footer}>
        <QardLogo />
        <p>© 2026 Qard</p>
        <nav>
          <Link href="/privacy" prefetch={false}>Confidentialité</Link>
          <Link href="/terms" prefetch={false}>Conditions</Link>
        </nav>
      </footer>
    </main>
  );
}
