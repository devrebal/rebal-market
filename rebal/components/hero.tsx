'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MetricCell } from './metric-card'
import { useProtocolStats } from '@/lib/hooks'
import { formatCompact, formatUSD } from '@/lib/format'

const HeroScene = dynamic(() => import('./three/hero-scene'), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
})

export function Hero() {
  const { data: stats } = useProtocolStats()

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="overflow-hidden rounded-4xl border border-border bg-card"
      >
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          {/* Left — copy */}
          <div className="flex flex-col justify-center gap-6 p-7 md:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-rebal-blue" />
              ROBINHOOD CHAIN · REBAL
            </span>
            <div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                Explore <span className="rebal-gradient-text">Portfolio</span> Markets
              </h1>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                Permissionless multi-asset liquidity markets. Trade diversified portfolios, provide liquidity across
                multiple assets, or create your own programmable market.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#markets"
                className="rounded-full bg-foreground px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-background transition-transform hover:scale-[1.03]"
              >
                EXPLORE MARKETS
              </Link>
              <Link
                href="/liquidity"
                className="rounded-full border border-border px-6 py-3 text-[11px] font-semibold tracking-[0.16em] transition-colors hover:border-foreground/40"
              >
                ADD LIQUIDITY
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground/80">
              Robinhood Chain · Permissionless · Non-Custodial
            </p>
          </div>

          {/* Right — 3D R */}
          <div className="relative min-h-64 border-t border-border lg:min-h-full lg:border-l lg:border-t-0">
            <HeroScene />
            <span className="pointer-events-none absolute bottom-4 right-5 text-[10px] font-medium tracking-[0.22em] text-muted-foreground/70">
              LIQUIDITY, REBALANCED.
            </span>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
          <MetricCell
            label="NETWORK TVL"
            value={stats?.tvl ?? 0}
            format={(v) => formatUSD(v, { compact: true })}
            className="border-b border-r border-border md:border-b-0"
          />
          <MetricCell
            label="LIVE PORTFOLIOS"
            value={stats?.portfolios ?? 0}
            format={(v) => String(Math.round(v))}
            className="border-b border-border md:border-b-0 md:border-r"
          />
          <MetricCell
            label="CONNECTED ASSETS"
            value={stats?.assets ?? 0}
            format={(v) => String(Math.round(v))}
            className="border-r border-border"
          />
          <MetricCell
            label="24H VOLUME"
            value={stats?.volume24h ?? 0}
            format={(v) => `$${formatCompact(v)}`}
          />
        </div>
      </motion.div>
      <p className="mt-3 px-2 text-[10px] text-muted-foreground/70">
        Metrics shown are demo values for interface preview — not verified live data.
      </p>
    </section>
  )
}
