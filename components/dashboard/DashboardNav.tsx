'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, ExternalLink, LayoutDashboard, Link2, LogOut, Palette, QrCode, Settings, UserRoundPen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { QardLogo } from '@/components/qard/QardLogo';

const items = [{ href: '/dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },{ href: '/dashboard/editor', label: 'Ma Qard', icon: UserRoundPen },{ href: '/dashboard/links', label: 'Liens', icon: Link2 },{ href: '/dashboard/appearance', label: 'Apparence', icon: Palette },{ href: '/dashboard/qr', label: 'QR code', icon: QrCode },{ href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },{ href: '/dashboard/settings', label: 'Réglages', icon: Settings }];
const mobileItems = items.filter(({ href }) => !['/dashboard/qr', '/dashboard/analytics'].includes(href));
export function DashboardNav({ slug, plan }: { slug: string; plan: 'free' | 'pro' }) { const path = usePathname(); const router = useRouter(); async function signOut() { await createClient().auth.signOut(); router.push('/'); router.refresh(); } return <><aside className="dashboard-sidebar"><div><QardLogo /><span className="plan-badge">{plan}</span></div><nav>{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={path === href ? 'active' : ''}><Icon size={18} />{label}</Link>)}</nav><div className="sidebar-bottom"><Link href={`/u/${slug}`} target="_blank"><ExternalLink size={17} /> Voir ma Qard</Link><button onClick={signOut}><LogOut size={17} /> Se déconnecter</button></div></aside><nav className="mobile-dashboard-nav" aria-label="Navigation dashboard">{mobileItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-label={label} className={path === href ? 'active' : ''}><Icon size={20} /><span>{label === 'Vue d’ensemble' ? 'Accueil' : label === 'Apparence' ? 'Style' : label}</span></Link>)}</nav></>; }
