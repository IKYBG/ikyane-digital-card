'use client';

import Image from 'next/image';
import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SiDiscord, SiGithub, SiInstagram, SiSpotify } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';
import { ArrowUpRight, Check, Copy, ExternalLink, Mail, MapPin, RotateCcw, Share2, UserPlus } from 'lucide-react';
import { profile } from '@/data/profile';
import { downloadVCard } from '@/lib/vcard';

const spring = { type: 'spring', stiffness: 390, damping: 32, mass: 0.72 } as const;

const contacts = [
  { label: 'GitHub', value: 'ikyane', href: profile.links[0].href, icon: SiGithub, className: 'github' },
  { label: 'LinkedIn', value: 'Ikyane', href: profile.links[1].href, icon: FaLinkedinIn, className: 'linkedin' },
  { label: 'Discord', value: '@ikyane', href: profile.links[2].href, icon: SiDiscord, className: 'discord' },
  { label: 'Instagram', value: '@ikyane', href: profile.links[3].href, icon: SiInstagram, className: 'instagram' },
  { label: 'Spotify', value: 'Listening now', href: profile.links[4].href, icon: SiSpotify, className: 'spotify' },
] as const;

function Feedback({ label }: { label: string }) {
  return (
    <motion.span initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }} transition={spring} className="action-feedback">
      <Check size={14} /> {label}
    </motion.span>
  );
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
    const el = cardRef.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    el.style.setProperty('--rx', `${-y * 3.8}deg`);
    el.style.setProperty('--ry', `${x * 4.3}deg`);
    el.style.setProperty('--lx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--ly', `${(y + 0.5) * 100}%`);
  };

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--lx', '50%');
    el.style.setProperty('--ly', '18%');
  };

  const handleSave = () => { downloadVCard(profile); showFeedback('Contact saved'); };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile.name} — Digital Identity`, url: profile.url });
        showFeedback('Shared');
      } else {
        await navigator.clipboard.writeText(profile.url);
        showFeedback('Link copied');
      }
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') showFeedback('Could not share');
    }
  };
  const copyEmail = async () => { await navigator.clipboard.writeText(profile.email); showFeedback('Email copied'); };

  return (
    <main className="profile-shell">
      <div className="aurora aurora-one" aria-hidden="true" />
      <div className="aurora aurora-two" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      <motion.div className="profile-wrap" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
        <header className="topbar">
          <a href="#identity" className="brand-mark" aria-label="Ikyane, retour à la carte">IKYANE<span>.</span></a>
          <div className="top-status"><i /> Lyon · Available</div>
          <button className="icon-button" onClick={handleShare} aria-label="Partager le profil"><Share2 size={18} /></button>
        </header>

        <section id="identity" className="identity-stage" aria-label="Digital identity card">
          <motion.div className="card-perspective" initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.975 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring, delay: 0.04 }}>
            <div
              className="identity-card"
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
              <AnimatePresence mode="wait" initial={false}>
                {side === 'front' ? (
                  <motion.div key="front" className="card-face card-front" initial={{ opacity: 0, scale: 0.975, rotateY: -7, filter: 'blur(7px)' }} animate={{ opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.975, rotateY: 7, filter: 'blur(7px)' }} transition={reducedMotion ? { duration: 0 } : spring}>
                    <div className={`portrait-panel ${profile.photo ? 'has-photo' : 'portrait-placeholder'}`}>
                      {profile.photo ? <Image src={profile.photo} alt={`Portrait de ${profile.name}`} fill priority sizes="(max-width: 640px) 94vw, 390px" /> : <div className="monogram" aria-label={`Avatar ${profile.initials}`}>{profile.initials}</div>}
                      <div className="portrait-scan" aria-hidden="true" />
                      <div className="portrait-caption"><span>Digital identity</span><span>LYN / 001</span></div>
                    </div>

                    <div className="identity-copy">
                      <div className="name-row"><div><h1>{profile.name}</h1><p>{profile.username}</p></div><span className="verified" aria-label="Profil vérifié"><Check size={13} /></span></div>
                      <div className="role-block"><p>{profile.headline}</p><p>{profile.specialty}</p></div>
                      <div className="meta-row"><span><MapPin size={14} /> {profile.location}</span><span>{profile.school}</span></div>
                      <div className="current-status"><span className="pulse-dot" /><div><small>Currently building</small><strong>StudyOS</strong></div><ArrowUpRight size={17} /></div>
                      <div className="primary-actions">
                        <button className="action-primary" onClick={handleSave}><UserPlus size={17} /> Save contact</button>
                        <a className="action-secondary" href={`mailto:${profile.email}`} aria-label="Envoyer un email"><Mail size={18} /></a>
                        <button className="action-secondary" onClick={flip} aria-label="Afficher tous les contacts"><RotateCcw size={18} /></button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="back" className="card-face card-back" initial={{ opacity: 0, scale: 0.975, rotateY: 7, filter: 'blur(7px)' }} animate={{ opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.975, rotateY: -7, filter: 'blur(7px)' }} transition={reducedMotion ? { duration: 0 } : spring}>
                    <div className="back-heading"><div><span>Contact matrix</span><h2>Find me<br />online.</h2></div><button onClick={flip} aria-label="Retourner la carte"><RotateCcw size={17} /></button></div>

                    <div className="contact-matrix">
                      {contacts.map(({ label, value, href, icon: Icon, className }) => (
                        <a href={href} target="_blank" rel="noreferrer" key={label} className={`contact-tile ${className}`}>
                          <span className="brand-icon"><Icon /></span>
                          <div><strong>{label}</strong><small>{value}</small></div>
                          <ArrowUpRight size={15} />
                        </a>
                      ))}
                      <button className="contact-tile email" onClick={copyEmail}>
                        <span className="brand-icon"><Mail /></span>
                        <div><strong>Email</strong><small>{profile.email}</small></div>
                        <Copy size={15} />
                      </button>
                      <a href={profile.links[5].href} target="_blank" rel="noreferrer" className="contact-tile website">
                        <span className="brand-icon"><ExternalLink /></span>
                        <div><strong>Website</strong><small>ikyane.dev</small></div>
                        <ArrowUpRight size={15} />
                      </a>
                    </div>

                    <div className="back-actions">
                      <button onClick={handleSave}><UserPlus size={16} /> Save contact</button>
                      <button onClick={handleShare}><Share2 size={16} /> Share profile</button>
                    </div>
                    <div className="back-footer"><span>EPITA · LYON</span><span>Tap card to return</span></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <button className="flip-hint" onClick={flip}><RotateCcw size={14} /> {side === 'front' ? 'Tap the card to see contacts' : 'Tap the card to see identity'}</button>
        </section>

        <section id="now" className="content-section">
          <div className="section-heading"><span>02</span><h2>Now</h2><p>What has my attention.</p></div>
          <div className="now-list">{profile.now.map((item, index) => <motion.article key={item.label} className="now-item" initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ ...spring, delay: index * 0.04 }}><span className="now-index">0{index + 1}</span><div><small>{item.label}</small><h3>{item.value}</h3><p>{item.detail}</p></div><span className="now-line" /></motion.article>)}</div>
        </section>

        <section className="content-section projects-section">
          <div className="section-heading"><span>03</span><h2>Selected work</h2><p>Small systems, carefully made.</p></div>
          <div className="project-list">{profile.projects.map((project) => <motion.a id={project.name.toLowerCase()} key={project.name} className={`project-card project-${project.tone}`} href={project.href} whileHover={reducedMotion ? undefined : { y: -4 }} whileTap={{ scale: 0.988 }} transition={spring}><div className="project-art" aria-hidden="true"><span>{project.index}</span><i /><b /></div><div className="project-copy"><div><span>{project.index}</span><ArrowUpRight size={18} /></div><h3>{project.name}</h3><p>{project.description}</p><ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></motion.a>)}</div>
        </section>

        <footer className="site-footer"><span>© 2026 Ikyane</span><button onClick={handleShare}><Share2 size={14} /> Share profile</button></footer>
      </motion.div>
      <AnimatePresence>{feedback && <Feedback label={feedback} />}</AnimatePresence>
    </main>
  );
}
