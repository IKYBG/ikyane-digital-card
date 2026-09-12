import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  AtSign,
  Check,
  Link2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';
import styles from './landing.module.css';

const steps = [
  {
    number: '01',
    title: 'Composez',
    text: 'Votre identité, votre photo et les contacts qui comptent.',
  },
  {
    number: '02',
    title: 'Présentez',
    text: 'Un lien à envoyer. Un QR à montrer. Rien à installer.',
  },
  {
    number: '03',
    title: 'Restez joignable',
    text: 'Vous modifiez votre Qard, le même lien reste toujours à jour.',
  },
];

const capabilities = [
  {
    number: '01',
    label: 'Identité',
    title: 'On comprend qui vous êtes en quelques secondes.',
    text: 'Nom, activité, lieu et une présentation courte. L’essentiel garde toute la place.',
    visual: 'identity',
  },
  {
    number: '02',
    label: 'Contact',
    title: 'Chaque moyen de vous joindre est au même endroit.',
    text: 'Téléphone, email, site et réseaux s’ouvrent directement dans la bonne application.',
    visual: 'contact',
  },
  {
    number: '03',
    label: 'Style',
    title: 'Une présence qui vous ressemble vraiment.',
    text: 'Des styles complets, sobres ou expressifs, puis des réglages précis si vous le souhaitez.',
    visual: 'style',
  },
  {
    number: '04',
    label: 'Suivi',
    title: 'Des chiffres utiles, sans vous noyer.',
    text: 'Repérez simplement les vues, les clics et les contacts qui intéressent votre audience.',
    visual: 'signal',
  },
];

function CardSample() {
  return (
    <div className={styles.productStage} aria-label="Exemple d’une Qard">
      <div className={styles.stageIndex} aria-hidden="true">
        <span>FACE</span>
        <strong>01</strong>
      </div>
      <article className={styles.sampleCard}>
        <header className={styles.cardTopbar}>
          <span className={styles.cardWordmark}>QARD / PROFIL</span>
          <span className={styles.online}>
            <i /> Disponible
          </span>
        </header>
        <div className={styles.samplePortrait} aria-hidden="true">
          <span>C</span>
          <i />
        </div>
        <div className={styles.sampleIdentity}>
          <span className={styles.profileNumber}>N° 0248</span>
          <h2>
            Camille Morel <Check size={16} />
          </h2>
          <p>Architecte indépendante</p>
          <span className={styles.location}>
            <MapPin size={14} /> Lyon, France
          </span>
        </div>
        <div className={styles.sampleAction}>
          Voir mes contacts <ArrowRight size={17} />
        </div>
        <footer>
          <span>myqard.vercel.app/u/camille</span>
          <span>Glissez pour retourner</span>
        </footer>
      </article>
      <aside className={styles.contactRail} aria-label="Contacts disponibles">
        <span>
          <Mail size={16} />
          <small>Email</small>
        </span>
        <span>
          <Phone size={16} />
          <small>Téléphone</small>
        </span>
        <span>
          <AtSign size={16} />
          <small>Réseaux</small>
        </span>
        <span>
          <Link2 size={16} />
          <small>Site</small>
        </span>
      </aside>
      <div className={styles.qrTicket}>
        <Image
          src="/ikyane-qr.png"
          width={74}
          height={74}
          alt="QR code d’exemple"
          sizes="74px"
        />
        <span>
          <small>SCAN / OUVERTURE</small>
          <strong>
            Votre Qard.
            <br />
            En un geste.
          </strong>
        </span>
      </div>
    </div>
  );
}

function CapabilityVisual({ type }: { type: string }) {
  if (type === 'identity')
    return (
      <div className={`${styles.capabilityVisual} ${styles.identityVisual}`}>
        <span>CM</span>
        <div>
          <b>Camille Morel</b>
          <i />
          <i />
        </div>
      </div>
    );
  if (type === 'contact')
    return (
      <div className={`${styles.capabilityVisual} ${styles.contactVisual}`}>
        <span>
          <Mail size={17} />
        </span>
        <span>
          <Phone size={17} />
        </span>
        <span>
          <AtSign size={17} />
        </span>
        <span>
          <Link2 size={17} />
        </span>
      </div>
    );
  if (type === 'style')
    return (
      <div className={`${styles.capabilityVisual} ${styles.styleVisual}`}>
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  return (
    <div className={`${styles.capabilityVisual} ${styles.signalVisual}`}>
      <span>184</span>
      <div>
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className={`qard-site ${styles.site}`}>
      <div className={styles.brandLine} aria-hidden="true" />
      <MarketingNav />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            La carte de contact qui reste à jour
          </span>
          <h1>
            Un geste.
            <br />
            <em>Le contact reste.</em>
          </h1>
          <p className={styles.heroLead}>
            Qard rassemble votre identité et vos contacts dans une carte claire,
            personnelle et toujours accessible.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/signup" prefetch={false}>
              Créer ma Qard <ArrowRight size={18} />
            </Link>
            <Link className={styles.secondary} href="/card" prefetch={false}>
              Ouvrir l’exemple <span>↗</span>
            </Link>
          </div>
          <div className={styles.proof} aria-label="Avantages principaux">
            <span>
              <strong>01</strong>
              <small>lien unique</small>
            </span>
            <span>
              <strong>00</strong>
              <small>application</small>
            </span>
            <span>
              <strong>∞</strong>
              <small>mises à jour</small>
            </span>
          </div>
        </div>
        <CardSample />
      </section>

      <section className={styles.manifesto}>
        <span className={styles.manifestoMark}>Q/</span>
        <div>
          <p>Notre parti pris</p>
          <h2>Une bonne présentation n’a pas besoin d’explication.</h2>
        </div>
        <p className={styles.manifestoCopy}>
          Pas de profil à chercher, pas d’application à imposer, pas de carte à
          réimprimer. Qard laisse simplement la bonne information circuler.
        </p>
      </section>

      <section className={styles.process} id="fonctionnement">
        <header className={styles.sectionHeader}>
          <span>Du premier geste au prochain échange</span>
          <h2>Vous. Qard. Eux.</h2>
        </header>
        <div className={styles.route} aria-hidden="true">
          <i />
        </div>
        <div className={styles.steps}>
          {steps.map(({ number, title, text }) => (
            <article key={number}>
              <span>{number} / 03</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.capabilities}>
        <header className={styles.sectionHeader}>
          <span>Le produit, sans détour</span>
          <h2>
            Quatre réponses.
            <br />
            Une seule carte.
          </h2>
        </header>
        <div className={styles.capabilityList}>
          {capabilities.map(({ number, label, title, text, visual }) => (
            <article key={number}>
              <span className={styles.capabilityNumber}>{number}</span>
              <div className={styles.capabilityCopy}>
                <small>{label}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <CapabilityVisual type={visual} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <span className={styles.finalMonogram} aria-hidden="true">
          Q
        </span>
        <div>
          <span>Votre prochaine présentation commence ici.</span>
          <h2>
            Faites simple.
            <br />
            Faites-vous retenir.
          </h2>
          <Link className={styles.primary} href="/signup" prefetch={false}>
            Commencer gratuitement <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <QardLogo />
        <p>La carte de contact qui reste à jour.</p>
        <span>© 2026 Qard</span>
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
