'use client'

import Link from 'next/link'
import { RebalLogo } from './rebal-logo'
import { useComingSoon } from './providers'

const COLUMNS = [
  {
    title: 'PRODUCT',
    links: [
      { label: 'Explore', href: '/' },
      { label: 'Trade', href: '/trade' },
      { label: 'Liquidity', href: '/liquidity' },
      { label: 'Create', href: '/create' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { label: 'Whitepaper', href: '/whitepaper' },
      { label: 'GitBook', href: '/gitbook' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Risk', href: '/docs#risk-considerations' },
    ],
  },
  {
    title: 'COMMUNITY',
    links: [
      { label: 'X / Twitter', href: 'https://x.com/rebal_market', external: true },
      { label: 'Discord', href: '#' },
      { label: 'GitHub', href: 'https://github.com/devrebal/rebal', external: true },
    ],
  },
]

export function Footer() {
  const { open } = useComingSoon()
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <RebalLogo size={32} />
            <p className="max-w-56 text-sm leading-relaxed text-muted-foreground">
              Portfolio Market Infrastructure
            </p>
            <button
              onClick={open}
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full rebal-gradient-bg px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-white transition-transform hover:scale-[1.03]"
            >
              GET $REBAL
              <span className="rounded-full bg-black/25 px-2 py-0.5 text-[9px] tracking-[0.18em]">COMING SOON</span>
            </button>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-foreground/80 transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-muted-foreground">
            <p>© 2026 REBAL</p>
            <p className="mt-1">Portfolio markets, rebalanced.</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-rebal-blue" />
            Robinhood Chain · Permissionless · Non-Custodial
          </span>
        </div>

        <p className="mt-8 max-w-4xl text-[11px] leading-relaxed text-muted-foreground/80">
          This website and its documentation are provided for informational purposes only and do not constitute
          financial, investment, legal, tax, or other professional advice. REBAL and $REBAL do not represent equity,
          shares, ownership interests, or guaranteed financial returns. Digital assets and decentralized finance
          involve significant risks, including the potential loss of all or part of the value of assets used within
          the protocol. Users are responsible for conducting their own research, assessing risks, complying with
          applicable laws and regulations, and determining whether interaction with REBAL is appropriate for them.
        </p>
      </div>
    </footer>
  )
}
