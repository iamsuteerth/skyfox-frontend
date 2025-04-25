import React from 'react';
import { VStack, Box, Text, Heading } from '@chakra-ui/react';
import FormInput from '@/app/components/form-input';
import { Show } from '@/services/shows-service';
import { formatTimestampToOrdinalDate } from '@/utils/date-utils';

interface CustomerDetailsStepProps {
  show: Show;
  selectedSeats: string[];
  numberOfSeats: number;
  customerName: string;
  customerPhone: string;
  nameError: string;
  phoneError: string;
  totalPrice: number; 
  onCustomerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomerPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidate: (isValid: boolean) => void;
}

export const CustomerDetailsStep: React.FC<CustomerDetailsStepProps> = ({
  show,
  selectedSeats,
  numberOfSeats,
  customerName,
  customerPhone,
  nameError,
  phoneError,
  totalPrice, 
  onCustomerNameChange,
  onCustomerPhoneChange,
  onValidate
}) => {
  React.useEffect(() => {
    const isValid = !nameError && !phoneError && customerName.trim() !== '' && customerPhone.trim() !== '';
    onValidate(isValid);
  }, [nameError, phoneError, customerName, customerPhone, onValidate]);

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md" color="text.primary">Customer Details</Heading>
      
      <FormInput
        label="Customer Name"
        value={customerName}
        onChange={onCustomerNameChange}
        error={nameError}
        placeholder="Enter customer name"
      />
      
      <FormInput
        label="Phone Number"
        value={customerPhone}
        onChange={onCustomerPhoneChange}
        error={phoneError}
        placeholder="Enter 10-digit phone number"
        type="tel"
      />
      
      <Box p={4} bg="background.secondary" borderRadius="md" mt={2}>
        <Text fontWeight="bold" mb={2} color="text.primary">Booking Summary</Text>
        <Text color="text.secondary">Movie: {show.movie.name}</Text>
        <Text color="text.secondary">Show: {show.slot.name} at {show.slot.startTime.substring(0, 5)}</Text>
        <Text color="text.secondary">Date: {formatTimestampToOrdinalDate(show.date)}</Text>
        <Text color="text.secondary">Seats: {selectedSeats.join(', ')}</Text>
        <Text fontWeight="bold" mt={2} color="brand.500">
          Total: {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
          }).format(totalPrice)}
        </Text>
      </Box>
    </VStack>
  );
};

export default CustomerDetailsStep;
