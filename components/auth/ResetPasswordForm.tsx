"use client";
import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const value = new FormData(event.currentTarget).get("password");
    const password = typeof value === "string" ? value : "";
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      router.push("/dashboard/settings");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className="auth-form" onSubmit={submit}>
      <div>
        <span className="eyebrow">Qard</span>
        <h1>Nouveau mot de passe.</h1>
        <p>Choisis un mot de passe unique d’au moins huit caractères.</p>
      </div>
      <label>
        Mot de passe
        <input
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
        />
      </label>
      {message && <p className="form-message error">{message}</p>}
      <button className="button" disabled={loading}>
        {loading ? "Enregistrement…" : "Mettre à jour"}
      </button>
    </form>
  );
}
