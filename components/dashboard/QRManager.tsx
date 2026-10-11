'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import Link from 'next/link';
import { Copy, Download, Maximize, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';
import { ShareActions } from './ShareActions';

export function QRManager({
  profile,
  url,
  welcome = false,
}: {
  profile: Profile;
  url: string;
  welcome?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [image, setImage] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [scanStatus, setScanStatus] = useState('');
  useEffect(() => {
    let active = true;
    const scannedUrl = new URL(url);
    scannedUrl.searchParams.set('via', 'qr');
    void QRCode.toDataURL(scannedUrl.toString(), {
      width: 680,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: { dark: '#111111', light: '#ffffff' },
    })
      .then((data) => {
        if (active) setImage(data);
      })
      .catch(() => {
        if (active)
          setError(
            'QR indisponible. Rechargez la page ou partagez votre lien.',
          );
      });
    return () => {
      active = false;
    };
  }, [url]);
  useEffect(() => {
    if (!image || !profile.published) return;
    let active = true;
    const controller = new AbortController();
    const since = new Date().toISOString();
    const started = Date.now();
    const timer = window.setInterval(async () => {
      if (Date.now() - started > 120_000) {
        window.clearInterval(timer);
        return;
      }
      if (document.visibilityState !== 'visible') return;
      try {
        const response = await fetch(
          `/api/activation?since=${encodeURIComponent(since)}`,
          { cache: 'no-store', signal: controller.signal },
        );
        if (!response.ok) return;
        const result = await response.json();
        if (!active) return;
        if (result.contactRequests > 0) {
          setScanStatus(
            'Une demande d’enregistrement depuis votre QR a été détectée. La personne doit encore confirmer l’ajout dans son téléphone.',
          );
          window.clearInterval(timer);
        } else if (result.views > 0) {
          setScanStatus(
            'Votre Qard a été ouverte depuis le QR. Invitez la personne à enregistrer votre contact.',
          );
        }
      } catch {
        /* The QR remains usable without analytics. */
      }
    }, 8000);
    return () => {
      active = false;
      controller.abort();
      window.clearInterval(timer);
    };
  }, [image, profile.published]);
  async function record() {
    try {
      const supabase = createClient();
      await Promise.all([
        supabase
          .from('qard_profiles')
          .update({ qr_downloaded_at: new Date().toISOString() })
          .eq('id', profile.id),
        supabase
          .from('qard_analytics_events')
          .insert({ profile_id: profile.id, event_type: 'qr_download' }),
      ]);
    } catch {
      /* Download is still available if telemetry is unavailable. */
    }
  }
  const qr = image ? (
    // A locally generated data URL; image optimisation is unnecessary.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      width={680}
      height={680}
      alt={`QR code pour ouvrir la Qard de ${profile.display_name}`}
    />
  ) : (
    <output>{error || 'Préparation du QR…'}</output>
  );
  return (
    <div className="activation-qr">
      {welcome && (
        <section className="activation-success">
          <b>Votre Qard est prête.</b>
          <p>
            Montrez ce QR à une personne près de vous. Elle peut ouvrir votre
            carte et enregistrer votre contact, sans compte.
          </p>
        </section>
      )}
      {profile.published ? (
        <>
          <section className="qr-ready" aria-label="Votre QR à montrer">
            <h2>{profile.display_name}</h2>
            <p>Scannez pour garder le contact.</p>
            <div className="qr-ready-image">{qr}</div>
            <button
              className="button"
              disabled={!image}
              onClick={() => dialog.current?.showModal()}
            >
              <Maximize size={18} /> Montrer en grand
            </button>
            <div className="qr-save-actions">
              {image && (
                <a
                  href={image}
                  download={`qard-${profile.slug}.png`}
                  onClick={() => void record()}
                >
                  <Download size={16} /> Enregistrer le QR
                </a>
              )}
              <button
                onClick={() => {
                  void navigator.clipboard
                    .writeText(url)
                    .then(() => setToast('Lien copié'))
                    .catch(() =>
                      setToast('Copie impossible : utilisez Partager.'),
                    );
                }}
              >
                <Copy size={16} /> Copier le lien
              </button>
            </div>
            <ShareActions url={url} />
          </section>
          <dialog
            ref={dialog}
            className="qr-show-dialog"
            aria-labelledby="qr-dialog-title"
          >
            <button
              autoFocus
              className="qr-close"
              onClick={() => dialog.current?.close()}
              aria-label="Fermer le QR en grand"
            >
              <X />
            </button>
            <h2 id="qr-dialog-title">{profile.display_name}</h2>
            <p>Ouvrez l’appareil photo de votre téléphone.</p>
            <div className="qr-ready-image">{qr}</div>
            <p>Scannez. Puis enregistrez le contact.</p>
            <output aria-live="polite">{scanStatus}</output>
          </dialog>
        </>
      ) : (
        <section className="panel">
          <h2>Votre carte est masquée</h2>
          <p>
            Publiez-la pour que les personnes qui scannent puissent vous
            retrouver.
          </p>
          <Link className="button" href="/dashboard/editor">
            Publier ma Qard
          </Link>
        </section>
      )}
      <output className="activation-note" aria-live="polite">
        {scanStatus ||
          'Pendant deux minutes, les ouvertures depuis ce QR peuvent apparaître ici. Vos propres visites connectées sont exclues.'}
      </output>
      <section className="panel qr-first-scan">
        <h2>Votre premier échange, en trois gestes</h2>
        <ol>
          <li>Montrez le QR à une autre personne.</li>
          <li>Elle le scanne avec son appareil photo.</li>
          <li>
            Elle touche « Enregistrer le contact », puis confirme sur son
            téléphone.
          </li>
        </ol>
        <p>
          Le lien Qard reste à jour. Un contact déjà enregistré dans un
          téléphone ne se synchronise pas automatiquement.
        </p>
        <details>
          <summary>Retrouver mon QR à la prochaine rencontre</summary>
          <p>
            Enregistrez le QR dans vos photos et ajoutez-le à vos favoris. Pour
            un accès au site : Safari → Partager → Sur l’écran d’accueil ;
            Chrome → menu → Ajouter à l’écran d’accueil. Une connexion peut être
            nécessaire pour rouvrir votre espace.
          </p>
          <p>
            L’image du QR reste disponible hors connexion. Le destinataire a
            besoin d’internet pour ouvrir votre Qard.
          </p>
        </details>
        <div className="inline-actions">
          <Link href="/dashboard/editor">Ajouter une photo</Link>
          <Link href="/dashboard/links">Ajouter mes réseaux</Link>
          <Link href="/dashboard/appearance">Choisir mon style</Link>
          <Link href="/dashboard/analytics">Voir les interactions</Link>
        </div>
      </section>
      <output aria-live="polite">{toast}</output>
    </div>
  );
}
