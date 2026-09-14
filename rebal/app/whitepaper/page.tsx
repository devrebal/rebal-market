import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata = { title: 'Whitepaper — REBAL' }

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'callout'; text: string }

type Section = { title: string; blocks: Block[] }

const SECTIONS: Section[] = [
  {
    title: 'Abstract',
    blocks: [
      { kind: 'p', text: 'REBAL is an onchain portfolio market protocol built on Robinhood Chain. Traditional decentralized markets are typically structured around individual trading pairs. As the number of assets grows, this creates fragmented liquidity, duplicated infrastructure, and increasingly complex user experiences.' },
      { kind: 'p', text: 'REBAL introduces a portfolio-first market structure. Instead of treating every asset as an isolated market, REBAL enables multiple assets to coexist within a single programmable liquidity environment. Users can create diversified portfolios, trade against portfolio liquidity, provide liquidity across multiple assets, and enter or exit positions through a unified onchain system.' },
      { kind: 'p', text: 'REBAL is designed to make diversified onchain markets easier to create, easier to access, and more capital efficient.' },
    ],
  },
  {
    title: '1. Introduction',
    blocks: [
      { kind: 'p', text: 'Decentralized finance has made permissionless markets possible, but most liquidity infrastructure still revolves around the concept of the pair. One asset is matched against another asset.' },
      { kind: 'p', text: 'This structure works well for simple markets, but it becomes increasingly inefficient when users and liquidity providers want exposure to multiple assets simultaneously. A diversified portfolio may require several independent markets, multiple liquidity positions, and repeated transactions.' },
      { kind: 'p', text: 'REBAL approaches the problem differently. The protocol treats a collection of assets as a single market environment. This allows liquidity to be organized around portfolios rather than only individual trading pairs. REBAL is built around one simple idea:' },
      { kind: 'callout', text: 'Markets should be able to represent portfolios, not just pairs.' },
    ],
  },
  {
    title: '2. The REBAL Approach',
    blocks: [
      { kind: 'p', text: 'REBAL combines multiple assets into programmable portfolio markets. A portfolio can contain several supported assets alongside a designated settlement asset. For example:' },
      { kind: 'table', head: ['REBAL Technology Portfolio', 'Allocation'], rows: [['Asset A', '35%'], ['Asset B', '25%'], ['Asset C', '20%'], ['Asset D', '10%'], ['Settlement Asset', '10%']] },
      { kind: 'p', text: 'The exact composition is determined by the portfolio creator and represented transparently onchain. Once created, the portfolio becomes a unified liquidity environment where users can trade, deposit liquidity, and obtain portfolio exposure.' },
      { kind: 'p', text: 'This creates three interconnected layers: Assets → Portfolios → Markets. Rather than building a separate market for every possible combination, REBAL provides infrastructure for constructing markets around collections of assets.' },
    ],
  },
  {
    title: '3. Protocol Architecture',
    blocks: [
      { kind: 'p', text: 'REBAL is composed of several core components.' },
      { kind: 'p', text: '3.1 Portfolio Factory — The Portfolio Factory provides the infrastructure required to create new portfolio markets. Creators can define: portfolio assets, initial asset weights, initial liquidity, portfolio parameters, and supported market configuration. Once deployed, portfolio parameters and composition are visible onchain. Portfolio creation is permissionless, subject to the protocol\u2019s smart-contract constraints.' },
      { kind: 'p', text: '3.2 Portfolio Vault — Each portfolio operates through a dedicated liquidity structure. The Portfolio Vault manages the underlying assets deposited by liquidity providers and maintains the portfolio\u2019s proportional composition. Liquidity providers receive portfolio shares representing their proportional position within the liquidity structure. The vault architecture allows multiple assets to remain within the same liquidity environment rather than requiring separate liquidity positions for every asset.' },
      { kind: 'p', text: '3.3 Market Router — The Market Router provides the execution layer for portfolio trading. When a user initiates a trade, the router determines how the transaction should interact with available portfolio liquidity. The router is designed to provide: asset selection, trade execution, liquidity routing, slippage controls, and transaction settlement. The objective is to make multi-asset liquidity accessible through a single trading interface.' },
      { kind: 'p', text: '3.4 Portfolio Shares — Liquidity providers receive portfolio shares representing their proportional ownership of the portfolio\u2019s liquidity position. A user\u2019s share is determined by the amount of liquidity contributed relative to the total portfolio liquidity. As portfolio assets change in value and trading activity occurs, the underlying value represented by portfolio shares may change accordingly. Portfolio shares are not equity in REBAL and do not represent ownership of the protocol.' },
    ],
  },
  {
    title: '4. Creating a Portfolio',
    blocks: [
      { kind: 'p', text: 'REBAL allows users to create portfolio markets by defining a collection of supported assets and their initial allocation. A creator may establish a portfolio such as:' },
      { kind: 'table', head: ['Digital Infrastructure Portfolio', 'Allocation'], rows: [['Asset A', '40%'], ['Asset B', '25%'], ['Asset C', '20%'], ['Asset D', '10%'], ['Settlement Asset', '5%']] },
      { kind: 'p', text: 'The initial deposit establishes the starting composition of the portfolio. The relationship between assets is determined by the initial liquidity configuration rather than relying on a centralized administrator. Once deployed, the portfolio becomes an onchain market that can be accessed by users and liquidity providers.' },
    ],
  },
  {
    title: '5. Portfolio Composition',
    blocks: [
      { kind: 'p', text: 'Portfolio composition is transparent and verifiable onchain. Users can inspect: assets held, current allocation, liquidity, trading activity, portfolio shares, historical activity, and available market depth.' },
      { kind: 'p', text: 'Portfolio creators may design different market structures based on themes, strategies, sectors, ecosystems, or other asset groupings. REBAL does not determine whether a portfolio is appropriate or desirable. The protocol provides the infrastructure; users determine which markets they interact with.' },
    ],
  },
  {
    title: '6. Trading',
    blocks: [
      { kind: 'p', text: 'REBAL allows users to trade against portfolio liquidity through a unified interface. A typical transaction consists of:' },
      { kind: 'list', items: ['Selecting an input asset', 'Selecting an output asset', 'Entering the desired amount', 'Receiving an execution quote', 'Setting slippage tolerance', 'Confirming the transaction', 'Settling the trade onchain'] },
      { kind: 'p', text: 'Trading occurs against available portfolio liquidity. The protocol is designed to reduce the need for users to manually navigate multiple isolated liquidity markets when interacting with assets contained within the same portfolio environment.' },
    ],
  },
  {
    title: '7. Liquidity Provision',
    blocks: [
      { kind: 'p', text: 'Liquidity providers can deposit supported assets into REBAL portfolio markets. Liquidity is distributed according to the portfolio\u2019s defined composition. In return, liquidity providers receive portfolio shares. These shares represent a proportional claim on the liquidity held within the portfolio structure, subject to trading activity, fees, asset price movements, and other market conditions.' },
      { kind: 'p', text: 'Liquidity providers may benefit from: trading fees, portfolio market activity, and exposure to diversified liquidity environments. Liquidity provision also carries risk, including asset price volatility and changes in portfolio composition or relative asset values.' },
    ],
  },
  {
    title: '8. Portfolio Entry',
    blocks: [
      { kind: 'p', text: 'REBAL is designed to make portfolio access simple. Users do not necessarily need to acquire every underlying asset individually before obtaining portfolio exposure. Where supported by available liquidity, users may enter a portfolio using a single asset. The protocol can route the supplied asset through available liquidity and establish the corresponding portfolio position.' },
      { kind: 'callout', text: 'One Asset → Portfolio Position' },
      { kind: 'p', text: 'Instead of manually acquiring multiple assets and constructing a portfolio independently, users can interact with the portfolio market directly.' },
    ],
  },
  {
    title: '9. Portfolio Exit',
    blocks: [
      { kind: 'p', text: 'Portfolio positions can also be exited through the same unified structure. When a user withdraws liquidity or redeems a portfolio position, the protocol calculates the corresponding underlying assets based on the user\u2019s proportional share. Depending on the market structure, users may receive multiple underlying assets rather than a single settlement asset. This preserves the portfolio-native nature of the system.' },
    ],
  },
  {
    title: '10. Fees',
    blocks: [
      { kind: 'p', text: 'REBAL may charge fees on activity occurring within its markets. Potential fee destinations include:' },
      { kind: 'list', items: ['Liquidity providers', 'Protocol treasury', 'Ecosystem incentives', 'Market creation incentives', 'Development and maintenance', 'Governance-approved initiatives'] },
      { kind: 'p', text: 'Fee parameters may vary by market or protocol configuration. All applicable fees are disclosed through the protocol interface and smart-contract architecture. Fees are intended to align economic incentives between traders, liquidity providers, portfolio creators, and the broader REBAL ecosystem.' },
    ],
  },
  {
    title: '11. $REBAL',
    blocks: [
      { kind: 'p', text: '$REBAL is the native ecosystem token of the REBAL protocol. The token is designed to support participation within the broader REBAL ecosystem. Potential utility may include:' },
      { kind: 'list', items: ['Governance participation', 'Liquidity incentives', 'Portfolio creator incentives', 'Ecosystem programs', 'Community initiatives', 'Protocol participation mechanisms'] },
      { kind: 'p', text: 'The specific utility of $REBAL may evolve as the ecosystem develops. Holding $REBAL does not represent equity, ownership, or a claim on the assets held by REBAL markets. $REBAL should be understood as a protocol utility and ecosystem token rather than an ownership instrument.' },
    ],
  },
  {
    title: '12. Portfolio Explorer',
    blocks: [
      { kind: 'p', text: 'REBAL provides an interface for discovering and analyzing portfolio markets. Users can inspect portfolio-level information including: total liquidity, trading volume, asset composition, allocation percentages, number of underlying assets, trading activity, fee activity, liquidity depth, and historical market activity.' },
      { kind: 'p', text: 'This creates a transparent market-discovery layer where users can evaluate portfolio structures before interacting with them.' },
    ],
  },
  {
    title: '13. Portfolio Categories',
    blocks: [
      { kind: 'p', text: 'Portfolio markets can be organized into different categories. Examples include:' },
      { kind: 'list', items: ['Technology — collections of assets associated with decentralized technology and infrastructure.', 'Ecosystem — portfolios focused on assets connected to a particular blockchain or ecosystem.', 'Sector — markets organized around a particular sector or thematic category.', 'Strategy — portfolios structured around a defined allocation methodology.', 'Community — markets created around community-selected collections of assets.'] },
      { kind: 'p', text: 'These categories are organizational frameworks and do not constitute investment recommendations.' },
    ],
  },
  {
    title: '14. Permissionless Markets',
    blocks: [
      { kind: 'p', text: 'REBAL is designed around permissionless market creation. Subject to protocol and smart-contract constraints, users can create portfolio markets without requiring centralized approval. This allows the market layer to expand organically as creators develop new portfolio structures.' },
      { kind: 'p', text: 'Permissionless infrastructure also introduces additional risks. Portfolio creators may create markets containing highly volatile, experimental, illiquid, or otherwise risky assets. The existence of a market on REBAL does not constitute an endorsement, verification, or recommendation by the protocol. Users are responsible for conducting their own research before interacting with any portfolio.' },
    ],
  },
  {
    title: '15. Transparency',
    blocks: [
      { kind: 'p', text: 'REBAL is designed around onchain transparency. Core market information can be independently verified through the underlying blockchain. Users can inspect: portfolio composition, liquidity, transactions, market activity, contract interactions, and portfolio share balances.' },
      { kind: 'p', text: 'The protocol does not rely on a centralized database to determine ownership of portfolio positions. The blockchain serves as the underlying source of settlement and ownership records.' },
    ],
  },
  {
    title: '16. Security',
    blocks: [
      { kind: 'p', text: 'REBAL relies on smart contracts to manage portfolio liquidity and market interactions. The protocol is designed with an emphasis on: non-custodial asset management, deterministic smart-contract execution, transparent portfolio accounting, onchain settlement, and explicit market parameters.' },
      { kind: 'p', text: 'Smart contracts may contain vulnerabilities despite development and testing efforts. Users should understand that interacting with decentralized protocols involves technical and financial risks. Where applicable, contracts may undergo independent security review. An audit, if performed, does not guarantee that smart contracts are completely free of vulnerabilities.' },
    ],
  },
  {
    title: '17. Risk Considerations',
    blocks: [
      { kind: 'p', text: 'Participation in REBAL markets involves substantial risk. Users may experience losses due to:' },
      { kind: 'list', items: ['Asset price volatility', 'Market illiquidity', 'Slippage', 'Smart-contract vulnerabilities', 'Oracle or pricing issues where applicable', 'Impermanent loss or portfolio divergence', 'Malicious or poorly designed portfolio markets', 'Blockchain infrastructure failures', 'Regulatory or legal changes', 'Loss or compromise of private keys'] },
      { kind: 'p', text: 'Portfolio diversification does not eliminate market risk. A portfolio containing multiple assets can still experience significant losses. Users should only interact with markets after understanding the associated risks.' },
    ],
  },
  {
    title: '18. Non-Custodial Design',
    blocks: [
      { kind: 'p', text: 'REBAL is designed as a non-custodial protocol. Users interact directly with smart contracts through their wallets. The protocol does not require users to deposit assets into a centralized account or surrender custody to a centralized intermediary. Ownership and transactions are recorded through blockchain infrastructure. Users remain responsible for securing their wallets, private keys, and transaction approvals.' },
    ],
  },
  {
    title: '19. Long-Term Vision',
    blocks: [
      { kind: 'p', text: 'REBAL is built around a broader evolution of decentralized market infrastructure. As the number of onchain assets continues to grow, liquidity infrastructure must become more flexible.' },
      { kind: 'p', text: 'The future of decentralized markets may not be defined exclusively by isolated trading pairs. Instead, markets can become programmable environments capable of representing collections of assets, thematic exposure, and dynamic portfolio structures. REBAL aims to provide the infrastructure for this transition. Its long-term objective is to make portfolio creation and portfolio liquidity native components of decentralized markets.' },
    ],
  },
  {
    title: '20. Conclusion',
    blocks: [
      { kind: 'p', text: 'REBAL introduces a portfolio-first approach to decentralized liquidity. By bringing multiple assets into unified market structures, the protocol aims to reduce liquidity fragmentation while giving users and creators a simpler way to build and access diversified onchain markets. The system combines:' },
      { kind: 'list', items: ['Portfolio Creation — create markets around collections of assets.', 'Unified Liquidity — provide liquidity across multiple assets through a single portfolio structure.', 'Portfolio Trading — interact with multiple assets through a unified market interface.', 'Transparent Infrastructure — verify portfolio composition and market activity directly onchain.', 'Permissionless Creation — allow new portfolio markets to emerge without centralized approval.'] },
      { kind: 'p', text: 'REBAL is infrastructure for a more composable onchain market. Build the portfolio. Provide the liquidity. Trade the market.' },
    ],
  },
  {
    title: 'Disclaimer',
    blocks: [
      { kind: 'p', text: 'This document is provided for informational purposes only and does not constitute financial, investment, legal, tax, or other professional advice.' },
      { kind: 'p', text: 'REBAL and $REBAL do not represent equity, shares, ownership interests, or guaranteed financial returns. Digital assets and decentralized finance involve significant risks, including the potential loss of all or part of the value of assets used within the protocol.' },
      { kind: 'p', text: 'Users are solely responsible for conducting their own research, assessing risks, complying with applicable laws and regulations, and determining whether interaction with REBAL is appropriate for them. Nothing in this document should be interpreted as a promise, guarantee, or solicitation of investment.' },
    ],
  },
]

