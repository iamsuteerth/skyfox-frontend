import Login from "./components/login";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | SkyFox Cinema',
  description: 'Sign in to your SkyFox Cinema account',
};

export default function LoginPage() {
  return <Login />
}