'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AtSign,
  Check,
  Link2,
  Mail,
  Phone,
  QrCode,
  UserRound,
} from 'lucide-react';
import styles from './QardFeatureSteps.module.css';

const steps = [
  {
    number: '01',
    title: 'Reliez vos informations',
    text: 'Votre identité et vos contacts se retrouvent au même endroit.',
    visual: 'profile',
  },
  {
    number: '02',
    title: 'Partagez une seule fois',
    text: 'Un lien et un QR permanents, même lorsque vos informations changent.',
    visual: 'share',
  },
  {
    number: '03',
    title: 'Votre Qard s’ouvre',
    text: 'Vos contacts accèdent immédiatement à votre carte depuis leur téléphone.',
    visual: 'phone',
  },
] as const;

function StepVisual({ visual }: { visual: (typeof steps)[number]['visual'] }) {
  if (visual === 'profile') {
    return (
      <div className={`${styles.visual} ${styles.profileVisual}`}>
        <div className={styles.miniProfile}>
          <span><UserRound size={26} /></span>
          <i /><i />
        </div>
        <div className={styles.contactStream}>
          <span><Mail size={18} /></span>
          <span><Phone size={18} /></span>
          <span><AtSign size={18} /></span>
        </div>
        <div className={styles.miniQard}>
          <b>Qard</b>
          <i /><i /><i />
          <Check size={17} />
        </div>
      </div>
    );
  }

  if (visual === 'share') {
    return (
      <div className={`${styles.visual} ${styles.shareVisual}`}>
        <div className={styles.shareLink}><Link2 size={20} /><span>myqard.vercel.app/u/vous</span></div>
        <div className={styles.shareLine} />
        <div className={styles.qrCard}>
          <QrCode size={76} strokeWidth={1.35} />
          <small>QR permanent</small>
        </div>
        <div className={styles.timeSaved}><b>1×</b><span>à partager</span></div>
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.phoneVisual}`}>
      <div className={styles.phoneHand} aria-hidden="true" />
      <div className={styles.phone}>
        <i className={styles.dynamicIsland} />
        <div className={styles.phoneQard}>
          <b>Qard</b>
          <span><UserRound size={25} /></span>
          <strong>Camille Morel</strong>
          <small>Designer produit</small>
          <button type="button">Entrer en contact</button>
        </div>
      </div>
    </div>
  );
}

export function QardFeatureSteps() {
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = root.current;
    if (!element || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (timer.current !== null) window.clearInterval(timer.current);
        timer.current = null;
        if (!entry.isIntersecting) return;
        timer.current = window.setInterval(
          () => setActive((current) => (current + 1) % steps.length),
          3600,
        );
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [reducedMotion]);

  return (
    <div ref={root} className={styles.root}>
      <div className={styles.steps} role="tablist" aria-label="Fonctionnement de Qard">
        {steps.map((step, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === index}
            className={active === index ? styles.active : undefined}
            onClick={() => setActive(index)}
            key={step.number}
          >
            <span>{active > index ? <Check size={15} /> : step.number}</span>
            <div><b>{step.title}</b><small>{step.text}</small></div>
            <i><em /></i>
          </button>
        ))}
      </div>
      <div className={styles.stage} aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={steps[active].visual}
            initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepVisual visual={steps[active].visual} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
