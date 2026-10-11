import { PrismaHero } from '@/components/ui/prisma-hero';
import { LandingSections } from '@/components/qard/LandingSections';

export default function Home() {
  return (
    <main>
      <PrismaHero />
      <LandingSections />
    </main>
  );
}
