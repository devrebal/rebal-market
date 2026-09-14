import Image from 'next/image'
import { cn } from '@/lib/utils'

export function RebalLogo({
  size = 28,
  withWordmark = true,
  withSubtitle = false,
  className,
}: {
  size?: number
  withWordmark?: boolean
  withSubtitle?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Image
        src="/logo.png"
        alt="REBAL logo"
        width={size}
        height={size}
        className="shrink-0"
        priority
      />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-[0.14em] text-foreground">REBAL</span>
          {withSubtitle && (
            <span className="mt-1 text-[9px] font-medium tracking-[0.22em] text-muted-foreground">
              PORTFOLIO MARKETS
            </span>
          )}
        </span>
      )}
    </span>
  )
}
