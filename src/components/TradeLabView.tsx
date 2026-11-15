import { useMemo, useState } from 'react';
import { Bell, CheckCircle2, Eye, Layers, TrendingDown, TrendingUp } from 'lucide-react';
import { STOCK_UNIVERSE, getCandlesForTicker, type Timeframe } from '../data/marketData';
import {
  calculateEMA,
  calculateMACD,
  calculateRSI,
  detectCandlestickPatterns,
  detectSupportResistance,
  executePaperOrder,
  type PaperPortfolioState,
} from '../utils/marketMath';
import { CandlestickChart } from './CandlestickChart';
import { PeriodicTile } from './PeriodicTile';

interface TradeLabViewProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  portfolio: PaperPortfolioState;
  onUpdatePortfolio: (next: PaperPortfolioState) => void;
}

export function TradeLabView({
  selectedSymbol,
  onSelectSymbol,
  portfolio,
  onUpdatePortfolio,
}: TradeLabViewProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [showEma, setShowEma] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [showPatterns, setShowPatterns] = useState(true);
  const [showXray, setShowXray] = useState(true);
  const [selectedBarIndex, setSelectedBarIndex] = useState(59);

  // Order Ticket State
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [sharesInput, setSharesInput] = useState('10');
  const [limitPriceInput, setLimitPriceInput] = useState('');
  const [stopLossInput, setStopLossInput] = useState('');
  const [takeProfitInput, setTakeProfitInput] = useState('');
  const [orderFeedback, setOrderFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // Alert Creator State
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [alertPriceInput, setAlertPriceInput] = useState('');
  const [alertNoteInput, setAlertNoteInput] = useState('');

  const profile = useMemo(
    () => STOCK_UNIVERSE.find((s) => s.symbol === selectedSymbol) ?? STOCK_UNIVERSE[0],
    [selectedSymbol]
  );

  const candles = useMemo(
    () => getCandlesForTicker(profile.symbol, timeframe),
    [profile.symbol, timeframe]
  );

  const closes = useMemo(() => candles.map((c) => c.close), [candles]);
  const ema20 = useMemo(() => calculateEMA(closes, 20), [closes]);
  const ema50 = useMemo(() => calculateEMA(closes, 50), [closes]);
  const rsi = useMemo(() => calculateRSI(closes, 14), [closes]);
  const macd = useMemo(() => calculateMACD(closes), [closes]);
  const levels = useMemo(() => detectSupportResistance(candles), [candles]);
  const patterns = useMemo(() => detectCandlestickPatterns(candles), [candles]);

  const currentPosition = portfolio.positions.find((p) => p.symbol === profile.symbol);

  const totalEquity = useMemo(() => {
    const posValue = portfolio.positions.reduce((acc, pos) => {
      const q = STOCK_UNIVERSE.find((s) => s.symbol === pos.symbol);
      return acc + pos.shares * (q ? q.price : pos.avgCost);
    }, 0);
    return portfolio.cash + posValue;
  }, [portfolio]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = Number(sharesInput);
    const execPrice =
      orderType === 'LIMIT' && Number(limitPriceInput) > 0 ? Number(limitPriceInput) : profile.price;

    const result = executePaperOrder(portfolio, {
      symbol: profile.symbol,
      side,
      orderType,
      shares,
      price: execPrice,
      stopLoss: Number(stopLossInput) > 0 ? Number(stopLossInput) : undefined,
      takeProfit: Number(takeProfitInput) > 0 ? Number(takeProfitInput) : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    if (!result.ok) {
      setOrderFeedback({ ok: false, msg: result.error ?? 'Order rejected.' });
      return;
    }

    onUpdatePortfolio(result.portfolio);
    setOrderFeedback({
      ok: true,
      msg: `${side} ${shares} ${profile.symbol} @ $${execPrice.toFixed(2)} executed.`,
    });
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(alertPriceInput);
    if (!Number.isFinite(target) || target <= 0) return;

    const newAlert = {
      id: `ALT-${Date.now()}`,
      symbol: profile.symbol,
      condition: alertCondition,
      targetPrice: Number(target.toFixed(2)),
      note: alertNoteInput.trim() || `${profile.symbol} ${alertCondition.toLowerCase()} $${target.toFixed(2)}`,
      active: true,
    };

    onUpdatePortfolio({
      ...portfolio,
      alerts: [newAlert, ...portfolio.alerts],
    });
    setAlertPriceInput('');
    setAlertNoteInput('');
  };

  const handleRemoveAlert = (id: string) => {
    onUpdatePortfolio({
      ...portfolio,
      alerts: portfolio.alerts.filter((a) => a.id !== id),
    });
  };

  const inspectedBarIdx = Math.min(selectedBarIndex, candles.length - 1);
  const inspectedRsi = rsi.series[inspectedBarIdx] ?? rsi.latest;
  const inspectedEma20 = ema20.series[inspectedBarIdx] ?? ema20.latest;

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 space-y-8">
      {/* Top Ticker Selector & Live Quote Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <PeriodicTile
            atomicNumber={profile.atomicNumber}
            symbol={profile.atomicSymbol}
            variant={profile.changePct >= 0 ? 'emerald' : 'crimson'}
            size="md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-white">{profile.symbol}</h1>
              <span className="text-sm text-neutral-300">{profile.name}</span>
              <span className="text-xs text-neutral-400">· {profile.sector}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 font-mono-tabular text-sm">
              <span className="text-xl font-bold text-white">${profile.price.toFixed(2)}</span>
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  profile.changePct >= 0 ? 'text-[#5cd645]' : 'text-[#f87171]'
                }`}
              >
                {profile.changePct >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {profile.change >= 0 ? '+' : ''}
                {profile.change.toFixed(2)} ({profile.changePct >= 0 ? '+' : ''}
                {profile.changePct.toFixed(2)}%)
              </span>
              <span className="text-xs text-neutral-400">
                Range: ${profile.dayLow.toFixed(2)} - ${profile.dayHigh.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Ticker Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STOCK_UNIVERSE.slice(0, 8).map((s) => (
            <button
              key={s.symbol}
              type="button"
              onClick={() => {
                onSelectSymbol(s.symbol);
                setOrderFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tabular font-semibold transition-colors whitespace-nowrap shrink-0 ${
                s.symbol === profile.symbol
                  ? 'bg-[#3b8c28] text-white'
                  : 'border border-white/10 bg-[#161d22] text-neutral-300 hover:text-white hover:border-white/25'
              }`}
            >
              {s.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Live Candlestick Lab (8 cols) + Paper Trading Ticket (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Chart Controls Bar */}
          <div className="rounded-xl border border-white/10 bg-[#11171b] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              {/* Timeframe Segmented Control */}
              <div className="inline-flex items-center gap-1 rounded-lg bg-[#0b0f12] p-1 border border-white/10">
                {(['1D', '1W', '1M', '3M'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-md text-xs font-mono-tabular font-medium transition-colors ${
                      timeframe === tf ? 'bg-[#3b8c28] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Analytical Layer Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEma((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    showEma
                      ? 'border-[#e89b3c]/50 bg-[#d9822b]/15 text-[#f0a54e]'
                      : 'border-white/10 bg-[#161d22] text-neutral-400'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>EMA 20 / 50</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLevels((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    showLevels
                      ? 'border-[#52b738]/50 bg-[#3b8c28]/15 text-[#86efac]'
                      : 'border-white/10 bg-[#161d22] text-neutral-400'
                  }`}
                >
                  <span>Support &amp; Resistance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPatterns((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    showPatterns
                      ? 'border-[#38bdf8]/50 bg-[#38bdf8]/15 text-[#7dd3fc]'
                      : 'border-white/10 bg-[#161d22] text-neutral-400'
                  }`}
                >
                  <span>Pattern Detection</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowXray((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    showXray
                      ? 'border-[#52b738] bg-[#3b8c28] text-white'
                      : 'border-white/10 bg-[#161d22] text-neutral-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Indicator X-Ray</span>
                </button>
              </div>
            </div>

            <CandlestickChart
              candles={candles}
              ema20={ema20.series}
              ema50={ema50.series}
              levels={levels}
              patterns={patterns}
              showEma={showEma}
              showLevels={showLevels}
              showPatterns={showPatterns}
              selectedIndex={inspectedBarIdx}
              onSelectIndex={setSelectedBarIndex}
            />
          </div>

          {/* Indicator X-Ray Step-by-Step Math Panel */}
          {showXray && (
            <section
              aria-label="Indicator X-Ray Mathematical Breakdown"
              className="rounded-xl border border-[#52b738]/30 bg-[#0d180e] p-6"
              data-testid="indicator-xray-panel"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Indicator X-Ray · Step-by-Step Formula Audit
                  </h2>
                  <p className="text-xs text-neutral-300">
                    Inspecting Bar #{inspectedBarIdx + 1} ({candles[inspectedBarIdx]?.date}) on {profile.symbol}
                  </p>
                </div>
                <span className="font-mono-tabular text-xs text-[#86efac]">
                  EMA20: ${inspectedEma20.toFixed(2)} · RSI14: {inspectedRsi.toFixed(1)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-tabular text-xs">
                <div className="rounded-lg border border-white/10 bg-[#0b0f12] p-4">
                  <p className="text-[#e89b3c] font-semibold">EMA(20) Smoothing</p>
                  <p className="mt-1 text-neutral-300 leading-relaxed">{ema20.formulaText}</p>
                  <p className="mt-2 text-neutral-400">
                    Weight k = 2 / (20 + 1) = {ema20.multiplier}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-[#0b0f12] p-4">
                  <p className="text-[#64c94b] font-semibold">Wilder RSI(14) Equilibrium</p>
                  <p className="mt-1 text-neutral-300 leading-relaxed">{rsi.formulaText}</p>
                  <p className="mt-2 text-neutral-400">
                    Regime:{' '}
                    {rsi.latest > 70 ? 'Overbought (>70)' : rsi.latest < 30 ? 'Oversold (<30)' : 'Balanced (30-70)'}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-[#0b0f12] p-4">
                  <p className="text-[#38bdf8] font-semibold">MACD(12, 26, 9) Momentum</p>
                  <p className="mt-1 text-neutral-300 leading-relaxed">{macd.formulaText}</p>
                  <p className="mt-2 text-neutral-400">
                    Histogram: {macd.latestHist >= 0 ? '+' : ''}
                    {macd.latestHist.toFixed(3)}
                  </p>
                </div>
              </div>

              {/* Detected Candlestick Patterns List */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold text-neutral-300 mb-2">
                  Detected Candlestick Structures ({patterns.length} found in window)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {patterns.slice(-4).map((pat) => (
                    <button
                      key={`${pat.barIndex}-${pat.name}`}
                      type="button"
                      onClick={() => setSelectedBarIndex(pat.barIndex)}
                      className="text-left rounded-lg border border-white/10 bg-[#11171b] p-3 hover:border-white/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-white">
                          {pat.name} · Bar #{pat.barIndex + 1}
                        </span>
                        <span
                          className={
                            pat.bias === 'Bullish'
                              ? 'text-[#5cd645]'
                              : pat.bias === 'Bearish'
                                ? 'text-[#f87171]'
                                : 'text-[#e89b3c]'
                          }
                        >
                          {pat.bias}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-400">{pat.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Paper Trading Ticket + Alerts */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Account Summary & Order Form */}
          <div className="rounded-xl border border-white/10 bg-[#11171b] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-2xl font-bold text-white">Paper Trading Desk</h2>
              <span className="font-mono-tabular text-xs text-neutral-400">Virtual Capital</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 font-mono-tabular">
              <div className="rounded-lg bg-[#0b0f12] border border-white/10 p-3">
                <p className="text-[11px] text-neutral-400">Available Cash</p>
                <p className="mt-0.5 text-base font-bold text-white" data-testid="paper-cash-balance">
                  ${portfolio.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg bg-[#0b0f12] border border-white/10 p-3">
                <p className="text-[11px] text-neutral-400">Total Equity</p>
                <p className="mt-0.5 text-base font-bold text-[#64c94b]">
                  ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="mt-5 space-y-4">
              {/* Side Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSide('BUY')}
                  className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                    side === 'BUY'
                      ? 'bg-[#3b8c28] text-white'
                      : 'border border-white/10 bg-[#161d22] text-neutral-300'
                  }`}
                >
                  Buy {profile.symbol}
                </button>
                <button
                  type="button"
                  onClick={() => setSide('SELL')}
                  className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                    side === 'SELL'
                      ? 'bg-[#b91c1c] text-white'
                      : 'border border-white/10 bg-[#161d22] text-neutral-300'
                  }`}
                >
                  Sell {profile.symbol}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="order-type" className="block text-xs text-neutral-400 mb-1">
                    Order Type
                  </label>
                  <select
                    id="order-type"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
                    className="w-full rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs text-white focus:border-[#52b738] focus:outline-none"
                  >
                    <option value="MARKET">Market (${profile.price.toFixed(2)})</option>
                    <option value="LIMIT">Limit</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order-shares" className="block text-xs text-neutral-400 mb-1">
                    Shares
                  </label>
                  <input
                    id="order-shares"
                    type="number"
                    min="1"
                    step="1"
                    value={sharesInput}
                    onChange={(e) => setSharesInput(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs font-mono-tabular text-white focus:border-[#52b738] focus:outline-none"
                  />
                </div>
              </div>

              {orderType === 'LIMIT' && (
                <div>
                  <label htmlFor="limit-price" className="block text-xs text-neutral-400 mb-1">
                    Limit Price ($)
                  </label>
                  <input
                    id="limit-price"
                    type="number"
                    step="0.01"
                    placeholder={profile.price.toFixed(2)}
                    value={limitPriceInput}
                    onChange={(e) => setLimitPriceInput(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs font-mono-tabular text-white focus:border-[#52b738] focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="stop-loss" className="block text-xs text-neutral-400 mb-1">
                    Stop-Loss ($)
                  </label>
                  <input
                    id="stop-loss"
                    type="number"
                    step="0.01"
                    placeholder={(profile.price * 0.94).toFixed(2)}
                    value={stopLossInput}
                    onChange={(e) => setStopLossInput(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs font-mono-tabular text-white focus:border-[#52b738] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="take-profit" className="block text-xs text-neutral-400 mb-1">
                    Take-Profit ($)
                  </label>
                  <input
                    id="take-profit"
                    type="number"
                    step="0.01"
                    placeholder={(profile.price * 1.1).toFixed(2)}
                    value={takeProfitInput}
                    onChange={(e) => setTakeProfitInput(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs font-mono-tabular text-white focus:border-[#52b738] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono-tabular text-neutral-400">
                <span>Est. Notional</span>
                <span className="text-white font-semibold">
                  $
                  {(
                    (Number(sharesInput) || 0) *
                    (orderType === 'LIMIT' && Number(limitPriceInput) > 0 ? Number(limitPriceInput) : profile.price)
                  ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {currentPosition && (
                <p className="text-xs text-neutral-300 font-mono-tabular">
                  Held: {currentPosition.shares} sh @ ${currentPosition.avgCost.toFixed(2)} avg
                </p>
              )}

              {orderFeedback && (
                <div
                  role="status"
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    orderFeedback.ok
                      ? 'border-[#52b738]/40 bg-[#3b8c28]/15 text-[#86efac]'
                      : 'border-[#ef4444]/40 bg-[#b91c1c]/15 text-[#fca5a5]'
                  }`}
                >
                  {orderFeedback.msg}
                </div>
              )}

              <button
                type="submit"
                className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors ${
                  side === 'BUY' ? 'bg-[#3b8c28] hover:bg-[#49a333]' : 'bg-[#b91c1c] hover:bg-[#dc2626]'
                }`}
              >
                Submit {side} Order
              </button>
            </form>
          </div>

          {/* Price Alert Creator */}
          <div className="rounded-xl border border-white/10 bg-[#11171b] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-xl font-bold text-white">Price Alerts</h3>
              <Bell className="w-4 h-4 text-[#e89b3c]" />
            </div>

            <form onSubmit={handleCreateAlert} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select
                  aria-label="Alert Condition"
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as 'ABOVE' | 'BELOW')}
                  className="rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs text-white"
                >
                  <option value="ABOVE">Crosses Above</option>
                  <option value="BELOW">Drops Below</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  aria-label="Alert Target Price"
                  placeholder={profile.price.toFixed(2)}
                  value={alertPriceInput}
                  onChange={(e) => setAlertPriceInput(e.target.value)}
                  className="rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs font-mono-tabular text-white"
                />
              </div>
              <input
                type="text"
                aria-label="Alert Note"
                placeholder="Trigger note (e.g., Breakout confirmation)"
                value={alertNoteInput}
                onChange={(e) => setAlertNoteInput(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#0b0f12] px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="w-full rounded-lg border border-[#e89b3c]/50 bg-[#d9822b]/15 py-2 text-xs font-semibold text-[#f0a54e] hover:bg-[#d9822b]/25 transition-colors"
              >
                Add Alert for {profile.symbol}
              </button>
            </form>

            {portfolio.alerts.length > 0 && (
              <ul className="mt-4 space-y-2 divide-y divide-white/10">
                {portfolio.alerts.map((al) => (
                  <li key={al.id} className="pt-2 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-mono-tabular font-semibold text-white">
                        {al.symbol} {al.condition} ${al.targetPrice.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-neutral-400">{al.note}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlert(al.id)}
                      className="text-neutral-400 hover:text-[#f87171] text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Portfolio Positions & Order Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-white/10 bg-[#11171b] p-5">
          <h3 className="font-display text-xl font-bold text-white mb-4">
            Open Paper Positions ({portfolio.positions.length})
          </h3>
          {portfolio.positions.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No open positions yet. Submit a Buy order in the desk above to initiate a virtual position.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-tabular">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="py-2 pr-3">Ticker</th>
                    <th className="py-2 px-3 text-right">Shares</th>
                    <th className="py-2 px-3 text-right">Avg Cost</th>
                    <th className="py-2 px-3 text-right">Mark</th>
                    <th className="py-2 pl-3 text-right">Unrealized P&amp;L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {portfolio.positions.map((pos) => {
                    const mark = STOCK_UNIVERSE.find((s) => s.symbol === pos.symbol)?.price ?? pos.avgCost;
                    const pnl = (mark - pos.avgCost) * pos.shares;
                    const pnlPct = ((mark - pos.avgCost) / pos.avgCost) * 100;
                    return (
                      <tr key={pos.symbol} className="hover:bg-white/5">
                        <td className="py-2.5 pr-3 font-semibold text-white">
                          <button type="button" onClick={() => onSelectSymbol(pos.symbol)} className="hover:underline">
                            {pos.symbol}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right text-neutral-200">{pos.shares}</td>
                        <td className="py-2.5 px-3 text-right text-neutral-300">${pos.avgCost.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right text-white">${mark.toFixed(2)}</td>
                        <td
                          className={`py-2.5 pl-3 text-right font-semibold ${
                            pnl >= 0 ? 'text-[#5cd645]' : 'text-[#f87171]'
                          }`}
                        >
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPct >= 0 ? '+' : ''}
                          {pnlPct.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#11171b] p-5">
          <h3 className="font-display text-xl font-bold text-white mb-4">
            Recent Executions ({portfolio.orders.length})
          </h3>
          {portfolio.orders.length === 0 ? (
            <p className="text-sm text-neutral-400">No executions logged in this session.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-tabular">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="py-2 pr-3">Time</th>
                    <th className="py-2 px-3">Side</th>
                    <th className="py-2 px-3">Ticker</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 pl-3 text-right">Fill Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {portfolio.orders.slice(0, 8).map((ord) => (
                    <tr key={ord.id}>
                      <td className="py-2.5 pr-3 text-neutral-400">{ord.timestamp}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            ord.side === 'BUY' ? 'text-[#5cd645]' : 'text-[#f87171]'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {ord.side}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-white">{ord.symbol}</td>
                      <td className="py-2.5 px-3 text-right text-neutral-200">{ord.shares}</td>
                      <td className="py-2.5 pl-3 text-right text-white">${ord.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
