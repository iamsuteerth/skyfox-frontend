import React from "react";
import { VStack, Heading, Text, Button, Flex, Icon, Box } from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { Show } from "@/services/shows-service";
import { formatTimestampToOrdinalDate } from "@/utils/date-utils";

interface BookingFinalStepProps {
  show: Show;
  selectedSeats: string[];
  bookingId: number;
  bookingStatus: "SUCCESS" | "TIMEOUT" | "FAILED";
  totalPrice: number;
  onDownloadTicket?: () => void;
  isAdmin?: boolean;
  customerName?: string;
}

export const BookingFinalStep: React.FC<BookingFinalStepProps> = ({
  show,
  selectedSeats,
  bookingId,
  bookingStatus,
  totalPrice,
  onDownloadTicket,
  isAdmin = false,
  customerName,
}) => (
  <VStack spacing={6} align="center" py={4}>
    <Flex w="80px" h="80px" borderRadius="full"
      bg={bookingStatus === "SUCCESS" ? "success" : "error"}
      color="white" align="center" justify="center"
    >
      <Icon as={bookingStatus === "SUCCESS" ? CheckCircleIcon : CloseIcon} boxSize={10} />
    </Flex>

    <Heading size="lg" color="text.primary">
      {bookingStatus === "SUCCESS"
        ? isAdmin ? "Booking Successful!" : "Payment Successful!"
        : bookingStatus === "TIMEOUT"
          ? "Payment Timed Out"
          : "Payment Failed"}
    </Heading>
    <Text fontWeight="medium" textAlign="center" color="text.secondary">
      {bookingStatus === "SUCCESS"
        ? isAdmin
          ? `The booking has been made for ${customerName ?? 'customer'}.`
          : "Your booking has been confirmed."
        : bookingStatus === "TIMEOUT"
          ? "You ran out of time to complete the payment."
          : "There was an issue processing your payment."}
    </Text>

    {bookingStatus === "SUCCESS" && (
      <Box p={4} bg="background.secondary" borderRadius="md" width="100%">
        <Text fontWeight="bold" color="text.primary">Booking ID: {bookingId}</Text>
        <Text color="text.secondary">Movie: {show.movie.name}</Text>
        <Text color="text.secondary">
          Show: {show.slot.name} at {show.slot.startTime.substring(0, 5)}
        </Text>
        <Text color="text.secondary">Date: {formatTimestampToOrdinalDate(show.date)}</Text>
        <Text color="text.secondary">Seats: {selectedSeats.join(", ")}</Text>
        <Text fontWeight="bold" mt={2} color="brand.500">
          Total: {new Intl.NumberFormat("en-IN", {
            style: "currency", currency: "INR",
          }).format(totalPrice)}
        </Text>
      </Box>
    )}

    {bookingStatus === "SUCCESS" && onDownloadTicket && (
      <Button
        variant="solid"
        onClick={onDownloadTicket}
        bg="brand.500"
        color="white"
        _hover={{ bg: "brand.600" }}
      >
        Download Ticket
      </Button>
    )}
  </VStack>
);

export default BookingFinalStep;
