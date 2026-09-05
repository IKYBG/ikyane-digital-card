"use client";

/* oxlint-disable jsx-a11y/prefer-tag-over-role, next/no-html-link-for-pages -- the card contains nested controls and the vCard endpoint is a download */
import Image from "next/image";
import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RotateCcw,
  Share2,
  UserPlus,
} from "lucide-react";
import type { QardData, SocialLink } from "@/types/database";
import { platformLabels } from "@/lib/qard/social";
import { SocialIcon } from "./SocialIcon";

const spring = { type: "spring", stiffness: 390, damping: 32, mass: 0.72 } as const;
const flipSpring = { type: "spring", stiffness: 118, damping: 19, mass: 0.9 } as const;
const directPlatforms = new Set(["email", "phone", "website"]);

type DisplayLink = Pick<SocialLink, "id" | "platform" | "label" | "url" | "username">;

export function QardPreview({
  data,
  compact = false,
  analyticsAttributes = false,
}: {
  data: QardData;
  compact?: boolean;
  analyticsAttributes?: boolean;
}) {
  const { profile, appearance } = data;
  const cardRef = useRef<HTMLDivElement>(null);
  const dragFlippedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const [side, setSide] = useState<"front" | "back">("front");
  const [shared, setShared] = useState(false);
  const enabledLinks = data.links.filter((link) => link.enabled);
  const networkLinks = enabledLinks.filter((link) => !directPlatforms.has(link.platform));
  const configuredDirect = enabledLinks.filter((link) => directPlatforms.has(link.platform));
  const directLinks: DisplayLink[] = [...configuredDirect];

  if (profile.email_public && !directLinks.some((link) => link.platform === "email")) {
    directLinks.push({ id: "profile-email", platform: "email", label: "M’écrire", url: `mailto:${profile.email_public}`, username: profile.email_public });
  }
  if (profile.phone_public && !directLinks.some((link) => link.platform === "phone")) {
    directLinks.push({ id: "profile-phone", platform: "phone", label: "M’appeler", url: `tel:${profile.phone_public.replace(/\s/g, "")}`, username: profile.phone_public });
  }
  if (profile.website && !directLinks.some((link) => link.platform === "website")) {
    directLinks.push({ id: "profile-website", platform: "website", label: "Site web", url: profile.website, username: profile.website.replace(/^https?:\/\//, "") });
  }

  const visual = profile.avatar_url || profile.banner_url;
  const background = appearance.background_type === "image"
    ? `linear-gradient(rgb(3 10 23 / .2), rgb(3 12 27 / .82)), url(${JSON.stringify(appearance.background_value)}) center / cover`
    : appearance.background_value;
  const vars = {
    "--preview-accent": appearance.accent_color,
    "--preview-text": appearance.text_color,
    "--preview-radius": `${Math.max(24, appearance.card_radius)}px`,
    "--preview-opacity": appearance.card_opacity,
    "--preview-blur": `${appearance.card_blur}px`,
    "--preview-bg": background,
    "--electric": appearance.accent_color,
    "--text-primary": appearance.text_color,
  } as React.CSSProperties;

  const flip = () => setSide((current) => current === "front" ? "back" : "front");
  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    if (dragFlippedRef.current) {
      dragFlippedRef.current = false;
      return;
    }
    flip();
  };
  const handleCardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  };
  const handleSwipeEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 72 && Math.abs(info.velocity.x) < 520) return;
    dragFlippedRef.current = true;
    flip();
    window.setTimeout(() => { dragFlippedRef.current = false; }, 180);
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const element = cardRef.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    element.style.setProperty("--rx", `${-y * 3.4}deg`);
    element.style.setProperty("--ry", `${x * 3.8}deg`);
    element.style.setProperty("--lx", `${(x + 0.5) * 100}%`);
    element.style.setProperty("--ly", `${(y + 0.5) * 100}%`);
  };
  const resetTilt = () => {
    cardRef.current?.style.setProperty("--rx", "0deg");
    cardRef.current?.style.setProperty("--ry", "0deg");
    cardRef.current?.style.setProperty("--lx", "50%");
    cardRef.current?.style.setProperty("--ly", "18%");
  };
  const share = async () => {
    const url = `${window.location.origin}/u/${profile.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: `${profile.display_name} — Qard`, url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1500);
    } catch {
      setShared(false);
    }
  };

  const frontTabIndex = side === "front" ? 0 : -1;
  const backTabIndex = side === "back" ? 0 : -1;
  const renderLink = (link: DisplayLink, index: number) => (
    <motion.a
      tabIndex={backTabIndex}
      href={link.url}
      target={link.url.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      key={link.id}
      className={`contact-tile ${link.platform}`}
      data-qard-link-id={analyticsAttributes && !link.id.startsWith("profile-") ? link.id : undefined}
      animate={side === "back" ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.975 }}
      transition={{ ...spring, delay: side === "back" ? 0.16 + index * 0.035 : 0 }}
      whileHover={{ y: -3, scale: 1.012 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="brand-icon"><SocialIcon platform={link.platform} /></span>
      <div>
        <strong>{link.label || platformLabels[link.platform] || "Lien"}</strong>
        <small>{link.username || link.url.replace(/^(mailto:|tel:|https?:\/\/)/, "")}</small>
      </div>
      <ArrowUpRight size={15} />
    </motion.a>
  );

  return (
    <article
      className={`qard-premium card-perspective theme-${appearance.theme} buttons-${appearance.button_style} font-${appearance.font_family}${appearance.animation_enabled ? ` animation-${appearance.animation_style}` : ""}${compact ? " compact" : ""}`}
      style={vars}
    >
      <div className="swipe-orbit swipe-orbit-left" aria-hidden="true"><ChevronLeft size={19} /><i /><i /><i /></div>
      <div className="swipe-orbit swipe-orbit-right" aria-hidden="true"><i /><i /><i /><ChevronRight size={19} /></div>
      <div className="card-breath">
        <motion.div
          className="card-motion-shell"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          onDragEnd={handleSwipeEnd}
          whileDrag={reducedMotion ? undefined : { scale: 0.975, rotateZ: 0.7 }}
          transition={spring}
        >
          <div
            className={`identity-card side-${side}`}
            ref={cardRef}
            role="button"
            tabIndex={0}
            aria-label={side === "front" ? "Retourner la Qard pour afficher les contacts" : "Retourner la Qard pour afficher le profil"}
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
              animate={reducedMotion ? { rotateY: side === "back" ? 180 : 0 } : {
                rotateY: side === "back" ? 180 : 0,
                y: [0, -11, 0],
                scale: [1, 0.955, 1],
                rotateZ: side === "back" ? [0, -0.8, 0] : [0, 0.8, 0],
              }}
              transition={{
                rotateY: flipSpring,
                y: { duration: 0.68, times: [0, 0.46, 1], ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.68, times: [0, 0.46, 1], ease: [0.22, 1, 0.36, 1] },
                rotateZ: { duration: 0.68, times: [0, 0.46, 1] },
              }}
            >
              <div className="card-face card-front" aria-hidden={side !== "front"}>
                <motion.div
                  className={`portrait-panel ${visual ? "has-photo" : "portrait-placeholder"}`}
                  animate={side === "front" ? { opacity: 1, scale: 1.015 } : { opacity: 0.72, scale: 1.065 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                >
                  {visual ? (
                    <Image src={visual} alt={`Portrait de ${profile.display_name}`} fill sizes="(max-width: 640px) 94vw, 420px" />
                  ) : (
                    <div className="monogram" aria-label={`Avatar ${profile.display_name[0]}`}>{profile.display_name.slice(0, 1).toUpperCase()}</div>
                  )}
                  <div className="portrait-scan" aria-hidden="true" />
                </motion.div>
                <span className="front-glint" aria-hidden="true" />
                <span className="identity-stamp">QARD / DIGITAL</span>
                <div className="identity-copy">
                  <div className="name-row">
                    <div><h1>{profile.display_name}</h1><p>@{profile.slug}</p></div>
                    <span className="verified" aria-label="Profil Qard"><Check size={13} /></span>
                  </div>
                  {profile.headline && <p className="headline">{profile.headline}</p>}
                  {profile.bio && <p className="qard-card-bio">{profile.bio}</p>}
                  <div className="identity-meta">
                    {(profile.job_title || profile.company) && <span><BriefcaseBusiness size={14} /> {[profile.job_title, profile.company].filter(Boolean).join(" · ")}</span>}
                    {profile.location && <span><MapPin size={14} /> {profile.location}</span>}
                  </div>
                  <div className="primary-actions">
                    <motion.a tabIndex={frontTabIndex} className="action-primary" href={`/api/vcard/${profile.slug}`} data-qard-contact={analyticsAttributes ? "true" : undefined} whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.965 }}><UserPlus size={17} /> Enregistrer</motion.a>
                    <motion.button tabIndex={frontTabIndex} className="action-secondary" onClick={flip} whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.965 }}>Mes contacts <RotateCcw size={16} /></motion.button>
                  </div>
                </div>
              </div>

              <div className="card-face card-back" aria-hidden={side !== "back"}>
                <div className="back-heading">
                  <div><span>Réseaux & contact</span><h2>Retrouvez-moi<br />en ligne.</h2></div>
                  <button tabIndex={backTabIndex} onClick={flip} aria-label="Retourner la carte"><RotateCcw size={17} /></button>
                </div>
                <div className="contact-groups qard-contact-groups">
                  {networkLinks.length > 0 && <div className="contact-group"><span className="contact-group-label">Réseaux</span><div className="contact-matrix network-matrix">{networkLinks.map(renderLink)}</div></div>}
                  {directLinks.length > 0 && <div className="contact-group"><span className="contact-group-label">Direct</span><div className="contact-matrix direct-matrix">{directLinks.map((link, index) => renderLink(link, networkLinks.length + index))}</div></div>}
                  {networkLinks.length === 0 && directLinks.length === 0 && <p className="qard-empty-contact">Les coordonnées apparaîtront ici.</p>}
                </div>
                <div className="back-actions">
                  <a tabIndex={backTabIndex} href={`/api/vcard/${profile.slug}`} data-qard-contact={analyticsAttributes ? "true" : undefined}><UserPlus size={16} /> Enregistrer</a>
                  <button tabIndex={backTabIndex} onClick={share}>{shared ? <Check size={16} /> : <Share2 size={16} />} {shared ? "Lien copié" : "Partager"}</button>
                </div>
                <div className="back-footer"><span>QARD · {profile.slug}</span><span>Glissez pour revenir</span></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <button className="flip-hint qard-flip-hint" onClick={flip}><RotateCcw size={14} /> {side === "front" ? "Glissez ou touchez pour voir les contacts" : "Glissez ou touchez pour revenir au profil"}</button>
      {profile.show_branding && <a className="qard-branding" href="/">Créé avec <b>Qard</b></a>}
    </article>
  );
}
