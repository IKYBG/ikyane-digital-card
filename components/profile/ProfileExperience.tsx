'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- the interactive card contains nested actionable controls and cannot use a button element */

import Image from 'next/image';
import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SiDiscord, SiGithub, SiInstagram, SiSpotify } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';
import { ArrowUpRight, Check, Copy, ExternalLink, Mail, MapPin, RotateCcw, Share2, UserPlus } from 'lucide-react';
import { profile } from '@/data/profile';
import { downloadVCard } from '@/lib/vcard';

const spring = { type: 'spring', stiffness: 390, damping: 32, mass: 0.72 } as const;
const flipSpring = { type: 'spring', stiffness: 115, damping: 18, mass: 0.92 } as const;

const contacts = [
  { label: 'GitHub', value: 'ikyane', href: profile.links[0].href, icon: SiGithub, className: 'github' },
  { label: 'LinkedIn', value: 'Ikyane', href: profile.links[1].href, icon: FaLinkedinIn, className: 'linkedin' },
  { label: 'Discord', value: '@ikyane', href: profile.links[2].href, icon: SiDiscord, className: 'discord' },
  { label: 'Instagram', value: '@ikyane', href: profile.links[3].href, icon: SiInstagram, className: 'instagram' },
  { label: 'Spotify', value: 'À l’écoute', href: profile.links[4].href, icon: SiSpotify, className: 'spotify' },
] as const;

function Feedback({ label }: { label: string }) {
  return <motion.span initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }} transition={spring} className="action-feedback"><Check size={14} /> {label}</motion.span>;
}

