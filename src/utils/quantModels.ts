import type { TickerProfile } from '../data/marketData';
import type { ScreenerFilter } from './marketMath';

export interface ExtendedTickerMetrics {
  roce: number;
  operatingMargin: number;
  interestCoverage: number;
  peg: number;
  evEbitda: number;
  evSales: number;
  priceToSales: number;
  priceToFcf: number;
  dividendYield: number;
  payoutRatio: number;
  currentRatio: number;
  quickRatio: number;
  beta: number;
  salesGrowth5y: number;
  profitGrowth5y: number;
  rsi14: number;
  sma50: number;
  sma200: number;
  eps: number;
  bvps: number;
  grahamNumber: number;
  piotroskiScore: number;
  earningsYield: number;
  rsRating: number;
  waccPct: number;
  dcfIntrinsicPrice: number;
  marginOfSafetyPct: number;
}

export function getExtendedMetrics(stock: TickerProfile): ExtendedTickerMetrics {
  const eps = Number((stock.price / Math.max(stock.pe, 1)).toFixed(2));
  const bvps = Number((stock.price / Math.max(stock.pb, 0.2)).toFixed(2));
  const grahamNumber = Number(Math.sqrt(Math.max(22.5 * eps * bvps, 0)).toFixed(2));
  const earningsYield = Number(((100 / Math.max(stock.pe, 1))).toFixed(2));
  const operatingMargin = Number((stock.netMargin * 1.24).toFixed(1));
  const roce = Number((stock.roic * 1.08).toFixed(1));
  const salesGrowth5y = Number((stock.revGrowth * 0.85).toFixed(1));
  const profitGrowth5y = Number((stock.revGrowth * 0.96).toFixed(1));
  const peg = Number((stock.pe / Math.max(profitGrowth5y, 4)).toFixed(2));
  const evEbitda = Number((stock.pe * 0.68).toFixed(1));
  const priceToSales = Number(((stock.pe * stock.netMargin) / 100).toFixed(2));
  const evSales = Number((priceToSales * (1 + stock.debtToEquity * 0.08)).toFixed(2));
  const priceToFcf = Number((100 / Math.max(stock.fcfYield, 0.5)).toFixed(1));
  const interestCoverage = stock.debtToEquity < 0.15 ? 42.0 : Number((18 / Math.max(stock.debtToEquity, 0.12)).toFixed(1));
  const currentRatio = Number((2.4 - Math.min(stock.debtToEquity * 0.5, 1.1)).toFixed(2));
  const quickRatio = Number((currentRatio * 0.84).toFixed(2));

  const dividendYield =
    stock.symbol === 'XOM'
      ? 3.35
      : stock.symbol === 'JPM'
        ? 2.25
        : stock.symbol === 'BRK.B' || stock.symbol === 'PLTR'
          ? 0.0
          : stock.symbol === 'MSFT' || stock.symbol === 'AAPL' || stock.symbol === 'AVGO'
            ? 0.85
            : stock.symbol === 'TSM' || stock.symbol === 'ASML'
              ? 1.35
              : 0.45;
  const payoutRatio = dividendYield > 0 ? Number(Math.min(68, (dividendYield / Math.max(earningsYield, 0.5)) * 100).toFixed(1)) : 0;

  const beta =
    stock.symbol === 'NVDA' || stock.symbol === 'PLTR' || stock.symbol === 'MELI'
      ? 1.58
      : stock.symbol === 'BRK.B' || stock.symbol === 'COST' || stock.symbol === 'XOM'
        ? 0.72
        : 1.08;

  const rsi14 = Number(Math.min(78, Math.max(28, 38 + stock.momentumScore * 0.36)).toFixed(1));
  const sma50 = Number((stock.price * (stock.momentumScore >= 72 ? 0.94 : 1.02)).toFixed(2));
  const sma200 = Number((stock.price * (stock.momentumScore >= 65 ? 0.85 : 0.98)).toFixed(2));
  const rsRating = Math.min(99, Math.max(25, Math.round(stock.momentumScore)));

  const piotroskiScore =
    stock.roic > 25 && stock.debtToEquity < 0.4 && stock.fcfYield > 2.0
      ? 8
      : stock.roic > 18 && stock.fcfYield > 1.5
        ? 7
        : 6;

  const waccPct = Number((7.2 + beta * 2.1).toFixed(2));
  const fcfPerShare = stock.price * (stock.fcfYield / 100);
  const dcf = calculateDCFValuation({
    fcfPerShare,
    growthRatePct: Math.min(22, Math.max(5, profitGrowth5y * 0.65)),
    discountRatePct: waccPct,
    terminalGrowthPct: 3.0,
    years: 5,
    currentPrice: stock.price,
  });

  return {
    roce,
    operatingMargin,
    interestCoverage,
    peg,
    evEbitda,
    evSales,
    priceToSales,
    priceToFcf,
    dividendYield,
    payoutRatio,
    currentRatio,
    quickRatio,
    beta,
    salesGrowth5y,
    profitGrowth5y,
    rsi14,
    sma50,
    sma200,
    eps,
    bvps,
    grahamNumber,
    piotroskiScore,
    earningsYield,
    rsRating,
    waccPct,
    dcfIntrinsicPrice: dcf.intrinsicValue,
    marginOfSafetyPct: dcf.marginOfSafetyPct,
  };
}

export interface DcfInput {
  fcfPerShare: number;
  growthRatePct: number;
  discountRatePct: number;
  terminalGrowthPct: number;
  years: number;
  currentPrice: number;
}

