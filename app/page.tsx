import { Hero } from '@/components/hero'
import { FeaturedPortfolios } from '@/components/featured-portfolios'
import { MarketsSection } from '@/components/markets-section'
import { FactorySection } from '@/components/factory-section'
import { RebalTokenSection } from '@/components/rebal-token-section'

const ARCHITECTURE = [
  {
    title: 'PORTFOLIO FACTORY',
    body: 'Infrastructure used to create new portfolio markets. Creators define portfolio assets, initial asset weights, initial liquidity, portfolio parameters, and supported market configuration.',
  },
  {
    title: 'PORTFOLIO VAULT',
    body: 'Each portfolio operates through a dedicated liquidity structure. The vault manages underlying assets, maintains portfolio composition, and accounts for LP shares.',
  },
  {
    title: 'MARKET ROUTER',
    body: 'Execution layer for portfolio trading — asset selection, trade execution, liquidity routing, slippage controls, and transaction settlement.',
  },
  {
    title: 'PORTFOLIO SHARES',
    body: 'LPs receive portfolio shares representing their proportional liquidity position. Portfolio shares are not equity in REBAL and do not represent ownership of the protocol.',
  },
]

export default function Home() {
  return (
    <div className="pb-4">
      <Hero />
      <FeaturedPortfolios />
      <MarketsSection />
      <FactorySection />

      {/* Protocol architecture */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">INFRASTRUCTURE</span>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Protocol Architecture</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ARCHITECTURE.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
            >
              <span className="h-1 w-8 rounded-full rebal-gradient-bg" />
              <h3 className="mt-4 text-xs font-semibold tracking-[0.18em]">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <RebalTokenSection />
    </div>
  )
}
