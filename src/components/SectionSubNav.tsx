import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  CandlestickChart as CandleIcon,
  FileSpreadsheet,
  Filter,
  Layers,
} from 'lucide-react';
import type { InvestBranch, TradingBranch } from './TopNav';

interface SectionSubNavProps {
  mode: 'trading' | 'invest';
  activeTradingBranch: TradingBranch;
  activeInvestBranch: InvestBranch;
  onSelectTradingBranch: (branch: TradingBranch) => void;
  onSelectInvestBranch: (branch: InvestBranch) => void;
}

const TRADING_BRANCHES: { id: TradingBranch; label: string; icon: typeof CandleIcon }[] = [
  { id: 'lab', label: 'Lab (Paper Trading)', icon: Activity },
  { id: 'patterns', label: 'Pattern Academy', icon: CandleIcon },
  { id: 'indicators', label: 'Indicators', icon: BarChart3 },
  { id: 'sr', label: 'Support & Resistance', icon: Layers },
];

const INVEST_BRANCHES: { id: InvestBranch; label: string; icon: typeof Filter }[] = [
  { id: 'screener', label: 'Screener', icon: Filter },
  { id: 'accounting', label: 'Accounting Fundamentals', icon: FileSpreadsheet },
  { id: 'model', label: 'Invest Model', icon: Calculator },
  { id: 'books', label: 'Books', icon: BookOpen },
];

export function SectionSubNav({
  mode,
  activeTradingBranch,
  activeInvestBranch,
  onSelectTradingBranch,
  onSelectInvestBranch,
}: SectionSubNavProps) {
  return (
    <div className="border-b border-white/10 bg-[#070b0a]/95">
      <div className="mx-auto max-w-[1440px] px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-emerald-400">
            {mode === 'trading' ? 'Trading Section' : 'Invest Section'}
          </span>
          <span aria-hidden="true" className="text-neutral-600">
            /
          </span>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Section Branches">
            {mode === 'trading'
              ? TRADING_BRANCHES.map((b) => {
                  const Icon = b.icon;
                  const active = activeTradingBranch === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => onSelectTradingBranch(b.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{b.label}</span>
                    </button>
                  );
                })
              : INVEST_BRANCHES.map((b) => {
                  const Icon = b.icon;
                  const active = activeInvestBranch === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => onSelectInvestBranch(b.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{b.label}</span>
                    </button>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