export function ProfileExperience() {
  const cardRef = useRef<HTMLDivElement>(null);
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

  const handleSave = () => { downloadVCard(profile); showFeedback('Contact enregistré'); };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile.name} — Identité numérique`, url: profile.url });
        showFeedback('Profil partagé');
      } else {
        await navigator.clipboard.writeText(profile.url);
        showFeedback('Lien copié');
      }
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') showFeedback('Partage impossible');
    }
  };
  const copyEmail = async () => { await navigator.clipboard.writeText(profile.email); showFeedback('E-mail copié'); };

  const frontTabIndex = side === 'front' ? 0 : -1;
  const backTabIndex = side === 'back' ? 0 : -1;

  return (
    <main className="profile-shell">
      <div className="aurora aurora-one" aria-hidden="true" />
      <div className="aurora aurora-two" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      <motion.div className="profile-wrap" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
        <header className="topbar">
          <a href="#identity" className="brand-mark" aria-label="Ikyane, retour à la carte">IKYANE<span>.</span></a>
          <div className="top-status"><i /> Lyon · Disponible</div>
          <button className="icon-button" onClick={handleShare} aria-label="Partager le profil"><Share2 size={18} /></button>
        </header>

        <section id="identity" className="identity-stage" aria-label="Carte d’identité numérique">
          <motion.div className="card-perspective" initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.975 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring, delay: 0.04 }}>
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
              <div className="card-edge" aria-hidden="true" />
              <div className="card-glint" aria-hidden="true" />
              <motion.div
                className="flip-card"
                initial={false}
                animate={reducedMotion ? { rotateY: side === 'back' ? 180 : 0 } : {
                  rotateY: side === 'back' ? 180 : 0,
                  y: [0, -9, 0],
                  scale: [1, 0.965, 1],
                  rotateZ: side === 'back' ? [0, -0.65, 0] : [0, 0.65, 0],
                }}
                transition={{ rotateY: flipSpring, y: { duration: 0.72, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }, scale: { duration: 0.72, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }, rotateZ: { duration: 0.72, times: [0, 0.45, 1] } }}
              >
                <div className="card-face card-front" aria-hidden={side !== 'front'}>
                  <div className={`portrait-panel ${profile.photo ? 'has-photo' : 'portrait-placeholder'}`}>
                    {profile.photo ? <Image src={profile.photo} alt={`Portrait de ${profile.name}`} fill priority sizes="(max-width: 640px) 94vw, 390px" /> : <div className="monogram" aria-label={`Avatar ${profile.initials}`}>{profile.initials}</div>}
                    <div className="portrait-scan" aria-hidden="true" />
                    <span className="identity-stamp">IDENTITÉ / 001</span>
                  </div>

                  <div className="identity-copy">
                    <div className="name-row"><div><h1>{profile.name}</h1><p>{profile.username}</p></div><span className="verified" aria-label="Profil vérifié"><Check size={13} /></span></div>
                    <p className="headline">{profile.headline} · {profile.specialty}</p>
                    <div className="identity-meta"><span><MapPin size={14} /> {profile.location}</span><span>{profile.school}</span></div>
                    <div className="status-pill"><span className="pulse-dot" /><span>Je développe <strong>StudyOS</strong></span></div>
                    <div className="primary-actions">
                      <button tabIndex={frontTabIndex} className="action-primary" onClick={handleSave}><UserPlus size={17} /> Enregistrer</button>
                      <button tabIndex={frontTabIndex} className="action-secondary" onClick={flip}>Mes contacts <RotateCcw size={16} /></button>
                    </div>
                  </div>
                </div>

                <div className="card-face card-back" aria-hidden={side !== 'back'}>
                  <div className="back-heading"><div><span>Réseaux & contact</span><h2>Retrouvez-moi<br />en ligne.</h2></div><button tabIndex={backTabIndex} onClick={flip} aria-label="Retourner la carte"><RotateCcw size={17} /></button></div>
                  <div className="contact-matrix">
                    {contacts.map(({ label, value, href, icon: Icon, className }) => (
                      <a tabIndex={backTabIndex} href={href} target="_blank" rel="noreferrer" key={label} className={`contact-tile ${className}`}>
                        <span className="brand-icon"><Icon /></span><div><strong>{label}</strong><small>{value}</small></div><ArrowUpRight size={15} />
                      </a>
                    ))}
                    <button tabIndex={backTabIndex} className="contact-tile email" onClick={copyEmail}><span className="brand-icon"><Mail /></span><div><strong>E-mail</strong><small>{profile.email}</small></div><Copy size={15} /></button>
                    <a tabIndex={backTabIndex} href={profile.links[5].href} target="_blank" rel="noreferrer" className="contact-tile website"><span className="brand-icon"><ExternalLink /></span><div><strong>Site web</strong><small>ikyane.dev</small></div><ArrowUpRight size={15} /></a>
                  </div>
                  <div className="back-actions"><button tabIndex={backTabIndex} onClick={handleSave}><UserPlus size={16} /> Enregistrer</button><button tabIndex={backTabIndex} onClick={handleShare}><Share2 size={16} /> Partager</button></div>
                  <div className="back-footer"><span>EPITA · LYON</span><span>Touchez pour revenir</span></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <button className="flip-hint" onClick={flip}><RotateCcw size={14} /> {side === 'front' ? 'Touchez la carte pour voir mes contacts' : 'Touchez la carte pour voir mon profil'}</button>
        </section>

        <section id="now" className="content-section">
          <div className="section-heading"><span>02</span><h2>En ce moment</h2><p>Ce qui occupe mon attention.</p></div>
          <div className="now-list">{profile.now.map((item, index) => <motion.article key={item.label} className="now-item" initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ ...spring, delay: index * 0.04 }}><span className="now-index">0{index + 1}</span><div><small>{item.label}</small><h3>{item.value}</h3><p>{item.detail}</p></div><span className="now-line" /></motion.article>)}</div>
        </section>

        <section className="content-section projects-section">
          <div className="section-heading"><span>03</span><h2>Projets sélectionnés</h2><p>Des systèmes simples, conçus avec soin.</p></div>
          <div className="project-list">{profile.projects.map((project) => <motion.a id={project.name.toLowerCase()} key={project.name} className={`project-card project-${project.tone}`} href={project.href} whileHover={reducedMotion ? undefined : { y: -4 }} whileTap={{ scale: 0.988 }} transition={spring}><div className="project-art" aria-hidden="true"><span>{project.index}</span><i /><b /></div><div className="project-copy"><div><span>{project.index}</span><ArrowUpRight size={18} /></div><h3>{project.name}</h3><p>{project.description}</p><ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></motion.a>)}</div>
        </section>

        <footer className="site-footer"><span>© 2026 Ikyane</span><button onClick={handleShare}><Share2 size={14} /> Partager le profil</button></footer>
      </motion.div>
      <AnimatePresence>{feedback && <Feedback label={feedback} />}</AnimatePresence>
    </main>
  );
}
