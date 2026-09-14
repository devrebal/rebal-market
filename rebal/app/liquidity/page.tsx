import { LiquidityClient } from '@/components/liquidity-client'

export const metadata = { title: 'Liquidity — REBAL' }

export default function LiquidityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">MULTI-ASSET LIQUIDITY</span>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Liquidity Positions</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
        Provide liquidity to multiple tokens simultaneously and receive portfolio shares representing your
        proportional position. Portfolio shares are not equity in REBAL.
      </p>
      <div className="mt-8">
        <LiquidityClient />
      </div>
    </div>
  )
}
