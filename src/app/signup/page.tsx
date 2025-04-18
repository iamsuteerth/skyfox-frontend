import type { Metadata } from 'next';
import Signup from "./components/signup";

export const metadata: Metadata = {
  title: 'Signup | SkyFox Cinema',
  description: 'Create your account today!',
};

export default function ForgotPasswordPage() {
  return <Signup />
}
