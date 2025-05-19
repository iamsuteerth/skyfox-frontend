import type { Metadata } from 'next';

import { Box } from "@chakra-ui/react";

import { ROLES } from '@/constants';

import Header from "@/app/components/header";

import ProtectedRoute from '../components/auth/protected-route';
import MyWallet from './components/my-wallet';

export const metadata: Metadata = {
  title: 'My Wallet | SkyFox Cinema',
  description: 'View your wallet balance, add money to your wallet and view your transactions!',
};

export default function MyBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
      <Box minH="100vh" bg="background.primary">
        <Header />
        <MyWallet />
      </Box>
    </ProtectedRoute>
  );
}
