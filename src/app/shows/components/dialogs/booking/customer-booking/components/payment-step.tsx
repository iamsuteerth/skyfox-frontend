'use client';

import React, { useEffect, useMemo, useState } from "react";

import {
  VStack,
  Box,
  Heading,
  Text,
  CircularProgress,
  CircularProgressLabel,
  Flex,
} from "@chakra-ui/react";

import { Show } from "@/services/shows-service";
import {
  validateCardName,
  validateCardNumber,
  validateCVV,
  validateExpiry
} from "@/utils/validators";
import { formatTimestampToOrdinalDate } from "@/utils/date-utils";

import FormInput from "@/app/components/form-input";
import WalletPayment from "./wallet-payment";

interface PaymentStepProps {
  show: Show;
  selectedSeats: string[];
  numberOfSeats: number;
  deluxeCount: number;
  totalPrice: number;
  timeLeft: number;
  cardNumber: string;
  setCardNumber: (x: string) => void;
  expiryDate: string;
  setExpiryDate: (x: string) => void;
  cvv: string;
  setCvv: (x: string) => void;
  cardholderName: string;
  setCardholderName: (x: string) => void;
  onFormValidChange: (valid: boolean) => void;
  isWalletSelected: boolean;
  setIsWalletSelected: (selected: boolean) => void;
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  show,
  selectedSeats,
  deluxeCount,
  totalPrice,
  timeLeft,
  cardNumber, setCardNumber,
  expiryDate, setExpiryDate,
  cvv, setCvv,
  cardholderName, setCardholderName,
  onFormValidChange,
  isWalletSelected, setIsWalletSelected,
  walletBalance, setWalletBalance
}) => {
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cvvError, setCvvError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [cardholderNameError, setCardholderNameError] = useState<string | null>(null);

  const getTimerColor = () => {
    if (timeLeft >= 165) return "success";
    if (timeLeft >= 60) return "primary";
    return "error"; 
  };

  const timerColor = getTimerColor();
  
  const hasSufficientWalletFunds = walletBalance >= totalPrice;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
    setCardNumberError(validateCardNumber(e.target.value.replace(/\D/g, "")));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(e.target.value);
    setExpiryError(validateExpiry(e.target.value));
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value);
    setCvvError(validateCVV(e.target.value));
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardholderName(e.target.value);
    setCardholderNameError(validateCardName(e.target.value));
  };

  const paymentFormValid =
    (!isWalletSelected || !hasSufficientWalletFunds) ? (
      !cardNumberError &&
      !expiryError &&
      !cvvError &&
      !cardholderNameError &&
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiryDate.length === 5 &&
      cvv.length === 3 &&
      cardholderName.trim().length > 0
    ) : true;

  useEffect(() => {
    onFormValidChange(paymentFormValid);
  }, [paymentFormValid, onFormValidChange]);

  const formattedTotalPrice = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(totalPrice);
  }, [totalPrice]);

  return (
    <VStack spacing={6} align="stretch">
      <Box p={4} bg="background.secondary" borderRadius="md">
        <Heading size="sm" mb={2} color="text.primary">Booking Summary</Heading>
        <Text color="text.secondary">Movie: {show.movie.name}</Text>
        <Text color="text.secondary">Show: {show.slot.name} at {show.slot.startTime.substring(0, 5)}</Text>
        <Text color="text.secondary">Date: {formatTimestampToOrdinalDate(show.date)}</Text>
        <Text color="text.secondary">Seats: {selectedSeats.join(", ")}</Text>
        <Text color="text.secondary">Deluxe Seats: {deluxeCount}</Text>
        <Text fontWeight="bold" mt={2} color="brand.500">Total: {formattedTotalPrice}</Text>
      </Box>
      
      <Flex align="center" justify="space-between" px={2}>
        <Text color="text.tertiary">Time left to complete payment:</Text>
        <CircularProgress
          value={(timeLeft / 295) * 100}
          color={timerColor}
          size="60px"
          thickness="10px"
        >
          <CircularProgressLabel color={timerColor} fontSize="md">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>
      
      <WalletPayment
        totalPrice={totalPrice}
        isWalletSelected={isWalletSelected}
        setIsWalletSelected={setIsWalletSelected}
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
      />
      
      {(!isWalletSelected || (isWalletSelected && !hasSufficientWalletFunds)) && (
        <Box p={6} border="1px solid" borderColor="surface.light" borderRadius="md" bg="white">
          <Heading size="md" mb={4} color="text.primary">
            {isWalletSelected && !hasSufficientWalletFunds 
              ? `Card Payment (₹${(totalPrice - walletBalance).toFixed(2)})` 
              : "Payment Details"}
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormInput
              label="Card Number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              error={cardNumberError ?? undefined}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              isCardNumber
            />
            <Flex direction={{ base: "column", sm: "row" }} gap={4}>
              <FormInput
                label="Expiry Date"
                value={expiryDate}
                onChange={handleExpiryChange}
                error={expiryError ?? undefined}
                placeholder="MM/YY"
                maxLength={5}
              />
              <FormInput
                label="CVV"
                value={cvv}
                onChange={handleCVVChange}
                error={cvvError ?? undefined}
                placeholder="123"
                type="password"
                maxLength={3}
              />
            </Flex>
            <FormInput
              label="Cardholder Name"
              value={cardholderName}
              onChange={handleCardholderNameChange}
              error={cardholderNameError ?? undefined}
              placeholder="Name as on card"
            />
          </VStack>
        </Box>
      )}
    </VStack>
  );
}
