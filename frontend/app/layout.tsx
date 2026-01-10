import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalSidebar from '@/components/layout/ConditionalSidebar';
import ConsoleFilter from '@/components/ConsoleFilter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Standard Chartered - Yaaralabs.ai',
  description: 'AI-powered customer intent intelligence platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  // Default to dark mode if no theme is saved
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    // Default to dark mode (if theme is null or 'dark')
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  // If localStorage fails, default to dark mode
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground`} suppressHydrationWarning>
        <ConsoleFilter />
        <ConditionalSidebar>
          {children}
        </ConditionalSidebar>
      </body>
    </html>
  );
}