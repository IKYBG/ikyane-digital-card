"use client";
import { useMemo, useState } from "react";
import { Check, Lock } from "lucide-react";
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
  const preview = useMemo(() => ({ ...data, appearance }), [data, appearance]);
  async function save(next: Appearance) {
    setAppearance(next);
    setStatus("Enregistrement…");
    const { id, profile_id, created_at, updated_at, ...payload } = next;
    void id;
    void profile_id;
    void created_at;
    void updated_at;
    const { error } = await createClient()
      .from("qard_appearance")
      .update(payload)
      .eq("id", appearance.id);
    setStatus(error ? "Erreur" : "Enregistré");
  }
  function pickTheme(theme: (typeof themes)[number]) {
    if (theme.pro && data.profile.plan !== "pro") return;
    void save({
      ...appearance,
      theme: theme.id,
      background_type: theme.bg.startsWith("#") ? "color" : "gradient",
      background_value: theme.bg,
      accent_color: theme.accent,
      text_color: theme.text,
    });
  }
  return (
    <div className="appearance-layout">
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
        <section className="panel appearance-fields">
          <h2>Réglages</h2>
          <div className="field-row two">
            <label>
              Accent
              <input
                type="color"
                value={appearance.accent_color}
                onChange={(e) =>
                  void save({ ...appearance, accent_color: e.target.value })
                }
              />
            </label>
            <label>
              Texte
              <input
                type="color"
                value={appearance.text_color}
                onChange={(e) =>
                  void save({ ...appearance, text_color: e.target.value })
                }
              />
            </label>
          </div>
          <div className="field-row two">
            <label>
              Type d’arrière-plan
              <select
                value={appearance.background_type}
                onChange={(e) =>
                  void save({
                    ...appearance,
                    background_type: e.target.value as Appearance["background_type"],
                  })
                }
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
              onChange={(e) =>
                setAppearance({
                  ...appearance,
                  background_value: e.target.value,
                })
              }
              onBlur={() => void save(appearance)}
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
              onChange={(e) =>
                setAppearance({
                  ...appearance,
                  card_opacity: Number(e.target.value) / 100,
                })
              }
              onPointerUp={() => void save(appearance)}
            />
          </label>
          <label>
            Flou <span>{appearance.card_blur}px</span>
            <input
              type="range"
              min="0"
              max="32"
              value={appearance.card_blur}
              onChange={(e) =>
                setAppearance({
                  ...appearance,
                  card_blur: Number(e.target.value),
                })
              }
              onPointerUp={() => void save(appearance)}
            />
          </label>
          <label>
            Rayon <span>{appearance.card_radius}px</span>
            <input
              type="range"
              min="0"
              max="48"
              value={appearance.card_radius}
              onChange={(e) =>
                setAppearance({
                  ...appearance,
                  card_radius: Number(e.target.value),
                })
              }
              onPointerUp={() => void save(appearance)}
            />
          </label>
          <div className="segmented-field">
            <span>Boutons</span>
            {["glass", "solid", "outline", "minimal"].map((item) => (
              <button
                key={item}
                className={appearance.button_style === item ? "active" : ""}
                onClick={() => void save({ ...appearance, button_style: item })}
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
                onClick={() => void save({ ...appearance, avatar_shape: item })}
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
                onClick={() => void save({ ...appearance, font_family: item })}
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
                  void save({
                    ...appearance,
                    animation_style: item,
                    animation_enabled: item !== "none",
                  })
                }
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </div>
      <aside className="editor-preview">
        <div className="phone-frame">
          <QardPreview data={preview} compact />
        </div>
      </aside>
    </div>
  );
}
