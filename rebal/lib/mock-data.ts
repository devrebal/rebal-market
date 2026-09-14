import type { ActivityItem, Portfolio, ProtocolStats, TokenMeta } from './types'

/* ============================================================
   DEMO DATA
   ------------------------------------------------------------
   All values in this file are DEMO values for interface
   development only. They are not verified live data and must
   be replaced by the adapters in /lib/api (onchain reads,
   indexer API, price API) once available.
   ============================================================ */

export const TOKENS: Record<string, TokenMeta> = {
  WETH: { symbol: 'WETH', name: 'Wrapped Ether', color: '#6E7BF2', price: 3120.4 },
  USDC: { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', price: 1.0 },
  LINK: { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA', price: 18.7 },
  UNI: { symbol: 'UNI', name: 'Uniswap', color: '#FF007A', price: 9.4 },
  AAVE: { symbol: 'AAVE', name: 'Aave', color: '#B6509E', price: 142.2 },
  RNDR: { symbol: 'RNDR', name: 'Render', color: '#E4461F', price: 7.8 },
  TAO: { symbol: 'TAO', name: 'Bittensor', color: '#0B0D12', price: 412.0 },
  FET: { symbol: 'FET', name: 'Artificial Superintelligence', color: '#1D4ED8', price: 1.32 },
  SPY: { symbol: 'SPY', name: 'S&P 500 Token', color: '#0F766E', price: 562.1 },
  QQQ: { symbol: 'QQQ', name: 'Nasdaq 100 Token', color: '#7C3AED', price: 486.9 },
  GOLD: { symbol: 'GOLD', name: 'Tokenized Gold', color: '#D4A017', price: 2412.0 },
  RDL: { symbol: 'RDL', name: 'Robinhood Demo Ledger', color: '#2AD4E8', price: 0.94 },
  HODL: { symbol: 'HODL', name: 'Hood Index Demo', color: '#8B5CF6', price: 4.51 },
  ARB: { symbol: 'ARB', name: 'Arbitrum', color: '#28A0F0', price: 0.86 },
  DOT: { symbol: 'DOT', name: 'Polkadot', color: '#E6007A', price: 6.9 },
  CRV: { symbol: 'CRV', name: 'Curve DAO', color: '#FDCE47', price: 0.42 },
}

function series(base: number, drift: number, vol: number, n: number, seed: number) {
  const out: number[] = []
  let v = base
  let s = seed
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280
    const r = s / 233280 - 0.5
    v = v * (1 + drift + r * vol)
    out.push(Number(v.toFixed(2)))
  }
  return out
}

function perf(seed: number) {
  return series(100, 0.004, 0.03, 30, seed)
}

export const PORTFOLIOS: Portfolio[] = [
  {
    id: 'rebal-bluechip',
    name: 'REBAL Bluechip',
    symbol: 'rBLUE',
    description: 'Core large-cap digital assets with a stable settlement base.',
    category: 'STRATEGY',
    creator: '0x8f2a…4c1d',
    address: '0x9ab4f3F2A16c0dE4c81b7a52D3f0eE9a1B7c4D21',
    created: '2026-07-14',
    tvl: 2_480_000,
    volume24h: 820_000,
    feeApr: 18.4,
    lps: 342,
    holdings: [
      { symbol: 'WETH', allocation: 30 },
      { symbol: 'USDC', allocation: 25 },
      { symbol: 'LINK', allocation: 20 },
      { symbol: 'UNI', allocation: 15 },
      { symbol: 'AAVE', allocation: 10 },
    ],
    performance: perf(11),
    volumeSeries: series(680_000, 0.01, 0.25, 14, 21),
    liquiditySeries: series(2_300_000, 0.003, 0.01, 14, 31),
    feeSeries: series(3_100, 0.008, 0.2, 14, 41),
  },
  {
    id: 'ai-infrastructure',
    name: 'AI Infrastructure',
    symbol: 'rAI',
    description: 'Compute, inference and agent economy assets.',
    category: 'TECHNOLOGY',
    creator: '0x41c9…9a02',
    address: '0x3Cf81bA7E42d9A0c5f16D8b3a9E0F7C2D4B6A8E0',
    created: '2026-08-02',
    tvl: 1_820_000,
    volume24h: 611_000,
    feeApr: 24.7,
    lps: 218,
    holdings: [
      { symbol: 'WETH', allocation: 25 },
      { symbol: 'RNDR', allocation: 25 },
      { symbol: 'TAO', allocation: 20 },
      { symbol: 'FET', allocation: 15 },
      { symbol: 'LINK', allocation: 15 },
    ],
    performance: perf(23),
    volumeSeries: series(520_000, 0.012, 0.3, 14, 52),
    liquiditySeries: series(1_700_000, 0.004, 0.015, 14, 62),
    feeSeries: series(2_600, 0.01, 0.22, 14, 72),
  },
  {
    id: 'rwa-market',
    name: 'RWA Market',
    symbol: 'rRWA',
    description: 'Tokenized equities, index and commodity exposure.',
    category: 'SECTOR',
    creator: '0xd7e1…33b8',
    address: '0x7A1d9C4F2B8e6E3a1D5c0B7f9E2A4C6D8B0F3E5A',
    created: '2026-08-19',
    tvl: 1_340_000,
    volume24h: 288_000,
    feeApr: 12.9,
    lps: 164,
    holdings: [
      { symbol: 'WETH', allocation: 20 },
      { symbol: 'USDC', allocation: 30 },
      { symbol: 'SPY', allocation: 20 },
      { symbol: 'QQQ', allocation: 15 },
      { symbol: 'GOLD', allocation: 15 },
    ],
    performance: perf(37),
    volumeSeries: series(260_000, 0.006, 0.2, 14, 83),
    liquiditySeries: series(1_250_000, 0.002, 0.008, 14, 93),
    feeSeries: series(1_400, 0.005, 0.18, 14, 103),
  },
  {
    id: 'robinhood-ecosystem',
    name: 'Robinhood Ecosystem',
    symbol: 'rHOOD',
    description: 'Demo assets representing the Robinhood Chain ecosystem.',
    category: 'ECOSYSTEM',
    creator: '0x2b8f…71aa',
    address: '0xB2e4D8f0A6C1937b5E1d2F8a3C7B9E0D4F6A2C8E',
    created: '2026-09-01',
    tvl: 986_000,
    volume24h: 402_000,
    feeApr: 31.2,
    lps: 121,
    holdings: [
      { symbol: 'RDL', allocation: 35 },
      { symbol: 'HODL', allocation: 25 },
      { symbol: 'WETH', allocation: 20 },
      { symbol: 'USDC', allocation: 20 },
    ],
    performance: perf(53),
    volumeSeries: series(380_000, 0.015, 0.32, 14, 113),
    liquiditySeries: series(900_000, 0.006, 0.02, 14, 123),
    feeSeries: series(2_100, 0.012, 0.25, 14, 133),
  },
  {
    id: 'defi-core',
    name: 'DeFi Core',
    symbol: 'rDEFI',
    description: 'Foundational DeFi bluechips across lending and DEX infrastructure.',
    category: 'TECHNOLOGY',
    creator: '0x9c3d…e5f1',
    address: '0x4E8a2C6F0B9D1E3A7C5F8B2D0E4A6C8F1B3D5E7A',
    created: '2026-06-28',
    tvl: 1_610_000,
    volume24h: 344_000,
    feeApr: 16.8,
    lps: 259,
    holdings: [
      { symbol: 'WETH', allocation: 35 },
      { symbol: 'AAVE', allocation: 25 },
      { symbol: 'UNI', allocation: 20 },
      { symbol: 'CRV', allocation: 10 },
      { symbol: 'USDC', allocation: 10 },
    ],
    performance: perf(67),
    volumeSeries: series(310_000, 0.007, 0.22, 14, 143),
    liquiditySeries: series(1_500_000, 0.003, 0.012, 14, 153),
    feeSeries: series(1_800, 0.006, 0.2, 14, 163),
  },
  {
    id: 'l1-leaders',
    name: 'L1 Leaders',
    symbol: 'rL1',
    description: 'Diversified exposure to major layer-one networks.',
    category: 'SECTOR',
    creator: '0x5f8a…c2d4',
    address: '0x8C2F6A0E4B8D2F6A1C9E5B3D7F0A4C8E2B6D0F4A',
    created: '2026-07-30',
    tvl: 1_120_000,
    volume24h: 197_000,
    feeApr: 14.2,
    lps: 148,
    holdings: [
      { symbol: 'WETH', allocation: 40 },
      { symbol: 'DOT', allocation: 20 },
      { symbol: 'ARB', allocation: 20 },
      { symbol: 'USDC', allocation: 20 },
    ],
    performance: perf(79),
    volumeSeries: series(180_000, 0.005, 0.24, 14, 173),
    liquiditySeries: series(1_050_000, 0.002, 0.01, 14, 183),
    feeSeries: series(1_100, 0.004, 0.19, 14, 193),
  },
  {
    id: 'stable-yield',
    name: 'Stable Yield',
    symbol: 'rSTAB',
    description: 'Stable-dominant portfolio designed for lower-volatility liquidity.',
    category: 'STRATEGY',
    creator: '0xa1b2…8e9f',
    address: '0x6D4B8F2A0C6E9D3B1F7A5C8E0B2D4F6A8C1E3B5D',
    created: '2026-08-11',
    tvl: 2_050_000,
    volume24h: 156_000,
    feeApr: 8.6,
    lps: 301,
    holdings: [
      { symbol: 'USDC', allocation: 55 },
      { symbol: 'WETH', allocation: 20 },
      { symbol: 'LINK', allocation: 15 },
      { symbol: 'AAVE', allocation: 10 },
    ],
    performance: perf(97),
    volumeSeries: series(140_000, 0.004, 0.15, 14, 203),
    liquiditySeries: series(1_950_000, 0.002, 0.006, 14, 213),
    feeSeries: series(700, 0.003, 0.14, 14, 223),
  },
  {
    id: 'community-lab',
    name: 'Community Lab',
    symbol: 'rLAB',
    description: 'Permissionless community-curated experimental market.',
    category: 'COMMUNITY',
    creator: '0x77aa…12bc',
    address: '0x1F7C3A9E5B1D8F2A6C0E4B8D2F6A0C4E8B1D5F3A',
    created: '2026-09-06',
    tvl: 412_000,
    volume24h: 88_000,
    feeApr: 27.5,
    lps: 64,
    holdings: [
      { symbol: 'RDL', allocation: 30 },
      { symbol: 'ARB', allocation: 25 },
      { symbol: 'UNI', allocation: 25 },
      { symbol: 'USDC', allocation: 20 },
    ],
    performance: perf(113),
    volumeSeries: series(80_000, 0.01, 0.3, 14, 233),
    liquiditySeries: series(390_000, 0.005, 0.02, 14, 243),
    feeSeries: series(520, 0.009, 0.24, 14, 253),
  },
]

export const PROTOCOL_STATS: ProtocolStats = {
  tvl: 12_840_000,
  portfolios: 42,
  assets: 128,
  volume24h: 3_910_000,
  lps: 1_842,
  fees24h: 21_400,
}

export const ACTIVITY: ActivityItem[] = [
  { id: 'tx-1', type: 'SWAP', detail: 'WETH → LINK via REBAL Bluechip Vault', value: 42_800, account: '0x3f9a…c81e', time: '2 min ago' },
  { id: 'tx-2', type: 'ADD_LIQUIDITY', detail: 'Multi-asset deposit into AI Infrastructure', value: 118_400, account: '0x71b2…4d9a', time: '9 min ago' },
  { id: 'tx-3', type: 'SWAP', detail: 'USDC → RNDR via AI Infrastructure Vault', value: 9_620, account: '0xe04c…77b1', time: '14 min ago' },
  { id: 'tx-4', type: 'REMOVE_LIQUIDITY', detail: 'Exited Stable Yield position', value: 64_100, account: '0x9d8f…2a33', time: '31 min ago' },
  { id: 'tx-5', type: 'CREATE', detail: 'Created portfolio market Community Lab', value: 25_000, account: '0x77aa…12bc', time: '1 hr ago' },
  { id: 'tx-6', type: 'SWAP', detail: 'WETH → SPY via RWA Market Vault', value: 17_350, account: '0x5b6e…90f4', time: '1 hr ago' },
  { id: 'tx-7', type: 'ADD_LIQUIDITY', detail: 'Single-asset entry (ETH) into REBAL Bluechip', value: 30_000, account: '0xc2d7…5e88', time: '2 hr ago' },
]

export const TVL_SERIES = series(9_200_000, 0.006, 0.02, 30, 7)
export const PROTOCOL_VOLUME_SERIES = series(2_600_000, 0.008, 0.22, 30, 17)
export const CREATION_SERIES = [1, 0, 2, 1, 3, 2, 1, 0, 2, 4, 3, 1, 2, 5, 3, 2, 1, 4, 3, 2, 6, 4, 3, 5, 2, 4, 3, 6, 5, 4]

export const DEMO_POSITIONS = [
  { portfolioId: 'rebal-bluechip', share: 0.082, positionValue: 24_318, feesEarned: 412.6 },
  { portfolioId: 'ai-infrastructure', share: 0.031, positionValue: 9_844, feesEarned: 231.2 },
  { portfolioId: 'stable-yield', share: 0.014, positionValue: 6_120, feesEarned: 88.4 },
]

export const DEMO_WALLET_ADDRESS = '0xF1aB3cD9e2745bA8160cD3f29E84b7A65C0d9E41'
