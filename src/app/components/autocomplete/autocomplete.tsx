import React from 'react';
import { Autocomplete as MuiAutocomplete, TextField, createTheme, ThemeProvider } from '@mui/material';
import { Box, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

export interface Option {
  id: string;
  label: string;
}

interface AutocompleteProps {
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
  label: string;
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#E04B00',
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins), sans-serif',
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          zIndex: 9999,
        },
      },
    },
  },
});

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Search...",
  error,
  isRequired = false
}) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      <FormLabel color="text.primary">{label}</FormLabel>
      <Box mb={error ? 0 : 2}>
        <ThemeProvider theme={theme}>
          <MuiAutocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                variant="outlined"
                error={!!error}
                fullWidth
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="No options found"
            loadingText="Loading..."
            disablePortal={false} 
          />
        </ThemeProvider>
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default Autocomplete;
