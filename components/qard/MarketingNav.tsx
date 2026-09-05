import Link from 'next/link';
import { QardLogo } from './QardLogo';

export function MarketingNav() {
  return <header className="marketing-nav"><QardLogo /><nav aria-label="Navigation principale"><Link href="/pricing">Tarifs</Link><Link href="/login">Se connecter</Link><Link className="button button-small" href="/signup">Créer ma Qard</Link></nav></header>;
}
