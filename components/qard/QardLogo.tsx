import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function QardLogo({
  className,
  linked = true,
}: {
  className?: string;
  linked?: boolean;
}) {
  const wordmark = (
    <span className={cn('qard-logo', className)}>
      <Image src="/qard-logo.png" width={42} height={42} alt="" priority />
      <span>Qard</span>
    </span>
  );
  return linked ? (
    <Link href="/" aria-label="Qard, accueil">
      {wordmark}
    </Link>
  ) : (
    wordmark
  );
}
