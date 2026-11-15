// =============================================================================
// 1. TECHNICAL INDICATORS FRAMEWORK (Fidelity 5-Pillar 13-Indicator Curriculum)
// =============================================================================

export type IndicatorPillar =
  | 'Trend Indicators'
  | 'Momentum Indicators'
  | 'Volume Indicators'
  | 'Volatility Indicators'
  | 'Support & Resistance';

export interface IndicatorLessonSpec {
  id: string;
  name: string;
  shortCode: string;
  pillar: IndicatorPillar;
  leadingOrLagging: 'Lagging' | 'Leading' | 'Coincident' | 'Structural';
  formula: string;
  defaultParams: string;
  interpretation: string;
  actionableSignal: string;
  commonTrap: string;
  simType: 'sma' | 'ema' | 'macd' | 'adx' | 'rsi' | 'stoch' | 'obv' | 'mfi' | 'ad' | 'bb' | 'atr' | 'fib';
}

export const INDICATORS_CURRICULUM: IndicatorLessonSpec[] = [
  // 1. Trend Indicators
  {
    id: 'sma',
    name: 'Simple Moving Average (SMA)',
    shortCode: 'SMA',
    pillar: 'Trend Indicators',
    leadingOrLagging: 'Lagging',
    formula: 'SMA(N) = (P_1 + P_2 + ... + P_N) / N',
    defaultParams: '50-day (intermediate) & 200-day (secular regime)',
    interpretation: 'Equal-weighted rolling mean price filtering short-term candle noise to reveal institutional trend direction.',
    actionableSignal: 'Golden Cross (50 SMA crosses above 200 SMA) confirms multi-quarter bullish trend transition.',
    commonTrap: 'Using moving average crossovers inside flat horizontal trading ranges generates frequent whipsaws.',
    simType: 'sma',
  },
  {
    id: 'ema',
    name: 'Exponential Moving Average (EMA)',
    shortCode: 'EMA',
    pillar: 'Trend Indicators',
    leadingOrLagging: 'Lagging',
    formula: 'EMA_t = P_t * k + EMA_{t-1} * (1 - k),  k = 2 / (N + 1)',
    defaultParams: '9 EMA, 20 EMA, 26 EMA',
    interpretation: 'Applies exponentially heavier weight to the most recent closing prices, reacting faster than SMA at inflection points.',
    actionableSignal: 'Pullbacks to a rising 20 EMA in Stage 2 uptrends offer high reward-to-risk trend entries.',
    commonTrap: 'Over-reacting to single-bar spikes because recent closes carry heavier weight.',
    simType: 'ema',
  },
  {
    id: 'macd',
    name: 'Moving Average Convergence Divergence (MACD)',
    shortCode: 'MACD',
    pillar: 'Trend Indicators',
    leadingOrLagging: 'Lagging',
    formula: 'MACD = EMA(12) - EMA(26) | Signal = EMA(9) of MACD | Hist = MACD - Signal',
    defaultParams: '(12, 26, 9)',
    interpretation: 'Tracks separation between fast and slow trend averages; histogram expansion reflects impulse acceleration.',
    actionableSignal: 'Bullish centerline cross or bullish divergence below zero confirms momentum reversal.',
    commonTrap: 'Trading every signal-line cross against a steep higher-timeframe downtrend.',
    simType: 'macd',
  },
  {
    id: 'adx',
    name: 'Average Directional Index (ADX)',
    shortCode: 'ADX',
    pillar: 'Trend Indicators',
    leadingOrLagging: 'Lagging',
    formula: 'DX = 100 * |+DI - -DI| / (+DI + -DI) | ADX = Smoothed(DX, 14)',
    defaultParams: '14-period (+DI / -DI + ADX)',
    interpretation: 'Measures pure trend strength (0–100) regardless of whether price is rising or falling.',
    actionableSignal: 'ADX rising above 25 with +DI > -DI signals a healthy, tradable trend; below 20 signals range chop.',
    commonTrap: 'Assuming a rising ADX always means price is going up—strong selloffs also push ADX above 35.',
    simType: 'adx',
  },

  // 2. Momentum Indicators
  {
    id: 'rsi',
    name: 'Relative Strength Index (RSI)',
    shortCode: 'RSI',
    pillar: 'Momentum Indicators',
    leadingOrLagging: 'Leading',
    formula: 'RS = Avg Gain(14) / Avg Loss(14) | RSI = 100 - [100 / (1 + RS)]',
    defaultParams: '14-period (Overbought >70, Oversold <30)',
    interpretation: 'Quantifies speed and magnitude of recent directional closes to identify overextension and regime shifts.',
    actionableSignal: 'In bull markets, RSI 40–50 acts as support; bullish divergence (lower price low, higher RSI low) marks bottoms.',
    commonTrap: 'Shorting simply because RSI crosses 70—strong secular leaders stay overbought (>70) for weeks.',
    simType: 'rsi',
  },
  {
    id: 'stoch',
    name: 'Stochastic Oscillator (%K / %D)',
    shortCode: 'STOCH',
    pillar: 'Momentum Indicators',
    leadingOrLagging: 'Leading',
    formula: '%K = 100 * (Close - Low_14) / (High_14 - Low_14) | %D = SMA_3(%K)',
    defaultParams: '(14, 3, 3) | Zones: 80 / 20',
    interpretation: 'Measures where the close settled relative to the N-period high-low range. Strong uptrends close near highs.',
    actionableSignal: '%K crossing above %D from below 20 inside an overall uptrend signals resumption of buying.',
    commonTrap: 'Relying on Stochastic overbought readings (>80) during runaway breakouts.',
    simType: 'stoch',
  },

  // 3. Volume Indicators
  {
    id: 'obv',
    name: 'On-Balance Volume (OBV)',
    shortCode: 'OBV',
    pillar: 'Volume Indicators',
    leadingOrLagging: 'Leading',
    formula: 'OBV_t = OBV_{t-1} + Volume (if Close_t > Close_{t-1}) | - Volume (if down)',
    defaultParams: 'Cumulative volume flow',
    interpretation: 'Tracks cumulative institutional accumulation or distribution before price breaks out of a range.',
    actionableSignal: 'OBV making new highs while price remains coiled below flat resistance predicts upside breakout.',
    commonTrap: 'Comparing raw OBV values across different stocks—only OBV slope and divergences matter.',
    simType: 'obv',
  },
  {
    id: 'mfi',
    name: 'Money Flow Index (MFI)',
    shortCode: 'MFI',
    pillar: 'Volume Indicators',
    leadingOrLagging: 'Leading',
    formula: 'Typical Price = (H+L+C)/3 | Money Flow = TP * Volume | MFI = 100 - [100 / (1 + PosMF/NegMF)]',
    defaultParams: '14-period (Zones: 80 / 20)',
    interpretation: 'Often called "Volume-Weighted RSI"—combines price velocity with dollar-volume participation.',
    actionableSignal: 'MFI dropping below 20 at key structural support while price holds reveals hidden dip-buying.',
    commonTrap: 'Treating 80+ MFI alone as a sell trigger without bearish price structure confirmation.',
    simType: 'mfi',
  },
  {
    id: 'ad',
    name: 'Accumulation / Distribution Line (A/D)',
    shortCode: 'A/D',
    pillar: 'Volume Indicators',
    leadingOrLagging: 'Coincident',
    formula: 'CLV = [(C - L) - (H - C)] / (H - L) | A/D = Prev A/D + CLV * Volume',
    defaultParams: 'Close Location Value weighted cumulative sum',
    interpretation: 'Evaluates intraday buying vs. selling pressure by checking where the close landed inside the high-low bar.',
    actionableSignal: 'Rising A/D during flat consolidation confirms quiet institutional absorption of overhead supply.',
    commonTrap: 'Gap openings are ignored by CLV, so pair A/D with OBV on catalyst gap stocks.',
    simType: 'ad',
  },

  // 4. Volatility Indicators
  {
    id: 'bb',
    name: 'Bollinger Bands',
    shortCode: 'BB',
    pillar: 'Volatility Indicators',
    leadingOrLagging: 'Coincident',
    formula: 'Middle = SMA(20) | Upper/Lower = SMA(20) ± (2.0 * StdDev(20))',
    defaultParams: '(20, 2.0)',
    interpretation: 'Dynamic volatility envelope widening during expansion and pinching tightly ("Squeeze") before major moves.',
    actionableSignal: 'Bollinger Squeeze breakout above upper band with rising volume initiates sustained trend waves.',
    commonTrap: 'Assuming touching the upper band means sell—"walking the band" is a hallmark of strong trends.',
    simType: 'bb',
  },
  {
    id: 'atr',
    name: 'Average True Range (ATR)',
    shortCode: 'ATR',
    pillar: 'Volatility Indicators',
    leadingOrLagging: 'Coincident',
    formula: 'TR = max(H - L, |H - C_prev|, |L - C_prev|) | ATR = Smoothed(TR, 14)',
    defaultParams: '14-period dollar or % volatility',
    interpretation: 'Measures true price expansion including overnight gaps. Essential for volatility-adjusted position sizing.',
    actionableSignal: 'Place protective stops at 1.5x–2.0x ATR from entry and size shares so 1 trade loss <= 1% account risk.',
    commonTrap: 'Using ATR to predict direction—ATR measures volatility magnitude, never bullish or bearish bias.',
    simType: 'atr',
  },

  // 5. Support & Resistance Tools
  {
    id: 'fib',
    name: 'Fibonacci Retracements & Extensions',
    shortCode: 'FIB',
    pillar: 'Support & Resistance',
    leadingOrLagging: 'Structural',
    formula: 'Retrace Price = Swing High - Ratio * (Swing High - Swing Low) | Ratios: 0.382, 0.500, 0.618',
    defaultParams: '38.2%, 50.0%, 61.8% retracement; 127.2%, 161.8% extension',
    interpretation: 'Identifies high-probability pullback zones inside impulse legs where institutional algorithms reload positions.',
    actionableSignal: 'Confluence of 61.8% ("Golden Pocket") with a horizontal shelf or 50 SMA gives elite entry odds.',
    commonTrap: 'Drawing Fibs on meaningless intraday wicks instead of clear primary swing highs and lows.',
    simType: 'fib',
  },
];

// =============================================================================
// 2. SUPPORT & RESISTANCE TRADING PLAYBOOK (Optimus Futures + StockCharts)
// =============================================================================

export interface SRStrategyPlaybook {
  id: string;
  name: string;
  setupRule: string;
  entryTrigger: string;
  stopPlacement: string;
  targetProjection: string;
  checklist: string[];
}

