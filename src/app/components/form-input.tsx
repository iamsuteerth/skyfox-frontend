'use client';

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  SystemStyleObject,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import CustomDatePicker from '@/app/shows/components/dialogs/schedule-show/custom-date-picker'; 

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  rightElement?: ReactNode;
  isPassword?: boolean;
  isDisabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  minDate?: string;
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
  isDisabled = false,
  minDate,
  onKeyDown,
}: FormInputProps) {
  const baseStyles: SystemStyleObject = {
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
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel fontWeight="medium" color="text.primary">{label}</FormLabel>
      
      {type === 'date' ? (
        <CustomDatePicker
          value={value}
          onChange={onChange}
          minDate={minDate}
          placeholder={placeholder}
          isDisabled={isDisabled}
          error={!!error}
        />
      ) : (
        <InputGroup size="lg">
          <Input
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown} 
            placeholder={placeholder}
            disabled={isDisabled}
            color="text.primary"
            borderRadius="xl"
            _focus={{
              borderColor: 'primary',
              boxShadow: '0 0 0 1px #E04B00',
            }}
            sx={baseStyles}
          />
          {rightElement && <InputRightElement width="4.5rem">{rightElement}</InputRightElement>}
        </InputGroup>
      )}
      
      {error && <FormErrorMessage color="error">{error}</FormErrorMessage>}
    </FormControl>
  );
}
