import type { Metadata } from 'next';

import { Box } from "@chakra-ui/react";

import { ROLES } from '@/constants';

import Header from "@/app/components/header";

import ProtectedRoute from '../components/auth/protected-route';
import MyBookings from './components/my-bookings';

export const metadata: Metadata = {
  title: 'My Bookings | SkyFox Cinema',
  description: 'View your ticket history, upcoming movies, and manage your bookings at SkyFox Cinema.',
};

export default function MyBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
      <Box minH="100vh" bg="background.primary">
        <Header />
        <MyBookings />
      </Box>
    </ProtectedRoute>
  );
}