export const SR_PLAYBOOKS: SRStrategyPlaybook[] = [
  {
    id: 'bounce',
    name: 'Zone Bounce (Mean Reversion / Range)',
    setupRule: 'Price approaches a horizontal shelf tested cleanly at least 2–3 prior times with decreasing approach momentum.',
    entryTrigger: 'Wait for a rejection candle (Hammer, Pin Bar, or Engulfing) inside the shaded liquidity zone rather than blind limit orders.',
    stopPlacement: '1.0x–1.5x ATR beyond the outer boundary of the zone (never inside the wick sweep noise).',
    targetProjection: 'Opposing range ceiling or prior structural swing midpoint (minimum 2:1 reward-to-risk).',
    checklist: ['Horizontal zone spans wicks to closes (not a razor-thin line)', 'Minimum 2 prior structural touches', 'Confirmation rejection candle closes back inside range'],
  },
  {
    id: 'breakout-retest',
    name: 'Breakout + Pullback Retest (Polarity Flip)',
    setupRule: 'Prior multi-week resistance ceiling breaks on >1.5x relative volume, flipping old supply into fresh demand (Role Reversal).',
    entryTrigger: 'Enter on the low-volume retest of the broken level once a green hold candle prints above the flipped shelf.',
    stopPlacement: 'Beneath the retest candle low and back inside the prior broken range.',
    targetProjection: 'Height of prior consolidation base added to the breakout shelf.',
    checklist: ['Breakout bar closed decisively in top 25% of range', 'Pullback into old resistance happens on shrinking volume', 'R:R ratio exceeds 2.5:1'],
  },
  {
    id: 'liquidity-trap',
    name: 'False Breakout / Liquidity Sweep (Stop Hunt)',
    setupRule: 'Price spikes briefly beyond well-known support or resistance to trigger retail stops, then snaps violently back inside.',
    entryTrigger: 'Bar closes back inside the range trapping breakout buyers/sellers; enter on snap-back confirmation.',
    stopPlacement: '2 ticks beyond the extreme wick of the failed sweep bar.',
    targetProjection: 'Opposite boundary of the range as trapped traders unwind positions.',
    checklist: ['Wick pierces obvious round number or swing extreme', 'Immediate close fails to sustain outside boundary', 'High volume climax spike on reversal bar'],
  },
  {
    id: 'dynamic-ma',
    name: 'Dynamic Support & Trendline Channel',
    setupRule: 'In strong trends, rising 20 EMA / 50 SMA or ascending channel trendlines act as moving institutional floors.',
    entryTrigger: 'Confluence where rising 50 SMA intersects horizontal polarity support + bullish candle trigger.',
    stopPlacement: 'Close below both the horizontal shelf and the rising moving average.',
    targetProjection: 'Upper regression channel boundary or 161.8% swing extension.',
    checklist: ['Moving average slope clearly angled upward', 'Minimal overlap/choppiness around MA', 'Confluence with horizontal price memory'],
  },
];

// =============================================================================
// 3. ACCOUNTING FUNDAMENTALS & 8-CATEGORY RATIOS
// =============================================================================

export interface RatioFormulaItem {
  name: string;
  formula: string;
  benchmark: string;
  pitfall: string;
}

export interface RatioCategorySpec {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  title: string;
  summary: string;
  ratios: RatioFormulaItem[];
}

export const ACCOUNTING_RATIO_CATEGORIES: RatioCategorySpec[] = [
  {
    id: 'profitability',
    letter: 'A',
    title: 'Profitability & Return Ratios',
    summary: 'Measure unit economics, pricing power, and how efficiently capital compounds.',
    ratios: [
      { name: 'Gross Margin', formula: '(Revenue - COGS) / Revenue', benchmark: '> 40% (Software > 65%)', pitfall: 'Comparing grocery retailers (25%) directly against SaaS platforms (75%).' },
      { name: 'Operating Margin (EBIT)', formula: 'Operating Income / Revenue', benchmark: '> 15% durable moat', pitfall: 'One-time restructuring gains inflating non-core operating profit.' },
      { name: 'Return on Equity (ROE)', formula: 'Net Income / Average Shareholders Equity', benchmark: '> 15%', pitfall: 'Artificially inflated by heavy share buybacks or excessive leverage.' },
      { name: 'Return on Invested Capital (ROIC)', formula: 'NOPAT / (Total Debt + Equity - Cash)', benchmark: '> 15% & > WACC', pitfall: 'Ignoring off-balance-sheet operating leases or goodwill distortions.' },
    ],
  },
  {
    id: 'liquidity',
    letter: 'B',
    title: 'Short-Term Liquidity Ratios',
    summary: 'Evaluate ability to cover near-term obligations within 12 months without distressed financing.',
    ratios: [
      { name: 'Current Ratio', formula: 'Current Assets / Current Liabilities', benchmark: '1.5x – 2.5x', pitfall: 'Obsolete unsellable inventory inflating Current Assets.' },
      { name: 'Quick Ratio (Acid Test)', formula: '(Cash + Marketable Securities + Receivables) / Current Liabilities', benchmark: '> 1.0x', pitfall: 'Assuming stretched Accounts Receivable will collect at 100% face value.' },
      { name: 'Cash Ratio', formula: '(Cash + Equivalents) / Current Liabilities', benchmark: '> 0.5x', pitfall: 'Holding excessive idle cash earning below-WACC returns.' },
    ],
  },
  {
    id: 'leverage',
    letter: 'C',
    title: 'Leverage & Solvency Ratios',
    summary: 'Stress-test balance sheet resilience during credit freezes or earnings downturns.',
    ratios: [
      { name: 'Debt to Equity (D/E)', formula: 'Total Debt / Shareholders Equity', benchmark: '< 0.5x conservative', pitfall: 'Book equity suppressed by treasury stock from buybacks distorts D/E upward.' },
      { name: 'Net Debt / EBITDA', formula: '(Total Debt - Cash) / EBITDA', benchmark: '< 2.0x investment grade', pitfall: 'EBITDA ignores mandatory maintenance CapEx required to keep assets running.' },
      { name: 'Interest Coverage', formula: 'EBIT / Interest Expense', benchmark: '> 5.0x safe', pitfall: 'Low fixed coupon debt hiding upcoming refinancing shock at higher rates.' },
    ],
  },
  {
    id: 'valuation',
    letter: 'D',
    title: 'Valuation Multiples',
    summary: 'Compare market price against underlying earnings, assets, sales, and cash generation.',
    ratios: [
      { name: 'P/E Ratio', formula: 'Share Price / EPS', benchmark: '12x – 22x mature | <2x PEG', pitfall: 'Cyclical peaks show artificially low P/E right before earnings collapse.' },
      { name: 'EV / EBITDA', formula: '(Market Cap + Debt - Cash) / EBITDA', benchmark: '< 12x value | 12–20x quality', pitfall: 'Fails to penalize capital-intensive businesses with heavy annual CapEx.' },
      { name: 'Price / FCF & FCF Yield', formula: 'Free Cash Flow / Market Cap (Yield)', benchmark: 'FCF Yield > 4% (or > 10Y Treasury)', pitfall: 'Stock-based compensation (SBC) ignored in headline FCF.' },
      { name: 'PEG Ratio', formula: 'P/E Ratio / 5Y EPS CAGR (%)', benchmark: '< 1.0x undervalued GARP', pitfall: 'Assuming unsustainable 1-year rebound growth repeats for 5 years.' },
    ],
  },
  {
    id: 'pershare',
    letter: 'E',
    title: 'Per-Share Metrics',
    summary: 'Track actual ownership value per diluted share to spot equity dilution.',
    ratios: [
      { name: 'Diluted EPS', formula: '(Net Income - Pref Div) / Weighted Diluted Shares', benchmark: 'Consistent >10% CAGR', pitfall: 'Ignoring Non-GAAP adjustments that strip recurring SBC expenses.' },
      { name: 'FCF Per Share', formula: '(Operating Cash Flow - CapEx) / Diluted Shares', benchmark: 'Outpaces EPS over 5Y', pitfall: 'Deferring essential CapEx temporarily to window-dress FCF/share.' },
      { name: 'Book Value Per Share (BVPS)', formula: '(Total Equity - Goodwill optional) / Shares', benchmark: 'Relevant for Banks/REITs', pitfall: 'Using BVPS to value IP-driven software/brand compounders.' },
    ],
  },
  {
    id: 'growth',
    letter: 'F',
    title: 'Growth & Compounding (CAGR)',
    summary: 'Distinguish organic unit volume growth from accounting or acquisition boosts.',
    ratios: [
      { name: 'CAGR (Compound Annual Growth)', formula: '[(Ending Value / Beginning Value) ^ (1 / n)] - 1', benchmark: '> 12% compounders', pitfall: 'Measuring from a trough recession base skews 3Y CAGR upward.' },
      { name: 'Rule of 40 (SaaS)', formula: 'YoY Revenue Growth (%) + FCF Margin (%)', benchmark: '>= 40%', pitfall: 'Masking collapsing growth behind sudden deep R&D cuts.' },
      { name: 'Reinvestment Rate', formula: 'Net CapEx + Change in Working Capital / NOPAT', benchmark: 'Matches high ROIC runway', pitfall: 'High reinvestment into low-ROIC (<WACC) projects destroys value.' },
    ],
  },
  {
    id: 'efficiency',
    letter: 'G',
    title: 'Efficiency & Cash Conversion Cycle',
    summary: 'Measure how fast inventory turns into cash collected from customers.',
    ratios: [
      { name: 'Days Sales Outstanding (DSO)', formula: '(Accounts Receivable / Revenue) * 365', benchmark: 'Stable or falling', pitfall: 'Spiking DSO signals channel stuffing or customer credit distress.' },
      { name: 'Days Inventory Outstanding (DIO)', formula: '(Inventory / COGS) * 365', benchmark: 'Tight / below peer avg', pitfall: 'Rising DIO faster than sales precedes gross margin writedowns.' },
      { name: 'Cash Conversion Cycle (CCC)', formula: 'DIO + DSO - Days Payable Outstanding (DPO)', benchmark: 'Lower or negative (Costco/Apple)', pitfall: 'Artificially delaying supplier payments (DPO) strains supply chain.' },
    ],
  },
  {
    id: 'riskreturn',
    letter: 'H',
    title: 'Risk, Earnings Quality & Return',
    summary: 'Cross-check cash authenticity against GAAP net income and volatility.',
    ratios: [
      { name: 'FCF / Net Income Conversion', formula: 'Free Cash Flow / GAAP Net Income', benchmark: '> 0.85x high cash quality', pitfall: 'Serial <0.6x conversion warns of aggressive revenue recognition.' },
      { name: 'Piotroski F-Score (0–9)', formula: '9 binary checks across Profitability, Leverage, Efficiency', benchmark: '7–9 Strong | 0–3 Distress', pitfall: 'Backward-looking 1Y delta misses secular moat disruption.' },
      { name: 'Sharpe / Beta Adjusted Return', formula: '(Portfolio Return - Risk-Free) / StdDev', benchmark: 'Sharpe > 1.0 elite', pitfall: 'Low historical beta breaks down during correlation-to-1 panics.' },
    ],
  },
];

