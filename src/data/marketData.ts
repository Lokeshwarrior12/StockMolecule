export type Timeframe = '1D' | '1W' | '1M' | '3M';

export interface CandleBar {
  index: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerProfile {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicSymbol: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  volumeM: number;
  marketCapB: number;
  pe: number;
  pb: number;
  roe: number;
  roic: number;
  debtToEquity: number;
  revGrowth: number;
  netMargin: number;
  fcfYield: number;
  momentumScore: number;
  qualityScore: number;
  growthScore: number;
  valueScore: number;
  catalystNote: string;
  annualRevenueB: { year: string; revB: number; marginPct: number }[];
  peers: string[];
}

export interface LessonModule {
  id: string;
  code: string;
  atomicWeight: string;
  title: string;
  category: 'Candlesticks' | 'Indicators' | 'Risk' | 'Valuation';
  readMinutes: number;
  summary: string;
  formula: string;
  keyTakeaways: string[];
  visualType: 'hammer' | 'engulfing' | 'rsi' | 'roic';
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BookReference {
  title: string;
  author: string;
  focus: string;
  year: number;
}

export interface PulseNewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  ticker: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impactScore: number;
  summary: string;
}

export interface StrategistProfile {
  id: string;
  name: string;
  handle: string;
  specialty: string;
  winRatePct: number;
  sharpe: number;
  thesis: string;
}

export const STOCK_UNIVERSE: TickerProfile[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    atomicNumber: 14,
    atomicSymbol: 'Si',
    sector: 'Semiconductors',
    price: 142.8,
    change: 4.15,
    changePct: 2.99,
    dayHigh: 144.2,
    dayLow: 138.9,
    volumeM: 54.2,
    marketCapB: 3490,
    pe: 48.2,
    pb: 39.4,
    roe: 91.5,
    roic: 74.2,
    debtToEquity: 0.17,
    revGrowth: 94.0,
    netMargin: 55.6,
    fcfYield: 1.9,
    momentumScore: 96,
    qualityScore: 95,
    growthScore: 98,
    valueScore: 42,
    catalystNote: 'Blackwell rack shipments expanding hyperscaler data-center gross margins.',
    annualRevenueB: [
      { year: '2022', revB: 26.9, marginPct: 36.2 },
      { year: '2023', revB: 27.0, marginPct: 16.2 },
      { year: '2024', revB: 60.9, marginPct: 48.8 },
      { year: '2025', revB: 118.4, marginPct: 54.1 },
      { year: '2026E', revB: 164.0, marginPct: 55.6 },
    ],
    peers: ['AMD', 'AVGO', 'TSM'],
  },
  {
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    atomicNumber: 32,
    atomicSymbol: 'Ge',
    sector: 'Lithography',
    price: 738.4,
    change: 14.2,
    changePct: 1.96,
    dayHigh: 743.0,
    dayLow: 722.1,
    volumeM: 2.1,
    marketCapB: 294,
    pe: 34.1,
    pb: 17.8,
    roe: 49.4,
    roic: 36.8,
    debtToEquity: 0.31,
    revGrowth: 18.4,
    netMargin: 27.6,
    fcfYield: 2.8,
    momentumScore: 76,
    qualityScore: 94,
    growthScore: 79,
    valueScore: 63,
    catalystNote: 'High-NA EUV backlog secures multi-year foundry capex visibility.',
    annualRevenueB: [
      { year: '2022', revB: 21.2, marginPct: 26.5 },
      { year: '2023', revB: 27.6, marginPct: 28.4 },
      { year: '2024', revB: 28.3, marginPct: 26.8 },
      { year: '2025', revB: 33.4, marginPct: 27.2 },
      { year: '2026E', revB: 38.9, marginPct: 28.5 },
    ],
    peers: ['TSM', 'NVDA', 'AVGO'],
  },
  {
    symbol: 'TSM',
    name: 'Taiwan Semiconductor',
    atomicNumber: 79,
    atomicSymbol: 'Au',
    sector: 'Foundry',
    price: 196.45,
    change: 3.85,
    changePct: 2.0,
    dayHigh: 197.8,
    dayLow: 192.3,
    volumeM: 18.7,
    marketCapB: 1018,
    pe: 25.4,
    pb: 7.4,
    roe: 29.8,
    roic: 24.5,
    debtToEquity: 0.24,
    revGrowth: 31.2,
    netMargin: 41.3,
    fcfYield: 3.4,
    momentumScore: 88,
    qualityScore: 93,
    growthScore: 86,
    valueScore: 74,
    catalystNote: 'N2 node yield ramp outpacing initial wafer pricing estimates.',
    annualRevenueB: [
      { year: '2022', revB: 75.9, marginPct: 44.9 },
      { year: '2023', revB: 69.3, marginPct: 38.8 },
      { year: '2024', revB: 90.1, marginPct: 40.5 },
      { year: '2025', revB: 112.4, marginPct: 41.1 },
      { year: '2026E', revB: 134.8, marginPct: 42.0 },
    ],
    peers: ['ASML', 'NVDA', 'AVGO'],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    atomicNumber: 29,
    atomicSymbol: 'Cu',
    sector: 'Cloud & AI',
    price: 428.6,
    change: -2.4,
    changePct: -0.56,
    dayHigh: 432.5,
    dayLow: 425.8,
    volumeM: 21.4,
    marketCapB: 3180,
    pe: 33.8,
    pb: 11.2,
    roe: 36.4,
    roic: 27.9,
    debtToEquity: 0.29,
    revGrowth: 15.8,
    netMargin: 35.9,
    fcfYield: 2.6,
    momentumScore: 74,
    qualityScore: 96,
    growthScore: 78,
    valueScore: 59,
    catalystNote: 'Azure commercial bookings accelerating with enterprise Copilot seats.',
    annualRevenueB: [
      { year: '2022', revB: 198.3, marginPct: 36.7 },
      { year: '2023', revB: 211.9, marginPct: 34.1 },
      { year: '2024', revB: 245.1, marginPct: 36.0 },
      { year: '2025', revB: 281.5, marginPct: 35.9 },
      { year: '2026E', revB: 322.0, marginPct: 36.4 },
    ],
    peers: ['AAPL', 'GOOGL', 'AMZN'],
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    atomicNumber: 47,
    atomicSymbol: 'Ag',
    sector: 'Consumer Silicon',
    price: 229.15,
    change: 1.65,
    changePct: 0.73,
    dayHigh: 230.9,
    dayLow: 226.4,
    volumeM: 38.9,
    marketCapB: 3460,
    pe: 32.5,
    pb: 46.1,
    roe: 147.2,
    roic: 54.6,
    debtToEquity: 1.45,
    revGrowth: 6.4,
    netMargin: 26.4,
    fcfYield: 3.1,
    momentumScore: 71,
    qualityScore: 91,
    growthScore: 58,
    valueScore: 55,
    catalystNote: 'Services gross margin expansion offsetting hardware cycle seasonality.',
    annualRevenueB: [
      { year: '2022', revB: 394.3, marginPct: 25.3 },
      { year: '2023', revB: 383.3, marginPct: 25.3 },
      { year: '2024', revB: 391.0, marginPct: 24.0 },
      { year: '2025', revB: 414.2, marginPct: 26.1 },
      { year: '2026E', revB: 441.0, marginPct: 26.8 },
    ],
    peers: ['MSFT', 'GOOGL', 'NVDA'],
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    atomicNumber: 35,
    atomicSymbol: 'Br',
    sector: 'Semiconductors',
    price: 181.3,
    change: 5.4,
    changePct: 3.07,
    dayHigh: 182.6,
    dayLow: 174.9,
    volumeM: 29.5,
    marketCapB: 846,
    pe: 36.2,
    pb: 12.6,
    roe: 41.2,
    roic: 22.8,
    debtToEquity: 0.98,
    revGrowth: 41.5,
    netMargin: 31.8,
    fcfYield: 2.9,
    momentumScore: 91,
    qualityScore: 87,
    growthScore: 89,
    valueScore: 58,
    catalystNote: 'Custom XPU accelerator demand doubling across top three cloud customers.',
    annualRevenueB: [
      { year: '2022', revB: 33.2, marginPct: 34.6 },
      { year: '2023', revB: 35.8, marginPct: 39.3 },
      { year: '2024', revB: 51.6, marginPct: 29.8 },
      { year: '2025', revB: 63.4, marginPct: 31.8 },
      { year: '2026E', revB: 78.2, marginPct: 33.4 },
    ],
    peers: ['NVDA', 'TSM', 'ASML'],
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    atomicNumber: 56,
    atomicSymbol: 'Ba',
    sector: 'Biopharma',
    price: 842.5,
    change: -11.3,
    changePct: -1.32,
    dayHigh: 856.0,
    dayLow: 836.2,
    volumeM: 3.8,
    marketCapB: 799,
    pe: 54.6,
    pb: 51.2,
    roe: 68.4,
    roic: 29.5,
    debtToEquity: 1.92,
    revGrowth: 36.0,
    netMargin: 23.4,
    fcfYield: 1.2,
    momentumScore: 68,
    qualityScore: 86,
    growthScore: 92,
    valueScore: 34,
    catalystNote: 'Oral GLP-1 phase 3 readouts expanding global metabolic addressable market.',
    annualRevenueB: [
      { year: '2022', revB: 28.5, marginPct: 21.9 },
      { year: '2023', revB: 34.1, marginPct: 15.4 },
      { year: '2024', revB: 45.0, marginPct: 23.5 },
      { year: '2025', revB: 58.2, marginPct: 25.1 },
      { year: '2026E', revB: 71.4, marginPct: 26.8 },
    ],
    peers: ['NVO', 'VRTX', 'REGN'],
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    atomicNumber: 78,
    atomicSymbol: 'Pt',
    sector: 'Defense & AI',
    price: 61.9,
    change: 2.35,
    changePct: 3.95,
    dayHigh: 62.7,
    dayLow: 58.8,
    volumeM: 64.1,
    marketCapB: 141,
    pe: 98.4,
    pb: 29.1,
    roe: 14.8,
    roic: 13.2,
    debtToEquity: 0.05,
    revGrowth: 29.8,
    netMargin: 19.6,
    fcfYield: 0.9,
    momentumScore: 95,
    qualityScore: 76,
    growthScore: 88,
    valueScore: 22,
    catalystNote: 'AIP commercial bootcamps driving accelerating U.S. net dollar retention.',
    annualRevenueB: [
      { year: '2022', revB: 1.9, marginPct: -19.5 },
      { year: '2023', revB: 2.2, marginPct: 9.4 },
      { year: '2024', revB: 2.8, marginPct: 16.5 },
      { year: '2025', revB: 3.6, marginPct: 19.6 },
      { year: '2026E', revB: 4.5, marginPct: 22.1 },
    ],
    peers: ['PANW', 'CRWD', 'MSFT'],
  },
  {
    symbol: 'BRK.B',
    name: 'Berkshire Hathaway',
    atomicNumber: 26,
    atomicSymbol: 'Fe',
    sector: 'Conglomerate',
    price: 468.2,
    change: 2.1,
    changePct: 0.45,
    dayHigh: 469.9,
    dayLow: 464.3,
    volumeM: 4.1,
    marketCapB: 1012,
    pe: 21.6,
    pb: 1.62,
    roe: 15.8,
    roic: 11.4,
    debtToEquity: 0.21,
    revGrowth: 8.2,
    netMargin: 18.4,
    fcfYield: 4.3,
    momentumScore: 69,
    qualityScore: 92,
    growthScore: 54,
    valueScore: 86,
    catalystNote: 'Record Treasury bill liquidity generating steady risk-free interest cushion.',
    annualRevenueB: [
      { year: '2022', revB: 302.1, marginPct: 12.0 },
      { year: '2023', revB: 364.5, marginPct: 15.2 },
      { year: '2024', revB: 371.4, marginPct: 17.8 },
      { year: '2025', revB: 394.0, marginPct: 18.4 },
      { year: '2026E', revB: 416.5, marginPct: 18.6 },
    ],
    peers: ['JPM', 'V', 'COST'],
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    atomicNumber: 53,
    atomicSymbol: 'I',
    sector: 'Financials',
    price: 238.9,
    change: 1.9,
    changePct: 0.8,
    dayHigh: 240.1,
    dayLow: 235.6,
    volumeM: 8.6,
    marketCapB: 676,
    pe: 13.4,
    pb: 2.08,
    roe: 17.2,
    roic: 14.0,
    debtToEquity: 1.12,
    revGrowth: 11.4,
    netMargin: 32.1,
    fcfYield: 5.8,
    momentumScore: 79,
    qualityScore: 88,
    growthScore: 64,
    valueScore: 89,
    catalystNote: 'Investment banking fee rebound offsetting net interest margin normalization.',
    annualRevenueB: [
      { year: '2022', revB: 128.7, marginPct: 29.2 },
      { year: '2023', revB: 158.1, marginPct: 31.4 },
      { year: '2024', revB: 177.6, marginPct: 32.5 },
      { year: '2025', revB: 188.4, marginPct: 32.1 },
      { year: '2026E', revB: 199.2, marginPct: 32.4 },
    ],
    peers: ['BRK.B', 'V', 'GS'],
  },
  {
    symbol: 'COST',
    name: 'Costco Wholesale',
    atomicNumber: 12,
    atomicSymbol: 'Mg',
    sector: 'Consumer Staples',
    price: 912.4,
    change: 6.2,
    changePct: 0.68,
    dayHigh: 916.0,
    dayLow: 902.5,
    volumeM: 1.9,
    marketCapB: 404,
    pe: 51.8,
    pb: 16.4,
    roe: 30.2,
    roic: 23.1,
    debtToEquity: 0.25,
    revGrowth: 7.9,
    netMargin: 2.9,
    fcfYield: 1.9,
    momentumScore: 80,
    qualityScore: 93,
    growthScore: 63,
    valueScore: 41,
    catalystNote: 'Membership renewal rates above 93% anchoring high-margin fee income.',
    annualRevenueB: [
      { year: '2022', revB: 227.0, marginPct: 2.6 },
      { year: '2023', revB: 242.3, marginPct: 2.6 },
      { year: '2024', revB: 254.5, marginPct: 2.9 },
      { year: '2025', revB: 274.2, marginPct: 2.9 },
      { year: '2026E', revB: 296.0, marginPct: 3.0 },
    ],
    peers: ['WMT', 'BRK.B', 'V'],
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    atomicNumber: 23,
    atomicSymbol: 'V',
    sector: 'Payments',
    price: 312.75,
    change: 2.45,
    changePct: 0.79,
    dayHigh: 314.2,
    dayLow: 308.9,
    volumeM: 5.7,
    marketCapB: 618,
    pe: 28.9,
    pb: 15.2,
    roe: 50.6,
    roic: 34.4,
    debtToEquity: 0.52,
    revGrowth: 10.6,
    netMargin: 54.8,
    fcfYield: 3.6,
    momentumScore: 77,
    qualityScore: 97,
    growthScore: 72,
    valueScore: 71,
    catalystNote: 'Cross-border travel volumes compounding high-increment rail margins.',
    annualRevenueB: [
      { year: '2022', revB: 29.3, marginPct: 51.1 },
      { year: '2023', revB: 32.7, marginPct: 52.8 },
      { year: '2024', revB: 35.9, marginPct: 54.9 },
      { year: '2025', revB: 39.7, marginPct: 54.8 },
      { year: '2026E', revB: 43.9, marginPct: 55.2 },
    ],
    peers: ['MA', 'JPM', 'BRK.B'],
  },
  {
    symbol: 'PANW',
    name: 'Palo Alto Networks',
    atomicNumber: 74,
    atomicSymbol: 'W',
    sector: 'Cybersecurity',
    price: 388.2,
    change: -3.6,
    changePct: -0.92,
    dayHigh: 394.5,
    dayLow: 385.1,
    volumeM: 3.4,
    marketCapB: 127,
    pe: 58.2,
    pb: 22.8,
    roe: 24.5,
    roic: 18.7,
    debtToEquity: 0.19,
    revGrowth: 19.2,
    netMargin: 16.4,
    fcfYield: 2.8,
    momentumScore: 78,
    qualityScore: 84,
    growthScore: 82,
    valueScore: 45,
    catalystNote: 'Platformization consolidation lifting multi-year RPO commitments.',
    annualRevenueB: [
      { year: '2022', revB: 5.5, marginPct: 9.1 },
      { year: '2023', revB: 6.9, marginPct: 11.4 },
      { year: '2024', revB: 8.0, marginPct: 14.8 },
      { year: '2025', revB: 9.5, marginPct: 16.4 },
      { year: '2026E', revB: 11.3, marginPct: 17.9 },
    ],
    peers: ['CRWD', 'PLTR', 'MSFT'],
  },
  {
    symbol: 'MELI',
    name: 'MercadoLibre',
    atomicNumber: 42,
    atomicSymbol: 'Mo',
    sector: 'LatAm Commerce',
    price: 2045.0,
    change: 34.5,
    changePct: 1.72,
    dayHigh: 2060.0,
    dayLow: 1995.0,
    volumeM: 0.48,
    marketCapB: 103,
    pe: 44.5,
    pb: 23.6,
    roe: 43.1,
    roic: 26.2,
    debtToEquity: 0.78,
    revGrowth: 37.4,
    netMargin: 9.6,
    fcfYield: 3.2,
    momentumScore: 83,
    qualityScore: 86,
    growthScore: 93,
    valueScore: 54,
    catalystNote: 'Fintech credit portfolio scaling alongside fulfillment network density.',
    annualRevenueB: [
      { year: '2022', revB: 10.5, marginPct: 4.6 },
      { year: '2023', revB: 14.5, marginPct: 6.8 },
      { year: '2024', revB: 20.8, marginPct: 9.2 },
      { year: '2025', revB: 27.6, marginPct: 9.6 },
      { year: '2026E', revB: 34.8, marginPct: 10.9 },
    ],
    peers: ['AMZN', 'V', 'COST'],
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corp.',
    atomicNumber: 6,
    atomicSymbol: 'C',
    sector: 'Energy',
    price: 119.4,
    change: -0.95,
    changePct: -0.79,
    dayHigh: 121.2,
    dayLow: 118.6,
    volumeM: 14.8,
    marketCapB: 528,
    pe: 14.2,
    pb: 2.04,
    roe: 15.1,
    roic: 12.6,
    debtToEquity: 0.16,
    revGrowth: 4.8,
    netMargin: 10.3,
    fcfYield: 6.4,
    momentumScore: 62,
    qualityScore: 81,
    growthScore: 44,
    valueScore: 91,
    catalystNote: 'Permian Basin & Guyana low-breakeven barrels funding dividend growth.',
    annualRevenueB: [
      { year: '2022', revB: 413.7, marginPct: 13.5 },
      { year: '2023', revB: 344.6, marginPct: 10.4 },
      { year: '2024', revB: 349.6, marginPct: 9.9 },
      { year: '2025', revB: 361.0, marginPct: 10.3 },
      { year: '2026E', revB: 372.0, marginPct: 10.8 },
    ],
    peers: ['CVX', 'BRK.B', 'JPM'],
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    atomicNumber: 1,
    atomicSymbol: 'H',
    sector: 'Search & Cloud',
    price: 179.85,
    change: 2.25,
    changePct: 1.27,
    dayHigh: 181.1,
    dayLow: 176.9,
    volumeM: 25.1,
    marketCapB: 2210,
    pe: 22.8,
    pb: 6.9,
    roe: 31.8,
    roic: 28.4,
    debtToEquity: 0.09,
    revGrowth: 14.6,
    netMargin: 27.9,
    fcfYield: 3.5,
    momentumScore: 76,
    qualityScore: 95,
    growthScore: 76,
    valueScore: 81,
    catalystNote: 'Google Cloud operating margin expansion paired with resilient Search monetization.',
    annualRevenueB: [
      { year: '2022', revB: 282.8, marginPct: 21.2 },
      { year: '2023', revB: 307.4, marginPct: 24.0 },
      { year: '2024', revB: 349.0, marginPct: 27.6 },
      { year: '2025', revB: 396.4, marginPct: 27.9 },
      { year: '2026E', revB: 448.0, marginPct: 28.5 },
    ],
    peers: ['MSFT', 'AAPL', 'AMZN'],
  },
];

