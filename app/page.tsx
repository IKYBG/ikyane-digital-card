import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Camera, Check, ContactRound, Link2, Palette, QrCode, Share2, Smartphone, UserRound } from "lucide-react";
import { MarketingNav } from "@/components/qard/MarketingNav";
import { QardLogo } from "@/components/qard/QardLogo";
import { QardPreview } from "@/components/qard/QardPreview";
import { ScrollReveal } from "@/components/qard/ScrollReveal";
import AnimatedGradient from "@/components/ui/animated-gradient";
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

export default function Home() {
  return (
    <main className="qard-site landing-simple">
      <AnimatedGradient
        className="landing-animated-bg"
        config={{ color1: "#080b11", color2: "#10233b", color3: "#315b8d", speed: 6, distortion: 3, swirl: 12, swirlIterations: 2, softness: 94, shape: "Edge", shapeSize: 64 }}
        noise={{ opacity: 0.025, scale: 0.8 }}
        style={{ position: "fixed", zIndex: 0 }}
      />
      <div className="landing-background-shade" aria-hidden="true" />
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

      <section className="how-section qard-container" id="fonctionnement">
        <ScrollReveal>
        <header>
          <p className="simple-eyebrow">Comment ça marche</p>
          <h2>De votre profil à leur téléphone.</h2>
        </header>
        </ScrollReveal>
        <div className="simple-how">
          <ScrollReveal delay={0} className="reveal-card">
          <article>
            <div className="how-visual how-profile" aria-hidden="true">
              <span className="how-avatar"><UserRound /></span>
              <span className="how-photo"><Camera /></span>
              <i /><i />
            </div>
            <span>01</span><h3>Créez votre profil</h3><p>Ajoutez votre nom, une photo et vos contacts.</p>
          </article>
          </ScrollReveal>
          <ScrollReveal delay={90} className="reveal-card">
          <article>
            <div className="how-visual how-share" aria-hidden="true">
              <span><QrCode /></span><i /><span><Share2 /></span>
            </div>
            <span>02</span><h3>Partagez votre Qard</h3><p>Envoyez votre lien ou présentez votre QR code.</p>
          </article>
          </ScrollReveal>
          <ScrollReveal delay={180} className="reveal-card">
          <article>
            <div className="how-visual how-access" aria-hidden="true">
              <span><Smartphone /></span>
              <div><ContactRound /><i><Check /></i></div>
            </div>
            <span>03</span><h3>Ils accèdent à votre Qard</h3><p>Vos contacts ouvrent votre carte et choisissent comment vous joindre.</p>
          </article>
          </ScrollReveal>
        </div>
      </section>

      <section className="simple-features qard-container">
        <ScrollReveal><header>
          <p className="simple-eyebrow">L’essentiel, bien fait</p>
          <h2>Moins de bruit.<br />Plus de contact.</h2>
        </header></ScrollReveal>
        <div className="feature-grid">
          <ScrollReveal delay={0} className="reveal-card"><article>
            <div className="feature-visual feature-contacts" aria-hidden="true">
              <span><ContactRound /><i><strong>Votre nom</strong><small>Profil Qard</small></i></span>
              <span><Link2 /><i><strong>Vos liens</strong><small>Au même endroit</small></i></span>
            </div>
            <ContactRound size={19} /><h3>Tous vos contacts</h3><p>Un seul endroit pour être retrouvé.</p>
          </article></ScrollReveal>
          <ScrollReveal delay={70} className="reveal-card"><article>
            <div className="feature-visual feature-qr" aria-hidden="true">
              <div><Image src="/ikyane-qr.png" width={112} height={112} alt="" /></div>
              <span>qard.me/votre-nom</span>
            </div>
            <QrCode size={19} /><h3>Un QR permanent</h3><p>Votre lien reste le même quand votre profil évolue.</p>
          </article></ScrollReveal>
          <ScrollReveal delay={0} className="reveal-card"><article>
            <div className="feature-visual feature-style" aria-hidden="true">
              <div><i /><i /><i /></div>
              <span><b /><b /><b /><b /></span>
            </div>
            <Palette size={19} /><h3>À votre image</h3><p>Des choix utiles, sans réglages inutiles.</p>
          </article></ScrollReveal>
          <ScrollReveal delay={70} className="reveal-card"><article>
            <div className="feature-visual feature-stats" aria-hidden="true">
              <span><strong>184</strong><small>interactions</small></span>
              <div><i /><i /><i /><i /><i /><i /><i /></div>
            </div>
            <BarChart3 size={19} /><h3>Des statistiques claires</h3><p>Voyez ce qui intéresse vos visiteurs.</p>
          </article></ScrollReveal>
        </div>
      </section>

      <ScrollReveal className="final-reveal"><section className="simple-final qard-container">
        <QardLogo linked={false} />
        <h2>Votre carte peut être prête en quelques minutes.</h2>
        <Link className="button landing-primary" href="/signup">Commencer gratuitement <ArrowRight size={18} /></Link>
      </section></ScrollReveal>

      <footer className="marketing-footer qard-container">
        <QardLogo />
        <p>© 2026 Qard</p>
        <nav><Link href="/privacy">Confidentialité</Link><Link href="/terms">Conditions</Link></nav>
      </footer>
    </main>
  );
}
