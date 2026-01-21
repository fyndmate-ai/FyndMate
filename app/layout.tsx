import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Using Inter font for a clean, modern look (similar to ChatGPT/Perplexity)
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FyndMate - AI Product Discovery',
  description: 'Upload an image and discover products powered by AI',
}

// Root layout component - wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
