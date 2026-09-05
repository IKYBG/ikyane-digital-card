/* oxlint-disable next/no-html-link-for-pages -- the vCard endpoint is a file download, not page navigation */
import Image from "next/image";
import { ArrowUpRight, MapPin, UserPlus } from "lucide-react";
import type { QardData } from "@/types/database";
import { SocialIcon } from "./SocialIcon";
import { platformLabels } from "@/lib/qard/social";

export function QardPreview({
  data,
  compact = false,
  analyticsAttributes = false,
}: {
  data: QardData;
  compact?: boolean;
  analyticsAttributes?: boolean;
}) {
  const { profile, links, appearance } = data;
  const background = appearance.background_type === "image"
    ? `linear-gradient(rgb(5 10 18 / .42), rgb(5 10 18 / .72)), url(${JSON.stringify(appearance.background_value)}) center / cover`
    : appearance.background_value;
  const vars = {
    "--preview-accent": appearance.accent_color,
    "--preview-text": appearance.text_color,
    "--preview-radius": `${appearance.card_radius}px`,
    "--preview-opacity": appearance.card_opacity,
    "--preview-blur": `${appearance.card_blur}px`,
    "--preview-bg": background,
  } as React.CSSProperties;
  return (
    <article
      className={`qard-preview theme-${appearance.theme} buttons-${appearance.button_style} avatar-${appearance.avatar_shape} font-${appearance.font_family}${appearance.animation_enabled ? ` animation-${appearance.animation_style}` : ""}${compact ? " compact" : ""}`}
      style={vars}
    >
      {appearance.show_banner && profile.banner_url && (
        <div className="qard-banner">
          <Image src={profile.banner_url} fill alt="" sizes="420px" />
        </div>
      )}
      <div className="qard-profile-head">
        {profile.avatar_url ? (
          <Image
            className="qard-avatar"
            src={profile.avatar_url}
            width={104}
            height={104}
            alt={`Portrait de ${profile.display_name}`}
          />
        ) : (
          <div className="qard-avatar fallback">
            {profile.display_name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <h1>{profile.display_name}</h1>
        {profile.headline && <p>{profile.headline}</p>}
        {(profile.job_title || profile.company) && (
          <span>
            {[profile.job_title, profile.company].filter(Boolean).join(" · ")}
          </span>
        )}
        {profile.location && (
          <small>
            <MapPin size={13} /> {profile.location}
          </small>
        )}
      </div>
      {profile.bio && <p className="qard-bio">{profile.bio}</p>}
      <div className="qard-links">
        {links
          .filter((link) => link.enabled)
          .map((link) => (
            <a
              href={link.url}
              key={link.id}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              data-qard-link-id={analyticsAttributes ? link.id : undefined}
            >
              <span>
                <SocialIcon platform={link.platform} />
              </span>
              <strong>
                {link.label || platformLabels[link.platform] || "Lien"}
              </strong>
              <ArrowUpRight size={16} />
            </a>
          ))}
      </div>
      <a
        className="qard-contact-button"
        href={`/api/vcard/${profile.slug}`}
        data-qard-contact={analyticsAttributes ? "true" : undefined}
      >
        <UserPlus size={18} /> Ajouter aux contacts
      </a>
      {profile.show_branding && (
        <a className="qard-branding" href="/">
          Créé avec <b>Qard</b>
        </a>
      )}
    </article>
  );
}
