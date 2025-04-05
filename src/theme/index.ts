import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import type { StyleFunctionProps } from '@chakra-ui/theme-tools';

// Color mode configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Colors from the theme documentation
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
  // Semantic color system based on documentation
  primary: {
    light: "#E04B00",
    dark: "#FF7A40",
    hover: {
      light: "#CC4300",
      dark: "#FF6A2D"
    },
    active: {
      light: "#B03B00",
      dark: "#E35A1F"
    },
    focus: {
      light: "#FFD9C7",
      dark: "#A9451F"
    }
  },
  secondary: {
    light: "#FFB199",
    dark: "#A9451F",
    hover: {
      light: "#FFB699",
      dark: "#B8562E"
    },
    active: {
      light: "#E8A289",
      dark: "#98421E"
    },
    focus: {
      light: "#FFEDE6",
      dark: "#693218"
    }
  },
  success: {
    light: "#1DB881",
    dark: "#00C274"
  },
  error: {
    light: "#D42158",
    dark: "#F03E6A"
  },
  info: {
    light: "#6495ED",
    dark: "#7AA7FF"
  },
  tertiary: {
    light: "#CBA891",
    dark: "#9B7053"
  },
  background: {
    primary: {
      light: "#FFFFFF",
      dark: "#121212"
    },
    secondary: {
      light: "#F0F0F5",
      dark: "#1E1E1E"
    }
  },
  surface: {
    light: {
      light: "#D8DADC",
      dark: "#3A3A3A"
    },
    dark: {
      light: "#5C6063",
      dark: "#252525"
    }
  },
  text: {
    primary: {
      light: "#161A1E",
      dark: "#FFFFFF"
    },
    secondary: {
      light: "#404348",
      dark: "#E0E0E0"
    },
    tertiary: {
      light: "#666A6D",
      dark: "#A0A0A0"
    },
    quaternary: {
      light: "#8E9091",
      dark: "#7E7E7E"
    }
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
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      solid: (props: StyleFunctionProps) => ({
        bg: props.colorMode === 'dark' ? 'primary.dark' : 'primary.light',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'primary.hover.dark' : 'primary.hover.light',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'primary.active.dark' : 'primary.active.light',
        },
        _focus: {
          boxShadow: `0 0 0 3px ${props.colorMode === 'dark' ? colors.primary.focus.dark : colors.primary.focus.light}`,
        }
      }),
      outline: (props: StyleFunctionProps) => ({
        borderColor: props.colorMode === 'dark' ? 'primary.dark' : 'primary.light',
        color: props.colorMode === 'dark' ? 'primary.dark' : 'primary.light',
        _hover: {
          bg: props.colorMode === 'dark' 
            ? 'rgba(255, 122, 64, 0.12)' 
            : 'rgba(224, 75, 0, 0.12)',
        },
        _active: {
          bg: props.colorMode === 'dark' 
            ? 'rgba(255, 122, 64, 0.24)' 
            : 'rgba(224, 75, 0, 0.24)',
        },
        _focus: {
          boxShadow: `0 0 0 3px ${props.colorMode === 'dark' ? colors.primary.focus.dark : colors.primary.focus.light}`,
        }
      }),
      ghost: (props: StyleFunctionProps) => ({
        color: props.colorMode === 'dark' ? 'primary.dark' : 'primary.light',
        _hover: {
          bg: props.colorMode === 'dark' 
            ? 'rgba(255, 122, 64, 0.12)' 
            : 'rgba(224, 75, 0, 0.12)',
        },
        _active: {
          bg: props.colorMode === 'dark' 
            ? 'rgba(255, 122, 64, 0.24)' 
            : 'rgba(224, 75, 0, 0.24)',
        },
        _focus: {
          boxShadow: `0 0 0 3px ${props.colorMode === 'dark' ? colors.primary.focus.dark : colors.primary.focus.light}`,
        }
      }),
      secondary: (props: StyleFunctionProps) => ({
        bg: props.colorMode === 'dark' ? 'secondary.dark' : 'secondary.light',
        color: props.colorMode === 'dark' ? 'white' : 'text.primary.light',
        _hover: {
          bg: props.colorMode === 'dark' ? 'secondary.hover.dark' : 'secondary.hover.light',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'secondary.active.dark' : 'secondary.active.light',
        },
        _focus: {
          boxShadow: `0 0 0 3px ${props.colorMode === 'dark' ? colors.secondary.focus.dark : colors.secondary.focus.light}`,
        }
      }),
      success: (props: StyleFunctionProps) => ({
        bg: props.colorMode === 'dark' ? 'success.dark' : 'success.light',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'success.dark' : 'success.light',
          opacity: 0.9,
        },
        _active: {
          opacity: 0.8,
        }
      }),
      error: (props: StyleFunctionProps) => ({
        bg: props.colorMode === 'dark' ? 'error.dark' : 'error.light',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'error.dark' : 'error.light',
          opacity: 0.9,
        },
        _active: {
          opacity: 0.8,
        }
      }),
      info: (props: StyleFunctionProps) => ({
        bg: props.colorMode === 'dark' ? 'info.dark' : 'info.light',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'info.dark' : 'info.light',
          opacity: 0.9,
        },
        _active: {
          opacity: 0.8,
        }
      }),
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  
  // Switch customization
  Switch: {
    baseStyle: (props: StyleFunctionProps) => ({
      track: {
        bg: props.colorMode === 'dark' ? 'surface.dark.dark' : 'surface.light.light',
        _checked: {
          bg: props.colorMode === 'dark' ? 'primary.dark' : 'primary.light',
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
          borderColor: props.colorMode === 'dark' ? 'surface.dark.dark' : 'surface.light.light',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'surface.light.dark' : 'surface.dark.light',
          },
          _focus: {
            borderColor: props.colorMode === 'dark' ? 'primary.dark' : 'primary.light',
            boxShadow: `0 0 0 1px ${props.colorMode === 'dark' 
              ? colors.primary.dark 
              : colors.primary.light}`,
          },
          _placeholder: {
            color: props.colorMode === 'dark' ? 'text.quaternary.dark' : 'text.quaternary.light',
          }
        },
      }),
    },
    defaultProps: {
      variant: 'outline',
    }
  },
  
  // Heading customization
  Heading: {
    baseStyle: (props: StyleFunctionProps) => ({
      color: props.colorMode === 'dark' ? 'text.primary.dark' : 'text.primary.light',
    }),
  },
  
  // Text customization
  Text: {
    baseStyle: (props: StyleFunctionProps) => ({
      color: props.colorMode === 'dark' ? 'text.secondary.dark' : 'text.secondary.light',
    }),
    variants: {
      primary: (props: StyleFunctionProps) => ({
        color: props.colorMode === 'dark' ? 'text.primary.dark' : 'text.primary.light',
      }),
      secondary: (props: StyleFunctionProps) => ({
        color: props.colorMode === 'dark' ? 'text.secondary.dark' : 'text.secondary.light', 
      }),
      tertiary: (props: StyleFunctionProps) => ({
        color: props.colorMode === 'dark' ? 'text.tertiary.dark' : 'text.tertiary.light',
      }),
      quaternary: (props: StyleFunctionProps) => ({
        color: props.colorMode === 'dark' ? 'text.quaternary.dark' : 'text.quaternary.light',
      }),
    },
  },
  
  // Badge customization
  Badge: {
    variants: {
      tertiary: (props: StyleFunctionProps) => ({
        bg: props.colorMode === 'dark' ? 'tertiary.dark' : 'tertiary.light',
        color: 'white',
      }),
    },
  },
};

// Global styles
const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'background.primary.dark' : 'background.primary.light',
      color: props.colorMode === 'dark' ? 'text.primary.dark' : 'text.primary.light',
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
