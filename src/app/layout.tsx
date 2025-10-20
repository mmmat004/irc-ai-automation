import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'iReadCustomer Admin Dashboard',
  description: 'News automation admin panel',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}