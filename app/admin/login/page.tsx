import { AuthForm } from '@/components/auth/AuthForm';

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <AuthForm type="admin" />
    </div>
  );
}
