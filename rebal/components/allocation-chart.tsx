'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { TOKENS } from '@/lib/mock-data'
import type { PortfolioHolding } from '@/lib/types'
import { formatUSD } from '@/lib/format'

/*
  Interactive donut for portfolio composition. Segments expand gently
  on hover; the center readout shows the active asset's allocation,
  value and liquidity.
*/
export function AllocationChart({
  holdings,
  tvl,
  size = 320,
}: {
  holdings: PortfolioHolding[]
  tvl: number
  size?: number
}) {
  const [active, setActive] = useState<number | null>(null)

  const segments = useMemo(() => {
    const gap = 1.2
    let angle = -90
    return holdings.map((h) => {
      const sweep = (h.allocation / 100) * 360
      const seg = { ...h, start: angle + gap / 2, end: angle + sweep - gap / 2 }
      angle += sweep
      return seg
    })
  }, [holdings])

  const cx = size / 2
  const cy = size / 2
  const rOuter = size / 2 - 8
  const rInner = rOuter * 0.66

  const arc = (start: number, end: number, rO: number, rI: number) => {
    const rad = (a: number) => (a * Math.PI) / 180
    const x1 = cx + rO * Math.cos(rad(start))
    const y1 = cy + rO * Math.sin(rad(start))
    const x2 = cx + rO * Math.cos(rad(end))
    const y2 = cy + rO * Math.sin(rad(end))
    const x3 = cx + rI * Math.cos(rad(end))
    const y3 = cy + rI * Math.sin(rad(end))
    const x4 = cx + rI * Math.cos(rad(start))
    const y4 = cy + rI * Math.sin(rad(start))
    const large = end - start > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${rO} ${rO} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rI} ${rI} 0 ${large} 0 ${x4} ${y4} Z`
  }

  const current = active !== null ? segments[active] : null

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label="Portfolio composition">
          {segments.map((seg, i) => {
            const isActive = active === i
            const grow = isActive ? 5 : 0
            return (
              <motion.path
                key={seg.symbol}
                d={arc(seg.start, seg.end, rOuter + grow, rInner)}
                fill={TOKENS[seg.symbol]?.color ?? '#6E7178'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: active === null || isActive ? 1 : 0.35, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ transformOrigin: `${cx}px ${cy}px`, cursor: 'pointer' }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            )
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {current ? (
            <>
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">{current.symbol}</span>
              <span className="mt-1 text-3xl font-semibold tabular tracking-tight">{current.allocation}%</span>
              <span className="mt-1 text-xs tabular text-muted-foreground">
                {formatUSD((tvl * current.allocation) / 100, { compact: true })} liquidity
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">COMPOSITION</span>
              <span className="mt-1 text-2xl font-semibold tracking-tight">{holdings.length} assets</span>
              <span className="mt-1 text-xs text-muted-foreground">Hover a segment</span>
            </>
          )}
        </div>
      </div>

      <ul className="w-full max-w-64 space-y-1.5">
        {segments.map((seg, i) => (
          <li
            key={seg.symbol}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
              active === i ? 'bg-muted' : ''
            }`}
          >
            <span className="flex items-center gap-2 font-medium">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: TOKENS[seg.symbol]?.color ?? '#6E7178' }}
              />
              {seg.symbol}
            </span>
            <span className="tabular text-muted-foreground">{seg.allocation}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
