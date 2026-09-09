import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AppearanceEditor } from '@/components/dashboard/AppearanceEditor';
import { getCurrentQard } from '@/lib/qard/data';
export default async function AppearancePage() {
  const data = await getCurrentQard();
  return (
    <>
      <DashboardHeader
        eyebrow="Apparence"
        title="Choisissez votre style"
        description="Commencez par un thème. Les réglages avancés restent facultatifs."
      />
      <AppearanceEditor data={data} />
    </>
  );
}
