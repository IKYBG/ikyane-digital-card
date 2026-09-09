'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function MediaUploader({
  bucket,
  userId,
  value,
  onChange,
  label,
  maxMb = 5,
}: {
  bucket: 'avatars' | 'banners';
  userId: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  maxMb?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  function objectPath(url: string) {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    return index < 0
      ? null
      : decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
  }
  async function upload(file?: File) {
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > maxMb * 1024 * 1024
    )
      return setError(`JPG, PNG ou WebP · ${maxMb} Mo maximum.`);
    setLoading(true);
    setError('');
    try {
      const prepared = await resizeImage(file, bucket);
      const supabase = createClient();
      const path = `${userId}/${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, prepared, {
          contentType: 'image/webp',
          cacheControl: '3600',
        });
      if (uploadError) throw uploadError;
      const nextUrl = supabase.storage.from(bucket).getPublicUrl(path)
        .data.publicUrl;
      const previousPath = value ? objectPath(value) : null;
      onChange(nextUrl);
      if (previousPath)
        await supabase.storage.from(bucket).remove([previousPath]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Upload impossible');
    } finally {
      setLoading(false);
    }
  }
  async function remove() {
    if (!value) return;
    setLoading(true);
    setError('');
    try {
      const path = objectPath(value);
      if (path) {
        const { error: removeError } = await createClient()
          .storage.from(bucket)
          .remove([path]);
        if (removeError) throw removeError;
      }
      onChange(null);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Suppression impossible',
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="media-uploader">
      <div
        className={`media-uploader-preview ${bucket === 'banners' ? 'banner' : 'avatar'}`}
      >
        {value ? (
          <Image
            src={value}
            alt={`Aperçu — ${label}`}
            fill
            sizes="72px"
            unoptimized
          />
        ) : (
          <ImagePlus size={20} aria-hidden="true" />
        )}
      </div>
      <div>
        <span>{label}</span>
        <small>
          {bucket === 'avatars'
            ? 'Recadrée et optimisée automatiquement'
            : 'Optimisée automatiquement'}
        </small>
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
        {value ? 'Remplacer' : 'Ajouter'}
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

async function resizeImage(file: File, bucket: 'avatars' | 'banners') {
  const targetWidth = bucket === 'avatars' ? 1200 : 1600;
  const targetHeight = bucket === 'avatars' ? 1200 : 900;
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
    resizeWidth: targetWidth,
    resizeQuality: 'high',
  });
  const sourceRatio = bitmap.width / bitmap.height;
  const targetRatio = targetWidth / targetHeight;
  let sourceWidth = bitmap.width;
  let sourceHeight = bitmap.height;
  let sourceX = 0;
  let sourceY = 0;
  if (sourceRatio > targetRatio) {
    sourceWidth = bitmap.height * targetRatio;
    sourceX = (bitmap.width - sourceWidth) / 2;
  } else {
    sourceHeight = bitmap.width / targetRatio;
    sourceY = (bitmap.height - sourceHeight) / 2;
  }
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Redimensionnement impossible');
  context.drawImage(
    bitmap,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.88),
  );
  if (!blob) throw new Error('Redimensionnement impossible');
  return blob;
}
