import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SettingsForm } from '@/components/dashboard/SettingsForm';
import { getCurrentQard, requireUser } from '@/lib/qard/data';
export default async function SettingsPage() {
  const { profile } = await getCurrentQard();
  const { email } = await requireUser();
  return (
    <>
      <DashboardHeader
        eyebrow="Compte"
        title="Réglages"
        description="Gérez votre adresse publique et votre accès."
      />
      <SettingsForm profile={profile} accountEmail={email ?? ''} />
    </>
  );
}
