import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PORTFOLIOS } from '@/lib/mock-data'
import { formatDate, formatPct, formatUSD, shortenAddress } from '@/lib/format'
import { AssetPill } from '@/components/asset-pill'
import { PortfolioDetailClient } from '@/components/portfolio-detail-client'

export function generateStaticParams() {
  return PORTFOLIOS.map((p) => ({ id: p.id }))
}

export default async function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const portfolio = PORTFOLIOS.find((p) => p.id === id)
  if (!portfolio) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All markets
      </Link>

      {/* Header */}
      <header className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{portfolio.name}</h1>
            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
              {portfolio.category}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{portfolio.description}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {shortenAddress(portfolio.address, 8)} · Created {formatDate(portfolio.created)} · by{' '}
            {portfolio.creator}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/liquidity?portfolio=${portfolio.id}`}
            className="rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-background transition-transform hover:scale-[1.03]"
          >
            ADD LIQUIDITY
          </Link>
          <Link
            href={`/trade?to=${portfolio.holdings[0].symbol}`}
            className="rounded-full border border-border px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] transition-colors hover:border-foreground/40"
          >
            TRADE
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'TVL', value: formatUSD(portfolio.tvl, { compact: true }) },
          { label: '24H VOLUME', value: formatUSD(portfolio.volume24h, { compact: true }) },
          { label: 'FEE APR', value: formatPct(portfolio.feeApr) },
          { label: 'LP COUNT', value: String(portfolio.lps) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">{s.label}</span>
            <p className="mt-1.5 text-xl font-semibold tabular tracking-tight md:text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {portfolio.holdings.map((h) => (
          <AssetPill key={h.symbol} symbol={h.symbol} allocation={h.allocation} />
        ))}
      </div>

      <PortfolioDetailClient portfolioId={portfolio.id} />
    </div>
  )
}
