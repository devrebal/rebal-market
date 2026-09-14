import { defineChain } from 'viem'

/* ============================================================
   NETWORK CONFIGURATION — PLACEHOLDERS
   ------------------------------------------------------------
   None of the values below are production values.
   Replace each PLACEHOLDER with the official Robinhood Chain
   and REBAL contract deployments when they are available.
   ============================================================ */

// PLACEHOLDER — replace with the official Robinhood Chain ID
export const ROBINHOOD_CHAIN_ID = 7672

// PLACEHOLDER — replace with the official Robinhood Chain RPC endpoint
export const ROBINHOOD_RPC_URL = 'https://rpc.placeholder.robinhood.example'

export const robinhoodChain = defineChain({
  id: ROBINHOOD_CHAIN_ID,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [ROBINHOOD_RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.placeholder.robinhood.example' },
  },
  testnet: true,
})

// PLACEHOLDER — REBAL contract addresses (to be deployed)
export const REBAL_ROUTER_ADDRESS = '0x0000000000000000000000000000000000000000' as const
export const REBAL_FACTORY_ADDRESS = '0x0000000000000000000000000000000000000000' as const
export const REBAL_VAULT_ADDRESS = '0x0000000000000000000000000000000000000000' as const
