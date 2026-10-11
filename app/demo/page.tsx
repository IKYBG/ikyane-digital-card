import Link from 'next/link';
import { QardPreview } from '@/components/qard/QardPreview';
import { demoQard } from '@/lib/qard/demo-data';
export const metadata = {
  title: 'Essayez une Qard',
  robots: { index: false, follow: false },
};
export default function DemoPage() {
  return (
    <main className="qard-demo-page">
      <p>Exemple fictif · Essayez l’enregistrement du contact.</p>
      <QardPreview data={demoQard} demo />
      <Link href="/signup">Créer ma propre Qard →</Link>
      <Link href="/">Retour à Qard</Link>
    </main>
  );
}
