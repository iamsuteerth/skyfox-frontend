'use client';

import React, { useCallback, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Center,
  Spinner,
  Flex,
  Box
} from '@chakra-ui/react';

import { useDialog } from '@/contexts/dialog-context';
import { useShows } from '@/contexts/shows-contex';
import { useCustomToast } from '@/app/components/ui/custom-toast';

import { Show } from '@/services/shows-service';
import { createAdminBooking } from '@/services/booking-service';
import { downloadTicket } from '@/services/ticket-service';

import { MovieInfoStep } from '../shared/movie-info-step';
import { SeatSelectionStep } from '../shared/seat-selection-step';
import CustomerDetailsStep from './components/customer-details-step';
import { BookingFinalStep } from '../shared/booking-final-step';

import { validateName, validatePhone } from '@/utils/validators';

enum BookingStep {
  MOVIE_INFO = 0,
  SEAT_SELECTION = 1,
  CUSTOMER_DETAILS = 2,
  SUCCESS = 3
}

export default function AdminBookingDialog() {
  const { closeDialog, dialogData } = useDialog();
  const { refreshShows } = useShows();
  const { showToast } = useCustomToast();

  const DELUXE_OFFSET = 150.0;

  const show = dialogData?.show as Show;

  const [currentStep, setCurrentStep] = useState(BookingStep.MOVIE_INFO);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [seatsError, setSeatsError] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [isCustomerFormValid, setIsCustomerFormValid] = useState(false);
  const [totalPrice, setTotalPrice] = useState(show.cost * numberOfSeats);
  const [deluxeCount, setDeluxeCount] = useState(0);

  const handleFinalStepClose = () => {
    refreshShows();
    closeDialog();
  };

  const handlePriceUpdate = useCallback((newTotalPrice: number, newDeluxeCount: number) => {
    setTotalPrice(newTotalPrice);
    setDeluxeCount(newDeluxeCount);
  }, []);

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
    if (value > 10 || value < 0) {
      validateNumberOfSeats(value);
    } else {
      setSeatsError('');
    }
    if (selectedSeats.length > 0) {
      setSelectedSeats([]);
    }
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerName(value);
    const error = validateName(value);
    setNameError(error || '');
  };

  const handleCustomerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerPhone(value);
    const error = validatePhone(value);
    setPhoneError(error || '');
  };

  const handleFormValidChange = useCallback((isValid: boolean) => {
    setIsCustomerFormValid(isValid);
  }, []);

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
      const nameValidation = validateName(customerName);
      const phoneValidation = validatePhone(customerPhone);
      setNameError(nameValidation || '');
      setPhoneError(phoneValidation || '');
      if (!nameValidation && !phoneValidation) {
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

  const handleDownloadTicket = () => {
    downloadTicket(bookingId!, showToast)
  };

  const createBooking = async () => {
    setIsLoading(true);
    try {
      const result = await createAdminBooking(
        show.id,
        customerName,
        customerPhone,
        selectedSeats,
        totalPrice,
        showToast
      );
      if (result.success && result.bookingId) {
        setBookingId(result.bookingId);
        setCurrentStep(BookingStep.SUCCESS);
      }
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
            onPriceUpdate={handlePriceUpdate}
            baseSeatPrice={show.cost}
            deluxeOffset={DELUXE_OFFSET}
          />
        );

      case BookingStep.CUSTOMER_DETAILS:
        return (
          <CustomerDetailsStep
            show={show}
            selectedSeats={selectedSeats}
            numberOfSeats={numberOfSeats}
            customerName={customerName}
            customerPhone={customerPhone}
            nameError={nameError}
            phoneError={phoneError}
            onCustomerNameChange={handleCustomerNameChange}
            onCustomerPhoneChange={handleCustomerPhoneChange}
            onValidate={handleFormValidChange}
            totalPrice={totalPrice}
          />
        );

      case BookingStep.SUCCESS:
        return (
          <BookingFinalStep
            show={show}
            selectedSeats={selectedSeats}
            bookingId={bookingId!}
            bookingStatus="SUCCESS"
            totalPrice={totalPrice}
            onDownloadTicket={handleDownloadTicket}
            isAdmin={true}
            customerName={customerName}
          />
        );
    }
  };

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

  const isNextButtonDisabled = () => {
    if (currentStep === BookingStep.MOVIE_INFO) {
      return numberOfSeats > 10 || numberOfSeats <= 0 || numberOfSeats > show.availableseats;
    }
    if (currentStep === BookingStep.SEAT_SELECTION) {
      return selectedSeats.length !== numberOfSeats;
    }
    if (currentStep === BookingStep.CUSTOMER_DETAILS) {
      return !isCustomerFormValid;
    }
    return false;
  };

  if (!show) return null;

  return (
    <Modal
      isOpen={true}
      onClose={currentStep === BookingStep.SUCCESS ? handleFinalStepClose : closeDialog}
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
          noOfLines={2}
          title={show.movie.name}
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
              <Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="xl" />
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
              isDisabled={isNextButtonDisabled()}
            >
              {currentStep === BookingStep.CUSTOMER_DETAILS ? "Confirm Booking" : "Next"}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}