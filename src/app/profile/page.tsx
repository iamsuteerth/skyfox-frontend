import type { Metadata } from 'next';
import { Box } from "@chakra-ui/react";
import ProtectedRoute from "@/app/components/auth/protected-route";
import Header from "@/app/components/header";
import Profile from './components/profile';

export const metadata: Metadata = {
  title: 'View Profile | SkyFox Cinema',
  description: 'Manage your SkyFox Cinema account settings, update your profile information, and change your password securely.',
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Box minH="100vh" bg="background.primary">
        <Header />
        <Profile />
      </Box>
    </ProtectedRoute>
  );
}
