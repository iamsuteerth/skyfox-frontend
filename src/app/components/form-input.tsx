'use client';

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  rightElement?: ReactNode;
  isPassword?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  rightElement,
  isPassword = false,
  onKeyDown, 
}: FormInputProps) {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel fontWeight="medium" color="text.primary">{label}</FormLabel>
      <InputGroup size="lg">
        <Input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown} 
          placeholder={placeholder}
          bg="background.secondary"
          color="text.primary"
          borderRadius="xl"
          _focus={{
            borderColor: 'primary',
            boxShadow: '0 0 0 1px #E04B00',
          }}
          sx={{
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 1000px #F0F0F5 inset',
              WebkitTextFillColor: '#161A1E',
              caretColor: '#161A1E',
              fontFamily: 'var(--font-poppins), system-ui, sans-serif !important',
              fontSize: 'inherit !important',
            },
            '&:-webkit-autofill:focus': {
              WebkitBoxShadow: '0 0 0 1000px #F0F0F5 inset',
              WebkitTextFillColor: '#161A1E',
              fontFamily: 'var(--font-poppins), system-ui, sans-serif !important',
              fontSize: 'inherit !important',
            }
          }}
        />
        {rightElement && <InputRightElement width="4.5rem">{rightElement}</InputRightElement>}
      </InputGroup>
      {error && <FormErrorMessage color="error">{error}</FormErrorMessage>}
    </FormControl>
  );
}