// =============================================================================
// 4. INVEST MODEL: 20 VALUATION CONCEPTS & BENCHMARK TABLES
// =============================================================================

export interface ValuationConceptItem {
  id: number;
  title: string;
  formulaOrRule: string;
  insight: string;
}

export const VALUATION_20_CONCEPTS: ValuationConceptItem[] = [
  { id: 1, title: 'Intrinsic Value vs. Market Price', formulaOrRule: 'Price = What you pay | Value = PV of future cash', insight: 'Price fluctuates daily with sentiment; intrinsic value anchors to discounted cash generation.' },
  { id: 2, title: 'Margin of Safety (Graham)', formulaOrRule: 'MoS = (Intrinsic Value - Price) / Intrinsic Value', insight: 'Require 20–35% discount to intrinsic value to cushion model errors and macro shocks.' },
  { id: 3, title: 'Enterprise Value (EV)', formulaOrRule: 'EV = Market Cap + Total Debt - Cash & Equivalents', insight: 'The true takeover price of the whole operating business including debt obligations.' },
  { id: 4, title: 'Free Cash Flow to Firm (FCFF)', formulaOrRule: 'FCFF = EBIT(1 - t) + D&A - CapEx - ΔNWC', insight: 'Cash available to all debt and equity capital providers before financing choices.' },
  { id: 5, title: 'Free Cash Flow to Equity (FCFE)', formulaOrRule: 'FCFE = CFO - CapEx + Net Borrowing', insight: 'Residual cash flow belonging strictly to common shareholders.' },
  { id: 6, title: 'Discount Rate / WACC', formulaOrRule: 'WACC = (E/V)*Ke + (D/V)*Kd*(1 - t)', insight: 'Blended hurdle rate capital providers demand for business risk; higher WACC lowers DCF value.' },
  { id: 7, title: 'Cost of Equity (CAPM)', formulaOrRule: 'Ke = Rf + Beta * (Rm - Rf)', insight: 'Risk-free 10Y Treasury yield plus equity risk premium scaled by Beta.' },
  { id: 8, title: 'Terminal Value (Perpetuity)', formulaOrRule: 'TV = FCF_n * (1 + g) / (WACC - g)', insight: 'Captures cash flows beyond Year 5–10; keep terminal g <= long-term GDP (~2.5–3%).' },
  { id: 9, title: 'Exit Multiple Terminal Value', formulaOrRule: 'TV = EBITDA_n * Target Exit Multiple', insight: 'Cross-check perpetuity math against historical sector EV/EBITDA exit multiples.' },
  { id: 10, title: 'Gordon Growth Model (DDM)', formulaOrRule: 'P_0 = D_1 / (Ke - g)', insight: 'Best suited for mature, stable dividend payers like utilities, banks, and consumer staples.' },
  { id: 11, title: 'ROIC vs. WACC Spread', formulaOrRule: 'Economic Profit = (ROIC - WACC) * Invested Capital', insight: 'Growth only creates shareholder value when incremental ROIC exceeds WACC.' },
  { id: 12, title: 'Reverse DCF (Implied Growth)', formulaOrRule: 'Solve for g such that DCF(g) == Market Price', insight: 'Reveals what growth rate the market is already pricing in before you buy.' },
  { id: 13, title: 'Earnings Yield vs. Bond Yield', formulaOrRule: 'EY = EBIT / EV  or  EPS / Price', insight: 'Compare equity earnings yield directly against 10Y risk-free Treasury yield.' },
  { id: 14, title: 'Graham Number Ceiling', formulaOrRule: 'GN = sqrt(22.5 * EPS * BVPS)', insight: 'Classic defensive upper price ceiling combining 15x P/E and 1.5x P/B constraints.' },
  { id: 15, title: 'Owner Earnings (Buffett)', formulaOrRule: 'Net Income + D&A - Maintenance CapEx - ΔNWC', insight: 'Separates essential upkeep CapEx from discretionary growth investments.' },
  { id: 16, title: 'Stock-Based Compensation (SBC) Diluter', formulaOrRule: 'True FCF = FCF - Cash Buybacks to Offset SBC', insight: 'SBC is a real economic expense—never add it back blindly in high-tech DCFs.' },
  { id: 17, title: 'Sum-of-the-Parts (SOTP)', formulaOrRule: 'Total EV = Sum(Segment EBITDA_i * Peer Multiple_i) - Net Debt', insight: 'Unlocks hidden value in conglomerates mixing high-growth cloud with legacy divisions.' },
  { id: 18, title: 'Cyclical Normalized Mid-Cycle Earnings', formulaOrRule: 'Normalized P/E = Price / 7Y Avg Operating Margin * Sales', insight: 'Avoid buying cyclicals at low P/E on peak margins or selling at high P/E on trough.' },
  { id: 19, title: 'Sensitivity Matrix Stress Testing', formulaOrRule: 'Vary WACC (±1.5%) × Terminal Growth (±0.75%)', insight: 'Intrinsic value is always a probability range, never a single fragile point estimate.' },
  { id: 20, title: 'Capital Allocation Track Record', formulaOrRule: 'Buybacks (< Intrinsic Value) + High-ROIC R&D + M&A Discipline', insight: 'Even great businesses destroy value if management overpays for dilutive acquisitions.' },
];

export interface BenchmarkMetricRow {
  metric: string;
  undervalued: string;
  fair: string;
  expensive: string;
  formulaNote: string;
}

export const VALUATION_20_BENCHMARKS: BenchmarkMetricRow[] = [
  { metric: 'P/E Ratio (Trailing)', undervalued: '< 15x', fair: '15x – 25x', expensive: '> 35x', formulaNote: 'Price / TTM EPS' },
  { metric: 'Forward P/E', undervalued: '< 13x', fair: '13x – 22x', expensive: '> 30x', formulaNote: 'Price / NTM Consensus EPS' },
  { metric: 'PEG Ratio', undervalued: '< 1.0x', fair: '1.0x – 1.8x', expensive: '> 2.5x', formulaNote: 'P/E / 5Y EPS Growth %' },
  { metric: 'Price / Book (P/B)', undervalued: '< 1.5x', fair: '1.5x – 4.0x', expensive: '> 8.0x', formulaNote: 'Asset-heavy / Financials focus' },
  { metric: 'Price / Sales (P/S)', undervalued: '< 1.5x', fair: '1.5x – 5.0x', expensive: '> 10.0x', formulaNote: 'Depends on Gross Margin profile' },
  { metric: 'Price / Free Cash Flow', undervalued: '< 14x', fair: '14x – 24x', expensive: '> 35x', formulaNote: 'Market Cap / Levered FCF' },
  { metric: 'EV / EBITDA', undervalued: '< 9x', fair: '9x – 15x', expensive: '> 22x', formulaNote: 'Capital-structure neutral' },
  { metric: 'EV / EBIT', undervalued: '< 12x', fair: '12x – 18x', expensive: '> 26x', formulaNote: 'Captures depreciation cost' },
  { metric: 'EV / Sales', undervalued: '< 2.0x', fair: '2.0x – 6.0x', expensive: '> 10.0x', formulaNote: 'Enterprise multiple on revenue' },
  { metric: 'Free Cash Flow Yield', undervalued: '> 6.0%', fair: '3.0% – 6.0%', expensive: '< 2.0%', formulaNote: 'FCF / Market Cap %' },
  { metric: 'Earnings Yield (E/P)', undervalued: '> 7.5%', fair: '4.5% – 7.5%', expensive: '< 3.0%', formulaNote: 'Compare vs 10Y Treasury Yield' },
  { metric: 'ROE (%)', undervalued: '> 20% (Quality)', fair: '12% – 20%', expensive: '< 10% (Weak)', formulaNote: 'Net Income / Equity' },
  { metric: 'ROIC (%)', undervalued: '> 18% (Moat)', fair: '10% – 18%', expensive: '< WACC (~8%)', formulaNote: 'NOPAT / Invested Capital' },
  { metric: 'ROCE (%)', undervalued: '> 20%', fair: '12% – 20%', expensive: '< 10%', formulaNote: 'EBIT / Capital Employed' },
  { metric: 'Gross Margin (%)', undervalued: '> 60% (Elite)', fair: '35% – 60%', expensive: '< 25% (Commodity)', formulaNote: '(Rev - COGS) / Rev' },
  { metric: 'Operating Margin (%)', undervalued: '> 22%', fair: '12% – 22%', expensive: '< 8%', formulaNote: 'EBIT / Revenue' },
  { metric: 'Debt / Equity', undervalued: '< 0.35x', fair: '0.35x – 0.85x', expensive: '> 1.50x', formulaNote: 'Lower = Recession resilience' },
  { metric: 'Interest Coverage', undervalued: '> 10x', fair: '4x – 10x', expensive: '< 2.5x', formulaNote: 'EBIT / Interest Expense' },
  { metric: 'DCF Margin of Safety', undervalued: '> +20%', fair: '-10% to +20%', expensive: '< -20%', formulaNote: '(Intrinsic - Price) / Intrinsic' },
  { metric: 'Price / Graham Number', undervalued: '< 0.85x', fair: '0.85x – 1.25x', expensive: '> 1.75x', formulaNote: 'Strict value defensive yardstick' },
];

