import { useState } from 'react';
import { ArrowUpRight, Flame, Radio, Users } from 'lucide-react';
import { PULSE_NEWS, STOCK_UNIVERSE, STRATEGISTS_TO_FOLLOW } from '../data/marketData';

interface MarketPulseViewProps {
  onOpenTicker: (symbol: string) => void;
}

export function MarketPulseView({ onOpenTicker }: MarketPulseViewProps) {
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Bullish' | 'Bearish' | 'Neutral'>('All');
  const [followedIds, setFollowedIds] = useState<string[]>(['s1']);

  const filteredNews =
    sentimentFilter === 'All'
      ? PULSE_NEWS
      : PULSE_NEWS.filter((item) => item.sentiment === sentimentFilter);

  const sectorStats = [
    { name: 'Semiconductors', changePct: 2.67, leaders: 'NVDA · AVGO · ASML' },
    { name: 'Foundry & Silicon', changePct: 1.45, leaders: 'TSM · AAPL' },
    { name: 'Payments & Rail', changePct: 0.79, leaders: 'V · JPM' },
    { name: 'Cloud & AI', changePct: 0.35, leaders: 'MSFT · GOOGL' },
    { name: 'Energy Basin', changePct: -0.79, leaders: 'XOM' },
    { name: 'Biopharma', changePct: -1.32, leaders: 'LLY' },
  ];

  const toggleFollow = (id: string) => {
    setFollowedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-[#64c94b]">Shared Platform · Market Pulse</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            Sector Breadth, Algo-AI Catalyst Wire &amp; Strategists
          </h1>
        </div>
        <div className="font-mono-tabular text-xs text-neutral-300">
          <span>Regime: </span>
          <strong className="text-[#64c94b]">Risk-On Expansion</strong>
          <span className="mx-2 text-neutral-600">|</span>
          <span>Breadth: </span>
          <strong className="text-white">
            {STOCK_UNIVERSE.filter((s) => s.changePct > 0).length} / {STOCK_UNIVERSE.length} Advancing
          </strong>
        </div>
      </div>

      {/* Sector Heatmap Grid */}
      <section aria-label="Sector Breadth Overview">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-neutral-300">
          <Flame className="w-4 h-4 text-[#e89b3c]" />
          <span>Sector Velocity</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectorStats.map((sec) => {
            const up = sec.changePct >= 0;
            return (
              <div
                key={sec.name}
                className={`rounded-xl border p-4 ${
                  up
                    ? 'border-[#52b738]/35 bg-[#102011]'
                    : 'border-[#ef4444]/35 bg-[#241010]'
                }`}
              >
                <p className="text-xs font-semibold text-white truncate">{sec.name}</p>
                <p
                  className={`mt-1 font-mono-tabular text-lg font-bold ${
                    up ? 'text-[#5cd645]' : 'text-[#f87171]'
                  }`}
                >
                  {up ? '+' : ''}
                  {sec.changePct.toFixed(2)}%
                </p>
                <p className="mt-1 text-[11px] text-neutral-400 truncate">{sec.leaders}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Split: Algo-AI Catalyst Feed (7 cols) + Strategists to Follow (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-xl border border-white/10 bg-[#11171b] p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#38bdf8]" />
              <h2 className="font-display text-2xl font-bold text-white">Algo-AI Catalyst Feed</h2>
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-[#0b0f12] p-1 border border-white/10">
              {(['All', 'Bullish', 'Neutral', 'Bearish'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSentimentFilter(tab)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    sentimentFilter === tab ? 'bg-[#3b8c28] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {filteredNews.map((item) => (
              <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-200">{item.source}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.timestamp}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        item.sentiment === 'Bullish'
                          ? 'text-[#5cd645] font-medium'
                          : item.sentiment === 'Bearish'
                            ? 'text-[#f87171] font-medium'
                            : 'text-[#e89b3c] font-medium'
                      }
                    >
                      {item.sentiment}
                    </span>
                  </div>
                  <span className="font-mono-tabular text-neutral-300">Impact {item.impactScore.toFixed(1)}/10</span>
                </div>

                <h3 className="mt-1.5 text-base font-semibold text-white">{item.headline}</h3>
                <p className="mt-1 text-xs text-neutral-300 leading-relaxed">{item.summary}</p>

                <button
                  type="button"
                  onClick={() => onOpenTicker(item.ticker)}
                  className="mt-2.5 inline-flex items-center gap-1 font-mono-tabular text-xs font-semibold text-[#7dd3fc] hover:text-white"
                >
                  <span>Inspect {item.ticker} Chart</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-5 rounded-xl border border-white/10 bg-[#11171b] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Users className="w-4 h-4 text-[#e89b3c]" />
            <h2 className="font-display text-2xl font-bold text-white">Strategists to Follow</h2>
          </div>

          <div className="space-y-4">
            {STRATEGISTS_TO_FOLLOW.map((person) => {
              const following = followedIds.includes(person.id);
              return (
                <div
                  key={person.id}
                  className="rounded-xl border border-white/10 bg-[#161d22] p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{person.name}</p>
                      <p className="text-xs text-neutral-400">
                        {person.handle} · {person.specialty}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFollow(person.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        following
                          ? 'border border-[#52b738]/50 bg-[#3b8c28]/20 text-[#86efac]'
                          : 'bg-[#3b8c28] text-white hover:bg-[#49a333]'
                      }`}
                    >
                      {following ? 'Following' : 'Follow'}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">{person.thesis}</p>

                  <div className="flex items-center gap-4 font-mono-tabular text-xs text-neutral-400">
                    <span>Win Rate: {person.winRatePct.toFixed(1)}%</span>
                    <span>·</span>
                    <span>Sharpe: {person.sharpe.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}
