import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

interface RevenueInputFormProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const RevenueInputForm: React.FC<RevenueInputFormProps> = ({
  label,
  type,
  value,
  onChange,
}) => {
  return (
    <FormControl>
      <FormLabel color="text.primary">{label}</FormLabel>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        borderColor="surface.light"
        _hover={{ borderColor: "surface.dark" }}
        _focus={{
          borderColor: "primary",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary)"
        }}
        color="text.primary"
      />
    </FormControl>
  );
};