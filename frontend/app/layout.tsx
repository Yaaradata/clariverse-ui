import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalSidebar from '@/components/layout/ConditionalSidebar';
import ConsoleFilter from '@/components/ConsoleFilter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clariverse - Yaaralabs.ai',
  description: 'AI-powered customer intent intelligence platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <ConsoleFilter />
        <ConditionalSidebar>
          {children}
        </ConditionalSidebar>
      </body>
    </html>
  );
}