export interface DcfResult {
  intrinsicValue: number;
  pvOfCashFlows: number;
  pvOfTerminalValue: number;
  terminalSharePct: number;
  marginOfSafetyPct: number;
  verdict: 'Undervalued' | 'Fair Value' | 'Overvalued';
}

export function calculateDCFValuation(input: DcfInput): DcfResult {
  const r = Math.max(input.discountRatePct / 100, 0.02);
  const g = input.growthRatePct / 100;
  const tg = Math.min(input.terminalGrowthPct / 100, r - 0.01);
  const yrs = Math.max(1, Math.min(10, Math.round(input.years)));

  let pvOfCashFlows = 0;
  let projectedFcf = Math.max(input.fcfPerShare, 0);

  for (let t = 1; t <= yrs; t++) {
    projectedFcf = projectedFcf * (1 + g);
    pvOfCashFlows += projectedFcf / Math.pow(1 + r, t);
  }

  const terminalFcf = projectedFcf * (1 + tg);
  const terminalValue = terminalFcf / Math.max(r - tg, 0.01);
  const pvOfTerminalValue = terminalValue / Math.pow(1 + r, yrs);
  const intrinsicValue = Number((pvOfCashFlows + pvOfTerminalValue).toFixed(2));
  const terminalSharePct =
    intrinsicValue > 0 ? Number(((pvOfTerminalValue / intrinsicValue) * 100).toFixed(1)) : 0;

  const marginOfSafetyPct =
    intrinsicValue > 0
      ? Number((((intrinsicValue - input.currentPrice) / intrinsicValue) * 100).toFixed(1))
      : -100;

  const verdict: DcfResult['verdict'] =
    marginOfSafetyPct >= 15 ? 'Undervalued' : marginOfSafetyPct <= -15 ? 'Overvalued' : 'Fair Value';

  return {
    intrinsicValue,
    pvOfCashFlows: Number(pvOfCashFlows.toFixed(2)),
    pvOfTerminalValue: Number(pvOfTerminalValue.toFixed(2)),
    terminalSharePct,
    marginOfSafetyPct,
    verdict,
  };
}

export function calculateCAGR(beginningValue: number, endingValue: number, years: number): number {
  if (beginningValue <= 0 || endingValue <= 0 || years <= 0) return 0;
  return Number(((Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100).toFixed(2));
}

export function calculateGordonGrowthPrice(nextDividend: number, costOfEquityPct: number, growthPct: number): number {
  const r = costOfEquityPct / 100;
  const g = growthPct / 100;
  if (nextDividend <= 0 || r <= g) return 0;
  return Number((nextDividend / (r - g)).toFixed(2));
}

/**
 * Parses supported Screener query lines from the 85-query library into live ScreenerFilter[] rules
 * for the TradeMind Invest Screener, returning both mapped filters and unmapped historical/technical notes.
 */
export function parseScreenerQueryText(query: string): {
  filters: ScreenerFilter[];
  unmappedNotes: string[];
} {
  const lines = query
    .split('\n')
    .map((l) => l.trim().replace(/^AND\s+/i, '').trim())
    .filter((l) => l.length > 0 && !/^Sort by:/i.test(l));

  const filters: ScreenerFilter[] = [];
  const unmappedNotes: string[] = [];

  const fieldMap: { pattern: RegExp; field: ScreenerFilter['field'] }[] = [
    { pattern: /^(?:ROE)\b/i, field: 'roe' },
    { pattern: /^(?:ROIC|ROCE(?:\s*\d+Y)?|Return on Capital)\b/i, field: 'roic' },
    { pattern: /^(?:PE Ratio|P\/E)\b/i, field: 'pe' },
    { pattern: /^(?:Debt to Equity|Debt\/Equity)\b/i, field: 'debtToEquity' },
    { pattern: /^(?:Sales Growth \d+Y|Revenue Growth \d+Y|Sales CAGR \d+Y)\b/i, field: 'revGrowth' },
    { pattern: /^(?:Free Cash Flow Yield)\b/i, field: 'fcfYield' },
    { pattern: /^(?:Operating Profit Margin|Net Profit Margin|Operating Margin)\b/i, field: 'netMargin' },
    { pattern: /^(?:Market Cap)\b/i, field: 'marketCapB' },
  ];

  lines.forEach((line, idx) => {
    const m = line.match(/^([A-Za-z0-9\s/%&-]+?)\s*(>=|<=|>|<|=)\s*(-?\d+(?:\.\d+)?)$/);
    if (!m) {
      unmappedNotes.push(line);
      return;
    }

    const [, rawName, rawOp, rawVal] = m;
    const matched = fieldMap.find((entry) => entry.pattern.test(rawName.trim()));
    if (!matched) {
      unmappedNotes.push(line);
      return;
    }

    let numericVal = Number(rawVal);
    // Normalize USD Market Cap thresholds (> 10000M / 300000000) into $B for universe screening
    if (matched.field === 'marketCapB') {
      if (numericVal >= 1_000_000_000) {
        numericVal = Number((numericVal / 1_000_000_000).toFixed(2));
      } else if (numericVal >= 1000) {
        numericVal = Number((numericVal / 100).toFixed(2));
      }
    }

    const operator: ScreenerFilter['operator'] =
      rawOp === '=' ? '<=' : (rawOp as ScreenerFilter['operator']);

    filters.push({
      id: `lib-${Date.now()}-${idx}`,
      field: matched.field,
      operator,
      value: numericVal,
    });
  });

  return { filters, unmappedNotes };
}
