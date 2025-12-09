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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
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