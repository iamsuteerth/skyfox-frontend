// src/app/shows/components/date-selector.tsx
import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { DatePicker } from '@/app/components/date-picker';
import { useAuth } from '@/contexts/auth-context';

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const { user } = useAuth();
  const isCustomer = user?.role === 'customer';

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    : 'Today';

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 6);

  return (
    <Flex 
      align="center" 
      justify="space-between" 
      mb={4}
      pb={2}
      borderBottomWidth="1px"
      borderBottomColor="surface.light"
    >
      <Text 
        fontSize="xl" 
        fontWeight="semibold" 
        color="text.primary"
      >
        {formattedDate}
      </Text>
      <DatePicker
        value={selectedDate}
        onChange={onDateChange}
        minDate={isCustomer ? today : undefined}
        maxDate={isCustomer ? maxDate : undefined}
        updateSearchParams={true}
        searchParamName="date"
        iconColor="brand.600"
      />
    </Flex>
  );
};

export default DateSelector;
