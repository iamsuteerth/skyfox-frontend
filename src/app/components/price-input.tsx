import React from 'react';
import { FormControl, FormLabel, Input, FormHelperText } from '@chakra-ui/react';

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  minValue?: number;
  maxValue?: number;
  helperText?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  placeholder?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  error,
  label = "Ticket Price (₹)",
  minValue = 50,
  maxValue = 3000,
  helperText,
  isDisabled = false,
  isRequired = true,
  placeholder = "Enter price"
}) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const isOutOfRange = !isNaN(numValue) && (numValue < minValue || numValue > maxValue);
  
  const defaultHelperText = helperText || `Price range: ₹${minValue} - ₹${maxValue.toLocaleString()}`;

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error || isOutOfRange} isDisabled={isDisabled}>
      <FormLabel color="text.primary">{label}</FormLabel>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={minValue}
        max={maxValue}
        step="any"
        borderColor="surface.light"
        _hover={{ borderColor: "surface.dark" }}
        _focus={{
          borderColor: "primary",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary)"
        }}
        color="text.primary"
      />
      <FormHelperText color={(isOutOfRange || error) ? "error" : "text.tertiary"}>
        {error || defaultHelperText}
      </FormHelperText>
    </FormControl>
  );
};
