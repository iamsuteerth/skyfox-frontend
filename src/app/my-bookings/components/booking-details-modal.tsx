'use client';

import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Box, 
  Text, 
  Spinner, 
  Badge, 
  Image, 
  HStack, 
  Card, 
  CardBody,
  Center
} from "@chakra-ui/react";

import { Booking } from '@/services/booking-service';
import { fetchShowById, Show } from "@/services/shows-service";
import { formatTimestampToOrdinalDate, formatTimeForDisplay, formatDuration } from '@/utils/date-utils';
import { getBookingDerivedStatus } from '@/utils/booking-utils';
import type { CustomToastOptions } from '@/app/components/ui/custom-toast';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  showToast?: (args: CustomToastOptions) => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose, showToast }: Props) {
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && booking) {
      setLoading(true);
      fetchShowById(booking.show_id, showToast)
        .then((res) => {
          if (res.success) {
            setShow(res.data!);
            setApiError(null);
          } else {
            setShow(null);
            setApiError(res.error || 'Show not found');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setShow(null);
      setApiError(null);
    }
  }, [booking, isOpen, showToast]);

  if (!booking) return null;

  const status = getBookingDerivedStatus(booking);
  const statusColor = status === 'UPCOMING' ? 'secondary' : 'success';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent bg="background.primary" borderRadius="xl" boxShadow="xl">
        <ModalHeader color="text.primary" fontWeight="bold">Booking Details</ModalHeader>
        <ModalCloseButton color="text.primary" />
        <ModalBody px={{ base: 2, md: 6 }} paddingBottom={6}>
          {loading ? (
            <Center py={8}><Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="lg" /></Center>
          ) : apiError ? (
            <Box py={6}><Text color="error" textAlign="center">{apiError}</Text></Box>
          ) : show ? (
            <Card bg="background.secondary" borderRadius="lg">
              <CardBody px={{ base: 2, md: 6 }}>
                <HStack spacing={5} align="flex-start" mb={4}>
                  <Image
                    src={show.movie.moviePoster}
                    alt={show.movie.name}
                    boxSize={{ base: "70px", md: "110px" }}
                    borderRadius="md"
                    objectFit="cover"
                    bg="background.primary"
                  />
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight="bold" color="text.primary" fontSize="xl">{show.movie.name}</Text>
                    <HStack>
                      <Badge variant="solid" bg="brand.500" color="white" fontSize="sm" px={2}>
                        {show.slot.name}
                      </Badge>
                      <Badge bg={statusColor} color="white" fontSize="sm" px={2}>
                        {status}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
                <VStack align="start" spacing={2} mb={4}>
                  <Text variant="secondary"><b>Date:</b> {formatTimestampToOrdinalDate(booking.show_date)}</Text>
                  <Text variant="secondary"><b>Time:</b> {formatTimeForDisplay(booking.show_time)}</Text>
                  <Text variant="secondary"><b>Seats:</b> {booking.seat_numbers.join(', ')}</Text>
                  <Text variant="secondary"><b>Amount Paid:</b> ₹{booking.amount_paid.toFixed(2)}</Text>
                  <Text variant="secondary"><b>Booking ID:</b> {booking.booking_id}</Text>
                  <Text variant="secondary"><b>Screen:</b> {show.slot.name}</Text>
                  <Text variant="secondary"><b>Genre:</b> {show.movie.genre}</Text>
                  <Text variant="secondary"><b>IMDB:</b> {show.movie.imdbRating}</Text>
                  <Text variant="tertiary" fontSize="sm">{show.movie.plot}</Text>
                  <Text variant="quaternary" fontSize="sm">
                    Duration: {formatDuration(show.movie.duration)}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
