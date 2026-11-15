import type { CandleBar, TickerProfile } from '../data/marketData';

export interface EmaResult {
  series: number[];
  latest: number;
  prevEma: number;
  latestPrice: number;
  multiplier: number;
  formulaText: string;
}

export interface RsiResult {
  series: number[];
  latest: number;
  avgGain: number;
  avgLoss: number;
  rs: number;
  formulaText: string;
}

export interface MacdResult {
  macdLine: number[];
  signalLine: number[];
  histogram: number[];
  latestMacd: number;
  latestSignal: number;
  latestHist: number;
  formulaText: string;
}

export interface PriceLevel {
  price: number;
  kind: 'Support' | 'Resistance';
  touches: number;
}

export interface DetectedPattern {
  barIndex: number;
  name: 'Hammer' | 'Shooting Star' | 'Bullish Engulfing' | 'Bearish Engulfing' | 'Doji';
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  description: string;
}

export interface ScreenerFilter {
  id: string;
  field: 'pe' | 'roe' | 'roic' | 'debtToEquity' | 'revGrowth' | 'fcfYield' | 'netMargin' | 'marketCapB';
  operator: '<' | '<=' | '>' | '>=';
  value: number;
}

export interface StrategyWeights {
  quality: number;
  growth: number;
  value: number;
  momentum: number;
}

export interface RankedStock extends TickerProfile {
  compositeScore: number;
  rank: number;
}

export interface PaperPosition {
  symbol: string;
  shares: number;
  avgCost: number;
}

export interface PaperOrder {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  shares: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW';
  targetPrice: number;
  note: string;
  active: boolean;
}

export interface PaperPortfolioState {
  cash: number;
  positions: PaperPosition[];
  orders: PaperOrder[];
  alerts: PriceAlert[];
}

export function calculateEMA(values: number[], period: number): EmaResult {
  if (values.length === 0) {
    return {
      series: [],
      latest: 0,
      prevEma: 0,
      latestPrice: 0,
      multiplier: 0,
      formulaText: 'No data available',
    };
  }
  const k = 2 / (period + 1);
  const series: number[] = [];
  let ema = values[0];
  series.push(Number(ema.toFixed(2)));

  for (let i = 1; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
    series.push(Number(ema.toFixed(2)));
  }

  const latest = series[series.length - 1];
  const prevEma = series.length > 1 ? series[series.length - 2] : latest;
  const latestPrice = values[values.length - 1];

  return {
    series,
    latest,
    prevEma,
    latestPrice,
    multiplier: Number(k.toFixed(4)),
    formulaText: `EMA_${period} = (${latestPrice.toFixed(2)} * ${k.toFixed(4)}) + (${prevEma.toFixed(2)} * ${(1 - k).toFixed(4)}) = ${latest.toFixed(2)}`,
  };
}

export function calculateRSI(closes: number[], period = 14): RsiResult {
  if (closes.length <= period) {
    return {
      series: closes.map(() => 50),
      latest: 50,
      avgGain: 0,
      avgLoss: 0,
      rs: 1,
      formulaText: 'Insufficient bars for RSI window',
    };
  }

  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const series: number[] = new Array(period).fill(50);

  const computeRsiFromAvgs = (g: number, l: number) => {
    if (l === 0) return g === 0 ? 50 : 100;
    const rs = g / l;
    return 100 - 100 / (1 + rs);
  };

  series.push(Number(computeRsiFromAvgs(avgGain, avgLoss).toFixed(2)));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    series.push(Number(computeRsiFromAvgs(avgGain, avgLoss).toFixed(2)));
  }

  const latest = series[series.length - 1];
  const rs = avgLoss === 0 ? 99 : avgGain / avgLoss;

  return {
    series,
    latest,
    avgGain: Number(avgGain.toFixed(4)),
    avgLoss: Number(avgLoss.toFixed(4)),
    rs: Number(rs.toFixed(3)),
    formulaText: `RS = ${avgGain.toFixed(3)} / ${avgLoss.toFixed(3)} = ${rs.toFixed(2)} -> RSI = 100 - (100 / (1 + ${rs.toFixed(2)})) = ${latest.toFixed(1)}`,
  };
}

export function calculateMACD(closes: number[]): MacdResult {
  if (closes.length === 0) {
    return {
      macdLine: [],
      signalLine: [],
      histogram: [],
      latestMacd: 0,
      latestSignal: 0,
      latestHist: 0,
      formulaText: 'No closes available',
    };
  }

  const ema12 = calculateEMA(closes, 12).series;
  const ema26 = calculateEMA(closes, 26).series;
  const macdLine = ema12.map((val, i) => Number((val - ema26[i]).toFixed(3)));
  const signalLine = calculateEMA(macdLine, 9).series;
  const histogram = macdLine.map((val, i) => Number((val - signalLine[i]).toFixed(3)));

  const latestMacd = macdLine[macdLine.length - 1];
  const latestSignal = signalLine[signalLine.length - 1];
  const latestHist = histogram[histogram.length - 1];

  return {
    macdLine,
    signalLine,
    histogram,
    latestMacd,
    latestSignal,
    latestHist,
    formulaText: `MACD = EMA_12 (${ema12[ema12.length - 1].toFixed(2)}) - EMA_26 (${ema26[ema26.length - 1].toFixed(2)}) = ${latestMacd.toFixed(2)} | Signal_9 = ${latestSignal.toFixed(2)}`,
  };
}

