'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/lib/wagmi'
import { DEMO_WALLET_ADDRESS } from '@/lib/mock-data'
import { ComingSoonModal } from '@/components/coming-soon-modal'

/* ------------------------------------------------------------
   Demo wallet
   ------------------------------------------------------------
   The preview environment has no injected wallet. Demo mode
   lets the connected-wallet surfaces (My Liquidity, positions)
   be reviewed with clearly-labeled placeholder data. It never
   signs anything and never touches real funds.
   ------------------------------------------------------------ */

interface DemoWalletContextValue {
  demoAddress: string | null
  enableDemo: () => void
  disableDemo: () => void
}

const DemoWalletContext = createContext<DemoWalletContextValue>({
  demoAddress: null,
  enableDemo: () => {},
  disableDemo: () => {},
})

export function useDemoWallet() {
  return useContext(DemoWalletContext)
}

/* ------------------------------------------------------------
   $REBAL "Coming Soon" modal — UI preview only. It never
   requests approvals, signatures, or transfers.
   ------------------------------------------------------------ */

interface ComingSoonContextValue {
  open: () => void
}

const ComingSoonContext = createContext<ComingSoonContextValue>({ open: () => {} })

export function useComingSoon() {
  return useContext(ComingSoonContext)
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [demoAddress, setDemoAddress] = useState<string | null>(null)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)

  const demo = useMemo(
    () => ({
      demoAddress,
      enableDemo: () => setDemoAddress(DEMO_WALLET_ADDRESS),
      disableDemo: () => setDemoAddress(null),
    }),
    [demoAddress],
  )

  const comingSoon = useMemo(() => ({ open: () => setComingSoonOpen(true) }), [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DemoWalletContext.Provider value={demo}>
          <ComingSoonContext.Provider value={comingSoon}>
            {children}
            <ComingSoonModal open={comingSoonOpen} onClose={() => setComingSoonOpen(false)} />
          </ComingSoonContext.Provider>
        </DemoWalletContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
