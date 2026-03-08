import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AquaPool | AquaCore Pool Maintenance',
  description: 'Professional pool operations training and compliance modules for AquaPool teams.',
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
