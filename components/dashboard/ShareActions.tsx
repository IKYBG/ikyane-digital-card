'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
export function ShareActions({
  url,
  published = true,
}: {
  url: string;
  published?: boolean;
}) {
  const [feedback, setFeedback] = useState('');
  function flash(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 1800);
  }
  async function share() {
    if (!published) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Ma Qard', url });
        flash('Partage ouvert');
      } else {
        await navigator.clipboard.writeText(url);
        flash('Lien copié');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      flash('Partage impossible');
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      flash('Lien copié');
    } catch {
      flash('Copie impossible');
    }
  }
  if (!published)
    return (
      <div className="share-disabled">
        <span>Votre Qard est masquée.</span>
        <Link href="/dashboard/editor">La publier</Link>
      </div>
    );
  return (
    <div className="inline-actions">
      <button onClick={() => void copy()}>
        <Copy size={16} /> Copier
      </button>
      <button onClick={() => void share()}>
        <Share2 size={16} /> Partager
      </button>
      {feedback && (
        <output>
          <Check size={14} /> {feedback}
        </output>
      )}
    </div>
  );
}
