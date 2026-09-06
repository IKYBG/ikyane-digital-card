"use client";
import { useMemo, useRef, useState } from "react";
import { Check, Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { QardPreview } from "@/components/qard/QardPreview";
import type { Appearance, QardData } from "@/types/database";

const themes = [
  {
    id: "midnight-glass",
    name: "Midnight Glass",
    bg: "linear-gradient(145deg, #06101f, #0a2850)",
    accent: "#8fd4ff",
    text: "#f7fbff",
    pro: false,
  },
  {
    id: "frost",
    name: "Frost",
    bg: "linear-gradient(145deg, #dce8ef, #f8fbfc)",
    accent: "#1565c0",
    text: "#10212e",
    pro: false,
  },
  {
    id: "graphite",
    name: "Graphite",
    bg: "linear-gradient(145deg, #181b20, #060708)",
    accent: "#d7ff58",
    text: "#f5f7f8",
    pro: false,
  },
  {
    id: "pearl",
    name: "Pearl",
    bg: "linear-gradient(145deg, #f6f2e9, #d9d2c5)",
    accent: "#715d3e",
    text: "#211d17",
    pro: true,
  },
  {
    id: "aurora",
    name: "Aurora",
    bg: "linear-gradient(145deg, #10253a, #322555)",
    accent: "#9ef7cc",
    text: "#f7f5ff",
    pro: true,
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    bg: "#090a0c",
    accent: "#ffffff",
    text: "#ffffff",
    pro: true,
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    bg: "#f5f5f2",
    accent: "#111111",
    text: "#111111",
    pro: true,
  },
] as const;
export function AppearanceEditor({ data }: { data: QardData }) {
  const [appearance, setAppearance] = useState(data.appearance);
  const [status, setStatus] = useState("");
  const [showMobilePreview, setShowMobilePreview] = useState(true);
  const appearanceRef = useRef(data.appearance);
  const saveSequence = useRef(0);
  const preview = useMemo(() => ({ ...data, appearance }), [data, appearance]);

  function updateDraft(patch: Partial<Appearance>) {
    const next = { ...appearanceRef.current, ...patch };
    appearanceRef.current = next;
    setAppearance(next);
    return next;
  }

  async function save(next: Appearance) {
    appearanceRef.current = next;
    setAppearance(next);
    setStatus("Enregistrement…");
    const sequence = ++saveSequence.current;
    const { id, profile_id, created_at, updated_at, ...payload } = next;
    void profile_id;
    void created_at;
    void updated_at;
    const { data: saved, error } = await createClient()
      .from("qard_appearance")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (sequence !== saveSequence.current) return;
    if (error || !saved) {
      setStatus(error?.message ? `Erreur : ${error.message}` : "Erreur d’enregistrement");
      return;
    }
    appearanceRef.current = saved as Appearance;
    setAppearance(saved as Appearance);
    setStatus("Enregistré");
  }
  function pickTheme(theme: (typeof themes)[number]) {
    if (theme.pro && data.profile.plan !== "pro") return;
    void save({
      ...appearanceRef.current,
      theme: theme.id,
      background_type: theme.bg.startsWith("#") ? "color" : "gradient",
      background_value: theme.bg,
      accent_color: theme.accent,
      text_color: theme.text,
    });
  }
  return (
    <div className="appearance-layout">
      <button
        type="button"
        className="mobile-preview-toggle"
        onClick={() => setShowMobilePreview((current) => !current)}
      >
        {showMobilePreview ? <EyeOff size={16} /> : <Eye size={16} />}
        {showMobilePreview ? "Masquer l’aperçu" : "Voir l’aperçu"}
      </button>
      <div className="appearance-controls">
        <section className="panel">
          <div className="control-heading">
            <h2>Thèmes</h2>
            <span>{status}</span>
          </div>
          <div className="theme-grid">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={appearance.theme === theme.id ? "selected" : ""}
                onClick={() => pickTheme(theme)}
                style={{ background: theme.bg, color: theme.text }}
              >
                <i style={{ background: theme.accent }} />
                {theme.name}
                {theme.pro && data.profile.plan !== "pro" && <Lock size={13} />}
                {appearance.theme === theme.id && <Check size={15} />}
              </button>
            ))}
          </div>
        </section>
        <details className="panel appearance-fields">
          <summary>Réglages avancés</summary>
          <div className="appearance-fields-body">
          <div className="field-row two">
            <label>
              Accent
              <input
                type="color"
                value={appearance.accent_color}
                onChange={(e) => updateDraft({ accent_color: e.target.value })}
                onBlur={() => void save(appearanceRef.current)}
              />
            </label>
            <label>
              Texte
              <input
                type="color"
                value={appearance.text_color}
                onChange={(e) => updateDraft({ text_color: e.target.value })}
                onBlur={() => void save(appearanceRef.current)}
              />
            </label>
          </div>
          <div className="field-row two">
            <label>
              Type d’arrière-plan
              <select
                value={appearance.background_type}
                onChange={(e) => void save(updateDraft({ background_type: e.target.value as Appearance["background_type"] }))}
              >
                <option value="color">Couleur</option>
                <option value="gradient">Dégradé CSS</option>
                <option value="image">URL d’image</option>
              </select>
            </label>
          <label>
            {appearance.background_type === "image" ? "URL de l’image" : "Valeur"}
            <input
              value={appearance.background_value}
              onChange={(e) => updateDraft({ background_value: e.target.value })}
              onBlur={() => void save(appearanceRef.current)}
            />
          </label>
          </div>
          <label>
            Transparence{" "}
            <span>{Math.round(appearance.card_opacity * 100)}%</span>
            <input
              type="range"
              min="35"
              max="100"
              value={appearance.card_opacity * 100}
              onChange={(e) => updateDraft({ card_opacity: Number(e.target.value) / 100 })}
              onPointerUp={() => void save(appearanceRef.current)}
              onKeyUp={() => void save(appearanceRef.current)}
            />
          </label>
          <label>
            Flou <span>{appearance.card_blur}px</span>
            <input
              type="range"
              min="0"
              max="32"
              value={appearance.card_blur}
              onChange={(e) => updateDraft({ card_blur: Number(e.target.value) })}
              onPointerUp={() => void save(appearanceRef.current)}
              onKeyUp={() => void save(appearanceRef.current)}
            />
          </label>
          <label>
            Rayon <span>{appearance.card_radius}px</span>
            <input
              type="range"
              min="0"
              max="48"
              value={appearance.card_radius}
              onChange={(e) => updateDraft({ card_radius: Number(e.target.value) })}
              onPointerUp={() => void save(appearanceRef.current)}
              onKeyUp={() => void save(appearanceRef.current)}
            />
          </label>
          <label className="toggle-row appearance-photo-toggle">
            <span>Photo de fond<small>Afficher votre photo sur la face principale.</small></span>
            <input
              type="checkbox"
              checked={appearance.show_banner}
              onChange={(e) => void save(updateDraft({ show_banner: e.target.checked }))}
            />
          </label>
          <div className="segmented-field">
            <span>Boutons</span>
            {["glass", "solid", "outline", "minimal"].map((item) => (
              <button
                key={item}
                className={appearance.button_style === item ? "active" : ""}
                onClick={() => void save(updateDraft({ button_style: item }))}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="segmented-field">
            <span>Avatar</span>
            {["circle", "rounded", "square"].map((item) => (
              <button
                key={item}
                className={appearance.avatar_shape === item ? "active" : ""}
                onClick={() => void save(updateDraft({ avatar_shape: item }))}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="segmented-field">
            <span>Typographie</span>
            {[
              ["geist", "Geist"],
              ["inter", "Inter"],
              ["serif", "Serif"],
              ["mono", "Mono"],
            ].map(([item, label]) => (
              <button
                key={item}
                className={appearance.font_family === item ? "active" : ""}
                onClick={() => void save(updateDraft({ font_family: item }))}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="segmented-field">
            <span>Animation</span>
            {["none", "fade", "slide", "subtle-scale"].map((item) => (
              <button
                key={item}
                className={appearance.animation_style === item ? "active" : ""}
                onClick={() =>
                  void save(updateDraft({
                    animation_style: item,
                    animation_enabled: item !== "none",
                  }))
                }
              >
                {item}
              </button>
            ))}
          </div>
          </div>
        </details>
      </div>
      <aside className={`editor-preview appearance-live-preview${showMobilePreview ? " mobile-visible" : ""}`}>
        <div className="phone-frame">
          <QardPreview data={preview} compact />
        </div>
      </aside>
    </div>
  );
}
