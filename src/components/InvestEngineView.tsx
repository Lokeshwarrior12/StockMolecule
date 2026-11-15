import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Columns3, Plus, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { STOCK_UNIVERSE, type TickerProfile } from '../data/marketData';
import type { ScreenerQueryTemplate } from '../data/screenerLibrary';
import {
  applyScreenerFilters,
  rankStocksByStrategy,
  type ScreenerFilter,
  type StrategyWeights,
} from '../utils/marketMath';
import { parseScreenerQueryText } from '../utils/quantModels';
import { PeriodicTile } from './PeriodicTile';
import { ScreenerLibraryPanel } from './ScreenerLibraryPanel';

interface InvestEngineViewProps {
  onOpenTradeChart: (symbol: string) => void;
}

type ColumnKey =
  | 'price'
  | 'changePct'
  | 'marketCapB'
  | 'pe'
  | 'roe'
  | 'roic'
  | 'debtToEquity'
  | 'revGrowth'
  | 'netMargin'
  | 'fcfYield'
  | 'compositeScore';

const ALL_COLUMNS: { key: ColumnKey; label: string; format: (v: number) => string }[] = [
  { key: 'price', label: 'Price', format: (v) => `$${v.toFixed(2)}` },
  { key: 'changePct', label: '1D %', format: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` },
  { key: 'marketCapB', label: 'Mkt Cap ($B)', format: (v) => `$${v.toLocaleString()}B` },
  { key: 'pe', label: 'P/E', format: (v) => `${v.toFixed(1)}x` },
  { key: 'roe', label: 'ROE %', format: (v) => `${v.toFixed(1)}%` },
  { key: 'roic', label: 'ROIC %', format: (v) => `${v.toFixed(1)}%` },
  { key: 'debtToEquity', label: 'Debt / Eq', format: (v) => v.toFixed(2) },
  { key: 'revGrowth', label: 'Rev Gr %', format: (v) => `${v.toFixed(1)}%` },
  { key: 'netMargin', label: 'Net Margin', format: (v) => `${v.toFixed(1)}%` },
  { key: 'fcfYield', label: 'FCF Yield', format: (v) => `${v.toFixed(1)}%` },
  { key: 'compositeScore', label: 'Purity Score', format: (v) => `${v.toFixed(1)}` },
];

const DEFAULT_COLUMNS: ColumnKey[] = ['price', 'pe', 'roe', 'roic', 'debtToEquity', 'revGrowth', 'compositeScore'];

export function InvestEngineView({ onOpenTradeChart }: InvestEngineViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ScreenerFilter[]>([
    { id: 'init-1', field: 'roic', operator: '>=', value: 12 },
  ]);
  const [newField, setNewField] = useState<ScreenerFilter['field']>('roe');
  const [newOperator, setNewOperator] = useState<ScreenerFilter['operator']>('>=');
  const [newValue, setNewValue] = useState('20');

  const [weights, setWeights] = useState<StrategyWeights>({
    quality: 35,
    growth: 25,
    value: 20,
    momentum: 20,
  });

  const [visibleCols, setVisibleCols] = useState<ColumnKey[]>(DEFAULT_COLUMNS);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [savedViewName, setSavedViewName] = useState('Compounder Core');
  const [selectedCompany, setSelectedCompany] = useState<TickerProfile | null>(null);
  const [lastAppliedNotice, setLastAppliedNotice] = useState<{
    title: string;
    mappedCount: number;
    unmappedNotes: string[];
  } | null>(null);

  const handleApplyLibraryTemplate = (template: ScreenerQueryTemplate) => {
    const parsed = parseScreenerQueryText(template.query);
    setFilters(parsed.filters);
    setLastAppliedNotice({
      title: template.name,
      mappedCount: parsed.filters.length,
      unmappedNotes: parsed.unmappedNotes,
    });
  };

  const filteredUniverse = useMemo(
    () => applyScreenerFilters(STOCK_UNIVERSE, filters, searchQuery),
    [filters, searchQuery]
  );

  const rankedFiltered = useMemo(
    () => rankStocksByStrategy(filteredUniverse, weights),
    [filteredUniverse, weights]
  );

  const weeklyTop10 = useMemo(
    () => rankStocksByStrategy(STOCK_UNIVERSE, weights).slice(0, 10),
    [weights]
  );

  const handleAddFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(newValue);
    if (!Number.isFinite(numeric)) return;
    setFilters((prev) => [
      ...prev,
      { id: `flt-${Date.now()}`, field: newField, operator: newOperator, value: numeric },
    ]);
  };

  const handleToggleColumn = (col: ColumnKey) => {
    setVisibleCols((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  };

  const handleMoveColumn = (col: ColumnKey, dir: -1 | 1) => {
    setVisibleCols((prev) => {
      const idx = prev.indexOf(col);
      if (idx < 0) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const applyViewPreset = (preset: 'Compounder Core' | 'Deep Value' | 'Hyper Growth') => {
    setSavedViewName(preset);
    if (preset === 'Compounder Core') {
      setVisibleCols(['price', 'pe', 'roe', 'roic', 'debtToEquity', 'compositeScore']);
      setWeights({ quality: 45, growth: 25, value: 15, momentum: 15 });
    } else if (preset === 'Deep Value') {
      setVisibleCols(['price', 'pe', 'fcfYield', 'debtToEquity', 'netMargin', 'compositeScore']);
      setWeights({ quality: 25, growth: 10, value: 55, momentum: 10 });
    } else {
      setVisibleCols(['price', 'changePct', 'revGrowth', 'netMargin', 'roic', 'compositeScore']);
      setWeights({ quality: 20, growth: 45, value: 5, momentum: 30 });
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-[#38bdf8]">Invest Mode · Research-Driven Screening</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            Screener Engine &amp; Strategy Models
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['Compounder Core', 'Deep Value', 'Hyper Growth'] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyViewPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                savedViewName === preset
                  ? 'bg-[#1d5e8c] text-white'
                  : 'border border-white/10 bg-[#161d22] text-neutral-300 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Top Grid: Strategy Model Weight Sliders (5 cols) + Weekly Top 10 Picks (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-5 rounded-xl border border-white/10 bg-[#11171b] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-2xl font-bold text-white">My Strategy Model</h2>
              <SlidersHorizontal className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              Adjust factor weights to recompute composite purity scores and re-rank Weekly Top 10 Picks live.
            </p>

            <div className="mt-5 space-y-4">
              {(
                [
                  { key: 'quality', label: 'Quality (ROIC & Margins)', color: 'accent-[#52b738]' },
                  { key: 'growth', label: 'Revenue & EPS Growth', color: 'accent-[#38bdf8]' },
                  { key: 'value', label: 'Valuation & FCF Yield', color: 'accent-[#d9822b]' },
                  { key: 'momentum', label: 'Price Trend Momentum', color: 'accent-[#f87171]' },
                ] as const
              ).map((factor) => (
                <div key={factor.key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label htmlFor={`weight-${factor.key}`} className="font-medium text-neutral-200">
                      {factor.label}
                    </label>
                    <span className="font-mono-tabular font-semibold text-white">{weights[factor.key]}%</span>
                  </div>
                  <input
                    id={`weight-${factor.key}`}
                    type="range"
                    min="0"
                    max="100"
                    value={weights[factor.key]}
                    onChange={(e) =>
                      setWeights((prev) => ({
                        ...prev,
                        [factor.key]: Number(e.target.value),
                      }))
                    }
                    className={`w-full cursor-pointer ${factor.color}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-neutral-400">
            <span>Active Profile: {savedViewName}</span>
            <button
              type="button"
              onClick={() => setWeights({ quality: 35, growth: 25, value: 20, momentum: 20 })}
              className="text-[#7dd3fc] hover:text-white font-medium"
            >
              Reset Equalized
            </button>
          </div>
        </section>

        {/* Weekly Top 10 Auto-Ranked Picks */}
        <section className="lg:col-span-7 rounded-xl border border-white/10 bg-[#11171b] p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Weekly Top 10 Picks</h2>
              <p className="text-xs text-neutral-400">Auto-ranked from universe by your live Strategy Model weights</p>
            </div>
            <span className="font-mono-tabular text-xs text-[#64c94b]">Top 10 Ranked</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="weekly-top-10">
            {weeklyTop10.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => setSelectedCompany(stock)}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-[#161d22] px-3.5 py-2.5 text-left hover:border-[#38bdf8]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-tabular text-xs font-bold text-neutral-400 w-5">
                    #{stock.rank}
                  </span>
                  <div>
                    <p className="font-mono-tabular text-sm font-bold text-white">{stock.symbol}</p>
                    <p className="text-[11px] text-neutral-400 truncate max-w-[140px]">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right font-mono-tabular">
                  <p className="text-sm font-bold text-[#7dd3fc]">{stock.compositeScore.toFixed(1)}</p>
                  <p className="text-[11px] text-neutral-400">ROIC {stock.roic.toFixed(0)}%</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Filter Builder & Column Manager Bar */}
      <section id="screener-results-bar" className="rounded-xl border border-white/10 bg-[#11171b] p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Search ticker or sector"
              placeholder="Search ticker, company, sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#0b0f12] pl-9 pr-3 py-2 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
            />
          </div>

          {/* Add Ratio Filter Form */}
          <form onSubmit={handleAddFilter} className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Ratio Field"
              value={newField}
              onChange={(e) => setNewField(e.target.value as ScreenerFilter['field'])}
              className="rounded-lg border border-white/15 bg-[#0b0f12] px-2.5 py-2 text-xs text-white"
            >
              <option value="roe">ROE (%)</option>
              <option value="roic">ROIC (%)</option>
              <option value="pe">P/E Ratio</option>
              <option value="debtToEquity">Debt / Equity</option>
              <option value="revGrowth">Revenue Growth (%)</option>
              <option value="fcfYield">FCF Yield (%)</option>
              <option value="netMargin">Net Margin (%)</option>
            </select>

            <select
              aria-label="Filter Operator"
              value={newOperator}
              onChange={(e) => setNewOperator(e.target.value as ScreenerFilter['operator'])}
              className="rounded-lg border border-white/15 bg-[#0b0f12] px-2.5 py-2 text-xs font-mono-tabular text-white"
            >
              <option value=">=">&gt;=</option>
              <option value=">">&gt;</option>
              <option value="<=">&lt;=</option>
              <option value="<">&lt;</option>
            </select>

            <input
              type="number"
              step="0.1"
              aria-label="Filter Threshold Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-20 rounded-lg border border-white/15 bg-[#0b0f12] px-2.5 py-2 text-xs font-mono-tabular text-white"
            />

            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-lg bg-[#3b8c28] px-3 py-2 text-xs font-semibold text-white hover:bg-[#49a333] transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ratio Rule</span>
            </button>

            <button
              type="button"
              onClick={() => setShowColumnManager((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#161d22] px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
          </form>
        </div>

        {/* Active Filter Rules */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-neutral-400">Active Rules:</span>
            {filters.map((f) => (
              <div
                key={f.id}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#161d22] px-2.5 py-1 text-xs font-mono-tabular text-neutral-200"
              >
                <span>
                  {f.field} {f.operator} {f.value}
                </span>
                <button
                  type="button"
                  aria-label={`Remove filter ${f.field}`}
                  onClick={() => setFilters((prev) => prev.filter((item) => item.id !== f.id))}
                  className="text-neutral-400 hover:text-[#f87171]"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFilters([])}
              className="text-xs text-neutral-400 hover:text-white underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Column Manager Drawer */}
        {showColumnManager && (
          <div className="rounded-lg border border-white/15 bg-[#0b0f12] p-4 space-y-3">
            <p className="text-xs font-semibold text-neutral-200">
              Column Manager (Toggle visibility or reorder columns)
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_COLUMNS.map((col) => {
                const active = visibleCols.includes(col.key);
                return (
                  <div
                    key={col.key}
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs ${
                      active
                        ? 'border-[#38bdf8]/50 bg-[#0d2536] text-[#7dd3fc]'
                        : 'border-white/10 bg-[#161d22] text-neutral-400'
                    }`}
                  >
                    <button type="button" onClick={() => handleToggleColumn(col.key)} className="font-medium">
                      {col.label}
                    </button>
                    {active && (
                      <>
                        <button
                          type="button"
                          aria-label={`Move ${col.label} left`}
                          onClick={() => handleMoveColumn(col.key, -1)}
                          className="hover:text-white"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${col.label} right`}
                          onClick={() => handleMoveColumn(col.key, 1)}
                          className="hover:text-white"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Screener Data Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs" data-testid="screener-table">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="py-2.5 pr-4 font-medium">Rank</th>
                <th className="py-2.5 px-3 font-medium">Company</th>
                <th className="py-2.5 px-3 font-medium">Sector</th>
                {visibleCols.map((colKey) => {
                  const meta = ALL_COLUMNS.find((c) => c.key === colKey)!;
                  return (
                    <th key={colKey} className="py-2.5 px-3 text-right font-medium whitespace-nowrap">
                      {meta.label}
                    </th>
                  );
                })}
                <th className="py-2.5 pl-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono-tabular">
              {rankedFiltered.length === 0 ? (
                <tr>
                  <td colSpan={visibleCols.length + 4} className="py-8 text-center font-sans text-sm text-neutral-400">
                    No equities match the active ratio query. Relax a filter threshold to widen results.
                  </td>
                </tr>
              ) : (
                rankedFiltered.map((stock) => (
                  <tr key={stock.symbol} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 text-neutral-400">#{stock.rank}</td>
                    <td className="py-3 px-3 font-sans">
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(stock)}
                        className="text-left group"
                      >
                        <span className="font-mono-tabular font-bold text-white group-hover:text-[#7dd3fc]">
                          {stock.symbol}
                        </span>
                        <span className="block text-[11px] text-neutral-400">{stock.name}</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 font-sans text-neutral-300 whitespace-nowrap">{stock.sector}</td>
                    {visibleCols.map((colKey) => {
                      const meta = ALL_COLUMNS.find((c) => c.key === colKey)!;
                      const val = stock[colKey];
                      let colorClass = 'text-neutral-200';
                      if (colKey === 'changePct') {
                        colorClass = val >= 0 ? 'text-[#5cd645]' : 'text-[#f87171]';
                      } else if (colKey === 'compositeScore') {
                        colorClass = 'text-[#7dd3fc] font-bold';
                      }
                      return (
                        <td key={colKey} className={`py-3 px-3 text-right whitespace-nowrap ${colorClass}`}>
                          {meta.format(val)}
                        </td>
                      );
                    })}
                    <td className="py-3 pl-3 text-right whitespace-nowrap font-sans">
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(stock)}
                        className="text-xs font-medium text-[#7dd3fc] hover:text-white mr-3"
                      >
                        Financials
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenTradeChart(stock.symbol)}
                        className="text-xs font-medium text-[#64c94b] hover:text-white"
                      >
                        Chart
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 85-Query Global Stock Screener Library */}
      <ScreenerLibraryPanel
        onApplyQueryTemplate={handleApplyLibraryTemplate}
        lastAppliedNotice={lastAppliedNotice}
      />

      {/* Company Deep-Dive Dialog */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#11171b] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <PeriodicTile
                  atomicNumber={selectedCompany.atomicNumber}
                  symbol={selectedCompany.atomicSymbol}
                  variant="cobalt"
                  size="md"
                />
                <div>
                  <h2 id="company-modal-title" className="font-display text-3xl font-bold text-white">
                    {selectedCompany.symbol} · {selectedCompany.name}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {selectedCompany.sector} · Market Cap ${selectedCompany.marketCapB.toLocaleString()}B
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close company financials"
                onClick={() => setSelectedCompany(null)}
                className="rounded-lg border border-white/10 p-2 text-neutral-300 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">{selectedCompany.catalystNote}</p>

            {/* Key Fundamental Ratios */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tabular">
              <div className="rounded-lg border border-white/10 bg-[#0b0f12] p-3">
                <p className="text-[11px] text-neutral-400">P/E Ratio</p>
                <p className="mt-1 text-base font-bold text-white">{selectedCompany.pe.toFixed(1)}x</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#0b0f12] p-3">
                <p className="text-[11px] text-neutral-400">ROIC</p>
                <p className="mt-1 text-base font-bold text-[#64c94b]">{selectedCompany.roic.toFixed(1)}%</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#0b0f12] p-3">
                <p className="text-[11px] text-neutral-400">Debt / Equity</p>
                <p className="mt-1 text-base font-bold text-white">{selectedCompany.debtToEquity.toFixed(2)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#0b0f12] p-3">
                <p className="text-[11px] text-neutral-400">FCF Yield</p>
                <p className="mt-1 text-base font-bold text-[#e89b3c]">{selectedCompany.fcfYield.toFixed(1)}%</p>
              </div>
            </div>

            {/* 5-Year Revenue & Net Margin Trajectory */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-neutral-300 mb-3">
                5-Year Revenue ($B) &amp; Net Margin Trajectory
              </h3>
              <div className="grid grid-cols-5 gap-3 items-end h-36 rounded-lg border border-white/10 bg-[#0b0f12] p-4">
                {selectedCompany.annualRevenueB.map((row) => {
                  const maxRev = Math.max(...selectedCompany.annualRevenueB.map((r) => r.revB), 1);
                  const heightPct = Math.max(12, Math.round((row.revB / maxRev) * 100));
                  return (
                    <div key={row.year} className="flex flex-col items-center justify-end h-full">
                      <span className="font-mono-tabular text-[10px] text-neutral-300 mb-1">${row.revB}B</span>
                      <div
                        className="w-full max-w-[36px] rounded-t bg-[#38bdf8]/80"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="mt-1.5 font-mono-tabular text-[10px] text-neutral-400">{row.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Peer Comparison */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <span>Peers:</span>
                {selectedCompany.peers.map((peerSym) => {
                  const peer = STOCK_UNIVERSE.find((s) => s.symbol === peerSym);
                  return (
                    <button
                      key={peerSym}
                      type="button"
                      onClick={() => peer && setSelectedCompany(peer)}
                      disabled={!peer}
                      className="rounded border border-white/15 bg-[#161d22] px-2.5 py-1 font-mono-tabular text-xs text-white hover:border-[#38bdf8] disabled:opacity-40"
                    >
                      {peerSym}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  const sym = selectedCompany.symbol;
                  setSelectedCompany(null);
                  onOpenTradeChart(sym);
                }}
                className="rounded-lg bg-[#3b8c28] px-4 py-2 text-xs font-semibold text-white hover:bg-[#49a333] transition-colors"
              >
                Open {selectedCompany.symbol} in Trade Lab
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
