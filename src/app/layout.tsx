import './globals.css';
import { DM_Sans } from 'next/font/google';
import { LoadingProvider } from '@/context/loading-context';
import { LoadingSpinner } from '@/components/loading-spinner';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable}`}>
        <LoadingProvider>
        <header>Foretab</header>
          <LoadingSpinner />
          { children }
        </LoadingProvider>
      </body>
    </html>
  );
}
