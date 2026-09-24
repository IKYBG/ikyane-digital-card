'use client';
import dynamic from 'next/dynamic';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { profileSchema, socialLinkSchema } from '@/lib/qard/validation';
import type { QardData, SocialLink } from '@/types/database';
import { normalizeSocialUrl } from '@/lib/qard/social';
import { MediaUploader } from './MediaUploader';
import { z } from 'zod';

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

type Values = z.infer<typeof profileSchema>;
const mobileQuestions = [
  {
    kind: 'profile',
    field: 'email_public',
    label: 'Quel est votre email public ?',
    hint: 'Il permettra de vous écrire directement.',
    placeholder: 'vous@exemple.fr',
    type: 'email',
  },
  {
    kind: 'profile',
    field: 'phone_public',
    label: 'Quel est votre numéro de téléphone ?',
    hint: 'Vos contacts pourront vous appeler en un geste.',
    placeholder: '+33 6 00 00 00 00',
    type: 'tel',
  },
  {
    kind: 'profile',
    field: 'website',
    label: 'Avez-vous un site web ?',
    hint: 'Portfolio, boutique ou page personnelle.',
    placeholder: 'https://votresite.fr',
    type: 'url',
  },
  {
    kind: 'social',
    field: 'instagram',
    label: 'Quel est votre Instagram ?',
    hint: 'Votre identifiant suffit.',
    placeholder: '@votrecompte',
    type: 'text',
  },
  {
    kind: 'social',
    field: 'snapchat',
    label: 'Quel est votre Snapchat ?',
    hint: 'Ajoutez votre nom d’utilisateur.',
    placeholder: 'votrecompte',
    type: 'text',
  },
  {
    kind: 'social',
    field: 'tiktok',
    label: 'Quel est votre TikTok ?',
    hint: 'Ajoutez votre nom d’utilisateur.',
    placeholder: '@votrecompte',
    type: 'text',
  },
  {
    kind: 'social',
    field: 'discord',
    label: 'Quel est votre Discord ?',
    hint: 'Ajoutez votre nom d’utilisateur Discord.',
    placeholder: 'votre.pseudo',
    type: 'text',
  },
  {
    kind: 'social',
    field: 'github',
    label: 'Quel est votre GitHub ?',
    hint: 'Ajoutez votre nom d’utilisateur.',
    placeholder: 'votrecompte',
    type: 'text',
  },
] as const;

