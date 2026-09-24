'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Link2, QrCode } from 'lucide-react';
import styles from './PrismaQardHero.module.css';

const title = ['Une', 'rencontre.', 'Tous', 'vos', 'contacts.'];

export function PrismaQardHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className={styles.hero} aria-labelledby="prisma-qard-title">
      <Image
        className={styles.image}
        src="/qard-prisma-campus.png"
        alt="Deux étudiants partagent une Qard par QR code sur un campus"
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.lightVeil} aria-hidden="true" />
      <div className={styles.copy}>
        <motion.span
          className={styles.eyebrow}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Check size={14} /> Votre identité, prête à être partagée
        </motion.span>
        <h1 id="prisma-qard-title" aria-label="Une rencontre. Tous vos contacts.">
          {title.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={reducedMotion ? false : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.08 + index * 0.075,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          Un lien permanent rassemble votre profil et les moyens utiles pour
          vous joindre. Un scan suffit.
        </motion.p>
        <motion.div
          className={styles.actions}
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/signup" prefetch={false}>
            Créer ma Qard <ArrowUpRight size={18} />
          </Link>
          <Link href="/card" prefetch={false}>Voir une Qard</Link>
        </motion.div>
      </div>
      <motion.div
        className={styles.productNote}
        initial={reducedMotion ? false : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
      >
        <span><QrCode size={19} /></span>
        <div><b>QR permanent</b><small>Votre lien ne change pas</small></div>
      </motion.div>
      <div className={styles.bottomRail}>
        <span><Link2 size={15} /> Un lien pour tout</span>
        <span>Sans application</span>
        <span>Toujours modifiable</span>
      </div>
    </section>
  );
}
