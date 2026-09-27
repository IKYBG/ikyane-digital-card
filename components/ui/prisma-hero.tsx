'use client';

import type { CSSProperties } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
}

export function WordsPullUp({
  text,
  className = '',
  showAsterisk = false,
  style,
}: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      style={style}
    >
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        return (
          <motion.span
            key={`${word}-${index}`}
            initial={reducedMotion ? false : { y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute -right-[0.3em] top-[0.65em] text-[0.31em]">
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
}

const navItems = [
  { label: 'Exemple', href: '/card' },
  { label: 'Tarifs', href: '/pricing' },
  { label: 'Connexion', href: '/login' },
];

export function PrismaHero() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="prisma-shell">
      <section className="prisma-scene">
        <Image
          src="/qard-prisma-campus.png"
          alt="Une Qard partagée instantanément sur un campus"
          fill
          priority
          sizes="100vw"
          className="prisma-background"
        />
        <div className="qard-prisma-noise pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay" />
        <div className="prisma-vignette" aria-hidden="true" />
        <div className="prisma-light" aria-hidden="true" />

        <header className="prisma-topbar">
          <Link className="prisma-wordmark" href="/" aria-label="Qard, accueil">
            Qard<span aria-hidden="true">.</span>
          </Link>
          <nav aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="prisma-top-cta" href="/signup">
            Créer ma Qard <ArrowUpRight size={15} />
          </Link>
        </header>

        <div className="prisma-content">
          <div className="grid grid-cols-12 items-end gap-x-4 gap-y-3">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="prisma-title" aria-label="Qard">
                <WordsPullUp text="Qard" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-3 lg:col-span-4 lg:pb-10">
              <motion.p
                initial={reducedMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="prisma-lead"
                style={{ lineHeight: 1.3 }}
              >
                Votre identité, vos contacts et vos réseaux réunis dans une
                seule Qard. Un lien permanent à partager en un geste.
              </motion.p>

              <motion.div
                initial={reducedMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="prisma-actions">
                  <Link href="/signup" className="qard-prisma-cta group">
                    Créer ma Qard
                    <span>
                      <ArrowRight size={17} />
                    </span>
                  </Link>
                  <Link href="/card" className="prisma-example-link">
                    Voir un exemple <ArrowUpRight size={15} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
