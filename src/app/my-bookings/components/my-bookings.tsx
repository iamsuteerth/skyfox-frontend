'use client';

import { useState, useEffect } from "react";

import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Spinner,
  Center,
  useDisclosure,
  VStack,
  Text
} from "@chakra-ui/react";

import { useCustomToast } from '@/app/components/ui/custom-toast';

import { Booking, getCustomerBookings } from '@/services/booking-service';
import { downloadTicket } from "@/services/ticket-service";
import { getBookingDerivedStatus } from '@/utils/booking-utils';

import BookingCard from './booking-card';
import BookingDetailsModal from './booking-details-modal';
import QRModal from './booking-qr-modal';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const detailsModal = useDisclosure();
  const qrModal = useDisclosure();
  const { showToast } = useCustomToast();

  useEffect(() => {
    setLoading(true);
    getCustomerBookings()
      .then(setBookings)
      .catch(err => showToast({ type: "error", title: "Failed", description: err.message }))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    detailsModal.onOpen();
  };
  const handleQR = (booking: Booking) => {
    setSelectedBooking(booking);
    qrModal.onOpen();
  };
  const handleDownloadTicket = (booking: Booking) => {
    downloadTicket(booking.booking_id, showToast);
  };

  const filterBookings = (tab: "ALL" | "UPCOMING" | "COMPLETED") =>
    tab === "ALL"
      ? bookings
      : bookings.filter(b => getBookingDerivedStatus(b) === tab);

  const renderBookingGrid = (tab: "ALL" | "UPCOMING" | "COMPLETED") => {
    const filtered = filterBookings(tab);
    if (filtered.length === 0)
      return (
        <VStack w="100%" py={12}>
          <Text color="text.secondary" fontSize="lg">
            {tab === "UPCOMING"
              ? "No upcoming bookings."
              : tab === "COMPLETED"
                ? "No completed bookings."
                : "No bookings yet."}
          </Text>
        </VStack>
      );
    return (
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={6}
        w="100%"
      >
        {filtered.map((booking) => (
          <BookingCard
            key={booking.booking_id}
            booking={booking}
            onDetails={() => handleDetails(booking)}
            onShowQR={() => handleQR(booking)}
            onDownload={() => handleDownloadTicket(booking)}
          />
        ))}
      </SimpleGrid>
    );
  };

  if (loading) {
    return (
      <Center h="300px">
        <Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="xl" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="background.primary" px={{ base: 2, md: 6 }} py={10}>
      <Heading as="h1" size="xl" color="text.primary" mb={8}>
        My Bookings
      </Heading>
      <Tabs colorScheme="primary" isFitted variant="unstyled">
        <TabList>
          <Tab
            fontWeight="semibold"
            color="text.secondary"
            _selected={{
              color: "primary",
              borderBottom: "2px solid",
              bg: "transparent",
              fontWeight: "semibold",
            }}
            _focus={{ boxShadow: "none" }}
            bg="transparent">
            All Bookings
          </Tab>
          <Tab
            fontWeight="semibold"
            color="text.secondary"
            _selected={{
              color: "primary",
              borderBottom: "2px solid",
              bg: "transparent",
              fontWeight: "semibold",
            }}
            _focus={{ boxShadow: "none" }}
            bg="transparent"
          >
            Upcoming
          </Tab>
          <Tab
            fontWeight="semibold"
            color="text.secondary"
            _selected={{
              color: "primary",
              borderBottom: "2px solid",
              bg: "transparent",
              fontWeight: "semibold",
            }}
            _focus={{ boxShadow: "none" }}
            bg="transparent"
          >
            Completed
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0} py={6}>{renderBookingGrid("ALL")}</TabPanel>
          <TabPanel px={0} py={6}>{renderBookingGrid("UPCOMING")}</TabPanel>
          <TabPanel px={0} py={6}>{renderBookingGrid("COMPLETED")}</TabPanel>
        </TabPanels>
      </Tabs>
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.onClose}
        showToast={showToast}
      />
      <QRModal
        booking={selectedBooking}
        isOpen={qrModal.isOpen}
        onClose={qrModal.onClose}
        showToast={showToast}
      />
    </Box>
  );
}
