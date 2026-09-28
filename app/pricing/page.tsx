import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Clock3,
  Eye,
  QrCode,
  RefreshCcw,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';
export const metadata = { title: 'Tarifs' };
const plans = [
  {
    name: 'Gratuit',
    price: '0 €',
    eyebrow: 'Pour commencer aujourd’hui',
    description:
      'Fini de répéter votre numéro, votre Instagram ou votre email à chaque rencontre.',
    features: [
      'Tous vos contacts réunis sur une seule carte',
      'Un lien et un QR code qui ne changent jamais',
      'Vos nouvelles informations visibles immédiatement',
      'Des styles essentiels prêts à utiliser',
      'Les interactions des 7 derniers jours',
    ],
    cta: 'Créer gratuitement',
    href: '/signup',
    pro: false,
  },
  {
    name: 'Pro',
    price: '4,99 €',
    eyebrow: 'Pour marquer les esprits',
    description:
      'Pour celles et ceux qui veulent une carte à leur image et savoir ce qui intéresse leurs contacts.',
    features: [
      'Plus de styles pour trouver celui qui vous ressemble',
      'Une présentation sans la signature Qard',
      'L’historique complet des vues et des clics',
      'Une identité plus libre et plus personnelle',
      'Votre propre adresse web dès sa disponibilité',
    ],
    cta: 'Créer ma Qard en attendant',
    href: '/signup',
    pro: true,
  },
];
export default function PricingPage() {
  return (
    <main className="qard-site legal-site pricing-page">
      <div className="pricing-ambient" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <MarketingNav />
      <section className="pricing-hero qard-container">
        <span>
          <Sparkles size={13} /> Simple, même dans le prix
        </span>
        <h1>Partagez vos coordonnées une fois. Plus jamais dix fois.</h1>
        <p>
          Votre Qard regroupe ce que les autres cherchent vraiment : comment
          vous appeler, vous écrire et vous retrouver. Vous la mettez à jour,
          tout le monde voit la bonne version.
        </p>
        <div className="pricing-promise" aria-label="Engagement tarifaire">
          <span>Gratuit sans carte bancaire</span>
          <i />
          <span>Votre lien prêt en quelques minutes</span>
        </div>
      </section>
      <section className="pricing-grid qard-container">
        {plans.map((plan) => (
          <article key={plan.name} className={plan.pro ? 'featured' : ''}>
            {plan.pro && <b>Bientôt disponible</b>}
            <div className="pricing-plan-head">
              <span>
                {plan.pro ? (
                  <Sparkles size={18} />
                ) : (
                  <UserRoundCheck size={18} />
                )}
              </span>
              <div>
                <small>{plan.eyebrow}</small>
                <h2>{plan.name}</h2>
              </div>
            </div>
            <div>
              <strong>{plan.price}</strong>
              <span>{plan.price !== '0 €' && '/ mois'}</span>
            </div>
            <p>{plan.description}</p>
            <small>
              {plan.pro ? 'Ce que Pro vous apportera' : 'Inclus gratuitement'}
            </small>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link className="button button-ghost" href={plan.href}>
              {plan.cta} <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </section>
      <section
        className="pricing-assurance qard-container"
        aria-label="Avantages Qard"
      >
        <article>
          <QrCode size={20} />
          <span>
            <b>Plus besoin de tout dicter</b>Un scan ouvre directement votre
            carte.
          </span>
        </article>
        <article>
          <RefreshCcw size={20} />
          <span>
            <b>Une information change ?</b>Modifiez-la une fois, sans renvoyer
            votre lien.
          </span>
        </article>
        <article>
          <Eye size={20} />
          <span>
            <b>Voyez ce qui fonctionne</b>Repérez les coordonnées et réseaux
            consultés.
          </span>
        </article>
      </section>
      <p className="pricing-note">
        <Clock3 size={14} /> Commencez maintenant, choisissez Pro uniquement
        quand il vous apportera quelque chose.
      </p>
      <footer className="marketing-footer qard-container">
        <QardLogo />
        <Link href="/privacy">Confidentialité</Link>
      </footer>
    </main>
  );
}
