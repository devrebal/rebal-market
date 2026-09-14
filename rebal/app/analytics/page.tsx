'use client'

import Link from 'next/link'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePortfolios, useProtocolSeries, useProtocolStats } from '@/lib/hooks'
import { TOKENS } from '@/lib/mock-data'
import { formatCompact, formatPct, formatUSD } from '@/lib/format'
import { CountUp } from '@/components/count-up'

const GRADIENT = ['#2AD4E8', '#2E5BFF', '#1B2A8F', '#8B5CF6', '#E84D8A', '#F97D3C', '#F5B83D']

function ChartTooltip({ payload, label }: { payload?: Array<{ name?: string; value: number }>; label?: string }) {
  if (!payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="mt-0.5 font-semibold tabular">
          {p.name ? `${p.name}: ` : ''}
          {formatUSD(p.value, { compact: true })}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { data: stats } = useProtocolStats()
  const { data: portfolios } = usePortfolios()
  const { data: series } = useProtocolSeries()

  const tvlData = (series?.tvl ?? []).map((v, i) => ({ day: `D${i + 1}`, value: v }))
  const volData = (series?.volume ?? []).map((v, i) => ({ day: `D${i + 1}`, value: v }))
  const creationData = (series?.creation ?? []).map((v, i) => ({ day: `D${i + 1}`, value: v }))

  const assetDistribution = Object.entries(
    (portfolios ?? []).reduce<Record<string, number>>((acc, p) => {
      const weighted = p.tvl / p.holdings.length
      p.holdings.forEach((h) => {
        acc[h.symbol] = (acc[h.symbol] ?? 0) + weighted * (h.allocation / 100)
      })
      return acc
    }, {}),
  )
    .map(([symbol, value]) => ({ name: symbol, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7)

  const top = [...(portfolios ?? [])].sort((a, b) => b.tvl - a.tvl).slice(0, 5)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">PROTOCOL</span>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">REBAL Analytics</h1>

      {/* Metrics */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'PROTOCOL TVL', value: stats?.tvl ?? 0, fmt: (v: number) => formatUSD(v, { compact: true }) },
          { label: 'PORTFOLIO MARKETS', value: stats?.portfolios ?? 0, fmt: (v: number) => String(Math.round(v)) },
          { label: 'CONNECTED ASSETS', value: stats?.assets ?? 0, fmt: (v: number) => String(Math.round(v)) },
          { label: '24H VOLUME', value: stats?.volume24h ?? 0, fmt: (v: number) => formatUSD(v, { compact: true }) },
          { label: 'TOTAL LPS', value: stats?.lps ?? 0, fmt: (v: number) => formatCompact(v) },
          { label: '24H FEES', value: stats?.fees24h ?? 0, fmt: (v: number) => formatUSD(v, { compact: true }) },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-card p-4">
            <span className="text-[9px] font-medium tracking-[0.16em] text-muted-foreground">{m.label}</span>
            <CountUp value={m.value} format={m.fmt} className="mt-1 block text-lg font-semibold tracking-tight" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">TVL OVER TIME</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tvlData}>
                <defs>
                  <linearGradient id="tvlFill" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2AD4E8" />
                    <stop offset="50%" stopColor="#2E5BFF" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="tvlArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E5BFF" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2E5BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatCompact(v)} width={48} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" stroke="url(#tvlFill)" strokeWidth={2.5} fill="url(#tvlArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">TRADING VOLUME</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatCompact(v)} width={48} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {volData.map((_, i) => (
                    <Cell key={i} fill={GRADIENT[i % GRADIENT.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">PORTFOLIO CREATION</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={creationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5DF" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={28} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">ASSET DISTRIBUTION</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-56 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={assetDistribution} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
                    {assetDistribution.map((_, i) => (
                      <Cell key={i} fill={GRADIENT[i % GRADIENT.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-32 space-y-1.5 text-xs">
              {assetDistribution.map((a, i) => (
                <li key={a.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: GRADIENT[i % GRADIENT.length] }} />
                  <span className="font-medium">{a.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Top portfolios */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">TOP PORTFOLIOS</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[10px] tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-2.5 font-medium">PORTFOLIO</th>
              <th className="px-5 py-2.5 text-right font-medium">TVL</th>
              <th className="px-5 py-2.5 text-right font-medium">24H VOLUME</th>
              <th className="px-5 py-2.5 text-right font-medium">FEE APR</th>
            </tr>
          </thead>
          <tbody>
            {top.map((p) => (
              <tr key={p.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3">
                  <Link href={`/portfolio/${p.id}`} className="font-medium transition-colors hover:text-rebal-blue">
                    {p.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-right tabular">{formatUSD(p.tvl, { compact: true })}</td>
                <td className="px-5 py-3 text-right tabular text-muted-foreground">
                  {formatUSD(p.volume24h, { compact: true })}
                </td>
                <td className="px-5 py-3 text-right tabular text-rebal-blue">{formatPct(p.feeApr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-4 text-[10px] text-muted-foreground/70">
        All analytics figures are demo values for interface preview — not verified live data.
      </p>
    </div>
  )
}
