import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Minus,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';
export const metadata = { title: 'Tarifs' };
const plans = [
  {
    name: 'Gratuit',
    price: '0 €',
    description: 'Pour créer et partager ta première identité.',
    features: [
      '1 Qard',
      'QR permanent',
      'Réseaux et contacts',
      'Thèmes essentiels',
      'Analytics 7 jours',
      'Branding Qard',
    ],
    cta: 'Créer ma Qard',
    href: '/signup',
    pro: false,
  },
  {
    name: 'Pro',
    price: '4,99 €',
    description: 'Pour une identité plus libre et plus mesurable.',
    features: [
      'Personnalisation avancée',
      'Thèmes premium',
      'Suppression du branding',
      'Analytics étendues',
      'Domaine personnalisé à venir',
      'Fonctions premium futures',
    ],
    cta: 'Disponible bientôt',
    href: '',
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
          <Sparkles size={13} /> Tarifs simples
        </span>
        <h1>Une Qard utile dès le premier partage.</h1>
        <p>
          Commencez gratuitement. Passez à Pro uniquement lorsque vous en avez
          besoin.
        </p>
        <div className="pricing-promise" aria-label="Engagement tarifaire">
          <span>Sans carte bancaire</span>
          <i />
          <span>Prête en quelques minutes</span>
        </div>
      </section>
      <section className="pricing-grid qard-container">
        {plans.map((plan) => (
          <article key={plan.name} className={plan.pro ? 'featured' : ''}>
            {plan.pro && <b>Qard Pro</b>}
            <div className="pricing-plan-head">
              <span>
                {plan.pro ? <Sparkles size={18} /> : <Zap size={18} />}
              </span>
              <h2>{plan.name}</h2>
            </div>
            <div>
              <strong>{plan.price}</strong>
              <span>{plan.price !== '0 €' && '/ mois'}</span>
            </div>
            <p>{plan.description}</p>
            <small>Tout ce qu’il faut pour partager sans friction</small>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.href ? (
              <Link className="button button-ghost" href={plan.href}>
                {plan.cta} <ArrowRight size={16} />
              </Link>
            ) : (
              <span className="button pricing-disabled" aria-disabled="true">
                {plan.cta}
              </span>
            )}
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
            <b>QR permanent</b>Un seul code à partager.
          </span>
        </article>
        <article>
          <RefreshCcw size={20} />
          <span>
            <b>Modifiable à tout moment</b>Les changements sont immédiats.
          </span>
        </article>
        <article>
          <ShieldCheck size={20} />
          <span>
            <b>Vous gardez le contrôle</b>Publiez ou masquez votre Qard.
          </span>
        </article>
      </section>
      <p className="pricing-note">
        <Minus size={14} /> Aucun moyen de paiement demandé pour créer votre
        Qard.
      </p>
      <footer className="marketing-footer qard-container">
        <QardLogo />
        <Link href="/privacy">Confidentialité</Link>
      </footer>
    </main>
  );
}
