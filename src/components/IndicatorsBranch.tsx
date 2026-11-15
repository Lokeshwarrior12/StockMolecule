import { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import {
  INDICATORS_CURRICULUM,
  type IndicatorLessonSpec,
  type IndicatorPillar,
} from '../data/academyContent';

const PILLARS: IndicatorPillar[] = [
  'Trend Indicators',
  'Momentum Indicators',
  'Volume Indicators',
  'Volatility Indicators',
  'Support & Resistance',
];

const SAMPLE_PRICES = [
  118, 121, 119, 124, 128, 125, 130, 134, 131, 136, 133, 138, 142, 139, 145, 149, 146, 152, 150, 156,
];

function IndicatorSimulationSvg({
  indicator,
  sensitivity,
}: {
  indicator: IndicatorLessonSpec;
  sensitivity: number;
}) {
  const pathPoints = useMemo(() => {
    const n = SAMPLE_PRICES.length;
    const width = 420;
    const height = 160;
    const padX = 16;

    const priceMin = 112;
    const priceMax = 162;
    const mapY = (val: number) =>
      height - 16 - ((val - priceMin) / (priceMax - priceMin)) * (height - 32);

    const priceLine = SAMPLE_PRICES.map((p, i) => {
      const x = padX + (i / (n - 1)) * (width - padX * 2);
      const y = mapY(p);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Parameterized overlay / oscillator wave
    const smoothFactor = Math.max(2, Math.round(sensitivity));
    const secondaryLine = SAMPLE_PRICES.map((p, i) => {
      const start = Math.max(0, i - smoothFactor + 1);
      const slice = SAMPLE_PRICES.slice(start, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      const x = padX + (i / (n - 1)) * (width - padX * 2);
      const y = mapY(avg);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const upperBand = SAMPLE_PRICES.map((p, i) => {
      const x = padX + (i / (n - 1)) * (width - padX * 2);
      const offset = 5 + sensitivity * 0.9;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${mapY(p - 2 + offset).toFixed(1)}`;
    }).join(' ');

    const lowerBand = SAMPLE_PRICES.map((p, i) => {
      const x = padX + (i / (n - 1)) * (width - padX * 2);
      const offset = 5 + sensitivity * 0.9;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${mapY(p - 2 - offset).toFixed(1)}`;
    }).join(' ');

    return { priceLine, secondaryLine, upperBand, lowerBand };
  }, [sensitivity]);

  if (indicator.simType === 'fib') {
    const levels = [
      { label: '0.0% Swing High ($160)', y: 20, color: '#e5e7eb' },
      { label: '38.2% Pullback ($144.70)', y: 60, color: '#38bdf8' },
      { label: '50.0% Midpoint ($140.00)', y: 80, color: '#fbbf24' },
      { label: '61.8% Golden Pocket ($135.30)', y: 100, color: '#34d399' },
      { label: '100% Swing Low ($120)', y: 145, color: '#ef4444' },
    ];
    return (
      <svg viewBox="0 0 420 165" className="w-full h-48 rounded-xl border border-white/10 bg-[#050807]">
        {levels.map((lvl) => (
          <g key={lvl.label}>
            <line
              x1="14"
              y1={lvl.y}
              x2="265"
              y2={lvl.y}
              stroke={lvl.color}
              strokeWidth="1.2"
              strokeDasharray="4 3"
              strokeOpacity="0.8"
            />
            <text x="272" y={lvl.y + 3} fill={lvl.color} fontSize="9.5" fontFamily="monospace">
              {lvl.label}
            </text>
          </g>
        ))}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2.4"
          points="20,145 70,108 110,120 165,20 205,98 250,42"
        />
        <circle cx="205" cy="98" r="4.5" fill="#34d399" />
      </svg>
    );
  }

  if (indicator.simType === 'rsi' || indicator.simType === 'stoch' || indicator.simType === 'mfi') {
    const obY = 38;
    const osY = 122;
    const points = SAMPLE_PRICES.map((_, i) => {
      const x = 16 + (i / (SAMPLE_PRICES.length - 1)) * 388;
      const osc = 52 + Math.sin(i * (0.45 + sensitivity * 0.05)) * 32;
      const y = 148 - (osc / 100) * 132;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 420 165" className="w-full h-48 rounded-xl border border-white/10 bg-[#050807]">
        <rect x="14" y="14" width="392" height={obY - 14} fill="rgba(239,68,68,0.08)" />
        <rect x="14" y={osY} width="392" height={150 - osY} fill="rgba(16,185,129,0.08)" />
        <line x1="14" y1={obY} x2="406" y2={obY} stroke="#f87171" strokeDasharray="4 3" strokeOpacity="0.7" />
        <line x1="14" y1={osY} x2="406" y2={osY} stroke="#34d399" strokeDasharray="4 3" strokeOpacity="0.7" />
        <text x="20" y={obY - 4} fill="#fca5a5" fontSize="9" fontFamily="monospace">
          Overbought ({indicator.simType === 'rsi' ? '70' : '80'})
        </text>
        <text x="20" y={osY + 12} fill="#6ee7b7" fontSize="9" fontFamily="monospace">
          Oversold ({indicator.simType === 'rsi' ? '30' : '20'})
        </text>
        <polyline fill="none" stroke="#38bdf8" strokeWidth="2.3" points={points} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 420 165" className="w-full h-48 rounded-xl border border-white/10 bg-[#050807]">
      {indicator.simType === 'bb' && (
        <>
          <path d={pathPoints.upperBand} fill="none" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1.2" />
          <path d={pathPoints.lowerBand} fill="none" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1.2" />
        </>
      )}
      <path d={pathPoints.priceLine} fill="none" stroke="#e5e7eb" strokeWidth="2" />
      <path d={pathPoints.secondaryLine} fill="none" stroke="#34d399" strokeWidth="2.2" />
      <text x="18" y="20" fill="#e5e7eb" fontSize="9.5" fontFamily="monospace">
        Price Series
      </text>
      <text x="104" y="20" fill="#34d399" fontSize="9.5" fontFamily="monospace">
        {indicator.shortCode} (Window {sensitivity})
      </text>
    </svg>
  );
}

export function IndicatorsBranch() {
  const [selectedPillar, setSelectedPillar] = useState<IndicatorPillar>('Trend Indicators');
  const pillarIndicators = useMemo(
    () => INDICATORS_CURRICULUM.filter((ind) => ind.pillar === selectedPillar),
    [selectedPillar]
  );

  const [selectedId, setSelectedId] = useState<string>(INDICATORS_CURRICULUM[0].id);
  const [sensitivity, setSensitivity] = useState<number>(8);

  const activeIndicator = useMemo(
    () =>
      pillarIndicators.find((i) => i.id === selectedId) ??
      pillarIndicators[0] ??
      INDICATORS_CURRICULUM[0],
    [pillarIndicators, selectedId]
  );

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Trading Section · Indicators · 5-Pillar Technical Analysis Framework
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            Technical Indicators &amp; Signal Synthesis
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Structured across Trend, Momentum, Volume, Volatility, and Fibonacci Support/Resistance—pairing
            mathematical equations with actionable triggers and false-signal guards.
          </p>
        </div>

        <span className="font-mono-tabular text-xs text-neutral-300">
          {INDICATORS_CURRICULUM.length} Core Indicators · 5 Pillars
        </span>
      </div>

      {/* 5-Pillar Selector */}
      <div className="flex flex-wrap gap-2">
        {PILLARS.map((pillar) => (
          <button
            key={pillar}
            type="button"
            onClick={() => {
              setSelectedPillar(pillar);
              const first = INDICATORS_CURRICULUM.find((i) => i.pillar === pillar);
              if (first) setSelectedId(first.id);
            }}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              selectedPillar === pillar
                ? 'bg-emerald-500 text-[#03140c] font-semibold'
                : 'border border-white/10 bg-[#0b110f] text-neutral-300 hover:text-white'
            }`}
          >
            {pillar}
          </button>
        ))}
      </div>

      {/* Interactive Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Pillar Indicators */}
        <div className="lg:col-span-4 space-y-3">
          {pillarIndicators.map((ind) => {
            const active = activeIndicator.id === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setSelectedId(ind.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-emerald-400/60 bg-[#0d1915]'
                    : 'border-white/10 bg-[#0b110f] hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono-tabular">
                  <span className="font-bold text-emerald-300">{ind.shortCode}</span>
                  <span className="text-neutral-400">{ind.leadingOrLagging}</span>
                </div>
                <p className="mt-1.5 font-display text-lg font-bold text-white">{ind.name}</p>
                <p className="mt-1 text-xs text-neutral-400">{ind.defaultParams}</p>
              </button>
            );
          })}
        </div>

        {/* Right Detail + Interactive Simulation */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-mono-tabular text-emerald-400">
                {activeIndicator.pillar} · {activeIndicator.leadingOrLagging} Indicator
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold text-white">{activeIndicator.name}</h2>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <label htmlFor="ind-param" className="text-neutral-300">
                Sensitivity ({sensitivity})
              </label>
              <input
                id="ind-param"
                type="range"
                min="2"
                max="14"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <IndicatorSimulationSvg indicator={activeIndicator} sensitivity={sensitivity} />

          {/* Exact Mathematical Equation */}
          <div className="rounded-xl border border-white/10 bg-[#060a09] p-4">
            <p className="text-xs font-medium text-neutral-400">Formula &amp; Default Inputs</p>
            <p className="mt-1.5 font-mono-tabular text-sm text-emerald-300 break-words">
              {activeIndicator.formula}
            </p>
            <p className="mt-1 text-xs text-neutral-400">Standard Settings: {activeIndicator.defaultParams}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-white/10 bg-[#060a09] p-4 space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                <span>How to Read It</span>
              </p>
              <p className="text-neutral-300 leading-relaxed">{activeIndicator.interpretation}</p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-[#060a09] p-4 space-y-1.5">
              <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Actionable Signal</span>
              </p>
              <p className="text-neutral-300 leading-relaxed">{activeIndicator.actionableSignal}</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-[#060a09] p-4 space-y-1.5">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Trap</span>
              </p>
              <p className="text-neutral-300 leading-relaxed">{activeIndicator.commonTrap}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
