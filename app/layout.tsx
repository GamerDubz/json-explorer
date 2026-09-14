import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'JSON Explorer — Interactive JSON Inspector & Analyzer',
  description: 'High-performance interactive JSON viewer, tree navigator, path copier, and validator. Inspect and search complex payloads with ease.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${mono.variable} bg-neutral-950 text-neutral-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
