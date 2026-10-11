import Link from 'next/link';
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
      <nav className="product-edit-tabs" aria-label="Personnaliser ma Qard">
        <Link href="/dashboard/editor" aria-current="page">
          Identité
        </Link>
        <Link href="/dashboard/links">Coordonnées et réseaux</Link>
        <Link href="/dashboard/appearance">Style</Link>
        <Link href="/dashboard/qr">Montrer mon QR →</Link>
      </nav>
      <ProfileEditor data={data} />
    </div>
  );
}
