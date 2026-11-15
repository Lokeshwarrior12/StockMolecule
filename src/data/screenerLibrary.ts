export interface ScreenerQueryTemplate {
  id: number;
  category:
    | '1. Fundamental & Quality'
    | '2. Value Investing'
    | '3. Growth & Earnings'
    | '4. Financial Health & Cash Flow'
    | '5. Dividend Investing'
    | '6. Technical Analysis & Momentum'
    | '7. Advanced Trading Strategy'
    | '8. Institutional & Ownership'
    | '9. Special Situations & Events'
    | '10. Additional Global Market';
  name: string;
  query: string;
  requiresHistorical?: boolean;
}

export const SCREENER_CATEGORIES = [
  '1. Fundamental & Quality',
  '2. Value Investing',
  '3. Growth & Earnings',
  '4. Financial Health & Cash Flow',
  '5. Dividend Investing',
  '6. Technical Analysis & Momentum',
  '7. Advanced Trading Strategy',
  '8. Institutional & Ownership',
  '9. Special Situations & Events',
  '10. Additional Global Market',
] as const;

export const SCREENER_IMPLEMENTATION_NOTES: string[] = [
  'Percentage units: All percentages (ROE, growth, yield, margin, drawdown) are stored in percentage points (e.g., 15 means 15%).',
  'Market Cap normalization: Replace currency/unit thresholds with your database’s USD or local-currency scale (e.g., $100M, $300M, $1B, $10B).',
  'Time-series metrics: Ratios like Sales Growth 5Y, Profit Growth 3Y, ROCE 10Y, SMA 50, SMA 200, RSI(14), ATR(14), and 52W High require historical price or multi-year financial tables.',
  'Crossover logic: Conditions like EMA 20 > EMA 50 and Price crosses above SMA 50 require comparing today’s value vs. yesterday’s value (t vs. t-1).',
  'Fundamental + Technical combination: Pairing Fundamental & Quality filters with Momentum / Breakout conditions creates institutional multi-factor screens.',
  'RS Rating: If your provider does not expose an IBD-style RS Rating (1–99), rank universe stocks by 6-month / 12-month price return percentile.',
];

