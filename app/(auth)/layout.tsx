import Link from 'next/link';
import { QardLogo } from '@/components/qard/QardLogo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="qard-site auth-shell"><header><QardLogo /><Link href="/">Retour à l’accueil</Link></header><section>{children}<aside><div className="auth-visual-card"><span>Q/001</span><strong>Une rencontre<br />commence ici.</strong><i>Scanne. Découvre. Contacte.</i></div></aside></section></main>;
}
