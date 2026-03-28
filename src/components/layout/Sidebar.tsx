'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Square, Grid3x3, CreditCard,
  Users, FileText, Menu, X, Building2
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/',          label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/cam',       label: 'Cam Takip',    icon: Square },
  { href: '/panel',     label: 'Panel Takip',  icon: Grid3x3 },
  { href: '/odeme',     label: 'Ödemeler',     icon: CreditCard },
  { href: '/personel',  label: 'Personel',     icon: Users },
  { href: '/cizim',     label: 'Çizim Takip',  icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border text-text"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed left-0 top-0 h-full w-64 bg-surface border-r border-border z-40 flex flex-col transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent flex items-center justify-center">
              <Building2 size={16} className="text-bg" />
            </div>
            <div>
              <div className="font-display text-xl text-text tracking-wider">MIMSA</div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest">Luzhniki</div>
            </div>
          </div>
          <div className="mt-3 font-mono text-[10px] text-muted border border-border px-2 py-1 text-center">
            MA21922 — ENKA
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 transition-all duration-150 group',
                  active
                    ? 'bg-accent/10 border-l-2 border-accent text-accent'
                    : 'text-muted hover:text-text hover:bg-surface2 border-l-2 border-transparent'
                )}
              >
                <Icon size={16} className={active ? 'text-accent' : 'text-muted group-hover:text-text'} />
                <span className="font-mono text-xs tracking-wide uppercase">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="font-mono text-[10px] text-muted text-center leading-relaxed">
            <div>15 dk'da bir güncellenir</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
              <span className="text-accent">Canlı</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
