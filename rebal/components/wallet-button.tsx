'use client'

import { useEffect, useRef, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { ChevronDown, LogOut, TriangleAlert, Wallet } from 'lucide-react'
import { robinhoodChain } from '@/lib/chains'
import { shortenAddress } from '@/lib/format'
import { useDemoWallet } from './providers'
import { cn } from '@/lib/utils'

export function WalletButton({ compact = false }: { compact?: boolean }) {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: switching } = useSwitchChain()
  const { demoAddress, enableDemo, disableDemo } = useDemoWallet()
  const [open, setOpen] = useState(false)
  const [hasInjected, setHasInjected] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHasInjected(
      typeof window !== 'undefined' &&
        !!(window as unknown as { ethereum?: unknown }).ethereum,
    )
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const wrongNetwork = isConnected && chainId !== robinhoodChain.id
  const connected = isConnected || !!demoAddress

  if (!connected) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <Wallet className="h-3.5 w-3.5" />
          CONNECT WALLET
        </button>
        {open && (
          <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/5">
            <button
              onClick={() => connect({ connector: connectors[0] })}
              disabled={isPending || !hasInjected}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              <span>MetaMask</span>
              <span className="text-[10px] tracking-widest text-muted-foreground">
                {hasInjected ? (isPending ? 'CONNECTING…' : 'INJECTED') : 'NOT DETECTED'}
              </span>
            </button>
            {error && (
              <p className="px-3 pb-1 pt-2 text-xs text-destructive">
                {error.message.includes('rejected') ? 'Connection request rejected.' : error.message}
              </p>
            )}
            <div className="my-1 border-t border-border" />
            <button
              onClick={() => {
                enableDemo()
                setOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
            >
              <span>Demo wallet</span>
              <span className="text-[10px] tracking-widest text-muted-foreground">PREVIEW</span>
            </button>
            <p className="px-3 pb-2 pt-1 text-[11px] leading-relaxed text-muted-foreground">
              Demo mode shows placeholder positions only. No signature or transaction is ever requested.
            </p>
          </div>
        )}
      </div>
    )
  }

  const displayAddress = demoAddress ?? address ?? ''

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold tracking-wide transition-colors',
          wrongNetwork
            ? 'border-destructive/40 bg-destructive/10 text-destructive'
            : 'border-border bg-card text-foreground hover:border-foreground/30',
        )}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
              wrongNetwork ? 'bg-destructive' : 'bg-rebal-blue',
            )}
          />
          <span
            className={cn('relative inline-flex h-2 w-2 rounded-full', wrongNetwork ? 'bg-destructive' : 'bg-rebal-blue')}
          />
        </span>
        {wrongNetwork ? 'WRONG NETWORK' : shortenAddress(displayAddress)}
        {!compact && <ChevronDown className="h-3 w-3 opacity-60" />}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-border bg-card p-3 shadow-xl shadow-black/5">
          <div className="flex items-center justify-between text-xs">
            <span className="tracking-widest text-muted-foreground">
              {demoAddress ? 'DEMO WALLET' : 'CONNECTED'}
            </span>
            <span className="font-mono">{shortenAddress(displayAddress, 6)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="tracking-widest text-muted-foreground">NETWORK</span>
            <span className={cn('font-medium', wrongNetwork && 'text-destructive')}>
              {wrongNetwork ? 'Unsupported network' : 'Robinhood Chain'}
            </span>
          </div>
          {wrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: robinhoodChain.id })}
              disabled={switching}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-3 py-2 text-xs font-semibold tracking-widest text-background disabled:opacity-60"
            >
              <TriangleAlert className="h-3.5 w-3.5" />
              {switching ? 'SWITCHING…' : 'SWITCH NETWORK'}
            </button>
          )}
          <div className="mt-3 flex gap-2">
            {demoAddress && (
              <button
                onClick={() => disableDemo()}
                className="flex-1 rounded-xl border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
              >
                Exit demo
              </button>
            )}
            <button
              onClick={() => disconnect()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
            >
              <LogOut className="h-3 w-3" /> Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
