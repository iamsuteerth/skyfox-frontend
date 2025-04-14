import React from 'react';
import { FormControl, FormLabel, FormErrorMessage, Select } from '@chakra-ui/react';
import { Slot } from './types';

interface SlotSelectorProps {
  slots: Slot[];
  selectedSlot: number | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  isLoading: boolean;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  slots,
  selectedSlot,
  onChange,
  error,
  isLoading
}) => {
  return (
    <FormControl isRequired isInvalid={!!error}>
      <FormLabel color="text.primary">Select Time Slot</FormLabel>
      <Select
        placeholder="Choose a time slot"
        value={selectedSlot?.toString() || ''}
        onChange={onChange}
        isDisabled={isLoading}
        borderColor="surface.light"
        _hover={{ borderColor: "surface.dark" }}
        _focus={{
          borderColor: "primary",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary)"
        }}
        color="text.primary"
      >
        {slots.map(slot => (
          <option key={slot.id} value={slot.id}>
            {slot.name} ({slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)})
          </option>
        ))}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