// Deterministic pseudo-random helper seeded by symbol + timeframe so charts never jitter on re-render
function seededNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function getCandlesForTicker(symbol: string, timeframe: Timeframe): CandleBar[] {
  const profile = STOCK_UNIVERSE.find((s) => s.symbol === symbol) ?? STOCK_UNIVERSE[0];
  const basePrice = profile.price;
  const barsCount = 60;
  const tfMultiplier = timeframe === '1D' ? 0.008 : timeframe === '1W' ? 0.015 : timeframe === '1M' ? 0.025 : 0.036;
  const symbolSeed = symbol.split('').reduce((acc, ch, i) => acc + ch.charCodeAt(0) * (i + 3), 0);

  const rawBars: CandleBar[] = [];
  let cursor = basePrice * (0.86 + (symbolSeed % 9) * 0.01);

  for (let i = 0; i < barsCount; i++) {
    const n1 = seededNoise(symbolSeed + i * 17 + timeframe.length * 101);
    const n2 = seededNoise(symbolSeed + i * 31 + 7);
    const n3 = seededNoise(symbolSeed + i * 43 + 19);

    // Deterministic wave + controlled structural setups (dip around bar 22, recovery around bar 35, pullback at 48)
    const wave = Math.sin(i * 0.19 + symbolSeed * 0.05) * 0.012;
    const regimeDrift = i > 20 && i < 36 ? 0.004 : i >= 36 && i < 46 ? -0.002 : 0.003;
    const deltaPct = (n1 - 0.47) * tfMultiplier + wave + regimeDrift;

    let open = cursor;
    let close = open * (1 + deltaPct);
    let high = Math.max(open, close) * (1 + n2 * tfMultiplier * 0.45);
    let low = Math.min(open, close) * (1 - n3 * tfMultiplier * 0.45);

    // Inject recognizable textbook setups at deterministic slots so Pattern Detection always finds real examples
    if (i === 24) {
      // Classic Hammer at swing low
      open = cursor;
      close = open * 1.004;
      high = close * 1.002;
      low = open * (1 - tfMultiplier * 1.35);
    } else if (i === 38) {
      // Bearish candle followed by Bullish Engulfing at i === 39
      open = cursor * 1.008;
      close = cursor * 0.994;
      high = open * 1.003;
      low = close * 0.997;
    } else if (i === 39) {
      const prev = rawBars[38];
      open = prev.close * 0.997;
      close = prev.open * 1.006;
      high = close * 1.003;
      low = open * 0.996;
    } else if (i === 51) {
      // Shooting Star near local swing peak
      open = cursor;
      close = open * 0.997;
      low = close * 0.998;
      high = open * (1 + tfMultiplier * 1.45);
    }

    const volume = Math.round(profile.volumeM * 1_000_000 * (0.65 + n2 * 0.9));

    const labelDate =
      timeframe === '1D'
        ? `${String(9 + Math.floor((i * 6.5) / barsCount)).padStart(2, '0')}:${String(((i * 7) % 60)).padStart(2, '0')}`
        : `Bar ${i + 1}`;

    rawBars.push({
      index: i,
      date: labelDate,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    cursor = close;
  }

  // Normalize final close cleanly to match profile.price so live quote matches chart terminal bar
  const scaleRatio = basePrice / rawBars[rawBars.length - 1].close;
  return rawBars.map((bar) => ({
    ...bar,
    open: Number((bar.open * scaleRatio).toFixed(2)),
    high: Number((bar.high * scaleRatio).toFixed(2)),
    low: Number((bar.low * scaleRatio).toFixed(2)),
    close: Number((bar.close * scaleRatio).toFixed(2)),
  }));
}

export const ACADEMY_LESSONS: LessonModule[] = [
  {
    id: 'lesson-hammer',
    code: 'Hm',
    atomicWeight: '1.008',
    title: 'The Hammer & Capitulation Wick',
    category: 'Candlesticks',
    readMinutes: 4,
    summary:
      'When sellers exhaust liquidity below structural support and buyers reclaim the open before the close, the lower shadow becomes a visible map of trapped short supply.',
    formula: 'LowerShadow >= 2.0 * |Close - Open|   AND   UpperShadow <= 0.35 * Body',
    keyTakeaways: [
      'Requires a preceding multi-bar decline so the rejection marks genuine exhaustion.',
      'Volume expansion on the hammer bar increases reversal conviction.',
      'Confirmation happens on the following bar closing above the hammer high.',
    ],
    visualType: 'hammer',
  },
  {
    id: 'lesson-engulfing',
    code: 'En',
    atomicWeight: '14.01',
    title: 'Bullish Engulfing & Regime Flip',
    category: 'Candlesticks',
    readMinutes: 5,
    summary:
      'A full-body engulfing candle absorbs the entire prior session range, signaling an abrupt transfer of control from passive distribution to aggressive accumulation.',
    formula: 'Open_t <= Close_{t-1}   AND   Close_t >= Open_{t-1}   (Prev Bar Bearish)',
    keyTakeaways: [
      'The wider the engulfed body relative to 20-bar ATR, the stronger the momentum shift.',
      'Best paired with anchored support levels or oversold RSI divergence.',
      'Invalidation level sits cleanly beneath the engulfing low.',
    ],
    visualType: 'engulfing',
  },
  {
    id: 'lesson-rsi',
    code: 'Rs',
    atomicWeight: '79.90',
    title: 'Wilder RSI & Momentum Equilibrium',
    category: 'Indicators',
    readMinutes: 6,
    summary:
      'Rather than treating RSI 70/30 as mechanical buy/sell buttons, dissect the ratio of smoothed upward versus downward velocity to detect trend exhaustion before price turns.',
    formula: 'RSI = 100 - (100 / (1 + (AvgGain_14 / AvgLoss_14)))',
    keyTakeaways: [
      'Bull regimes often find RSI support near 40–45 rather than dropping to 30.',
      'Smoothed Wilder averages prevent single-bar outlier spikes from distorting signals.',
      'Always verify divergence against actual market structure.',
    ],
    visualType: 'rsi',
  },
  {
    id: 'lesson-roic',
    code: 'Rc',
    atomicWeight: '137.3',
    title: 'ROIC vs. WACC Compounding Purity',
    category: 'Valuation',
    readMinutes: 7,
    summary:
      'Long-term equity compounding depends on how cleanly incremental capital earns above its cost. High ROE inflated by leverage collapses under stress; high unlevered ROIC endures.',
    formula: 'ROIC = NOPAT / (TotalDebt + ShareholdersEquity - ExcessCash)',
    keyTakeaways: [
      'Separate operating efficiency (ROIC) from financial engineering (leverage-boosted ROE).',
      'Watch incremental ROIC trends over 5-year cycles, not single-quarter peaks.',
      'Combine ROIC > 20% with Free Cash Flow Yield for asymmetric margin of safety.',
    ],
    visualType: 'roic',
  },
];

export const ACADEMY_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'What geometric ratio primarily distinguishes a textbook Hammer from a standard spinning top?',
    options: [
      'Lower shadow is at least 2x the real body height with minimal upper shadow',
      'Upper shadow equals the lower shadow in exact length',
      'The closing price must gap at least 5% above the prior session high',
      'Volume must drop below the 50-day moving average',
    ],
    correctIndex: 0,
    explanation:
      'A Hammer requires a long lower rejection wick (>= 2x body) showing sellers failed to hold lows, while the upper shadow remains small.',
  },
  {
    id: 'q2',
    prompt: 'In Wilder’s 14-period RSI formula, what happens as AvgLoss approaches zero?',
    options: [
      'RSI approaches 0',
      'RSI stabilizes near 50',
      'Relative Strength diverges toward infinity and RSI approaches 100',
      'MACD crosses below the zero line',
    ],
    correctIndex: 2,
    explanation:
      'As AvgLoss shrinks toward zero, RS = AvgGain / AvgLoss grows very large, causing 100 / (1 + RS) to approach 0 and RSI to approach 100.',
  },
  {
    id: 'q3',
    prompt: 'Why do quality screeners prefer ROIC over ROE when filtering capital-intensive businesses?',
    options: [
      'ROE ignores net income entirely',
      'ROE can be artificially elevated by high financial leverage or share buybacks',
      'ROIC only applies to banking institutions',
      'ROIC measures daily stock price volatility',
    ],
    correctIndex: 1,
    explanation:
      'Because ROE divides by book equity, heavy debt or buybacks shrink the denominator and inflate ROE. ROIC includes debt + equity to measure true operating yield.',
  },
  {
    id: 'q4',
    prompt: 'Where does a disciplined trader typically place invalidation on a Bullish Engulfing breakout?',
    options: [
      'At the 52-week high',
      'Randomly 1% above entry',
      'Just below the low of the engulfing two-bar structure',
      'At zero',
    ],
    correctIndex: 2,
    explanation:
      'If price breaks back below the engulfing low, the demand thesis that triggered the reversal is invalidated.',
  },
];

