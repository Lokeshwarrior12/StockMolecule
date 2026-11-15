import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCAGR,
  calculateDCFValuation,
  calculateGordonGrowthPrice,
  getExtendedMetrics,
  parseScreenerQueryText,
} from './quantModels';
import { STOCK_UNIVERSE } from '../data/marketData';
import { applyScreenerFilters } from './marketMath';

test('calculateDCFValuation computes positive intrinsic value and margin of safety verdict', () => {
  const dcf = calculateDCFValuation({
    fcfPerShare: 6.5,
    growthRatePct: 14,
    discountRatePct: 9.5,
    terminalGrowthPct: 3,
    years: 5,
    currentPrice: 120,
  });

  assert.ok(dcf.intrinsicValue > 120);
  assert.ok(dcf.pvOfCashFlows > 0);
  assert.ok(dcf.pvOfTerminalValue > 0);
  assert.ok(dcf.terminalSharePct > 40 && dcf.terminalSharePct < 90);
  assert.equal(dcf.verdict, 'Undervalued');
});

test('calculateCAGR and Gordon Growth compute exact annualized and dividend valuation metrics', () => {
  const cagr = calculateCAGR(100, 161.051, 5);
  assert.ok(Math.abs(cagr - 10) < 0.05);

  const gordon = calculateGordonGrowthPrice(4.0, 9.0, 4.0);
  assert.equal(gordon, 80.0);
});

test('getExtendedMetrics derives finite ratios across entire stock universe', () => {
  for (const s of STOCK_UNIVERSE) {
    const ext = getExtendedMetrics(s);
    assert.ok(Number.isFinite(ext.roce) && ext.roce > 0);
    assert.ok(Number.isFinite(ext.grahamNumber) && ext.grahamNumber > 0);
    assert.ok(ext.rsi14 >= 0 && ext.rsi14 <= 100);
    assert.ok(ext.waccPct > 5);
  }
});

test('parseScreenerQueryText maps normalized library queries to runnable filters', () => {
  const query = `ROE > 15
AND ROCE > 15
AND Debt to Equity < 0.5
AND Sales Growth 5Y > 10
AND Operating Profit Margin > 15`;

  const parsed = parseScreenerQueryText(query);
  assert.equal(parsed.filters.length, 5);
  assert.equal(parsed.unmappedNotes.length, 0);

  const matches = applyScreenerFilters(STOCK_UNIVERSE, parsed.filters);
  assert.ok(matches.length >= 2);
  for (const stock of matches) {
    assert.ok(stock.roe > 15);
    assert.ok(stock.debtToEquity < 0.5);
  }
});

test('parseScreenerQueryText isolates crossover/historical conditions cleanly', () => {
  const parsed = parseScreenerQueryText(`SMA 50 CROSSED ABOVE SMA 200`);
  assert.equal(parsed.filters.length, 0);
  assert.equal(parsed.unmappedNotes.length, 1);
});
