export type PortfolioCategory =
  | 'TECHNOLOGY'
  | 'ECOSYSTEM'
  | 'SECTOR'
  | 'STRATEGY'
  | 'COMMUNITY'

export interface TokenMeta {
  symbol: string
  name: string
  color: string
  price: number
}

export interface PortfolioHolding {
  symbol: string
  allocation: number // percent, sums to 100
}

export interface Portfolio {
  id: string
  name: string
  symbol: string
  description: string
  category: PortfolioCategory
  creator: string // address
  address: string
  created: string // ISO date
  tvl: number
  volume24h: number
  feeApr: number
  lps: number
  holdings: PortfolioHolding[]
  performance: number[] // 30d index series, base 100
  volumeSeries: number[] // 14d daily volume
  liquiditySeries: number[] // 14d TVL
  feeSeries: number[] // 14d daily fees
}

export interface ProtocolStats {
  tvl: number
  portfolios: number
  assets: number
  volume24h: number
  lps: number
  fees24h: number
}

export interface ActivityItem {
  id: string
  type: 'SWAP' | 'ADD_LIQUIDITY' | 'REMOVE_LIQUIDITY' | 'CREATE'
  detail: string
  value: number
  account: string
  time: string
}

export interface LiquidityPosition {
  portfolioId: string
  share: number // percent of portfolio
  positionValue: number
  feesEarned: number
}

export type MarketSort = 'TVL' | 'APR' | 'VOLUME' | 'ASSETS' | 'NEWEST'
