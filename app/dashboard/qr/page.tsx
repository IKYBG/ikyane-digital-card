import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QRManager } from '@/components/dashboard/QRManager';
import { getCurrentQard } from '@/lib/qard/data';
import { getPublicProfileUrl } from '@/lib/qard/url';
export default async function QRPage() {
  const { profile } = await getCurrentQard();
  return (
    <>
      <DashboardHeader
        eyebrow="Partage"
        title="Votre QR code"
        description="Enregistrez-le puis partagez-le simplement."
      />
      <QRManager profile={profile} url={getPublicProfileUrl(profile.slug)} />
    </>
  );
}
