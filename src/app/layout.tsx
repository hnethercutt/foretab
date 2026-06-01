import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>FrontTable</header>
        <main>{children}</main>
      </body>
    </html>
  );
}
