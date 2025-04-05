'use client';

import { ColorModeScript } from '@chakra-ui/react';
import theme from '@/theme/index';

export default function ChakraColorModeScript() {
  return <ColorModeScript initialColorMode={theme.config.initialColorMode} />;
}
