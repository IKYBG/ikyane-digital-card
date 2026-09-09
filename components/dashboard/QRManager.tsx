'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export function QRManager({ profile, url }: { profile: Profile; url: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [toast, setToast] = useState('');
  const flash = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 1600);
  };
  useEffect(() => {
    if (canvas.current)
      void QRCode.toCanvas(canvas.current, url, {
        width: 680,
        margin: 4,
        errorCorrectionLevel: 'H',
        color: { dark: '#080b10', light: '#ffffff' },
      });
  }, [url]);
  async function record() {
    const supabase = createClient();
    await Promise.all([
      supabase
        .from('qard_analytics_events')
        .insert({ profile_id: profile.id, event_type: 'qr_download' }),
      supabase
        .from('qard_profiles')
        .update({ qr_downloaded_at: new Date().toISOString() })
        .eq('id', profile.id),
    ]);
  }
  async function download() {
    if (!profile.published)
      return flash('Publiez votre Qard avant de télécharger le QR');
    const target = canvas.current;
    if (!target) return flash('Téléchargement impossible');
    const blob = await new Promise<Blob | null>((resolve) =>
      target.toBlob(resolve, 'image/png'),
    );
    if (!blob) return flash('Téléchargement impossible');
    const file = new File([blob], `qard-${profile.slug}-qr.png`, {
      type: 'image/png',
    });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `QR Qard de ${profile.display_name}`,
        });
        await record();
        flash('QR prêt à enregistrer dans votre galerie');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
      }
    }
    const link = document.createElement('a');
    link.download = `qard-${profile.slug}-qr.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    await record();
    flash('QR téléchargé');
  }
  return (
    <div className="qr-layout">
      <section className="qr-display panel">
        <div className="qr-canvas">
          <canvas ref={canvas} />
        </div>
        <p>Scannez-le pour ouvrir votre Qard.</p>
      </section>
      <section className="panel qr-controls">
        <h2>Votre QR permanent</h2>
        {!profile.published && (
          <div className="qr-publish-warning">
            Votre Qard est masquée. Publiez-la dans « Modifier ma Qard » avant
            de partager ce QR code.
          </div>
        )}
        <p>
          Il contient uniquement votre URL publique. Vous pouvez modifier votre
          Qard sans le remplacer.
        </p>
        <label>
          URL publique
          <div className="copy-field">
            <input value={url} readOnly />
            <button
              disabled={!profile.published}
              onClick={() => {
                void navigator.clipboard.writeText(url);
                flash('Lien copié');
              }}
            >
              <Copy size={17} />
            </button>
            <a
              href={profile.published ? url : '/dashboard/editor'}
              target={profile.published ? '_blank' : undefined}
              rel="noreferrer"
            >
              <ExternalLink size={17} />
            </a>
          </div>
        </label>
        <div
          className="download-grid qr-single-action"
          aria-disabled={!profile.published}
        >
          <button
            className="button"
            onClick={() => void download()}
            disabled={!profile.published}
          >
            <Download size={17} /> Télécharger le QR
          </button>
        </div>
        <small className="qr-warning">
          Sur mobile, utilisez ensuite « Enregistrer l’image » pour l’ajouter à
          votre galerie.
        </small>
      </section>
      {toast && (
        <output className="qard-toast" aria-live="polite">
          <Check size={15} />
          {toast}
        </output>
      )}
    </div>
  );
}