export function ProfileEditor({ data }: { data: QardData }) {
  const [avatar, setAvatar] = useState(data.profile.avatar_url);
  const [banner, setBanner] = useState(data.profile.banner_url);
  const [showBanner, setShowBanner] = useState(data.appearance.show_banner);
  const [status, setStatus] = useState<
    'idle' | 'dirty' | 'saving' | 'saved' | 'error'
  >('idle');
  const [links, setLinks] = useState(data.links);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [guideBusy, setGuideBusy] = useState(false);
  const [guideCompleted, setGuideCompleted] = useState(
    Boolean(
      data.profile.email_public?.trim() ||
      data.profile.phone_public?.trim() ||
      data.profile.website?.trim() ||
      data.links.some((link) => link.enabled),
    ),
  );
  const [guideError, setGuideError] = useState('');
  const guideRef = useRef<HTMLDialogElement>(null);
  const first = useRef(true);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const saveRevision = useRef(0);
  const {
    register,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: data.profile.display_name,
      first_name: data.profile.first_name ?? '',
      last_name: data.profile.last_name ?? '',
      headline: data.profile.headline ?? '',
      bio: data.profile.bio ?? '',
      company: data.profile.company ?? '',
      job_title: data.profile.job_title ?? '',
      location: data.profile.location ?? '',
      email_public: data.profile.email_public ?? '',
      phone_public: data.profile.phone_public ?? '',
      website: data.profile.website ?? '',
      published: data.profile.published,
      show_branding: data.profile.show_branding,
    },
  });
  const values = watch();
  const deferredValues = useDeferredValue(values);
  const deferredLinks = useDeferredValue(links);
  const hasConfiguredQard = guideCompleted;
  const currentQuestion = mobileQuestions[questionIndex];
  useEffect(() => {
    if (!guideOpen || !guideRef.current) return;
    const dialog = guideRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const viewport = window.visualViewport;
    const updateViewport = () => {
      dialog.style.setProperty(
        '--guide-height',
        `${viewport?.height ?? window.innerHeight}px`,
      );
      dialog.style.setProperty('--guide-top', `${viewport?.offsetTop ?? 0}px`);
    };
    updateViewport();
    viewport?.addEventListener('resize', updateViewport);
    viewport?.addEventListener('scroll', updateViewport);
    return () => {
      viewport?.removeEventListener('resize', updateViewport);
      viewport?.removeEventListener('scroll', updateViewport);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [guideOpen]);
  useEffect(() => {
    if (!guideOpen) return;
    if (currentQuestion.kind === 'profile') {
      setQuestionAnswer(
        String(getValues(currentQuestion.field as keyof Values) ?? ''),
      );
      return;
    }
    const existing = links.find(
      (link) => link.platform === currentQuestion.field,
    );
    setQuestionAnswer(existing?.username ?? '');
  }, [guideOpen, questionIndex, currentQuestion, getValues, links]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus('dirty');
    const timer = window.setTimeout(async () => {
      const payload = Object.fromEntries(
        (
          Object.entries(profileSchema.shape) as Array<
            [keyof Values, z.ZodType]
          >
        ).flatMap(([key, schema]) => {
          const parsedField = schema.safeParse(values[key]);
          return parsedField.success ? [[key, parsedField.data]] : [];
        }),
      ) as Partial<Values>;
      if (Object.keys(payload).length === 0) {
        setStatus('error');
        return;
      }
      setStatus('saving');
      const revision = ++saveRevision.current;
      saveQueue.current = saveQueue.current
        .catch(() => undefined)
        .then(async () => {
          const { data: saved, error } = await createClient()
            .from('qard_profiles')
            .update(payload)
            .eq('id', data.profile.id)
            .select('id')
            .single();
          if (revision === saveRevision.current)
            setStatus(error || !saved ? 'error' : 'saved');
        });
      await saveQueue.current;
    }, 750);
    return () => window.clearTimeout(timer);
  }, [values, data.profile.id]);
  const preview = useMemo<QardData>(
    () => ({
      ...data,
      links: deferredLinks,
      appearance: {
        ...data.appearance,
        show_banner: showBanner,
      },
      profile: {
        ...data.profile,
        ...deferredValues,
        avatar_url: avatar,
        banner_url: banner,
      },
    }),
    [data, deferredValues, avatar, banner, deferredLinks, showBanner],
  );

  async function persistMedia(
    field: 'avatar_url' | 'banner_url',
    nextValue: string | null,
  ) {
    const previousValue = field === 'avatar_url' ? avatar : banner;
    const setValue = field === 'avatar_url' ? setAvatar : setBanner;
    setValue(nextValue);
    setStatus('saving');

    const supabase = createClient();
    const payload =
      field === 'avatar_url'
        ? { avatar_url: nextValue }
        : { banner_url: nextValue };
    const { data: savedProfile, error: profileError } = await supabase
      .from('qard_profiles')
      .update(payload)
      .eq('id', data.profile.id)
      .select('id')
      .single();

    if (profileError || !savedProfile) {
      setValue(previousValue);
      setStatus('error');
      throw new Error('L’image n’a pas pu être enregistrée. Réessayez.');
    }

    if (field === 'banner_url' && nextValue && !showBanner) {
      const { error: appearanceError } = await supabase
        .from('qard_appearance')
        .update({ show_banner: true })
        .eq('profile_id', data.profile.id);
      if (appearanceError) {
        setStatus('error');
        throw new Error('La bannière est enregistrée mais ne peut pas être affichée.');
      }
      setShowBanner(true);
    }

    setStatus('saved');
  }

  function advanceGuide() {
    setGuideError('');
    if (questionIndex === mobileQuestions.length - 1) {
      setGuideCompleted(
        Boolean(
          getValues('email_public') ||
          getValues('phone_public') ||
          getValues('website') ||
          links.some((link) => link.enabled),
        ),
      );
      setGuideOpen(false);
      setQuestionIndex(0);
      return;
    }
    setQuestionIndex((current) => current + 1);
  }

  async function saveGuideAnswer() {
    if (guideBusy) return;
    setGuideError('');
    const answer = questionAnswer.trim();
    if (!answer) return advanceGuide();
    if (currentQuestion.kind === 'profile') {
      const parsed =
        profileSchema.shape[currentQuestion.field].safeParse(answer);
      if (!parsed.success) {
        setGuideError(
          parsed.error.issues[0]?.message ?? 'Vérifiez cette information.',
        );
        return;
      }
      setValue(currentQuestion.field, answer, {
        shouldDirty: true,
        shouldValidate: true,
      });
      advanceGuide();
      return;
    }
    setGuideBusy(true);
    try {
      const supabase = createClient();
      const existing = links.find(
        (link) => link.platform === currentQuestion.field,
      );
      const payload = {
        platform: currentQuestion.field,
        label: null,
        url: normalizeSocialUrl(currentQuestion.field, answer),
        username: answer.replace(/^@/, ''),
        enabled: true,
      };
      const parsedLink = socialLinkSchema.safeParse(payload);
      if (!parsedLink.success) {
        setGuideBusy(false);
        setGuideError('Vérifiez cet identifiant.');
        return;
      }
      const request = existing
        ? supabase
            .from('qard_social_links')
            .update(parsedLink.data)
            .eq('id', existing.id)
            .select()
            .single()
        : supabase
            .from('qard_social_links')
            .insert({
              ...parsedLink.data,
              profile_id: data.profile.id,
              position: links.length,
            })
            .select()
            .single();
      const { data: saved, error } = await request;
      setGuideBusy(false);
      if (error || !saved) {
        setStatus('error');
        setGuideError(
          'Enregistrement impossible. Réessayez sans quitter cette étape.',
        );
        return;
      }
      setLinks((current) =>
        existing
          ? current.map((link) =>
              link.id === existing.id ? (saved as SocialLink) : link,
            )
          : [...current, saved as SocialLink],
      );
      advanceGuide();
    } catch {
      setGuideError('Connexion interrompue. Réessayez dans un instant.');
    } finally {
      setGuideBusy(false);
    }
  }

  return (
    <div className="editor-layout">
      <section className="editor-editing-column">
        <div
          className={`mobile-card-controls${hasConfiguredQard ? ' configured' : ''}`}
        >
          {!hasConfiguredQard && (
            <button
              type="button"
              className="button mobile-configure-button"
              onClick={() => {
                setQuestionIndex(0);
                setGuideOpen(true);
              }}
            >
              <SlidersHorizontal size={17} /> Configurer ma Qard
            </button>
          )}
          <button
            type="button"
            className="mobile-preview-visibility"
            onClick={() => setPreviewVisible((current) => !current)}
          >
            {previewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            {previewVisible ? 'Masquer l’aperçu' : 'Afficher l’aperçu'}
          </button>
        </div>
        <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
          <div className={`save-state ${status}`}>
            <Save size={14} />
            {status === 'dirty' ? (
              'Modifications…'
            ) : status === 'saving' ? (
              'Enregistrement…'
            ) : status === 'saved' ? (
              <>
                <Check size={14} /> Enregistré
              </>
            ) : status === 'error' ? (
              'Erreur d’enregistrement'
            ) : (
              'Autosave actif'
            )}
          </div>
          <fieldset>
            <legend>Essentiel</legend>
            <MediaUploader
              bucket="avatars"
              userId={data.profile.user_id}
              value={avatar}
              onChange={(nextAvatar) => persistMedia('avatar_url', nextAvatar)}
              label="Photo de profil"
            />
            <MediaUploader
              bucket="banners"
              userId={data.profile.user_id}
              value={banner}
              onChange={(nextBanner) => persistMedia('banner_url', nextBanner)}
              label="Bannière"
              maxMb={8}
            />
            <div className="field-row">
              <label>
                Nom affiché
                <input {...register('display_name')} />
                {errors.display_name && (
                  <small>{errors.display_name.message}</small>
                )}
              </label>
            </div>
            <label>
              Activité ou phrase courte
              <input
                {...register('headline')}
                placeholder="Designer produit indépendant"
              />
            </label>
          </fieldset>
          <details className="editor-section">
            <summary>Informations complémentaires</summary>
            <div className="editor-section-body">
              <div className="field-row two">
                <label>
                  Prénom
                  <input {...register('first_name')} />
                </label>
                <label>
                  Nom
                  <input {...register('last_name')} />
                </label>
              </div>
              <div className="field-row two">
                <label>
                  Métier
                  <input {...register('job_title')} />
                </label>
                <label>
                  Entreprise / école
                  <input {...register('company')} />
                </label>
              </div>
              <label>
                Localisation
                <input {...register('location')} />
              </label>
              <label>
                Bio
                <textarea {...register('bio')} rows={4} />
              </label>
            </div>
          </details>
          <fieldset>
            <legend>Contact</legend>
            <label>
              Email public
              <input type="email" {...register('email_public')} />
              {errors.email_public && (
                <small>{errors.email_public.message}</small>
              )}
            </label>
            <label>
              Téléphone
              <input type="tel" {...register('phone_public')} />
            </label>
            <label>
              Site web
              <input
                type="url"
                {...register('website')}
                placeholder="https://…"
              />
              {errors.website && <small>{errors.website.message}</small>}
            </label>
          </fieldset>
          <details className="editor-section">
            <summary>Publication</summary>
            <div className="editor-section-body">
              <label className="toggle-row">
                <span>
                  <b>Qard publiée</b>
                  <small>Votre profil est visible depuis son URL.</small>
                </span>
                <input
                  aria-label="Publier la Qard"
                  type="checkbox"
                  {...register('published')}
                />
              </label>
              <label className="toggle-row">
                <span>
                  <b>Branding Qard</b>
                  <small>Inclus avec le plan Free.</small>
                </span>
                <input
                  aria-label="Afficher le branding Qard"
                  type="checkbox"
                  checked={values.show_branding}
                  onChange={(e) =>
                    setValue('show_branding', e.target.checked, {
                      shouldDirty: true,
                    })
                  }
                  disabled={data.profile.plan === 'free'}
                />
              </label>
            </div>
          </details>
        </form>
      </section>
      <aside
        className={`editor-preview editor-live-card${previewVisible ? ' mobile-preview-open' : ''}`}
      >
        <div className="phone-frame">
          <QardPreview data={preview} compact />
        </div>
      </aside>
      {guideOpen && (
        <dialog
          ref={guideRef}
          className="mobile-guide"
          aria-labelledby="mobile-guide-title"
          onCancel={(event) => {
            event.preventDefault();
            setGuideOpen(false);
          }}
        >
          <div className="mobile-guide-sheet">
            <header>
              <span>
                {questionIndex + 1} / {mobileQuestions.length}
              </span>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                aria-label="Arrêter la configuration"
                autoFocus
              >
                <X size={18} />
              </button>
            </header>
            <div className="mobile-guide-progress">
              <i
                style={{
                  width: `${((questionIndex + 1) / mobileQuestions.length) * 100}%`,
                }}
              />
            </div>
            <p>Configuration guidée</p>
            <h2 id="mobile-guide-title">{currentQuestion.label}</h2>
            <small>{currentQuestion.hint}</small>
            <input
              aria-label={currentQuestion.label}
              aria-invalid={Boolean(guideError)}
              aria-describedby={guideError ? 'guide-error' : undefined}
              type={currentQuestion.type}
              value={questionAnswer}
              onChange={(event) => setQuestionAnswer(event.target.value)}
              placeholder={currentQuestion.placeholder}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void saveGuideAnswer();
                }
              }}
            />
            {guideError && (
              <p id="guide-error" className="field-error" role="alert">
                {guideError}
              </p>
            )}
            <footer>
              <button type="button" onClick={advanceGuide} disabled={guideBusy}>
                Passer
              </button>
              <button
                type="button"
                className="button"
                onClick={() => void saveGuideAnswer()}
                disabled={guideBusy}
              >
                {questionIndex === mobileQuestions.length - 1
                  ? 'Terminer'
                  : 'Continuer'}
                <ChevronRight size={17} />
              </button>
            </footer>
          </div>
        </dialog>
      )}
    </div>
  );
}