export const RECOMMENDED_BOOKS: BookReference[] = [
  {
    title: 'Japanese Candlestick Charting Techniques',
    author: 'Steve Nison',
    focus: 'Price action anatomy & reversal structure',
    year: 1991,
  },
  {
    title: 'New Concepts in Technical Trading Systems',
    author: 'J. Welles Wilder Jr.',
    focus: 'Original mathematical derivations of RSI, ATR & DMI',
    year: 1978,
  },
  {
    title: 'Quality Investing: Owning the Best Companies',
    author: 'Lawrence Cunningham & Torkell Eide',
    focus: 'ROIC durability, pricing power & reinvestment moats',
    year: 2016,
  },
  {
    title: 'Quantitative Value',
    author: 'Wesley Gray & Tobias Carlisle',
    focus: 'Systematic fundamental screening & behavioral discipline',
    year: 2012,
  },
];

export const PULSE_NEWS: PulseNewsItem[] = [
  {
    id: 'n1',
    headline: 'Hyperscaler capex revisions lift wafer-fab equipment order visibility through 2027',
    source: 'TradeMind Quant Wire',
    timestamp: '14m ago',
    ticker: 'ASML',
    sentiment: 'Bullish',
    impactScore: 9.4,
    summary:
      'Updated cloud infrastructure disclosures point to sustained EUV lithography tool utilization across leading-edge foundry lines.',
  },
  {
    id: 'n2',
    headline: 'Custom AI ASIC programs accelerate networking interconnect attach rates',
    source: 'Silicon Telemetry Desk',
    timestamp: '38m ago',
    ticker: 'AVGO',
    sentiment: 'Bullish',
    impactScore: 8.9,
    summary:
      'High-bandwidth Ethernet switching volume rose sharply alongside custom XPU tape-outs.',
  },
  {
    id: 'n3',
    headline: 'GLP-1 capacity expansion weighs slightly on near-term biopharma gross margin guidance',
    source: 'BioEquities Brief',
    timestamp: '1h ago',
    ticker: 'LLY',
    sentiment: 'Bearish',
    impactScore: 7.2,
    summary:
      'Accelerated sterile fill-finish manufacturing depreciation creates temporary 90bps margin compression ahead of volume ramp.',
  },
  {
    id: 'n4',
    headline: 'Treasury yield volatility tests software valuation multiples above 45x forward earnings',
    source: 'Macro Regime Monitor',
    timestamp: '2h ago',
    ticker: 'PLTR',
    sentiment: 'Neutral',
    impactScore: 8.1,
    summary:
      'Duration-sensitive equities experienced intraday factor rotation into high free-cash-flow financials and energy.',
  },
  {
    id: 'n5',
    headline: 'Cross-border payment rails post 16% constant-currency travel volume expansion',
    source: 'Global Flow Index',
    timestamp: '3h ago',
    ticker: 'V',
    sentiment: 'Bullish',
    impactScore: 8.5,
    summary:
      'High-yield international card settlement volumes continue outpacing domestic debit growth.',
  },
  {
    id: 'n6',
    headline: 'Permian Basin lateral efficiency offsets softer winter benchmark crude strips',
    source: 'Basin Energy Desk',
    timestamp: '4h ago',
    ticker: 'XOM',
    sentiment: 'Neutral',
    impactScore: 6.8,
    summary:
      'Lower drilling cycle times keep upstream free cash flow breakevens comfortably below $36/bbl.',
  },
];

