'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
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
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const canAnimate =
      !reducedMotion &&
      !connection?.saveData &&
      window.matchMedia('(min-width: 768px)').matches;
    if (!canAnimate) return;
    const start = () => setVideoReady(true);
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const id = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(start, { timeout: 900 })
      : window.setTimeout(start, 500);
    return () => {
      if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [reducedMotion]);

  return (
    <main className="h-[100svh] w-full bg-black p-0 sm:p-2">
      <section className="relative h-full w-full overflow-hidden rounded-none bg-black sm:rounded-2xl md:rounded-[2rem]">
        <Image
          src="/qard-prisma-campus.png"
          alt="Une Qard partagée instantanément sur un campus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {videoReady && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/qard-prisma-campus.png"
            className="absolute inset-0 h-full w-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          />
        )}

        <div className="qard-prisma-noise pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/75" />

        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2" aria-label="Navigation principale">
          <div className="flex items-center gap-4 rounded-b-2xl bg-black px-5 py-3 sm:gap-8 md:gap-12 md:rounded-b-3xl md:px-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch={false}
                className="whitespace-nowrap text-[10px] text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC] sm:text-xs md:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute inset-x-0 bottom-[clamp(10px,2vh,26px)] z-10 px-4 pb-[max(14px,env(safe-area-inset-bottom))] sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-x-4 gap-y-3">
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="text-[25vw] font-medium leading-[0.78] tracking-[-0.075em] text-[#E1E0CC] sm:text-[23vw] md:text-[21vw] lg:text-[18vw] xl:text-[17vw]"
                aria-label="Qard"
              >
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
                className="max-w-md text-xs text-[#E1E0CC]/80 sm:text-sm md:text-base"
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
                <Link
                  href="/signup"
                  prefetch={false}
                  className="qard-prisma-cta group inline-flex items-center gap-2 rounded-full bg-[#E1E0CC] py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                >
                  Créer ma Qard
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4 text-[#E1E0CC]" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