function BlockRenderer({ block }: { block: Block }) {
  if (block.kind === 'p') {
    return <p className="text-pretty leading-relaxed text-muted-foreground">{block.text}</p>
  }
  if (block.kind === 'list') {
    return (
      <ul className="space-y-2">
        {block.items.map((item) => (
          <li key={item} className="flex gap-2.5 leading-relaxed text-muted-foreground">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#ffb84d]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (block.kind === 'table') {
    return (
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {block.head.map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row[0]} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 text-muted-foreground">{row[0]}</td>
                <td className="px-4 py-2.5 font-medium">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-border bg-muted/40 px-5 py-4">
      <p className="font-medium tracking-tight">{block.text}</p>
    </div>
  )
}

export default function WhitepaperPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Link
        href="/docs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Documentation
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border">
          <FileText className="h-4.5 w-4.5" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">REBAL Whitepaper</h1>
          <p className="text-sm text-muted-foreground">Portfolio Market Infrastructure on Robinhood Chain · v1.0</p>
        </div>
      </div>

      <article className="mt-10 space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.title} className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>
            <div className="space-y-4">
              {s.blocks.map((b, i) => (
                <BlockRenderer key={i} block={b} />
              ))}
            </div>
          </section>
        ))}
      </article>
    </div>
  )
}
