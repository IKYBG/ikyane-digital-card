'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- the interactive card contains nested actionable controls and cannot use a button element */

import Image from 'next/image';
import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { SiDiscord, SiGithub, SiInstagram, SiSnapchat, SiTiktok } from 'react-icons/si';
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Mail, Phone, RotateCcw, Share2, UserPlus } from 'lucide-react';
import AnimatedGradient from '@/components/ui/animated-gradient';
import { profile } from '@/data/profile';
import { downloadVCard } from '@/lib/vcard';

const spring = { type: 'spring', stiffness: 390, damping: 32, mass: 0.72 } as const;
const flipSpring = { type: 'spring', stiffness: 115, damping: 18, mass: 0.92 } as const;

const contacts = [
  { label: 'Discord', value: profile.links.discord.username, href: profile.links.discord.webUrl, icon: SiDiscord, className: 'discord', discord: true },
  { label: 'Snapchat', value: profile.links.snapchat.username, href: profile.links.snapchat.webUrl, icon: SiSnapchat, className: 'snapchat', discord: false },
  { label: 'Instagram', value: profile.links.instagram.username, href: profile.links.instagram.webUrl, icon: SiInstagram, className: 'instagram', discord: false },
  { label: 'GitHub', value: profile.links.github.username, href: profile.links.github.webUrl, icon: SiGithub, className: 'github', discord: false },
  { label: 'TikTok', value: `@${profile.links.tiktok.username}`, href: profile.links.tiktok.webUrl, icon: SiTiktok, className: 'tiktok', discord: false },
] as const;

function Feedback({ label }: { label: string }) {
  return <motion.span initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }} transition={spring} className="action-feedback"><Check size={14} /> {label}</motion.span>;
}

