import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

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
  primary: "#E04B00",
  secondary: "#FFB199",
  success: "#228B22",
  error: "#D42158",
  info: "#6495ED",
  tertiary: "#CBA891",
  background: {
    primary: "#FFFFFF",
    secondary: "#F0F0F5"
  },
  surface: {
    light: "#D8DADC",
    dark: "#5C6063"
  },
  text: {
    primary: "#161A1E",
    secondary: "#404348",
    tertiary: "#666A6D",
    quaternary: "#8E9091"
  }
};

const fonts = {
  heading: 'var(--font-poppins), system-ui, sans-serif',
  body: 'var(--font-poppins), system-ui, sans-serif',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'primary',
        color: 'white',
        _hover: {
          bg: "#CC4300",
        },
        _active: {
          bg: "#B03B00",
        },
        _focus: {
          boxShadow: `0 0 0 3px #FFD9C7`,
        }
      },
      outline: {
        borderColor: 'primary',
        color: 'primary',
        _hover: {
          bg: 'rgba(224, 75, 0, 0.12)',
        },
        _active: {
          bg: 'rgba(224, 75, 0, 0.24)',
        },
        _focus: {
          boxShadow: `0 0 0 3px #FFD9C7`,
        }
      },
      ghost: {
        color: 'primary',
        _hover: {
          bg: 'rgba(224, 75, 0, 0.12)',
        },
        _active: {
          bg: 'rgba(224, 75, 0, 0.24)',
        },
        _focus: {
          boxShadow: `0 0 0 3px #FFD9C7`,
        }
      },
      secondary: {
        bg: 'secondary',
        color: 'text.primary',
        _hover: {
          bg: "#FFB699",
        },
        _active: {
          bg: "#E8A289",
        },
        _focus: {
          boxShadow: `0 0 0 3px #FFEDE6`,
        }
      },
      success: {
        bg: 'success',
        color: 'white',
        _hover: {
          bg: 'success',
          opacity: 0.9,
        },
        _active: {
          opacity: 0.8,
        }
      },
      error: {
        bg: 'error',
        color: 'white',
        _hover: {
          bg: 'error',
          opacity: 0.9,
        },
        _active: {
          opacity: 0.8,
        }
      },
      info: {
        bg: 'info',
        color: 'white',
        _hover: {
          bg: 'info',
          opacity: 0.9,
        },
        _active: {
          opacity: 0.8,
        }
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Switch: {
    baseStyle: {
      track: {
        bg: 'surface.light',
        _checked: {
          bg: 'primary',
        },
      },
      thumb: {
        bg: 'white',
      },
    },
  },
  
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'surface.light',
          _hover: {
            borderColor: 'surface.dark',
          },
          _focus: {
            borderColor: 'primary',
            boxShadow: `0 0 0 1px #E04B00`,
          },
          _placeholder: {
            color: 'text.quaternary',
          }
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    }
  },
  Heading: {
    baseStyle: {
      color: 'text.primary',
    },
  },
  Text: {
    baseStyle: {
      color: 'text.secondary',
    },
    variants: {
      primary: {
        color: 'text.primary',
      },
      secondary: {
        color: 'text.secondary',
      },
      tertiary: {
        color: 'text.tertiary',
      },
      quaternary: {
        color: 'text.quaternary',
      },
    },
  },
  Badge: {
    variants: {
      tertiary: {
        bg: 'tertiary',
        color: 'white',
      },
    },
  },
};

const styles = {
  global: {
    body: {
      bg: 'background.primary',
      color: 'text.primary',
    },
},
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
});

export default theme;
