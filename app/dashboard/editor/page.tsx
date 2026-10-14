import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { getCurrentQard } from '@/lib/qard/data';
export default async function EditorPage() {
  const data = await getCurrentQard();
  return (
    <div className="profile-studio-page">
      <DashboardHeader
        eyebrow="Studio Qard"
        title="Votre carte"
        description="Modifiez vos informations et vérifiez le résultat en direct."
      />
      <ProfileEditor data={data} />
    </div>
  );
}
