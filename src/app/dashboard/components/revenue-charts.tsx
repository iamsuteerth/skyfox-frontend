import React, { useMemo } from 'react';

import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Skeleton,
  Alert,
  AlertIcon,
  useBreakpointValue
} from '@chakra-ui/react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { RevenueData } from '@/services/revenue-service';

interface RevenueChartsProps {
  data: RevenueData[];
  isLoading: boolean;
  viewType: 'timeframe' | 'specific';
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  movieName?: string;
  slotName?: string;
  genre?: string;
}

export const RevenueCharts: React.FC<RevenueChartsProps> = ({
  data,
  isLoading,
  timeframe,
  movieName,
  slotName,
  genre
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const chartData = useMemo(() => {
    return data.map(item => ({
      name: item.label.split(";")[0], 
      totalRevenue: item.total_revenue,
      meanRevenue: item.mean_revenue,
      medianRevenue: item.median_revenue || 0,
      totalBookings: item.total_bookings,
      totalSeatsBooked: item.total_seats_booked || 0
    }));
  }, [data]);

  const summaryData = useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      totalRevenue: data.reduce((sum, item) => sum + item.total_revenue, 0),
      totalBookings: data.reduce((sum, item) => sum + item.total_bookings, 0),
      totalSeatsBooked: data.reduce((sum, item) => sum + (item.total_seats_booked || 0), 0)
    };
  }, [data]);

  const colors = {
    primary: '#E04B00',
    secondary: '#228B22',
    accent: '#6495ED',
    background: 'background.primary',
    cardBg: 'white',
    text: 'text.primary',
    subtextColor: 'text.secondary'
  };

  const CustomXAxisTick = (props: { x: number; y: number; payload: { value: string } }) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={colors.text}
          fontSize={12}
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const formatTooltipValue = (value: number, name: string): [string, string] => {
    if (name.includes('Revenue')) {
      return [`₹${value.toLocaleString()}`, name.replace('Revenue', ' Revenue')];
    }
    return [value.toString(), name];
  };

  const getSummaryTitle = () => {
    const parts = [];
    if (timeframe) parts.push(`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`);
    if (movieName) parts.push(movieName);
    if (slotName) parts.push(slotName);
    if (genre) parts.push(genre);

    return parts.length > 0 ? `${parts.join(' | ')} Revenue` : 'Total Revenue';
  };

  if (isLoading) {
    return (
      <Box p={4} bg={colors.background} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
        <Skeleton height="40px" width="200px" mb={4} startColor="gray.100" endColor="gray.300"/>
        <SimpleGrid columns={isMobile ? 2 : 3} spacing={4} mb={4}>
          <Skeleton height="80px" borderRadius="md" startColor="gray.100" endColor="gray.300" />
          <Skeleton height="80px" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
          {!isMobile && <Skeleton height="80px" borderRadius="md" startColor="gray.100" endColor="gray.300" />}
        </SimpleGrid>
        <Skeleton height="300px" borderRadius="md" mb={4} startColor="gray.100" endColor="gray.300"/>
        {!isMobile && <Skeleton height="300px" borderRadius="md" startColor="gray.100" endColor="gray.300" />}
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box p={4} bg={colors.background} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
        <Heading size="md" color={colors.text} mb={4}>Revenue Analytics</Heading>
        <Alert status="info" borderRadius="md" variant="subtle" bg="gray.50">
          <AlertIcon />
          No data available with the selected filters.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4} bg={colors.background} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
      <Heading size="md" color={colors.text} mb={4}>Revenue Analytics</Heading>
      <SimpleGrid columns={isMobile ? 2 : 3} spacing={4} mb={6}>
        <Box p={3} borderRadius="md" bg="gray.50" borderLeft="4px solid" borderColor={colors.primary}>
          <Text fontSize="sm" color={colors.subtextColor}>{getSummaryTitle()}</Text>
          <Text fontSize="xl" fontWeight="bold" color={colors.text}>
            ₹{summaryData?.totalRevenue.toLocaleString()}
          </Text>
        </Box>
        <Box p={3} borderRadius="md" bg="gray.50" borderLeft="4px solid" borderColor={colors.secondary}>
          <Text fontSize="sm" color={colors.subtextColor}>Bookings</Text>
          <Text fontSize="xl" fontWeight="bold" color={colors.text}>
            {summaryData?.totalBookings}
          </Text>
        </Box>
        <Box p={3} borderRadius="md" bg="gray.50" borderLeft="4px solid" borderColor={colors.accent}>
          <Text fontSize="sm" color={colors.subtextColor}>Seats Booked</Text>
          <Text fontSize="xl" fontWeight="bold" color={colors.text}>
            {summaryData?.totalSeatsBooked}
          </Text>
        </Box>
      </SimpleGrid>

      <VStack spacing={10} align="stretch">
        <Box height="400px" bg={colors.cardBg} p={4} borderRadius="md" boxShadow="sm">
          <Text fontSize="md" fontWeight="medium" mb={2} color={colors.text}>
            Revenue Trend
          </Text>
          <Box position="relative" height="100%" width="100%" pt={6}>
            <ResponsiveContainer width="100%" height={isMobile ? "85%" : "90%"}>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="gray.300" />
                <XAxis
                  dataKey="name"
                  height={70}
                  tick={CustomXAxisTick}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  formatter={formatTooltipValue}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderColor: 'gray.200',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    position: 'relative',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  name="Total Revenue"
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="meanRevenue"
                  name="Mean Revenue"
                  stroke={colors.accent}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="medianRevenue"
                  name="Median Revenue"
                  stroke="#FFB100"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box height="400px" bg={colors.cardBg} p={4} borderRadius="md" boxShadow="sm">
          <Text fontSize="md" fontWeight="medium" mb={2} color={colors.text}>
            Booking and Seat Distribution
          </Text>
          <Box position="relative" height="100%" width="100%" pt={6}>
            <ResponsiveContainer width="100%" height={isMobile ? "85%" : "90%"}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="gray.300" />
                <XAxis
                  dataKey="name"
                  height={70}
                  tick={CustomXAxisTick}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={formatTooltipValue}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderColor: 'gray.200',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    position: 'relative',
                  }}
                />
                <Bar dataKey="totalBookings" name="Total Bookings" fill={colors.secondary} />
                <Bar dataKey="totalSeatsBooked" name="Total Seats Booked" fill={colors.accent} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
