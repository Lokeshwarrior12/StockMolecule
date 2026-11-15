import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  GitBranch,
  GraduationCap,
  Presentation,
  X,
} from 'lucide-react';
import {
  BOOKS_22_LIBRARY,
  BOOK_TRACKS,
  type BookPresentationSpec,
  type BookTrack,
} from '../data/academyContent';

const SLIDE_LABELS = [
  { index: 0, title: '1 · Visual Mind Map', icon: GitBranch },
  { index: 1, title: '2 · Quantitative Diagram', icon: BarChart3 },
  { index: 2, title: '3 · Equation & Scenario', icon: Presentation },
  { index: 3, title: '4 · Chapter Quiz Check', icon: GraduationCap },
];

export function BooksBranch() {
  const [selectedTrack, setSelectedTrack] = useState<'All' | BookTrack>('All');
  const [activeBook, setActiveBook] = useState<BookPresentationSpec | null>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);

  const visibleBooks = useMemo(
    () =>
      selectedTrack === 'All'
        ? BOOKS_22_LIBRARY
        : BOOKS_22_LIBRARY.filter((b) => b.track === selectedTrack),
    [selectedTrack]
  );

  const openBookDeck = (book: BookPresentationSpec) => {
    setActiveBook(book);
    setSlideIndex(0);
    setSelectedQuizAnswer(null);
    setQuizChecked(false);
  };

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Invest Section · 22-Book Curated Visual Learning Library
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            Essential Market Books &amp; Visual Presentations
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Every classic spans 5 tracks (A–E) and opens a dedicated 4-slide visual presentation deck with
            interactive mind maps, quantitative bar diagrams, equation scenarios, and knowledge checks.
          </p>
        </div>

        <span className="font-mono-tabular text-xs text-neutral-300 shrink-0">
          {BOOKS_22_LIBRARY.length} / 22 Books · 5 Curriculum Tracks
        </span>
      </div>

      {/* 5-Track Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedTrack('All')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            selectedTrack === 'All'
              ? 'bg-emerald-500 text-[#03140c] font-semibold'
              : 'border border-white/10 bg-[#0b110f] text-neutral-300 hover:text-white'
          }`}
        >
          All 22 Books
        </button>
        {BOOK_TRACKS.map((trk) => (
          <button
            key={trk}
            type="button"
            onClick={() => setSelectedTrack(trk)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              selectedTrack === trk
                ? 'bg-emerald-500 text-[#03140c] font-semibold'
                : 'border border-white/10 bg-[#0b110f] text-neutral-300 hover:text-white'
            }`}
          >
            {trk}
          </button>
        ))}
      </div>

      {/* 22-Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="books-grid">
        {visibleBooks.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => openBookDeck(book)}
            className="rounded-2xl border border-white/10 bg-[#0b110f] p-5 text-left hover:border-emerald-400/55 transition-colors flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular text-neutral-400">
                <span>#{String(book.id).padStart(2, '0')} · {book.year}</span>
                <span className="text-emerald-300 font-semibold">{book.tag}</span>
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">{book.track}</p>
              <h2 className="mt-2 font-display text-lg font-bold text-white group-hover:text-emerald-300">
                {book.title}
              </h2>
              <p className="text-xs font-medium text-neutral-400">by {book.author}</p>
              <p className="mt-2.5 text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                {book.thesis}
              </p>
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>4-Slide Visual Deck</span>
              </span>
              <span className="font-semibold text-emerald-300">Open Presentation &rarr;</span>
            </div>
          </button>
        ))}
      </div>

      {/* Dedicated 4-Slide Visual Presentation Modal */}
      {activeBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-deck-title"
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0b110f] p-6 shadow-2xl space-y-6">
            {/* Deck Top Bar */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-mono-tabular text-emerald-400">
                  Book #{activeBook.id} · {activeBook.track} · {activeBook.tag}
                </p>
                <h2 id="book-deck-title" className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
                  {activeBook.title} — {activeBook.author} ({activeBook.year})
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close visual presentation"
                onClick={() => setActiveBook(null)}
                className="rounded-lg border border-white/10 p-2 text-neutral-300 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4-Slide Tabs */}
            <div className="flex flex-wrap gap-2">
              {SLIDE_LABELS.map((s) => {
                const Icon = s.icon;
                const active = slideIndex === s.index;
                return (
                  <button
                    key={s.index}
                    type="button"
                    onClick={() => setSlideIndex(s.index)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-emerald-500 text-[#03140c] font-semibold'
                        : 'border border-white/10 bg-[#060a09] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>

            {/* SLIDE 1: Visual Mind Map Diagram */}
            {slideIndex === 0 && (
              <div className="rounded-xl border border-white/10 bg-[#060a09] p-6 space-y-6" data-testid="book-slide-1">
                <p className="text-sm text-neutral-300 leading-relaxed">{activeBook.thesis}</p>

                <div className="flex flex-col items-center space-y-5">
                  <div className="rounded-xl border border-emerald-400/50 bg-emerald-950/30 px-6 py-3 text-center">
                    <p className="text-[11px] font-mono-tabular text-emerald-300">Core Concept Hub</p>
                    <p className="font-display text-xl font-bold text-white">{activeBook.mindMapCenter}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {activeBook.mindMapBranches.map((br, idx) => (
                      <div
                        key={br.branch}
                        className="rounded-xl border border-white/10 bg-[#0b110f] p-4 space-y-1.5"
                      >
                        <p className="font-mono-tabular text-[11px] text-emerald-400">
                          Node 0{idx + 1} · Connected Principle
                        </p>
                        <p className="font-display text-base font-bold text-white">{br.branch}</p>
                        <p className="text-xs text-neutral-400 leading-relaxed">{br.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: Quantitative Comparison Chart */}
            {slideIndex === 1 && (
              <div className="rounded-xl border border-white/10 bg-[#060a09] p-6 space-y-5" data-testid="book-slide-2">
                <h3 className="font-display text-xl font-bold text-white">{activeBook.chartTitle}</h3>
                <div className="space-y-4">
                  {activeBook.chartBars.map((bar) => {
                    const maxVal = Math.max(...activeBook.chartBars.map((b) => b.value), 1);
                    const pct = Math.max(8, Math.round((bar.value / maxVal) * 100));
                    return (
                      <div key={bar.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono-tabular">
                          <span className="font-sans font-medium text-neutral-200">{bar.label}</span>
                          <span className={bar.highlight ? 'text-emerald-300 font-bold' : 'text-neutral-400'}>
                            {bar.value} {bar.unit}
                          </span>
                        </div>
                        <div className="h-3.5 w-full rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${bar.highlight ? 'bg-emerald-500' : 'bg-sky-500/60'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SLIDE 3: Key Equation & 3-Step Flowchart Scenario */}
            {slideIndex === 2 && (
              <div className="rounded-xl border border-white/10 bg-[#060a09] p-6 space-y-6" data-testid="book-slide-3">
                <div className="rounded-xl border border-emerald-500/30 bg-[#0b110f] p-4">
                  <p className="text-xs font-medium text-emerald-300">{activeBook.equationLabel}</p>
                  <p className="mt-1.5 font-mono-tabular text-sm sm:text-base font-bold text-white">
                    {activeBook.equationText}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-300 mb-3">
                    Applied Market Execution Flowchart
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeBook.scenarioSteps.map((step, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/10 bg-[#0b110f] p-4 space-y-2 text-xs"
                      >
                        <p className="font-mono-tabular font-bold text-emerald-400">Step 0{i + 1}</p>
                        <p className="text-neutral-200 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: Chapter Knowledge Check Quiz */}
            {slideIndex === 3 && (
              <div className="rounded-xl border border-white/10 bg-[#060a09] p-6 space-y-4" data-testid="book-slide-4">
                <h3 className="font-display text-xl font-bold text-white">Chapter Mastery Check</h3>
                <p className="text-sm font-medium text-neutral-200">{activeBook.quizQuestion}</p>

                <div className="space-y-2">
                  {activeBook.quizOptions.map((opt, oIdx) => {
                    const picked = selectedQuizAnswer === oIdx;
                    const isRight = oIdx === activeBook.quizCorrectIndex;
                    let cls = 'border-white/10 bg-[#0b110f] text-neutral-300 hover:border-white/30';
                    if (quizChecked) {
                      if (isRight) cls = 'border-emerald-400 bg-emerald-950/50 text-emerald-200';
                      else if (picked) cls = 'border-red-400 bg-red-950/50 text-red-200';
                    } else if (picked) {
                      cls = 'border-emerald-400 bg-emerald-950/30 text-white';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => !quizChecked && setSelectedQuizAnswer(oIdx)}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-xs transition-colors flex items-center justify-between gap-2 ${cls}`}
                      >
                        <span>{opt}</span>
                        {quizChecked && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {quizChecked ? (
                  <p className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs text-emerald-200">
                    {activeBook.quizExplanation}
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={selectedQuizAnswer === null}
                    onClick={() => setQuizChecked(true)}
                    className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-[#03140c] hover:bg-emerald-400 disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                )}
              </div>
            )}

            {/* Slide Prev / Next Controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
              <button
                type="button"
                disabled={slideIndex === 0}
                onClick={() => setSlideIndex((s) => Math.max(0, s - 1))}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-neutral-300 hover:text-white disabled:opacity-35"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Slide</span>
              </button>

              <span className="font-mono-tabular text-neutral-400">Slide {slideIndex + 1} / 4</span>

              <button
                type="button"
                disabled={slideIndex === 3}
                onClick={() => setSlideIndex((s) => Math.min(3, s + 1))}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 font-semibold text-[#03140c] hover:bg-emerald-400 disabled:opacity-35"
              >
                <span>Next Slide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
