import { Mail, Phone, Link as LinkIcon } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import {
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiReddit,
  SiSnapchat,
  SiSpotify,
  SiTelegram,
  SiTiktok,
  SiTwitch,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from 'react-icons/si';

const icons = {
  instagram: SiInstagram,
  snapchat: SiSnapchat,
  tiktok: SiTiktok,
  discord: SiDiscord,
  github: SiGithub,
  youtube: SiYoutube,
  x: SiX,
  facebook: SiFacebook,
  twitch: SiTwitch,
  reddit: SiReddit,
  telegram: SiTelegram,
  whatsapp: SiWhatsapp,
  spotify: SiSpotify,
};
export function SocialIcon({
  platform,
  size = 18,
}: {
  platform: string;
  size?: number;
}) {
  const Icon = icons[platform as keyof typeof icons];
  if (Icon) return <Icon size={size} />;
  if (platform === 'linkedin') return <FaLinkedin size={size} />;
  if (platform === 'email') return <Mail size={size} />;
  if (platform === 'phone') return <Phone size={size} />;
  return <LinkIcon size={size} />;
}
