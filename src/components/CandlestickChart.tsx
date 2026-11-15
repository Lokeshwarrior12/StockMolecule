import { useMemo, useState } from 'react';
import type { CandleBar } from '../data/marketData';
import type { DetectedPattern, PriceLevel } from '../utils/marketMath';

interface CandlestickChartProps {
  candles: CandleBar[];
  ema20: number[];
  ema50: number[];
  levels: PriceLevel[];
  patterns: DetectedPattern[];
  showEma: boolean;
  showLevels: boolean;
  showPatterns: boolean;
  selectedIndex: number;
  onSelectIndex: (idx: number) => void;
}

export function CandlestickChart({
  candles,
  ema20,
  ema50,
  levels,
  patterns,
  showEma,
  showLevels,
  showPatterns,
  selectedIndex,
  onSelectIndex,
}: CandlestickChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 920;
  const height = 400;
  const padLeft = 18;
  const padRight = 76;
  const padTop = 22;
  const padBottom = 64;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    let minP = Infinity;
    let maxP = -Infinity;
    let maxV = 1;
    for (const c of candles) {
      if (c.low < minP) minP = c.low;
      if (c.high > maxP) maxP = c.high;
      if (c.volume > maxV) maxV = c.volume;
    }
    const pad = (maxP - minP) * 0.08 || 1;
    return { minPrice: minP - pad, maxPrice: maxP + pad, maxVol: maxV };
  }, [candles]);

  const priceToY = (price: number) => {
    const ratio = (price - minPrice) / Math.max(maxPrice - minPrice, 0.001);
    return padTop + chartH - ratio * chartH;
  };

  const stepX = chartW / Math.max(candles.length, 1);
  const candleW = Math.max(4, Math.min(10, stepX * 0.62));

  const buildLinePath = (series: number[]) =>
    series
      .map((val, i) => {
        const x = padLeft + i * stepX + stepX / 2;
        const y = priceToY(val);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  const ema20Path = useMemo(() => buildLinePath(ema20), [ema20, minPrice, maxPrice]);
  const ema50Path = useMemo(() => buildLinePath(ema50), [ema50, minPrice, maxPrice]);

  const activeIdx = hoverIdx !== null ? hoverIdx : selectedIndex;
  const activeBar = candles[activeIdx] ?? candles[candles.length - 1];
  const activePatterns = useMemo(
    () => new Map(patterns.map((p) => [p.barIndex, p])),
    [patterns]
  );

  const gridTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(minPrice + ((maxPrice - minPrice) * i) / 4);
    }
    return ticks;
  }, [minPrice, maxPrice]);

  return (
    <div className="relative w-full select-none">
      {/* Live OHLC Crosshair Readout Bar */}
      {activeBar && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular text-neutral-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-neutral-400">{activeBar.date}</span>
            <span>
              O <strong className="text-white">${activeBar.open.toFixed(2)}</strong>
            </span>
            <span>
              H <strong className="text-white">${activeBar.high.toFixed(2)}</strong>
            </span>
            <span>
              L <strong className="text-white">${activeBar.low.toFixed(2)}</strong>
            </span>
            <span>
              C{' '}
              <strong className={activeBar.close >= activeBar.open ? 'text-[#5cd645]' : 'text-[#f87171]'}>
                ${activeBar.close.toFixed(2)}
              </strong>
            </span>
            <span>
              Vol <strong className="text-neutral-200">{(activeBar.volume / 1_000_000).toFixed(2)}M</strong>
            </span>
          </div>
          {activePatterns.has(activeBar.index) && showPatterns && (
            <span className="text-[#e89b3c] font-semibold">
              Pattern: {activePatterns.get(activeBar.index)!.name} ({activePatterns.get(activeBar.index)!.bias})
            </span>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto rounded-lg border border-white/10 bg-[#0b0f12]"
        role="img"
        aria-label="Interactive candlestick chart with indicators and support resistance levels"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Horizontal Price Grid */}
        {gridTicks.map((tick, idx) => {
          const y = priceToY(tick);
          return (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={width - padRight + 8}
                y={y + 4}
                fill="#9ca3af"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
              >
                ${tick.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Auto-detected Support & Resistance Shelves */}
        {showLevels &&
          levels.map((lvl, idx) => {
            const y = priceToY(lvl.price);
            const isSupport = lvl.kind === 'Support';
            const color = isSupport ? '#44a82d' : '#ef4444';
            return (
              <g key={`${lvl.kind}-${idx}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={color}
                  strokeWidth="1.25"
                  strokeDasharray="5 4"
                  opacity="0.8"
                />
                <rect x={width - padRight + 4} y={y - 9} width="68" height="18" rx="3" fill={color} opacity="0.2" />
                <text
                  x={width - padRight + 8}
                  y={y + 4}
                  fill={isSupport ? '#86efac' : '#fca5a5'}
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {isSupport ? 'S' : 'R'} ${lvl.price.toFixed(1)}
                </text>
              </g>
            );
          })}

        {/* EMA 20 & EMA 50 Overlays */}
        {showEma && (
          <>
            <path d={ema50Path} fill="none" stroke="#38bdf8" strokeWidth="1.4" opacity="0.85" />
            <path d={ema20Path} fill="none" stroke="#e89b3c" strokeWidth="1.6" opacity="0.95" />
          </>
        )}

        {/* Volume Histogram + Candlesticks */}
        {candles.map((bar, i) => {
          const cx = padLeft + i * stepX + stepX / 2;
          const isBull = bar.close >= bar.open;
          const bodyColor = isBull ? '#44a82d' : '#dc2626';
          const yHigh = priceToY(bar.high);
          const yLow = priceToY(bar.low);
          const yOpen = priceToY(bar.open);
          const yClose = priceToY(bar.close);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));

          const volH = (bar.volume / maxVol) * 34;
          const volY = height - 18 - volH;

          const pattern = activePatterns.get(i);
          const isSelected = i === activeIdx;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
              onClick={() => onSelectIndex(i)}
            >
              {/* Hover / Selected Column Highlight */}
              {isSelected && (
                <rect
                  x={cx - stepX / 2}
                  y={padTop}
                  width={stepX}
                  height={chartH}
                  fill="rgba(255,255,255,0.04)"
                />
              )}

              {/* Volume Bar */}
              <rect
                x={cx - candleW / 2}
                y={volY}
                width={candleW}
                height={volH}
                fill={bodyColor}
                opacity="0.28"
              />

              {/* Wick */}
              <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={bodyColor} strokeWidth="1.3" />

              {/* Body */}
              <rect
                x={cx - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyHeight}
                fill={bodyColor}
                stroke={isSelected ? '#ffffff' : 'none'}
                strokeWidth={isSelected ? '1' : '0'}
                rx="1"
              />

              {/* Pattern Marker */}
              {showPatterns && pattern && (
                <g>
                  <circle
                    cx={cx}
                    cy={pattern.bias === 'Bullish' ? yLow + 10 : yHigh - 10}
                    r="4"
                    fill={pattern.bias === 'Bullish' ? '#5cd645' : pattern.bias === 'Bearish' ? '#ef4444' : '#e89b3c'}
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Bottom Axis Labels */}
        {candles
          .filter((_, idx) => idx % 10 === 0 || idx === candles.length - 1)
          .map((bar) => {
            const cx = padLeft + bar.index * stepX + stepX / 2;
            return (
              <text
                key={bar.index}
                x={cx}
                y={height - 4}
                textAnchor="middle"
                fill="#737373"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {bar.date}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
