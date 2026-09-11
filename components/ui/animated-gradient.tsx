import type { CSSProperties } from 'react';
import styles from './animated-gradient.module.css';

type PatternShape = 'Checks' | 'Stripes' | 'Edge';

type AnimatedGradientConfig = {
  color1: string;
  color2: string;
  color3: string;
  rotation?: number;
  proportion?: number;
  scale?: number;
  speed?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  offset?: number;
  shape?: PatternShape;
  shapeSize?: number;
};

type AnimatedGradientProps = {
  config?: AnimatedGradientConfig;
  noise?: { opacity: number; scale?: number };
  radius?: string;
  style?: CSSProperties;
  className?: string;
};

export default function AnimatedGradient({
  config = { color1: '#01030a', color2: '#072b59', color3: '#0b6eaa' },
  noise,
  radius = '0px',
  style,
  className = '',
}: AnimatedGradientProps) {
  const vars = {
    '--gradient-color-1': config.color1,
    '--gradient-color-2': config.color2,
    '--gradient-color-3': config.color3,
    '--gradient-noise-opacity': noise?.opacity ?? 0,
    '--gradient-noise-size': `${(noise?.scale ?? 1) * 180}px`,
    borderRadius: radius,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`${styles.gradient} ${className}`.trim()}
      aria-hidden="true"
      style={vars}
    >
      <i className={styles.lightA} />
      <i className={styles.lightB} />
      {noise && noise.opacity > 0 ? <i className={styles.noise} /> : null}
    </div>
  );
}
