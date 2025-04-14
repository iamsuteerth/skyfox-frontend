/**
 * DatePicker Component
 * 
 * A custom date picker component that renders as an icon button and displays a calendar
 * when clicked. This component integrates MUI's DatePicker with Chakra UI styling.
 * 
 * @example
 * // Basic usage
 * const [date, setDate] = useState<Date | null>(new Date());
 * <DatePicker value={date} onChange={setDate} />
 * 
 * @example
 * // With URL search params update
 * <DatePicker 
 *   value={selectedDate} 
 *   onChange={setSelectedDate}
 *   updateSearchParams={true}
 *   searchParamName="showDate"
 *   iconColor="brand.600"
 * />
 */

import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import ThemeAdapter from './theme-adapter';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { CalendarIcon } from '@chakra-ui/icons';
import { useCustomToast } from '../ui/custom-toast';
import { isValidDateString } from '@/utils/date-utils';

const StyledDatePicker = styled(MuiDatePicker)({
  '& .MuiPickersCalendarHeader-label': {
    fontWeight: 500,
    fontFamily: 'Poppins, sans-serif',
  },
  '& .MuiDayCalendar-header': {
    fontFamily: 'Poppins, sans-serif',
  },
  '& .MuiDayCalendar-weekDayLabel': {
    fontFamily: 'Poppins, sans-serif',
  },
  '& .MuiPickersDay-root': {
    fontFamily: 'Poppins, sans-serif',
    '&.Mui-selected': {
      backgroundColor: '#CB4400',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#A63600',
      },
      '&:active': {
        backgroundColor: '#8A2D00',
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(203, 68, 0, 0.1)',
    },
  },
  '& .MuiPaper-root': {
    fontFamily: 'Poppins, sans-serif',
  },
});

/**
 * Custom field component that renders just the icon button
 * @param props - Props passed from the DatePicker
 */
function IconButtonField(props: any) {
  const { setOpen, disabled, iconColor } = props;

  return (
    <IconButton
      aria-label="Select date"
      icon={<CalendarIcon />}
      onClick={() => setOpen?.((prev: boolean) => !prev)}
      isDisabled={disabled}
      size="md"
      variant="ghost"
      color={'primary'}
      _hover={{ color: 'brand.600' }}
    />
  );
}

export interface DatePickerProps {
  /**
   * The currently selected date
   */
  value: Date | null;

  /**
   * Callback fired when the date changes
   * @param date - The new selected date or null if cleared
   */
  onChange: (date: Date | null) => void;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Whether the date picker is disabled
   */
  disabled?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Whether to update URL search params automatically when date changes
   */
  updateSearchParams?: boolean;

  /**
   * Name of search param to update in the URL
   */
  searchParamName?: string;

  /**
   * Color of the calendar icon (using Chakra UI color system)
   */
  iconColor?: string;
}

/**
 * A date picker component that displays as a calendar icon and opens a calendar popup when clicked.
 * Integrates with URL search parameters for maintaining state in the URL.
 */
const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  className,
  updateSearchParams = false,
  searchParamName = 'date',
  iconColor = "brand.600",
}) => {
  const { showToast } = useCustomToast();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const lastUpdatedUrl = useRef<string | null>(null);

  const dayjsValue = value ? dayjs(value).hour(12) : null;
  const dayjsMinDate = minDate ? dayjs(minDate).startOf('day') : undefined;
  const dayjsMaxDate = maxDate ? dayjs(maxDate).endOf('day') : undefined;

  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      setAnchorEl(buttonRef.current);
    }
  }, []);

  useEffect(() => {
    if (updateSearchParams && value) {
      try {
        const formattedDate = dayjs(value).format('YYYY-MM-DD');

        if (!isValidDateString(formattedDate)) {
          console.error('Invalid date format generated:', formattedDate);
          return;
        }

        const url = new URL(window.location.href);

        const currentDateParam = url.searchParams.get(searchParamName);
        if (currentDateParam === formattedDate) {
          return;
        }

        url.searchParams.set(searchParamName, formattedDate);
        const newUrl = url.toString();

        if (lastUpdatedUrl.current !== newUrl) {
          lastUpdatedUrl.current = newUrl;
          window.history.pushState({}, '', newUrl);
        }
      } catch (error) {
        console.error('Error updating URL search params:', error);
        showToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to update URL with selected date',
        });
      }
    }
  }, [updateSearchParams, searchParamName, value, showToast]);

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    try {
      if (newDate) {
        const dateString = newDate.format('YYYY-MM-DD');
        if (!isValidDateString(dateString)) {
          showToast({
            type: 'error',
            title: 'Invalid Date',
            description: 'The selected date is not valid.',
          });
          return;
        }

        const newDateStartOfDay = newDate.startOf('day');

        if (dayjsMinDate && newDateStartOfDay.isBefore(dayjsMinDate)) {
          showToast({
            type: 'error',
            title: 'Invalid Date',
            description: `Date cannot be before ${dayjsMinDate.format('MMMM D, YYYY')}`,
          });
          return;
        }

        if (dayjsMaxDate && newDateStartOfDay.isAfter(dayjsMaxDate)) {
          showToast({
            type: 'error',
            title: 'Invalid Date',
            description: `Date cannot be after ${dayjsMaxDate.format('MMMM D, YYYY')}`,
          });
          return;
        }
      }

      const dateToReturn = newDate ? newDate.hour(12).minute(0).second(0).millisecond(0).toDate() : null;

      setTimeout(() => {
        onChange(dateToReturn);
        setOpen(false);
      }, 180);
    } catch (error) {
      console.error('Error handling date change:', error);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Invalid date selection',
      });
    }
  };


  return (
    <Box className={className} display="inline-block" ref={buttonRef}>
      <ThemeAdapter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledDatePicker
            slots={{ field: IconButtonField }}
            slotProps={{
              field: {
                setOpen,
                disabled,
                iconColor,
              } as any,
              actionBar: {
                actions: ['clear', 'today'],
              },
              popper: {
                anchorEl: anchorEl,
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: document.body,
                    },
                  },
                ],
                sx: {
                  zIndex: 1500, 
                  position: 'fixed', 
                },
                container: document.body, 
              },
            }}
            value={dayjsValue}
            onChange={handleDateChange}
            disabled={disabled}
            minDate={dayjsMinDate}
            maxDate={dayjsMaxDate}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
          />
        </LocalizationProvider>
      </ThemeAdapter>
    </Box>
  );
};

export default DatePicker;