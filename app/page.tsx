import Link from 'next/link';
import { ArrowRight, BarChart3, Check, Contact, Palette, QrCode, ScanLine, Share2, Smartphone } from 'lucide-react';
import { MarketingNav } from '@/components/qard/MarketingNav';
import { QardLogo } from '@/components/qard/QardLogo';

export default function Home() {
  return <main className="qard-site landing-page">
    <MarketingNav />
    <section className="hero qard-container">
      <div className="hero-copy"><p className="eyebrow"><ScanLine size={15} /> L’identité qui se partage</p><h1>Qard</h1><h2>Scanne, Une nouvelle façon de se présenter.</h2><p>Crée ta carte de contact numérique, personnalise-la et partage toutes tes coordonnées grâce à un seul QR code.</p><div className="hero-actions"><Link className="button" href="/signup">Créer ma Qard <ArrowRight size={18} /></Link><Link className="button button-ghost" href="/card">Voir un exemple</Link></div></div>
      <div className="hero-demo" aria-label="Aperçu d’une Qard"><div className="scan-ring"><ScanLine /></div><div className="demo-phone"><div className="demo-card"><div className="demo-avatar">Q</div><strong>Lucas Martin</strong><span>Designer produit · Lyon</span><div className="demo-links"><i /><i /><i /><i /></div><button>Ajouter aux contacts</button><small>Créé avec Qard</small></div></div><div className="demo-qr"><QrCode size={92} strokeWidth={1.3} /><span>Une URL. Toujours à jour.</span></div></div>
    </section>
    <section className="qard-section qard-container"><div className="section-intro"><span>Comment ça marche</span><h2>Trois gestes. Une rencontre.</h2></div><div className="step-grid">{[['01','Crée ta Qard','Ton identité en quelques minutes.'],['02','Personnalise ton profil','Choisis ton style et tes contacts.'],['03','Fais scanner ton QR','Ton profil s’ouvre instantanément.']].map(([n,t,d]) => <article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div></section>
    <section className="feature-band"><div className="qard-container feature-grid"><article><Contact /><h3>Tous tes contacts au même endroit</h3><p>Réseaux, téléphone, email et portfolio réunis sans friction.</p></article><article><Palette /><h3>Ton identité, ton style</h3><p>Des thèmes premium pensés pour rester lisibles et personnels.</p></article><article><QrCode /><h3>Un QR. Une infinité de modifications.</h3><p>Modifie ton profil sans jamais réimprimer ton QR.</p></article><article><BarChart3 /><h3>Des signaux utiles</h3><p>Comprends quelles informations intéressent vraiment tes rencontres.</p></article></div></section>
    <section className="qard-section qard-container"><div className="section-intro"><span>Pour chaque rencontre</span><h2>Étudiant, freelance, commercial ou créateur.</h2><p>Qard s’adapte au contexte sans devenir une liste de liens impersonnelle.</p></div><div className="use-list">{['Networking','Recrutement','Événements','Prospection','Portfolio','Communautés'].map((item) => <span key={item}><Check size={15} />{item}</span>)}</div></section>
    <section className="final-cta"><Smartphone /><h2>Crée ta Qard. Fais-toi scanner.</h2><p>Scanne, Une nouvelle façon de se présenter.</p><Link className="button" href="/signup">Commencer gratuitement <Share2 size={17} /></Link></section>
    <footer className="marketing-footer qard-container"><QardLogo /><p>© 2026 Qard</p><nav><Link href="/privacy">Confidentialité</Link><Link href="/terms">Conditions</Link></nav></footer>
  </main>;
}
