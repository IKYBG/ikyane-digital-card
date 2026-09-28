import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { getCurrentQard } from '@/lib/qard/data';
export default async function EditorPage() {
  const data = await getCurrentQard();
  return (
    <>
      <DashboardHeader
        eyebrow="Studio Qard"
        title="Votre carte"
        description="Construisez votre profil à votre rythme. Chaque modification apparaît immédiatement dans l’aperçu."
      />
      <ProfileEditor data={data} />
    </>
  );
}
