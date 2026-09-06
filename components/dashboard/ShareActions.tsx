'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
export function ShareActions({ url, published = true }: { url: string; published?: boolean }) {
  const [done, setDone] = useState(false);
  async function share() {
    if (!published) return;
    if (navigator.share) await navigator.share({ title: 'Ma Qard', url });
    else await navigator.clipboard.writeText(url);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }
  if (!published) return <div className="share-disabled"><span>Votre Qard est masquée.</span><Link href="/dashboard/editor">La publier</Link></div>;
  return <div className="inline-actions"><button onClick={() => { void navigator.clipboard.writeText(url); setDone(true); }}><Copy size={16} /> Copier</button><button onClick={share}><Share2 size={16} /> Partager</button>{done && <span><Check size={14} /> Lien copié</span>}</div>;
}
