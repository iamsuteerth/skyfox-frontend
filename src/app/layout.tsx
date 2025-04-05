'use client';

import { Providers } from '@/app/providers';
import { ColorModeScript } from '@chakra-ui/react';
import theme from '@/theme/index';
import { fonts } from '@/utils/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fonts.poppins.variable}>
      <head>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}