export const STRATEGISTS_TO_FOLLOW: StrategistProfile[] = [
  {
    id: 's1',
    name: 'Dr. Arthur Vance',
    handle: '@vance_yieldlab',
    specialty: 'Mean-Reversion & Volatility Chemistry',
    winRatePct: 68.4,
    sharpe: 2.14,
    thesis: 'Trades stretched RSI/ATR extremes only at multi-week volume-weighted support shelves.',
  },
  {
    id: 's2',
    name: 'Elena Rostova, CFA',
    handle: '@rostova_roic',
    specialty: 'Compounder & Capital Allocation Screeners',
    winRatePct: 74.1,
    sharpe: 1.92,
    thesis: 'Filters strictly for ROIC > 22%, net cash balance sheets, and expanding gross margins.',
  },
  {
    id: 's3',
    name: 'Marcus Sterling',
    handle: '@sterling_tape',
    specialty: 'Semiconductor Cycle & Liquidity Structure',
    winRatePct: 63.8,
    sharpe: 1.85,
    thesis: 'Combines foundry lead-time channel checks with daily engulfing breakout triggers.',
  },
  {
    id: 's4',
    name: 'Nadia Chen',
    handle: '@chen_factor_xray',
    specialty: 'Multi-Factor Ranking & Risk Parity',
    winRatePct: 71.2,
    sharpe: 2.31,
    thesis: 'Blends 40% Quality, 30% Growth, and 30% Value weights to rebalance Weekly Top 10 baskets.',
  },
];
