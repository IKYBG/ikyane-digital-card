'use client';
import { QardLogo } from '@/components/qard/QardLogo';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="qard-site global-error">
      <QardLogo linked={false} />
      <span>Erreur</span>
      <h1>Qard a rencontré un obstacle.</h1>
      <p>
        Réessaie dans un instant. Tes données déjà enregistrées sont intactes.
      </p>
      <button className="button" onClick={reset}>
        Réessayer
      </button>
    </main>
  );
}
