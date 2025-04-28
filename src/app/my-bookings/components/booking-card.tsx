'use client';

import {
  Card,
  CardBody,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Badge,
  Button
} from '@chakra-ui/react';

import { DownloadIcon, ViewIcon } from "lucide-react";

import { Booking } from '@/services/booking-service';
import { formatTimestampToOrdinalDate, formatTimeForDisplay } from '@/utils/date-utils';
import { getBookingDerivedStatus } from '@/utils/booking-utils';

interface Props {
  booking: Booking;
  onDetails: () => void;
  onDownload: () => void;
  onShowQR: () => void;
}
export default function BookingCard({ booking, onDetails, onDownload, onShowQR }: Props) {
  const status = getBookingDerivedStatus(booking);

  return (
    <Card
      bg="background.secondary"
      borderRadius="lg"
      boxShadow="md"
      _hover={{ boxShadow: "lg" }}
      w="100%"
      minW={0}
      p={0}
      transition="box-shadow 0.16s"
    >
      <CardBody p={6}>
        <Flex justify="space-between" align="center" mb={3}>
          <Heading size="md" color="text.primary" noOfLines={1}>
            Booking #{booking.booking_id}
          </Heading>
          <Badge
            px={3}
            py={1}
            fontWeight="semibold"
            borderRadius="md"
            fontSize="sm"
            variant={status === 'UPCOMING' ? 'subtle' : 'solid'}
            bg={status === 'UPCOMING' ? 'secondary' : 'success'}
            color="white"
          >
            {status}
          </Badge>
        </Flex>
        <VStack align="start" spacing={2} mb={4}>
          <Text variant="primary" fontWeight="medium">
            <b>Date & Time:</b> {formatTimestampToOrdinalDate(booking.show_date)} - {formatTimeForDisplay(booking.show_time)}
          </Text>
          <Text variant="secondary">
            <b>Seats:</b> {booking.seat_numbers.join(', ')}
          </Text>
          <Text variant="secondary">
            <b>Amount:</b> ₹{booking.amount_paid.toFixed(2)}
          </Text>
        </VStack>
        <HStack spacing={3}>
          <Button
            size="sm"
            colorScheme="primary"
            variant="solid"
            leftIcon={<ViewIcon size={16} />}
            onClick={onDetails}
          >Details</Button>
          <Button
            size="sm"
            colorScheme="info"
            variant="outline"
            onClick={onShowQR}
          >Show QR</Button>
          <Button
            size="sm"
            colorScheme="success"
            leftIcon={<DownloadIcon size={16} />}
            variant="outline"
            onClick={onDownload}
          >Ticket</Button>
        </HStack>
      </CardBody>
    </Card>
  );
}