export const ADDITIONAL_13_RATIOS: { name: string; target: string; category: string; interpretation: string }[] = [
  { name: 'Net Debt / EBITDA', target: '< 2.0x', category: 'Solvency', interpretation: 'Years of EBITDA needed to pay off net debt.' },
  { name: 'Current Ratio', target: '> 1.5x', category: 'Liquidity', interpretation: 'Short-term working capital cushion.' },
  { name: 'Quick Ratio', target: '> 1.0x', category: 'Liquidity', interpretation: 'Liquid assets excluding inventory.' },
  { name: 'Piotroski F-Score', target: '>= 7 / 9', category: 'Quality', interpretation: 'Composite 9-point financial momentum strength.' },
  { name: 'Altman Z-Score', target: '> 3.0 Safe', category: 'Distress', interpretation: 'Bankruptcy safety zone (<1.8 distress).' },
  { name: 'FCF / Net Income', target: '> 0.85x', category: 'Cash Auth', interpretation: 'Verifies GAAP earnings convert to cash.' },
  { name: 'CapEx / Sales', target: '< 6% Asset-Light', category: 'Efficiency', interpretation: 'Capital intensity needed to maintain scale.' },
  { name: 'Dividend Payout Ratio', target: '< 60%', category: 'Income', interpretation: 'Headroom to sustain and raise dividends.' },
  { name: 'Shareholder Yield', target: '> 4.5%', category: 'Capital Return', interpretation: 'Dividend Yield + Net Buyback Yield.' },
  { name: 'Rule of 40', target: '>= 40%', category: 'SaaS Growth', interpretation: 'Revenue Growth % + FCF Margin %.' },
  { name: 'Asset Turnover', target: 'Rising trend', category: 'Efficiency', interpretation: 'Revenue generated per $1 of total assets.' },
  { name: 'Cash Conversion Cycle', target: '< 30 days', category: 'Working Cap', interpretation: 'Speed of inventory-to-cash collection.' },
  { name: 'Beta (5Y Monthly)', target: '0.7 – 1.3', category: 'Volatility', interpretation: 'Sensitivity relative to S&P 500 benchmark.' },
];

// =============================================================================
// 5. 22-BOOK READING LIBRARY + PER-BOOK 4-SLIDE VISUAL PRESENTATION DECKS
// =============================================================================

export type BookTrack =
  | 'A. Beginner & Market Foundations'
  | 'B. Value Investing & Stock Selection'
  | 'C. Financial Statements & Valuation'
  | 'D. Technical Analysis & Trading'
  | 'E. Risk, Position Sizing & Psychology';

export interface BookPresentationSpec {
  id: number;
  track: BookTrack;
  title: string;
  author: string;
  year: number;
  tag: 'Start with this' | 'Essential' | 'Essential for valuation' | 'Advanced' | 'Core Playbook';
  thesis: string;
  /** Slide 1: Visual Mind Map */
  mindMapCenter: string;
  mindMapBranches: { branch: string; detail: string }[];
  /** Slide 2: Quantitative Diagram / Bar Comparison */
  chartTitle: string;
  chartBars: { label: string; value: number; unit: string; highlight?: boolean }[];
  /** Slide 3: Key Equation + Real-World Market Scenario */
  equationLabel: string;
  equationText: string;
  scenarioSteps: [string, string, string];
  /** Slide 4: Chapter Knowledge Check */
  quizQuestion: string;
  quizOptions: string[];
  quizCorrectIndex: number;
  quizExplanation: string;
}

export const BOOK_TRACKS: BookTrack[] = [
  'A. Beginner & Market Foundations',
  'B. Value Investing & Stock Selection',
  'C. Financial Statements & Valuation',
  'D. Technical Analysis & Trading',
  'E. Risk, Position Sizing & Psychology',
];

