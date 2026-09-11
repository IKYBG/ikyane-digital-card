import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  AtSign,
  BarChart3,
  Check,
  ContactRound,
  Link2,
  Mail,
  Palette,
  RefreshCw,
  Share2,
  Smartphone,
} from 'lucide-react';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';
import styles from './landing.module.css';

const steps = [
  {
    number: '01',
    icon: ContactRound,
    title: 'Créez votre identité',
    text: 'Un nom, une photo et les moyens utiles pour vous joindre.',
  },
  {
    number: '02',
    icon: Share2,
    title: 'Partagez votre Qard',
    text: 'Envoyez votre lien ou présentez votre QR code permanent.',
  },
  {
    number: '03',
    icon: Smartphone,
    title: 'Le contact est enregistré',
    text: 'Votre interlocuteur choisit un canal et vous retrouve ensuite.',
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
    title: 'Toujours à jour',
    text: 'Modifiez votre profil sans réimprimer votre QR code.',
    visual: 'update',
  },
  {
    icon: Palette,
    title: 'Vraiment à vous',
    text: 'Une apparence cohérente avec votre personnalité ou votre activité.',
    visual: 'style',
  },
  {
    icon: BarChart3,
    title: 'L’essentiel en chiffres',
    text: 'Comprenez les vues et les contacts, sans tableau compliqué.',
    visual: 'stats',
  },
];

function CardSample() {
  return (
    <div className={styles.productStage} aria-label="Exemple d’une Qard">
      <span className={styles.liveBadge}>
        <RefreshCw size={14} /> Mise à jour instantanée
      </span>
      <article className={styles.sampleCard}>
        <header className={styles.cardTopbar}>
          <span className={styles.cardMark}>Q</span>
          <span className={styles.online}>
            <i /> Profil actif
          </span>
        </header>
        <div className={styles.sampleIdentity}>
          <div className={styles.sampleAvatar}>V</div>
          <div>
            <h2>
              Votre nom <Check size={15} />
            </h2>
            <p>Votre activité, simplement.</p>
          </div>
        </div>
        <div className={styles.sampleContacts}>
          <span>
            <Mail size={17} /> Email
          </span>
          <span>
            <AtSign size={17} /> Réseaux
          </span>
          <span>
            <Link2 size={17} /> Site web
          </span>
        </div>
        <div className={styles.sampleAction}>
          Voir mes contacts <ArrowRight size={17} />
        </div>
        <footer>
          <span>myqard.vercel.app/u/votre-nom</span>
          <i />
        </footer>
      </article>
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
          <small>Aucune application</small>
        </span>
      </div>
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
        <span>Q</span>
        <i />
        <strong>Publié</strong>
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
      <strong>184</strong><small>interactions</small>
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
          {steps.map(({ number, icon: Icon, title, text }) => (
            <article key={number}>
              <div className={styles.stepIcon}><Icon size={23} /></div>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <header className={styles.sectionHeader}>
          <span>Conçue pour rester simple</span>
          <h2>Tout ce qu’il faut. Rien de plus.</h2>
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
