'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TransactionStepper({
  steps,
  current,
}: {
  steps: string[]
  current: number // 0-based index of active step; >= steps.length means complete
}) {
  return (
    <ol className="flex items-center gap-0" aria-label="Transaction progress">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors',
                  done && 'border-transparent rebal-gradient-bg text-white',
                  active && 'border-foreground bg-foreground text-background',
                  !done && !active && 'border-border text-muted-foreground',
                )}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span
                className={cn(
                  'whitespace-nowrap text-[9px] font-medium tracking-[0.14em]',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={cn('mx-2 mb-4 h-px flex-1', done ? 'bg-rebal-violet' : 'bg-border')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
