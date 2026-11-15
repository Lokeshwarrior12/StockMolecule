import { useEffect, useState } from 'react';
import {
  TopNav,
  type AppSection,
  type InvestBranch,
  type TradingBranch,
} from './components/TopNav';
import { SectionSubNav } from './components/SectionSubNav';
import { OverviewHero } from './components/OverviewHero';
import { TradeLabView } from './components/TradeLabView';
import { PatternAcademyBranch } from './components/PatternAcademyBranch';
import { IndicatorsBranch } from './components/IndicatorsBranch';
import { SupportResistanceBranch } from './components/SupportResistanceBranch';
import { InvestEngineView } from './components/InvestEngineView';
import { AccountingBranch } from './components/AccountingBranch';
import { InvestModelBranch } from './components/InvestModelBranch';
import { BooksBranch } from './components/BooksBranch';
import { MarketPulseView } from './components/MarketPulseView';
import type { PaperPortfolioState } from './utils/marketMath';

const PORTFOLIO_STORAGE_KEY = 'trademind_paper_portfolio_v1';

const DEFAULT_PORTFOLIO: PaperPortfolioState = {
  cash: 88250.0,
  positions: [
    { symbol: 'NVDA', shares: 45, avgCost: 132.4 },
    { symbol: 'TSM', shares: 30, avgCost: 184.5 },
  ],
  orders: [
    {
      id: 'ORD-SEED-1',
      symbol: 'NVDA',
      side: 'BUY',
      orderType: 'MARKET',
      shares: 45,
      price: 132.4,
      stopLoss: 124.0,
      takeProfit: 155.0,
      timestamp: '09:42',
    },
    {
      id: 'ORD-SEED-2',
      symbol: 'TSM',
      side: 'BUY',
      orderType: 'LIMIT',
      shares: 30,
      price: 184.5,
      timestamp: '10:15',
    },
  ],
  alerts: [
    {
      id: 'ALT-SEED-1',
      symbol: 'NVDA',
      condition: 'ABOVE',
      targetPrice: 145.0,
      note: 'Blackwell breakout shelf confirmation',
      active: true,
    },
  ],
};

function loadInitialPortfolio(): PaperPortfolioState {
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO;
    const parsed = JSON.parse(raw) as PaperPortfolioState;
    if (typeof parsed.cash === 'number' && Array.isArray(parsed.positions)) {
      return parsed;
    }
    return DEFAULT_PORTFOLIO;
  } catch {
    return DEFAULT_PORTFOLIO;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get('section') as AppSection | null;
      if (sec && ['overview', 'trading', 'invest', 'pulse'].includes(sec)) {
        return sec;
      }
      // Backwards compatible ?view= deep-link mapping
      const legacyView = params.get('view');
      if (legacyView === 'trade' || legacyView === 'learn') return 'trading';
      if (legacyView === 'invest') return 'invest';
      if (legacyView === 'pulse') return 'pulse';
    }
    return 'overview';
  });

  const [tradingBranch, setTradingBranch] = useState<TradingBranch>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const br = params.get('branch') as TradingBranch | null;
      if (br && ['lab', 'patterns', 'indicators', 'sr'].includes(br)) return br;
      if (params.get('view') === 'learn') return 'patterns';
    }
    return 'lab';
  });

  const [investBranch, setInvestBranch] = useState<InvestBranch>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const br = params.get('branch') as InvestBranch | null;
      if (br && ['screener', 'accounting', 'model', 'books'].includes(br)) return br;
    }
    return 'screener';
  });

  const [selectedSymbol, setSelectedSymbol] = useState('NVDA');
  const [portfolio, setPortfolio] = useState<PaperPortfolioState>(loadInitialPortfolio);

  useEffect(() => {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    } catch {
      // Ignore storage quota issues
    }
  }, [portfolio]);

  const navigateSection = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpTradingBranch = (branch: TradingBranch) => {
    setTradingBranch(branch);
    setActiveSection('trading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpInvestBranch = (branch: InvestBranch) => {
    setInvestBranch(branch);
    setActiveSection('invest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTickerInTradeLab = (symbol: string) => {
    setSelectedSymbol(symbol);
    setTradingBranch('lab');
    setActiveSection('trading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#040706] text-[#f1f5f2]">
      <TopNav
        activeSection={activeSection}
        onNavigateSection={navigateSection}
        onJumpTradingBranch={jumpTradingBranch}
        onJumpInvestBranch={jumpInvestBranch}
      />

      {(activeSection === 'trading' || activeSection === 'invest') && (
        <SectionSubNav
          mode={activeSection}
          activeTradingBranch={tradingBranch}
          activeInvestBranch={investBranch}
          onSelectTradingBranch={setTradingBranch}
          onSelectInvestBranch={setInvestBranch}
        />
      )}

      <div className="flex-1">
        {activeSection === 'overview' && (
          <OverviewHero
            portfolio={portfolio}
            onNavigateSection={navigateSection}
            onJumpTradingBranch={jumpTradingBranch}
            onJumpInvestBranch={jumpInvestBranch}
            onSelectTickerAndTrade={openTickerInTradeLab}
          />
        )}

        {activeSection === 'trading' && tradingBranch === 'lab' && (
          <TradeLabView
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
            portfolio={portfolio}
            onUpdatePortfolio={setPortfolio}
          />
        )}
        {activeSection === 'trading' && tradingBranch === 'patterns' && <PatternAcademyBranch />}
        {activeSection === 'trading' && tradingBranch === 'indicators' && <IndicatorsBranch />}
        {activeSection === 'trading' && tradingBranch === 'sr' && <SupportResistanceBranch />}

        {activeSection === 'invest' && investBranch === 'screener' && (
          <InvestEngineView onOpenTradeChart={openTickerInTradeLab} />
        )}
        {activeSection === 'invest' && investBranch === 'accounting' && <AccountingBranch />}
        {activeSection === 'invest' && investBranch === 'model' && <InvestModelBranch />}
        {activeSection === 'invest' && investBranch === 'books' && <BooksBranch />}

        {activeSection === 'pulse' && <MarketPulseView onOpenTicker={openTickerInTradeLab} />}
      </div>

      <footer className="border-t border-white/10 bg-[#040706] py-8">
        <div className="mx-auto max-w-[1440px] px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-200">TradeMind</span>
            <span aria-hidden="true">·</span>
            <span>Quantitative Screening, Valuation &amp; Paper Trading Terminal</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button type="button" onClick={() => navigateSection('overview')} className="hover:text-emerald-300 transition-colors">
              Overview
            </button>
            <button type="button" onClick={() => jumpTradingBranch('lab')} className="hover:text-emerald-300 transition-colors">
              Trading Lab
            </button>
            <button type="button" onClick={() => jumpTradingBranch('patterns')} className="hover:text-emerald-300 transition-colors">
              Pattern Academy
            </button>
            <button type="button" onClick={() => jumpInvestBranch('screener')} className="hover:text-emerald-300 transition-colors">
              Screener
            </button>
            <button type="button" onClick={() => jumpInvestBranch('model')} className="hover:text-emerald-300 transition-colors">
              Invest Model
            </button>
            <button type="button" onClick={() => jumpInvestBranch('books')} className="hover:text-emerald-300 transition-colors">
              22 Books
            </button>
            <button type="button" onClick={() => navigateSection('pulse')} className="hover:text-emerald-300 transition-colors">
              Market Pulse
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
