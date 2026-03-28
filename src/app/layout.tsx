import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'MIMSA — Luzhniki Proje Takip',
  description: 'Enka Luzhniki Collection Cephe Projesi Yönetim Sistemi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-bg text-text min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 min-h-screen grid-bg">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
