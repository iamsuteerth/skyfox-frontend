import React from 'react';
import { FormControl, FormLabel, Input, FormHelperText } from '@chakra-ui/react';

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  error
}) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const isOutOfRange = numValue < 50 || numValue > 3000;

  return (
    <FormControl isRequired isInvalid={!!error || isOutOfRange}>
      <FormLabel color="text.primary">Ticket Price (₹)</FormLabel>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter price"
        min={50.0}
        max={3000.0}
        step="any"
        borderColor="surface.light"
        _hover={{ borderColor: "surface.dark" }}
        _focus={{
          borderColor: "primary",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary)"
        }}
        color="text.primary"
      />
      <FormHelperText color={isOutOfRange || error ? "error" : "text.tertiary"}>
        Price range: ₹50 - ₹3,000
      </FormHelperText>
    </FormControl>
  );
};