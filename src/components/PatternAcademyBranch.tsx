import { useMemo, useState } from 'react';
import { Award, CheckCircle2, Search, ShieldAlert, Target, X } from 'lucide-react';
import {
  PATTERN_QUIZ,
  TRADING_PATTERNS_75,
  type PatternBias,
  type PatternFamily,
  type TradingPatternSpec,
} from '../data/patternsData';

const FAMILIES: ('All' | PatternFamily)[] = [
  'All',
  'Single-Candle',
  'Dual-Candle',
  'Triple & Multi-Candle',
  'Classical Chart & Breakout',
];

function PatternDiagramSvg({ pattern, tall = false }: { pattern: TradingPatternSpec; tall?: boolean }) {
  const count = pattern.candles.length;
  const colSpan = 100 / Math.max(count + 1, 2);

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full rounded-lg border border-white/10 bg-[#050807] ${tall ? 'h-48' : 'h-28'}`}
      aria-label={`${pattern.name} visual candlestick diagram`}
    >
      {/* Faint structural grid */}
      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />

      {/* Classical Pattern Trendlines / Necklines */}
      {pattern.trendLines?.map((tl, idx) => {
        const stroke =
          tl.kind === 'support'
            ? '#34d399'
            : tl.kind === 'resistance'
              ? '#f87171'
              : tl.kind === 'neckline'
                ? '#fbbf24'
                : '#38bdf8';
        return (
          <line
            key={idx}
            x1={tl.x1}
            y1={tl.y1}
            x2={tl.x2}
            y2={tl.y2}
            stroke={stroke}
            strokeWidth="1.2"
            strokeDasharray={tl.kind === 'neckline' ? '3 2' : undefined}
            strokeOpacity="0.85"
          />
        );
      })}

      {/* Candlesticks */}
      {pattern.candles.map((c, idx) => {
        const cx = colSpan * (idx + 1);
        const bodyTop = Math.min(c.openY, c.closeY);
        const bodyHeight = Math.max(Math.abs(c.closeY - c.openY), c.doji ? 1.5 : 3.5);
        const width = count >= 6 ? 7.5 : count >= 4 ? 9.5 : 12;
        const fill = c.doji ? '#fbbf24' : c.bull ? '#10b981' : '#ef4444';

        return (
          <g key={idx}>
            <line x1={cx} y1={c.highY} x2={cx} y2={c.lowY} stroke={fill} strokeWidth="1.4" />
            <rect
              x={cx - width / 2}
              y={bodyTop}
              width={width}
              height={bodyHeight}
              rx="1.2"
              fill={fill}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function PatternAcademyBranch() {
  const [familyFilter, setFamilyFilter] = useState<'All' | PatternFamily>('All');
  const [biasFilter, setBiasFilter] = useState<'All' | PatternBias>('All');
  const [searchText, setSearchText] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<TradingPatternSpec | null>(null);

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredPatterns = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return TRADING_PATTERNS_75.filter((p) => {
      if (familyFilter !== 'All' && p.family !== familyFilter) return false;
      if (biasFilter !== 'All' && p.bias !== biasFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.anatomy.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [familyFilter, biasFilter, searchText]);

  const quizScore = useMemo(
    () => PATTERN_QUIZ.reduce((acc, q) => (quizAnswers[q.id] === q.correctIndex ? acc + 1 : acc), 0),
    [quizAnswers]
  );

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-10">
      {/* Header matching ChartGuys Cheat Sheet clarity */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Trading Section · Pattern Academy · 75-Pattern Classification Framework
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            Candlestick &amp; Breakout Pattern Cheat Sheet
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Visual OHLC anatomy, Single/Dual/Triple candle formations, and classical breakout structures with
            exact trigger, stop-loss, and measured target rules.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-tabular text-neutral-300 shrink-0">
          <span>Cataloged: {TRADING_PATTERNS_75.length} / 75 Patterns</span>
          <span aria-hidden="true">·</span>
          <span>Showing: {filteredPatterns.length}</span>
        </div>
      </div>

      {/* Candle Anatomy Blueprint (Bullish, Bearish & Doji Reference from Cheat Sheet PDF) */}
      <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h2 className="font-display text-2xl font-bold text-white">OHLC Candle Anatomy Blueprint</h2>
          <span className="text-xs text-neutral-400">Real Body = Institutional Conviction · Wicks = Rejection</span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bullish Candle Diagram */}
          <div className="rounded-xl border border-emerald-500/20 bg-[#060a09] p-4 flex items-center gap-4">
            <svg viewBox="0 0 80 110" className="w-20 h-28 shrink-0" aria-hidden="true">
              <line x1="25" y1="10" x2="25" y2="100" stroke="#10b981" strokeWidth="2.5" />
              <rect x="14" y="30" width="22" height="50" rx="2" fill="#10b981" />
              <text x="43" y="15" fill="#9ca3af" fontSize="8">High</text>
              <text x="43" y="34" fill="#6ee7b7" fontSize="8">Close</text>
              <text x="43" y="82" fill="#9ca3af" fontSize="8">Open</text>
              <text x="43" y="101" fill="#9ca3af" fontSize="8">Low</text>
            </svg>
            <div className="text-xs space-y-1.5">
              <p className="font-semibold text-emerald-300">Bullish (Up) Candle</p>
              <p className="text-neutral-300 leading-relaxed">
                Closes cleanly above the Open. Long lower shadow reveals dip-buyers absorbing selling pressure.
              </p>
            </div>
          </div>

          {/* Bearish Candle Diagram */}
          <div className="rounded-xl border border-red-500/20 bg-[#060a09] p-4 flex items-center gap-4">
            <svg viewBox="0 0 80 110" className="w-20 h-28 shrink-0" aria-hidden="true">
              <line x1="25" y1="10" x2="25" y2="100" stroke="#ef4444" strokeWidth="2.5" />
              <rect x="14" y="30" width="22" height="50" rx="2" fill="#ef4444" />
              <text x="43" y="15" fill="#9ca3af" fontSize="8">High</text>
              <text x="43" y="34" fill="#9ca3af" fontSize="8">Open</text>
              <text x="43" y="82" fill="#fca5a5" fontSize="8">Close</text>
              <text x="43" y="101" fill="#9ca3af" fontSize="8">Low</text>
            </svg>
            <div className="text-xs space-y-1.5">
              <p className="font-semibold text-red-300">Bearish (Down) Candle</p>
              <p className="text-neutral-300 leading-relaxed">
                Closes beneath the Open. Tall upper shadow warns overhead supply overwhelmed opening buyers.
              </p>
            </div>
          </div>

          {/* Doji Equilibrium Diagram */}
          <div className="rounded-xl border border-amber-500/20 bg-[#060a09] p-4 flex items-center gap-4">
            <svg viewBox="0 0 80 110" className="w-20 h-28 shrink-0" aria-hidden="true">
              <line x1="25" y1="14" x2="25" y2="96" stroke="#fbbf24" strokeWidth="2.5" />
              <rect x="12" y="53" width="26" height="4" rx="1" fill="#fbbf24" />
              <text x="43" y="18" fill="#9ca3af" fontSize="8">High</text>
              <text x="43" y="58" fill="#fde68a" fontSize="8">O ≈ C</text>
              <text x="43" y="96" fill="#9ca3af" fontSize="8">Low</text>
            </svg>
            <div className="text-xs space-y-1.5">
              <p className="font-semibold text-amber-300">Equilibrium Doji</p>
              <p className="text-neutral-300 leading-relaxed">
                Open equals Close after intraday battle. Signals exhaustion when printed at major extremes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {FAMILIES.map((fam) => (
              <button
                key={fam}
                type="button"
                onClick={() => setFamilyFilter(fam)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  familyFilter === fam
                    ? 'bg-emerald-500 text-[#03140c] font-semibold'
                    : 'border border-white/10 bg-[#0b110f] text-neutral-300 hover:text-white'
                }`}
              >
                {fam}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0b110f] p-1">
              {(['All', 'Bullish', 'Bearish', 'Neutral'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBiasFilter(b)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    biasFilter === b ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="relative w-60">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search patterns"
                placeholder="Filter 75 patterns..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-[#0b110f] pl-8 pr-3 py-1.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 75-Pattern Cheat Sheet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="patterns-grid">
          {filteredPatterns.map((p) => {
            const biasColor =
              p.bias === 'Bullish'
                ? 'text-emerald-300'
                : p.bias === 'Bearish'
                  ? 'text-red-300'
                  : 'text-amber-300';

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPattern(p)}
                className="rounded-xl border border-white/10 bg-[#0b110f] p-4 text-left hover:border-emerald-400/50 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular text-neutral-400 mb-2">
                    <span>#{String(p.id).padStart(2, '0')} · {p.family}</span>
                    <span className={`font-semibold ${biasColor}`}>{p.bias}</span>
                  </div>

                  <PatternDiagramSvg pattern={p} />

                  <h3 className="mt-3 font-display text-base font-bold text-white group-hover:text-emerald-300">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {p.anatomy}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Reliability: {p.reliability}</span>
                  <span className="text-emerald-300 font-medium">View Setup &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Pattern Certification Quiz */}
      <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-white">Pattern Execution Check</h2>
          </div>
          {quizSubmitted && (
            <span className="font-mono-tabular text-sm font-semibold text-emerald-300">
              Score: {quizScore} / {PATTERN_QUIZ.length}
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {PATTERN_QUIZ.map((q, qIdx) => (
            <div key={q.id} className="rounded-xl border border-white/10 bg-[#060a09] p-4 space-y-3">
              <p className="text-sm font-semibold text-white">
                {qIdx + 1}. {q.question}
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oIdx) => {
                  const picked = quizAnswers[q.id] === oIdx;
                  const isCorrect = q.correctIndex === oIdx;
                  let cls = 'border-white/10 bg-[#0b110f] text-neutral-300 hover:border-white/25';
                  if (quizSubmitted) {
                    if (isCorrect) cls = 'border-emerald-400 bg-emerald-950/50 text-emerald-200';
                    else if (picked) cls = 'border-red-400 bg-red-950/50 text-red-200';
                  } else if (picked) {
                    cls = 'border-emerald-400 bg-emerald-950/30 text-white';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => !quizSubmitted && setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors flex items-center justify-between gap-2 ${cls}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && <p className="text-xs text-neutral-400">{q.explanation}</p>}
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          {quizSubmitted ? (
            <button
              type="button"
              onClick={() => {
                setQuizAnswers({});
                setQuizSubmitted(false);
              }}
              className="rounded-full border border-white/15 px-5 py-2 text-xs font-medium text-neutral-200 hover:bg-white/5"
            >
              Retake Check
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-[#03140c] hover:bg-emerald-400"
            >
              Verify Pattern Rules
            </button>
          )}
        </div>
      </section>

      {/* Pattern Setup Modal */}
      {selectedPattern && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pattern-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0b110f] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-mono-tabular text-emerald-400">
                  Pattern #{selectedPattern.id} · {selectedPattern.family} · {selectedPattern.bias}
                </p>
                <h2 id="pattern-modal-title" className="mt-1 font-display text-3xl font-bold text-white">
                  {selectedPattern.name}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close pattern detail"
                onClick={() => setSelectedPattern(null)}
                className="rounded-lg border border-white/10 p-2 text-neutral-300 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <PatternDiagramSvg pattern={selectedPattern} tall />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-[#060a09] p-3.5">
                <p className="font-semibold text-neutral-200">Context Rule</p>
                <p className="mt-1 text-neutral-400 leading-relaxed">{selectedPattern.contextRule}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#060a09] p-3.5">
                <p className="font-semibold text-neutral-200">Structural Anatomy</p>
                <p className="mt-1 text-neutral-400 leading-relaxed">{selectedPattern.anatomy}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-[#060a09] p-3.5">
                <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Entry Trigger</span>
                </p>
                <p className="mt-1 text-neutral-300 leading-relaxed">{selectedPattern.trigger}</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-[#060a09] p-3.5">
                <p className="font-semibold text-red-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Stop-Loss &amp; Target</span>
                </p>
                <p className="mt-1 text-neutral-300">Stop: {selectedPattern.stopLoss}</p>
                <p className="mt-1 text-emerald-300">Target: {selectedPattern.target}</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-[#060a09] p-3.5 text-xs">
              <p className="font-semibold text-amber-300">Common Trap / Failure Mode</p>
              <p className="mt-1 text-neutral-300">{selectedPattern.failureMode}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
