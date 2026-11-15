import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileSpreadsheet } from 'lucide-react';
import { ACCOUNTING_RATIO_CATEGORIES, type RatioCategorySpec } from '../data/academyContent';
import { STOCK_UNIVERSE } from '../data/marketData';
import { getExtendedMetrics } from '../utils/quantModels';

const MODULE_6_CHECKLIST = [
  'Verify Net Income closely tracks Operating Cash Flow (FCF / Net Income >= 0.85x over 3Y).',
  'Inspect Accounts Receivable vs. Revenue growth: surging DSO flags aggressive credit sales.',
  'Confirm Total Debt / EBITDA < 2.0x and Interest Coverage > 5.0x before macro tightening.',
  'Check 10-K Footnotes for off-balance-sheet leases, pension deficits, and debt maturity walls.',
  'Track diluted share count trend: watch whether Stock-Based Compensation offsets buybacks.',
  'Audit Inventory breakdown (Raw Materials vs. Finished Goods buildup) for demand slowdowns.',
];

export function AccountingBranch() {
  const [selectedSymbol, setSelectedSymbol] = useState(STOCK_UNIVERSE[0].symbol);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ACCOUNTING_RATIO_CATEGORIES[0].id);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({ 0: true, 2: true });

  const stock = useMemo(
    () => STOCK_UNIVERSE.find((s) => s.symbol === selectedSymbol) ?? STOCK_UNIVERSE[0],
    [selectedSymbol]
  );
  const ext = useMemo(() => getExtendedMetrics(stock), [stock]);

  // Derived realistic 3-statement snapshot from TickerProfile latest annual revenue ($B)
  const latestRevB = stock.annualRevenueB[stock.annualRevenueB.length - 1]?.revB ?? 50;
  const ebitB = Number(((latestRevB * ext.operatingMargin) / 100).toFixed(2));
  const netIncomeB = Number(((latestRevB * stock.netMargin) / 100).toFixed(2));
  const fcfB = Number(((stock.marketCapB * stock.fcfYield) / 100).toFixed(2));
  const estEquityB = Number((stock.marketCapB / Math.max(stock.pb, 0.5)).toFixed(2));
  const estDebtB = Number((estEquityB * stock.debtToEquity).toFixed(2));

  const activeCategory: RatioCategorySpec =
    ACCOUNTING_RATIO_CATEGORIES.find((c) => c.id === selectedCategoryId) ?? ACCOUNTING_RATIO_CATEGORIES[0];

  const toggleAudit = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Invest Section · Accounting Fundamentals &amp; Forensic Statements
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            3-Statement Architecture &amp; 8 Ratio Pillars
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Trace how Income Statement earnings flow into Balance Sheet equity and Operating Cash Flow, inspect
            all 8 institutional ratio families (A–H), and run a 10-K audit check on live tickers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="acct-ticker" className="text-xs text-neutral-400">
            Audit Company:
          </label>
          <select
            id="acct-ticker"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="rounded-lg border border-white/15 bg-[#0b110f] px-3 py-2 text-xs font-mono-tabular font-semibold text-white"
          >
            {STOCK_UNIVERSE.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} · {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live 3-Statement Interactive Linkage */}
      <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-white">
              3-Statement Flow Snapshot ({stock.symbol})
            </h2>
          </div>
          <span className="font-mono-tabular text-xs text-neutral-400">TTM Normalized ($ Billions)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-tabular text-xs">
          {/* Statement 1: Income Statement */}
          <div className="rounded-xl border border-emerald-500/20 bg-[#060a09] p-4 space-y-2.5">
            <p className="font-sans text-sm font-bold text-emerald-300">1. Income Statement (Flow)</p>
            <div className="flex justify-between">
              <span className="text-neutral-400">Revenue</span>
              <span className="text-white font-semibold">${latestRevB.toFixed(1)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Operating Income (EBIT)</span>
              <span className="text-white font-semibold">${ebitB.toFixed(1)}B ({ext.operatingMargin}%)</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-neutral-300">GAAP Net Income</span>
              <span className="text-emerald-300 font-bold">${netIncomeB.toFixed(1)}B ({stock.netMargin}%)</span>
            </div>
          </div>

          {/* Statement 2: Balance Sheet */}
          <div className="rounded-xl border border-sky-500/20 bg-[#060a09] p-4 space-y-2.5">
            <p className="font-sans text-sm font-bold text-sky-300">2. Balance Sheet (Snapshot)</p>
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Debt (Est.)</span>
              <span className="text-white font-semibold">${estDebtB.toFixed(1)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Shareholders Equity</span>
              <span className="text-white font-semibold">${estEquityB.toFixed(1)}B</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-neutral-300">Debt / Equity · Current Ratio</span>
              <span className="text-sky-300 font-bold">
                {stock.debtToEquity.toFixed(2)}x · {ext.currentRatio.toFixed(2)}x
              </span>
            </div>
          </div>

          {/* Statement 3: Cash Flow */}
          <div className="rounded-xl border border-amber-500/20 bg-[#060a09] p-4 space-y-2.5">
            <p className="font-sans text-sm font-bold text-amber-300">3. Cash Flow (Truth Check)</p>
            <div className="flex justify-between">
              <span className="text-neutral-400">Free Cash Flow (FCF)</span>
              <span className="text-white font-semibold">${fcfB.toFixed(1)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">FCF Yield vs Price</span>
              <span className="text-white font-semibold">{stock.fcfYield.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-neutral-300">Piotroski F-Score / ROIC</span>
              <span className="text-amber-300 font-bold">
                {ext.piotroskiScore}/9 · {stock.roic.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Category Ratios & Equations Workbench (Categories A - H) */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            8-Category Financial Ratios &amp; Equations (A – H)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Select a category to examine institutional formulas, target thresholds, and common accounting distortions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ACCOUNTING_RATIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCategory.id === cat.id
                  ? 'bg-emerald-500 text-[#03140c] font-semibold'
                  : 'border border-white/10 bg-[#0b110f] text-neutral-300 hover:text-white'
              }`}
            >
              {cat.letter}. {cat.title}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-5">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-display text-2xl font-bold text-white">
              Category {activeCategory.letter}: {activeCategory.title}
            </h3>
            <p className="mt-1 text-xs text-neutral-400">{activeCategory.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCategory.ratios.map((r) => (
              <div
                key={r.name}
                className="rounded-xl border border-white/10 bg-[#060a09] p-4 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-bold text-white">{r.name}</span>
                  <span className="font-mono-tabular text-emerald-300 font-semibold">{r.benchmark}</span>
                </div>
                <p className="rounded-lg border border-white/10 bg-[#0b110f] px-3 py-2 font-mono-tabular text-sky-300">
                  {r.formula}
                </p>
                <p className="text-amber-200/90 flex items-start gap-1.5 leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">Audit Trap:</strong> {r.pitfall}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Practical 10-K Fundamental Audit Checklist */}
      <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-white">
              Module 6 · 10-K Forensics &amp; Pre-Investment Audit Checklist
            </h2>
          </div>
          <span className="font-mono-tabular text-xs text-emerald-300">
            {Object.values(checkedSteps).filter(Boolean).length} / {MODULE_6_CHECKLIST.length} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODULE_6_CHECKLIST.map((item, idx) => {
            const done = !!checkedSteps[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleAudit(idx)}
                className={`rounded-xl border p-3.5 text-left text-xs transition-colors flex items-start gap-2.5 ${
                  done
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-100'
                    : 'border-white/10 bg-[#060a09] text-neutral-300 hover:border-white/25'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${done ? 'text-emerald-400' : 'text-neutral-600'}`}
                />
                <span className="leading-relaxed">{item}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
