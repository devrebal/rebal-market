'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react'
import { TOKENS } from '@/lib/mock-data'
import { formatUSD } from '@/lib/format'
import { TokenDot } from './asset-pill'
import { cn } from '@/lib/utils'

const STEPS = ['INFO', 'ASSETS', 'ALLOCATION', 'LIQUIDITY', 'PARAMETERS', 'REVIEW']
const CATEGORIES = ['TECHNOLOGY', 'ECOSYSTEM', 'SECTOR', 'STRATEGY', 'COMMUNITY']
const TOKEN_LIST = Object.keys(TOKENS)

export function CreateWizard() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [selected, setSelected] = useState<string[]>(['WETH', 'USDC'])
  const [allocations, setAllocations] = useState<Record<string, number>>({ WETH: 50, USDC: 50 })
  const [initialLiquidity, setInitialLiquidity] = useState('')
  const [feeTier, setFeeTier] = useState('0.3%')
  const [settlement, setSettlement] = useState('USDC')
  const [search, setSearch] = useState('')

  const total = useMemo(() => Object.values(allocations).reduce((s, v) => s + v, 0), [allocations])
  const canNext = step === 2 ? total === 100 && selected.length > 0 : step === 0 ? name && symbol : true

  const toggleAsset = (t: string) => {
    setSelected((prev) => {
      if (prev.includes(t)) {
        const next = prev.filter((x) => x !== t)
        setAllocations((a) => {
          const copy = { ...a }
          delete copy[t]
          return copy
        })
        return next
      }
      if (prev.length >= 6) return prev
      setAllocations((a) => ({ ...a, [t]: 0 }))
      return [...prev, t]
    })
  }

  const normalize = () => {
    setAllocations((prev) => {
      const sum = Object.values(prev).reduce((s, v) => s + v, 0)
      if (sum <= 0) return prev
      const next: Record<string, number> = {}
      let acc = 0
      const keys = Object.keys(prev)
      keys.forEach((k, i) => {
        if (i === keys.length - 1) next[k] = 100 - acc
        else {
          next[k] = Math.round((prev[k] / sum) * 100)
          acc += next[k]
        }
      })
      return next
    })
  }

  const filteredTokens = TOKEN_LIST.filter(
    (t) => !selected.includes(t) && (t.toLowerCase().includes(search.toLowerCase()) || TOKENS[t].name.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      {/* Step rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Create Portfolio Market</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Create a permissionless multi-asset market. Define the composition, seed initial liquidity, and deploy your
          portfolio to Robinhood Chain.
        </p>
        <ol className="mt-8 space-y-1">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold',
                  i < step && 'border-transparent rebal-gradient-bg text-white',
                  i === step && 'border-foreground bg-foreground text-background',
                  i > step && 'border-border text-muted-foreground',
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={cn('text-xs font-semibold tracking-[0.14em]', i === step ? 'text-foreground' : 'text-muted-foreground')}>
                {s}
              </span>
            </li>
          ))}
        </ol>
      </aside>

      {/* Step content */}
      <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-tight">Portfolio Information</h2>
            <label className="block">
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">PORTFOLIO NAME</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. REBAL Technology"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/30"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">SYMBOL</span>
              <input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase().slice(0, 8))}
                placeholder="rTECH"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none focus:border-foreground/30"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">DESCRIPTION</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What does this portfolio represent?"
                className="mt-1.5 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/30"
              />
            </label>
            <div>
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">CATEGORY</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.12em] transition-colors',
                      category === c ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Select Assets</h2>
            <p className="mt-1 text-xs text-muted-foreground">Add up to 6 assets. Selected: {selected.length}/6</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selected.map((t) => (
                <span key={t} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                  <TokenDot symbol={t} size={8} />
                  {t}
                  <button onClick={() => toggleAsset(t)} aria-label={`Remove ${t}`}>
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets"
                className="w-full rounded-full border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div className="scrollbar-thin mt-3 max-h-64 space-y-1 overflow-y-auto">
              {filteredTokens.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleAsset(t)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                >
                  <TokenDot symbol={t} size={10} />
                  <span className="font-semibold">{t}</span>
                  <span className="text-xs text-muted-foreground">{TOKENS[t].name}</span>
                  <Plus className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Define Allocation</h2>
              <button onClick={normalize} className="text-xs font-medium text-rebal-blue hover:underline">
                Auto-normalize
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {selected.map((t) => (
                <div key={t}>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold">
                      <TokenDot symbol={t} size={10} />
                      {t}
                    </span>
                    <span className="tabular">{allocations[t] ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={allocations[t] ?? 0}
                    onChange={(e) => setAllocations((a) => ({ ...a, [t]: Number(e.target.value) }))}
                    className="mt-2 w-full accent-foreground"
                    aria-label={`${t} allocation`}
                  />
                </div>
              ))}
            </div>
            <div
              className={cn(
                'mt-6 flex items-center justify-between rounded-2xl border p-4 text-sm font-semibold',
                total === 100 ? 'border-rebal-blue/40 bg-rebal-blue/5' : 'border-destructive/40 bg-destructive/5 text-destructive',
              )}
            >
              <span>TOTAL</span>
              <span className="tabular">{total}%</span>
            </div>
            {total !== 100 && (
              <p className="mt-2 text-xs text-destructive">Allocations must equal exactly 100% to continue.</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Initial Liquidity</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The initial deposit establishes the starting composition of the portfolio vault.
            </p>
            <div className="mt-5 rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold">
                  <TokenDot symbol={settlement} size={10} />
                  {settlement}
                </span>
                <input
                  value={initialLiquidity}
                  onChange={(e) => setInitialLiquidity(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-36 bg-transparent text-right text-2xl font-semibold tabular outline-none placeholder:text-muted-foreground/40"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-1.5">
              {['10,000', '50,000', '250,000'].map((v) => (
                <button
                  key={v}
                  onClick={() => setInitialLiquidity(v.replace(',', ''))}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  ${v}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold tracking-tight">Market Parameters</h2>
            <div>
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">FEE TIER</span>
              <div className="mt-2 flex gap-1.5">
                {['0.05%', '0.3%', '1%'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFeeTier(f)}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
                      feeTier === f ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">SETTLEMENT ASSET</span>
              <div className="mt-2 flex gap-1.5">
                {['USDC', 'WETH'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSettlement(s)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
                      settlement === s ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <TokenDot symbol={s} size={8} /> {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">SLIPPAGE</span>
              <p className="mt-1 text-xs text-muted-foreground">Default slippage tolerance: AUTO (0.5%). Traders can override per swap.</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Review</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ['Portfolio', `${name || 'Unnamed'} (${symbol || '—'})`],
                ['Category', category],
                ['Assets', selected.map((t) => `${t} ${allocations[t] ?? 0}%`).join(' · ')],
                ['Initial liquidity', initialLiquidity ? formatUSD(Number(initialLiquidity)) : '—'],
                ['Fee tier', feeTier],
                ['Settlement asset', settlement],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-border/60 pb-3 last:border-0">
                  <dt className="shrink-0 text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 rounded-2xl border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              Deploying requires a wallet transaction on Robinhood Chain. Contract addresses are placeholders — see
              /lib/chains.ts. The existence of a market does not constitute endorsement or recommendation by REBAL.
            </p>
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] transition-colors hover:border-foreground/40 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> BACK
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-background transition-transform hover:scale-[1.03] disabled:opacity-40"
            >
              CONTINUE <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button className="rounded-full rebal-gradient-bg px-6 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white transition-transform hover:scale-[1.03]">
              CREATE PORTFOLIO
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
