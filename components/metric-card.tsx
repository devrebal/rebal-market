'use client'

import { CountUp } from './count-up'
import { cn } from '@/lib/utils'

export function MetricCell({
  label,
  value,
  format,
  accent = false,
  className,
}: {
  label: string
  value: number
  format: (v: number) => string
  accent?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1 px-5 py-4', className)}>
      <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">{label}</span>
      <CountUp
        value={value}
        format={format}
        className={cn('text-xl font-semibold tracking-tight md:text-2xl', accent && 'rebal-gradient-text')}
      />
    </div>
  )
}
