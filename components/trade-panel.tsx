'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ChevronDown, Settings2 } from 'lucide-react'
import { PORTFOLIOS, TOKENS } from '@/lib/mock-data'
import { formatPct, formatToken, formatUSD } from '@/lib/format'
import { TokenDot } from './asset-pill'
import { cn } from '@/lib/utils'

const SLIPPAGE_OPTIONS = ['AUTO', '0.1', '0.5', '1'] as const

const TOKEN_LIST = Object.keys(TOKENS)

export function TradePanel() {
  const [from, setFrom] = useState('WETH')
  const [to, setTo] = useState('LINK')
  const [amount, setAmount] = useState('1')
  const [slippage, setSlippage] = useState<string>('AUTO')
  const [customSlippage, setCustomSlippage] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [picking, setPicking] = useState<'from' | 'to' | null>(null)

  const parsed = Number(amount) || 0
  const priceFrom = TOKENS[from]?.price ?? 0
  const priceTo = TOKENS[to]?.price ?? 0
  const usdIn = parsed * priceFrom
  const estimatedOut = priceFrom > 0 ? (parsed * priceFrom) / priceTo : 0

  const route = useMemo(() => {
    const vault = PORTFOLIOS.find((p) => p.holdings.some((h) => h.symbol === to)) ?? PORTFOLIOS[0]
    return [from, `${vault.name.toUpperCase()} VAULT`, to]
  }, [from, to])

  const priceImpact = usdIn > 50_000 ? 0.42 : usdIn > 10_000 ? 0.11 : 0.03
  const minReceived = estimatedOut * (1 - (slippage === 'AUTO' ? 0.5 : Number(customSlippage || 0.5)) / 100)

  const swapDirection = () => {
    setFrom(to)
    setTo(from)
  }

  const tokenSelect = (side: 'from' | 'to') => (
    <div className="relative">
      <button
        onClick={() => setPicking(picking === side ? null : side)}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold transition-colors hover:border-foreground/30"
      >
        <TokenDot symbol={side === 'from' ? from : to} size={10} />
        {side === 'from' ? from : to}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {picking === side && (
        <div className="scrollbar-thin absolute right-0 z-30 mt-2 max-h-64 w-44 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl">
          {TOKEN_LIST.filter((t) => t !== (side === 'from' ? to : from)).map((t) => (
            <button
              key={t}
              onClick={() => {
                side === 'from' ? setFrom(t) : setTo(t)
                setPicking(null)
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <TokenDot symbol={t} size={10} />
              {t}
              <span className="ml-auto text-[10px] tabular text-muted-foreground">${formatToken(TOKENS[t].price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Swap</h2>
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          aria-label="Slippage settings"
          className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {settingsOpen && (
        <div className="mt-3 rounded-2xl border border-border bg-background p-3">
          <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">SLIPPAGE TOLERANCE</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SLIPPAGE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSlippage(s)
                  setCustomSlippage('')
                }}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  slippage === s && !customSlippage
                    ? 'bg-foreground text-background'
                    : 'border border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {s === 'AUTO' ? 'AUTO' : `${s}%`}
              </button>
            ))}
            <input
              value={customSlippage}
              onChange={(e) => {
                setCustomSlippage(e.target.value.replace(/[^0-9.]/g, ''))
                setSlippage('CUSTOM')
              }}
              placeholder="CUSTOM"
              className="w-20 rounded-full border border-border bg-transparent px-3 py-1 text-center text-xs outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      )}

      {/* FROM */}
      <div className="mt-4 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">FROM</span>
          {tokenSelect('from')}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            inputMode="decimal"
            className="w-full bg-transparent text-3xl font-semibold tabular outline-none placeholder:text-muted-foreground/40"
          />
          <span className="shrink-0 text-xs tabular text-muted-foreground">≈ {formatUSD(usdIn)}</span>
        </div>
      </div>

      <div className="relative z-10 -my-2.5 flex justify-center">
        <button
          onClick={swapDirection}
          aria-label="Swap direction"
          className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition-all hover:rotate-180 hover:text-foreground"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>

      {/* TO */}
      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">TO</span>
          {tokenSelect('to')}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <span className="w-full truncate text-3xl font-semibold tabular">{formatToken(estimatedOut, 4)}</span>
          <span className="shrink-0 text-xs tabular text-muted-foreground">
            ≈ {formatUSD(estimatedOut * priceTo)}
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="mt-4 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">ROUTE</span>
          <span className="rounded-full rebal-gradient-bg px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] text-white">
            BEST ROUTE
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-medium">
          {route.map((hop, i) => (
            <span key={hop} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground">→</span>}
              <span
                className={cn(
                  'rounded-full px-2.5 py-1',
                  i === 1 ? 'border border-rebal-violet/40 bg-rebal-violet/10 text-rebal-violet' : 'border border-border',
                )}
              >
                {hop}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Details */}
      <dl className="mt-4 space-y-1.5 text-xs">
        {[
          ['Price impact', formatPct(priceImpact, 2)],
          ['Minimum received', `${formatToken(minReceived, 4)} ${to}`],
          ['Slippage', slippage === 'AUTO' ? 'AUTO (0.5%)' : `${customSlippage || slippage}%`],
          ['Network fee', '≈ $0.42'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="tabular font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <button className="mt-5 w-full rounded-2xl bg-foreground py-3.5 text-xs font-semibold tracking-[0.18em] text-background transition-transform hover:scale-[1.01]">
        SWAP
      </button>
      <p className="mt-3 text-center text-[10px] text-muted-foreground/70">
        Demo interface — routing and quotes are illustrative. Contract addresses are placeholders in /lib/chains.ts.
      </p>
    </div>
  )
}
