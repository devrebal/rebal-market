'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ArrowUpRight } from 'lucide-react'
import { PORTFOLIOS, TOKENS } from '@/lib/mock-data'
import { formatPct, formatToken, formatUSD, shortenAddress } from '@/lib/format'
import { useLiquidityPositions } from '@/lib/hooks'
import { useDemoWallet } from './providers'
import { AssetPill, TokenDot } from './asset-pill'
import { TransactionStepper } from './transaction-stepper'
import { cn } from '@/lib/utils'

const STEPS = ['CONNECT', 'APPROVE', 'DEPOSIT', 'RECEIVE SHARES']

export function LiquidityClient() {
  const { address, isConnected } = useAccount()
  const { demoAddress } = useDemoWallet()
  const wallet = demoAddress ?? address ?? null
  const { data: positions } = useLiquidityPositions(wallet)

  const [portfolioId, setPortfolioId] = useState(PORTFOLIOS[0].id)
  const portfolio = PORTFOLIOS.find((p) => p.id === portfolioId)!
  const [amounts, setAmounts] = useState<Record<string, string>>({})
  const [anchor, setAnchor] = useState<{ symbol: string; amount: number } | null>(null)
  const [step, setStep] = useState(0)

  const connected = isConnected || !!demoAddress

  /*
    Auto-balance deposit: entering one asset scales every other input to
    match the portfolio's target allocation by USD value.
  */
  const setBalanced = (symbol: string, raw: string) => {
    const value = Number(raw.replace(/[^0-9.]/g, '')) || 0
    setAmounts((prev) => ({ ...prev, [symbol]: raw }))
    setAnchor({ symbol, amount: value })
    if (value > 0) {
      const usd = value * (TOKENS[symbol]?.price ?? 0)
      const next: Record<string, string> = { [symbol]: raw }
      for (const h of portfolio.holdings) {
        if (h.symbol === symbol) continue
        const target = (usd * h.allocation) / portfolio.holdings.find((x) => x.symbol === symbol)!.allocation
        next[h.symbol] = formatToken(target / (TOKENS[h.symbol]?.price ?? 1), 4)
      }
      setAmounts(next)
    }
  }

  const deposit = useMemo(() => {
    return portfolio.holdings.map((h) => {
      const amt = Number(amounts[h.symbol] || 0)
      return { symbol: h.symbol, amount: amt, usd: amt * (TOKENS[h.symbol]?.price ?? 0) }
    })
  }, [amounts, portfolio])

  const totalUsd = deposit.reduce((s, d) => s + d.usd, 0)
  const expectedShare = totalUsd > 0 ? (totalUsd / (portfolio.tvl + totalUsd)) * 100 : 0

  const totalLiquidity = (positions ?? []).reduce((s, p) => s + p.positionValue, 0)
  const totalFees = (positions ?? []).reduce((s, p) => s + p.feesEarned, 0)

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
      {/* Multi-asset deposit */}
      <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <h2 className="text-sm font-semibold tracking-tight">Add Liquidity</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Deposit multiple assets simultaneously, distributed according to portfolio composition.
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {PORTFOLIOS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPortfolioId(p.id)
                setAmounts({})
                setAnchor(null)
              }}
              className={cn(
                'rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] transition-colors',
                portfolioId === p.id
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {p.name.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {portfolio.holdings.map((h) => (
            <div key={h.symbol} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3.5">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <TokenDot symbol={h.symbol} size={10} />
                {h.symbol}
              </span>
              <span className="text-[10px] tabular text-muted-foreground">{h.allocation}%</span>
              <input
                value={amounts[h.symbol] ?? ''}
                onChange={(e) => setBalanced(h.symbol, e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
                className="ml-auto w-32 bg-transparent text-right text-lg font-semibold tabular outline-none placeholder:text-muted-foreground/40"
              />
            </div>
          ))}
        </div>

        {/* Deposit breakdown */}
        <div className="mt-4 rounded-2xl border border-border bg-background p-4">
          <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">YOUR DEPOSIT</span>
          <ul className="mt-2 space-y-1 text-sm">
            {deposit.map((d) => (
              <li key={d.symbol} className="flex justify-between">
                <span className="text-muted-foreground">{d.symbol}</span>
                <span className="tabular">{totalUsd > 0 ? formatUSD(d.usd) : '$0.00'}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold">
            <span>TOTAL</span>
            <span className="tabular">{formatUSD(totalUsd)}</span>
          </div>
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-muted-foreground">Expected portfolio share</span>
            <span className="tabular font-medium rebal-gradient-text">{formatPct(expectedShare, 3)}</span>
          </div>
        </div>

        <div className="mt-4">
          <TransactionStepper steps={STEPS} current={connected ? step : 0} />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            disabled={!connected || step > 0}
            onClick={() => setStep(1)}
            className="flex-1 rounded-2xl border border-border py-3 text-xs font-semibold tracking-[0.16em] transition-colors hover:border-foreground/40 disabled:opacity-40"
          >
            APPROVE ASSETS
          </button>
          <button
            disabled={!connected || totalUsd <= 0}
            onClick={() => setStep(3)}
            className="flex-1 rounded-2xl bg-foreground py-3 text-xs font-semibold tracking-[0.16em] text-background transition-transform hover:scale-[1.01] disabled:opacity-40"
          >
            ADD LIQUIDITY
          </button>
        </div>
        {!connected && (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Connect a wallet (or use demo mode) to simulate the deposit flow.
          </p>
        )}
      </section>

      {/* My liquidity */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'TOTAL LIQUIDITY', value: formatUSD(totalLiquidity, { compact: true }) },
            { label: 'CLAIMABLE FEES', value: formatUSD(totalFees) },
            { label: 'PORTFOLIO POSITIONS', value: String(positions?.length ?? 0) },
            { label: '24H FEES', value: formatUSD(totalFees * 0.04) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <span className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground">{s.label}</span>
              <p className="mt-1 text-lg font-semibold tabular tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold tracking-tight">My Liquidity</h2>
            {demoAddress && (
              <span className="mt-0.5 inline-block rounded-full border border-border px-2 py-0.5 text-[9px] tracking-[0.16em] text-muted-foreground">
                DEMO POSITIONS · {shortenAddress(demoAddress)}
              </span>
            )}
          </div>
          {positions && positions.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] tracking-[0.14em] text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium">PORTFOLIO</th>
                  <th className="px-5 py-2.5 text-right font-medium">SHARE</th>
                  <th className="px-5 py-2.5 text-right font-medium">VALUE</th>
                  <th className="px-5 py-2.5 text-right font-medium">FEES</th>
                  <th className="px-5 py-2.5 text-right font-medium">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => {
                  const p = PORTFOLIOS.find((x) => x.id === pos.portfolioId)!
                  return (
                    <tr key={pos.portfolioId} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3.5">
                        <p className="font-medium">{p.name}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.holdings.slice(0, 3).map((h) => (
                            <AssetPill key={h.symbol} symbol={h.symbol} />
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right tabular text-xs">{formatPct(pos.share, 3)}</td>
                      <td className="px-5 py-3.5 text-right tabular">{formatUSD(pos.positionValue, { compact: true })}</td>
                      <td className="px-5 py-3.5 text-right tabular text-xs text-rebal-blue">{formatUSD(pos.feesEarned)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/portfolio/${p.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          VIEW <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No liquidity positions yet. Add liquidity to a portfolio market to receive portfolio shares.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
