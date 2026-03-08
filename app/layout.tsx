import type { Metadata } from 'next';
import ThemeToggle from '@/components/theme/ThemeToggle';
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
    <html lang="en" data-theme="ocean">
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
