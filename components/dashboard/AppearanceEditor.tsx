"use client";
import { useMemo, useRef, useState } from "react";
import { Check, Eye, EyeOff, ImageIcon, Lock, MousePointerClick, Palette, Shapes, Type, Waves } from "lucide-react";
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
  const [activeSection, setActiveSection] = useState<"ambiance" | "elements" | "texte" | "mouvement" | "finition">("ambiance");
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
        <section className="panel appearance-studio appearance-studio-v2">
          <header className="appearance-studio-head">
            <div><span>Studio</span><h2>Apparence</h2><p>Modifiez un aspect à la fois. L’aperçu se met à jour immédiatement.</p></div>
            <small className={status.startsWith("Erreur") ? "is-error" : ""}>{status}</small>
          </header>
          <nav className="appearance-tabs" aria-label="Catégories d’apparence">
            {[
              ["ambiance", "Ambiance", Palette],
              ["elements", "Éléments", MousePointerClick],
              ["texte", "Texte", Type],
              ["mouvement", "Mouvement", Waves],
              ["finition", "Finition", Shapes],
            ].map(([id, label, Icon]) => (
              <button key={id as string} type="button" className={activeSection === id ? "active" : ""} onClick={() => setActiveSection(id as typeof activeSection)} aria-pressed={activeSection === id}>
                <Icon size={17} /><span>{label as string}</span>
              </button>
            ))}
          </nav>

          <div className="appearance-stage">
            {activeSection === "ambiance" && <section className="appearance-stage-section">
              <div className="appearance-stage-heading"><h3>Ambiance</h3><p>Choisissez une base, puis ajustez ses couleurs.</p></div>
              <div className="theme-grid appearance-theme-grid">
                {themes.map((theme) => (
                  <button key={theme.id} className={appearance.theme === theme.id ? "selected" : ""} onClick={() => pickTheme(theme)} style={{ background: theme.bg, color: theme.text }}>
                    <i style={{ background: theme.accent }} />
                    {theme.name}
                    {theme.pro && data.profile.plan !== "pro" && <Lock size={13} />}
                    {appearance.theme === theme.id && <Check size={15} />}
                  </button>
                ))}
              </div>
              <div className="appearance-divider" />
              <div className="appearance-color-grid">
                <label><input aria-label="Couleur d’accent" type="color" value={appearance.accent_color} onChange={(e) => updateDraft({ accent_color: e.target.value })} onBlur={() => void save(appearanceRef.current)} /><span><b>Accent</b><small>Bordures et détails</small></span></label>
                <label><input aria-label="Couleur du texte" type="color" value={appearance.text_color} onChange={(e) => updateDraft({ text_color: e.target.value })} onBlur={() => void save(appearanceRef.current)} /><span><b>Texte</b><small>Nom et informations</small></span></label>
              </div>
              <div className="visual-option-grid background-options">
                {[
                  ["color", "Uni", "Une couleur nette"],
                  ["gradient", "Dégradé", "Une lumière progressive"],
                  ["image", "Image", "Votre propre univers"],
                ].map(([item, label, help]) => <button key={item} className={appearance.background_type === item ? "selected" : ""} onClick={() => void save(updateDraft({ background_type: item as Appearance["background_type"] }))}><i className={`background-demo ${item}`} /><span><b>{label}</b><small>{help}</small></span>{appearance.background_type === item && <Check size={15} />}</button>)}
              </div>
              <label className="appearance-value-field"><span>{appearance.background_type === "image" ? "Adresse de l’image" : "Couleur ou dégradé"}</span><input value={appearance.background_value} onChange={(e) => updateDraft({ background_value: e.target.value })} onBlur={() => void save(appearanceRef.current)} /></label>
              <label className="visual-toggle"><span className="photo-demo"><ImageIcon size={19} /></span><span><b>Afficher ma photo</b><small>Utilise votre portrait sur la face avant</small></span><input type="checkbox" checked={appearance.show_banner} onChange={(e) => void save(updateDraft({ show_banner: e.target.checked }))} /></label>
            </section>}

            {activeSection === "elements" && <section className="appearance-stage-section">
              <div className="appearance-stage-heading"><h3>Éléments</h3><p>Le style des boutons et de votre photo.</p></div>
              <div className="visual-option-grid button-options">
                {[["glass", "Verre"], ["solid", "Plein"], ["outline", "Contour"], ["minimal", "Minimal"]].map(([item, label]) => <button key={item} className={appearance.button_style === item ? "selected" : ""} onClick={() => void save(updateDraft({ button_style: item }))}><i className={`button-demo ${item}`}>Aa</i><span><b>{label}</b></span>{appearance.button_style === item && <Check size={15} />}</button>)}
              </div>
              <div className="visual-option-grid shape-options">
                {[["circle", "Rond"], ["rounded", "Doux"], ["square", "Carré"]].map(([item, label]) => <button key={item} className={appearance.avatar_shape === item ? "selected" : ""} onClick={() => void save(updateDraft({ avatar_shape: item }))}><i className={`shape-demo ${item}`} /><span><b>{label}</b></span>{appearance.avatar_shape === item && <Check size={15} />}</button>)}
              </div>
            </section>}

            {activeSection === "texte" && <section className="appearance-stage-section">
              <div className="appearance-stage-heading"><h3>Typographie</h3><p>Choisissez la personnalité de vos textes.</p></div>
              <div className="visual-option-grid font-options">
                {[["geist", "Moderne"], ["inter", "Neutre"], ["serif", "Éditorial"], ["mono", "Technique"]].map(([item, label]) => <button key={item} className={`${item}${appearance.font_family === item ? " selected" : ""}`} onClick={() => void save(updateDraft({ font_family: item }))}><i>Aa</i><span><b>{label}</b></span>{appearance.font_family === item && <Check size={15} />}</button>)}
              </div>
            </section>}

            {activeSection === "mouvement" && <section className="appearance-stage-section">
              <div className="appearance-stage-heading"><h3>Mouvement</h3><p>Définissez l’arrivée de la carte à l’écran.</p></div>
              <div className="visual-option-grid motion-options">
                {[["none", "Fixe"], ["fade", "Fondu"], ["slide", "Glissement"], ["subtle-scale", "Approche"]].map(([item, label]) => <button key={item} className={appearance.animation_style === item ? "selected" : ""} onClick={() => void save(updateDraft({ animation_style: item, animation_enabled: item !== "none" }))}><i className={item} /><span><b>{label}</b></span>{appearance.animation_style === item && <Check size={15} />}</button>)}
              </div>
            </section>}

            {activeSection === "finition" && <section className="appearance-stage-section">
              <div className="appearance-stage-heading"><h3>Finition</h3><p>Ajustez doucement la matière de la carte.</p></div>
              <div className="material-controls">
              <label><span><b>Opacité</b><small>{Math.round(appearance.card_opacity * 100)}%</small></span><input aria-label="Opacité de la carte" type="range" min="35" max="100" value={appearance.card_opacity * 100} onChange={(e) => updateDraft({ card_opacity: Number(e.target.value) / 100 })} onPointerUp={() => void save(appearanceRef.current)} onKeyUp={() => void save(appearanceRef.current)} /></label>
              <label><span><b>Flou</b><small>{appearance.card_blur}px</small></span><input aria-label="Flou de la carte" type="range" min="0" max="32" value={appearance.card_blur} onChange={(e) => updateDraft({ card_blur: Number(e.target.value) })} onPointerUp={() => void save(appearanceRef.current)} onKeyUp={() => void save(appearanceRef.current)} /></label>
              <label><span><b>Coins</b><small>{appearance.card_radius}px</small></span><input aria-label="Arrondi des coins" type="range" min="0" max="48" value={appearance.card_radius} onChange={(e) => updateDraft({ card_radius: Number(e.target.value) })} onPointerUp={() => void save(appearanceRef.current)} onKeyUp={() => void save(appearanceRef.current)} /></label>
              </div>
            </section>}
          </div>
        </section>
      </div>
      <aside className={`editor-preview appearance-live-preview${showMobilePreview ? " mobile-visible" : ""}`}>
        <div className="phone-frame">
          <QardPreview data={preview} compact />
        </div>
      </aside>
    </div>
  );
}
