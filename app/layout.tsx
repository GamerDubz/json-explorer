import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'JSON Explorer — Interactive JSON Tree & Schema Inspector',
  description:
    'High-performance interactive JSON viewer, tree navigator, path copier, and validator. Inspect, search, and traverse complex payloads.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${mono.variable} bg-[#0A0E1A] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        {children}
      </body>
    </html>
  )
}
