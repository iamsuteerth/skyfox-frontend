import React from 'react';
import { VStack, Box, Text, Heading, Flex, Icon, Button } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Show } from '@/services/shows-service';
import { formatTimestampToOrdinalDate } from '@/utils/date-utils';

interface BookingSuccessStepProps {
  show: Show;
  selectedSeats: string[];
  numberOfSeats: number;
  bookingId: string;
  customerName: string;
  totalPrice: number;
  onDownloadTicket: () => void;
}

export const BookingSuccessStep: React.FC<BookingSuccessStepProps> = ({
  show,
  selectedSeats,
  bookingId,
  customerName,
  totalPrice, 
  onDownloadTicket
}) => {
  return (
    <VStack spacing={6} align="center" py={4}>
      <Flex
        w="80px"
        h="80px"
        borderRadius="full"
        bg="success"
        color="white"
        align="center"
        justify="center"
      >
        <Icon as={CheckCircleIcon} boxSize={10} />
      </Flex>
      
      <Heading size="lg" color="text.primary">Booking Successful!</Heading>
      
      <Text fontWeight="medium" textAlign="center" color="text.secondary">
        The booking has been made for {customerName}.
      </Text>
      
      <Box p={4} bg="background.secondary" borderRadius="md" width="100%">
        <Text fontWeight="bold" color="text.primary">Booking ID: {bookingId}</Text>
        <Text color="text.secondary">Movie: {show.movie.name}</Text>
        <Text color="text.secondary">Show: {show.slot.name} at {show.slot.startTime.substring(0, 5)}</Text>
        <Text color="text.secondary">Date: {formatTimestampToOrdinalDate(show.date)}</Text>
        <Text color="text.secondary">Seats: {selectedSeats.join(', ')}</Text>
        <Text fontWeight="bold" mt={2} color="brand.500">
          Total: {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
          }).format(totalPrice)}
        </Text>
      </Box>
      
      <Button 
        variant="solid" 
        onClick={onDownloadTicket}
        leftIcon={<i className="fas fa-download" />}
        bg="brand.500"
        color="white"
        _hover={{ bg: "brand.600" }}
      >
        Download Ticket
      </Button>
    </VStack>
  );
};

export default BookingSuccessStep;