export function ProfileExperience() {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragFlippedRef = useRef(false);
  const swipeStartRef = useRef<{ x: number; time: number } | null>(null);
  const lastSwipeFlipRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [feedback, setFeedback] = useState<string | null>(null);

  const flip = () => setSide((current) => current === 'front' ? 'back' : 'front');
  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 1800);
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    if (dragFlippedRef.current) {
      dragFlippedRef.current = false;
      return;
    }
    flip();
  };

  const handleCardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flip();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const element = cardRef.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    element.style.setProperty('--rx', `${-y * 3.4}deg`);
    element.style.setProperty('--ry', `${x * 3.8}deg`);
    element.style.setProperty('--lx', `${(x + 0.5) * 100}%`);
    element.style.setProperty('--ly', `${(y + 0.5) * 100}%`);
  };

  const resetTilt = () => {
    const element = cardRef.current;
    if (!element) return;
    element.style.setProperty('--rx', '0deg');
    element.style.setProperty('--ry', '0deg');
    element.style.setProperty('--lx', '50%');
    element.style.setProperty('--ly', '18%');
  };

  const commitSwipeFlip = (distance: number, speed: number) => {
    if (distance < 74 && speed < 520) return;
    const now = Date.now();
    if (now - lastSwipeFlipRef.current < 320) return;

    lastSwipeFlipRef.current = now;
    dragFlippedRef.current = true;
    flip();
    window.setTimeout(() => {
      dragFlippedRef.current = false;
    }, 160);
  };

  const handleSwipeEnd = (_: unknown, info: PanInfo) => {
    commitSwipeFlip(Math.abs(info.offset.x), Math.abs(info.velocity.x));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartRef.current = { x: event.clientX, time: performance.now() };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const distance = Math.abs(event.clientX - start.x);
    const elapsed = Math.max(performance.now() - start.time, 1);
    commitSwipeFlip(distance, (distance / elapsed) * 1000);
  };

  const currentProfileUrl = () => `${window.location.origin}/card`;
  const handleSave = () => { downloadVCard(profile, currentProfileUrl()); showFeedback('Contact enregistré'); };
  const handleShare = async () => {
    const url = currentProfileUrl();
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile.name} — Identité numérique`, url });
        showFeedback('Profil partagé');
      } else {
        await navigator.clipboard.writeText(url);
        showFeedback('Lien copié');
      }
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') showFeedback('Partage impossible');
    }
  };
  const openDiscord = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    await navigator.clipboard.writeText(profile.links.discord.username);
    showFeedback('Pseudo Discord copié');

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      window.open(profile.links.discord.webUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.href = profile.links.discord.appUrl;
    window.setTimeout(() => {
      if (!document.hidden) window.location.href = profile.links.discord.webUrl;
    }, 900);
  };

  const frontTabIndex = side === 'front' ? 0 : -1;
  const backTabIndex = side === 'back' ? 0 : -1;

  return (
    <main className="profile-shell">
      <AnimatedGradient
        className="animated-background"
        config={{
          color1: '#01030a', color2: '#062753', color3: '#0b75ad',
          rotation: -18, proportion: 47, scale: .46, speed: 42,
          distortion: 7, swirl: 28, swirlIterations: 3,
          softness: 88, offset: -180, shape: 'Edge', shapeSize: 58,
        }}
        noise={{ opacity: 0.035, scale: 0.7 }}
        style={{ position: 'fixed', zIndex: 0 }}
      />
      <div className="background-veil" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      <motion.div className="profile-wrap" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
        <header className="topbar">
          <a href="#identity" className="brand-mark" aria-label="Ikyane, retour à la carte">IKYANE<span>.</span></a>
          <div className="top-status"><i /> Lyon · Disponible</div>
          <button className="icon-button" onClick={handleShare} aria-label="Partager le profil"><Share2 size={18} /></button>
        </header>

        <section id="identity" className="identity-stage" aria-label="Carte d’identité numérique">
          <motion.div className="card-perspective" initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.975 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring, delay: 0.04 }}>
            <div className="swipe-orbit swipe-orbit-left" aria-hidden="true"><ChevronLeft size={19} /><i /><i /><i /></div>
            <div className="swipe-orbit swipe-orbit-right" aria-hidden="true"><i /><i /><i /><ChevronRight size={19} /></div>
            <div className="card-breath">
              <motion.div
                className="card-motion-shell"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={handleSwipeEnd}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => { swipeStartRef.current = null; }}
                whileDrag={reducedMotion ? undefined : { scale: 0.975, rotateZ: 0.7 }}
                transition={spring}
              >
                <div
                  className={`identity-card side-${side}`}
                  ref={cardRef}
                  role="button"
                  tabIndex={0}
                  aria-label={side === 'front' ? 'Retourner la carte pour afficher les contacts' : 'Retourner la carte pour afficher le profil'}
                  onClick={handleCardClick}
                  onKeyDown={handleCardKey}
                  onPointerMove={handlePointerMove}
                  onPointerLeave={resetTilt}
                >
                  <div className="card-depth" aria-hidden="true" />
                  <div className="card-edge" aria-hidden="true" />
                  <div className="card-glint" aria-hidden="true" />
                  <motion.div
                    className="flip-card"
                    initial={false}
                    animate={reducedMotion ? { rotateY: side === 'back' ? 180 : 0 } : {
                      rotateY: side === 'back' ? 180 : 0,
                      y: [0, -11, 0],
                      scale: [1, 0.955, 1],
                      rotateZ: side === 'back' ? [0, -0.8, 0] : [0, 0.8, 0],
                    }}
                    transition={{ rotateY: flipSpring, y: { duration: 0.78, times: [0, 0.46, 1], ease: [0.22, 1, 0.36, 1] }, scale: { duration: 0.78, times: [0, 0.46, 1], ease: [0.22, 1, 0.36, 1] }, rotateZ: { duration: 0.78, times: [0, 0.46, 1] } }}
                  >
                    <div className="card-face card-front" aria-hidden={side !== 'front'}>
                      <motion.div className={`portrait-panel ${profile.photo ? 'has-photo' : 'portrait-placeholder'}`} animate={side === 'front' ? { opacity: 1, scale: 1.015 } : { opacity: 0.72, scale: 1.065 }} transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}>
                        {profile.photo ? <Image src={profile.photo} alt={`Portrait de ${profile.name}`} fill priority sizes="(max-width: 640px) 94vw, 390px" /> : <div className="monogram" aria-label={`Avatar ${profile.initials}`}>{profile.initials}</div>}
                        <div className="portrait-scan" aria-hidden="true" />
                      </motion.div>
                      <motion.div className="identity-copy" animate={side === 'front' ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ ...spring, delay: side === 'front' ? 0.26 : 0 }}>
                        <div className="name-row"><div><h1>{profile.name}</h1></div><span className="verified" aria-label="Profil vérifié"><Check size={13} /></span></div>
                        <p className="headline">{profile.headline}</p>
                        <p className="identity-role">{profile.level} · {profile.school}</p>
                        <div className="primary-actions">
                          <motion.button tabIndex={frontTabIndex} className="action-primary" onClick={flip} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Voir mes contacts <ArrowUpRight size={17} /></motion.button>
                        </div>
                      </motion.div>
                    </div>

                    <div className="card-face card-back" aria-hidden={side !== 'back'}>
                      <div className="back-heading"><div><span>Contact</span><h2>Mes contacts</h2></div><button tabIndex={backTabIndex} onClick={flip} aria-label="Retourner la carte"><RotateCcw size={17} /></button></div>
                      <div className="contact-groups">
                        <div className="contact-group"><span className="contact-group-label">Réseaux</span><div className="contact-matrix network-matrix">
                          {contacts.map(({ label, value, href, icon: Icon, className, discord }, index) => (
                            <motion.a tabIndex={backTabIndex} href={href} target="_blank" rel="noreferrer" key={label} className={`contact-tile ${className}`} onClick={discord ? openDiscord : undefined} animate={side === 'back' ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 13, scale: 0.975 }} transition={{ ...spring, delay: side === 'back' ? 0.2 + index * 0.045 : 0 }} whileHover={{ y: -3, scale: 1.012 }} whileTap={{ scale: 0.97 }}>
                              <span className="brand-icon"><Icon /></span><div><strong>{label}</strong><small>{value}</small></div><ArrowUpRight size={15} />
                            </motion.a>
                          ))}
                        </div></div>
                        <div className="contact-group"><span className="contact-group-label">Direct</span><div className="contact-matrix direct-matrix">
                          <motion.a tabIndex={backTabIndex} className="contact-tile email" href={`mailto:${profile.email}`} animate={side === 'back' ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 13, scale: 0.975 }} transition={{ ...spring, delay: side === 'back' ? 0.43 : 0 }} whileHover={{ y: -3, scale: 1.012 }} whileTap={{ scale: 0.97 }}><span className="brand-icon"><Mail /></span><div><strong>M’écrire</strong><small>{profile.email}</small></div><ArrowUpRight size={15} /></motion.a>
                          <motion.a tabIndex={backTabIndex} className="contact-tile phone" href={`tel:${profile.phone}`} animate={side === 'back' ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 13, scale: 0.975 }} transition={{ ...spring, delay: side === 'back' ? 0.48 : 0 }} whileHover={{ y: -3, scale: 1.012 }} whileTap={{ scale: 0.97 }}><span className="brand-icon"><Phone /></span><div><strong>M’appeler</strong><small>06 38 17 47 16</small></div><ArrowUpRight size={15} /></motion.a>
                        </div></div>
                      </div>
                      <div className="back-actions"><button tabIndex={backTabIndex} onClick={handleSave}><UserPlus size={16} /> Enregistrer</button><button tabIndex={backTabIndex} onClick={handleShare}><Share2 size={16} /> Partager</button></div>
                      <div className="back-footer"><span>EPITA · LYON</span><span>Glissez pour revenir</span></div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <button className="flip-hint" onClick={flip}><RotateCcw size={14} /> {side === 'front' ? 'Touchez ou glissez' : 'Revenir au profil'}</button>
        </section>

        <section id="journey" className="content-section">
          <div className="section-heading"><span>02</span><h2>Mon parcours</h2><p>Les établissements qui ont jalonné mon chemin.</p></div>
          <div className="now-list journey-list">{profile.journey.map((item, index) => <motion.article key={item.value} className="now-item" initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ ...spring, delay: index * 0.04 }}><span className="now-index">0{index + 1}</span><div><small>{item.label}</small><h3>{item.value}</h3><p>{item.detail}</p></div><span className="now-line" /></motion.article>)}</div>
        </section>

        <section id="now" className="content-section">
          <div className="section-heading"><span>03</span><h2>En ce moment</h2><p>Ce qui occupe mon attention.</p></div>
          <div className="now-list">{profile.now.map((item, index) => <motion.article key={item.label} className="now-item" initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ ...spring, delay: index * 0.04 }}><span className="now-index">0{index + 1}</span><div><small>{item.label}</small><h3>{item.value}</h3><p>{item.detail}</p></div><span className="now-line" /></motion.article>)}</div>
        </section>

        <section className="content-section projects-section">
          <div className="section-heading"><span>04</span><h2>Projets sélectionnés</h2><p>Des systèmes simples, conçus avec soin.</p></div>
          <div className="project-list">{profile.projects.map((project) => <motion.a id={project.name.toLowerCase()} key={project.name} className={`project-card project-${project.tone}`} href={project.href} whileHover={reducedMotion ? undefined : { y: -4 }} whileTap={{ scale: 0.988 }} transition={spring}><div className="project-art" aria-hidden="true"><span>{project.index}</span><i /><b /></div><div className="project-copy"><div><span>{project.index}</span><ArrowUpRight size={18} /></div><h3>{project.name}</h3><p>{project.description}</p><ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></motion.a>)}</div>
        </section>

        <footer className="site-footer"><span>© 2026 Ikyane</span><button onClick={handleShare}><Share2 size={14} /> Partager le profil</button></footer>
      </motion.div>
      <AnimatePresence>{feedback && <Feedback label={feedback} />}</AnimatePresence>
    </main>
  );
}
