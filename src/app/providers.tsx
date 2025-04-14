'use client';

import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme/index';
import { AuthProvider } from '@/contexts/auth-context';
import { DialogProvider } from '@/contexts/dialog-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <DialogProvider>
          {children}
        </DialogProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}