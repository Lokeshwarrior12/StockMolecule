import { useMemo, useState } from 'react';
import { BookMarked, Check, Copy, Info, Play, Search } from 'lucide-react';
import {
  SCREENER_CATEGORIES,
  SCREENER_IMPLEMENTATION_NOTES,
  SCREENER_LIBRARY_85,
  type ScreenerQueryTemplate,
} from '../data/screenerLibrary';

interface ScreenerLibraryPanelProps {
  onApplyQueryTemplate: (template: ScreenerQueryTemplate) => void;
  lastAppliedNotice: {
    title: string;
    mappedCount: number;
    unmappedNotes: string[];
  } | null;
}

export function ScreenerLibraryPanel({
  onApplyQueryTemplate,
  lastAppliedNotice,
}: ScreenerLibraryPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchText, setSearchText] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  const visibleQueries = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return SCREENER_LIBRARY_85.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.query.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, searchText]);

  const handleCopy = (item: ScreenerQueryTemplate) => {
    try {
      navigator.clipboard?.writeText(item.query);
    } catch {
      // Clipboard API fallback ignored cleanly
    }
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId((cur) => (cur === item.id ? null : cur)), 1800);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Global Stock Screener Query Library · 85 Institutional Templates Across 10 Categories
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Ready-to-Run Quantitative Query Templates
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Search 85 screener queries"
              placeholder="Search 85 screens (e.g. Magic Formula)..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-full border border-white/15 bg-[#060a09] pl-8 pr-3 py-1.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowNotes((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#060a09] px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Implementation Notes (6)</span>
          </button>
        </div>
      </div>

      {/* Active Query Injection Feedback */}
      {lastAppliedNotice && (
        <div
          className="rounded-xl border border-emerald-500/35 bg-emerald-950/25 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          data-testid="screener-applied-notice"
        >
          <div className="space-y-1">
            <p className="font-semibold text-emerald-300">
              Executed &ldquo;{lastAppliedNotice.title}&rdquo; in Screener ({lastAppliedNotice.mappedCount} numeric ratio filters applied).
            </p>
            {lastAppliedNotice.unmappedNotes.length > 0 && (
              <p className="text-neutral-300">
                Time-series / technical clauses noted for reference: {lastAppliedNotice.unmappedNotes.join(' · ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => document.getElementById('screener-results-bar')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30 whitespace-nowrap shrink-0"
          >
            Jump to Filtered Stocks &uarr;
          </button>
        </div>
      )}

      {/* 6 Implementation Notes Drawer */}
      {showNotes && (
        <div className="rounded-xl border border-white/15 bg-[#060a09] p-4 space-y-2 text-xs">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
            <span>Global Screener Normalization &amp; Implementation Notes</span>
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-neutral-300">
            {SCREENER_IMPLEMENTATION_NOTES.map((note, idx) => (
              <li key={idx} className="leading-relaxed">
                <strong className="text-emerald-300">{idx + 1}.</strong> {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 10 Category Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-emerald-500 text-[#03140c] font-semibold'
              : 'border border-white/10 bg-[#060a09] text-neutral-300 hover:text-white'
          }`}
        >
          All ({SCREENER_LIBRARY_85.length})
        </button>
        {SCREENER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-[#03140c] font-semibold'
                : 'border border-white/10 bg-[#060a09] text-neutral-300 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Query Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[540px] overflow-y-auto pr-1">
        {visibleQueries.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-white/10 bg-[#060a09] p-4 flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular text-neutral-400">
                <span>#{item.id} · {item.category}</span>
                {item.requiresHistorical && <span className="text-amber-300">Time-Series</span>}
              </div>
              <h3 className="mt-1 font-display text-base font-bold text-white">{item.name}</h3>
              <pre className="mt-2.5 rounded-lg border border-white/10 bg-[#0b110f] p-2.5 font-mono-tabular text-[11px] text-emerald-200/90 whitespace-pre-wrap leading-relaxed">
                {item.query}
              </pre>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(item)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Query</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onApplyQueryTemplate(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Run in Screener</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
