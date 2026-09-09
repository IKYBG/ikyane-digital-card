'use client';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getPublicProfileUrl } from '@/lib/qard/url';
import { normalizeSocialUrl } from '@/lib/qard/social';
import { slugSchema } from '@/lib/qard/validation';
import type { Profile } from '@/types/database';

export function OnboardingFlow({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.display_name);
  const [slug, setSlug] = useState(profile.slug);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [contactType, setContactType] = useState('instagram');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const canContinue =
    step === 0
      ? Boolean(name.trim())
      : step === 1
        ? status === 'Disponible'
        : true;
  async function checkSlug() {
    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) return parsed.error.issues[0].message;
    if (parsed.data === profile.slug) return '';
    const response = await fetch(
      `/api/slugs/${encodeURIComponent(parsed.data)}`,
    );
    const result = await response.json();
    return result.available
      ? ''
      : (result.error ?? 'Cet identifiant est déjà pris.');
  }
  useEffect(() => {
    if (step !== 1) return;
    const timer = window.setTimeout(async () => {
      const parsed = slugSchema.safeParse(slug);
      if (!parsed.success) return setStatus(parsed.error.issues[0].message);
      if (parsed.data === profile.slug) return setStatus('Disponible');
      const response = await fetch(
        `/api/slugs/${encodeURIComponent(parsed.data)}`,
      );
      const result = await response.json();
      setStatus(
        result.available
          ? 'Disponible'
          : (result.error ?? 'Cet identifiant est déjà pris.'),
      );
    }, 350);
    return () => window.clearTimeout(timer);
  }, [slug, step, profile.slug]);
  async function next() {
    setStatus('');
    if (step === 0 && !name.trim()) return setStatus('Entre ton nom.');
    if (step === 1) {
      const error = await checkSlug();
      if (error) return setStatus(error);
    }
    setStep((value) => Math.min(3, value + 1));
  }
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 5_242_880
    )
      return setStatus('Utilise une image JPG, PNG ou WebP de moins de 5 Mo.');
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Session expirée');
      const path = `${user.user.id}/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, file);
      if (error) throw error;
      setAvatarUrl(
        supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload impossible');
    } finally {
      setBusy(false);
    }
  }
  async function finish(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus('');
    try {
      const supabase = createClient();
      const cleanSlug = slugSchema.parse(slug);
      if (cleanSlug !== profile.slug) {
        const response = await fetch('/api/profile/slug', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slug: cleanSlug }),
        });
        if (!response.ok) throw new Error((await response.json()).error);
      }
      const { error } = await supabase
        .from('qard_profiles')
        .update({
          display_name: name.trim(),
          avatar_url: avatarUrl,
          onboarding_completed: true,
        })
        .eq('id', profile.id);
      if (error) throw error;
      if (contact.trim()) {
        const { error: linkError } = await supabase
          .from('qard_social_links')
          .insert({
            profile_id: profile.id,
            platform: contactType,
            label: null,
            url: normalizeSocialUrl(contactType, contact),
            username: contact.replace(/^@/, ''),
            position: 0,
            enabled: true,
          });
        if (linkError) throw linkError;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Création impossible');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="onboarding-card" onSubmit={finish}>
      <header>
        <b>Qard</b>
        <span>0{step + 1} / 04</span>
      </header>
      <div className="onboarding-progress">
        <i style={{ width: `${(step + 1) * 25}%` }} />
      </div>
      {step === 0 && (
        <section>
          <span>Ton identité</span>
          <h1>Comment veux-tu apparaître sur Qard ?</h1>
          <label>
            Nom affiché
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
          </label>
        </section>
      )}
      {step === 1 && (
        <section>
          <span>Ton adresse</span>
          <h1>Choisis ton identifiant public.</h1>
          <label>
            Username
            <div className="slug-input">
              <em>@</em>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase());
                  setStatus('Vérification…');
                }}
              />
            </div>
          </label>
          <p className="url-preview">{getPublicProfileUrl(slug)}</p>
        </section>
      )}
      {step === 2 && (
        <section>
          <span>Ton visage</span>
          <h1>Ajoute une photo, si tu veux.</h1>
          <label className="upload-zone">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={upload}
            />
            <span>
              {avatarUrl ? (
                <Check />
              ) : busy ? (
                <Loader2 className="spin" />
              ) : (
                <Upload />
              )}
            </span>
            <strong>{avatarUrl ? 'Photo ajoutée' : 'Choisir une image'}</strong>
            <small>JPG, PNG ou WebP · 5 Mo max</small>
          </label>
        </section>
      )}
      {step === 3 && (
        <section>
          <span>Premier contact</span>
          <h1>Comment peut-on te retrouver ?</h1>
          <label>
            Type
            <select
              value={contactType}
              onChange={(e) => setContactType(e.target.value)}
            >
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="github">GitHub</option>
              <option value="phone">Téléphone</option>
              <option value="email">Email</option>
              <option value="website">Site web</option>
            </select>
          </label>
          <label>
            Identifiant ou adresse
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="@lucas ou https://…"
            />
          </label>
        </section>
      )}
      {status && (
        <p
          className={`form-message ${status === 'Disponible' ? 'success' : status === 'Vérification…' ? 'info' : 'error'}`}
        >
          {status === 'Disponible' && <Check size={15} />} {status}
        </p>
      )}
      <footer>
        {step > 0 ? (
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={17} /> Retour
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            type="button"
            className="button"
            onClick={next}
            disabled={busy || !canContinue}
          >
            {step === 2 && !avatarUrl ? 'Passer' : 'Continuer'}{' '}
            <ArrowRight size={17} />
          </button>
        ) : (
          <button className="button" disabled={busy}>
            {contact.trim() ? 'Créer ma Qard' : 'Créer sans contact'}{' '}
            <ArrowRight size={17} />
          </button>
        )}
      </footer>
    </form>
  );
}
