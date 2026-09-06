import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Check, ContactRound, Palette, QrCode } from "lucide-react";
import { MarketingNav } from "@/components/qard/MarketingNav";
import { QardLogo } from "@/components/qard/QardLogo";
import { QardPreview } from "@/components/qard/QardPreview";
import type { QardData } from "@/types/database";

const demoData: QardData = {
  profile: {
    id: "landing-demo",
    user_id: "landing-demo",
    slug: "votre-nom",
    display_name: "Votre nom",
    first_name: "Votre",
    last_name: "Nom",
    headline: "Votre activité, simplement.",
    bio: null,
    avatar_url: null,
    banner_url: null,
    company: null,
    job_title: null,
    location: null,
    email_public: "bonjour@votrenom.fr",
    phone_public: null,
    website: null,
    published: true,
    show_branding: false,
    plan: "free",
    onboarding_completed: true,
    qr_downloaded_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  links: [
    { id: "demo-instagram", profile_id: "landing-demo", platform: "instagram", label: "Instagram", url: "https://instagram.com", username: "@votrenom", position: 0, enabled: true, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
    { id: "demo-linkedin", profile_id: "landing-demo", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", username: "Votre profil", position: 1, enabled: true, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  ],
  appearance: {
    id: "landing-appearance",
    profile_id: "landing-demo",
    theme: "midnight-glass",
    background_type: "gradient",
    background_value: "linear-gradient(160deg, #18263a, #0c1420 68%)",
    accent_color: "#a8caff",
    text_color: "#f5f8ff",
    card_opacity: 0.9,
    card_blur: 12,
    card_radius: 30,
    button_style: "glass",
    avatar_shape: "rounded",
    font_family: "geist",
    animation_style: "subtle-scale",
    animation_enabled: true,
    show_banner: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
};

const essentials = [
  { icon: ContactRound, title: "Tous vos contacts", copy: "Un seul endroit pour être retrouvé." },
  { icon: QrCode, title: "Un QR permanent", copy: "Votre lien reste le même, même si votre profil évolue." },
  { icon: Palette, title: "À votre image", copy: "Quelques choix utiles, sans réglages inutiles." },
  { icon: BarChart3, title: "Des statistiques claires", copy: "Voyez ce qui intéresse vraiment vos visiteurs." },
];

export default function Home() {
  return (
    <main className="qard-site landing-simple">
      <MarketingNav />

      <section className="simple-hero qard-container">
        <div className="simple-hero-copy">
          <p className="simple-eyebrow">Carte de visite numérique</p>
          <h1>Une carte.<br />Tous vos contacts.</h1>
          <p>Créez une identité claire, partageable par lien ou QR code. Rien à installer.</p>
          <div className="landing-actions">
            <Link className="button landing-primary" href="/signup">Créer ma Qard <ArrowRight size={18} /></Link>
            <Link className="simple-link" href="/card">Voir un exemple</Link>
          </div>
          <div className="simple-proof" aria-label="Avantages essentiels">
            <span><Check size={14} /> Gratuit</span>
            <span><Check size={14} /> Rapide à créer</span>
            <span><Check size={14} /> Toujours à jour</span>
          </div>
        </div>

        <div className="simple-product" aria-label="Aperçu interactif d’une Qard">
          <div className="simple-demo-card">
            <QardPreview data={demoData} compact contactHref="/card" contactLabel="Voir l’exemple" />
          </div>
          <div className="simple-qr">
            <Image src="/ikyane-qr.png" width={74} height={74} alt="QR code vers un exemple de Qard" />
            <span><strong>Essayez-la</strong><small>Scannez le QR code</small></span>
          </div>
        </div>
      </section>

      <section className="simple-how qard-container" id="fonctionnement">
        <div><span>01</span><h2>Créez votre profil</h2><p>Ajoutez l’essentiel : votre nom, une photo et vos contacts.</p></div>
        <div><span>02</span><h2>Partagez votre Qard</h2><p>Envoyez votre lien ou présentez votre QR code.</p></div>
        <div><span>03</span><h2>Modifiez-la librement</h2><p>Vos changements sont visibles immédiatement.</p></div>
      </section>

      <section className="simple-features qard-container">
        <header>
          <p className="simple-eyebrow">L’essentiel, bien fait</p>
          <h2>Moins de bruit.<br />Plus de contact.</h2>
        </header>
        <div>
          {essentials.map(({ icon: Icon, title, copy }) => (
            <article key={title}><Icon size={19} /><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="simple-final qard-container">
        <QardLogo linked={false} />
        <h2>Votre carte peut être prête en quelques minutes.</h2>
        <Link className="button landing-primary" href="/signup">Commencer gratuitement <ArrowRight size={18} /></Link>
      </section>

      <footer className="marketing-footer qard-container">
        <QardLogo />
        <p>© 2026 Qard</p>
        <nav><Link href="/privacy">Confidentialité</Link><Link href="/terms">Conditions</Link></nav>
      </footer>
    </main>
  );
}
