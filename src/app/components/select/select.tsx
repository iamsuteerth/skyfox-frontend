import React, { useEffect } from 'react';
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
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#E04B00',
    },
    text: {
      primary: '#161A1E',
      secondary: '#404348',
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins), sans-serif',
  },
  components: {
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
}) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const newValue = event.target.value;
    onChange(newValue === '' ? null : newValue as string | number);
  };

  useEffect(() => {
    console.log("Options:", options);
  }, [options]);

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
                  return <span style={{ opacity: 0.5 }}>{placeholder}</span>;
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
                disablePortal: false,
                disableScrollLock: true,
                slotProps: {
                  paper: {
                    elevation: 8,
                    style: {
                      zIndex: 9999
                    }
                  }
                }
              }}
              sx={{
                height: '48px',
                minHeight: '48px',
                '& .MuiSelect-select': {
                  padding: '12px 16px',
                },
              }}
            >
              <MenuItem value="">
                <em style={{ opacity: 0.5 }}>{placeholder}</em>
              </MenuItem>

              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                  {option.secondary_label && (
                    <span style={{ marginLeft: '8px', color: '#718096' }}>
                      | {formatTimeForDisplay(option.secondary_label)}
                    </span>
                  )}
                </MenuItem>
              ))}
            </MuiSelect>
          </MuiFormControl>
        </ThemeProvider>
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default Select;