export function detectSupportResistance(candles: CandleBar[]): PriceLevel[] {
  if (candles.length < 7) return [];
  const lastPrice = candles[candles.length - 1].close;
  const pivotHighs: number[] = [];
  const pivotLows: number[] = [];

  for (let i = 2; i < candles.length - 2; i++) {
    const h = candles[i].high;
    const l = candles[i].low;
    if (h >= candles[i - 1].high && h >= candles[i - 2].high && h >= candles[i + 1].high && h >= candles[i + 2].high) {
      pivotHighs.push(h);
    }
    if (l <= candles[i - 1].low && l <= candles[i - 2].low && l <= candles[i + 1].low && l <= candles[i + 2].low) {
      pivotLows.push(l);
    }
  }

  const clusterLevels = (prices: number[], kind: 'Support' | 'Resistance'): PriceLevel[] => {
    const sorted = [...prices].sort((a, b) => a - b);
    const clusters: { sum: number; count: number }[] = [];
    const tolerance = lastPrice * 0.015;

    for (const p of sorted) {
      const match = clusters.find((c) => Math.abs(c.sum / c.count - p) <= tolerance);
      if (match) {
        match.sum += p;
        match.count += 1;
      } else {
        clusters.push({ sum: p, count: 1 });
      }
    }

    return clusters
      .map((c) => ({
        price: Number((c.sum / c.count).toFixed(2)),
        kind,
        touches: c.count,
      }))
      .sort((a, b) => b.touches - a.touches)
      .slice(0, 2);
  };

  const supports = clusterLevels(
    pivotLows.filter((p) => p <= lastPrice * 1.01),
    'Support'
  );
  const resistances = clusterLevels(
    pivotHighs.filter((p) => p >= lastPrice * 0.99),
    'Resistance'
  );

  return [...resistances, ...supports];
}

export function detectCandlestickPatterns(candles: CandleBar[]): DetectedPattern[] {
  const detected: DetectedPattern[] = [];

  for (let i = 1; i < candles.length; i++) {
    const cur = candles[i];
    const prev = candles[i - 1];
    const body = Math.abs(cur.close - cur.open);
    const range = Math.max(cur.high - cur.low, 0.0001);
    const upperWick = cur.high - Math.max(cur.open, cur.close);
    const lowerWick = Math.min(cur.open, cur.close) - cur.low;

    if (body <= range * 0.12) {
      detected.push({
        barIndex: i,
        name: 'Doji',
        bias: 'Neutral',
        description: `Indecision equilibrium bar at $${cur.close.toFixed(2)} with tight open-close spread.`,
      });
      continue;
    }

    if (lowerWick >= body * 2.0 && upperWick <= body * 0.45 && body > 0) {
      detected.push({
        barIndex: i,
        name: 'Hammer',
        bias: 'Bullish',
        description: `Lower wick rejection (${lowerWick.toFixed(2)}) >= 2x body; buyers defended $${cur.low.toFixed(2)}.`,
      });
      continue;
    }

    if (upperWick >= body * 2.0 && lowerWick <= body * 0.45 && body > 0) {
      detected.push({
        barIndex: i,
        name: 'Shooting Star',
        bias: 'Bearish',
        description: `Upper wick rejection (${upperWick.toFixed(2)}) >= 2x body near $${cur.high.toFixed(2)} resistance.`,
      });
      continue;
    }

    const prevBearish = prev.close < prev.open;
    const curBullish = cur.close > cur.open;
    if (prevBearish && curBullish && cur.open <= prev.close * 1.002 && cur.close >= prev.open * 0.998) {
      detected.push({
        barIndex: i,
        name: 'Bullish Engulfing',
        bias: 'Bullish',
        description: `Bullish body ($${cur.open.toFixed(2)} -> $${cur.close.toFixed(2)}) fully engulfed prior red session.`,
      });
      continue;
    }

    const prevBullish = prev.close > prev.open;
    const curBearish = cur.close < cur.open;
    if (prevBullish && curBearish && cur.open >= prev.close * 0.998 && cur.close <= prev.open * 1.002) {
      detected.push({
        barIndex: i,
        name: 'Bearish Engulfing',
        bias: 'Bearish',
        description: `Bearish body ($${cur.open.toFixed(2)} -> $${cur.close.toFixed(2)}) engulfed prior green session.`,
      });
    }
  }

  return detected;
}

