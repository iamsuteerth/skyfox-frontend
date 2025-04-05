import type { Metadata } from 'next';
import { Providers } from './providers';
import { fonts } from '@/utils/fonts';
import './globals.css'; 
import ChakraColorModeScript from '@/app/components/ui/chakra-color-mode-script'

export const metadata: Metadata = {
  title: 'SkyFox Cinema',
  description: 'Book your favorite movies at SkyFox Cinema',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fonts.poppins.variable}>
      <head>
        <ChakraColorModeScript />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
