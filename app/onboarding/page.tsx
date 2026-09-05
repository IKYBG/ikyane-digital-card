import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { getCurrentQard } from '@/lib/qard/data';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic'; export const metadata = { title: 'Créer ma Qard' };
export default async function OnboardingPage() { const { profile } = await getCurrentQard(); if (profile.onboarding_completed) redirect('/dashboard'); return <main className="qard-site onboarding-shell"><OnboardingFlow profile={profile} /></main>; }
