import type { Metadata } from 'next';
import { Box } from "@chakra-ui/react";
import Header from "@/app/components/header";
import Dashboard from './components/dashboard';
import { ROLES } from '@/constants';
import ProtectedRoute from '../components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Admin Dashboard | SkyFox Cinema',
  description: 'Monitor revenue, view performance metrics, and download reports for SkyFox Cinema operations.',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <Box minH="100vh" bg="background.primary">
        <Header />
        <Dashboard />
      </Box>
    </ProtectedRoute>
  );
}
