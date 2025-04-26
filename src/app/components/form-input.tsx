'use client';

import { ReactNode, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  SystemStyleObject
} from '@chakra-ui/react';
import CustomDatePicker from '@/app/shows/components/dialogs/schedule-show/custom-date-picker';

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function detectCardType(num: string) {
  const cleaned = num.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  return '';
}

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
  maxLength?: number;
  isCardNumber?: boolean;
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
  maxLength,
  isCardNumber = false,
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

  const cardType = useMemo(() => isCardNumber ? detectCardType(value) : '', [value, isCardNumber]);

  const cardIcons: Record<string, ReactNode> = {
    visa: <img src="/assets/visa.svg" alt="Visa" style={{ height: "100%" }} />,
    mastercard: <img src="/assets/mastercard.svg" alt="Mastercard" style={{ height: "100%" }} />,
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16); 
    const formatted = formatCardNumber(raw);
    onChange({ ...e, target: { ...e.target, value: formatted } });
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
            value={isCardNumber ? formatCardNumber(value) : value}
            onChange={isCardNumber ? handleCardNumberChange : onChange}
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
            inputMode={isCardNumber ? "numeric" : undefined}
            autoComplete={isPassword ? "new-password" : undefined}
            maxLength={isCardNumber ? 19 : (maxLength ?? undefined)}
          />
          {(isCardNumber && cardType && cardIcons[cardType]) ? (
            <InputRightElement width="3rem" pr={2}>
              {cardIcons[cardType]}
            </InputRightElement>
          ) : (rightElement && (
            <InputRightElement width="4.5rem">{rightElement}</InputRightElement>
          ))}
        </InputGroup>
      )}
      {error && <FormErrorMessage color="error">{error}</FormErrorMessage>}
    </FormControl>
  );
}
