'use client';
import { useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const value = new FormData(event.currentTarget).get('password');
    const confirmationValue = new FormData(event.currentTarget).get(
      'passwordConfirmation',
    );
    const password = typeof value === 'string' ? value : '';
    const confirmation =
      typeof confirmationValue === 'string' ? confirmationValue : '';
    if (password !== confirmation) {
      setMessage('Les deux mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      router.push('/dashboard/settings');
      router.refresh();
    } catch (error) {
      const text = error instanceof Error ? error.message.toLowerCase() : '';
      setMessage(
        text.includes('password should be')
          ? 'Choisis un mot de passe d’au moins 8 caractères.'
          : 'Impossible de modifier le mot de passe. Demande un nouveau lien.',
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className="auth-form" onSubmit={submit} aria-busy={loading}>
      <div>
        <span className="eyebrow">Qard</span>
        <h1>Nouveau mot de passe.</h1>
        <p>Choisis un mot de passe unique d’au moins huit caractères.</p>
      </div>
      <label>
        Mot de passe
        <span className="password-field">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            minLength={8}
            required
            disabled={loading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={
              showPassword
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
      </label>
      <label>
        Confirmer le mot de passe
        <input
          name="passwordConfirmation"
          type={showPassword ? 'text' : 'password'}
          minLength={8}
          required
          disabled={loading}
          autoComplete="new-password"
        />
      </label>
      {message && (
        <p className="form-message error" role="alert">
          {message}
        </p>
      )}
      <button className="button" disabled={loading}>
        {loading && <Loader2 className="spin" size={17} />}
        {loading ? 'Enregistrement…' : 'Mettre à jour le mot de passe'}
      </button>
    </form>
  );
}
