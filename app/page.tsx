import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ContactRound,
  Fingerprint,
  Palette,
  QrCode,
  ScanLine,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiInstagram } from "react-icons/si";
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
    headline: "Votre identité professionnelle, en un geste.",
    bio: "Présentez votre parcours, vos projets et vos réseaux dans une carte qui vous ressemble.",
    avatar_url: null,
    banner_url: null,
    company: "Votre univers",
    job_title: "Votre activité",
    location: "Partout",
    email_public: "bonjour@votrenom.fr",
    phone_public: null,
    website: "https://example.com",
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
    { id: "demo-github", profile_id: "landing-demo", platform: "github", label: "GitHub", url: "https://github.com", username: "vos-projets", position: 2, enabled: true, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  ],
  appearance: {
    id: "landing-appearance",
    profile_id: "landing-demo",
    theme: "midnight-glass",
    background_type: "gradient",
    background_value: "radial-gradient(circle at 68% 12%, #16345c 0, #0b1729 36%, #05080e 78%)",
    accent_color: "#a8caff",
    text_color: "#f5f8ff",
    card_opacity: 0.82,
    card_blur: 18,
    card_radius: 36,
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

const steps = [
  { number: "01", title: "Créez votre identité", copy: "Ajoutez votre photo, votre activité et ce qui vous rend unique.", icon: Fingerprint },
  { number: "02", title: "Composez votre Qard", copy: "Rassemblez vos réseaux et choisissez une présence qui vous ressemble.", icon: Palette },
  { number: "03", title: "Partagez en un geste", copy: "Un QR permanent et un lien simple, toujours à jour.", icon: Share2 },
];

export default function Home() {
  return (
    <main className="qard-site landing-v2">
      <div className="landing-noise" aria-hidden="true" />
      <div className="landing-aurora landing-aurora-one" aria-hidden="true" />
      <div className="landing-aurora landing-aurora-two" aria-hidden="true" />
      <MarketingNav />

      <section className="landing-hero qard-container">
        <div className="landing-hero-copy">
          <p className="landing-kicker"><Sparkles size={15} /> L’identité numérique, réinventée</p>
          <h1>Votre présence.<br /><span>En un geste.</span></h1>
          <p className="landing-lead">Une carte de visite numérique vivante, élégante et toujours à jour. Partagez ce qui compte vraiment, sans application à installer.</p>
          <div className="landing-actions">
            <Link className="button landing-primary" href="/signup">Créer ma Qard <ArrowRight size={18} /></Link>
            <Link className="button button-ghost" href="/card">Explorer la démo</Link>
          </div>
          <div className="landing-trust" aria-label="Avantages essentiels">
            <span><Check size={14} /> Gratuit pour commencer</span>
            <span><Check size={14} /> QR permanent</span>
            <span><Check size={14} /> Sans application</span>
          </div>
        </div>

        <div className="landing-product" aria-label="Exemple interactif d’une carte Qard">
          <div className="landing-product-halo" aria-hidden="true" />
          <div className="landing-demo-card">
            <QardPreview data={demoData} compact contactHref="/card" contactLabel="Voir l’exemple" />
          </div>
          <div className="landing-qr-float">
            <div className="landing-qr-head"><span><i /> Profil actif</span><ScanLine size={16} /></div>
            <Image src="/ikyane-qr.png" width={126} height={126} alt="QR code vers un exemple de Qard" />
            <p>Scannez l’exemple</p>
          </div>
          <div className="landing-live-pill"><Zap size={14} /> Mise à jour instantanée</div>
        </div>
      </section>

      <section className="landing-signal qard-container" aria-label="Promesse Qard">
        <p>Un profil. Un QR. Toutes vos rencontres.</p>
        <div>
          <span><SiInstagram /> Instagram</span>
          <span><FaLinkedin /> LinkedIn</span>
          <span><SiGithub /> GitHub</span>
          <span><ContactRound /> Contact</span>
        </div>
      </section>

      <section className="landing-section qard-container" id="fonctionnement">
        <div className="landing-section-heading">
          <span>Simple par nature</span>
          <h2>De votre idée à leur téléphone.</h2>
          <p>Trois étapes, aucune friction.</p>
        </div>
        <div className="landing-steps">
          {steps.map(({ number, title, copy, icon: Icon }) => (
            <article key={number}>
              <div><span>{number}</span><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <i aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-bento-section">
        <div className="qard-container">
          <div className="landing-section-heading">
            <span>Tout ce qu’il faut</span>
            <h2>Une carte qui travaille pour vous.</h2>
            <p>Claire pour vos visiteurs. Puissante pour vous.</p>
          </div>
          <div className="landing-bento">
            <article className="bento-card bento-identity">
              <div className="bento-copy"><ContactRound /><span>Identité</span><h3>Bien plus qu’une liste de liens.</h3><p>Votre histoire, votre image et vos contacts réunis dans une expérience cohérente.</p></div>
              <div className="identity-stack" aria-hidden="true"><i /><i /><div><b>VN</b><span><strong>Votre nom</strong><small>Votre activité</small></span><ArrowRight size={16} /></div></div>
            </article>
            <article className="bento-card bento-qr">
              <div className="bento-copy"><QrCode /><span>Partage</span><h3>Un QR qui ne change jamais.</h3><p>Actualisez votre profil, pas vos supports.</p></div>
              <div className="bento-qr-frame" aria-hidden="true"><Image src="/ikyane-qr.png" width={150} height={150} alt="" /></div>
            </article>
            <article className="bento-card bento-analytics">
              <div className="bento-copy"><BarChart3 /><span>Analytics</span><h3>Comprenez ce qui attire l’attention.</h3><p>Des signaux lisibles, sans bruit inutile.</p></div>
              <div className="mini-chart" aria-hidden="true">
                <div className="chart-value"><strong>184</strong><span>interactions</span></div>
                <svg viewBox="0 0 420 130" preserveAspectRatio="none"><path d="M0 104 C54 100 74 62 126 73 S205 116 251 70 S332 30 420 17" /><path className="chart-fill" d="M0 104 C54 100 74 62 126 73 S205 116 251 70 S332 30 420 17 L420 130 L0 130 Z" /></svg>
              </div>
            </article>
            <article className="bento-card bento-style">
              <div className="bento-copy"><Palette /><span>Personnalisation</span><h3>Votre univers, jusque dans les détails.</h3><p>Couleurs, typographies et ambiance s’accordent à votre identité.</p></div>
              <div className="theme-orbits" aria-hidden="true"><i /><i /><i /><span /></div>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-final">
        <Image src="/qard-logo.png" width={116} height={116} alt="Logo Qard" />
        <p>Votre prochaine rencontre commence ici.</p>
        <h2>Créez une présence<br />qu’on retient.</h2>
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
