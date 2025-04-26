'use client';

import React, { useState, useRef } from 'react';
import { DayPicker, Matcher } from 'react-day-picker';
import { format, parse } from 'date-fns';
import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  InputGroup,
  InputRightElement,
  Icon,
  Box
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import 'react-day-picker/dist/style.css';

interface CustomDatePickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minDate?: string;
  placeholder?: string;
  isDisabled?: boolean;
  error?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minDate,
  placeholder = 'Select date',
  isDisabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialFocusRef = useRef(null);
  
  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
  const minDateObj = minDate ? parse(minDate, 'yyyy-MM-dd', new Date()) : undefined;
  
  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const syntheticEvent = {
        target: {
          value: formattedDate,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
      setIsOpen(false);
    }
  };
  
  const openCalendar = () => {
    if (!isDisabled) {
      setIsOpen(true);
    }
  };
  
  const closeCalendar = () => {
    setIsOpen(false);
  };

  const displayValue = selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '';
  
  const disabledDays: Matcher | Matcher[] | undefined = minDateObj 
    ? { before: minDateObj } 
    : undefined;

  return (
    <Popover
      isOpen={isOpen}
      onClose={closeCalendar}
      initialFocusRef={initialFocusRef}
      placement="bottom-start"
      closeOnBlur={true}
      gutter={8}
    >
      <PopoverTrigger>
        <InputGroup>
          <Input
            readOnly
            value={displayValue}
            placeholder={placeholder}
            onClick={openCalendar}
            isDisabled={isDisabled}
            cursor="pointer"
            bg="background.primary"
            color="text.primary"
            borderRadius="md"
            borderColor={error ? "error" : "surface.light"}
            _hover={{ borderColor: "surface.dark" }}
            _focus={{
              borderColor: 'primary',
              boxShadow: '0 0 0 1px #E04B00',
            }}
          />
          <InputRightElement onClick={openCalendar}>
            <Icon
              as={CalendarIcon}
              color="brand.600"
              cursor={isDisabled ? 'not-allowed' : 'pointer'}
            />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      
      <PopoverContent
        borderColor="surface.light"
        bg="background.primary"
        borderRadius="md"
        width="xs"
        boxShadow="lg"
      >
        <PopoverBody p={2}>
          <Box
            className="custom-day-picker"
            sx={{
              '.rdp': {
                '--rdp-accent-color': 'var(--chakra-colors-brand-500)',
                '--rdp-background-color': 'var(--chakra-colors-brand-100)',
                fontFamily: 'var(--font-poppins), sans-serif',
                margin: '0 auto', 
                padding: '0',     
                width: 'fit-content',
              },
              '.rdp-table': {
                margin: '0 auto',
                borderSpacing: '0',
                borderCollapse: 'collapse',
              },
              '.rdp-month': {
                margin: '0', 
              },
              '.rdp-caption': {
                color: 'text.primary',
                padding: '0.5rem 0',
                justifyContent: 'center',
                margin: '0',
              },
              '.rdp-caption_label': {
                fontSize: '1rem',
                fontWeight: 'medium',
                color: 'text.primary',
                padding: '0 8px',
              },
              '.rdp-button_previous, .rdp-button_next': {
                color: 'secondary',
                transition: 'all 0.2s',
                borderRadius: '50%',
                padding: '4px',
                margin: '0',
              },
              '.rdp-button_previous:hover, .rdp-button_next:hover': {
                backgroundColor: 'rgba(224, 75, 0, 0.1)',
              },
              '.rdp-button_previous svg, .rdp-button_next svg': {
                fill: 'var(--chakra-colors-secondary)',
              },
              '.rdp-weekdays': {
                color: 'text.tertiary',
                fontWeight: "bold",
                marginBottom: '0.5rem',
              },
              '.rdp-head_cell': {
                padding: '0',
                textAlign: 'center',
                width: '40px', 
              },
              '.rdp-head_cell abbr': {
                textDecoration: 'none',
              },
              '.rdp-cell': {
                padding: '0',
                width: '40px',
                height: '40px',
              },
              '.rdp-day': {
                height: '40px',
                width: '40px',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                margin: '0',
              },
              '.rdp-day_button': {
                borderRadius: 'xl',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0', 
              },
              '.rdp-day_selected, .rdp-day_selected:hover': {
                backgroundColor: 'transparent',
              },
              '.rdp-day_selected .rdp-day_button': {
                backgroundColor: 'brand.500',
                fontWeight: 'bold',
                color: 'white',
                borderRadius: 'xl',
              },
              '.rdp-day_selected .rdp-day_button:hover': {
                backgroundColor: 'brand.500 !important',
                color: 'white !important',
              },
              '.rdp-day_today': {
                position: 'relative',
                fontWeight: 'medium',
              },
              '.rdp-day_today .rdp-day_button:not(.rdp-day_selected)': {
                color: 'brand.600',
                border: '1px solid var(--chakra-colors-brand-500)',
                borderRadius: 'xl',
              },
              '.rdp-day_today.rdp-day_selected .rdp-day_button': {
                color: 'white',
                backgroundColor: 'brand.500',
                border: 'none',
                borderRadius: 'xl',
              },
              '.rdp-day:not(.rdp-day_selected) .rdp-day_button:hover:not([disabled])': {
                backgroundColor: 'rgba(224, 75, 0, 0.1)',
                color: 'brand.700',
              },
              '.rdp-day_button:focus-visible:not([disabled])': {
                borderColor: 'brand.500',
                boxShadow: '0 0 0 2px var(--chakra-colors-brand-300)',
                outline: 'none',
              },
              '.rdp-day_disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
            }}
            
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              disabled={disabledDays}
              modifiersClassNames={{
                selected: 'rdp-day_selected',
                today: 'rdp-day_today',
                disabled: 'rdp-day_disabled',
              }}
            />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CustomDatePicker;