import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export const metadata = { title: 'GitBook — REBAL' }

const GITHUB_URL = 'https://github.com/devrebal/rebal'
const X_URL = 'https://x.com/rebal_market'

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  )
}

const CHAPTERS = [
  {
    title: 'Overview',
    pages: ['Introduction', 'Protocol at a glance', 'Robinhood Chain deployment', 'Demo mode'],
  },
  {
    title: 'Portfolio Markets',
    pages: ['Market anatomy', 'Composition & allocations', 'Fee tiers', 'Settlement assets'],
  },
  {
    title: 'Liquidity',
    pages: ['Multi-asset deposits', 'Auto-balanced deposits', 'Portfolio shares', 'Claiming fees'],
  },
  {
    title: 'Trading',
    pages: ['Routing', 'Slippage controls', 'Price impact', 'Settlement'],
  },
  {
    title: 'Creating Markets',
    pages: ['Factory walkthrough', 'Parameters reference', 'Creator incentives'],
  },
  {
    title: 'Reference',
    pages: ['Contract addresses (placeholders)', 'Glossary', 'FAQ'],
  },
]

export default function GitBookPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <Link
        href="/docs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Documentation
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border">
          <BookOpen className="h-4.5 w-4.5" />
        </span>
        <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">REBAL GitBook</h1>
            <p className="text-sm text-muted-foreground">Protocol handbook · Robinhood Chain</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold tracking-wide transition-colors hover:border-foreground/30 hover:bg-accent"
            >
              <GithubIcon className="h-4 w-4" /> VIEW ON GITHUB
            </a>
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold tracking-wide transition-colors hover:border-foreground/30 hover:bg-accent"
            >
              <XIcon className="h-3.5 w-3.5" /> FOLLOW ON X
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((ch) => (
          <section key={ch.title} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{ch.title.toUpperCase()}</h2>
            <ul className="mt-3 space-y-2">
              {ch.pages.map((p) => (
                <li key={p} className="text-sm text-foreground/85 transition-colors hover:text-foreground">
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
