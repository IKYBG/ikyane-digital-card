'use client';
import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
export function ShareActions({ url }: { url: string }) { const [done, setDone] = useState(false); async function share() { if (navigator.share) await navigator.share({ title: 'Ma Qard', url }); else await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1600); } return <div className="inline-actions"><button onClick={() => { void navigator.clipboard.writeText(url); setDone(true); }}><Copy size={16} /> Copier</button><button onClick={share}><Share2 size={16} /> Partager</button>{done && <span><Check size={14} /> Lien copié</span>}</div>; }
