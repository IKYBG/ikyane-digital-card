import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type LiquidGlassProps = HTMLAttributes<HTMLDivElement>;

/**
 * Lightweight liquid-glass surface. The optical treatment lives in globals.css
 * so the same GPU-friendly material can also be applied to native controls.
 */
export function LiquidGlass({ className, ...props }: LiquidGlassProps) {
  return <div className={cn('liquid-glass', className)} {...props} />;
}
