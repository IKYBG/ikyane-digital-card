import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import { QardPreview } from './QardPreview';
import { demoQard } from '@/lib/qard/demo-data';
import { env } from '@/lib/env';

export async function LandingSections() {
  const qr = await QRCode.toDataURL(`${env.appUrl.replace(/\/$/, '')}/demo`, {
    width: 256,
    margin: 4,
  });
  return (
    <div className="landing-sections">
      <section id="comment-ca-marche" className="landing-explain">
        <span className="section-eyebrow">De la rencontre au contact</span>
        <h2>Trois gestes. On reste en contact.</h2>
        <div className="landing-step-grid">
          <article>
            <b>01</b>
            <h3>Montrez votre QR.</h3>
            <p>Sur votre téléphone, au moment de vous dire au revoir.</p>
          </article>
          <article>
            <b>02</b>
            <h3>La personne scanne.</h3>
            <p>
              Votre portrait, votre métier et vos coordonnées s’ouvrent. Sans
              compte ni application à installer.
            </p>
          </article>
          <article>
            <b>03</b>
            <h3>Elle garde le contact.</h3>
            <p>
              Elle enregistre vos coordonnées, vous écrit ou découvre votre
              travail.
            </p>
          </article>
        </div>
      </section>
      <section id="demonstration" className="landing-demo">
        <div>
          <span className="section-eyebrow">Essayez, tout simplement</span>
          <h2>Voici ce que l’autre personne reçoit.</h2>
          <p>
            Une carte centrée sur vous. Un contact à enregistrer. Les bons liens
            pour continuer la conversation.
          </p>
          <p className="demo-label">
            Exemple fictif : Camille, designer indépendante.
          </p>
          <div className="landing-demo-qr">
            <Image
              unoptimized
              src={qr}
              width={128}
              height={128}
              alt="Scannez pour ouvrir la Qard de démonstration"
            />
            <p>
              Scannez avec un autre téléphone.
              <br />
              <Link href="/demo">Sur mobile ? Ouvrez la démo →</Link>
            </p>
          </div>
        </div>
        <QardPreview data={demoQard} demo embedded />
      </section>
      <section className="landing-use">
        <span className="section-eyebrow">
          Pour les rencontres qui comptent
        </span>
        <h2>Votre travail mérite qu’on vous retrouve.</h2>
        <p>
          Après un café avec un prospect, une discussion en coworking ou un
          événement : partagez votre métier, votre portfolio et vos coordonnées
          en une seule fois.
        </p>
        <div className="landing-proof">
          <article>
            <h3>Votre lien reste le même.</h3>
            <p>Vos informations changent sur la page sans remplacer le QR.</p>
          </article>
          <article>
            <h3>Vous choisissez ce qui est public.</h3>
            <p>
              Partagez un contact professionnel et masquez votre carte quand
              vous le souhaitez.
            </p>
          </article>
          <article>
            <h3>Le partage reste gratuit.</h3>
            <p>QR, coordonnées et enregistrement du contact sont inclus.</p>
          </article>
        </div>
      </section>
      <section className="landing-faq">
        <h2>Avant votre premier scan</h2>
        <details>
          <summary>La personne doit-elle avoir Qard ?</summary>
          <p>
            Non. Elle utilise l’appareil photo de son téléphone et ouvre votre
            carte dans son navigateur.
          </p>
        </details>
        <details>
          <summary>Le contact enregistré reste-t-il à jour ?</summary>
          <p>
            Votre page Qard reste à jour. Les informations déjà importées dans
            le carnet d’adresses ne changent pas automatiquement ; votre lien
            Qard est inclus dans le contact.
          </p>
        </details>
        <details>
          <summary>Est-ce utilisable sans internet ?</summary>
          <p>
            Vous pouvez montrer une image de votre QR enregistrée dans vos
            photos. Une connexion est nécessaire pour ouvrir la page Qard.
          </p>
        </details>
      </section>
      <section className="landing-final">
        <span className="section-eyebrow">Votre prochaine rencontre</span>
        <h2>Préparez votre premier partage.</h2>
        <Link className="button" href="/signup">
          Créer ma Qard gratuitement →
        </Link>
        <p>Sans carte bancaire. Photo et réseaux à ajouter à votre rythme.</p>
        <Link href="/pricing">Comparer Gratuit et Pro</Link>
      </section>
      <footer className="landing-footer">
        <b>Qard.</b>
        <span>Scanne. Une nouvelle façon de se présenter.</span>
        <Link href="/privacy">Confidentialité</Link>
        <Link href="/terms">Conditions</Link>
      </footer>
    </div>
  );
}
