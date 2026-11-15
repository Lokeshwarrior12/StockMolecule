import { useEffect, useMemo, useState } from 'react';
import { Calculator, Layers, Scale } from 'lucide-react';
import {
  ADDITIONAL_13_RATIOS,
  VALUATION_20_BENCHMARKS,
  VALUATION_20_CONCEPTS,
} from '../data/academyContent';
import { STOCK_UNIVERSE } from '../data/marketData';
import {
  calculateDCFValuation,
  calculateGordonGrowthPrice,
  getExtendedMetrics,
} from '../utils/quantModels';

export function InvestModelBranch() {
  const [selectedSymbol, setSelectedSymbol] = useState(STOCK_UNIVERSE[0].symbol);
  const stock = useMemo(
    () => STOCK_UNIVERSE.find((s) => s.symbol === selectedSymbol) ?? STOCK_UNIVERSE[0],
    [selectedSymbol]
  );
  const ext = useMemo(() => getExtendedMetrics(stock), [stock]);

  const [fcfPerShare, setFcfPerShare] = useState<number>(4.8);
  const [growthRate, setGrowthRate] = useState<number>(15);
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [terminalGrowth, setTerminalGrowth] = useState<number>(3);
  const [years, setYears] = useState<number>(5);

  const [ddmNextDiv, setDdmNextDiv] = useState<number>(3.2);
  const [ddmKe, setDdmKe] = useState<number>(9.5);
  const [ddmGrowth, setDdmGrowth] = useState<number>(5.0);

  // Sync defaults cleanly when ticker changes
  useEffect(() => {
    const derivedFcf = Number(((stock.price * stock.fcfYield) / 100).toFixed(2));
    setFcfPerShare(Math.max(0.5, derivedFcf));
    setGrowthRate(Math.min(25, Math.max(6, Math.round(ext.profitGrowth5y * 0.65))));
    setDiscountRate(Number(ext.waccPct.toFixed(1)));
  }, [stock, ext.profitGrowth5y, ext.waccPct]);

  const dcf = useMemo(
    () =>
      calculateDCFValuation({
        fcfPerShare,
        growthRatePct: growthRate,
        discountRatePct: discountRate,
        terminalGrowthPct: terminalGrowth,
        years,
        currentPrice: stock.price,
      }),
    [fcfPerShare, growthRate, discountRate, terminalGrowth, years, stock.price]
  );

  const gordonPrice = useMemo(
    () => calculateGordonGrowthPrice(ddmNextDiv, ddmKe, ddmGrowth),
    [ddmNextDiv, ddmKe, ddmGrowth]
  );

  // 3x3 WACC x Terminal Growth Sensitivity Matrix
  const waccSteps = [Math.max(4, discountRate - 1.5), discountRate, discountRate + 1.5];
  const tgSteps = [Math.max(1, terminalGrowth - 0.75), terminalGrowth, terminalGrowth + 0.75];

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Invest Section · Invest Model · Intrinsic Valuation Workbench
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white">
            DCF Valuation, Margin of Safety &amp; 33 Benchmarks
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Run interactive Discounted Cash Flow &amp; WACC sensitivity matrices on live equities, test Gordon
            Growth DDM, study all 20 Valuation Concepts, and inspect 20 + 13 benchmark tiers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="model-ticker" className="text-xs text-neutral-400">
            Load Equity Baseline:
          </label>
          <select
            id="model-ticker"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="rounded-lg border border-white/15 bg-[#0b110f] px-3 py-2 text-xs font-mono-tabular font-semibold text-white"
          >
            {STOCK_UNIVERSE.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} · ${s.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live DCF & Margin of Safety Workbench + Sensitivity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display text-2xl font-bold text-white">
                DCF &amp; Margin of Safety Calculator ({stock.symbol})
              </h2>
            </div>
            <span className="font-mono-tabular text-xs text-neutral-400">
              Market Price: ${stock.price.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="dcf-fcf" className="text-neutral-300">FCF Per Share ($)</label>
                <span className="font-mono-tabular font-bold text-white">${fcfPerShare.toFixed(2)}</span>
              </div>
              <input
                id="dcf-fcf"
                type="number"
                step="0.25"
                min="0.1"
                value={fcfPerShare}
                onChange={(e) => setFcfPerShare(Math.max(0.1, Number(e.target.value)))}
                className="w-full rounded-lg border border-white/15 bg-[#060a09] px-3 py-2 font-mono-tabular text-white"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="dcf-years" className="text-neutral-300">Stage 1 Forecast Horizon</label>
                <span className="font-mono-tabular font-bold text-white">{years} Years</span>
              </div>
              <input
                id="dcf-years"
                type="range"
                min="3"
                max="10"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="dcf-growth" className="text-neutral-300">Stage 1 FCF CAGR (%)</label>
                <span className="font-mono-tabular font-bold text-emerald-300">{growthRate}%</span>
              </div>
              <input
                id="dcf-growth"
                type="range"
                min="0"
                max="35"
                step="0.5"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="dcf-wacc" className="text-neutral-300">Discount Rate / WACC (%)</label>
                <span className="font-mono-tabular font-bold text-sky-300">{discountRate}%</span>
              </div>
              <input
                id="dcf-wacc"
                type="range"
                min="6"
                max="18"
                step="0.25"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between mb-1">
                <label htmlFor="dcf-tg" className="text-neutral-300">Perpetual Terminal Growth (%)</label>
                <span className="font-mono-tabular font-bold text-amber-300">{terminalGrowth}%</span>
              </div>
              <input
                id="dcf-tg"
                type="range"
                min="1"
                max="4.5"
                step="0.25"
                value={terminalGrowth}
                onChange={(e) => setTerminalGrowth(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* DCF Output Banner */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-emerald-500/25 bg-[#060a09] p-4 font-mono-tabular"
            data-testid="dcf-output-grid"
          >
            <div>
              <p className="text-[11px] text-neutral-400">Intrinsic Value</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300" data-testid="dcf-intrinsic-value">
                ${dcf.intrinsicValue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-400">Margin of Safety</p>
              <p
                className={`mt-1 text-xl font-bold ${
                  dcf.marginOfSafetyPct >= 0 ? 'text-emerald-300' : 'text-red-300'
                }`}
              >
                {dcf.marginOfSafetyPct >= 0 ? '+' : ''}
                {dcf.marginOfSafetyPct.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-400">PV Terminal Share</p>
              <p className="mt-1 text-lg font-bold text-white">{dcf.terminalSharePct.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-400">Verdict</p>
              <p
                className={`mt-1 text-base font-bold ${
                  dcf.verdict === 'Undervalued'
                    ? 'text-emerald-300'
                    : dcf.verdict === 'Overvalued'
                      ? 'text-red-300'
                      : 'text-amber-300'
                }`}
              >
                {dcf.verdict}
              </p>
            </div>
          </div>
        </section>

        {/* Right: Sensitivity Matrix + Gordon Growth DDM */}
        <div className="lg:col-span-5 space-y-5">
          <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-5 space-y-3">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>WACC × Terminal Growth Sensitivity Matrix</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Intrinsic share price across discount rate (rows) vs terminal growth (columns).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono-tabular text-right">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="py-2 text-left">WACC \ g</th>
                    {tgSteps.map((tg) => (
                      <th key={tg} className="py-2 px-2">{tg.toFixed(2)}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {waccSteps.map((w) => (
                    <tr key={w}>
                      <td className="py-2.5 text-left text-sky-300 font-semibold">{w.toFixed(2)}%</td>
                      {tgSteps.map((tg) => {
                        const cell = calculateDCFValuation({
                          fcfPerShare,
                          growthRatePct: growthRate,
                          discountRatePct: w,
                          terminalGrowthPct: tg,
                          years,
                          currentPrice: stock.price,
                        });
                        const cheap = cell.intrinsicValue >= stock.price;
                        return (
                          <td
                            key={tg}
                            className={`py-2.5 px-2 font-semibold ${
                              cheap ? 'text-emerald-300' : 'text-red-300'
                            }`}
                          >
                            ${cell.intrinsicValue.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-5 space-y-3">
            <h2 className="font-display text-xl font-bold text-white">Gordon Growth Model (DDM)</h2>
            <p className="text-xs font-mono-tabular text-sky-300">P₀ = D₁ / (Cost of Equity − Dividend Growth)</p>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono-tabular">
              <div>
                <label htmlFor="ddm-d1" className="block text-[11px] text-neutral-400 mb-1">D₁ ($)</label>
                <input
                  id="ddm-d1"
                  type="number"
                  step="0.2"
                  value={ddmNextDiv}
                  onChange={(e) => setDdmNextDiv(Number(e.target.value))}
                  className="w-full rounded border border-white/15 bg-[#060a09] px-2 py-1.5 text-white"
                />
              </div>
              <div>
                <label htmlFor="ddm-ke" className="block text-[11px] text-neutral-400 mb-1">Ke (%)</label>
                <input
                  id="ddm-ke"
                  type="number"
                  step="0.5"
                  value={ddmKe}
                  onChange={(e) => setDdmKe(Number(e.target.value))}
                  className="w-full rounded border border-white/15 bg-[#060a09] px-2 py-1.5 text-white"
                />
              </div>
              <div>
                <label htmlFor="ddm-g" className="block text-[11px] text-neutral-400 mb-1">g (%)</label>
                <input
                  id="ddm-g"
                  type="number"
                  step="0.5"
                  value={ddmGrowth}
                  onChange={(e) => setDdmGrowth(Number(e.target.value))}
                  className="w-full rounded border border-white/15 bg-[#060a09] px-2 py-1.5 text-white"
                />
              </div>
            </div>
            <p className="text-xs text-neutral-300 font-mono-tabular pt-1">
              Gordon Fair Value:{' '}
              <span className="text-base font-bold text-emerald-300">${gordonPrice.toFixed(2)}</span>
            </p>
          </section>
        </div>
      </div>

      {/* All 20 Valuation Concepts */}
      <section className="rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-white">20 Core Company Valuation Concepts</h2>
          </div>
          <span className="font-mono-tabular text-xs text-neutral-400">Institutional Curriculum</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {VALUATION_20_CONCEPTS.map((c) => (
            <div key={c.id} className="rounded-xl border border-white/10 bg-[#060a09] p-3.5 space-y-1.5">
              <p className="font-mono-tabular text-[11px] text-emerald-400">#{String(c.id).padStart(2, '0')}</p>
              <h3 className="font-display text-sm font-bold text-white">{c.title}</h3>
              <p className="font-mono-tabular text-[11px] text-sky-300">{c.formulaOrRule}</p>
              <p className="text-neutral-400 leading-relaxed">{c.insight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 20 Valuation Benchmarks + 13 Additional Ratios Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-white">
            20 Valuation Metric Benchmark Tiers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400">
                  <th className="py-2 pr-3 font-medium">Metric</th>
                  <th className="py-2 px-2 font-medium text-emerald-300">Attractive</th>
                  <th className="py-2 px-2 font-medium text-neutral-200">Fair Range</th>
                  <th className="py-2 px-2 font-medium text-red-300">Stretched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono-tabular">
                {VALUATION_20_BENCHMARKS.map((row) => (
                  <tr key={row.metric} className="hover:bg-white/5">
                    <td className="py-2.5 pr-3 font-sans font-medium text-white">
                      {row.metric}
                      <span className="block text-[10px] font-normal text-neutral-400">{row.formulaNote}</span>
                    </td>
                    <td className="py-2.5 px-2 text-emerald-300">{row.undervalued}</td>
                    <td className="py-2.5 px-2 text-neutral-300">{row.fair}</td>
                    <td className="py-2.5 px-2 text-red-300">{row.expensive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0b110f] p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-white">
            13 Supplemental Institutional Ratios ({stock.symbol} Live)
          </h2>
          <div className="rounded-xl border border-emerald-500/20 bg-[#060a09] p-3.5 grid grid-cols-3 gap-2 font-mono-tabular text-xs">
            <div>
              <p className="text-[10px] text-neutral-400">{stock.symbol} Graham #</p>
              <p className="text-sm font-bold text-white">${ext.grahamNumber.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400">EV / EBITDA</p>
              <p className="text-sm font-bold text-emerald-300">{ext.evEbitda.toFixed(1)}x</p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400">PEG Ratio</p>
              <p className="text-sm font-bold text-sky-300">{ext.peg.toFixed(2)}x</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {ADDITIONAL_13_RATIOS.map((r, i) => (
              <div
                key={r.name}
                className="rounded-xl border border-white/10 bg-[#060a09] p-3 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-white">
                    {i + 1}. {r.name}{' '}
                    <span className="font-normal text-neutral-400">· {r.category}</span>
                  </p>
                  <p className="mt-0.5 text-neutral-400">{r.interpretation}</p>
                </div>
                <span className="font-mono-tabular text-emerald-300 font-semibold whitespace-nowrap shrink-0">
                  {r.target}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
