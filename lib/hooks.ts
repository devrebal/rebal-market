'use client'

import useSWR from 'swr'
import {
  ACTIVITY,
  DEMO_POSITIONS,
  PORTFOLIOS,
  PROTOCOL_STATS,
  TVL_SERIES,
  PROTOCOL_VOLUME_SERIES,
  CREATION_SERIES,
} from './mock-data'
import type { ActivityItem, LiquidityPosition, Portfolio, ProtocolStats } from './types'

/*
  Data hooks. Every hook currently resolves from the DEMO dataset in
  /lib/mock-data. Swap the fetchers for onchain reads (wagmi/viem),
  an indexer API, or a price API without touching consuming components.
*/

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchProtocolStats(): Promise<ProtocolStats> {
  await delay(150)
  return PROTOCOL_STATS
}

async function fetchPortfolios(): Promise<Portfolio[]> {
  await delay(150)
  return PORTFOLIOS
}

async function fetchPortfolio(id: string): Promise<Portfolio | null> {
  await delay(120)
  return PORTFOLIOS.find((p) => p.id === id) ?? null
}

async function fetchActivity(portfolioId?: string): Promise<ActivityItem[]> {
  await delay(120)
  return portfolioId ? ACTIVITY.filter((a) => a.detail.toLowerCase().includes(portfolioId.split('-')[0])) : ACTIVITY
}

async function fetchPositions(address: string | null): Promise<LiquidityPosition[]> {
  await delay(120)
  if (!address) return []
  return DEMO_POSITIONS
}

export function useProtocolStats() {
  return useSWR('protocol-stats', fetchProtocolStats, { fallbackData: PROTOCOL_STATS })
}

export function usePortfolios() {
  return useSWR('portfolios', fetchPortfolios, { fallbackData: PORTFOLIOS })
}

export function usePortfolio(id: string) {
  return useSWR(['portfolio', id], () => fetchPortfolio(id), {
    fallbackData: PORTFOLIOS.find((p) => p.id === id) ?? null,
  })
}

export function usePortfolioActivity(portfolioId?: string) {
  return useSWR(['activity', portfolioId ?? 'all'], () => fetchActivity(portfolioId), {
    fallbackData: ACTIVITY,
  })
}

export function useLiquidityPositions(address: string | null) {
  return useSWR(['positions', address], () => fetchPositions(address), { fallbackData: [] })
}

export function useProtocolSeries() {
  return useSWR('protocol-series', async () => ({
    tvl: TVL_SERIES,
    volume: PROTOCOL_VOLUME_SERIES,
    creation: CREATION_SERIES,
  }), {
    fallbackData: { tvl: TVL_SERIES, volume: PROTOCOL_VOLUME_SERIES, creation: CREATION_SERIES },
  })
}
