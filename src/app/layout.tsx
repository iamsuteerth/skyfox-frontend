import type { Metadata } from 'next';
import { Providers } from './providers';
import { fonts } from '@/utils/fonts';
import ChakraColorModeScript from './components/ui/chakra-color-mode-script';

export const metadata: Metadata = {
  title: 'SkyFox Cinema',
  description: 'Book your favorite movies at SkyFox Cinema',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fonts.poppins.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ChakraColorModeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
