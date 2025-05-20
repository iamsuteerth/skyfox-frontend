'use client';

import React, { useEffect, useState } from "react";

import { Flex, VStack } from "@chakra-ui/react";

import {
  validateCardName,
  validateCardNumber,
  validateCVV,
  validateExpiry
} from "@/utils/validators";

import FormInput from "@/app/components/form-input";

interface CardPaymentFormProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  cardholderName: string;
  setCardholderName: (value: string) => void;
  onFormValidChange?: (valid: boolean) => void;
}

export default function CardPaymentForm({
  cardNumber, setCardNumber,
  expiryDate, setExpiryDate,
  cvv, setCvv,
  cardholderName, setCardholderName,
  onFormValidChange
}: CardPaymentFormProps) {
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cvvError, setCvvError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [cardholderNameError, setCardholderNameError] = useState<string | null>(null);

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    const groups = [];
    
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.substr(i, 4));
    }
    
    return groups.join(" ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardNumberError(validateCardNumber(formatted.replace(/\s/g, "")));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length === 3 && expiryDate.length === 4) {
      setExpiryDate(value.substring(0, 2));
      return;
    }

    let formatted = value.replace(/\D/g, "");
    if (formatted.length > 0) {
      formatted = formatted.substring(0, 4);
      if (formatted.length > 2) {
        formatted = formatted.substring(0, 2) + "/" + formatted.substring(2);
      }
    }

    setExpiryDate(formatted);
    setExpiryError(validateExpiry(formatted));
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value);
    setCvvError(validateCVV(value));
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardholderName(e.target.value);
    setCardholderNameError(validateCardName(e.target.value));
  };

  const isFormValid =
    !cardNumberError &&
    !expiryError &&
    !cvvError &&
    !cardholderNameError &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiryDate.length === 5 &&
    cvv.length === 3 &&
    cardholderName.trim().length > 0;

  useEffect(() => {
    if (onFormValidChange) {
      onFormValidChange(isFormValid);
    }
  }, [isFormValid, onFormValidChange]);

  const getCardType = () => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) {
      return "Visa";
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return "Mastercard";
    } else if (/^3[47]/.test(cleanNumber)) {
      return "American Express";
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      return "Discover";
    }
    return null;
  };

  return (
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
  );
}
