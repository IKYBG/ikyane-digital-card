'use client';
import { useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { onboardingSchema } from '@/lib/qard/validation';
import type { Profile } from '@/types/database';

export function OnboardingFlow({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [name, setName] = useState(
    profile.display_name === 'Ma Qard' ? '' : profile.display_name,
  );
  const [job, setJob] = useState(profile.job_title ?? '');
  const [contactType, setContactType] = useState<'email' | 'phone'>(
    profile.phone_public && !profile.email_public ? 'phone' : 'email',
  );
  const [email, setEmail] = useState(profile.email_public ?? '');
  const [phone, setPhone] = useState(profile.phone_public ?? '');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  async function finish(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const result = onboardingSchema.safeParse({
      display_name: name,
      job_title: job,
      contact_type: contactType,
      contact: contactType === 'email' ? email : phone,
    });
    if (!result.success) return setStatus(result.error.issues[0].message);
    setBusy(true);
    setStatus('');
    try {
      const fields = result.data;
      const { data, error } = await createClient()
        .from('qard_profiles')
        .update({
          display_name: fields.display_name,
          job_title: fields.job_title || null,
          ...(fields.contact_type === 'email'
            ? { email_public: fields.contact }
            : { phone_public: fields.contact }),
          published: true,
          onboarding_completed: true,
        })
        .eq('id', profile.id)
        .eq('user_id', profile.user_id)
        .select('id')
        .single();
      if (error || !data)
        throw new Error('Impossible de créer votre Qard. Réessayez.');
      router.replace('/dashboard/qr?welcome=1');
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Création impossible');
      setBusy(false);
    }
  }
  return (
    <form className="onboarding-card activation-form" onSubmit={finish}>
      <header>
        <b>Qard.</b>
        <span>Votre premier partage</span>
      </header>
      <section>
        <h1>Un nom. Un contact. Votre Qard est prête.</h1>
        <p>
          Votre QR s’affichera juste après. Ajoutez votre photo et vos réseaux
          quand vous le souhaitez.
        </p>
        <label>
          Nom affiché
          <input
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
          />
        </label>
        <label>
          Métier <small>Facultatif</small>
          <input
            autoComplete="organization-title"
            placeholder="Photographe, designer, consultant…"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            maxLength={100}
          />
        </label>
        <label>
          Moyen de contact public
          <select
            value={contactType}
            onChange={(e) =>
              setContactType(e.target.value as 'email' | 'phone')
            }
          >
            <option value="email">Email</option>
            <option value="phone">Téléphone</option>
          </select>
        </label>
        <label>
          {contactType === 'email' ? 'Email public' : 'Téléphone public'}
          <input
            type={contactType === 'email' ? 'email' : 'tel'}
            autoComplete={contactType === 'email' ? 'email' : 'tel'}
            value={contactType === 'email' ? email : phone}
            onChange={(e) =>
              contactType === 'email'
                ? setEmail(e.target.value)
                : setPhone(e.target.value)
            }
            maxLength={contactType === 'email' ? 254 : 30}
            required
            aria-describedby="public-contact-note"
          />
        </label>
        <p id="public-contact-note" className="activation-note">
          Ce contact sera visible par toute personne ayant votre lien. Utilisez
          les coordonnées que vous souhaitez partager.
        </p>
      </section>
      {status && (
        <p className="form-message error" role="alert">
          {status}
        </p>
      )}
      <footer>
        <button className="button" disabled={busy}>
          {busy ? (
            <Loader2 className="spin" size={18} />
          ) : (
            <ArrowRight size={18} />
          )}
          {busy ? 'Création…' : 'Créer ma Qard et afficher mon QR'}
        </button>
      </footer>
      <p className="activation-note">
        Une adresse est déjà réservée pour vous. Vous pourrez la modifier dans
        les réglages.
      </p>
    </form>
  );
}
