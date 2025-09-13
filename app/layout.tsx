import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Elo Arena',
  description: 'A minimalist Elo voting arena',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-10 pt-4">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

