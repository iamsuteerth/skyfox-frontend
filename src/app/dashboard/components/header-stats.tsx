import React, { memo } from 'react';

import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Skeleton,
  Box
} from '@chakra-ui/react';

import { RevenueSummary } from '@/services/revenue-service';

interface HeaderStatsProps {
  isLoading: boolean;
  summaryData: RevenueSummary | null;
}

const COLORS = {
  positiveColor: '#228B22',
  negativeColor: '#D42158'
};

const HeaderStats: React.FC<HeaderStatsProps> = memo(({ isLoading, summaryData }) => {
  const cardBg = 'background.primary';
  const cardBorder = 'gray.200';
  const statTextColor = 'text.primary';
  const labelColor = 'text.secondary';

  const formatCurrency = (value?: number) => {
    return (value ?? 0).toLocaleString();
  };

  const isCurrentRevenuePositive = summaryData?.percentageDifference && summaryData.percentageDifference >= 0;
  const isSeatsPositive = summaryData?.seatsPercentageDifference && summaryData.seatsPercentageDifference >= 0;
  
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} w="full">
      <Stat 
        p={5} 
        bg={cardBg} 
        borderRadius="lg" 
        borderWidth="1px" 
        borderColor={cardBorder}
        boxShadow="sm"
        position="relative"
        overflow="hidden"
      >
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          h="4px" 
          w="full" 
          bg={isCurrentRevenuePositive ? COLORS.positiveColor : COLORS.negativeColor}
        />
        <StatLabel fontSize="md" color={labelColor} fontWeight="medium">This Month's Revenue</StatLabel>
        {isLoading ? (
          <Skeleton height="40px" my={2} startColor="gray.100" endColor="gray.300" />
        ) : (
          <>
            <StatNumber color={statTextColor} fontSize="2xl" fontWeight="bold" mt={1}>
              ₹{formatCurrency(summaryData?.currentMonthRevenue)}
            </StatNumber>
            <StatHelpText 
              color={isCurrentRevenuePositive ? COLORS.positiveColor : COLORS.negativeColor}
              fontSize="sm"
              mt={0}
            >
              <StatArrow 
                type={isCurrentRevenuePositive ? 'increase' : 'decrease'} 
              />
              {Math.abs(Math.round(summaryData?.percentageDifference || 0))}% from last month
            </StatHelpText>
          </>
        )}
      </Stat>

      <Stat 
        p={5} 
        bg={cardBg} 
        borderRadius="lg" 
        borderWidth="1px" 
        borderColor={cardBorder}
        boxShadow="sm"
        position="relative"
        overflow="hidden"
      >
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          h="4px" 
          w="full" 
          bg={isSeatsPositive ? COLORS.positiveColor : COLORS.negativeColor}
        />
        <StatLabel fontSize="md" color={labelColor} fontWeight="medium">Seats Booked</StatLabel>
        {isLoading ? (
          <Skeleton height="40px" my={2} startColor="gray.100" endColor="gray.300" />
        ) : (
          <>
            <StatNumber color={statTextColor} fontSize="2xl" fontWeight="bold" mt={1}>
              {formatCurrency(summaryData?.seatsBooked)}
            </StatNumber>
            <StatHelpText 
              color={isSeatsPositive ? COLORS.positiveColor : COLORS.negativeColor}
              fontSize="sm"
              mt={0}
            >
              <StatArrow 
                type={isSeatsPositive ? 'increase' : 'decrease'} 
              />
              {Math.abs(Math.round(summaryData?.seatsPercentageDifference || 0))}% from last month
            </StatHelpText>
          </>
        )}
      </Stat>

      <Stat 
        p={5} 
        bg={cardBg} 
        borderRadius="lg" 
        borderWidth="1px" 
        borderColor={cardBorder}
        boxShadow="sm"
      >
        <StatLabel fontSize="md" color={labelColor} fontWeight="medium">Total Revenue</StatLabel>
        {isLoading ? (
          <Skeleton height="40px" my={2} startColor="gray.100" endColor="gray.300" />
        ) : (
          <StatNumber color={statTextColor} fontSize="2xl" fontWeight="bold" mt={1}>
            ₹{formatCurrency(summaryData?.totalRevenue)}
          </StatNumber>
        )}
      </Stat>
    </SimpleGrid>
  );
});

HeaderStats.displayName = 'HeaderStats';

export default HeaderStats;
