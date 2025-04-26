import type { Metadata } from 'next'
import { LanguageProvider } from "@/contexts/language-context"

import './globals.css'

export const metadata: Metadata = {
  title: 'Dos Chicas',
  description: '',
  generator: 'Stephen Stefanatos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}




