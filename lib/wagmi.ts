'use client'

import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { robinhoodChain } from './chains'

/*
  Wallet configuration. Uses the injected EVM provider (MetaMask and
  compatible wallets). Robinhood Chain parameters are placeholders —
  see /lib/chains.ts.
*/
export const wagmiConfig = createConfig({
  chains: [robinhoodChain],
  transports: { [robinhoodChain.id]: http() },
  connectors: [injected({ shimDisconnect: true })],
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
