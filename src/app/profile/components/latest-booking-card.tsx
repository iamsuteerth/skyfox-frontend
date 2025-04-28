'use client';

import React, { useState, useEffect } from 'react';

import {
  Card,
  CardBody,
  Flex,
  Heading,
  VStack,
  Skeleton,
  Text,
  Divider,
  Box,
  useDisclosure
} from '@chakra-ui/react';

import { useCustomToast } from '@/app/components/ui/custom-toast';

import { getLatestCustomerBooking, Booking } from '@/services/booking-service';
import { downloadTicket } from '@/services/ticket-service';

import BookingCard from '@/app/my-bookings/components/booking-card';
import BookingDetailsModal from '@/app/my-bookings/components/booking-details-modal';
import QRModal from '@/app/my-bookings/components/booking-qr-modal';

export default function LatestBookingCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const detailsModal = useDisclosure();
  const qrModal = useDisclosure();
  const { showToast } = useCustomToast();

  useEffect(() => {
    let mounted = true;
    getLatestCustomerBooking()
      .then(data => { if (mounted) setBooking(data); })
      .catch(() => { if (mounted) setBooking(null); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; }
  }, []);

  const handleDetails = (b: Booking) => {
    setSelectedBooking(b);
    detailsModal.onOpen();
  };
  const handleShowQR = (b: Booking) => {
    setSelectedBooking(b);
    qrModal.onOpen();
  };
  const handleDownloadTicket = (booking: Booking) => {
    downloadTicket(booking.booking_id, showToast);
  };

  return (
    <>
      <Card bg="background.primary" borderColor="surface.light" borderWidth="1px" >
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" align="center">
              <Heading size="md" color="text.primary">Latest Booking</Heading>
            </Flex>
            <Divider borderColor="surface.light" />

            <Skeleton isLoaded={!isLoading} borderRadius="lg">
              {booking ? (
                <Box mx="auto" w="100%">
                  <BookingCard
                    booking={booking}
                    onDetails={() => handleDetails(booking)}
                    onShowQR={() => handleShowQR(booking)}
                    onDownload={() => handleDownloadTicket(booking)}
                  />
                </Box>
              ) : (
                <Box
                  p={6}
                  textAlign="center"
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor="surface.light"
                  borderRadius="md"
                  bg="background.secondary"
                >
                  <Text color="text.tertiary" fontSize="md">
                    You have no bookings yet.
                  </Text>
                </Box>
              )}
            </Skeleton>
          </VStack>
        </CardBody>
      </Card>

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
    </>
  );
}
