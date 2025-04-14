import { Suspense } from "react";
import Shows from "./components/shows";
import type { Metadata } from 'next';
import { Box, Center, Spinner } from "@chakra-ui/react";
import ProtectedRoute from "../components/auth/protected-route";
import Header from "../components/header";

export const metadata: Metadata = {
  title: 'Movie Shows | SkyFox Cinema',
  description: 'Browse and book the latest movie shows at SkyFox Cinema',
};

export default function ShowsPage() {
  return (
    <ProtectedRoute>
      <Box minH="100vh" bg="background.primary">
        <Header />
        <Suspense fallback={
          <Center py={10}>
            <Spinner size="xl" color="primary" thickness="4px" speed="0.65s" />
          </Center>
        }>
          <Shows />
        </Suspense>
      </Box>
    </ProtectedRoute>
  );
}
