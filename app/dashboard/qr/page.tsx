import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QRManager } from '@/components/dashboard/QRManager';
import { getCurrentQard } from '@/lib/qard/data';
import { getPublicProfileUrl } from '@/lib/qard/url';
export default async function QRPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const welcome = (await searchParams).welcome === '1';
  const { profile } = await getCurrentQard();
  return (
    <>
      <DashboardHeader
        eyebrow="Partage"
        title="Montrez votre Qard"
        description="Un scan pour vous retrouver. Aucun compte nécessaire pour votre contact."
      />
      <QRManager
        welcome={welcome}
        profile={profile}
        url={getPublicProfileUrl(profile.slug)}
      />
    </>
  );
}
