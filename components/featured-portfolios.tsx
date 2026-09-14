'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { usePortfolios } from '@/lib/hooks'
import { formatPct, formatUSD, shortenAddress } from '@/lib/format'
import { AssetPill } from './asset-pill'

const FEATURED = ['rebal-bluechip', 'ai-infrastructure', 'rwa-market', 'robinhood-ecosystem']

export function FeaturedPortfolios() {
  const { data: portfolios } = usePortfolios()
  const featured = (portfolios ?? []).filter((p) => FEATURED.includes(p.id))

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">FEATURED</span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Featured Portfolios</h2>
        </div>
        <Link href="#markets" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          View all markets →
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="hidden w-full text-sm md:table">
          <thead>
            <tr className="border-b border-border text-left text-[10px] tracking-[0.18em] text-muted-foreground">
              <th className="px-5 py-3.5 font-medium">PORTFOLIO</th>
              <th className="px-5 py-3.5 font-medium">ASSETS</th>
              <th className="px-5 py-3.5 text-right font-medium">TVL</th>
              <th className="px-5 py-3.5 text-right font-medium">24H VOLUME</th>
              <th className="px-5 py-3.5 text-right font-medium">FEE APR</th>
              <th className="px-5 py-3.5 text-right font-medium">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {featured.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05 }}
                className="group border-b border-border/60 transition-colors last:border-0 hover:bg-muted/60"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold tracking-tight">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.symbol} · {shortenAddress(p.address)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex max-w-72 flex-wrap gap-1">
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

        <div className="grid gap-3 p-4 md:hidden">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/portfolio/${p.id}`}
              className="rounded-2xl border border-border p-4 transition-colors hover:border-foreground/25"
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
