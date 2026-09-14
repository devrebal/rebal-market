import Link from 'next/link'
import { BookOpen, FileText, ShieldAlert } from 'lucide-react'

export const metadata = { title: 'Documentation — REBAL' }

const SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      'What is REBAL? — Portfolio market infrastructure on Robinhood Chain.',
      'Portfolio Markets — permissionless multi-asset liquidity markets.',
      'Portfolio Shares — LP receipts representing proportional positions.',
      'Demo Mode — preview the interface without a wallet.',
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      'Portfolio Factory — create markets with custom composition.',
      'Portfolio Vault — manages underlying assets and LP accounting.',
      'Market Router — trade execution, routing and settlement.',
      'Fee Tiers — 0.05% / 0.3% / 1% per market.',
    ],
  },
  {
    title: 'Guides',
    items: [
      'Trading — swap assets through portfolio vault liquidity.',
      'Providing Liquidity — multi-asset deposits and auto-balancing.',
      'Creating a Portfolio — step-by-step market creation.',
      'Analytics — reading protocol metrics.',
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border">
          <BookOpen className="h-4.5 w-4.5" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
          <p className="text-sm text-muted-foreground">Portfolio market infrastructure on Robinhood Chain</p>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">{section.title.toUpperCase()}</h2>
            <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
              {section.items.map((item) => (
                <li key={item} className="px-5 py-3.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section id="risk-considerations" className="scroll-mt-24 rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-destructive">
            <ShieldAlert className="h-4 w-4" /> Risk Considerations
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Interacting with decentralized protocols involves significant risk, including smart contract
            vulnerabilities, market volatility, impermanent loss, and total loss of deposited assets. Portfolio shares
            are not equity in REBAL and do not represent ownership of the protocol. Nothing on this site constitutes
            financial, investment, legal, or tax advice. Users are responsible for their own research and for
            complying with applicable laws and regulations.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/whitepaper"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-background transition-transform hover:scale-[1.03]"
          >
            <FileText className="h-3.5 w-3.5" /> READ WHITEPAPER
          </Link>
          <Link
            href="/gitbook"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] transition-colors hover:border-foreground/40"
          >
            <BookOpen className="h-3.5 w-3.5" /> GITBOOK
          </Link>
        </div>
      </div>
    </div>
  )
}
