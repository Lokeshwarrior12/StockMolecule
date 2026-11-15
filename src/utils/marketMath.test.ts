import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEMA,
  calculateRSI,
  calculateMACD,
  detectCandlestickPatterns,
  detectSupportResistance,
  applyScreenerFilters,
  rankStocksByStrategy,
  executePaperOrder,
  type PaperPortfolioState,
} from './marketMath';
import { STOCK_UNIVERSE, getCandlesForTicker } from '../data/marketData';

test('calculateEMA computes accurate latest value and formula text', () => {
  const res = calculateEMA([10, 11, 12, 13, 14], 3);
  assert.equal(res.series.length, 5);
  assert.equal(res.multiplier, 0.5);
  assert.ok(res.latest > 13 && res.latest <= 14);
  assert.match(res.formulaText, /EMA_3 =/);
});

test('calculateRSI bounds output between 0 and 100 and rises on uptrend', () => {
  const uptrend = Array.from({ length: 25 }, (_, i) => 100 + i * 2);
  const res = calculateRSI(uptrend, 14);
  assert.equal(res.latest, 100);

  const mixed = [100, 102, 101, 104, 103, 106, 105, 107, 104, 108, 110, 107, 111, 113, 112, 115, 114];
  const mixedRes = calculateRSI(mixed, 14);
  assert.ok(mixedRes.latest > 55 && mixedRes.latest < 95);
});

test('calculateMACD returns aligned series for 60 candles', () => {
  const candles = getCandlesForTicker('NVDA', '1M');
  const closes = candles.map((c) => c.close);
  const macd = calculateMACD(closes);
  assert.equal(macd.macdLine.length, closes.length);
  assert.equal(macd.signalLine.length, closes.length);
  assert.equal(macd.histogram.length, closes.length);
});

test('detectCandlestickPatterns and Support/Resistance detect real structures on NVDA', () => {
  const candles = getCandlesForTicker('NVDA', '1M');
  const patterns = detectCandlestickPatterns(candles);
  assert.ok(patterns.length >= 2, 'Expected deterministic patterns like Hammer or Bullish Engulfing');

  const levels = detectSupportResistance(candles);
  assert.ok(levels.length >= 1, 'Expected at least one support or resistance shelf');
});

test('applyScreenerFilters filters universe cleanly by ratio rules', () => {
  const filtered = applyScreenerFilters(STOCK_UNIVERSE, [
    { id: 'f1', field: 'roe', operator: '>=', value: 30 },
    { id: 'f2', field: 'debtToEquity', operator: '<=', value: 0.5 },
  ]);
  assert.ok(filtered.length >= 3);
  for (const s of filtered) {
    assert.ok(s.roe >= 30);
    assert.ok(s.debtToEquity <= 0.5);
  }
});

test('rankStocksByStrategy prioritizes Value stocks when value weight dominates', () => {
  const valueRanked = rankStocksByStrategy(STOCK_UNIVERSE, {
    quality: 10,
    growth: 0,
    value: 90,
    momentum: 0,
  });
  assert.equal(valueRanked[0].rank, 1);
  assert.ok(valueRanked[0].valueScore >= 85);
});

test('executePaperOrder validates cash, updates weighted avg cost, and handles sells', () => {
  const initial: PaperPortfolioState = {
    cash: 10000,
    positions: [],
    orders: [],
    alerts: [],
  };

  const invalid = executePaperOrder(initial, {
    symbol: 'NVDA',
    side: 'BUY',
    orderType: 'MARKET',
    shares: 1000,
    price: 150,
    timestamp: '10:00',
  });
  assert.equal(invalid.ok, false);

  const buy1 = executePaperOrder(initial, {
    symbol: 'NVDA',
    side: 'BUY',
    orderType: 'MARKET',
    shares: 10,
    price: 100,
    timestamp: '10:01',
  });
  assert.equal(buy1.ok, true);
  assert.equal(buy1.portfolio.cash, 9000);
  assert.equal(buy1.portfolio.positions[0].avgCost, 100);

  const buy2 = executePaperOrder(buy1.portfolio, {
    symbol: 'NVDA',
    side: 'BUY',
    orderType: 'MARKET',
    shares: 10,
    price: 120,
    timestamp: '10:05',
  });
  assert.equal(buy2.ok, true);
  assert.equal(buy2.portfolio.cash, 7800);
  assert.equal(buy2.portfolio.positions[0].shares, 20);
  assert.equal(buy2.portfolio.positions[0].avgCost, 110);

  const sell1 = executePaperOrder(buy2.portfolio, {
    symbol: 'NVDA',
    side: 'SELL',
    orderType: 'MARKET',
    shares: 20,
    price: 130,
    timestamp: '10:15',
  });
  assert.equal(sell1.ok, true);
  assert.equal(sell1.portfolio.cash, 10400);
  assert.equal(sell1.portfolio.positions.length, 0);
});
