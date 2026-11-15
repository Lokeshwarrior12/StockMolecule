import { useState } from 'react';
import { CheckCircle2, Layers, ShieldAlert, Target } from 'lucide-react';
import { SR_PLAYBOOKS } from '../data/academyContent';

function SRDiagramSvg({ modeId }: { modeId: string }) {
  if (modeId === 'breakout-retest') {
    return (
      <svg viewBox="0 0 480 200" className="w-full h-56 rounded-xl border border-white/10 bg-[#050807]">
        {/* Prior Resistance -> New Support Zone */}
        <rect x="20" y="92" width="440" height="16" fill="rgba(52,211,153,0.12)" />
        <line x1="20" y1="100" x2="460" y2="100" stroke="#34d399" strokeWidth="1.6" strokeDasharray="5 4" />
        <text x="26" y="86" fill="#fca5a5" fontSize="10" fontFamily="monospace">Old Resistance Ceiling</text>
        <text x="285" y="122" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Polarity Flip -&gt; New Support Shelf</text>

        <polyline
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2.5"
          points="30,165 85,104 135,148 190,104 235,134 290,52 340,98 440,26"
        />
        <circle cx="290" cy="52" r="4" fill="#38bdf8" />
        <circle cx="340" cy="98" r="6" fill="#10b981" />
        <text x="348" y="88" fill="#6ee7b7" fontSize="10" fontWeight="bold">Retest Entry</text>
      </svg>
    );
  }

  if (modeId === 'liquidity-trap') {
    return (
      <svg viewBox="0 0 480 200" className="w-full h-56 rounded-xl border border-white/10 bg-[#050807]">
        <rect x="20" y="120" width="440" height="14" fill="rgba(251,191,36,0.12)" />
        <line x1="20" y1="127" x2="460" y2="127" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="26" y="114" fill="#fde68a" fontSize="10" fontFamily="monospace">Major Support Floor</text>

        <polyline
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2.5"
          points="35,45 100,124 155,74 220,124 275,162 310,118 435,38"
        />
        <circle cx="275" cy="162" r="5" fill="#ef4444" />
        <text x="284" y="168" fill="#fca5a5" fontSize="10" fontFamily="monospace">Stop-Hunt Liquidity Sweep</text>
        <circle cx="310" cy="118" r="5" fill="#10b981" />
        <text x="320" y="114" fill="#6ee7b7" fontSize="10" fontWeight="bold">Snap-Back Entry</text>
      </svg>
    );
  }

  if (modeId === 'dynamic-ma') {
    return (
      <svg viewBox="0 0 480 200" className="w-full h-56 rounded-xl border border-white/10 bg-[#050807]">
        <path
          d="M 25 168 Q 220 130 455 48"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />
        <text x="320" y="96" fill="#7dd3fc" fontSize="10" fontFamily="monospace">Rising 50 SMA Dynamic Support</text>
        <polyline
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2.4"
          points="30,160 85,112 125,142 190,84 235,116 305,54 345,84 445,24"
        />
        <circle cx="125" cy="142" r="4.5" fill="#10b981" />
        <circle cx="235" cy="116" r="4.5" fill="#10b981" />
        <circle cx="345" cy="84" r="5.5" fill="#10b981" />
      </svg>
    );
  }

  // Default: bounce
  return (
    <svg viewBox="0 0 480 200" className="w-full h-56 rounded-xl border border-white/10 bg-[#050807]">
      <rect x="20" y="28" width="440" height="16" fill="rgba(239,68,68,0.12)" />
      <rect x="20" y="142" width="440" height="16" fill="rgba(16,185,129,0.12)" />
      <text x="28" y="22" fill="#fca5a5" fontSize="10" fontFamily="monospace">Supply Resistance Zone</text>
      <text x="28" y="174" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Demand Support Zone</text>
      <polyline
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="2.5"
        points="35,148 110,40 185,148 265,38 345,148 440,54"
      />
      <circle cx="185" cy="148" r="5" fill="#10b981" />
      <circle cx="345" cy="148" r="5.5" fill="#10b981" />
      <text x="356" y="138" fill="#6ee7b7" fontSize="10" fontWeight="bold">Bounce Confirmation</text>
    </svg>
  );
}

export function SupportResistanceBranch() {
  const [selectedId, setSelectedId] = useState<string>(SR_PLAYBOOKS[0].id);
  const active = SR_PLAYBOOKS.find((p) => p.id === selectedId) ?? SR_PLAYBOOKS[0];

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-8">
      {/* Header matching Optimus Futures + StockCharts trading playbooks */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Trading Section · Support &amp; Resistance Playbook
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            Support, Resistance &amp; Polarity Trading Guide
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Institutional execution rules for horizontal zones (never thin lines), polarity flips, false-breakout
            liquidity sweeps, and dynamic moving-average support.
          </p>
        </div>
        <span className="font-mono-tabular text-xs text-neutral-300">4 Core Execution Models</span>
      </div>

      {/* Strategy Tabs */}
      <div className="flex flex-wrap gap-2">
        {SR_PLAYBOOKS.map((pb) => (
          <button
            key={pb.id}
            type="button"
            onClick={() => setSelectedId(pb.id)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              active.id === pb.id
                ? 'bg-emerald-500 text-[#03140c] font-semibold'
                : 'border border-white/10 bg-[#0b110f] text-neutral-300 hover:text-white'
            }`}
          >
            {pb.name}
          </button>
        ))}
      </div>

      {/* Interactive Strategy Visualizer + Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">{active.name}</h2>
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>

          <SRDiagramSvg modeId={active.id} />

          <div className="rounded-xl border border-white/10 bg-[#060a09] p-4 space-y-2">
            <p className="text-xs font-semibold text-white">Pre-Trade Validation Checklist</p>
            <ul className="space-y-1.5">
              {active.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b110f] p-5 space-y-2">
            <p className="text-xs font-semibold text-neutral-200">Structural Zone Thesis</p>
            <p className="text-sm text-neutral-300 leading-relaxed">{active.setupRule}</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0b110f] p-5 space-y-2">
            <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Exact Entry Trigger</span>
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">{active.entryTrigger}</p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-[#0b110f] p-5 space-y-2">
            <p className="text-xs font-semibold text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Stop Placement &amp; Target Projection</span>
            </p>
            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">Stop:</strong> {active.stopPlacement}
            </p>
            <p className="text-xs text-emerald-300 leading-relaxed pt-1">
              <strong className="text-white">Target:</strong> {active.targetProjection}
            </p>
          </div>
        </div>
      </div>

      {/* Golden Rules Footer Card */}
      <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div>
          <p className="font-semibold text-white">1. Zones, Never Razor Lines</p>
          <p className="mt-1.5 text-neutral-400 leading-relaxed">
            Institutional orders cluster across a band from prior candle closes to wicks. Shaded zones prevent premature stop-outs.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">2. More Touches = Thinner Stop Cushion</p>
          <p className="mt-1.5 text-neutral-400 leading-relaxed">
            Each retest absorbs resting bids/asks at a shelf. The 2nd or 3rd bounce holds best; the 4th+ test frequently breaks through.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">3. Polarity Principle (Role Reversal)</p>
          <p className="mt-1.5 text-neutral-400 leading-relaxed">
            Trapped breakout sellers who shorted at resistance cover at breakeven on the retest, turning old supply into new support.
          </p>
        </div>
      </section>
    </main>
  );
}
