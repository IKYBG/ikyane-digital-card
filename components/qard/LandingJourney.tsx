'use client';

import { AtSign, Mail, Phone, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './LandingJourney.module.css';

const steps = [
  {
    number: '01',
    label: 'Créez',
    title: 'Votre identité prend forme',
    text: 'Un nom, une photo et les bons moyens de vous joindre.',
    visual: 'identity',
  },
  {
    number: '02',
    label: 'Partagez',
    title: 'Un lien et un QR permanent',
    text: 'Vous le transmettez une fois. Votre Qard reste toujours à jour.',
    visual: 'share',
  },
  {
    number: '03',
    label: 'Connectez',
    title: 'Le contact devient immédiat',
    text: 'Un scan suffit pour appeler, écrire ou retrouver vos réseaux.',
    visual: 'contact',
  },
] as const;

function ShareScene() {
  return (
    <svg className={styles.scene} viewBox="0 0 340 190" fill="none" aria-hidden="true">
      <circle className={styles.personSkin} cx="57" cy="48" r="20" /><path className={styles.personHair} d="M38 46c1-19 12-27 24-25 10 2 17 10 17 24-9-3-16-8-21-14-4 8-11 13-20 15z" />
      <path className={styles.personBody} d="M25 126c4-40 17-59 35-59s30 19 34 59z" />
      <circle className={styles.personSkin} cx="283" cy="48" r="20" /><path className={styles.personHair} d="M263 49c-1-20 8-29 21-29 14 0 23 11 20 30-8-4-14-11-17-19-6 8-14 14-24 18z" />
      <path className={styles.personBodyAlt} d="M247 126c5-40 18-59 36-59s31 19 34 59z" />
      <g className={styles.sceneStrong}>
        <path d="M75 91c26 2 38 16 60 21" /><path d="M264 88c-22 3-31 14-51 23" />
        <rect className={styles.phoneBody} x="127" y="72" width="39" height="70" rx="7" /><path d="M139 82h15M138 131h16" />
        <rect className={styles.qrPaper} x="174" y="84" width="48" height="48" rx="6" />
        <path d="M168 96h-8M168 120h-8" />
      </g>
      <image href="/ikyane-qr.png" x="179" y="89" width="38" height="38" />
      <path className={styles.scanBeam} d="M166 83l8 5v41l-8 5z" />
    </svg>
  );
}

function ContactScene() {
  return (
    <svg className={styles.scene} viewBox="0 0 340 190" fill="none" aria-hidden="true">
      <path className={styles.hand} d="M83 181c8-28 22-43 41-48l18-5 3-79c1-17 24-18 26-2l3 50 11-31c5-14 25-9 21 6l-8 32 11-24c7-13 25-4 19 10l-22 54c-8 20-26 34-47 37H83z" />
      <g className={styles.sceneStrong}>
        <rect className={styles.phoneBody} x="118" y="16" width="118" height="158" rx="18" />
        <path d="M154 27h46" />
        <rect className={styles.screenCard} x="132" y="44" width="90" height="108" rx="10" />
        <circle className={styles.avatarFill} cx="177" cy="76" r="19" />
        <path d="M151 107h52M158 119h38" />
        <rect x="146" y="133" width="26" height="9" rx="4.5" /><rect x="181" y="133" width="26" height="9" rx="4.5" />
      </g>
    </svg>
  );
}

function StepArtwork({ type }: { type: (typeof steps)[number]['visual'] }) {
  if (type === 'identity') {
    return (
      <div className={`${styles.artwork} ${styles.identity}`} aria-hidden="true">
        <div className={styles.portrait}><UserRound size={32} strokeWidth={1.5} /></div>
        <div className={styles.formLine}><i /><i /></div>
        <div className={styles.formLine}><i /><i /></div>
        <div className={styles.contactDots}><Mail size={15} /><Phone size={15} /><AtSign size={15} /></div>
      </div>
    );
  }

  if (type === 'share') {
    return (
      <div className={`${styles.artwork} ${styles.share}`} aria-hidden="true">
        <ShareScene />
      </div>
    );
  }

  return (
    <div className={`${styles.artwork} ${styles.contact}`} aria-hidden="true">
      <ContactScene />
    </div>
  );
}

export function LandingJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const start = window.innerHeight * 0.42;
      const travel = Math.max(1, rect.height - window.innerHeight * 0.58);
      const nextProgress = Math.min(1, Math.max(0, (start - rect.top) / travel));
      const nextActive = Math.min(2, Math.floor(nextProgress * 3));
      root.style.setProperty('--journey-progress', String(nextProgress));
      if (nextActive !== lastActive.current) {
        lastActive.current = nextActive;
        setActive(nextActive);
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.journey}>
      <div className={styles.stickyStage}>
        <div className={styles.progress} aria-hidden="true">
          <div className={styles.track}><i /></div>
          {steps.map((step, index) => (
            <div className={styles.marker} data-state={index < active ? 'done' : index === active ? 'active' : 'idle'} key={step.number}>
              <span>{index < active ? '✓' : step.number}</span>
              <strong>{step.label}</strong>
            </div>
          ))}
        </div>

        <div className={styles.cards}>
          {steps.map((step, index) => (
            <article className={styles.card} data-active={index === active} key={step.number} aria-current={index === active ? 'step' : undefined}>
              <StepArtwork type={step.visual} />
              <div className={styles.copy}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
