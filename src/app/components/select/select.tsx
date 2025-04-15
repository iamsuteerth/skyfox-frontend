import React from 'react';
import { Select as MuiSelect, MenuItem, FormControl as MuiFormControl, SelectChangeEvent, ThemeProvider } from '@mui/material';
import { Box, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { createTheme } from '@mui/material/styles';
import { formatTimeForDisplay } from '@/utils/date-utils';

export interface SelectOption {
  value: string | number;
  label: string;
  secondary_label?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  label: string;
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  name?: string;
  isTimeDependent?: boolean;
  currentTimeMs?: number;
  selectedDate?: string;
  sizeOverride?: number;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#E04B00',
    },
    text: {
      primary: '#161A1E',
      secondary: '#404348',
      disabled: '#A0A4A8',
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins), sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D8DADC',
            borderRadius: '0.5rem',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5C6063',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E04B00',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '8px 14px',
        },
        icon: {
          color: '#5C6063',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-poppins), sans-serif',
          fontSize: '1rem',
          padding: '8px 16px',
          minHeight: '40px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(224, 75, 0, 0.1)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(224, 75, 0, 0.2)',
          },
          '&:hover': {
            backgroundColor: 'rgba(224, 75, 0, 0.1)',
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            color: '#A0A4A8',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
          zIndex: 9999,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          zIndex: 9999,
        },
        paper: {
          zIndex: 9999,
        },
      },
    },
  },
});

/**
 * Converts a date string and time string to milliseconds since epoch
 * @param dateStr Date string in YYYY-MM-DD format
 * @param timeStr Time string in HH:MM:SS format
 * @returns milliseconds since epoch, or null if invalid input
 */
const getTimeInMs = (dateStr: string, timeStr: string): number | null => {
  if (!dateStr || !timeStr) return null;
  try {
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    const [hours, minutes, seconds = 0] = timeStr.split(':').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.getTime();
  } catch (e) {
    console.error("Error parsing date or time:", e);
    return null;
  }
};

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  error,
  isRequired = false,
  isDisabled = false,
  isLoading = false,
  name,
  isTimeDependent = false,
  currentTimeMs,
  selectedDate,
  sizeOverride,
}) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : newValue as string | number);
  };

  const labelId = `${name || label.toLowerCase().replace(/\s+/g, '-')}-label`;

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      <FormLabel color="text.primary">{label}</FormLabel>
      <Box mb={error ? 0 : 2} width="100%">
        <ThemeProvider theme={theme}>
          <MuiFormControl
            fullWidth
            error={!!error}
            disabled={isDisabled || isLoading}
            sx={{ minWidth: '100%' }}
          >
            <MuiSelect
              labelId={labelId}
              id={name || label.toLowerCase().replace(/\s+/g, '-')}
              value={value === null ? '' : value}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => {
                if (selected === '') {
                  return <span style={{ opacity: 0.4 }}>{placeholder}</span>;
                }
                const selectedOption = options.find(option => option.value === selected);
                return selectedOption ? selectedOption.label : '';
              }}
              MenuProps={{
                
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    zIndex: 9999,
                  },
                },
                disablePortal:true,
                slotProps: {
                  paper: {
                    elevation: 8,
                    style: {
                      zIndex: 9999
                    }
                  }
                }
              }}
              sx={sizeOverride == undefined ? {
                height: '40px',
                minHeight: '40px',
              } : {
                height: `${sizeOverride}px`,
                minHeight: `${sizeOverride}px`,
              }}
              size="small"
            >
              <MenuItem value="">
                <em style={{ opacity: 0.5 }}>{placeholder}</em>
              </MenuItem>

              {options.map((option) => {
                let isOptionDisabled = false;

                if (isTimeDependent && option.secondary_label && selectedDate && currentTimeMs) {
                  const optionTimeMs = getTimeInMs(selectedDate, option.secondary_label);
                  if (optionTimeMs !== null) {
                    isOptionDisabled = optionTimeMs < currentTimeMs;
                  }
                }

                return (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={isOptionDisabled}
                    sx={{
                      opacity: isOptionDisabled ? 0.6 : 1,
                    }}
                  >
                    {option.label}
                    {option.secondary_label && (
                      <span style={{
                        marginLeft: '8px',
                        color: isOptionDisabled ? '#A0A4A8' : '#718096'
                      }}>
                        | {formatTimeForDisplay(option.secondary_label)}
                      </span>
                    )}
                  </MenuItem>
                );
              })}
            </MuiSelect>
          </MuiFormControl>
        </ThemeProvider>
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default Select;
