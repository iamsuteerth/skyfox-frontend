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
  VStack,
  Divider,
  Heading,
  useBreakpointValue,
  FormControl,
} from '@chakra-ui/react';

import { useCustomToast } from "@/app/components/ui/custom-toast";

import { addFundsToWallet } from '@/services/wallet-service';

import { PriceInput } from '@/app/components/price-input';
import CardPaymentForm from './components/card-payment-form';

interface WalletTopUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
  presetAmount?: number; 
  isAmountFixed?: boolean; 
  title?: string; 
}

export default function WalletTopUpDialog({
  isOpen,
  onClose,
  onSuccess,
  presetAmount,
  isAmountFixed = false,
  title = "Add Funds to Wallet"
}: WalletTopUpDialogProps) {
  const [amount, setAmount] = useState<string>('100');
  const [amountError, setAmountError] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { showToast } = useCustomToast();
  
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'sm',
    md: 'md'
  });

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue <= 0) {
      setAmountError('Please enter a valid amount');
      return false;
    }

    if (numValue < 100) {
      setAmountError('Minimum amount is ₹100');
      return false;
    }

    if (numValue > 10000) {
      setAmountError('Maximum amount is ₹10,000 per transaction');
      return false;
    }

    setAmountError('');
    return true;
  };

  const handleFormValidChange = (valid: boolean) => {
    setIsFormValid(valid);
  };

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);
    
    if (!validateAmount(amount) || !isFormValid) {
      return;
    }

    setIsLoading(true);

    try {
      const [expiryMonth, expiryYear] = expiryDate.split('/');
      
      const fundData = {
        amount: numAmount,
        card_number: cardNumber.replace(/\s/g, ''),
        cvv: cvv,
        expiry_month: expiryMonth,
        expiry_year: `${expiryYear}`, 
        cardholder_name: cardholderName
      };

      const response = await addFundsToWallet(fundData, showToast);

      if (response) {
        if (onSuccess) {
          const updatedAmount = response.data?.balance !== undefined 
            ? response.data.balance 
            : numAmount;
            
          onSuccess(updatedAmount);
        }
        onClose();
      }
    } catch (error) {
      console.error("Error adding funds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && presetAmount !== undefined) {
      setAmount(presetAmount.toString());
    } 
  }, [isOpen, presetAmount]);

  useEffect(() => {
    if (!isOpen) {
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
      setAmountError('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!isLoading}
      closeOnEsc={!isLoading}
      size={modalSize}
      isCentered
      motionPreset="slideInBottom"
      blockScrollOnMount={false}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        bg="background.primary"
        borderColor="surface.light"
        borderWidth="1px"
        borderRadius="xl"
        mx={2}
        maxH={{ base: "85vh", md: "auto" }}
        overflow="auto"
      >
        <ModalHeader color="text.primary">{title}</ModalHeader>
        {!isLoading && <ModalCloseButton color="text.tertiary" />}
        <Divider borderColor="surface.light" />
        
        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={!!amountError}>
              <PriceInput
                value={amount}
                onChange={(value) => {
                  setAmount(value);
                  validateAmount(value);
                }}
                error={amountError}
                isDisabled={isAmountFixed}
                label="Amount to Add"
                helperText="Price range: ₹100 - ₹10,000"
                minValue={100}
                maxValue={10000}
              />
            </FormControl>

            <Divider borderColor="surface.light" />

            <Heading size="sm" color="text.primary">Payment Details</Heading>

            <CardPaymentForm
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              cvv={cvv}
              setCvv={setCvv}
              cardholderName={cardholderName}
              setCardholderName={setCardholderName}
              onFormValidChange={handleFormValidChange}
            />
          </VStack>
        </ModalBody>

        <Divider borderColor="surface.light" />
        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}
            borderColor="surface.light"
            color="text.primary"
            _hover={{ bg: 'rgba(224, 75, 0, 0.12)' }}
          >
            Cancel
          </Button>
          <Button
            bg="primary"
            color="white"
            _hover={{ bg: "#CC4300" }}
            _active={{ bg: "#B03B00" }}
            isLoading={isLoading}
            isDisabled={!isFormValid || !!amountError || parseFloat(amount) <= 0}
            onClick={handleAddFunds}
            loadingText="Processing"
          >
            {isAmountFixed ? "Pay Now" : "Add Funds"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
