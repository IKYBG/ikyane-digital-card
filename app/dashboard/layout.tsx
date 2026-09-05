import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { getCurrentQard } from '@/lib/qard/data';
export const dynamic = 'force-dynamic';
export default async function DashboardLayout({ children }: { children: React.ReactNode }) { const { profile } = await getCurrentQard(); return <main className="qard-site dashboard-shell"><DashboardNav slug={profile.slug} plan={profile.plan} /><section className="dashboard-main">{children}</section></main>; }
