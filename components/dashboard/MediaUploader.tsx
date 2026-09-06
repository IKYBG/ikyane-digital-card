"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function MediaUploader({
  bucket,
  userId,
  value,
  onChange,
  label,
  maxMb = 5,
}: {
  bucket: "avatars" | "banners";
  userId: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  maxMb?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function objectPath(url: string) {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    return index < 0 ? null : decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
  }
  async function upload(file?: File) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > maxMb * 1024 * 1024
    )
      return setError(`JPG, PNG ou WebP · ${maxMb} Mo maximum.`);
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      if (uploadError) throw uploadError;
      const nextUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      const previousPath = value ? objectPath(value) : null;
      onChange(nextUrl);
      if (previousPath) await supabase.storage.from(bucket).remove([previousPath]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload impossible");
    } finally {
      setLoading(false);
    }
  }
  async function remove() {
    if (!value) return;
    setLoading(true);
    setError("");
    try {
      const path = objectPath(value);
      if (path) {
        const { error: removeError } = await createClient().storage.from(bucket).remove([path]);
        if (removeError) throw removeError;
      }
      onChange(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Suppression impossible");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="media-uploader">
      <div className={`media-uploader-preview ${bucket === "banners" ? "banner" : "avatar"}`}>
        {value ? (
          <Image src={value} alt={`Aperçu — ${label}`} fill sizes="72px" unoptimized />
        ) : (
          <ImagePlus size={20} aria-hidden="true" />
        )}
      </div>
      <div>
        <span>{label}</span>
        <small>JPG, PNG ou WebP</small>
      </div>
      <input
        ref={input}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => upload(event.target.files?.[0])}
      />
      <button type="button" onClick={() => input.current?.click()}>
        {loading ? (
          <Loader2 className="spin" size={17} />
        ) : (
          <ImagePlus size={17} />
        )}
        {value ? "Remplacer" : "Ajouter"}
      </button>
      {value && (
        <button
          type="button"
          aria-label={`Supprimer ${label}`}
          onClick={() => void remove()}
        >
          <Trash2 size={17} />
        </button>
      )}
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