export const BOOKS_22_LIBRARY: BookPresentationSpec[] = [
  // Track A: Beginner & Market Foundations (#1 - #4)
  {
    id: 1,
    track: 'A. Beginner & Market Foundations',
    title: 'The Little Book of Common Sense Investing',
    author: 'John C. Bogle',
    year: 2007,
    tag: 'Start with this',
    thesis: 'Over decades, low-cost broad market index compounding outperforms >85% of high-fee active funds after expenses and taxes.',
    mindMapCenter: 'Fee-Minimized Compounding',
    mindMapBranches: [
      { branch: 'Zero-Sum Market Math', detail: 'Gross market return minus fees = net investor return.' },
      { branch: 'Expense Ratio Drag', detail: '1.5% annual fee consumes ~40% of 30Y terminal wealth.' },
      { branch: 'Reversion to Mean', detail: 'Top-decile active funds rarely stay in top quartile next decade.' },
      { branch: 'Core Satellite Rule', detail: 'Anchor 70%+ core in low-cost index before active alpha.' },
    ],
    chartTitle: '30-Year $100k Growth at 9% Gross Return vs. Annual Fee Drag',
    chartBars: [
      { label: '0.03% Index ETF', value: 1316, unit: '$k', highlight: true },
      { label: '0.50% Active Core', value: 1155, unit: '$k' },
      { label: '1.50% High-Fee Fund', value: 875, unit: '$k' },
      { label: '2.25% Advisory Wrap', value: 709, unit: '$k' },
    ],
    equationLabel: 'Net Wealth Equation',
    equationText: 'Terminal Wealth = Principal * (1 + Gross Return - Fee - Tax)^Years',
    scenarioSteps: ['Compare two S&P 500 investors over 30 years earning 9% gross.', 'Active investor loses 1.5%/yr to expense ratio and turnover taxes.', 'Index investor keeps $441k more from identical market returns.'],
    quizQuestion: 'According to Bogle’s CMH (Cost Matters Hypothesis), why do most active investors lag the market index?',
    quizOptions: [
      'Markets only go up during odd years',
      'Collective investors earn market return minus trading, fee, and tax friction',
      'Index funds use 3x derivatives leverage',
      'Small caps never pay dividends',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Before costs, beating the market is a zero-sum game; after fees, the average active dollar must underperform a low-cost index.',
  },
  {
    id: 2,
    track: 'A. Beginner & Market Foundations',
    title: 'A Random Walk Down Wall Street',
    author: 'Burton G. Malkiel',
    year: 1973,
    tag: 'Essential',
    thesis: 'Prices absorb public news rapidly; combine disciplined diversification, rebalancing, and behavioral awareness to avoid speculative bubbles.',
    mindMapCenter: 'Market Efficiency & Risk',
    mindMapBranches: [
      { branch: 'Bubble Anatomy', detail: 'Tulips to Dot-Com: narrative crowds out cash flow discipline.' },
      { branch: 'Modern Portfolio Theory', detail: 'Uncorrelated asset classes raise return per unit of risk.' },
      { branch: 'Dollar-Cost Averaging', detail: 'Systematic buying buys more shares during panics automatically.' },
      { branch: 'Rebalancing Discipline', detail: 'Trim winners back to target weight and buy laggards.' },
    ],
    chartTitle: 'Annualized Volatility vs. Portfolio Diversification',
    chartBars: [
      { label: '1 Stock Concentrated', value: 49, unit: '% Vol' },
      { label: '5 Stocks Narrow', value: 28, unit: '% Vol' },
      { label: '20 Diversified Stocks', value: 20, unit: '% Vol', highlight: true },
      { label: 'Global Multi-Asset', value: 13, unit: '% Vol', highlight: true },
    ],
    equationLabel: 'Sharpe Efficiency Check',
    equationText: 'Portfolio Sharpe = (E[Rp] - Rf) / sqrt(w1^2 σ1^2 + w2^2 σ2^2 + 2 w1 w2 Cov)',
    scenarioSteps: ['Hold 60% Equities / 40% Treasuries during a 30% equity drawdown.', 'Bonds rally, pushing allocation to 48% Equities / 52% Bonds.', 'Rebalancing automatically buys cheap equities without guessing the bottom.'],
    quizQuestion: 'What does owning ~20–30 uncorrelated equities primarily eliminate?',
    quizOptions: [
      'Systemic market-wide recession risk',
      'Idiosyncratic single-company unsystematic risk',
      'Inflation and interest rate risk',
      'Brokerage commission charges',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Diversification sharply reduces company-specific (unsystematic) risk while market beta remains.',
  },
  {
    id: 3,
    track: 'A. Beginner & Market Foundations',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    year: 2020,
    tag: 'Start with this',
    thesis: 'Financial outcomes depend far more on patience, avoiding ruin, and surviving volatility than on complex spreadsheets.',
    mindMapCenter: 'Behavior Beats Brilliance',
    mindMapBranches: [
      { branch: 'Compounding Time Horizon', detail: 'Warren Buffett earned 95%+ of his net worth after age 65.' },
      { branch: 'Room for Error', detail: 'Cash buffers prevent forced liquidation at cycle bottoms.' },
      { branch: 'Reasonable > Rational', detail: 'Pick a portfolio you can sleep through during a -35% bear market.' },
      { branch: 'Tail Events Drive Returns', detail: 'A few outlier holdings generate the majority of lifetime wealth.' },
    ],
    chartTitle: 'Share of Lifetime Compounding Generated in Final Third of Horizon',
    chartBars: [
      { label: 'Years 1–10', value: 8, unit: '% Wealth' },
      { label: 'Years 11–20', value: 21, unit: '% Wealth' },
      { label: 'Years 21–30', value: 71, unit: '% Wealth', highlight: true },
    ],
    equationLabel: 'Survival Constraint',
    equationText: 'Expected Compounding = Return^Years  (Zero if Ruin = True)',
    scenarioSteps: ['Two investors earn identical 11% returns; one uses margin leverage.', 'A -40% crash triggers a margin call, forcing permanent liquidation at lows.', 'The unlevered cash-buffered investor survives and captures the full recovery.'],
    quizQuestion: 'What is the single most powerful variable in Warren Buffett’s compounding formula according to Housel?',
    quizOptions: [
      'High-frequency intraday scalping',
      'Shutting up and staying invested uninterrupted for decades (Time)',
      'Predicting quarterly Fed rate cuts',
      'Concentrating 100% in options',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Good returns sustained over an extraordinarily long uninterrupted horizon produce exponential tail wealth.',
  },
  {
    id: 4,
    track: 'A. Beginner & Market Foundations',
    title: 'One Up On Wall Street',
    author: 'Peter Lynch',
    year: 1989,
    tag: 'Start with this',
    thesis: 'Individual investors possess an edge spotting winning products before institutions—classify companies by growth profile and watch PEG.',
    mindMapCenter: 'Lynch 6 Stock Categories',
    mindMapBranches: [
      { branch: 'Slow Growers & Stalwarts', detail: 'Large durable dividends (2–12% growth); sell on +40% pop.' },
      { branch: 'Fast Growers (10-Baggers)', detail: 'Small-to-mid expansion stories growing 20–25% with clean debt.' },
      { branch: 'Cyclicals & Turnarounds', detail: 'Autos/Semis/Airlines: buy when P/E looks high at trough earnings.' },
      { branch: 'PEG Valuation Anchor', detail: 'Fair growth stock trades at P/E <= Growth Rate (PEG <= 1.0).' },
    ],
    chartTitle: 'Peter Lynch Target PEG Attractiveness Scale',
    chartBars: [
      { label: 'PEG 0.5x (Bargain)', value: 95, unit: 'Score', highlight: true },
      { label: 'PEG 1.0x (Fair)', value: 75, unit: 'Score', highlight: true },
      { label: 'PEG 1.5x (Warm)', value: 45, unit: 'Score' },
      { label: 'PEG 2.8x (Stretched)', value: 18, unit: 'Score' },
    ],
    equationLabel: 'Peter Lynch Fair Value Rule',
    equationText: 'PEG Ratio = (Price / EPS) / (EPS 5Y Growth % + Dividend Yield %)',
    scenarioSteps: ['Spot a regional retail chain expanding store count with 22% ROE and zero debt.', 'Stock trades at 18x P/E while compounding earnings at 24% (PEG = 0.75).', 'Hold until store saturation approaches rather than selling at first +30% gain.'],
    quizQuestion: 'When evaluating a cyclical stock like an automaker or memory chipmaker, when are they typically cheapest to buy?',
    quizOptions: [
      'When trailing P/E is ultra-low (4x) at record peak margins',
      'When P/E looks optically high or negative near the bottom of the cycle',
      'Only after 5 consecutive years of margin expansion',
      'Whenever dividend payout exceeds 120%',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Cyclicals look cheapest right before earnings collapse; buy them when trough earnings depress trailing multiples before demand turns.',
  },

  // Track B: Value Investing & Stock Selection (#5 - #9)
  {
    id: 5,
    track: 'B. Value Investing & Stock Selection',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    year: 1949,
    tag: 'Essential',
    thesis: 'Treat stocks as fractional business ownership, exploit Mr. Market’s manic mood swings, and insist on a mathematical Margin of Safety.',
    mindMapCenter: 'Mr. Market & Margin of Safety',
    mindMapBranches: [
      { branch: 'Mr. Market Parable', detail: 'He is your servant offering daily quotes—not your advisor.' },
      { branch: 'Defensive vs Enterprising', detail: 'Match portfolio complexity strictly to analytical hours invested.' },
      { branch: 'Graham Number Filter', detail: 'Combine P/E <= 15 and P/B <= 1.5 (22.5 cap) for value discipline.' },
      { branch: 'Margin of Safety', detail: 'Buffer errors of foresight by buying well below appraisal.' },
    ],
    chartTitle: 'Margin of Safety Cushion vs. Capital Loss Probability',
    chartBars: [
      { label: '40% Discount to IV', value: 92, unit: 'Safety %', highlight: true },
      { label: '25% Discount to IV', value: 78, unit: 'Safety %', highlight: true },
      { label: '0% Fair Value Buy', value: 50, unit: 'Safety %' },
      { label: '+30% Overpaid', value: 22, unit: 'Safety %' },
    ],
    equationLabel: 'Graham Number Ceiling',
    equationText: 'Graham Number = sqrt(22.5 * EPS * Book Value Per Share)',
    scenarioSteps: ['Calculate Graham Number on a profitable industrial firm ($4 EPS, $28 BVPS -> $50.20).', 'During macro panic, Mr. Market quotes shares at $34 (32% Margin of Safety).', 'Buy below intrinsic floor and wait patiently for valuation normalization.'],
    quizQuestion: 'How should an intelligent investor treat daily price fluctuations from "Mr. Market"?',
    quizOptions: [
      'Copy his optimism on highs and panic with him at lows',
      'Ignore him unless his quoted price offers an irrational discount or huge premium',
      'Trade every 1% intraday move',
      'Measure business quality purely by ticker volatility',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Mr. Market provides liquidity on demand; you only transact when his emotional pricing favors your intrinsic estimate.',
  },
  {
    id: 6,
    track: 'B. Value Investing & Stock Selection',
    title: 'Common Stocks and Uncommon Profits',
    author: 'Philip Fisher',
    year: 1958,
    tag: 'Essential',
    thesis: 'Generate multi-decade wealth via "Scuttlebutt" qualitative research into R&D moats, sales execution, and ethical management.',
    mindMapCenter: 'Fisher 15-Point Scuttlebutt',
    mindMapBranches: [
      { branch: 'Scuttlebutt Research', detail: 'Interview competitors, suppliers, and customers before buying.' },
      { branch: 'R&D Productivity', detail: 'Measure dollar revenue produced per R&D dollar invested.' },
      { branch: 'Margin Defense', detail: 'Superior product ecosystems sustain >20% operating margins.' },
      { branch: 'When to Sell: Almost Never', detail: 'Hold elite growth compounders unless thesis permanently breaks.' },
    ],
    chartTitle: 'Fisher Qualitative Moat Weighting Framework',
    chartBars: [
      { label: 'R&D Runway & Moat', value: 35, unit: '% Wt', highlight: true },
      { label: 'Management Integrity', value: 25, unit: '% Wt', highlight: true },
      { label: 'Sales Org Depth', value: 20, unit: '% Wt' },
      { label: 'Cost/Margin Control', value: 20, unit: '% Wt' },
    ],
    equationLabel: 'R&D Yield Check',
    equationText: '3Y Incremental Gross Profit / 3Y Cumulative R&D Spend > 1.5x',
    scenarioSteps: ['Competitors praise a semiconductor equipment supplier as irreplaceable.', 'Gross margins stay above 52% through industry downturns while R&D grows.', 'Hold through temporary P/E multiple compression for 10x+ long-term compounding.'],
    quizQuestion: 'What are the three valid reasons Philip Fisher gives for selling a great growth stock?',
    quizOptions: [
      'It went up 25%, RSI > 70, or the Fed hiked rates',
      'Mistake in original thesis, company stopped qualifying on the 15 points, or a clearly superior opportunity',
      'Any 10% market pullback',
      'Quarterly EPS missed consensus by $0.01',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Fisher advised never selling a great business purely for short-term market timing unless fundamentals deteriorate or a mistake was made.',
  },
  {
    id: 7,
    track: 'B. Value Investing & Stock Selection',
    title: 'The Little Book That Beats the Market',
    author: 'Joel Greenblatt',
    year: 2005,
    tag: 'Essential',
    thesis: 'Systematically rank companies on two factors: buying high Return on Capital businesses at high Earnings Yields ("Magic Formula").',
    mindMapCenter: 'Magic Formula Dual Rank',
    mindMapBranches: [
      { branch: 'Factor 1: Business Quality', detail: 'EBIT / (Net Working Capital + Net Fixed Assets).' },
      { branch: 'Factor 2: Cheapness', detail: 'EBIT / Enterprise Value (Earnings Yield).' },
      { branch: 'Combined Ranking', detail: 'Sum rank #ROC + rank #EY; buy top 20–30 diversified picks.' },
      { branch: 'Behavioral Edge', detail: 'Formula works because it underperforms occasionally, shaking out quitters.' },
    ],
    chartTitle: 'Dual-Factor Ranking Example (Lower Rank Sum = Higher Conviction)',
    chartBars: [
      { label: 'Top Pick (ROC #3 + EY #5)', value: 92, unit: 'Score', highlight: true },
      { label: 'Quality Expensive (#2 + #68)', value: 58, unit: 'Score' },
      { label: 'Value Trap (#75 + #4)', value: 52, unit: 'Score' },
      { label: 'Low Quality (#88 + #79)', value: 15, unit: 'Score' },
    ],
    equationLabel: 'Magic Formula Core Pair',
    equationText: 'Earnings Yield = EBIT / EV   |   Return on Capital = EBIT / (NWC + Net Fixed Assets)',
    scenarioSteps: ['Exclude financials and utilities where debt structure distorts EV.', 'Rank remaining universe by Earnings Yield and Return on Capital independently.', 'Rebalance annually into top-ranked names, holding losers <1Y / winners >1Y for tax efficiency.'],
    quizQuestion: 'Why does Greenblatt use EBIT / Enterprise Value instead of standard P/E?',
    quizOptions: [
      'To ignore tax rates and capital structure (debt vs. cash) differences across firms',
      'Because EBIT ignores depreciation expense',
      'Because Enterprise Value excludes market cap',
      'To favor heavily indebted companies',
    ],
    quizCorrectIndex: 0,
    quizExplanation: 'EBIT/EV puts leveraged and cash-rich companies on an apples-to-apples pre-tax operating valuation basis.',
  },
  {
    id: 8,
    track: 'B. Value Investing & Stock Selection',
    title: 'Margin of Safety',
    author: 'Seth Klarman',
    year: 1991,
    tag: 'Advanced',
    thesis: 'Focus on risk-adjusted absolute returns, catalyst-driven special situations, and refusing to stretch for overpriced consensus assets.',
    mindMapCenter: 'Risk-First Absolute Value',
    mindMapBranches: [
      { branch: 'Absolute Not Relative', detail: 'Loss of capital is unacceptable even if peers drop more.' },
      { branch: 'Catalyst Realization', detail: 'Spin-offs, buybacks, or restructurings unlock trapped value.' },
      { branch: 'Forced Sellers Edge', detail: 'Index exclusions & fund redemptions create irrational bargains.' },
      { branch: 'Cash as Optionality', detail: 'Holding cash when bargains vanish preserves future strike power.' },
    ],
    chartTitle: 'Asymmetry Required to Recover From Drawdowns',
    chartBars: [
      { label: '-10% Loss -> Gain Needed', value: 11, unit: '% Gain', highlight: true },
      { label: '-25% Loss -> Gain Needed', value: 33, unit: '% Gain' },
      { label: '-50% Loss -> Gain Needed', value: 100, unit: '% Gain' },
      { label: '-75% Loss -> Gain Needed', value: 300, unit: '% Gain' },
    ],
    equationLabel: 'Downside Recovery Asymmetry',
    equationText: 'Required Recovery % = [1 / (1 - Drawdown)] - 1',
    scenarioSteps: ['A parent conglomerate spins off a profitable small division.', 'Index funds dump spun shares automatically regardless of intrinsic value.', 'Institutional forced selling drops EV/FCF to 5x, creating an asymmetric entry.'],
    quizQuestion: 'Why does Klarman treat Cash as an active strategic position rather than "dead weight"?',
    quizOptions: [
      'Cash earns more than growth equities over 30 years',
      'Cash prevents forced selling and buys panic bargains when liquidity dries up',
      'Cash eliminates inflation completely',
      'Cash increases portfolio Beta',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Cash acts as an option on future market dislocations when forced sellers offer assets far below intrinsic value.',
  },
  {
    id: 9,
    track: 'B. Value Investing & Stock Selection',
    title: 'You Can Be a Stock Market Genius',
    author: 'Joel Greenblatt',
    year: 1997,
    tag: 'Advanced',
    thesis: 'Outsized alpha hides in unfollowed corporate events—spin-offs, merger securities, stub equities, and recapitalizations.',
    mindMapCenter: 'Special Situation Catalysts',
    mindMapBranches: [
      { branch: 'Corporate Spin-Offs', detail: 'Eliminates institutional mandate friction and unlocks insider incentives.' },
      { branch: 'Merger Securities', detail: 'Odd-lot preferreds or warrants dumped post-closing by arb funds.' },
      { branch: 'Rights Offerings', detail: 'Over-subscription privileges allow cheap accumulation.' },
      { branch: 'Stub Leverage Math', detail: 'Small equity slices atop steady cash flows magnify upside.' },
    ],
    chartTitle: 'Historical Sources of Institutional Forced Mispricing',
    chartBars: [
      { label: 'Spin-Off Index Selling', value: 88, unit: 'Alpha Odds', highlight: true },
      { label: 'Post-Bankruptcy Equity', value: 82, unit: 'Alpha Odds', highlight: true },
      { label: 'LEAPS on Catalysts', value: 76, unit: 'Alpha Odds' },
      { label: 'Crowded Mega-Cap', value: 34, unit: 'Alpha Odds' },
    ],
    equationLabel: 'Spin-Off Insider Check',
    equationText: 'Post-Spin Incentive Alignment = New Option Grants at Spin Price + Index Exclusion Flow',
    scenarioSteps: ['A $40B parent spins off a $900M division to S&P 500 holders.', 'Passive funds cannot hold small-cap shares and liquidate in Week 1–3.', 'Check Form 10 filings for management option strikes and buy post-liquidation trough.'],
    quizQuestion: 'What structural force causes freshly spun-off companies to drop sharply right after listing?',
    quizOptions: [
      'The new division is always unprofitable',
      'Index funds and large-cap mandates automatically sell shares regardless of valuation',
      'Dividends are legally banned for 5 years',
      'Short sellers create synthetic shares',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Mandate-driven indiscriminate selling depresses spin-off prices independently of fundamental quality.',
  },

  // Track C: Financial Statements & Valuation (#10 - #13)
  {
    id: 10,
    track: 'C. Financial Statements & Valuation',
    title: 'Financial Shenanigans',
    author: 'Howard Schilit',
    year: 1993,
    tag: 'Essential for valuation',
    thesis: 'Detect accounting manipulation early by comparing accrual earnings against Operating Cash Flow, receivables velocity, and reserve releases.',
    mindMapCenter: 'Earnings Manipulation Detection',
    mindMapBranches: [
      { branch: 'Premature Revenue', detail: 'Booking multi-year contracts upfront or shipping before buyer sign-off.' },
      { branch: 'Capitalizing Operating Costs', detail: 'Shifting normal expenses onto Balance Sheet assets to inflate EBITDA.' },
      { branch: 'Cash Flow Divergence', detail: 'Net income rising while Operating Cash Flow shrinks or turns negative.' },
      { branch: 'Acquisition Accounting', detail: 'Using cookie-jar merger reserves to smooth post-deal organic profits.' },
    ],
    chartTitle: 'Red-Flag Divergence: Earnings Quality Warning Signals',
    chartBars: [
      { label: 'DSO Spike > +25% YoY', value: 90, unit: 'Risk Score', highlight: true },
      { label: 'OCF / Net Income < 0.6', value: 86, unit: 'Risk Score', highlight: true },
      { label: 'Inventory > 2x Sales Gr', value: 78, unit: 'Risk Score' },
      { label: 'Frequent Non-GAAP Adds', value: 70, unit: 'Risk Score' },
    ],
    equationLabel: 'Cash Quality Red-Flag Ratio',
    equationText: 'Earnings Quality = Operating Cash Flow / Net Income   (Healthy >= 1.0x)',
    scenarioSteps: ['Inspect a fast-growing company reporting +30% EPS growth.', 'Notice Days Sales Outstanding jumped from 45 to 78 days while OCF dropped 40%.', 'Avoid the stock before revenue restatement or inventory writedown hits.'],
    quizQuestion: 'Which divergence across the 3 financial statements most strongly warns of aggressive revenue recognition?',
    quizOptions: [
      'Accounts Receivable growing dramatically faster than Revenue while Operating Cash Flow lags Net Income',
      'Rising Cash on the Balance Sheet alongside shrinking Debt',
      'CapEx remaining lower than Depreciation on mature utilities',
      'Falling Days Inventory Outstanding alongside rising Gross Margins',
    ],
    quizCorrectIndex: 0,
    quizExplanation: 'Uncollected credit sales inflate GAAP revenue and receivables while cash fails to arrive in Operating Cash Flow.',
  },
  {
    id: 11,
    track: 'C. Financial Statements & Valuation',
    title: 'Quality of Earnings',
    author: 'Thornton O’Glove',
    year: 1987,
    tag: 'Essential for valuation',
    thesis: 'Look past headline EPS numbers—analyze footnotes, tax-rate shifts, inventory mix, and order backlogs to spot inflection points first.',
    mindMapCenter: 'Footnote & Forensic Analysis',
    mindMapBranches: [
      { branch: 'Inventory Composition', detail: 'Finished goods piling up faster than raw materials signals slowing demand.' },
      { branch: 'Effective Tax Rate Shifts', detail: 'One-time tax credits mask deteriorating pre-tax operating margins.' },
      { branch: 'Shareholder Letter Audit', detail: 'Compare executive tone and KPI definitions year over year.' },
      { branch: 'Differential Disclosure', detail: 'Cross-check SEC 10-K tax footnotes against glossy investor slides.' },
    ],
    chartTitle: 'Inventory Breakdown Warning Matrix (% Change YoY)',
    chartBars: [
      { label: 'Raw Materials (+28%)', value: 85, unit: 'Bullish Demand', highlight: true },
      { label: 'Work in Progress (+15%)', value: 65, unit: 'Normal' },
      { label: 'Finished Goods (+55%)', value: 92, unit: 'Stalled Sales', highlight: true },
    ],
    equationLabel: 'Finished Goods Red Flag',
    equationText: 'Excess Inventory Risk = ΔFinished Goods % - ΔCost of Goods Sold %',
    scenarioSteps: ['Total inventory rose 20%, which looks benign against 18% revenue growth.', 'Open the 10-K footnote: raw materials dropped -12% while finished goods surged +48%.', 'Management slowed production because unsold finished stock is backing up in warehouses.'],
    quizQuestion: 'In Thornton O’Glove’s inventory decomposition, what signals slowing end-market demand?',
    quizOptions: [
      'Raw materials surging ahead of finished goods',
      'Finished goods ballooning rapidly while raw materials and sales slow down',
      'Inventory turnover accelerating year over year',
      'LIFO reserves shrinking to zero',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Accumulating finished goods coupled with declining raw-material orders reveals unsold backlog.',
  },
  {
    id: 12,
    track: 'C. Financial Statements & Valuation',
    title: 'The Five Rules for Successful Stock Investing',
    author: 'Pat Dorsey',
    year: 2004,
    tag: 'Essential for valuation',
    thesis: 'Economic Moats—network effects, switching costs, intangible brands, and cost scale—determine how long ROIC stays above WACC.',
    mindMapCenter: 'Dorsey Moat & DCF Blueprint',
    mindMapBranches: [
      { branch: '4 Moat Pillars', detail: 'Intangible Assets, Switching Costs, Network Effect, Cost Advantage.' },
      { branch: '10-Minute Test', detail: 'Eliminate serial cash burners and serial acquirers in 10 minutes.' },
      { branch: 'Fade Rate Protection', detail: 'Wide moats sustain ROIC > WACC for 15+ years in DCF terminal math.' },
      { branch: 'Sector Dynamics', detail: 'Industry structure matters—software economics beat airlines.' },
    ],
    chartTitle: 'ROIC Durability by Economic Moat Classification (Year 10)',
    chartBars: [
      { label: 'Wide Moat (Network/Switch)', value: 26, unit: '% ROIC', highlight: true },
      { label: 'Narrow Moat (Scale)', value: 15, unit: '% ROIC', highlight: true },
      { label: 'No Moat (Commodity)', value: 7, unit: '% ROIC' },
    ],
    equationLabel: 'Excess Capital Compounding',
    equationText: 'Moat Value Created = Invested Capital * (ROIC - WACC) * Fade Duration',
    scenarioSteps: ['Evaluate an enterprise ERP platform with 96% gross retention.', 'Switching banks/factories off core software risks operational failure (high switching cost).', 'Even at 28x P/E, sustained 30% ROIC compounds intrinsic value past short-term multiples.'],
    quizQuestion: 'Which moat source strengthens automatically every time a new user joins a marketplace or payments rail?',
    quizOptions: [
      'Short-term promotional discounting',
      'The Network Effect',
      'High financial leverage',
      'Commodity capacity expansion',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Network effects compound ecosystem value non-linearly as participants increase.',
  },
  {
    id: 13,
    track: 'C. Financial Statements & Valuation',
    title: 'Valuation (McKinsey) / Damodaran on Valuation',
    author: 'Koller / Aswath Damodaran',
    year: 2020,
    tag: 'Essential for valuation',
    thesis: 'Value is driven mathematically by two levers: Cash Flow Growth and Return on Invested Capital—treat DCF as a living narrative + numbers bridge.',
    mindMapCenter: 'DCF Architecture & ROIC Engine',
    mindMapBranches: [
      { branch: 'Story + Numbers', detail: 'Every revenue assumption must map to real market share & TAM.' },
      { branch: 'No-Free-Growth Rule', detail: 'Growth requires reinvestment: Reinvestment Rate = g / ROIC.' },
      { branch: 'Operating Lease & R&D Fix', detail: 'Capitalize R&D to measure true invested capital in tech/pharma.' },
      { branch: 'Monte Carlo Ranges', detail: 'Stress test margin, sales CAGR, and WACC across distributions.' },
    ],
    chartTitle: 'DCF Sensitivity: Enterprise Value Drivers Ranked by Impact',
    chartBars: [
      { label: 'Terminal ROIC & Margin', value: 94, unit: 'Impact', highlight: true },
      { label: 'WACC Discount Rate', value: 88, unit: 'Impact', highlight: true },
      { label: '5Y Revenue CAGR', value: 79, unit: 'Impact' },
      { label: 'Tax Rate (±2%)', value: 28, unit: 'Impact' },
    ],
    equationLabel: 'Reinvestment Growth Identity',
    equationText: 'Expected EBIT Growth (g) = Reinvestment Rate * Return on Incremental Capital (ROIC)',
    scenarioSteps: ['Model two firms both growing revenue 15%: Firm A at 40% ROIC, Firm B at 9% ROIC.', 'Firm A needs only 37.5% reinvestment (62.5% becomes FCF); Firm B consumes 166% reinvestment.', 'High-ROIC growth is vastly more valuable than capital-hungry growth.'],
    quizQuestion: 'If a firm’s ROIC equals 30% and it targets 15% annual operating growth, what reinvestment rate is required?',
    quizOptions: [
      '100% of earnings',
      '50% of NOPAT (g / ROIC = 15% / 30%)',
      '5% of revenue',
      'Zero reinvestment',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Growth requires capital: Reinvestment Rate = Growth / ROIC = 15% / 30% = 50%.',
  },

  // Track D: Technical Analysis & Trading (#14 - #18)
  {
    id: 14,
    track: 'D. Technical Analysis & Trading',
    title: 'Technical Analysis of the Financial Markets',
    author: 'John J. Murphy',
    year: 1999,
    tag: 'Core Playbook',
    thesis: 'Master Dow Theory, classical chart patterns, volume confirmation, and intermarket correlations across equities, bonds, commodities, and USD.',
    mindMapCenter: 'Classical Chart & Intermarket Core',
    mindMapBranches: [
      { branch: 'Price Discounts Everything', detail: 'All known fundamentals reflect immediately in price action.' },
      { branch: 'Trends Persist', detail: 'Trade with primary trend until concrete reversal structure forms.' },
      { branch: 'Volume Confirms Price', detail: 'Breakouts must expand volume; pullbacks should dry up.' },
      { branch: 'Intermarket Links', detail: 'Dollar, yields, and copper/oil lead equity sector rotations.' },
    ],
    chartTitle: 'Multi-Timeframe Signal Weight Hierarchy (Murphy)',
    chartBars: [
      { label: 'Weekly Primary Trend', value: 95, unit: 'Weight', highlight: true },
      { label: 'Daily Pattern & Volume', value: 80, unit: 'Weight', highlight: true },
      { label: 'Intraday Timing Entry', value: 45, unit: 'Weight' },
    ],
    equationLabel: 'Measured Move Target Rule',
    equationText: 'Breakout Target = Breakout Level + Pattern Base Vertical Height',
    scenarioSteps: ['Identify a 6-month Ascending Triangle peaking at $120 with base low at $100.', 'Price breaks $120 on 2.1x 50-day average volume.', 'Project $20 pattern height above $120 for a structural $140 target.'],
    quizQuestion: 'In classical technical analysis, what volume profile validates a genuine breakout above resistance?',
    quizOptions: [
      'Volume falling 50% below average on the breakout bar',
      'Sharp expansion in volume confirming institutional participation',
      'Zero volume change',
      'Heavy volume only on the preceding red candles',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Upside breakouts require surging volume to clear overhead supply; declining volume warns of a bull trap.',
  },
  {
    id: 15,
    track: 'D. Technical Analysis & Trading',
    title: 'Japanese Candlestick Charting Techniques',
    author: 'Steve Nison',
    year: 1991,
    tag: 'Core Playbook',
    thesis: 'Decode real-time auction psychology—wick rejections, engulfing wraps, morning stars, and doji indecision—directly at structural S/R zones.',
    mindMapCenter: 'Candle Psychology & Western S/R',
    mindMapBranches: [
      { branch: 'Body vs Shadow Ratio', detail: 'Long wicks mark immediate rejection of extreme prices.' },
      { branch: 'Context Is Mandatory', detail: 'A Hammer inside chop means nothing; at major support it is gold.' },
      { branch: 'Multi-Bar Fusion', detail: 'Engulfing, Harami, and Morning Star confirm buyer/seller handoffs.' },
      { branch: 'Blend With Western TA', detail: 'Align candles with trendlines, volume nodes, and RSI.' },
    ],
    chartTitle: 'Candlestick Reliability Boost When Aligned With Confluence',
    chartBars: [
      { label: 'Hammer + Major Support + Vol', value: 86, unit: '% Quality', highlight: true },
      { label: 'Engulfing at 50 SMA', value: 78, unit: '% Quality', highlight: true },
      { label: 'Isolated Candle Mid-Range', value: 38, unit: '% Quality' },
    ],
    equationLabel: 'Rejection Wick Dominance',
    equationText: 'Valid Pin/Hammer Requirement: Rejection Wick >= 2.0 * |Close - Open|',
    scenarioSteps: ['Stock pulls back for 7 sessions straight into a prior 3-month support shelf.', 'Session prints a Dragonfly Doji / Hammer tail sweeping stops below support and closing at high.', 'Enter above candle high with risk strictly anchored under the sweep tail.'],
    quizQuestion: 'Why must a candlestick reversal signal always be judged by its prior trend context?',
    quizOptions: [
      'Patterns only work on Mondays',
      'A reversal pattern requires an existing trend to reverse—otherwise it is noise',
      'Green candles cannot appear in downtrends',
      'Candlesticks ignore opening prices',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Without a preceding swing move into a key structural zone, reversal shapes lack trapped participants.',
  },
  {
    id: 16,
    track: 'D. Technical Analysis & Trading',
    title: 'How to Make Money in Stocks',
    author: 'William J. O’Neil',
    year: 1988,
    tag: 'Core Playbook',
    thesis: 'Combine accelerating quarterly earnings (C-A-N) with institutional sponsorship and Cup-with-Handle breakouts (S-L-I-M), cutting every loss at -7% to -8%.',
    mindMapCenter: 'CAN SLIM Growth Momentum',
    mindMapBranches: [
      { branch: 'C & A (Earnings Acceleration)', detail: 'Quarterly EPS +25%+ & 3Y annual EPS >25% with strong ROE.' },
      { branch: 'N & L (New High Leaders)', detail: 'Leaders break into fresh highs with RS Rating > 85.' },
      { branch: 'I (Institutional Sponsorship)', detail: 'Rising number of top-performing funds accumulating shares.' },
      { branch: 'M (Market Direction)', detail: '3 of 4 stocks follow the broad index—stay defensive in bear trends.' },
    ],
    chartTitle: 'O’Neil Mandatory Risk/Reward Asymmetry Rule',
    chartBars: [
      { label: 'Hard Stop Loss Cap', value: 8, unit: '% Max Risk', highlight: true },
      { label: '8-Week Hold Rule Trigger', value: 20, unit: '% Gain <3W', highlight: true },
      { label: 'Base Breakout Volume Min', value: 40, unit: '% Above Avg' },
    ],
    equationLabel: 'Breakout Confirmation Rule',
    equationText: 'Buy Pivot = Cup Handle High + $0.10  on Volume >= 1.4x 50-Day Avg',
    scenarioSteps: ['Filter for stocks with +35% YoY EPS growth and RS Rating 92.', 'Spot a 9-week Cup-with-Handle base with dry volume in the handle.', 'Enter pivot breakout; cap any wrong entry ruthlessly at -7% to -8% maximum.'],
    quizQuestion: 'Under William O’Neil’s rules, what is the absolute maximum percentage loss allowed from entry on a stock?',
    quizOptions: [
      '25% to 30% to give it room',
      '7% to 8% maximum without exception',
      '50% before averaging down',
      'Never use stops on growth stocks',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Cutting every wrong breakout at 7–8% guarantees no small mistake ever turns into a devastating -50% loss.',
  },
  {
    id: 17,
    track: 'D. Technical Analysis & Trading',
    title: 'Trade Like a Stock Market Wizard',
    author: 'Mark Minervini',
    year: 2013,
    tag: 'Advanced',
    thesis: 'Buy superperformance stocks strictly in Stage 2 uptrends as volatility contracts from left to right (VCP), timing tight entries with minimal risk.',
    mindMapCenter: 'SEPA & Stage 2 VCP',
    mindMapBranches: [
      { branch: 'Stage 2 Trend Template', detail: 'Price > 50 > 150 > 200 SMA with rising 200 SMA.' },
      { branch: 'Volatility Contraction (VCP)', detail: 'Successive pullbacks tighten (e.g. -24% -> -11% -> -4%).' },
      { branch: 'Volume Dry-Up at Pivot', detail: 'Tightest contraction shows supply exhausted before pivot surge.' },
      { branch: 'Staggered Scale-Out', detail: 'Sell half at 2R–3R; trail remaining shares for multi-month runs.' },
    ],
    chartTitle: 'VCP Volatility Contraction Progression (Tightening Supply)',
    chartBars: [
      { label: 'Trough 1 Pullback', value: 24, unit: '% Depth' },
      { label: 'Trough 2 Pullback', value: 11, unit: '% Depth' },
      { label: 'Pivot Contraction T3', value: 3.5, unit: '% Depth', highlight: true },
    ],
    equationLabel: 'Expectancy Formula',
    equationText: 'Expectancy = (Win% * Avg Win) - (Loss% * Avg Loss)',
    scenarioSteps: ['Confirm Stage 2 Trend Template: 150 SMA > 200 SMA and price within 25% of 52W high.', 'Observe contraction from 22% swing down to a tight 3.5% weekly box on whisper volume.', 'Enter pivot break with a razor-tight 4% stop beneath the final VCP contraction.'],
    quizQuestion: 'What does shrinking volatility alongside drying volume on the right side of a VCP base indicate?',
    quizOptions: [
      'The company is going bankrupt',
      'Weak-handed overhead sellers have been absorbed, leaving minimal supply to block a breakout',
      'Institutional investors are dumping shares',
      'Beta has permanently risen above 3.0',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Tightening ranges on light volume prove supply has dried up; small demand spikes quickly propel price upward.',
  },
  {
    id: 18,
    track: 'D. Technical Analysis & Trading',
    title: 'Technical Analysis of Stock Trends',
    author: 'Edwards & Magee',
    year: 1948,
    tag: 'Advanced',
    thesis: 'The foundational encyclopedia of geometric supply/demand patterns—Head & Shoulders, Triangles, Flags, Support/Resistance polarity, and Dow Theory.',
    mindMapCenter: 'Classical Geometric Price Action',
    mindMapBranches: [
      { branch: 'Dow Confirmation', detail: 'Breakouts must sustain closing prints across primary averages.' },
      { branch: 'Reversal vs Consolidation', detail: 'Separate H&S/Double Tops from Flag/Triangle pauses.' },
      { branch: 'Minimum Target Formulas', detail: 'Project structural vertical height on every pattern break.' },
      { branch: 'Polarity Principle', detail: 'Broken support turns into ceiling resistance and vice versa.' },
    ],
    chartTitle: 'Classical Chart Pattern Completion Outcomes',
    chartBars: [
      { label: 'Triangle Apex (50–75%)', value: 84, unit: 'Break Odds', highlight: true },
      { label: 'Late Apex Drift (>85%)', value: 42, unit: 'Break Odds' },
      { label: 'High-Volume Flag Break', value: 88, unit: 'Break Odds', highlight: true },
    ],
    equationLabel: 'Edwards & Magee Trendline Validity',
    equationText: 'Valid Structural Trendline = >= 3 Distinct Touch Points + Confirming Closing Break',
    scenarioSteps: ['Draw resistance connecting three lower highs inside a Symmetrical Triangle.', 'Price breaks out two-thirds of the way into the apex (ideal sweet spot).', 'Measure widest vertical base at left of triangle and project upward from breakout.'],
    quizQuestion: 'At what point inside a Symmetrical Triangle do breakouts statistically show the highest follow-through energy?',
    quizOptions: [
      '100% into the very tip of the apex',
      'Between 50% and 75% of the distance from base to apex',
      'On the very first candle',
      'Only after breaking downward first',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Breakouts between 50–75% of the triangle width carry peak stored energy; price drifting into the far apex often fizzles.',
  },

  // Track E: Risk, Position Sizing & Psychology (#19 - #22)
  {
    id: 19,
    track: 'E. Risk, Position Sizing & Psychology',
    title: 'Trading in the Zone',
    author: 'Mark Douglas',
    year: 2000,
    tag: 'Essential',
    thesis: 'Think in probabilities across large sample sizes—any individual trade is random, so execute your edge cleanly without hesitation or revenge.',
    mindMapCenter: 'Probabilistic Mindset',
    mindMapBranches: [
      { branch: 'Edge vs Single Outcome', detail: 'Even a 60% edge loses 4 times in 10 randomly.' },
      { branch: 'Pre-Defined Risk Acceptance', detail: 'Accept the exact dollar loss BEFORE clicking Buy.' },
      { branch: 'Zero Prediction Need', detail: 'You do not need to know what happens next to make money.' },
      { branch: '20-Trade Sample Rule', detail: 'Evaluate rules over blocks of 20 trades, never 1.' },
    ],
    chartTitle: 'Consistent Execution Across a 20-Trade Probability Block (55% Win @ 2R)',
    chartBars: [
      { label: '11 Wins (+2R each)', value: 22, unit: 'R Gain', highlight: true },
      { label: '9 Losses (-1R each)', value: 9, unit: 'R Loss' },
      { label: 'Net Block Expectancy', value: 13, unit: 'R Profit', highlight: true },
    ],
    equationLabel: 'Trade Block Expectancy',
    equationText: '20-Trade Net R = (Wins * Avg Reward R) - (Losses * 1R)',
    scenarioSteps: ['Take 3 consecutive -1R stop-outs following a valid pullback system.', 'Refuse to widen stops or revenge-size the 4th setup.', 'Next two +2.5R winners fully recover drawdowns and push equity to highs.'],
    quizQuestion: 'What core belief separates consistently profitable traders according to Mark Douglas?',
    quizOptions: [
      'Eliminating every losing trade',
      'Thinking in probabilities over a large series of trades and fully accepting risk upfront',
      'Holding losers until they return to breakeven',
      'Increasing lot size after every loss',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Casinos never sweat a single losing blackjack hand because edge plays out reliably over sample size.',
  },
  {
    id: 20,
    track: 'E. Risk, Position Sizing & Psychology',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    tag: 'Core Playbook',
    thesis: 'Override System 1 cognitive biases—Loss Aversion, Anchoring, Recency, and Confirmation Bias—with pre-committed System 2 rules and checklists.',
    mindMapCenter: 'System 1 vs System 2 Investing',
    mindMapBranches: [
      { branch: 'Loss Aversion (2x Pain)', detail: 'Losing $1,000 hurts twice as much as winning $1,000 feels good.' },
      { branch: 'Disposition Effect', detail: 'Traders sell winners early and cling to losers out of regret.' },
      { branch: 'Anchoring Trap', detail: 'Fixating on your purchase price or old all-time high.' },
      { branch: 'Pre-Mortem Checklist', detail: 'Ask "If this loses 30% in a year, why?" before buying.' },
    ],
    chartTitle: 'Psychological Utility Curve Asymmetry (Kahneman Prospect Theory)',
    chartBars: [
      { label: 'Joy of +$1,000 Gain', value: 50, unit: 'Utility', highlight: true },
      { label: 'Pain of -$1,000 Loss', value: 105, unit: 'Pain Index', highlight: true },
    ],
    equationLabel: 'System 2 Pre-Trade Check',
    equationText: 'Purchase Decision = Base-Rate Probability + Objective Invalidation (Zero Cost-Basis Anchoring)',
    scenarioSteps: ['Stock bought at $100 drops to $72 after thesis-breaking competition news.', 'System 1 demands "Wait till $100 to break even!" (Anchoring + Loss Aversion).', 'System 2 asks: "Would I buy this company fresh at $72 today?" If no, exit immediately.'],
    quizQuestion: 'What behavioral trap causes investors to sell winning stocks too quickly while riding losers down?',
    quizOptions: [
      'Compounding Optimization',
      'The Disposition Effect rooted in Loss Aversion',
      'Modern Portfolio Theory',
      'Value Averaging',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Prospect theory shows we become risk-averse with profits (locking gains early) and risk-seeking with losses (hoping losers recover).',
  },
  {
    id: 21,
    track: 'E. Risk, Position Sizing & Psychology',
    title: 'Trade Your Way to Financial Freedom',
    author: 'Van K. Tharp',
    year: 1998,
    tag: 'Advanced',
    thesis: 'Entries matter far less than R-Multiples, positive Expectancy, and Volatility-Adjusted Position Sizing ("How much" outweighs "What").',
    mindMapCenter: 'R-Multiples & Position Sizing',
    mindMapBranches: [
      { branch: '1R Risk Unit', detail: 'Every trade is framed as multiples of initial stop-loss risk.' },
      { branch: 'SQN Quality Metric', detail: 'System Quality Number = sqrt(N) * Expectancy / StdDev(R).' },
      { branch: '1% Account Risk Model', detail: 'Shares = (Account * 0.01) / (Entry - Stop Price).' },
      { branch: 'Low-Win-Rate Myth', detail: 'A 35% win-rate trend system averaging 4R winners prints huge wealth.' },
    ],
    chartTitle: 'Impact Weighting on Long-Term Trading Performance (Tharp)',
    chartBars: [
      { label: 'Position Sizing & Stops', value: 60, unit: '% Impact', highlight: true },
      { label: 'Psychology & Discipline', value: 30, unit: '% Impact', highlight: true },
      { label: 'Entry Signal Timing', value: 10, unit: '% Impact' },
    ],
    equationLabel: 'Van Tharp Share Sizing Formula',
    equationText: 'Position Shares = (Account Equity * Risk %) / (Entry Price - Stop Price)',
    scenarioSteps: ['$100,000 portfolio enforces strict 1% maximum loss ($1,000 = 1R).', 'Stock entry at $50 with stop at $46 ($4/share risk) -> Size = $1,000 / $4 = 250 shares.', 'Stock B with $10/share stop automatically gets 100 shares—equalizing risk across assets.'],
    quizQuestion: 'With a $100,000 account and a strict 1% risk limit, how many shares can you buy at $80 with a $75 stop?',
    quizOptions: [
      '1,250 shares',
      '200 shares ($1,000 risk / $5 stop distance)',
      '500 shares',
      '50 shares',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Account risk = $1,000; stop distance = $5/share -> $1,000 / $5 = 200 shares ($16,000 position).',
  },
  {
    id: 22,
    track: 'E. Risk, Position Sizing & Psychology',
    title: 'Fooled by Randomness',
    author: 'Nassim Nicholas Taleb',
    year: 2001,
    tag: 'Essential',
    thesis: 'Separate luck from skill, guard against survivorship bias, and respect Black Swan fat tails that wipe out negatively skewed strategies.',
    mindMapCenter: 'Skewness & Black Swan Defense',
    mindMapBranches: [
      { branch: 'Survivorship Bias', detail: 'Only winners get interviewed—the graveyard of blown-up funds is silent.' },
      { branch: 'Skewness Over Win Rate', detail: 'Shorting options wins 95% of months until one tail event wipes 100%.' },
      { branch: 'Convexity / Barbell', detail: 'Keep core ultra-safe and risk small capped amounts on high upside.' },
      { branch: 'Signal vs Noise', detail: 'Checking quotes every 5 minutes maximizes perceived noise over signal.' },
    ],
    chartTitle: 'Payoff Profile Comparison: Fragile vs. Convex Skew',
    chartBars: [
      { label: 'Selling Uncovered Puts (Win%)', value: 92, unit: 'Small Wins / -99% Tail' },
      { label: 'Convex Trend Following', value: 42, unit: 'Capped -1R / +8R Tails', highlight: true },
    ],
    equationLabel: 'Barbell Risk Robustness',
    equationText: 'Max Portfolio Survival = (Safe Core Capital) + Capped Convex Asymmetric Bets',
    scenarioSteps: ['A trader boasts 36 consecutive winning months selling naked volatility.', 'Win rate looks 100%, disguising hidden -50R left-tail ruin risk.', 'One geopolitical shock wipes 5 years of small steady gains in a single morning.'],
    quizQuestion: 'Why does Taleb warn against strategies with a 95% win rate built on uncapped tail risk?',
    quizOptions: [
      'High win rates pay higher brokerage commissions',
      'Negative skewness hides rare, catastrophic losses that exceed years of small wins',
      'Taxes are higher on 95% win-rate strategies',
      'Small wins always mean-revert within 2 days',
    ],
    quizCorrectIndex: 1,
    quizExplanation: 'Expectancy depends on payoff magnitude times probability—rare extreme tail losses destroy strategies that "pick up pennies in front of a steamroller."',
  },
];
