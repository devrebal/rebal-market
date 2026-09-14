'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { formatToken } from '@/lib/format'

/*
  $REBAL "Coming Soon" preview. This is a UI gimmick only:
  it never requests token approval, ETH transfer, wallet signature,
  contract call, or any fund movement.
*/
export function ComingSoonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [amount, setAmount] = useState('')
  const [state, setState] = useState<'input' | 'loading' | 'done'>('input')

  const quick = ['0.1', '0.5', '1']

  const preview = () => {
    setState('loading')
    setTimeout(() => setState('done'), 1400)
  }

  const reset = () => {
    setState('input')
    setAmount('')
  }

  const rate = 4.2 // placeholder preview rate — exchange rate: coming soon

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => {
            onClose()
            reset()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Get $REBAL — coming soon"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">GET $REBAL</h2>
                <span className="mt-1 inline-block rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
                  COMING SOON
                </span>
              </div>
              <button
                onClick={() => {
                  onClose()
                  reset()
                }}
                aria-label="Close"
                className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {state !== 'done' ? (
              <>
                <p className="mt-4 text-sm text-muted-foreground">
                  Preview the future $REBAL purchase experience.
                </p>

                <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">PAY WITH</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
                        ETH
                      </span>
                      ETH
                    </span>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      inputMode="decimal"
                      className="w-32 bg-transparent text-right text-xl font-semibold tabular outline-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {quick.map((q) => (
                      <button
                        key={q}
                        onClick={() => setAmount(q)}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        {q} ETH
                      </button>
                    ))}
                    <button
                      onClick={() => setAmount('1')}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                  <div>
                    <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">YOU RECEIVE</span>
                    <p className="mt-1 text-xl font-semibold tabular rebal-gradient-text">
                      {amount && !isNaN(Number(amount))
                        ? `${formatToken(Number(amount) * rate, 2)} REBAL`
                        : '-- REBAL'}
                    </p>
                  </div>
                  <span className="text-right text-xs text-muted-foreground">
                    Exchange rate
                    <br />
                    Coming Soon
                  </span>
                </div>

                <button
                  onClick={preview}
                  disabled={!amount || Number(amount) <= 0 || state === 'loading'}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-xs font-semibold tracking-[0.18em] text-background transition-transform hover:scale-[1.01] disabled:opacity-40"
                >
                  {state === 'loading' ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                      PREVIEWING…
                    </>
                  ) : (
                    'PREVIEW PURCHASE'
                  )}
                </button>
              </>
            ) : (
              <div className="mt-6 flex flex-col items-center py-4 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full rebal-gradient-bg text-lg font-bold text-white">
                  R
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">REBAL TOKEN SALE IS COMING SOON</h3>
                <p className="mt-2 max-w-72 text-sm leading-relaxed text-muted-foreground">
                  This interface is only a product preview. No transaction has been submitted and no funds have been
                  transferred.
                </p>
                <button
                  onClick={() => {
                    onClose()
                    reset()
                  }}
                  className="mt-6 rounded-2xl bg-foreground px-8 py-3 text-xs font-semibold tracking-[0.18em] text-background transition-transform hover:scale-[1.02]"
                >
                  GOT IT
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
