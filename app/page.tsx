import Link from 'next/link';
import { ArrowUpRight, Check, Link2, RefreshCw } from 'lucide-react';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { PrismaQardHero } from '@/components/qard/PrismaQardHero';
import { QardFeatureSteps } from '@/components/qard/QardFeatureSteps';
import { QardLogo } from '@/components/qard/QardLogo';
import styles from './landing.module.css';

const promises = [
  { icon: Link2, title: 'Un seul lien', text: 'Tout ce qu’il faut pour vous joindre, sans application à installer.' },
  { icon: RefreshCw, title: 'Toujours à jour', text: 'Modifiez votre Qard sans changer le lien ni réimprimer le QR code.' },
  { icon: Check, title: 'Prête à partager', text: 'Votre identité reste claire et lisible sur chaque téléphone.' },
];

export default function Home() {
  return (
    <main className={`qard-site ${styles.site}`}>
      <MarketingNav />
      <PrismaQardHero />
      <section className={styles.process} id="fonctionnement">
        <header className={styles.sectionHeader}>
          <span>Comment ça fonctionne</span>
          <div><h2>De vos informations à leur téléphone.</h2><p>Trois étapes, aucune friction.</p></div>
        </header>
        <QardFeatureSteps />
      </section>
      <section className={styles.promiseSection} aria-labelledby="promise-title">
        <header><span>L’essentiel, sans détour</span><h2 id="promise-title">Vous changez. Votre lien reste.</h2></header>
        <div className={styles.promises}>
          {promises.map(({ icon: Icon, title, text }) => (
            <article key={title}><Icon size={21} /><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>
      <section className={styles.finalCta}>
        <div><span>Votre Qard en quelques minutes</span><h2>Donnez envie de vous recontacter.</h2></div>
        <Link href="/signup" prefetch={false}>Créer ma Qard <ArrowUpRight size={18} /></Link>
      </section>
      <footer className={styles.footer}>
        <QardLogo /><p>© 2026 Qard</p>
        <nav><Link href="/privacy" prefetch={false}>Confidentialité</Link><Link href="/terms" prefetch={false}>Conditions</Link></nav>
      </footer>
    </main>
  );
}
