import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
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
      <MarketingNav />
      <section className="pricing-hero qard-container">
        <span>Tarifs simples</span>
        <h1>Une Qard utile dès le premier partage.</h1>
        <p>Commencez gratuitement. Passez à Pro uniquement lorsque vous en avez besoin.</p>
      </section>
      <section className="pricing-grid qard-container">
        {plans.map((plan) => (
          <article key={plan.name} className={plan.pro ? 'featured' : ''}>
            {plan.pro && <b>Qard Pro</b>}
            <h2>{plan.name}</h2>
            <div>
              <strong>{plan.price}</strong>
              <span>{plan.price !== '0 €' && '/ mois'}</span>
            </div>
            <p>{plan.description}</p>
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
                {plan.cta}
              </Link>
            ) : (
              <span className="button pricing-disabled" aria-disabled="true">
                {plan.cta}
              </span>
            )}
          </article>
        ))}
      </section>
      <p className="pricing-note">
        <Minus size={14} /> Aucun moyen de paiement demandé pour créer votre Qard.
      </p>
      <footer className="marketing-footer qard-container">
        <QardLogo />
        <Link href="/privacy">Confidentialité</Link>
      </footer>
    </main>
  );
}
