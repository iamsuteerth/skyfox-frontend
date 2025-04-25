'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  Center,
  Spinner,
  CircularProgress,
  CircularProgressLabel,
  Icon,
} from '@chakra-ui/react';
import { useDialog } from '@/contexts/dialog-context';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { Show } from '@/services/shows-service';
import FormInput from '@/app/components/form-input';
import { MovieInfoStep } from '../shared/movie-info-step';
import { SeatSelectionStep } from '../shared/seat-selection-step';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { formatTimestampToOrdinalDate } from '@/utils/date-utils';

enum BookingStep {
  MOVIE_INFO = 0,
  SEAT_SELECTION = 1,
  PAYMENT = 2,
  CONFIRMATION = 3
}

enum BookingStatus {
  PENDING,
  SUCCESS,
  FAILED,
  TIMEOUT
}

export default function CustomerBookingDialog() {
  const { closeDialog, dialogData } = useDialog();
  const show = dialogData?.show as Show;
  const { showToast } = useCustomToast();

  // Steps state
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.MOVIE_INFO);
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [seatsError, setSeatsError] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(BookingStatus.PENDING);
  const [timeLeft, setTimeLeft] = useState(295); // 4:55 in seconds
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep === BookingStep.PAYMENT && timeLeft > 0 && !paymentInitiated) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handlePaymentTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, timeLeft, paymentInitiated]);

  if (!show) return null;

  const validateNumberOfSeats = (value: number): boolean => {
    if (!value || value <= 0) {
      setSeatsError('Please enter a valid number');
      return false;
    }

    if (value > 10) {
      setSeatsError(`Maximum 10 seats allowed per booking`);
      return false;
    }

    if (value > show.availableseats) {
      setSeatsError(`Only ${show.availableseats} seats available`);
      return false;
    }

    setSeatsError('');
    return true;
  };

  const handleNumberOfSeatsChange = (value: number) => {
    setNumberOfSeats(value);

    // Validate immediately for certain conditions
    if (value > 10 || value < 0) {
      validateNumberOfSeats(value);
    } else {
      setSeatsError('');
    }

    // Reset selected seats if number changes
    if (selectedSeats.length > 0) {
      setSelectedSeats([]);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStep === BookingStep.MOVIE_INFO) {
      if (validateNumberOfSeats(numberOfSeats)) {
        setCurrentStep(BookingStep.SEAT_SELECTION);
      } else {
        showToast({
          type: 'error',
          title: 'Invalid number of seats',
          description: seatsError
        });
      }
    } else if (currentStep === BookingStep.SEAT_SELECTION) {
      if (selectedSeats.length === numberOfSeats) {
        initializeBooking();
      } else {
        showToast({
          type: 'error',
          title: 'Seat selection incomplete',
          description: `Please select ${numberOfSeats} ${numberOfSeats === 1 ? 'seat' : 'seats'}`
        });
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0 && currentStep !== BookingStep.PAYMENT) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSeatSelect = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const initializeBooking = async () => {
    setIsLoading(true);
    try {
      // This will be implemented in the service layer
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookingId("CUST12345");
      setCurrentStep(BookingStep.PAYMENT);
    } catch (error) {
      console.error("Booking initialization failed", error);
      showToast({
        type: 'error',
        title: 'Booking initialization failed',
        description: 'There was an error initializing your booking'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentInitiated(true);
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBookingStatus(BookingStatus.SUCCESS);
      setCurrentStep(BookingStep.CONFIRMATION);
    } catch (error) {
      console.error("Payment failed", error);
      setBookingStatus(BookingStatus.FAILED);
      setCurrentStep(BookingStep.CONFIRMATION);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentCancel = async () => {
    setIsLoading(true);
    try {
      // Call cancel endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingStatus(BookingStatus.FAILED);
      setCurrentStep(BookingStep.CONFIRMATION);
    } catch (error) {
      console.error("Cancel failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentTimeout = async () => {
    setIsLoading(true);
    try {
      // Call cancel endpoint due to timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingStatus(BookingStatus.TIMEOUT);
      setCurrentStep(BookingStep.CONFIRMATION);
    } catch (error) {
      console.error("Timeout handling failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTicket = () => {
    // Will implement this later
    console.log("Downloading ticket for booking:", bookingId);
  };

  // Step indicator component
  const StepIndicator = () => (
    <Flex justify="center" mb={4}>
      {[0, 1, 2, 3].map((step) => (
        <Flex key={step} align="center">
          <Box
            w="10px"
            h="10px"
            borderRadius="full"
            bg={currentStep >= step ? "brand.500" : "gray.300"}
          />
          {step < 3 && (
            <Box
              w="20px"
              h="1px"
              bg={currentStep > step ? "brand.500" : "gray.300"}
            />
          )}
        </Flex>
      ))}
    </Flex>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.MOVIE_INFO:
        return (
          <MovieInfoStep
            show={show}
            numberOfSeats={numberOfSeats}
            onNumberOfSeatsChange={handleNumberOfSeatsChange}
            maxSeats={Math.min(10, show.availableseats)}
            seatsError={seatsError}
          />
        );

      case BookingStep.SEAT_SELECTION:
        return (
          <SeatSelectionStep
            showId={show.id}
            numberOfSeats={numberOfSeats}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
        );

      case BookingStep.PAYMENT:
        return (
          <VStack spacing={6} align="stretch">
            <Center>
              <CircularProgress
                value={(timeLeft / 295) * 100}
                color="brand.500"
                size="80px"
                thickness="8px"
              >
                <CircularProgressLabel color="text.primary">{formatTime(timeLeft)}</CircularProgressLabel>
              </CircularProgress>
            </Center>
            <Text textAlign="center" color="text.tertiary">Time left to complete payment</Text>

            <Box p={4} bg="background.secondary" borderRadius="md">
              <Heading size="sm" mb={2} color="text.primary">Booking Summary</Heading>
              <Text color="text.secondary">Movie: {show.movie.name}</Text>
              <Text color="text.secondary">Show: {show.slot.name} at {show.slot.startTime.substring(0, 5)}</Text>
              <Text color="text.secondary">Date: {formatTimestampToOrdinalDate(show.date)}</Text>
              <Text color="text.secondary">Seats: {selectedSeats.join(', ')}</Text>
              <Text fontWeight="bold" mt={2} color="brand.500">
                Total: {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(show.cost * numberOfSeats)}
              </Text>
            </Box>

            <Box p={6} border="1px solid" borderColor="surface.light" borderRadius="md" bg="white">
              <Heading size="md" mb={4} color="text.primary">Payment Details</Heading>

              <VStack spacing={4} align="stretch">
                <FormInput
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />

                <Flex direction={{ base: "column", sm: "row" }} gap={4}>
                  <FormInput
                    label="Expiry Date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  <FormInput
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    type="password"
                    maxLength={3}
                  />
                </Flex>

                <FormInput
                  label="Cardholder Name"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Name as on card"
                />
              </VStack>
            </Box>
          </VStack>
        );

      case BookingStep.CONFIRMATION:
        return (
          <VStack spacing={6} align="center" py={4}>
            {bookingStatus === BookingStatus.SUCCESS ? (
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
            ) : (
              <Flex
                w="80px"
                h="80px"
                borderRadius="full"
                bg="error"
                color="white"
                align="center"
                justify="center"
              >
                <Icon as={CloseIcon} boxSize={8} />
              </Flex>
            )}

            <Heading size="lg" color="text.primary">
              {bookingStatus === BookingStatus.SUCCESS
                ? "Payment Successful!"
                : bookingStatus === BookingStatus.TIMEOUT
                  ? "Payment Timed Out"
                  : "Payment Failed"}
            </Heading>

            <Text fontWeight="medium" textAlign="center" color="text.secondary">
              {bookingStatus === BookingStatus.SUCCESS
                ? "Your booking has been confirmed."
                : bookingStatus === BookingStatus.TIMEOUT
                  ? "You ran out of time to complete the payment."
                  : "There was an issue processing your payment."}
            </Text>

            {bookingStatus === BookingStatus.SUCCESS && (
              <>
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
                    }).format(show.cost * numberOfSeats)}
                  </Text>
                </Box>

                <Box textAlign="center" bg="background.secondary" p={4} borderRadius="md" width="100%">
                  <Text fontWeight="bold" mb={2} color="text.primary">Check-in QR Code</Text>
                  <Center>
                    <Box width="150px" height="150px" bg="gray.200" />
                  </Center>
                  <Text fontSize="sm" mt={2} color="text.tertiary">
                    This QR code can be used for immediate check-in at the cinema
                  </Text>
                </Box>

                <Button
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  leftIcon={<i className="fas fa-download" />}
                  onClick={downloadTicket}
                >
                  Download Ticket
                </Button>
              </>
            )}
          </VStack>
        );
    }
  };

  const canCloseModal = currentStep !== BookingStep.PAYMENT || bookingStatus !== BookingStatus.PENDING;

  return (
    <Modal
      isOpen={true}
      onClose={canCloseModal ? closeDialog : () => { }}
      closeOnOverlayClick={canCloseModal}
      closeOnEsc={canCloseModal}
      size="xl"
      scrollBehavior="inside"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="rgba(0,0,0,0.5)" />
      <ModalContent
        mx={4}
        my={4}
        bg="background.primary"
        maxH="calc(100vh - 80px)"
      >
        <ModalHeader
          color="text.primary"
          noOfLines={1}
          title={show.movie.name} // Shows full title on hover
        >
          {currentStep === BookingStep.CONFIRMATION
            ? (bookingStatus === BookingStatus.SUCCESS ? "Booking Confirmed" : "Booking Failed")
            : `Book Tickets - ${show.movie.name}`}
        </ModalHeader>
        {canCloseModal && <ModalCloseButton />}

        {currentStep !== BookingStep.CONFIRMATION && <StepIndicator />}

        <ModalBody
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
          }}
        >
          {isLoading ? (
            <Center p={10}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Center>
          ) : (
            renderStepContent()
          )}
        </ModalBody>

        {currentStep !== BookingStep.CONFIRMATION && !isLoading && (
          <ModalFooter>
            {currentStep !== BookingStep.PAYMENT && currentStep > BookingStep.MOVIE_INFO && (
              <Button
                mr={3}
                onClick={handlePreviousStep}
                variant="ghost"
              >
                Back
              </Button>
            )}

            {currentStep !== BookingStep.PAYMENT && (
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handleNextStep}
                isDisabled={
                  (currentStep === BookingStep.MOVIE_INFO && (numberOfSeats > 10 || numberOfSeats <= 0 || numberOfSeats > show.availableseats)) ||
                  (currentStep === BookingStep.SEAT_SELECTION && selectedSeats.length !== numberOfSeats)
                }
              >
                {currentStep === BookingStep.SEAT_SELECTION ? "Proceed to Payment" : "Next"}
              </Button>
            )}

            {currentStep === BookingStep.PAYMENT && (
              <>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={handlePaymentCancel}
                >
                  Cancel
                </Button>
                <Button
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  onClick={handlePayment}
                >
                  Complete Payment
                </Button>
              </>
            )}
          </ModalFooter>
        )}

        {currentStep === BookingStep.CONFIRMATION && (
          <ModalFooter>
            <Button onClick={closeDialog} bg="gray.100">Close</Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
