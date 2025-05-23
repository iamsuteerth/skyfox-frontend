import type { Metadata } from 'next';
import Login from "./components/login";

export const metadata: Metadata = {
  title: 'Login | SkyFox Cinema',
  description: 'Sign in to your SkyFox Cinema account',
};

export default function LoginPage() {
  return <Login />
}