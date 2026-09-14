export function formatUSD(value: number, opts: { compact?: boolean; decimals?: number } = {}) {
  const { compact = false, decimals } = opts
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals ?? 2,
  }).format(value)
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)
}

export function formatPct(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`
}

export function formatToken(value: number, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value)
}

export function shortenAddress(address: string, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
