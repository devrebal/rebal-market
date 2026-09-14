'use client'

import { usePortfolios } from '@/lib/hooks'
import { PortfolioMarkets } from './portfolio-table'

export function MarketsSection() {
  const { data: portfolios } = usePortfolios()
  return (
    <section id="markets" className="mx-auto mt-16 max-w-7xl scroll-mt-24 px-4 md:px-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">DISCOVER</span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Portfolio Markets</h2>
        </div>
        <p className="hidden text-xs text-muted-foreground md:block">
          {portfolios?.length ?? 0} markets · demo data
        </p>
      </div>
      <div className="mt-6">
        <PortfolioMarkets portfolios={portfolios ?? []} />
      </div>
    </section>
  )
}
