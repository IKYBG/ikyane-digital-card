'use client';

import Image from 'next/image';
import { AtSign, Mail, Phone, ScanLine, UserRound } from 'lucide-react';
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
        <div className={styles.url}><i /><i /></div>
        <div className={styles.qrFrame}><Image src="/ikyane-qr.png" width={104} height={104} alt="" sizes="104px" /></div>
        <div className={styles.scanLine}><ScanLine size={22} /></div>
      </div>
    );
  }

  return (
    <div className={`${styles.artwork} ${styles.contact}`} aria-hidden="true">
      <div className={styles.miniCard}>
        <div className={styles.miniPortrait} />
        <div className={styles.identityLines}><i /><i /></div>
        <div className={styles.quickActions}><span><Mail size={18} /></span><span><Phone size={18} /></span></div>
      </div>
      <p><i /><i /><i /></p>
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
