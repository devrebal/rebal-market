'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, RefreshCw, Search } from 'lucide-react'
import type { MarketSort, Portfolio } from '@/lib/types'
import { formatPct, formatUSD, shortenAddress } from '@/lib/format'
import { AssetPill } from './asset-pill'
import { cn } from '@/lib/utils'

const CATEGORIES = ['ALL', 'TECHNOLOGY', 'ECOSYSTEM', 'SECTOR', 'STRATEGY', 'COMMUNITY'] as const
const SORTS: MarketSort[] = ['TVL', 'APR', 'VOLUME', 'ASSETS', 'NEWEST']

export function PortfolioMarkets({ portfolios }: { portfolios: Portfolio[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('ALL')
  const [sort, setSort] = useState<MarketSort>('TVL')
  const [refreshing, setRefreshing] = useState(false)
  const [visible, setVisible] = useState(6)

  const filtered = useMemo(() => {
    let list = portfolios.filter((p) => category === 'ALL' || p.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.symbol.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.holdings.some((h) => h.symbol.toLowerCase().includes(q)),
      )
    }
    const sorted = [...list]
    switch (sort) {
      case 'TVL':
        sorted.sort((a, b) => b.tvl - a.tvl)
        break
      case 'APR':
        sorted.sort((a, b) => b.feeApr - a.feeApr)
        break
      case 'VOLUME':
        sorted.sort((a, b) => b.volume24h - a.volume24h)
        break
      case 'ASSETS':
        sorted.sort((a, b) => b.holdings.length - a.holdings.length)
        break
      case 'NEWEST':
        sorted.sort((a, b) => +new Date(b.created) - +new Date(a.created))
        break
    }
    return sorted
  }, [portfolios, category, query, sort])

  const refresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 700)
  }

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search portfolio, token or address"
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {SORTS.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] transition-colors',
                  sort === s ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={refresh}
            aria-label="Refresh markets"
            className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] transition-colors',
              category === c
                ? 'rebal-gradient-bg text-white'
                : 'border border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="mt-5 hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[10px] tracking-[0.18em] text-muted-foreground">
              <th className="px-5 py-3 font-medium">PORTFOLIO</th>
              <th className="px-5 py-3 font-medium">ASSETS</th>
              <th className="px-5 py-3 text-right font-medium">TVL</th>
              <th className="px-5 py-3 text-right font-medium">24H VOLUME</th>
              <th className="px-5 py-3 text-right font-medium">FEE APR</th>
              <th className="px-5 py-3 text-right font-medium">LPS</th>
              <th className="px-5 py-3 text-right font-medium">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, visible).map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group border-b border-border/60 transition-colors last:border-0 hover:bg-muted/60"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold tracking-tight">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.symbol} · {shortenAddress(p.address)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex max-w-64 flex-wrap gap-1">
                    {p.holdings.map((h) => (
                      <AssetPill key={h.symbol} symbol={h.symbol} allocation={h.allocation} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-right tabular font-medium">{formatUSD(p.tvl, { compact: true })}</td>
                <td className="px-5 py-4 text-right tabular text-muted-foreground">
                  {formatUSD(p.volume24h, { compact: true })}
                </td>
                <td className="px-5 py-4 text-right tabular font-medium text-rebal-blue">{formatPct(p.feeApr)}</td>
                <td className="px-5 py-4 text-right tabular text-muted-foreground">{p.lps}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/portfolio/${p.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] transition-all group-hover:border-foreground group-hover:bg-foreground group-hover:text-background"
                  >
                    OPEN PORTFOLIO <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">No portfolios match your search.</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="mt-5 grid gap-3 md:hidden">
        {filtered.slice(0, visible).map((p) => (
          <Link
            key={p.id}
            href={`/portfolio/${p.id}`}
            className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/25"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold tracking-tight">{p.name}</p>
              <span className="text-xs font-medium tabular text-rebal-blue">{formatPct(p.feeApr)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.holdings.map((h) => (
                <AssetPill key={h.symbol} symbol={h.symbol} allocation={h.allocation} />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>TVL {formatUSD(p.tvl, { compact: true })}</span>
              <span>24H {formatUSD(p.volume24h, { compact: true })}</span>
              <span>{p.lps} LPs</span>
            </div>
          </Link>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setVisible((v) => v + 6)}
            className="rounded-full border border-border px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            LOAD MORE
          </button>
        </div>
      )}
    </div>
  )
}
