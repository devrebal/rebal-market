'use client'

import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePortfolio, usePortfolioActivity } from '@/lib/hooks'
import { TOKENS } from '@/lib/mock-data'
import { formatCompact, formatUSD } from '@/lib/format'
import { AllocationChart } from './allocation-chart'
import { cn } from '@/lib/utils'

const TABS = [
  'MARKET DEPTH',
  'TRADING ACTIVITY',
  'PORTFOLIO PERFORMANCE',
  'FEE ACTIVITY',
  'LIQUIDITY HISTORY',
  'TRANSACTION HISTORY',
] as const

const GRADIENT_STOPS = ['#2AD4E8', '#2E5BFF', '#8B5CF6', '#E84D8A', '#F97D3C']

function ChartTooltip({ payload, label }: { payload?: Array<{ value: number }>; label?: string }) {
  if (!payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold tabular">{formatUSD(payload[0].value, { compact: true })}</p>
    </div>
  )
}

export function PortfolioDetailClient({ portfolioId }: { portfolioId: string }) {
  const { data: portfolio } = usePortfolio(portfolioId)
  const { data: activity } = usePortfolioActivity()
  const [tab, setTab] = useState<(typeof TABS)[number]>('PORTFOLIO PERFORMANCE')

  if (!portfolio) return null

  const perfData = portfolio.performance.map((v, i) => ({ day: `D${i + 1}`, value: v }))
  const volData = portfolio.volumeSeries.map((v, i) => ({ day: `D${i + 1}`, value: v }))
  const liqData = portfolio.liquiditySeries.map((v, i) => ({ day: `D${i + 1}`, value: v }))
  const feeData = portfolio.feeSeries.map((v, i) => ({ day: `D${i + 1}`, value: v }))

  // Synthetic depth ladder derived from TVL
  const depthData = Array.from({ length: 12 }, (_, i) => {
    const offset = (i - 6) * 0.4
    return {
      price: offset,
      bid: i < 6 ? Math.round(portfolio.tvl * 0.012 * (6 - i) * (0.7 + (i % 3) * 0.2)) : 0,
      ask: i >= 6 ? Math.round(portfolio.tvl * 0.012 * (i - 5) * (0.7 + (i % 3) * 0.2)) : 0,
    }
  })

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Composition */}
      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">PORTFOLIO COMPOSITION</h2>
        <div className="mt-6 flex justify-center">
          <AllocationChart holdings={portfolio.holdings} tvl={portfolio.tvl} size={280} />
        </div>
      </section>

      {/* Charts + activity */}
      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="scrollbar-thin flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'whitespace-nowrap rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.12em] transition-colors',
                tab === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 h-64">
          {tab === 'MARKET DEPTH' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="price" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatCompact(v)} width={44} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="bid" fill="#2AD4E8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="ask" fill="#E84D8A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {tab === 'TRADING ACTIVITY' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatCompact(v)} width={44} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {volData.map((_, i) => (
                    <Cell key={i} fill={GRADIENT_STOPS[i % GRADIENT_STOPS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {tab === 'PORTFOLIO PERFORMANCE' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perfData}>
                <defs>
                  <linearGradient id="perfFill" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2AD4E8" />
                    <stop offset="45%" stopColor="#2E5BFF" />
                    <stop offset="70%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#E84D8A" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={40} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" stroke="url(#perfFill)" strokeWidth={2.5} fill="url(#perfFill)" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {tab === 'FEE ACTIVITY' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeData}>
                <defs>
                  <linearGradient id="feeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatCompact(v)} width={44} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="url(#feeFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {tab === 'LIQUIDITY HISTORY' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liqData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatCompact(v)} width={48} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#2E5BFF" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
          {tab === 'TRANSACTION HISTORY' && (
            <div className="scrollbar-thin h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                    <th className="py-2 font-medium">TYPE</th>
                    <th className="py-2 font-medium">DETAIL</th>
                    <th className="py-2 text-right font-medium">VALUE</th>
                    <th className="py-2 text-right font-medium">TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {(activity ?? []).map((a) => (
                    <tr key={a.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5">
                        <span className="rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold tracking-widest">
                          {a.type}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">{a.detail}</td>
                      <td className="py-2.5 text-right tabular text-xs">{formatUSD(a.value, { compact: true })}</td>
                      <td className="py-2.5 text-right text-xs text-muted-foreground">{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/70">
          Chart data is demo data for interface preview — not verified live data.
        </p>
      </section>
    </div>
  )
}
