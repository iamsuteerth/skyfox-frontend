import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import type { StyleFunctionProps } from '@chakra-ui/theme-tools';

// Color mode configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Colors from your provided orange palette
const colors = {
  brand: {
    50: "#FFEEE5",
    100: "#FFD0B8",
    200: "#FFB18A",
    300: "#FF925C",
    400: "#FF742E",
    500: "#FF5500",
    600: "#CC4400",
    700: "#993300",
    800: "#662200",
    900: "#331100"
  },
  // Background colors
  bg: {
    light: "#FFFFFF",
    dark: "#1A202C",
  },
  // Text colors
  text: {
    light: "#1A202C",
    dark: "#FFFFFF",
  }
};

// Fonts configuration
const fonts = {
  heading: 'var(--font-poppins), system-ui, sans-serif',
  body: 'var(--font-poppins), system-ui, sans-serif',
};

// Custom component styles
const components = {
  // Button customization
  Button: {
    // Base style applied to all buttons
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    // Variants
    variants: {
      solid: (props: StyleFunctionProps) => ({
        bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.600',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.700',
        },
      }),
      outline: (props: StyleFunctionProps) => ({
        borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        color: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        _hover: {
          bg: props.colorMode === 'dark' ? 'rgba(255, 116, 46, 0.12)' : 'rgba(255, 85, 0, 0.12)',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'rgba(255, 116, 46, 0.24)' : 'rgba(255, 85, 0, 0.24)',
        },
      }),
      ghost: (props: StyleFunctionProps) => ({
        color: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        _hover: {
          bg: props.colorMode === 'dark' ? 'rgba(255, 116, 46, 0.12)' : 'rgba(255, 85, 0, 0.12)',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'rgba(255, 116, 46, 0.24)' : 'rgba(255, 85, 0, 0.24)',
        },
      }),
    },
  },
  // Switch customization - fixing the color scheme issue
  Switch: {
    baseStyle: (props: StyleFunctionProps) => ({
      track: {
        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.300',
        _checked: {
          bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        },
      },
      thumb: {
        bg: 'white',
      },
    }),
  },
  // Input customization
  Input: {
    variants: {
      outline: (props: StyleFunctionProps) => ({
        field: {
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.300',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.400',
          },
          _focus: {
            borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
            boxShadow: `0 0 0 1px ${props.colorMode === 'dark' 
              ? colors.brand[400] 
              : colors.brand[500]}`,
          },
        },
      }),
    },
  },
  // Heading customization
  Heading: {
    baseStyle: (props: StyleFunctionProps) => ({
      color: props.colorMode === 'dark' ? 'text.dark' : 'text.light',
    }),
  },
  // Text customization
  Text: {
    baseStyle: (props: StyleFunctionProps) => ({
      color: props.colorMode === 'dark' ? 'text.dark' : 'text.light',
    }),
  },
};

// Global styles
const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'bg.dark' : 'bg.light',
      color: props.colorMode === 'dark' ? 'text.dark' : 'text.light',
    },
  }),
};

// Create and export the theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
});

export default theme;