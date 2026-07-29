import './globals.css';
import { DM_Sans } from 'next/font/google';
import { LoadingProvider } from '@/context/loading-context';
import { AuthProvider } from '@/context/auth-context';
import { LoadingSpinner } from '@/components/loading-spinner';
import Header from '@/components/header';

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
          <AuthProvider>
            <header><Header /></header>
            <LoadingSpinner />
            { children }
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
