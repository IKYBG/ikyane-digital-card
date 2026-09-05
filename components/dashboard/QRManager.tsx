"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, ExternalLink, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { contrastRatio } from "@/lib/qard/qr";
import type { Profile } from "@/types/database";

export function QRManager({ profile, url }: { profile: Profile; url: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [foreground, setForeground] = useState("#080b10");
  const [background, setBackground] = useState("#ffffff");
  const [margin, setMargin] = useState(4);
  const [toast, setToast] = useState("");
  const scannable = contrastRatio(foreground, background) >= 4.5;
  const flash = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 1600);
  };
  useEffect(() => {
    if (canvas.current)
      void QRCode.toCanvas(canvas.current, url, {
        width: 680,
        margin,
        errorCorrectionLevel: "H",
        color: { dark: foreground, light: background },
      });
  }, [url, foreground, background, margin]);
  async function record() {
    const supabase = createClient();
    await Promise.all([
      supabase
        .from("qard_analytics_events")
        .insert({ profile_id: profile.id, event_type: "qr_download" }),
      supabase
        .from("qard_profiles")
        .update({ qr_downloaded_at: new Date().toISOString() })
        .eq("id", profile.id),
    ]);
  }
  async function png() {
    if (!scannable) return flash("Augmente le contraste avant de télécharger");
    const link = document.createElement("a");
    link.download = `qard-${profile.slug}-qr.png`;
    link.href = canvas.current?.toDataURL("image/png") ?? "";
    link.click();
    await record();
    flash("QR PNG téléchargé");
  }
  async function svg() {
    if (!scannable) return flash("Augmente le contraste avant de télécharger");
    const content = await QRCode.toString(url, {
      type: "svg",
      margin,
      errorCorrectionLevel: "H",
      color: { dark: foreground, light: background },
    });
    const link = document.createElement("a");
    link.download = `qard-${profile.slug}-qr.svg`;
    link.href = URL.createObjectURL(
      new Blob([content], { type: "image/svg+xml" }),
    );
    link.click();
    URL.revokeObjectURL(link.href);
    await record();
    flash("QR SVG téléchargé");
  }
  async function share() {
    if (navigator.share)
      await navigator.share({ title: `Qard de ${profile.display_name}`, url });
    else await navigator.clipboard.writeText(url);
    flash("Qard partagée");
  }
  return (
    <div className="qr-layout">
      <section className="qr-display panel">
        <div className="qr-canvas">
          <canvas ref={canvas} />
        </div>
        <p>Haute correction d’erreur · prêt pour l’impression</p>
      </section>
      <section className="panel qr-controls">
        <h2>Ton QR permanent</h2>
        <p>
          Il contient uniquement ton URL publique. Tu peux modifier ta Qard sans
          le remplacer.
        </p>
        <label>
          URL publique
          <div className="copy-field">
            <input value={url} readOnly />
            <button
              onClick={() => {
                void navigator.clipboard.writeText(url);
                flash("Lien copié");
              }}
            >
              <Copy size={17} />
            </button>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink size={17} />
            </a>
          </div>
        </label>
        <div className="field-row two">
          <label>
            Premier plan
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
            />
          </label>
          <label>
            Arrière-plan
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </label>
        </div>
        <label>
          Marge <span>{margin}</span>
          <input
            type="range"
            min="2"
            max="8"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
        </label>
        <div className="download-grid">
          <button className="button" onClick={png} disabled={!scannable}>
            <Download size={17} /> PNG HD
          </button>
          <button className="button button-ghost" onClick={svg} disabled={!scannable}>
            <Download size={17} /> SVG
          </button>
          <button className="button button-ghost" onClick={share}>
            <Share2 size={17} /> Partager
          </button>
        </div>
        <small className="qr-warning">
          {scannable
            ? "Contraste validé. Le QR conserve une marge sûre d’au moins 2 modules."
            : "Contraste insuffisant : rapproche le premier plan du noir ou l’arrière-plan du blanc."}
        </small>
      </section>
      {toast && (
        <div className="qard-toast">
          <Check size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}
