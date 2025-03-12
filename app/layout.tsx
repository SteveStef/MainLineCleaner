import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Main Line Cleaning',
  description: '',
  generator: 'Stephen Stefanatos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
