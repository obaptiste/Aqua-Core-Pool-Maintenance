import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aqua Core Pool Maintenance',
  description: 'Training modules for pool operations and maintenance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
