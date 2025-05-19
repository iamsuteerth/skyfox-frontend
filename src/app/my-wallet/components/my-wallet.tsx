'use client';

import React, { useState, useEffect } from "react";

import {
  Box,
  Container,
  Heading,
  Flex,
  useDisclosure,
  Divider
} from "@chakra-ui/react";

import { useCustomToast } from "@/app/components/ui/custom-toast";

import { 
  getWalletBalance, 
  getWalletTransactions,
  WalletTransaction as ServiceWalletTransaction
} from "@/services/wallet-service";

import WalletBalanceCard from "./wallet-balance-card";
import TransactionHistory, { Transaction } from "./transaction-history";
import WalletTopUpDialog from "../dialogs/wallet-top-up-dialog";

export default function MyWallet() {
  const [balance, setBalance] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useCustomToast();
  
  const fetchWalletBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const response = await getWalletBalance(showToast);
      
      if (response && response.data) {
        setBalance(response.data.balance);
        setLastUpdated(new Date(response.data.updated_at).toLocaleString());
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };
  
  const fetchWalletTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await getWalletTransactions(showToast);
      
      if (response && response.data && response.data.transactions) {
        const formattedTransactions = response.data.transactions.map((tx: ServiceWalletTransaction) => ({
          id: tx.transaction_id,
          type: tx.transaction_type,
          amount: parseFloat(tx.amount),
          timestamp: tx.timestamp,
          bookingId: tx.booking_id,
        }));
        
        setTransactions(formattedTransactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed to fetch wallet transactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };
  
  useEffect(() => {
    fetchWalletBalance();
    fetchWalletTransactions();
  }, []);
  
  const handleAddFundsSuccess = () => {
    fetchWalletBalance();
    fetchWalletTransactions();
  };
  
  return (
    <Container maxW="container.lg" py={6}>
      <Heading size="lg" mb={6} color="text.primary">My Wallet</Heading>
      <Divider mb={6} borderColor="surface.light" />
      
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={6}
        align="flex-start"
      >
        <Box width={{ base: "100%", md: "40%" }}>
          <WalletBalanceCard
            balance={balance}
            lastUpdated={lastUpdated}
            onAddFundsClick={onOpen}
            isLoading={isLoadingBalance}
          />
        </Box>
        
        <Box width={{ base: "100%", md: "60%" }}>
          <TransactionHistory
            transactions={transactions}
            isLoading={isLoadingTransactions}
          />
        </Box>
      </Flex>
      
      <WalletTopUpDialog
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleAddFundsSuccess}
      />
    </Container>
  );
}
