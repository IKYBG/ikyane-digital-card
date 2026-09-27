'use client';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Download,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getPublicProfileUrl } from '@/lib/qard/url';
import { slugSchema } from '@/lib/qard/validation';
import type { Profile } from '@/types/database';

export function SettingsForm({
  profile,
  accountEmail,
}: {
  profile: Profile;
  accountEmail: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(profile.display_name);
  const [slug, setSlug] = useState(profile.slug);
  const [email, setEmail] = useState(accountEmail);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [statusTone, setStatusTone] = useState<'success' | 'error' | 'loading'>(
    'success',
  );
  const [busy, setBusy] = useState<'profile' | 'account' | 'delete' | null>(
    null,
  );
  const [slugState, setSlugState] = useState('');
  const [deleteText, setDeleteText] = useState('');
  const slugRequest = useRef(0);
  const changedSlug = slug !== profile.slug;
  useEffect(() => {
    const controller = new AbortController();
    const request = ++slugRequest.current;
    const timer = setTimeout(async () => {
      const parsed = slugSchema.safeParse(slug);
      if (!parsed.success) return setSlugState(parsed.error.issues[0].message);
      if (parsed.data === profile.slug) return setSlugState('Disponible');
      try {
        const response = await fetch(
          `/api/slugs/${encodeURIComponent(parsed.data)}`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (request === slugRequest.current)
          setSlugState(
            result.available
              ? 'Disponible'
              : (result.error ?? 'Cet identifiant est pris.'),
          );
      } catch (error) {
        if (
          !(error instanceof DOMException && error.name === 'AbortError') &&
          request === slugRequest.current
        )
          setSlugState('Vérification indisponible');
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [slug, profile.slug]);
  async function saveProfile() {
    if (!name.trim()) {
      setStatusTone('error');
      return setStatus('Ajoute un nom affiché.');
    }
    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success || slugState !== 'Disponible') {
      setStatusTone('error');
      return setStatus(
        parsed.success ? slugState : parsed.error.issues[0].message,
      );
    }
    setBusy('profile');
    setStatusTone('loading');
    setStatus('Enregistrement…');
    if (parsed.data !== profile.slug) {
      const response = await fetch('/api/profile/slug', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: parsed.data }),
      });
      if (!response.ok) {
        setBusy(null);
        setStatusTone('error');
        return setStatus((await response.json()).error);
      }
    }
    const { error } = await createClient()
      .from('qard_profiles')
      .update({ display_name: name.trim() })
      .eq('id', profile.id);
    setStatusTone(error ? 'error' : 'success');
    setStatus(error ? error.message : 'Profil enregistré');
    setBusy(null);
    router.refresh();
  }
  async function saveAccount() {
    if (!email.trim()) {
      setStatusTone('error');
      return setStatus('Ajoute une adresse email valide.');
    }
    setBusy('account');
    setStatusTone('loading');
    setStatus('Enregistrement…');
    const changes: { email?: string; password?: string } = {};
    if (email !== accountEmail) changes.email = email;
    if (password) changes.password = password;
    const { error } = await createClient().auth.updateUser(changes);
    setStatusTone(error ? 'error' : 'success');
    setStatus(
      error
        ? error.message
        : changes.email
          ? 'Vérifie le nouvel email pour confirmer.'
          : 'Compte mis à jour',
    );
    setPassword('');
    setBusy(null);
  }
  async function removeAccount() {
    if (deleteText !== 'SUPPRIMER') return;
    setBusy('delete');
    setStatusTone('loading');
    setStatus('Suppression…');
    const response = await fetch('/api/account', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ confirmation: deleteText }),
    });
    if (!response.ok) {
      setBusy(null);
      setStatusTone('error');
      return setStatus('Suppression impossible. Reconnecte-toi puis réessaie.');
    }
    router.push('/');
    router.refresh();
  }
  return (
    <div className="settings-stack">
      <section className="panel settings-section">
        <h2>Profil public</h2>
        <label>
          Nom affiché
          <input
            value={name}
            autoComplete="name"
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Identifiant
          <div className="slug-input">
            <em>@</em>
            <input
              value={slug}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
            />
          </div>
          <small className={slugState === 'Disponible' ? 'available' : ''}>
            {slugState}
          </small>
        </label>
        <p className="url-preview">{getPublicProfileUrl(slug)}</p>
        {changedSlug && (
          <div className="warning-box">
            <AlertTriangle size={18} />
            <p>
              <strong>Votre URL va changer.</strong> Votre ancienne adresse et
              vos QR déjà partagés continueront de fonctionner.
            </p>
          </div>
        )}
        <button
          className="button"
          onClick={() => void saveProfile()}
          disabled={busy !== null}
        >
          {busy === 'profile' ? (
            <Loader2 className="spin" size={17} />
          ) : (
            <Save size={17} />
          )}
          Enregistrer le profil
        </button>
      </section>
      <details className="panel settings-section settings-disclosure">
        <summary aria-label="Ouvrir les réglages du compte et de sécurité">
          <span>
            <strong>Compte et sécurité</strong>
            <small>Email, mot de passe et export des données</small>
          </span>
        </summary>
        <label>
          Email de connexion
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Nouveau mot de passe
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
          />
        </label>
        <button
          className="button button-ghost"
          onClick={() => void saveAccount()}
          disabled={busy !== null}
        >
          Mettre à jour le compte
        </button>
        <a className="button button-ghost" href="/api/account/export" download>
          <Download size={17} /> Exporter mes données
        </a>
      </details>
      <details className="panel settings-section danger-zone settings-disclosure">
        <summary aria-label="Ouvrir les options de suppression du compte">
          <span>
            <strong>Supprimer le compte</strong>
            <small>Action définitive</small>
          </span>
        </summary>
        <p>
          Cette action supprime définitivement votre compte, votre Qard, vos
          liens, vos images et vos statistiques.
        </p>
        <label>
          Écrivez SUPPRIMER pour confirmer
          <input
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
          />
        </label>
        <button
          className="danger-button"
          onClick={() => void removeAccount()}
          disabled={deleteText !== 'SUPPRIMER' || busy !== null}
        >
          <Trash2 size={17} /> Supprimer mon compte
        </button>
      </details>
      {status && (
        <output
          className={`qard-toast ${statusTone === 'error' ? 'is-error' : ''}`}
          aria-live="polite"
        >
          {statusTone === 'loading' ? (
            <Loader2 className="spin" size={15} />
          ) : statusTone === 'error' ? (
            <AlertTriangle size={15} />
          ) : (
            <Check size={15} />
          )}
          {status}
        </output>
      )}
    </div>
  );
}
