'use client';

import {
  Box,
  Flex,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

interface WalletBalanceCardProps {
  balance: number;
  lastUpdated: string;
  onAddFundsClick: () => void;
  isLoading?: boolean;
}

export default function WalletBalanceCard({
  balance,
  lastUpdated,
  onAddFundsClick,
  isLoading = false
}: WalletBalanceCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      bg="white"
      shadow="sm"
      width="100%"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Badge colorScheme="green" fontSize="0.8em" px={2} py={1} borderRadius="md">
          Active
        </Badge>
      </Flex>

      <Stat my={4}>
        <StatLabel fontSize="md" color="text.tertiary">Current Balance</StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold" color="primary">
          {isLoading ? (
            '...'
          ) : (
            new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2
            }).format(balance)
          )}
        </StatNumber>
        <StatHelpText fontSize="sm" color="text.quaternary">
          Last updated: {lastUpdated}
        </StatHelpText>
      </Stat>

      <Button
        leftIcon={<AddIcon />}
        variant="solid"
        size="md"
        width="100%"
        mt={2}
        onClick={onAddFundsClick}
        isLoading={isLoading}
      >
        Add Funds
      </Button>
    </Box>
  );
}
