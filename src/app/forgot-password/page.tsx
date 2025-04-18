import type { Metadata } from 'next';
import ForgotPassword from "./components/forgot-password";

export const metadata: Metadata = {
  title: 'Forgot Password | SkyFox Cinema',
  description: 'Reset your SkyFox Cinema account password',
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />
}
