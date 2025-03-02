import '@/styles/globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const mono = IBM_Plex_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TerminalDocs',
  description: 'A standalone documentation site for your projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 