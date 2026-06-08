'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const onLoginPage = pathname?.startsWith('/login')

  if (onLoginPage) return <>{children}</>

  return (
    <>
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Geser semua konten ke kanan selebar sidebar */}
      <div className="pl-64 lg:pl-64"> 
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-6">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </>
  )
}

