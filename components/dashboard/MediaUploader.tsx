'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Check, ImagePlus, Loader2, Move, Trash2, X, ZoomIn } from 'lucide-react';
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
  const [selection, setSelection] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [crop, setCrop] = useState({ zoom: 1, x: 0, y: 0 });
  function objectPath(url: string) {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    return index < 0
      ? null
      : decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
  }
  function select(file?: File) {
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > maxMb * 1024 * 1024
    )
      return setError(`JPG, PNG ou WebP · ${maxMb} Mo maximum.`);
    setError('');
    setCrop({ zoom: 1, x: 0, y: 0 });
    setSelection({ file, preview: URL.createObjectURL(file) });
  }
  function closeCropper() {
    if (selection) URL.revokeObjectURL(selection.preview);
    setSelection(null);
    if (input.current) input.current.value = '';
  }
  async function upload() {
    if (!selection) return;
    setLoading(true);
    setError('');
    try {
      const prepared = await prepareImage(selection.file, bucket, crop);
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
      closeCropper();
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
        onChange={(event) => select(event.target.files?.[0])}
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
      {selection && (
        <dialog open className="image-cropper" aria-label={`Ajuster ${label}`}>
          <section>
            <header>
              <div>
                <span>Ajuster l’image</span>
                <small>
                  {bucket === 'avatars'
                    ? 'Placez votre visage au centre du cercle.'
                    : 'Cadrez la zone qui apparaîtra derrière votre profil.'}
                </small>
              </div>
              <button type="button" onClick={closeCropper} aria-label="Fermer">
                <X size={18} />
              </button>
            </header>
            <div className={`cropper-stage ${bucket === 'banners' ? 'banner' : 'avatar'}`}>
              <Image
                src={selection.preview}
                alt="Aperçu du cadrage"
                fill
                unoptimized
                sizes="520px"
                style={{
                  transform: `translate(${crop.x * 0.22}%, ${crop.y * 0.22}%) scale(${crop.zoom})`,
                }}
              />
              <i aria-hidden="true" />
            </div>
            <div className="cropper-controls">
              <label>
                <span><ZoomIn size={15} /> Zoom</span>
                <input type="range" min="1" max="2.4" step="0.01" value={crop.zoom} onChange={(event) => setCrop((current) => ({ ...current, zoom: Number(event.target.value) }))} />
              </label>
              <label>
                <span><Move size={15} /> Horizontal</span>
                <input type="range" min="-100" max="100" value={crop.x} onChange={(event) => setCrop((current) => ({ ...current, x: Number(event.target.value) }))} />
              </label>
              <label>
                <span><Move size={15} /> Vertical</span>
                <input type="range" min="-100" max="100" value={crop.y} onChange={(event) => setCrop((current) => ({ ...current, y: Number(event.target.value) }))} />
              </label>
            </div>
            <footer>
              <button type="button" className="button button-ghost" onClick={closeCropper}>Annuler</button>
              <button type="button" className="button" onClick={() => void upload()} disabled={loading}>
                {loading ? <Loader2 className="spin" size={17} /> : <Check size={17} />}
                Utiliser ce cadrage
              </button>
            </footer>
          </section>
        </dialog>
      )}
    </div>
  );
}

async function prepareImage(
  file: File,
  bucket: 'avatars' | 'banners',
  crop: { zoom: number; x: number; y: number },
) {
  const targetWidth = bucket === 'avatars' ? 1200 : 1600;
  const targetHeight = bucket === 'avatars' ? 1200 : 1000;
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  });
  const sourceRatio = bitmap.width / bitmap.height;
  const targetRatio = targetWidth / targetHeight;
  let sourceWidth = bitmap.width;
  let sourceHeight = bitmap.height;
  let sourceX = 0;
  let sourceY = 0;
  if (sourceRatio > targetRatio) {
    sourceWidth = bitmap.height * targetRatio;
  } else {
    sourceHeight = bitmap.width / targetRatio;
  }
  sourceWidth /= crop.zoom;
  sourceHeight /= crop.zoom;
  const availableX = Math.max(0, bitmap.width - sourceWidth);
  const availableY = Math.max(0, bitmap.height - sourceHeight);
  sourceX = (availableX * (crop.x / 100 + 1)) / 2;
  sourceY = (availableY * (crop.y / 100 + 1)) / 2;
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
