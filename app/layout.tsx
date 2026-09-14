import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Archivo, Fragment_Mono } from 'next/font/google'
import './globals.css'

const sans = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['500', '600', '700'],
})

const mono = Fragment_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'JSON Explorer — structural JSON inspector',
  description:
    'Paste, upload, or drop JSON to explore it as a live structural diagram: expandable tree, path and value copying, search, and validation.',
}

export const viewport: Viewport = {
  themeColor: '#4f3ff0',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
