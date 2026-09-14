import { TOKENS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function TokenDot({ symbol, size = 8 }: { symbol: string; size?: number }) {
  const color = TOKENS[symbol]?.color ?? '#6E7178'
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: color }}
    />
  )
}

export function AssetPill({
  symbol,
  allocation,
  className,
}: {
  symbol: string
  allocation?: number
  className?: string
}) {
  return (
    <span
      title={TOKENS[symbol]?.name ?? symbol}
      className={cn(
        'group/pill inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-foreground transition-colors hover:border-foreground/30',
        className,
      )}
    >
      <TokenDot symbol={symbol} />
      <span className="tracking-wide">{symbol}</span>
      {allocation !== undefined && (
        <span className="tabular text-muted-foreground transition-colors group-hover/pill:text-foreground">
          {allocation}%
        </span>
      )}
    </span>
  )
}