export function applyScreenerFilters(
  stocks: TickerProfile[],
  filters: ScreenerFilter[],
  searchQuery = ''
): TickerProfile[] {
  const q = searchQuery.trim().toLowerCase();
  return stocks.filter((stock) => {
    if (q) {
      const matchesText =
        stock.symbol.toLowerCase().includes(q) ||
        stock.name.toLowerCase().includes(q) ||
        stock.sector.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    return filters.every((f) => {
      const val = stock[f.field];
      switch (f.operator) {
        case '<':
          return val < f.value;
        case '<=':
          return val <= f.value;
        case '>':
          return val > f.value;
        case '>=':
          return val >= f.value;
      }
    });
  });
}

export function rankStocksByStrategy(stocks: TickerProfile[], weights: StrategyWeights): RankedStock[] {
  const totalWeight = Math.max(weights.quality + weights.growth + weights.value + weights.momentum, 1);
  const scored = stocks.map((stock) => {
    const weighted =
      (stock.qualityScore * weights.quality +
        stock.growthScore * weights.growth +
        stock.valueScore * weights.value +
        stock.momentumScore * weights.momentum) /
      totalWeight;
    return {
      ...stock,
      compositeScore: Number(weighted.toFixed(1)),
      rank: 0,
    };
  });

  scored.sort((a, b) => b.compositeScore - a.compositeScore);
  return scored.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

export interface OrderExecutionResult {
  ok: boolean;
  error?: string;
  portfolio: PaperPortfolioState;
}

export function executePaperOrder(
  portfolio: PaperPortfolioState,
  input: {
    symbol: string;
    side: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    shares: number;
    price: number;
    stopLoss?: number;
    takeProfit?: number;
    timestamp: string;
  }
): OrderExecutionResult {
  if (!Number.isFinite(input.shares) || input.shares <= 0) {
    return { ok: false, error: 'Share quantity must be greater than zero.', portfolio };
  }
  if (!Number.isFinite(input.price) || input.price <= 0) {
    return { ok: false, error: 'Execution price must be positive.', portfolio };
  }

  const notional = Number((input.shares * input.price).toFixed(2));
  const existingPos = portfolio.positions.find((p) => p.symbol === input.symbol);

  if (input.side === 'BUY') {
    if (notional > portfolio.cash) {
      return {
        ok: false,
        error: `Insufficient cash ($${portfolio.cash.toFixed(2)}) for $${notional.toFixed(2)} order.`,
        portfolio,
      };
    }

    const nextPositions = existingPos
      ? portfolio.positions.map((p) => {
          if (p.symbol !== input.symbol) return p;
          const totalShares = p.shares + input.shares;
          const weightedAvg = (p.shares * p.avgCost + notional) / totalShares;
          return {
            ...p,
            shares: totalShares,
            avgCost: Number(weightedAvg.toFixed(2)),
          };
        })
      : [
          ...portfolio.positions,
          { symbol: input.symbol, shares: input.shares, avgCost: Number(input.price.toFixed(2)) },
        ];

    const newOrder: PaperOrder = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      symbol: input.symbol,
      side: input.side,
      orderType: input.orderType,
      shares: input.shares,
      price: Number(input.price.toFixed(2)),
      stopLoss: input.stopLoss,
      takeProfit: input.takeProfit,
      timestamp: input.timestamp,
    };

    return {
      ok: true,
      portfolio: {
        ...portfolio,
        cash: Number((portfolio.cash - notional).toFixed(2)),
        positions: nextPositions,
        orders: [newOrder, ...portfolio.orders],
      },
    };
  }

  // SELL side
  if (!existingPos || existingPos.shares < input.shares) {
    return {
      ok: false,
      error: `Insufficient ${input.symbol} shares (${existingPos?.shares ?? 0} held).`,
      portfolio,
    };
  }

  const remainingShares = existingPos.shares - input.shares;
  const nextPositions =
    remainingShares <= 0
      ? portfolio.positions.filter((p) => p.symbol !== input.symbol)
      : portfolio.positions.map((p) => (p.symbol === input.symbol ? { ...p, shares: remainingShares } : p));

  const newOrder: PaperOrder = {
    id: `ORD-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    symbol: input.symbol,
    side: input.side,
    orderType: input.orderType,
    shares: input.shares,
    price: Number(input.price.toFixed(2)),
    stopLoss: input.stopLoss,
    takeProfit: input.takeProfit,
    timestamp: input.timestamp,
  };

  return {
    ok: true,
    portfolio: {
      ...portfolio,
      cash: Number((portfolio.cash + notional).toFixed(2)),
      positions: nextPositions,
      orders: [newOrder, ...portfolio.orders],
    },
  };
}
