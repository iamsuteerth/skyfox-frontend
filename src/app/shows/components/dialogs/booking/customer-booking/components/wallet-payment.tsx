'use client';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Flex,
  Text,
  Switch,
  Skeleton,
  Divider,
  Badge,
} from '@chakra-ui/react';

import { getWalletBalance } from '@/services/wallet-service';

interface WalletPaymentProps {
  totalPrice: number;
  isWalletSelected: boolean;
  setIsWalletSelected: (selected: boolean) => void;
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

export default function WalletPayment({
  totalPrice,
  isWalletSelected,
  setIsWalletSelected,
  walletBalance,
  setWalletBalance
}: WalletPaymentProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  const hasSufficientFunds = walletBalance >= totalPrice;
  
  const amountNeeded = Math.max(0, totalPrice - walletBalance);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        const response = await getWalletBalance();
        
        if (response && response.data) {
          setWalletBalance(response.data.balance);
        } else {
          setWalletBalance(0);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setWalletBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []); 

  return (
    <Box p={4} border="1px solid" borderColor="surface.light" borderRadius="md" bg="white">
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="medium" color="text.primary">Use Wallet Balance</Text>
        <Switch
          isChecked={isWalletSelected}
          onChange={(e) => setIsWalletSelected(e.target.checked)}
          colorScheme="brand"
          size="md"
          isDisabled={isLoading}
        />
      </Flex>
      
      <Skeleton isLoaded={!isLoading} fadeDuration={1}>
        <Flex justify="space-between" align="center" mt={2}>
          <Text color="text.secondary">Current Balance:</Text>
          <Text
            fontWeight="bold"
            color={hasSufficientFunds ? "success" : "error"}
          >
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(walletBalance)}
          </Text>
        </Flex>
      </Skeleton>
      
      {isWalletSelected && (
        <>
          <Divider my={3} borderColor="surface.light" />
          
          {hasSufficientFunds ? (
            <Flex justify="space-between" align="center">
              <Text color="text.secondary">Payment Method:</Text>
              <Badge colorScheme="green" px={2} py={1}>
                Wallet Payment
              </Badge>
            </Flex>
          ) : (
            <>
              <Flex justify="space-between" align="center" mb={1}>
                <Text color="text.secondary">Will use from wallet:</Text>
                <Text color="text.primary" fontWeight="medium">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(walletBalance)}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" mb={1}>
                <Text color="text.secondary">Remaining to pay:</Text>
                <Text color="error" fontWeight="bold">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(amountNeeded)}
                </Text>
              </Flex>
              <Text fontSize="sm" color="text.quaternary" mt={2}>
                Please provide card details for the remaining amount.
              </Text>
            </>
          )}
        </>
      )}
    </Box>
  );
}
