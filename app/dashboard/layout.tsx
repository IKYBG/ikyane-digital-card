import { DashboardNav } from '@/components/dashboard/DashboardNav';
import AnimatedGradient from '@/components/ui/animated-gradient';
import { getCurrentQard } from '@/lib/qard/data';
export const dynamic = 'force-dynamic';
export default async function DashboardLayout({ children }: { children: React.ReactNode }) { const { profile } = await getCurrentQard(); return <main className="qard-site dashboard-shell"><AnimatedGradient className="dashboard-animated-bg" config={{ color1: '#080a0e', color2: '#101d30', color3: '#294d78', speed: 36, distortion: 2, swirl: 10, swirlIterations: 2, softness: 95, shape: 'Edge', shapeSize: 68 }} style={{ position: 'fixed', zIndex: 0 }} /><div className="dashboard-background-shade" aria-hidden="true" /><DashboardNav slug={profile.slug} plan={profile.plan} /><section className="dashboard-main">{children}</section></main>; }
