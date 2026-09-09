import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { PublicQard } from '@/components/qard/PublicQard';
import { getPublicQardCached } from '@/lib/qard/data';
import { getPublicProfileUrl } from '@/lib/qard/url';

export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getPublicQardCached(slug);
    if (!data)
      return {
        title: 'Qard introuvable',
        robots: { index: false, follow: false },
      };
    const description =
      data.profile.headline ||
      data.profile.bio ||
      `Découvre la Qard de ${data.profile.display_name}.`;
    const canonical = getPublicProfileUrl(data.profile.slug);
    return {
      title: data.profile.display_name,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${data.profile.display_name} | Qard`,
        description,
        url: canonical,
        siteName: 'Qard',
        type: 'profile',
        images: data.profile.avatar_url
          ? [
              {
                url: data.profile.avatar_url,
                alt: `Photo de ${data.profile.display_name}`,
              },
            ]
          : [],
      },
      twitter: {
        card: data.profile.avatar_url ? 'summary_large_image' : 'summary',
        title: `${data.profile.display_name} | Qard`,
        description,
        images: data.profile.avatar_url ? [data.profile.avatar_url] : [],
      },
    };
  } catch {
    return { title: 'Qard', robots: { index: false, follow: false } };
  }
}
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data;
  try {
    data = await getPublicQardCached(slug);
  } catch {
    return (
      <main className="public-qard-error">
        <b>Qard</b>
        <h1>Service temporairement indisponible.</h1>
        <p>Réessaie dans quelques instants.</p>
      </main>
    );
  }
  if (!data) notFound();
  if (data.profile.slug !== slug) redirect(`/u/${data.profile.slug}`);
  return <PublicQard data={data} />;
}
