'use client';

import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme/index';
import { AuthProvider } from '@/contexts/auth-context';
import { DialogProvider } from '@/contexts/dialog-context';
import { ShowsProvider } from '@/contexts/shows-contex';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <DialogProvider>
          <ShowsProvider>
            {children}
          </ShowsProvider>
        </DialogProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}