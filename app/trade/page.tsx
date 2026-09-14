import { TradePanel } from '@/components/trade-panel'

export const metadata = { title: 'Trade — REBAL' }

export default function TradePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">MARKET ROUTER</span>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Trade Portfolio Assets</h1>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Trades route through portfolio vault liquidity. Instead of isolated pairs, your swap is settled against the
            deepest multi-asset portfolio market available.
          </p>
          <div className="mt-8 rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">HOW ROUTING WORKS</h2>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                'Select input and output assets',
                'Enter amount and receive an execution quote',
                'Set slippage tolerance',
                'Confirm — the Market Router settles the trade onchain',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[10px] font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <TradePanel />
        </div>
      </div>
    </div>
  )
}
