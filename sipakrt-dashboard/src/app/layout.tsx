import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: 'SIPAKRT',
  description: 'Community Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="text-slate-800">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
