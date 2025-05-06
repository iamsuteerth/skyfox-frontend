import React, { useState } from 'react';

import {
  Box,
  VStack,
  Button,
  Text,
  Heading,
  FormControl,
  FormLabel,
  Icon
} from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

import { useCustomToast } from '@/app/components/ui/custom-toast';

import { downloadBookingCsv } from '@/services/booking-csv-service';

import Select from '@/app/components/select';
import FormInput from '@/app/components/form-input';

const CsvReportArea: React.FC = () => {
  const { showToast } = useCustomToast();
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  
  const cardBg = 'background.primary';
  const cardBorder = 'gray.200';
  const textColor = 'text.primary';
  const subtextColor = 'text.secondary';

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const params = {
        ...(month !== null && { month }),
        ...(year !== null && { year }),
      };
      
      await downloadBookingCsv(params, showToast);
    } catch (error) {
      console.error('Failed to download CSV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setYear(value);
  };

  const handleMonthChange = (selectedMonth: string | number | null) => {
    const monthValue = typeof selectedMonth === 'string' ? parseInt(selectedMonth, 10) : selectedMonth;
    setMonth(monthValue);
  };

  return (
    <Box 
      p={5} 
      borderRadius="lg" 
      borderWidth="1px" 
      borderColor={cardBorder}
      bg={cardBg}
      boxShadow="sm"
      h="full"
    >
      <VStack spacing={5} align="flex-start">
        <Box>
          <Heading size="md" color={textColor} mb={1}>Download Booking Reports</Heading>
          <Text fontSize="sm" color={subtextColor}>
            Generate and download booking data as CSV files
          </Text>
        </Box>

        <FormControl>
          <FormLabel color={textColor}>Month (Optional)</FormLabel>
          <Select
            placeholder="Select month"
            options={monthOptions}
            onChange={handleMonthChange}
            value={month}
            label=""
          />
        </FormControl>

        <FormControl>
          <FormLabel color={textColor}>Year (Optional)</FormLabel>
          <FormInput
            type="number"
            placeholder="Enter year (e.g., 2025)"
            value={year !== null ? year.toString() : ''}
            onChange={handleYearChange}
            label=""
          />
        </FormControl>

        <Button 
          colorScheme="blue" 
          isLoading={isLoading} 
          loadingText="Downloading..."
          onClick={handleDownload}
          w="full"
          mt={3}
          leftIcon={<Icon as={FiDownload} />}
          bgColor="#E04B00"
          _hover={{ bgColor: "#c04200" }}
        >
          Download Report
        </Button>
      </VStack>
    </Box>
  );
};

export default CsvReportArea;
