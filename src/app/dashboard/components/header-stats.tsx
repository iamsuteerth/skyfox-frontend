import React from 'react';

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

const HeaderStats: React.FC<HeaderStatsProps> = ({ isLoading, summaryData }) => {
  const cardBg = 'background.primary';
  const cardBorder = 'gray.200';
  const statTextColor = 'text.primary';
  const labelColor = 'text.secondary';

  const positiveColor = '#228B22'; 
  const negativeColor = '#D42158'; 

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
          bg={summaryData?.percentageDifference && summaryData.percentageDifference >= 0 ? positiveColor : negativeColor}
        />
        <StatLabel fontSize="md" color={labelColor} fontWeight="medium">This Month's Revenue</StatLabel>
        {isLoading ? (
          <Skeleton height="40px" my={2} startColor="gray.100" endColor="gray.300" />
        ) : (
          <>
            <StatNumber color={statTextColor} fontSize="2xl" fontWeight="bold" mt={1}>
              ₹{summaryData?.currentMonthRevenue?.toLocaleString() || 0}
            </StatNumber>
            <StatHelpText 
              color={summaryData?.percentageDifference && summaryData.percentageDifference >= 0 ? positiveColor : negativeColor}
              fontSize="sm"
              mt={0}
            >
              <StatArrow 
                type={summaryData?.percentageDifference && summaryData.percentageDifference >= 0 ? 'increase' : 'decrease'} 
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
          bg={summaryData?.seatsPercentageDifference && summaryData.seatsPercentageDifference >= 0 ? positiveColor : negativeColor}
        />
        <StatLabel fontSize="md" color={labelColor} fontWeight="medium">Seats Booked</StatLabel>
        {isLoading ? (
          <Skeleton height="40px" my={2} startColor="gray.100" endColor="gray.300" />
        ) : (
          <>
            <StatNumber color={statTextColor} fontSize="2xl" fontWeight="bold" mt={1}>
              {summaryData?.seatsBooked?.toLocaleString() || 0}
            </StatNumber>
            <StatHelpText 
              color={summaryData?.seatsPercentageDifference && summaryData.seatsPercentageDifference >= 0 ? positiveColor : negativeColor}
              fontSize="sm"
              mt={0}
            >
              <StatArrow 
                type={summaryData?.seatsPercentageDifference && summaryData.seatsPercentageDifference >= 0 ? 'increase' : 'decrease'} 
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
            ₹{summaryData?.totalRevenue?.toLocaleString() || 0}
          </StatNumber>
        )}
      </Stat>
    </SimpleGrid>
  );
};

export default HeaderStats;
