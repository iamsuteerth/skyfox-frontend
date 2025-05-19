'use client';

import { 
  Box, 
  Text, 
  Heading,
  Badge, 
  Flex,
  Icon,
  Center,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { MdInfoOutline } from "react-icons/md";

export interface Transaction {
  id: string;
  type: 'ADD' | 'DEDUCT';
  amount: number;
  timestamp: string;
  bookingId?: number;
  description?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  if (isLoading) {
    return (
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={6} 
        bg="white" 
        shadow="sm"
        width="100%"
        my={4}
      >
        <Heading size="md" mb={4} color="text.primary">Transaction History</Heading>
        <Center py={10}>
          <Spinner size="xl" color="primary" thickness="4px" />
        </Center>
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={6} 
        bg="white" 
        shadow="sm"
        width="100%"
        my={4}
      >
        <Heading size="md" mb={4} color="text.primary">Transaction History</Heading>
        <Center py={10} flexDirection="column">
          <Icon as={MdInfoOutline} boxSize={10} color="text.quaternary" mb={4} />
          <Text color="text.tertiary">No transactions found</Text>
          <Text fontSize="sm" color="text.quaternary" mt={2}>
            Transactions will appear here when you add funds or make bookings
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={6} 
      bg="white" 
      shadow="sm"
      width="100%"
      my={4}
    >
      <Heading size="md" mb={5} color="text.primary">Transaction History</Heading>
      
      <Box
        maxH="70vh"
        overflowY="auto"
        pr={1}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
      >
        <VStack 
          spacing={4}
          align="stretch"
          width="100%"
        >
          {transactions.map((transaction) => (
            <Box 
              key={transaction.id} 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="surface.light"
              bg="white"
              _hover={{ 
                borderColor: "primary",
                transition: "border-color 0.2s ease",
                shadow: "sm"
              }}
              width="100%"
            >
              <Flex direction="column" mb={3}>
                <Flex justifyContent="space-between" mb={2}>
                  <Box maxW="60%" overflow="hidden">
                    <Heading size="sm" color="text.primary" noOfLines={1}>
                      {transaction.bookingId 
                        ? `Booking #${transaction.bookingId}` 
                        : 'Wallet Top-up'}
                    </Heading>
                  </Box>
                  <Text 
                    fontWeight="bold"
                    fontSize="lg"
                    color={transaction.type === 'ADD' ? 'success' : 'error'}
                    textAlign="right"
                  >
                    {transaction.type === 'ADD' ? '+' : '-'}
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR'
                    }).format(transaction.amount)}
                  </Text>
                </Flex>
                
                <Flex justifyContent="space-between" alignItems="center">
                  <Text 
                    fontSize="sm" 
                    color="text.tertiary" 
                    noOfLines={1}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxW="100%"
                  >
                    ID: {transaction.id}
                  </Text>
                  <Badge 
                    colorScheme={transaction.type === 'ADD' ? 'green' : 'red'}
                    display="flex"
                    alignItems="center"
                    width="fit-content"
                    py={0.5}
                    px={2}
                    borderRadius="full"
                    flexShrink={0} 
                  >
                    <Icon 
                      as={transaction.type === 'ADD' ? ArrowUpIcon : ArrowDownIcon} 
                      mr={1}
                      boxSize={3}
                    />
                    {transaction.type}
                  </Badge>
                </Flex>
              </Flex>
              
              <Text 
                fontSize="xs" 
                color="text.quaternary" 
                mt={1}
              >
                {new Date(transaction.timestamp).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
