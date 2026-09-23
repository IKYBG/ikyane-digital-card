'use client';
import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  Lock,
  Palette,
  Waves,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  appearanceGradients,
  appearanceThemeCategories,
  appearanceThemes,
  type AppearanceThemeCategory,
  compatibleBackgroundValue,
  isValidBackground,
} from '@/lib/qard/appearance';
import { appearanceSchema } from '@/lib/qard/validation';
import type { Appearance, QardData } from '@/types/database';

const QardPreview = dynamic(
  () =>
    import('@/components/qard/QardPreview').then(
      (module) => module.QardPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="preview-loading">Chargement de l’aperçu…</div>
    ),
  },
);

export function AppearanceEditor({ data }: { data: QardData }) {
  const [appearance, setAppearance] = useState(data.appearance);
  const [status, setStatus] = useState('');
  const [showMobilePreview, setShowMobilePreview] = useState(true);
  const initialThemeCategory =
    appearanceThemes.find((theme) => theme.id === data.appearance.theme)
      ?.category ?? 'essential';
  const [themeCategory, setThemeCategory] =
    useState<AppearanceThemeCategory>(initialThemeCategory);
  const [activeSection, setActiveSection] = useState<
    'ambiance' | 'mouvement'
  >('ambiance');
  const appearanceRef = useRef(data.appearance);
  const saveSequence = useRef(0);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
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
    setStatus('Enregistrement…');
    const sequence = ++saveSequence.current;
    const { id, profile_id, created_at, updated_at, ...payload } = next;
    void profile_id;
    void created_at;
    void updated_at;
    const parsed = appearanceSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus('Erreur : réglage invalide');
      return;
    }
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(async () => {
        const { data: saved, error } = await createClient()
          .from('qard_appearance')
          .update(parsed.data)
          .eq('id', id)
          .eq('profile_id', data.profile.id)
          .select()
          .single();
        if (sequence !== saveSequence.current) return;
        if (error || !saved) {
          setStatus(
            error?.message
              ? `Erreur : ${error.message}`
              : 'Erreur d’enregistrement',
          );
          return;
        }
        appearanceRef.current = saved as Appearance;
        setAppearance(saved as Appearance);
        setStatus('Enregistré');
      });
    await saveQueue.current;
  }
  function pickTheme(theme: (typeof appearanceThemes)[number]) {
    if (theme.pro && data.profile.plan !== 'pro') {
      setStatus('Réservé au plan Premium');
      return;
    }
    void save({
      ...appearanceRef.current,
      theme: theme.id,
      background_type: theme.bg.startsWith('#') ? 'color' : 'gradient',
      background_value: theme.bg,
      accent_color: theme.accent,
      text_color: theme.text,
      button_style: theme.buttonStyle,
      font_family: theme.fontFamily,
      avatar_shape: theme.avatarShape,
      card_opacity: theme.cardOpacity,
      card_blur: theme.cardBlur,
      card_radius: theme.cardRadius,
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
        {showMobilePreview ? 'Masquer l’aperçu' : 'Voir l’aperçu'}
      </button>
      <div className="appearance-controls">
        <section className="panel appearance-studio appearance-studio-v2">
          <header className="appearance-studio-head">
            <div>
              <span>Studio</span>
              <h2>Apparence</h2>
              <p>
                Modifiez un aspect à la fois. L’aperçu se met à jour
                immédiatement.
              </p>
            </div>
            <output
              aria-live="polite"
              className={status.startsWith('Erreur') ? 'is-error' : ''}
            >
              {status}
            </output>
          </header>
          <nav className="appearance-tabs" aria-label="Catégories d’apparence">
            {[
              ['ambiance', 'Ambiance', Palette],
              ['mouvement', 'Mouvement', Waves],
            ].map(([id, label, Icon]) => (
              <button
                key={id as string}
                type="button"
                className={activeSection === id ? 'active' : ''}
                onClick={() => setActiveSection(id as typeof activeSection)}
                aria-pressed={activeSection === id}
              >
                <Icon size={17} />
                <span>{label as string}</span>
              </button>
            ))}
          </nav>

          <div className="appearance-stage">
            {activeSection === 'ambiance' && (
              <section className="appearance-stage-section">
                <div className="appearance-stage-heading">
                  <h3>Ambiance</h3>
                  <p>Choisissez une base, puis ajustez ses couleurs.</p>
                </div>
                <div
                  className="appearance-theme-categories"
                  role="tablist"
                  aria-label="Familles de styles"
                >
                  {appearanceThemeCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      role="tab"
                      aria-selected={themeCategory === category.id}
                      className={themeCategory === category.id ? 'active' : ''}
                      onClick={() => setThemeCategory(category.id)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
                <div className="theme-grid appearance-theme-grid">
                  {appearanceThemes
                    .filter((theme) => theme.category === themeCategory)
                    .map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        className={`appearance-theme-card${appearance.theme === theme.id ? ' selected' : ''}`}
                        onClick={() => pickTheme(theme)}
                      >
                        <span
                          className="appearance-theme-visual"
                          style={{ background: theme.bg, color: theme.text }}
                        >
                          <span className="appearance-theme-visual-head">
                            <small>Qard</small>
                            <i style={{ background: theme.accent }} />
                          </span>
                          <span className="appearance-theme-portrait" />
                          <span className="appearance-theme-lines">
                            <b />
                            <i />
                          </span>
                          <span
                            className="appearance-theme-visual-action"
                            style={{
                              background:
                                theme.buttonStyle === 'solid'
                                  ? theme.accent
                                  : 'transparent',
                              borderColor: theme.accent,
                            }}
                          />
                        </span>
                        <span className="appearance-theme-meta">
                          <b>{theme.name}</b>
                          <small>{theme.description}</small>
                        </span>
                        <span className="appearance-theme-state">
                          {theme.pro && data.profile.plan !== 'pro' && (
                            <Lock size={13} aria-label="Premium" />
                          )}
                          {appearance.theme === theme.id && (
                            <Check size={15} aria-label="Sélectionné" />
                          )}
                        </span>
                      </button>
                    ))}
                </div>
                <div className="appearance-divider" />
                <div className="appearance-color-grid">
                  <label>
                    <input
                      aria-label="Couleur d’accent"
                      type="color"
                      value={appearance.accent_color}
                      onChange={(e) =>
                        updateDraft({ accent_color: e.target.value })
                      }
                      onBlur={() => void save(appearanceRef.current)}
                    />
                    <span>
                      <b>Accent</b>
                      <small>Bordures et détails</small>
                    </span>
                  </label>
                  <label>
                    <input
                      aria-label="Couleur du texte"
                      type="color"
                      value={appearance.text_color}
                      onChange={(e) =>
                        updateDraft({ text_color: e.target.value })
                      }
                      onBlur={() => void save(appearanceRef.current)}
                    />
                    <span>
                      <b>Texte</b>
                      <small>Nom et informations</small>
                    </span>
                  </label>
                </div>
                <div className="visual-option-grid background-options">
                  {[
                    ['color', 'Uni', 'Une couleur nette'],
                    ['gradient', 'Dégradé', 'Une lumière progressive'],
                    ['image', 'Image', 'Votre propre univers'],
                  ].map(([item, label, help]) => (
                    <button
                      key={item}
                      className={
                        appearance.background_type === item ? 'selected' : ''
                      }
                      onClick={() => {
                        const backgroundType =
                          item as Appearance['background_type'];
                        const current = appearanceRef.current;
                        const backgroundValue = compatibleBackgroundValue(
                          backgroundType,
                          current.background_value,
                          current.theme,
                          data.profile.banner_url ?? data.profile.avatar_url,
                        );
                        void save(
                          updateDraft({
                            background_type: backgroundType,
                            background_value: backgroundValue,
                          }),
                        );
                      }}
                    >
                      <i className={`background-demo ${item}`} />
                      <span>
                        <b>{label}</b>
                        <small>{help}</small>
                      </span>
                      {appearance.background_type === item && (
                        <Check size={15} />
                      )}
                    </button>
                  ))}
                </div>
                {appearance.background_type === 'color' && (
                  <label className="appearance-value-field appearance-background-color">
                    <span>Couleur du fond</span>
                    <input
                      aria-label="Couleur du fond"
                      type="color"
                      value={appearance.background_value}
                      onChange={(e) =>
                        updateDraft({ background_value: e.target.value })
                      }
                      onBlur={() => void save(appearanceRef.current)}
                    />
                  </label>
                )}
                {appearance.background_type === 'gradient' && (
                  <div
                    className="appearance-gradient-grid"
                    aria-label="Dégradés"
                  >
                    {appearanceGradients.map(([label, value]) => (
                      <button
                        type="button"
                        key={label}
                        aria-label={`Dégradé ${label}`}
                        aria-pressed={appearance.background_value === value}
                        className={
                          appearance.background_value === value
                            ? 'selected'
                            : ''
                        }
                        style={{ background: value }}
                        onClick={() =>
                          void save(updateDraft({ background_value: value }))
                        }
                      >
                        <span>{label}</span>
                        {appearance.background_value === value && (
                          <Check size={15} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {appearance.background_type === 'image' && (
                  <label className="appearance-value-field">
                    <span>Adresse HTTPS de l’image</span>
                    <input
                      type="url"
                      placeholder="https://…"
                      value={appearance.background_value}
                      aria-invalid={
                        Boolean(appearance.background_value) &&
                        !isValidBackground('image', appearance.background_value)
                      }
                      onChange={(e) =>
                        updateDraft({ background_value: e.target.value })
                      }
                      onBlur={() => {
                        if (
                          !isValidBackground(
                            'image',
                            appearanceRef.current.background_value,
                          )
                        ) {
                          setStatus(
                            'Erreur : utilisez une adresse d’image HTTPS valide',
                          );
                          return;
                        }
                        void save(appearanceRef.current);
                      }}
                    />
                    <small>
                      Visible au verso et comme fond lorsque la photo est
                      masquée.
                    </small>
                  </label>
                )}
                <label className="visual-toggle">
                  <span className="photo-demo">
                    <ImageIcon size={19} />
                  </span>
                  <span>
                    <b>Afficher ma photo</b>
                    <small>
                      {data.profile.avatar_url || data.profile.banner_url
                        ? 'Utilise votre portrait sur la face avant'
                        : 'Ajoutez d’abord une photo dans Profil'}
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={appearance.show_banner}
                    disabled={
                      !data.profile.avatar_url && !data.profile.banner_url
                    }
                    onChange={(e) =>
                      void save(updateDraft({ show_banner: e.target.checked }))
                    }
                  />
                </label>
              </section>
            )}

            {activeSection === 'mouvement' && (
              <section className="appearance-stage-section">
                <div className="appearance-stage-heading">
                  <h3>Mouvement</h3>
                  <p>Définissez l’arrivée de la carte à l’écran.</p>
                </div>
                <div className="visual-option-grid motion-options">
                  {[
                    ['none', 'Fixe'],
                    ['fade', 'Fondu'],
                    ['slide', 'Glissement'],
                    ['subtle-scale', 'Approche'],
                  ].map(([item, label]) => (
                    <button
                      key={item}
                      className={
                        appearance.animation_style === item ? 'selected' : ''
                      }
                      onClick={() =>
                        void save(
                          updateDraft({
                            animation_style: item,
                            animation_enabled: item !== 'none',
                          }),
                        )
                      }
                    >
                      <i className={item} />
                      <span>
                        <b>{label}</b>
                      </span>
                      {appearance.animation_style === item && (
                        <Check size={15} />
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

          </div>
        </section>
      </div>
      <aside
        className={`editor-preview appearance-live-preview${showMobilePreview ? ' mobile-visible' : ''}`}
      >
        <div className="phone-frame">
          <QardPreview
            key={`${appearance.animation_enabled}-${appearance.animation_style}`}
            data={preview}
            compact
          />
        </div>
      </aside>
    </div>
  );
}