export const SCREENER_LIBRARY_85: ScreenerQueryTemplate[] = [
  // 1. Fundamental & Quality Screens (#1 - #10)
  {
    id: 1,
    category: '1. Fundamental & Quality',
    name: 'High Quality Businesses',
    query: `ROE > 15
AND ROCE > 15
AND Debt to Equity < 0.5
AND Sales Growth 5Y > 10
AND Operating Profit Margin > 15`,
  },
  {
    id: 2,
    category: '1. Fundamental & Quality',
    name: 'Bluest of the Blue Chips',
    query: `Market Cap > 10000
AND ROE > 15
AND ROCE > 15
AND Profit Growth 5Y > 10
AND Debt to Equity < 0.5`,
  },
  {
    id: 3,
    category: '1. Fundamental & Quality',
    name: 'Debt-Free Companies',
    query: `Debt to Equity = 0
AND ROE > 15
AND ROCE > 15
AND Operating Cash Flow > 0`,
  },
  {
    id: 4,
    category: '1. Fundamental & Quality',
    name: 'High Growth, High ROE, Low PE',
    query: `Sales Growth 5Y > 15
AND Profit Growth 5Y > 15
AND ROE > 20
AND PE Ratio > 0
AND PE Ratio < 25`,
  },
  {
    id: 5,
    category: '1. Fundamental & Quality',
    name: 'Magic Formula',
    query: `Earnings Yield > 0
AND Return on Capital > 0
Sort by:
Earnings Yield DESC
Return on Capital DESC`,
  },
  {
    id: 6,
    category: '1. Fundamental & Quality',
    name: 'High Quality, Low Debt',
    query: `ROCE > 20
AND ROE > 15
AND Debt to Equity < 0.25
AND Interest Coverage > 5`,
  },
  {
    id: 7,
    category: '1. Fundamental & Quality',
    name: 'Piotroski Strong Financials',
    query: `Piotroski F-Score = 9`,
  },
  {
    id: 8,
    category: '1. Fundamental & Quality',
    name: 'Coffee Can Portfolio',
    query: `Sales Growth 10Y > 10
AND ROCE 10Y > 15
AND Debt to Equity < 0.5
AND Profit Growth 10Y > 10`,
  },
  {
    id: 9,
    category: '1. Fundamental & Quality',
    name: 'Consistent Compounders',
    query: `Sales CAGR 5Y > 15
AND EPS CAGR 5Y > 15
AND ROCE 5Y > 15
AND Debt to Equity < 0.5`,
  },
  {
    id: 10,
    category: '1. Fundamental & Quality',
    name: 'Quality at a Reasonable Price (QARP)',
    query: `ROE > 15
AND EPS Growth 5Y > 15
AND PE Ratio > 0
AND PEG Ratio < 2
AND Debt to Equity < 1`,
  },

  // 2. Value Investing Screens (#11 - #18)
  {
    id: 11,
    category: '2. Value Investing',
    name: 'Undervalued Stocks',
    query: `PE Ratio > 0
AND PE Ratio < 15
AND PB Ratio < 2
AND ROE > 12
AND Debt to Equity < 1`,
  },
  {
    id: 12,
    category: '2. Value Investing',
    name: 'Benjamin Graham Defensive Stocks',
    query: `Current Ratio > 2
AND Debt to Equity < 0.5
AND EPS Growth 5Y > 0
AND PE Ratio < 15
AND PB Ratio < 1.5`,
  },
  {
    id: 13,
    category: '2. Value Investing',
    name: 'Graham Number Undervalued',
    query: `Current Price < Graham Number
AND EPS > 0
AND Book Value Per Share > 0`,
  },
  {
    id: 14,
    category: '2. Value Investing',
    name: 'Low PE, High EPS Growth',
    query: `PE Ratio > 0
AND PE Ratio < 15
AND EPS Growth 5Y > 15`,
  },
  {
    id: 15,
    category: '2. Value Investing',
    name: 'Low EV/EBITDA Stocks',
    query: `EV EBITDA < 10
AND EBITDA > 0
AND Debt to Equity < 1
AND ROCE > 12`,
  },
  {
    id: 16,
    category: '2. Value Investing',
    name: 'Undervalued Compared to Industry',
    query: `PE Ratio < Industry PE
AND PB Ratio < Industry PB
AND ROE > 12
AND Profit Growth 5Y > 10`,
  },
  {
    id: 17,
    category: '2. Value Investing',
    name: 'Peter Lynch Growth Stocks',
    query: `EPS Growth 5Y > 15
AND PEG Ratio > 0
AND PEG Ratio < 1.5
AND Debt to Equity < 1
AND ROE > 15`,
  },
  {
    id: 18,
    category: '2. Value Investing',
    name: 'GARP Stocks',
    query: `EPS Growth 5Y > 10
AND PEG Ratio > 0
AND PEG Ratio < 2
AND ROE > 12`,
  },

  // 3. Growth & Earnings Screens (#19 - #27)
  {
    id: 19,
    category: '3. Growth & Earnings',
    name: 'Growth Stocks',
    query: `Sales Growth 3Y > 15
AND Profit Growth 3Y > 15
AND ROE > 15
AND Debt to Equity < 1`,
  },
  {
    id: 20,
    category: '3. Growth & Earnings',
    name: 'Quarterly Growers',
    query: `Revenue Q0 > Revenue Q1
AND Net Profit Q0 > Net Profit Q1
AND Revenue Q0 > Revenue Q4
AND Net Profit Q0 > Net Profit Q4`,
    requiresHistorical: true,
  },
  {
    id: 21,
    category: '3. Growth & Earnings',
    name: 'Fastest Growing Companies',
    query: `Sales Growth 3Y > 25
AND Profit Growth 3Y > 25
AND Operating Cash Flow > 0`,
  },
  {
    id: 22,
    category: '3. Growth & Earnings',
    name: 'High Sales & Profit Acceleration',
    query: `Sales Growth YoY > Sales Growth 3Y
AND Profit Growth YoY > Profit Growth 3Y
AND Sales Growth YoY > 15`,
    requiresHistorical: true,
  },
  {
    id: 23,
    category: '3. Growth & Earnings',
    name: 'Margin Expansion Companies',
    query: `Operating Margin Q0 > Operating Margin Q4
AND Operating Margin Q0 > Operating Margin Q1
AND Sales Growth YoY > 10`,
    requiresHistorical: true,
  },
  {
    id: 24,
    category: '3. Growth & Earnings',
    name: 'Operating Leverage Plays',
    query: `Operating Profit Growth YoY > Sales Growth YoY
AND Sales Growth YoY > 10
AND Net Profit > 0`,
    requiresHistorical: true,
  },
  {
    id: 25,
    category: '3. Growth & Earnings',
    name: 'Expanding Operating Margins',
    query: `Operating Profit Margin Current > Operating Profit Margin 3Y Avg
AND Operating Profit Margin Current > 15
AND Debt to Equity < 0.5`,
  },
  {
    id: 26,
    category: '3. Growth & Earnings',
    name: 'Earnings Surprise / Beat',
    query: `Actual EPS > Consensus EPS Estimate
AND EPS Surprise Pct > 5
AND Revenue YoY Growth > 10`,
    requiresHistorical: true,
  },
  {
    id: 27,
    category: '3. Growth & Earnings',
    name: 'CAN SLIM Fundamental Core',
    query: `EPS Growth YoY Q0 > 25
AND EPS Growth 3Y CAGR > 20
AND ROE > 17
AND Sales Growth YoY Q0 > 20`,
  },

  // 4. Financial Health & Cash Flow Screens (#28 - #35)
  {
    id: 28,
    category: '4. Financial Health & Cash Flow',
    name: 'Cash Rich Companies',
    query: `Cash & Equivalents > Total Debt
AND Free Cash Flow > 0
AND ROE > 12`,
  },
  {
    id: 29,
    category: '4. Financial Health & Cash Flow',
    name: 'High Free Cash Flow Generators',
    query: `Free Cash Flow > 0
AND Free Cash Flow Yield > 4
AND FCF to Net Profit > 0.8`,
  },
  {
    id: 30,
    category: '4. Financial Health & Cash Flow',
    name: 'Cash Conversion Champions',
    query: `Operating Cash Flow / EBITDA > 0.75
AND Free Cash Flow > 0
AND Debt to Equity < 0.5`,
  },
  {
    id: 31,
    category: '4. Financial Health & Cash Flow',
    name: 'Low Debt, Strong Interest Coverage',
    query: `Debt to Equity < 0.3
AND Interest Coverage > 8
AND Current Ratio > 1.5`,
  },
  {
    id: 32,
    category: '4. Financial Health & Cash Flow',
    name: 'Net-Net Working Capital (NCAV)',
    query: `Current Assets - Total Liabilities > Market Cap`,
  },
  {
    id: 33,
    category: '4. Financial Health & Cash Flow',
    name: 'Debt Reduction Turnarounds',
    query: `Total Debt Current < Total Debt 1Y Ago
AND Total Debt 1Y Ago < Total Debt 2Y Ago
AND Operating Cash Flow > 0`,
    requiresHistorical: true,
  },
  {
    id: 34,
    category: '4. Financial Health & Cash Flow',
    name: 'Self-Funded Growth',
    query: `Operating Cash Flow > CapEx
AND Sales Growth 3Y > 12
AND Share Count 3Y <= Share Count Current * 1.05`,
  },
  {
    id: 35,
    category: '4. Financial Health & Cash Flow',
    name: 'Low CapEx Asset-Light Compounders',
    query: `CapEx to Revenue < 5
AND Operating Profit Margin > 20
AND ROCE > 25`,
  },

  // 5. Dividend Investing Screens (#36 - #39)
  {
    id: 36,
    category: '5. Dividend Investing',
    name: 'High Dividend Yield Stocks',
    query: `Dividend Yield > 3.5
AND Dividend Payout Ratio > 0
AND Dividend Payout Ratio < 70
AND Free Cash Flow > Dividends Paid`,
  },
  {
    id: 37,
    category: '5. Dividend Investing',
    name: 'Dividend Aristocrats & Growers',
    query: `Dividend Growth 5Y CAGR > 5
AND Dividend Yield > 1.5
AND Dividend Payout Ratio < 65
AND Debt to Equity < 1`,
  },
  {
    id: 38,
    category: '5. Dividend Investing',
    name: 'Safe High Yield',
    query: `Dividend Yield > 4
AND Interest Coverage > 5
AND Net Debt to EBITDA < 2.5
AND Free Cash Flow > 0`,
  },
  {
    id: 39,
    category: '5. Dividend Investing',
    name: 'Total Shareholder Yield',
    query: `Dividend Yield + Buyback Yield > 5
AND Free Cash Flow Yield > 5
AND ROIC > 12`,
  },

  // 6. Technical Analysis & Momentum Screens (#40 - #56)
  {
    id: 40,
    category: '6. Technical Analysis & Momentum',
    name: 'Golden Cross',
    query: `SMA 50 > SMA 200
AND SMA 50 1D Ago <= SMA 200 1D Ago
AND Volume > Volume 20D Avg`,
    requiresHistorical: true,
  },
  {
    id: 41,
    category: '6. Technical Analysis & Momentum',
    name: 'Death Cross',
    query: `SMA 50 < SMA 200
AND SMA 50 1D Ago >= SMA 200 1D Ago`,
    requiresHistorical: true,
  },
  {
    id: 42,
    category: '6. Technical Analysis & Momentum',
    name: 'Stocks Above All Major MAs',
    query: `Close > EMA 20
AND EMA 20 > SMA 50
AND SMA 50 > SMA 150
AND SMA 150 > SMA 200`,
    requiresHistorical: true,
  },
  {
    id: 43,
    category: '6. Technical Analysis & Momentum',
    name: 'Minervini Trend Template (Stage 2)',
    query: `Close > SMA 150
AND Close > SMA 200
AND SMA 150 > SMA 200
AND SMA 200 > SMA 200 1M Ago
AND Close > SMA 50
AND Close >= 52W Low * 1.3
AND Close >= 52W High * 0.75
AND RS Rating >= 70`,
    requiresHistorical: true,
  },
  {
    id: 44,
    category: '6. Technical Analysis & Momentum',
    name: '52-Week High Breakouts',
    query: `Close >= 52W High * 0.98
AND Volume > Volume 20D Avg * 1.5
AND Close > SMA 50`,
    requiresHistorical: true,
  },
  {
    id: 45,
    category: '6. Technical Analysis & Momentum',
    name: 'RSI Oversold Bounce Candidates',
    query: `RSI(14) < 30
AND Close > SMA 200
AND Volume > Volume 20D Avg`,
    requiresHistorical: true,
  },
  {
    id: 46,
    category: '6. Technical Analysis & Momentum',
    name: 'RSI Bullish Momentum Zone',
    query: `RSI(14) >= 55
AND RSI(14) <= 70
AND Close > EMA 20`,
    requiresHistorical: true,
  },
  {
    id: 47,
    category: '6. Technical Analysis & Momentum',
    name: 'MACD Bullish Crossover',
    query: `MACD Line > MACD Signal
AND MACD Line 1D Ago <= MACD Signal 1D Ago
AND Close > SMA 50`,
    requiresHistorical: true,
  },
  {
    id: 48,
    category: '6. Technical Analysis & Momentum',
    name: 'EMA 9/21 Momentum Cross',
    query: `EMA 9 > EMA 21
AND EMA 9 1D Ago <= EMA 21 1D Ago
AND Volume > Volume 20D Avg`,
    requiresHistorical: true,
  },
  {
    id: 49,
    category: '6. Technical Analysis & Momentum',
    name: 'Strong Relative Strength Leaders',
    query: `RS Rating >= 85
AND Close > SMA 50
AND Performance 3M > 15`,
    requiresHistorical: true,
  },
  {
    id: 50,
    category: '6. Technical Analysis & Momentum',
    name: 'Price Near 200 SMA Support',
    query: `Close >= SMA 200 * 0.98
AND Close <= SMA 200 * 1.03
AND SMA 200 > SMA 200 1M Ago`,
    requiresHistorical: true,
  },
  {
    id: 51,
    category: '6. Technical Analysis & Momentum',
    name: 'ADX Strong Trending Stocks',
    query: `ADX(14) > 25
AND +DI(14) > -DI(14)
AND Close > EMA 20`,
    requiresHistorical: true,
  },
  {
    id: 52,
    category: '6. Technical Analysis & Momentum',
    name: 'Bollinger Band Squeeze',
    query: `BB Width < BB Width 6M Min * 1.1
AND Close > SMA 50`,
    requiresHistorical: true,
  },
  {
    id: 53,
    category: '6. Technical Analysis & Momentum',
    name: 'Stochastic Bullish Turn in Uptrend',
    query: `Stochastic %K > Stochastic %D
AND Stochastic %K < 35
AND Close > SMA 200`,
    requiresHistorical: true,
  },
  {
    id: 54,
    category: '6. Technical Analysis & Momentum',
    name: 'Volume Pocket Pivot',
    query: `Close > Open
AND Volume > Max Down Volume 10D
AND Close > EMA 10`,
    requiresHistorical: true,
  },
  {
    id: 55,
    category: '6. Technical Analysis & Momentum',
    name: 'OBV Breakout Ahead of Price',
    query: `OBV >= OBV 3M High
AND Close < 3M High * 0.97`,
    requiresHistorical: true,
  },
  {
    id: 56,
    category: '6. Technical Analysis & Momentum',
    name: 'High Beta Momentum Leaders',
    query: `Beta > 1.3
AND RS Rating >= 80
AND Close > SMA 50`,
    requiresHistorical: true,
  },

  // 7. Advanced Trading Strategy Screens (#57 - #66)
  {
    id: 57,
    category: '7. Advanced Trading Strategy',
    name: 'VCP (Volatility Contraction Pattern)',
    query: `Close > SMA 150
AND ATR(14) < ATR(50) * 0.85
AND Close >= 52W High * 0.85
AND Volume 5D Avg < Volume 50D Avg`,
    requiresHistorical: true,
  },
  {
    id: 58,
    category: '7. Advanced Trading Strategy',
    name: 'Pullback to Rising 20 EMA',
    query: `Close >= EMA 20 * 0.985
AND Close <= EMA 20 * 1.015
AND EMA 20 > SMA 50
AND Volume < Volume 20D Avg`,
    requiresHistorical: true,
  },
  {
    id: 59,
    category: '7. Advanced Trading Strategy',
    name: 'Pullback to Rising 50 SMA',
    query: `Close >= SMA 50 * 0.98
AND Close <= SMA 50 * 1.02
AND SMA 50 > SMA 200
AND Volume < Volume 20D Avg`,
    requiresHistorical: true,
  },
  {
    id: 60,
    category: '7. Advanced Trading Strategy',
    name: 'Gap Up + High Volume Continuation',
    query: `Open > High 1D Ago * 1.03
AND Close > Open
AND Volume > Volume 20D Avg * 2`,
    requiresHistorical: true,
  },
  {
    id: 61,
    category: '7. Advanced Trading Strategy',
    name: 'Tight Base / NR7 Coil',
    query: `Daily Range = Min Daily Range 7D
AND Close > SMA 50
AND Close >= 52W High * 0.88`,
    requiresHistorical: true,
  },
  {
    id: 62,
    category: '7. Advanced Trading Strategy',
    name: 'Episodic Pivot (Institutional Surprise)',
    query: `Day Change Pct > 8
AND Volume > Volume 50D Avg * 2.5
AND Consolidation 3M Range < 25`,
    requiresHistorical: true,
  },
  {
    id: 63,
    category: '7. Advanced Trading Strategy',
    name: 'Inside Day Breakout Watch',
    query: `High < High 1D Ago
AND Low > Low 1D Ago
AND Close > EMA 20`,
    requiresHistorical: true,
  },
  {
    id: 64,
    category: '7. Advanced Trading Strategy',
    name: 'Mean Reversion Extreme Oversold',
    query: `RSI(2) < 10
AND Close > SMA 200`,
    requiresHistorical: true,
  },
  {
    id: 65,
    category: '7. Advanced Trading Strategy',
    name: 'Short Squeeze Candidates',
    query: `Short Float Pct > 15
AND Days to Cover > 4
AND Close > SMA 50
AND Volume > Volume 20D Avg * 1.5`,
    requiresHistorical: true,
  },
  {
    id: 66,
    category: '7. Advanced Trading Strategy',
    name: 'High Tight Flag Setup',
    query: `Performance 2M > 50
AND Retracement from High < 15
AND Close > EMA 20`,
    requiresHistorical: true,
  },

  // 8. Institutional & Ownership Screens (#67 - #71)
  {
    id: 67,
    category: '8. Institutional & Ownership',
    name: 'High Insider Ownership Alignment',
    query: `Insider Ownership Pct > 15
AND ROE > 15
AND Debt to Equity < 0.5`,
  },
  {
    id: 68,
    category: '8. Institutional & Ownership',
    name: 'Institutional Accumulation Surge',
    query: `Institutional Ownership Change QoQ > 3
AND Institutional Ownership Pct > 40
AND Sales Growth YoY > 15`,
    requiresHistorical: true,
  },
  {
    id: 69,
    category: '8. Institutional & Ownership',
    name: 'Insider Buying Clusters',
    query: `Insider Net Purchases 3M > 0
AND Market Cap > 500
AND PE Ratio < 25`,
    requiresHistorical: true,
  },
  {
    id: 70,
    category: '8. Institutional & Ownership',
    name: 'Founder-Led Compounders',
    query: `Founder CEO = 1
AND Insider Ownership Pct > 10
AND Revenue Growth 5Y > 15
AND ROIC > 15`,
  },
  {
    id: 71,
    category: '8. Institutional & Ownership',
    name: 'Aggressive Share Buyback Cannibals',
    query: `Shares Outstanding 3Y Change < -5
AND Free Cash Flow > 0
AND ROE > 18`,
    requiresHistorical: true,
  },

  // 9. Special Situations & Corporate Events Screens (#72 - #78)
  {
    id: 72,
    category: '9. Special Situations & Events',
    name: 'Recent Spin-Offs',
    query: `Days Since SpinOff < 365
AND Insider Buying 3M > 0
AND Operating Cash Flow > 0`,
    requiresHistorical: true,
  },
  {
    id: 73,
    category: '9. Special Situations & Events',
    name: 'Post-IPO Base Breakouts',
    query: `Years Since IPO < 3
AND Sales Growth YoY > 25
AND Close > SMA 50`,
    requiresHistorical: true,
  },
  {
    id: 74,
    category: '9. Special Situations & Events',
    name: 'Deep Drawdown Recovery Quality',
    query: `Drawdown from ATH > 40
AND ROIC > 15
AND Free Cash Flow > 0
AND Close > SMA 50`,
    requiresHistorical: true,
  },
  {
    id: 75,
    category: '9. Special Situations & Events',
    name: 'Cyclical Bottom Value Inflection',
    query: `Price to Sales < 1.5
AND Price to Book < 1.5
AND Gross Margin Q0 > Gross Margin Q1`,
    requiresHistorical: true,
  },
  {
    id: 76,
    category: '9. Special Situations & Events',
    name: 'M&A Takeover Targets (Cheap FCF)',
    query: `EV EBITDA < 8
AND Net Debt to EBITDA < 1.5
AND Free Cash Flow Yield > 7`,
  },
  {
    id: 77,
    category: '9. Special Situations & Events',
    name: 'Index Addition Momentum Candidates',
    query: `Market Cap > 15000
AND Net Profit TTM > 0
AND RS Rating >= 75`,
  },
  {
    id: 78,
    category: '9. Special Situations & Events',
    name: 'Turnaround Earnings Inflection',
    query: `EPS TTM > 0
AND EPS 1Y Ago < 0
AND Revenue Growth YoY > 10`,
    requiresHistorical: true,
  },

  // 10. Additional Global Market Screens (#79 - #85)
  {
    id: 79,
    category: '10. Additional Global Market',
    name: 'Mega-Cap Compounders',
    query: `Market Cap > 100000
AND ROIC > 20
AND Operating Profit Margin > 20`,
  },
  {
    id: 80,
    category: '10. Additional Global Market',
    name: 'Mid-Cap High ROIC Growers',
    query: `Market Cap >= 2000
AND Market Cap <= 20000
AND ROIC > 18
AND Sales Growth 3Y > 15`,
  },
  {
    id: 81,
    category: '10. Additional Global Market',
    name: 'Small-Cap Quality Gems',
    query: `Market Cap >= 300
AND Market Cap <= 2000
AND ROE > 15
AND Debt to Equity < 0.4
AND Operating Cash Flow > 0`,
  },
  {
    id: 82,
    category: '10. Additional Global Market',
    name: 'Low Volatility Defensive Compounders',
    query: `Beta < 0.85
AND ROE > 15
AND Operating Profit Margin > 15
AND Debt to Equity < 0.6`,
  },
  {
    id: 83,
    category: '10. Additional Global Market',
    name: 'High Gross Margin Tech Moats',
    query: `Gross Margin > 65
AND Sales Growth 3Y > 18
AND Free Cash Flow > 0`,
  },
  {
    id: 84,
    category: '10. Additional Global Market',
    name: 'Rule of 40 Software & Cloud',
    query: `Sales Growth YoY + Free Cash Flow Margin >= 40
AND Gross Margin > 60`,
  },
  {
    id: 85,
    category: '10. Additional Global Market',
    name: 'All-Weather Quality + Momentum Combo',
    query: `ROIC > 18
AND ROE > 18
AND Debt to Equity < 0.5
AND PE Ratio < 40
AND Sales Growth 5Y > 12`,
  },
];
