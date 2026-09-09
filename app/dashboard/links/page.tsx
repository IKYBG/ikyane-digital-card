import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LinksManager } from '@/components/dashboard/LinksManager';
import { getCurrentQard } from '@/lib/qard/data';
export default async function LinksPage() {
  const { profile, links } = await getCurrentQard();
  return (
    <>
      <DashboardHeader
        eyebrow="Contacts"
        title="Vos liens"
        description="Ajoutez, masquez ou réorganisez vos contacts."
      />
      <LinksManager profile={profile} initialLinks={links} />
    </>
  );
}
