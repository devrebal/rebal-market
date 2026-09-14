'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { RebalLogo } from './rebal-logo'
import { WalletButton } from './wallet-button'
import { useProtocolStats } from '@/lib/hooks'
import { formatUSD } from '@/lib/format'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'EXPLORE', href: '/' },
  { label: 'TRADE', href: '/trade' },
  { label: 'LIQUIDITY', href: '/liquidity' },
  { label: 'CREATE', href: '/create' },
  { label: 'ANALYTICS', href: '/analytics' },
]

const MENU = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Whitepaper', href: '/whitepaper' },
  { label: 'GitBook', href: '/gitbook' },
  { label: 'Risk', href: '/docs#risk-considerations' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: stats } = useProtocolStats()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" aria-label="REBAL home" className="flex items-center">
          <RebalLogo withSubtitle />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] transition-colors',
                isActive(item.href)
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          <span className="hidden items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground xl:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-rebal-blue" />
            Robinhood Chain
          </span>
          <span className="hidden text-[11px] tabular text-muted-foreground lg:block">
            TVL <span className="font-semibold text-foreground">{formatUSD(stats?.tvl ?? 0, { compact: true })}</span>
          </span>
          <WalletButton />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More resources"
              className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-44 rounded-2xl border border-border bg-card p-1.5 shadow-xl shadow-black/5">
                  {MENU.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <WalletButton compact />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full border border-border p-2"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-xl px-3 py-2.5 text-xs font-semibold tracking-[0.14em]',
                    isActive(item.href) ? 'bg-foreground text-background' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-1 border-t border-border" />
              {MENU.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
