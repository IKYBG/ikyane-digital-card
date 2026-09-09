import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
export const metadata = { title: 'Mot de passe oublié' };
export default function ForgotPage() {
  return (
    <Suspense>
      <AuthForm mode="forgot" />
    </Suspense>
  );
}
