import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicQard } from '@/components/qard/PublicQard';
import { getPublicQard } from '@/lib/qard/data';
import { getPublicProfileUrl } from '@/lib/qard/url';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; try { const data = await getPublicQard(slug); if (!data) return { title: 'Qard introuvable', robots: { index: false, follow: false } }; const description = data.profile.headline || data.profile.bio || `Découvre la Qard de ${data.profile.display_name}.`; return { title: data.profile.display_name, description, alternates: { canonical: getPublicProfileUrl(slug) }, openGraph: { title: `${data.profile.display_name} | Qard`, description, images: data.profile.avatar_url ? [data.profile.avatar_url] : [] } }; } catch { return { title: 'Qard', robots: { index: false, follow: false } }; } }
export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; let data; try { data = await getPublicQard(slug); } catch { return <main className="public-qard-error"><b>Qard</b><h1>Configuration en cours.</h1><p>Le service de profils sera disponible dès que Supabase sera connecté.</p></main>; } if (!data) notFound(); return <PublicQard data={data} />; }
