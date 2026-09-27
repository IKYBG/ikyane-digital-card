'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  ExternalLink,
  Home,
  LayoutDashboard,
  Link2,
  LogOut,
  Palette,
  QrCode,
  Settings,
  UserRoundPen,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { QardLogo } from '@/components/qard/QardLogo';

const items = [
  {
    href: '/dashboard',
    label: 'Vue d’ensemble',
    shortLabel: 'Accueil',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/editor',
    label: 'Ma Qard',
    shortLabel: 'Qard',
    icon: UserRoundPen,
  },
  {
    href: '/dashboard/links',
    label: 'Liens',
    shortLabel: 'Liens',
    icon: Link2,
  },
  {
    href: '/dashboard/appearance',
    label: 'Style',
    shortLabel: 'Style',
    icon: Palette,
  },
  {
    href: '/dashboard/analytics',
    label: 'Statistiques',
    shortLabel: 'Stats',
    icon: BarChart3,
  },
];

const mobileItems = items.filter(({ href }) => href !== '/dashboard/analytics');

function isActive(path: string, href: string) {
  return href === '/dashboard' ? path === href : path.startsWith(href);
}

export function DashboardNav({
  slug,
  plan,
}: {
  slug: string;
  plan: 'free' | 'pro';
}) {
  const path = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    const { error } = await createClient().auth.signOut();
    if (error) {
      setSigningOut(false);
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <div className="dashboard-mobile-topbar">
        <QardLogo />
        <Link
          href={`/u/${slug}`}
          target="_blank"
          rel="noreferrer"
          prefetch={false}
        >
          Aperçu <ExternalLink size={15} />
        </Link>
      </div>
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <QardLogo />
          <span className="plan-badge">
            {plan === 'free' ? 'Gratuit' : 'Pro'}
          </span>
        </div>
        <div className="sidebar-section-label">Espace</div>
        <nav>
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(path, href) ? 'page' : undefined}
              className={isActive(path, href) ? 'active' : ''}
            >
              <span className="sidebar-icon">
                <Icon size={17} />
              </span>
              <span>{label}</span>
              {isActive(path, href) && <i aria-hidden="true" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/">
            <Home size={17} /> Accueil Qard
          </Link>
          <Link href="/dashboard/qr">
            <QrCode size={17} /> Mon QR code
          </Link>
          <Link href="/dashboard/settings">
            <Settings size={17} /> Réglages
          </Link>
          <Link
            href={`/u/${slug}`}
            target="_blank"
            rel="noreferrer"
            prefetch={false}
          >
            <ExternalLink size={17} /> Voir ma Qard
          </Link>
          <button onClick={() => void signOut()} disabled={signingOut}>
            <LogOut size={17} />
            {signingOut ? 'Déconnexion…' : 'Se déconnecter'}
          </button>
        </div>
      </aside>
      <nav className="mobile-dashboard-nav" aria-label="Navigation dashboard">
        {mobileItems.map(({ href, label, shortLabel, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMoreOpen(false)}
            aria-label={label}
            aria-current={isActive(path, href) ? 'page' : undefined}
            className={isActive(path, href) ? 'active' : ''}
          >
            <span className="mobile-nav-icon">
              <Icon size={20} />
            </span>
            <span>{shortLabel}</span>
          </Link>
        ))}
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={moreOpen}
          aria-controls="dashboard-mobile-more"
          className={
            moreOpen ||
            [
              '/dashboard/settings',
              '/dashboard/qr',
              '/dashboard/analytics',
            ].some((href) => isActive(path, href))
              ? 'active'
              : ''
          }
          onClick={() => setMoreOpen((current) => !current)}
        >
          <span className="mobile-nav-icon">
            <Settings size={20} />
          </span>
          <span>Plus</span>
        </button>
      </nav>
      {moreOpen && (
        <div className="mobile-more-backdrop">
          <button
            type="button"
            className="mobile-more-dismiss"
            aria-label="Fermer le menu"
            onClick={() => setMoreOpen(false)}
          />
          <dialog
            open
            id="dashboard-mobile-more"
            className="mobile-more-sheet"
            aria-modal="true"
            aria-labelledby="mobile-more-title"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setMoreOpen(false);
            }}
          >
            <header>
              <div>
                <span>Navigation</span>
                <h2 id="mobile-more-title">Plus d’options</h2>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Fermer le menu"
                autoFocus
              >
                <X size={19} />
              </button>
            </header>
            <nav aria-label="Navigation secondaire">
              <Link
                href="/dashboard/analytics"
                onClick={() => setMoreOpen(false)}
              >
                <BarChart3 size={19} />
                <span>
                  <b>Statistiques</b>
                  <small>Suivre les vues et les clics</small>
                </span>
                <Chevron />
              </Link>
              <Link href="/dashboard/qr" onClick={() => setMoreOpen(false)}>
                <QrCode size={19} />
                <span>
                  <b>Mon QR code</b>
                  <small>Télécharger et partager</small>
                </span>
                <Chevron />
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setMoreOpen(false)}
              >
                <Settings size={19} />
                <span>
                  <b>Réglages</b>
                  <small>Adresse publique et compte</small>
                </span>
                <Chevron />
              </Link>
              <Link
                href={`/u/${slug}`}
                target="_blank"
                rel="noreferrer"
                prefetch={false}
                onClick={() => setMoreOpen(false)}
              >
                <ExternalLink size={19} />
                <span>
                  <b>Voir ma Qard</b>
                  <small>Ouvrir le profil public</small>
                </span>
                <Chevron />
              </Link>
            </nav>
            <div className="mobile-more-footer">
              <Link href="/" onClick={() => setMoreOpen(false)}>
                <Home size={17} /> Accueil Qard
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                disabled={signingOut}
              >
                <LogOut size={17} />{' '}
                {signingOut ? 'Déconnexion…' : 'Se déconnecter'}
              </button>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}

function Chevron() {
  return (
    <span className="mobile-more-chevron" aria-hidden="true">
      ›
    </span>
  );
}
