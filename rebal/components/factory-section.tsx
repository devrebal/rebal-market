'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

const ConvergenceScene = dynamic(() => import('./three/convergence-scene'), { ssr: false })

const STAGES = ['ASSETS', 'PORTFOLIO FACTORY', 'PORTFOLIO VAULT', 'MARKET ROUTER', 'ONCHAIN MARKET']

/*
  Scroll-linked "From Assets to Markets" section. A MotionValue drives
  both the 3D convergence and the stage rail; heavy 3D is disabled for
  reduced-motion users.
*/
export function FactorySection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const clamped = useTransform(scrollYProgress, [0.15, 0.75], [0, 1])

  return (
    <section ref={ref} className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
      <div className="dark-panel relative overflow-hidden rounded-4xl">
        <div className="grid items-center gap-6 p-7 md:p-12 lg:grid-cols-2">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.22em] text-ink-foreground/60">PROTOCOL FLOW</span>
            <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              From Assets to Markets
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-ink-foreground/70">
              Multiple assets converge into a single programmable portfolio. Liquidity flows through the vault and the
              market router becomes one onchain market.
            </p>
            <ol className="mt-8 space-y-0">
              {STAGES.map((stage, i) => (
                <StageRow key={stage} label={stage} index={i} progress={clamped} />
              ))}
            </ol>
          </div>
          <div className="h-72 md:h-96 lg:h-[30rem]">
            <ConvergenceSceneWrapper progress={clamped} />
          </div>
        </div>
      </div>
    </section>
  )
}

function StageRow({ label, index, progress }: { label: string; index: number; progress: MotionValue<number> }) {
  const [active, setActive] = useState(index === 0)

  useMotionValueEvent(progress, 'change', (v) => {
    setActive(Math.min(4, Math.floor(v * 5)) >= index)
  })

  return (
    <li className="flex items-center gap-3 py-2">
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors ${active ? 'rebal-gradient-bg' : 'bg-ink-foreground/25'}`}
      />
      <span
        className={`text-xs font-semibold tracking-[0.18em] transition-colors ${
          active ? 'text-ink-foreground' : 'text-ink-foreground/40'
        }`}
      >
        {label}
      </span>
      {index < STAGES.length - 1 && <span className="ml-1 text-ink-foreground/25">↓</span>}
    </li>
  )
}

function ConvergenceSceneWrapper({ progress }: { progress: MotionValue<number> }) {
  const [enabled, setEnabled] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setEnabled(!mq.matches)
  }, [])
  if (!enabled) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-ink-border">
        <p className="text-xs tracking-[0.2em] text-ink-foreground/50">ASSETS → PORTFOLIO → MARKET</p>
      </div>
    )
  }
  return <ConvergenceScene progress={progress} />
}
