"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function googleSignIn() {
    setLoading(true);
    setError("");
    const { error: authError } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const field = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" ? value : "";
    };
    const email = field("email").trim();
    const password = field("password");
    const displayName = field("displayName").trim();
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
          },
        });
        if (authError) throw authError;
        if (data.session) {
          router.push("/onboarding");
          router.refresh();
        } else
          setSuccess(
            "Vérifie ton email pour confirmer ton compte, puis reviens sur Qard.",
          );
      } else if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.push(search.get("next") ?? "/dashboard");
        router.refresh();
      } else {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
          },
        );
        if (authError) throw authError;
        setSuccess("Un lien de réinitialisation vient de t’être envoyé.");
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "login"
      ? "Ravi de te revoir."
      : mode === "signup"
        ? "Crée ton identité Qard."
        : "Retrouve ton accès.";
  return (
    <form className="auth-form auth-form-card" onSubmit={submit}>
      <div>
        <span className="auth-lock-mark"><LockKeyhole size={18} /></span>
        <span className="eyebrow">{mode === "login" ? "Connexion sécurisée" : mode === "signup" ? "Créer un compte" : "Récupération"}</span>
        <h1>{title}</h1>
        <p>
          {mode === "signup"
            ? "Ta carte, ton QR et tous tes contacts dans un seul profil."
            : mode === "forgot"
              ? "Entre ton email et nous t’enverrons un lien sécurisé."
              : "Continue là où tu t’étais arrêté."}
        </p>
      </div>
      {mode === "signup" && (
        <label>
          Nom affiché
          <input
            name="displayName"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Lucas Martin"
          />
        </label>
      )}
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="toi@exemple.fr"
        />
      </label>
      {mode !== "forgot" && (
        <label>
          Mot de passe
          <span className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={8}
              placeholder="8 caractères minimum"
            />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>
      )}
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      {success && <output className="form-message success">{success}</output>}
      {mode !== "forgot" && process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
        <button type="button" className="button button-ghost" onClick={() => void googleSignIn()} disabled={loading}>
          Continuer avec Google
        </button>
      )}
      <button className="button" disabled={loading}>
        {loading ? (
          <Loader2 className="spin" />
        ) : (
          <>
            {mode === "login"
              ? "Se connecter"
              : mode === "signup"
                ? "Créer mon compte"
                : "Envoyer le lien"}{" "}
            <ArrowRight size={17} />
          </>
        )}
      </button>
      <footer>
        {mode === "login" ? (
          <>
            <Link href="/forgot-password">Mot de passe oublié ?</Link>
            <span>
              Pas encore de compte ? <Link href="/signup">Créer ma Qard</Link>
            </span>
          </>
        ) : mode === "signup" ? (
          <span>
            Déjà inscrit ? <Link href="/login">Se connecter</Link>
          </span>
        ) : (
          <Link href="/login">Retour à la connexion</Link>
        )}
      </footer>
    </form>
  );
}
