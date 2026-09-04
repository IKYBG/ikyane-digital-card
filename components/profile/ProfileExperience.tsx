'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, Check, ChevronRight, CodeXml, Copy, Download, ExternalLink, Mail, MapPin, MessageCircle, Music2, QrCode, RotateCcw, Share2, Sparkles, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { profile } from '@/data/profile';
import { downloadVCard } from '@/lib/vcard';

const iconFor = { GitHub: CodeXml, LinkedIn: BriefcaseBusiness, Discord: MessageCircle, Instagram: Sparkles, Spotify: Music2, Portfolio: ExternalLink };
const spring = { type: 'spring', stiffness: 360, damping: 30, mass: 0.7 } as const;

function Feedback({ label }: { label: string }) {
  return <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="action-feedback"><Check size={14} /> {label}</motion.span>;
}

export function ProfileExperience() {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 1800);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const el = cardRef.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    el.style.setProperty('--rx', `${-y * 4.5}deg`);
    el.style.setProperty('--ry', `${x * 5}deg`);
    el.style.setProperty('--lx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--ly', `${(y + 0.5) * 100}%`);
  };

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    ['--rx', '--ry', '--lx', '--ly'].forEach((name, index) => el.style.setProperty(name, ['0deg', '0deg', '50%', '20%'][index]));
  };

  const handleSave = () => { downloadVCard(profile); showFeedback('Contact saved'); };
  const handleShare = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: `${profile.name} — Digital Identity`, url: profile.url }); showFeedback('Shared'); }
      else { await navigator.clipboard.writeText(profile.url); showFeedback('Link copied'); }
    } catch (error) { if ((error as DOMException).name !== 'AbortError') showFeedback('Could not share'); }
  };
  const copyEmail = async () => { await navigator.clipboard.writeText(profile.email); showFeedback('Email copied'); };
  const downloadQR = () => {
    const svg = document.querySelector('#profile-qr svg');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
    const href = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = href; link.download = 'ikyane-qr.svg'; link.click(); URL.revokeObjectURL(href); showFeedback('QR downloaded');
  };

  return (
    <main className="profile-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <motion.div className="profile-wrap" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
        <header className="topbar">
          <a href="#identity" className="brand-mark" aria-label="Ikyane, retour à la carte">IKYANE<span className="brand-dot">.</span></a>
          <div className="top-status"><span /> Lyon · Available</div>
          <button className="icon-button" onClick={handleShare} aria-label="Partager le profil"><Share2 size={18} /></button>
        </header>

        <section id="identity" className="identity-stage" aria-label="Digital identity card">
          <motion.div className="card-perspective" initial={reducedMotion ? false : { opacity: 0, y: 22, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring, delay: 0.06 }}>
            <div className="identity-card" ref={cardRef} onPointerMove={handlePointerMove} onPointerLeave={resetTilt}>
              <div className="card-glint" aria-hidden="true" />
              <AnimatePresence mode="wait" initial={false}>
                {side === 'front' ? (
                  <motion.div key="front" className="card-face card-front" initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 10, filter: 'blur(5px)' }} transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="portrait-panel">
                      <div className="portrait-noise" aria-hidden="true" /><div className="avatar-orbit" aria-hidden="true"><span /><span /></div>
                      <div className="monogram" aria-label={`Avatar ${profile.initials}`}>{profile.initials}</div>
                      <div className="portrait-caption"><span>Digital identity</span><span>04 · 09 · 26</span></div>
                    </div>
                    <div className="identity-copy">
                      <div className="name-row"><div><h1>{profile.name}</h1><p>{profile.username}</p></div><span className="verified" aria-label="Profil vérifié"><Check size={14} /></span></div>
                      <div className="role-block"><p>{profile.headline}</p><p>{profile.specialty}</p></div>
                      <div className="meta-row"><span><MapPin size={14} /> {profile.location}</span><span>{profile.school}</span></div>
                      <div className="current-status"><span className="pulse-dot" /><div><small>Currently building</small><strong>StudyOS</strong></div><ArrowUpRight size={17} /></div>
                      <div className="primary-actions">
                        <button className="action-primary" onClick={handleSave}><UserPlus size={17} /> Save contact</button>
                        <a className="action-secondary" href={`mailto:${profile.email}`}><Mail size={18} /><span className="sr-only">Email</span></a>
                        <button className="action-secondary" onClick={() => setQrOpen(true)}><QrCode size={18} /><span className="sr-only">Ouvrir le QR code</span></button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="back" className="card-face card-back" initial={{ opacity: 0, x: 10, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -10, filter: 'blur(5px)' }} transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="back-heading"><span>IKYANE / 001</span><span>LYON — FR</span></div>
                    <div className="qr-lockup"><div className="qr-frame"><QRCodeSVG value={profile.qrUrl} size={178} level="H" bgColor="#f3f4ef" fgColor="#101210" /></div><p>Scan to open<br /><strong>the live profile.</strong></p></div>
                    <div className="back-contact"><button onClick={copyEmail}><span>Email</span><strong>{profile.email}</strong><Copy size={15} /></button><button onClick={handleShare}><span>Profile</span><strong>ikyane.dev/card</strong><Share2 size={15} /></button></div>
                    <div className="back-footer"><span>Made with intent.</span><span className="nfc-mark">)))</span></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <button className="flip-button" onClick={() => setSide(side === 'front' ? 'back' : 'front')}><RotateCcw size={15} /> {side === 'front' ? 'Turn card' : 'Show identity'}</button>
          <a className="explore-cue" href="#now"><span>Explore profile</span><ArrowDown size={14} /></a>
        </section>

        <section id="now" className="content-section">
          <div className="section-heading"><span>02</span><h2>Now</h2><p>What has my attention.</p></div>
          <div className="now-list">{profile.now.map((item, index) => <motion.article key={item.label} className="now-item" initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ ...spring, delay: index * 0.04 }}><span className="now-index">0{index + 1}</span><div><small>{item.label}</small><h3>{item.value}</h3><p>{item.detail}</p></div><span className="now-line" /></motion.article>)}</div>
        </section>

        <section className="content-section projects-section">
          <div className="section-heading"><span>03</span><h2>Selected work</h2><p>Small systems, carefully made.</p></div>
          <div className="project-list">{profile.projects.map((project) => <motion.a id={project.name.toLowerCase()} key={project.name} className={`project-card project-${project.tone}`} href={project.href} whileHover={reducedMotion ? undefined : { y: -4 }} whileTap={{ scale: 0.988 }} transition={spring}><div className="project-art" aria-hidden="true"><span>{project.index}</span><i /><b /></div><div className="project-copy"><div><span>{project.index}</span><ArrowUpRight size={18} /></div><h3>{project.name}</h3><p>{project.description}</p><ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></motion.a>)}</div>
        </section>

        <section className="content-section internet-section">
          <div className="section-heading"><span>04</span><h2>Internet</h2><p>Elsewhere, selectively.</p></div>
          <div className="social-list">{profile.links.map((link) => { const Icon = iconFor[link.label as keyof typeof iconFor]; return <a href={link.href} target="_blank" rel="noreferrer" key={link.label} className="social-row"><span className="social-icon"><Icon size={18} /></span><strong>{link.label}</strong><small>{link.handle}</small><ChevronRight size={18} className="social-arrow" /></a>; })}</div>
        </section>

        <section className="contact-section">
          <span className="contact-kicker">05 — Contact</span><h2>Let’s make something<br />worth keeping.</h2><p>{profile.availability}</p>
          <div className="contact-actions"><a href={`mailto:${profile.email}`}><Mail size={17} /> Write to me</a><button onClick={handleShare}><Share2 size={17} /> Share profile</button></div>
          <div className="contact-footer"><span>© 2026 Ikyane</span><a href="#identity">Back to top <ArrowUpRight size={13} /></a></div>
        </section>
      </motion.div>

      <AnimatePresence>{feedback && <Feedback label={feedback} />}</AnimatePresence>
      <Dialog open={qrOpen} onOpenChange={setQrOpen}><DialogContent className="qr-dialog" id="profile-qr"><DialogHeader><DialogTitle>Scan the profile</DialogTitle><DialogDescription>This QR always points to the redirect route, so its destination can evolve.</DialogDescription></DialogHeader><div className="modal-qr"><QRCodeSVG value={profile.qrUrl} size={220} level="H" bgColor="#f6f7f2" fgColor="#101210" /></div><div className="modal-actions"><button onClick={downloadQR}><Download size={16} /> Download</button><button onClick={handleShare}><Share2 size={16} /> Share</button></div></DialogContent></Dialog>
    </main>
  );
}
