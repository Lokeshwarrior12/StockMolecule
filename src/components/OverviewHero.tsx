import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calculator,
  CandlestickChart as CandleIcon,
  FileSpreadsheet,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { STOCK_UNIVERSE } from '../data/marketData';
import type { PaperPortfolioState } from '../utils/marketMath';
import { EmeraldBackdrop } from './EmeraldBackdrop';
import type { AppSection, InvestBranch, TradingBranch } from './TopNav';

interface OverviewHeroProps {
  portfolio: PaperPortfolioState;
  onNavigateSection: (section: AppSection) => void;
  onJumpTradingBranch: (branch: TradingBranch) => void;
  onJumpInvestBranch: (branch: InvestBranch) => void;
  onSelectTickerAndTrade: (symbol: string) => void;
}

export function OverviewHero({
  portfolio,
  onNavigateSection,
  onJumpTradingBranch,
  onJumpInvestBranch,
  onSelectTickerAndTrade,
}: OverviewHeroProps) {
  const [quickFocusSymbol, setQuickFocusSymbol] = useState<'NVDA' | 'MSFT' | 'MELI'>('NVDA');

  const portfolioEquity = useMemo(() => {
    const holdingsVal = portfolio.positions.reduce((acc, pos) => {
      const quote = STOCK_UNIVERSE.find((s) => s.symbol === pos.symbol)?.price ?? pos.avgCost;
      return acc + pos.shares * quote;
    }, 0);
    return portfolio.cash + holdingsVal;
  }, [portfolio]);

  const featuredStock = useMemo(
    () => STOCK_UNIVERSE.find((s) => s.symbol === quickFocusSymbol) ?? STOCK_UNIVERSE[0],
    [quickFocusSymbol]
  );

  const openPositionsCount = portfolio.positions.length;

  return (
    <main className="relative overflow-hidden bg-[#040706]">
      {/* Animated Fundora emerald spotlight + 64px dark square grid */}
      <EmeraldBackdrop />

      {/* Centered Spotlight Hero */}
      <section className="relative z-10 mx-auto max-w-[1280px] px-6 pt-14 pb-16 sm:pt-20 sm:pb-20 text-center">
        <p className="text-xs font-medium tracking-wide text-emerald-400">
          TradeMind Quantitative Suite · Technical Execution &amp; Fundamental Research
        </p>

        <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl sm:text-6xl lg:text-[64px] font-bold tracking-tight leading-[1.05] hero-gradient-text">
          Command Price Action,
          <br />
          Underwrite Intrinsic Value
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed">
          Master 75 candlestick &amp; breakout formations, execute live paper trades, run 85 institutional
          screener templates, audit 3-statement accounting, and value equities with live DCF models.
        </p>

        {/* Capsule CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => onJumpTradingBranch('lab')}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#03140c] shadow-[0_0_32px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors"
          >
            <span>Open Trading Lab</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onJumpInvestBranch('screener')}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-white/[0.04] px-6 py-3 text-sm font-medium text-emerald-100 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-colors"
          >
            <span>Launch 85-Query Screener</span>
          </button>
        </div>

        {/* Fundora 3-Card Interactive Showcase Row */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {/* Card 1: Pattern & Signal Spotlight */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1210]/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-medium text-emerald-300">Trading Signal Lab</span>
                <button
                  type="button"
                  onClick={() => onJumpTradingBranch('patterns')}
                  className="text-neutral-300 hover:text-emerald-300 transition-colors"
                >
                  75 Patterns &rarr;
                </button>
              </div>
              <p className="mt-3 font-display text-lg font-semibold text-white">
                Breakout &amp; Polarity Engine
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Inspect Candle Anatomy, Ascending Triangles, VCP bases, and live S/R flips.
              </p>

              {/* Crisp Mini SVG Candlestick Signal Preview */}
              <div className="mt-4 rounded-xl border border-white/10 bg-[#060a09] p-3">
                <svg viewBox="0 0 220 72" className="w-full h-16" aria-hidden="true">
                  <line x1="8" y1="22" x2="212" y2="22" stroke="#34d399" strokeOpacity="0.45" strokeDasharray="4 4" />
                  <rect x="20" y="34" width="12" height="22" rx="2" fill="#ef4444" />
                  <rect x="48" y="38" width="12" height="16" rx="2" fill="#10b981" />
                  <rect x="76" y="28" width="12" height="24" rx="2" fill="#10b981" />
                  <rect x="104" y="32" width="12" height="12" rx="2" fill="#ef4444" />
                  <rect x="132" y="24" width="12" height="18" rx="2" fill="#10b981" />
                  <rect x="160" y="10" width="14" height="26" rx="2" fill="#34d399" />
                  <rect x="188" y="6" width="14" height="18" rx="2" fill="#34d399" />
                </svg>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs border-t border-white/10 pt-3">
              <span className="text-neutral-400">75 Patterns · 13 Indicators</span>
              <button
                type="button"
                onClick={() => onSelectTickerAndTrade('NVDA')}
                className="font-medium text-emerald-300 hover:text-emerald-200"
              >
                Chart NVDA
              </button>
            </div>
          </div>

          {/* Card 2: Interactive Fundamental Filter Snapshot */}
          <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-[#0e1915] to-[#080e0c] p-5 shadow-[0_24px_60px_rgba(16,185,129,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-300">Invest Research</span>
                <div className="flex items-center gap-1">
                  {(['NVDA', 'MSFT', 'MELI'] as const).map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setQuickFocusSymbol(sym)}
                      className={`px-2 py-0.5 rounded font-mono-tabular text-[11px] transition-colors ${
                        quickFocusSymbol === sym
                          ? 'bg-emerald-500 text-[#03140c] font-semibold'
                          : 'bg-white/5 text-neutral-300 hover:text-white'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <p className="font-display text-lg font-semibold text-white">{featuredStock.name}</p>
                <span className="font-mono-tabular text-sm font-bold text-emerald-300">
                  ${featuredStock.price.toFixed(2)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 font-mono-tabular">
                <div className="rounded-lg border border-white/10 bg-[#060a09] p-2.5">
                  <p className="text-[10px] text-neutral-400">ROIC</p>
                  <p className="text-sm font-bold text-emerald-300">{featuredStock.roic.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#060a09] p-2.5">
                  <p className="text-[10px] text-neutral-400">P/E</p>
                  <p className="text-sm font-bold text-white">{featuredStock.pe.toFixed(1)}x</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#060a09] p-2.5">
                  <p className="text-[10px] text-neutral-400">FCF Yield</p>
                  <p className="text-sm font-bold text-white">{featuredStock.fcfYield.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => onJumpInvestBranch('model')}
                className="text-neutral-300 hover:text-emerald-300 transition-colors"
              >
                Open DCF Model
              </button>
              <button
                type="button"
                onClick={() => onJumpInvestBranch('screener')}
                className="font-medium text-emerald-300 hover:text-emerald-200"
              >
                85 Screener Queries &rarr;
              </button>
            </div>
          </div>

          {/* Card 3: Live Paper Portfolio & Capital Ledger (Fundora balance card parity) */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1210]/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-medium text-emerald-300">Paper Trading Desk</span>
                <span className="font-mono-tabular text-neutral-300">{openPositionsCount} Open Positions</span>
              </div>

              <p className="mt-3 text-xs text-neutral-400">Simulated Net Liquidation Equity</p>
              <p className="mt-1 font-display font-mono-tabular text-3xl font-bold text-white">
                ${portfolioEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>

              <div className="mt-4 space-y-2 text-xs font-mono-tabular">
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#060a09] px-3 py-2">
                  <span className="text-neutral-400">Available Buying Power</span>
                  <span className="text-white font-semibold">
                    ${portfolio.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#060a09] px-3 py-2">
                  <span className="text-neutral-400">Active Price Alerts</span>
                  <span className="text-emerald-300 font-semibold">
                    {portfolio.alerts.filter((a) => a.active).length} Armed
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => onNavigateSection('pulse')}
                className="text-neutral-300 hover:text-emerald-300 transition-colors"
              >
                Market Pulse &rarr;
              </button>
              <button
                type="button"
                onClick={() => onJumpTradingBranch('lab')}
                className="font-medium text-emerald-300 hover:text-emerald-200"
              >
                Execute Order &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section = Mode, Branch = Page Architecture Directory */}
      <section className="relative z-10 border-t border-white/10 bg-[#060a09]/95 py-16">
        <div className="mx-auto max-w-[1280px] px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-emerald-400">Platform Architecture</p>
              <h2 className="mt-1 font-display text-3xl font-bold text-white">
                Two Operating Modes, Eight Specialized Branches
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('pulse')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-emerald-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visit Market Pulse Catalysts &amp; Marketplace</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trading Section Lane */}
            <div className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-medium text-emerald-400">Section 01</p>
                  <h3 className="font-display text-2xl font-bold text-white">Trading Mode</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateSection('trading')}
                  className="text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Enter Trading &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'lab' as const,
                    title: 'Lab (Paper Trading)',
                    desc: 'Real-time order ticket, OCO alerts, positions ledger, and multi-timeframe charts.',
                    icon: Activity,
                  },
                  {
                    id: 'patterns' as const,
                    title: 'Pattern Academy',
                    desc: 'Candle anatomy + full 75-Pattern classification cheat sheet & setup rules.',
                    icon: CandleIcon,
                  },
                  {
                    id: 'indicators' as const,
                    title: 'Indicators',
                    desc: '5-pillar interactive lab covering Trend, Momentum, Volume, Volatility & Fibs.',
                    icon: BarChart3,
                  },
                  {
                    id: 'sr' as const,
                    title: 'Support & Resistance',
                    desc: 'Liquidity bounces, breakout polarity flips, stop hunts & trendline playbooks.',
                    icon: Layers,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onJumpTradingBranch(item.id)}
                      className="rounded-xl border border-white/10 bg-[#070b0a] p-4 text-left hover:border-emerald-400/45 transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <p className="mt-2.5 text-sm font-semibold text-white group-hover:text-emerald-300">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Invest Section Lane */}
            <div className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-medium text-emerald-400">Section 02</p>
                  <h3 className="font-display text-2xl font-bold text-white">Invest Mode</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateSection('invest')}
                  className="text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Enter Invest &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'screener' as const,
                    title: 'Screener & 85 Queries',
                    desc: 'Custom purity factor model + 85 global stock screener query templates.',
                    icon: Filter,
                  },
                  {
                    id: 'accounting' as const,
                    title: 'Accounting Fundamentals',
                    desc: '3-Statement flow, 8 ratio categories (A–H), and 10-K audit red flags.',
                    icon: FileSpreadsheet,
                  },
                  {
                    id: 'model' as const,
                    title: 'Invest Model (DCF)',
                    desc: 'Interactive DCF + Margin of Safety calculator, 20 concepts & 33 benchmarks.',
                    icon: Calculator,
                  },
                  {
                    id: 'books' as const,
                    title: 'Books (22 Visual Decks)',
                    desc: '22 investing & trading classics with multi-slide visual mind maps & quizzes.',
                    icon: BookOpen,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onJumpInvestBranch(item.id)}
                      className="rounded-xl border border-white/10 bg-[#070b0a] p-4 text-left hover:border-emerald-400/45 transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <p className="mt-2.5 text-sm font-semibold text-white group-hover:text-emerald-300">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
