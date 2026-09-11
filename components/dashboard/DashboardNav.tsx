'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  Link2,
  LogOut,
  Palette,
  QrCode,
  Settings,
  UserRoundPen,
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

  async function signOut() {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <QardLogo />
          <span className="plan-badge">{plan}</span>
        </div>
        <div className="sidebar-section-label">Espace</div>
        <nav>
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              prefetch={false}
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
          <Link href="/dashboard/qr" prefetch={false}>
            <QrCode size={17} /> Mon QR code
          </Link>
          <Link href="/dashboard/settings" prefetch={false}>
            <Settings size={17} /> Réglages
          </Link>
          <Link href={`/u/${slug}`} target="_blank" prefetch={false}>
            <ExternalLink size={17} /> Voir ma Qard
          </Link>
          <button onClick={signOut}>
            <LogOut size={17} /> Se déconnecter
          </button>
        </div>
      </aside>
      <nav className="mobile-dashboard-nav" aria-label="Navigation dashboard">
        {mobileItems.map(({ href, label, shortLabel, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            prefetch={false}
            aria-label={label}
            className={isActive(path, href) ? 'active' : ''}
          >
            <span className="mobile-nav-icon">
              <Icon size={20} />
            </span>
            <span>{shortLabel}</span>
          </Link>
        ))}
        <Link
          href="/dashboard/settings"
          prefetch={false}
          aria-label="Réglages"
          className={isActive(path, '/dashboard/settings') ? 'active' : ''}
        >
          <span className="mobile-nav-icon">
            <Settings size={20} />
          </span>
          <span>Plus</span>
        </Link>
      </nav>
    </>
  );
}
