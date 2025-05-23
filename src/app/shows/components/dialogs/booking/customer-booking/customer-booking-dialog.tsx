'use client';

import React, { useState, useEffect, useCallback } from 'react';

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
  Center,
  Spinner
} from '@chakra-ui/react';

import { useDialog } from '@/contexts/dialog-context';
import { useShows } from '@/contexts/shows-contex';
import { useCustomToast } from '@/app/components/ui/custom-toast';

import { Show } from '@/services/shows-service';
import {
  PaymentRequest,
  initializeCustomerBooking,
  processCustomerPayment,
  cancelCustomerBooking
} from '@/services/booking-service';
import { downloadTicket } from '@/services/ticket-service';

import { DELUXE_OFFSET } from "@/constants";
import { MovieInfoStep } from '../shared/movie-info-step';
import { SeatSelectionStep } from '../shared/seat-selection-step';
import { PaymentStep } from './components/payment-step';
import { BookingFinalStep } from '../shared/booking-final-step';

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
  const { refreshShows } = useShows();
  const { showToast } = useCustomToast();

  const show = dialogData?.show as Show;

  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.MOVIE_INFO);
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [seatsError, setSeatsError] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(BookingStatus.PENDING);
  const [timeLeft, setTimeLeft] = useState(295);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [isWalletSelected, setIsWalletSelected] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const [deluxeCount, setDeluxeCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isPaymentFormValid, setIsPaymentFormValid] = useState(false);

  const handleFinalStepClose = () => {
    refreshShows();
    closeDialog();
  };

  const handlePriceUpdate = useCallback((price: number, deluxe: number) => {
    setTotalPrice(price);
    setDeluxeCount(deluxe);
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
      const result = await initializeCustomerBooking(show.id, selectedSeats, totalPrice, showToast);
      setBookingId(result.booking_id);
      setCurrentStep(BookingStep.PAYMENT);
    } catch (error) {
      showToast({
        type: "error",
        title: "Booking initialization failed",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentInitiated(true);
    setIsLoading(true);
    try {
      let paymentPayload: PaymentRequest = {
        booking_id: bookingId!,
        payment_method: isWalletSelected ? "Wallet" : "Card"
      };

      if (!isWalletSelected || (isWalletSelected && walletBalance < totalPrice)) {
        const sanitizedCardNumber = cardNumber.replace(/\s+/g, '');
        const [expiryMonth, expiryYear] = expiryDate.split('/');

        paymentPayload = {
          ...paymentPayload,
          card_number: sanitizedCardNumber,
          cvv,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cardholder_name: cardholderName,
        };
      }

      await processCustomerPayment(
        paymentPayload,
        showToast
      );

      setBookingStatus(BookingStatus.SUCCESS);
      setCurrentStep(BookingStep.CONFIRMATION);
    } catch (error) {
      try {
        await cancelCustomerBooking(bookingId!);
      } catch (cancelErr) { }

      setBookingStatus(BookingStatus.FAILED);
      setCurrentStep(BookingStep.CONFIRMATION);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentCancel = async () => {
    setIsLoading(true);
    try {
      await cancelCustomerBooking(bookingId!, showToast);
      closeDialog();
      return;
    } catch (error) { }
    finally { setIsLoading(false); }
  };

  const handlePaymentTimeout = async () => {
    setIsLoading(true);
    try {
      setBookingStatus(BookingStatus.TIMEOUT);
      setCurrentStep(BookingStep.CONFIRMATION);
    } catch (error) {
      console.error("Timeout handling failed", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (
        currentStep === BookingStep.PAYMENT &&
        bookingStatus === BookingStatus.PENDING &&
        bookingId
      ) {
        try {
          await cancelCustomerBooking(bookingId);
        } catch { }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentStep, bookingStatus, bookingId]);

  const handleDownloadTicket = () => {
    downloadTicket(bookingId!, showToast)
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
            onSeatSelect={handleSeatSelect}
            onPriceUpdate={handlePriceUpdate}
            numberOfSeats={numberOfSeats}
            selectedSeats={selectedSeats}
            baseSeatPrice={show.cost}
            deluxeOffset={DELUXE_OFFSET}
          />
        );

      case BookingStep.PAYMENT:
        return (
          <PaymentStep
            show={show}
            selectedSeats={selectedSeats}
            numberOfSeats={numberOfSeats}
            deluxeCount={deluxeCount}
            totalPrice={totalPrice}
            timeLeft={timeLeft}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            cvv={cvv}
            setCvv={setCvv}
            cardholderName={cardholderName}
            setCardholderName={setCardholderName}
            onFormValidChange={setIsPaymentFormValid}
            isWalletSelected={isWalletSelected}
            setIsWalletSelected={setIsWalletSelected}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
          />
        );

      case BookingStep.CONFIRMATION:
        return (
          <BookingFinalStep
            show={show}
            selectedSeats={selectedSeats}
            bookingId={bookingId!}
            bookingStatus={
              bookingStatus === BookingStatus.SUCCESS
                ? "SUCCESS"
                : bookingStatus === BookingStatus.TIMEOUT
                  ? "TIMEOUT"
                  : "FAILED"
            }
            totalPrice={totalPrice}
            onDownloadTicket={handleDownloadTicket}
          />
        );
    }
  };

  const canCloseModal = currentStep !== BookingStep.PAYMENT || bookingStatus !== BookingStatus.PENDING;

  if (!show) return null;

  return (
    <Modal
      isOpen={true}
      onClose={canCloseModal ? bookingStatus === BookingStatus.SUCCESS ? handleFinalStepClose : closeDialog : () => { }}
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
          noOfLines={2}
          title={show.movie.name}
        >
          {currentStep === BookingStep.CONFIRMATION
            ? (bookingStatus === BookingStatus.SUCCESS
              ? "Booking Confirmed"
              : "Booking Failed")
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
              <Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="xl" />
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
                  isDisabled={!isPaymentFormValid || isLoading}
                >
                  Complete Payment
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
