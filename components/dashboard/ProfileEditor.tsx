"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, Save, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { profileSchema } from "@/lib/qard/validation";
import type { QardData } from "@/types/database";
import { QardPreview } from "@/components/qard/QardPreview";
import { MediaUploader } from "./MediaUploader";
import { z } from "zod";

type Values = z.infer<typeof profileSchema>;
export function ProfileEditor({ data }: { data: QardData }) {
  const [avatar, setAvatar] = useState(data.profile.avatar_url);
  const [banner, setBanner] = useState(data.profile.banner_url);
  const [status, setStatus] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const first = useRef(true);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: data.profile.display_name,
      first_name: data.profile.first_name ?? "",
      last_name: data.profile.last_name ?? "",
      headline: data.profile.headline ?? "",
      bio: data.profile.bio ?? "",
      company: data.profile.company ?? "",
      job_title: data.profile.job_title ?? "",
      location: data.profile.location ?? "",
      email_public: data.profile.email_public ?? "",
      phone_public: data.profile.phone_public ?? "",
      website: data.profile.website ?? "",
      published: data.profile.published,
      show_branding: data.profile.show_branding,
    },
  });
  const values = watch();
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("dirty");
    const timer = window.setTimeout(async () => {
      const parsed = profileSchema.safeParse(values);
      if (!parsed.success) return;
      setStatus("saving");
      const { error } = await createClient()
        .from("qard_profiles")
        .update({ ...parsed.data, avatar_url: avatar, banner_url: banner })
        .eq("id", data.profile.id);
      setStatus(error ? "error" : "saved");
    }, 750);
    return () => window.clearTimeout(timer);
  }, [values, avatar, banner, data.profile.id]);
  const preview = useMemo<QardData>(
    () => ({
      ...data,
      profile: {
        ...data.profile,
        ...values,
        avatar_url: avatar,
        banner_url: banner,
      },
    }),
    [data, values, avatar, banner],
  );
  return (
    <div className="editor-layout">
      <div className="mobile-editor-tabs">
        <button
          className={mobileView === "edit" ? "active" : ""}
          onClick={() => setMobileView("edit")}
        >
          <SlidersHorizontal size={16} /> Éditer
        </button>
        <button
          className={mobileView === "preview" ? "active" : ""}
          onClick={() => setMobileView("preview")}
        >
          <Eye size={16} /> Aperçu
        </button>
      </div>
      <form
        className={`editor-form${mobileView === "preview" ? " mobile-hidden" : ""}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={`save-state ${status}`}>
          <Save size={14} />
          {status === "dirty" ? (
            "Modifications…"
          ) : status === "saving" ? (
            "Enregistrement…"
          ) : status === "saved" ? (
            <>
              <Check size={14} /> Enregistré
            </>
          ) : status === "error" ? (
            "Erreur d’enregistrement"
          ) : (
            "Autosave actif"
          )}
        </div>
        <fieldset>
          <legend>Visuels</legend>
          <MediaUploader
            bucket="avatars"
            userId={data.profile.user_id}
            value={avatar}
            onChange={setAvatar}
            label="Photo de profil"
          />
          <MediaUploader
            bucket="banners"
            userId={data.profile.user_id}
            value={banner}
            onChange={setBanner}
            label="Bannière"
            maxMb={8}
          />
        </fieldset>
        <fieldset>
          <legend>Identité</legend>
          <div className="field-row">
            <label>
              Nom affiché
              <input {...register("display_name")} />
              {errors.display_name && (
                <small>{errors.display_name.message}</small>
              )}
            </label>
          </div>
          <div className="field-row two">
            <label>
              Prénom
              <input {...register("first_name")} />
            </label>
            <label>
              Nom
              <input {...register("last_name")} />
            </label>
          </div>
          <label>
            Phrase d’accroche
            <input
              {...register("headline")}
              placeholder="Designer produit indépendant"
            />
          </label>
          <div className="field-row two">
            <label>
              Métier
              <input {...register("job_title")} />
            </label>
            <label>
              Entreprise / école
              <input {...register("company")} />
            </label>
          </div>
          <label>
            Localisation
            <input {...register("location")} />
          </label>
          <label>
            Bio
            <textarea {...register("bio")} rows={4} />
          </label>
        </fieldset>
        <fieldset>
          <legend>Contact</legend>
          <label>
            Email public
            <input type="email" {...register("email_public")} />
            {errors.email_public && (
              <small>{errors.email_public.message}</small>
            )}
          </label>
          <label>
            Téléphone
            <input type="tel" {...register("phone_public")} />
          </label>
          <label>
            Site web
            <input
              type="url"
              {...register("website")}
              placeholder="https://…"
            />
            {errors.website && <small>{errors.website.message}</small>}
          </label>
        </fieldset>
        <fieldset>
          <legend>Publication</legend>
          <label className="toggle-row">
            <span>
              <b>Qard publiée</b>
              <small>Ton profil est visible depuis son URL.</small>
            </span>
            <input aria-label="Publier la Qard" type="checkbox" {...register("published")} />
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
                setValue("show_branding", e.target.checked, {
                  shouldDirty: true,
                })
              }
              disabled={data.profile.plan === "free"}
            />
          </label>
        </fieldset>
      </form>
      <aside
        className={`editor-preview${mobileView === "edit" ? " mobile-hidden-preview" : ""}`}
      >
        <div className="phone-frame">
          <QardPreview data={preview} compact />
        </div>
      </aside>
    </div>
  );
}
