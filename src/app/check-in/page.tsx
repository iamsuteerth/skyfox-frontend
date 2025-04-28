import type { Metadata } from 'next';
import { Box } from "@chakra-ui/react";
import Header from "@/app/components/header";
import CheckIn from './components/check-in';
import ProtectedRoute from '../components/auth/protected-route';
import { ROLES } from '@/constants';

export const metadata: Metadata = {
    title: 'Ticket Check-In | SkyFox Cinema',
    description: 'Verify tickets, scan QR codes, and manage customer check-ins at SkyFox Cinema.',
  };

export default function CheckiInPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
      <Box minH="100vh" bg="background.primary">
        <Header />
        <CheckIn />
      </Box>
    </ProtectedRoute>
  );
}
