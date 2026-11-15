import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type AppSection = 'overview' | 'trading' | 'invest' | 'pulse';
export type TradingBranch = 'lab' | 'patterns' | 'indicators' | 'sr';
export type InvestBranch = 'screener' | 'accounting' | 'model' | 'books';

interface TopNavProps {
  activeSection: AppSection;
  onNavigateSection: (section: AppSection) => void;
  onJumpTradingBranch: (branch: TradingBranch) => void;
  onJumpInvestBranch: (branch: InvestBranch) => void;
}

const NAV_ITEMS: { id: AppSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'trading', label: 'Trading' },
  { id: 'invest', label: 'Invest' },
  { id: 'pulse', label: 'Market Pulse' },
];

export function TopNav({
  activeSection,
  onNavigateSection,
  onJumpTradingBranch,
  onJumpInvestBranch,
}: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const goSection = (sec: AppSection) => {
    onNavigateSection(sec);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040706]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Geometric Institutional Brand Wordmark */}
        <button
          type="button"
          onClick={() => goSection('overview')}
          className="inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="28" height="28" rx="7" fill="url(#tmBrandGrad)" />
            <path
              d="M7 18.5L11.5 13L15.5 16L21 9.5"
              stroke="#03140C"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="21" cy="9.5" r="2" fill="#03140C" />
            <defs>
              <linearGradient id="tmBrandGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6ee7b7" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Trade<span className="text-emerald-400">Mind</span>
          </span>
        </button>

        {/* Zone 2: 4 Primary Section Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goSection(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[15px] h-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action Capsule + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onJumpTradingBranch('lab');
              setMobileOpen(false);
            }}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-[#03140c] shadow-[0_0_24px_rgba(16,185,129,0.28)] hover:bg-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Paper Trade
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-neutral-200 hover:bg-white/10"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-white/10 bg-[#070b0a] px-6 py-4 space-y-4"
        >
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goSection(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-[11px] font-medium text-neutral-500 mb-1.5">Trading Branches</p>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => { onJumpTradingBranch('lab'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Lab</button>
                <button type="button" onClick={() => { onJumpTradingBranch('patterns'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Pattern Academy</button>
                <button type="button" onClick={() => { onJumpTradingBranch('indicators'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Indicators</button>
                <button type="button" onClick={() => { onJumpTradingBranch('sr'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Support &amp; Resistance</button>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-500 mb-1.5">Invest Branches</p>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => { onJumpInvestBranch('screener'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Screener</button>
                <button type="button" onClick={() => { onJumpInvestBranch('accounting'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Accounting</button>
                <button type="button" onClick={() => { onJumpInvestBranch('model'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Invest Model</button>
                <button type="button" onClick={() => { onJumpInvestBranch('books'); setMobileOpen(false); }} className="text-left py-1 text-neutral-300 hover:text-emerald-300">Books</button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
