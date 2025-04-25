'use client';
import React, { useState } from 'react';
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
  VStack,
  Heading,
  Text,
  Center,
  Spinner,
  Icon,
  Flex,
  useToast
} from '@chakra-ui/react';
import { useDialog } from '@/contexts/dialog-context';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Show } from '@/services/shows-service';
import FormInput from '@/app/components/form-input';
import { MovieInfoStep } from '../shared/movie-info-step';
import { SeatSelectionStep } from '../shared/seat-selection-step';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { formatTimestampToOrdinalDate } from '@/utils/date-utils';

enum BookingStep {
  MOVIE_INFO = 0,
  SEAT_SELECTION = 1,
  CUSTOMER_DETAILS = 2,
  SUCCESS = 3
}

export default function AdminBookingDialog() {
  const { closeDialog, dialogData } = useDialog();
  const show = dialogData?.show as Show;
  const { showToast } = useCustomToast();

  // Steps state
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.MOVIE_INFO);
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [seatsError, setSeatsError] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

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

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const isValid = phoneRegex.test(phone);
    setPhoneError(isValid ? '' : 'Please enter a valid 10-digit phone number');
    return isValid;
  };

  const validateName = (name: string): boolean => {
    const isValid = name.trim().length >= 3;
    setNameError(isValid ? '' : 'Name should be at least 3 characters');
    return isValid;
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
        setCurrentStep(BookingStep.CUSTOMER_DETAILS);
      } else {
        showToast({
          type: 'error',
          title: 'Seat selection incomplete',
          description: `Please select ${numberOfSeats} ${numberOfSeats === 1 ? 'seat' : 'seats'}`
        });
      }
    } else if (currentStep === BookingStep.CUSTOMER_DETAILS) {
      if (validateName(customerName) && validatePhoneNumber(customerPhone)) {
        createBooking();
      } else {
        showToast({
          type: 'error',
          title: 'Invalid information',
          description: 'Please check the customer details'
        });
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSeatSelect = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const createBooking = async () => {
    setIsLoading(true);
    // This will be implemented in the service layer
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookingId("MOCK12345");
      setCurrentStep(BookingStep.SUCCESS);
    } catch (error) {
      console.error("Booking failed", error);
      showToast({
        type: 'error',
        title: 'Booking failed',
        description: 'There was an error creating the booking'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTicket = () => {
    // Will implement this later
    console.log("Downloading ticket for booking:", bookingId);
  };

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

      case BookingStep.CUSTOMER_DETAILS:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="text.primary">Customer Details</Heading>

            <FormInput
              label="Customer Name"
              value={customerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomerName(e.target.value);
                if (nameError) validateName(e.target.value);
              }}
              error={nameError}
              placeholder="Enter customer name"
            />

            <FormInput
              label="Phone Number"
              value={customerPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomerPhone(e.target.value);
                if (phoneError) validatePhoneNumber(e.target.value);
              }}
              error={phoneError}
              placeholder="Enter 10-digit phone number"
              type="tel"
            />

            <Box p={4} bg="background.secondary" borderRadius="md" mt={2}>
              <Text fontWeight="bold" mb={2} color="text.primary">Booking Summary</Text>
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
          </VStack>
        );

      case BookingStep.SUCCESS:
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
              The booking has been created for {customerName}.
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
                }).format(show.cost * numberOfSeats)}
              </Text>
            </Box>

            <Button
              variant="solid"
              onClick={downloadTicket}
              leftIcon={<i className="fas fa-download" />}
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.600" }}
            >
              Download Ticket
            </Button>
          </VStack>
        );
    }
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

  return (
    <Modal
      isOpen={true}
      onClose={closeDialog}
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
          {currentStep === BookingStep.SUCCESS
            ? "Booking Confirmed"
            : `Book Tickets - ${show.movie.name}`}
        </ModalHeader>
        <ModalCloseButton />

        {currentStep !== BookingStep.SUCCESS && <StepIndicator />}

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

        {currentStep !== BookingStep.SUCCESS && !isLoading && (
          <ModalFooter>
            {currentStep > BookingStep.MOVIE_INFO && (
              <Button
                mr={3}
                onClick={handlePreviousStep}
                variant="ghost"
              >
                Back
              </Button>
            )}
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
              {currentStep === BookingStep.CUSTOMER_DETAILS ? "Confirm Booking" : "Next"}
            </Button>
          </ModalFooter>
        )}

        {currentStep === BookingStep.SUCCESS && (
          <ModalFooter>
            <Button onClick={closeDialog} bg="gray.100">Close</Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
