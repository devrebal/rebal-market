'use client'

import { useComingSoon } from './providers'

const UTILITIES = [
  'Governance participation',
  'Liquidity incentives',
  'Portfolio creator incentives',
  'Ecosystem programs',
  'Community initiatives',
  'Protocol participation mechanisms',
]

export function RebalTokenSection() {
  const { open } = useComingSoon()
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
      <div className="dark-panel relative overflow-hidden rounded-4xl p-7 md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl rebal-gradient-bg"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.22em] text-ink-foreground/60">ECOSYSTEM TOKEN</span>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight rebal-gradient-text md:text-5xl">$REBAL</h2>
            <p className="mt-3 max-w-md leading-relaxed text-ink-foreground/70">
              The ecosystem utility token of REBAL.
            </p>
            <button
              onClick={open}
              className="mt-7 inline-flex items-center gap-2 rounded-full rebal-gradient-bg px-7 py-3.5 text-[11px] font-semibold tracking-[0.16em] text-white transition-transform hover:scale-[1.03]"
            >
              GET $REBAL
              <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-[9px] tracking-[0.18em]">COMING SOON</span>
            </button>
            <p className="mt-6 max-w-lg text-[11px] leading-relaxed text-ink-foreground/50">
              $REBAL is a protocol utility and ecosystem token and does not represent equity, ownership, or a claim on
              assets held by REBAL portfolio markets. No guaranteed yield, revenue sharing, or returns are implied.
            </p>
          </div>
          <ul className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {UTILITIES.map((u) => (
              <li
                key={u}
                className="rounded-2xl border border-ink-border px-4 py-3 text-sm text-ink-foreground/80"
              >
                {u}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
