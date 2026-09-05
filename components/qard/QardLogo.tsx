import Link from 'next/link';
import { cn } from '@/lib/utils';

export function QardLogo({ className, linked = true }: { className?: string; linked?: boolean }) {
  const wordmark = <span className={cn('qard-logo', className)}>Qard<span>.</span></span>;
  return linked ? <Link href="/" aria-label="Qard, accueil">{wordmark}</Link> : wordmark;
}
