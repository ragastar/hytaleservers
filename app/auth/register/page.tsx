import { AuthForm } from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <AuthForm type="register" />
    </div>
  );
}
