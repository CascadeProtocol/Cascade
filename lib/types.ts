// ─── Venues ───────────────────────────────────────────────────────────────────

export type VenueId = "jupiter" | "raydium" | "orca" | "meteora";

export interface VenueQuote {
  venueId: VenueId;
  inputMint: string;
  outputMint: string;
  inputAmount: bigint;
  outputAmount: bigint;
  priceImpactPct: number;
  fee: number; // in input token units
  liquidityUsd: number;
  timestamp: number;
}

// ─── Pairs & Spreads ──────────────────────────────────────────────────────────

export interface TokenPair {
  symbol: string;          // e.g. "SOL/USDC"
  inputMint: string;
  outputMint: string;
  decimalsIn: number;
  decimalsOut: number;
}

export interface VenuePrice {
  venueId: VenueId;
  pair: string;
  price: number;
  liquidityUsd: number;
  timestamp: number;
}

export interface SpreadSnapshot {
  pair: string;
  prices: VenuePrice[];
  bestBid: VenuePrice;    // lowest buy price
  bestAsk: VenuePrice;    // highest sell price
  spreadPct: number;
  capturedAt: number;
}

// ─── Arbitrage paths ──────────────────────────────────────────────────────────

export interface ArbPath {
  id: string;
  pair: string;
  buyVenue: VenueId;
  sellVenue: VenueId;
  buyPrice: number;
  sellPrice: number;
  spreadPct: number;
  sizeUsd: number;
  estimatedGrossProfitUsd: number;
  estimatedGasCostUsd: number;
  estimatedNetProfitUsd: number;
  slippageBps: number;
  viable: boolean;
  viabilityReason: string;
}

// ─── Agent decision ───────────────────────────────────────────────────────────

export type ArbAction = "EXECUTE" | "SKIP" | "MONITOR";

export interface AgentDecision {
  action: ArbAction;
  pathId: string;
  confidence: number;
  reasoning: string;
  adjustedSizeUsd?: number;
}

// ─── Execution result ─────────────────────────────────────────────────────────

export interface ExecutionResult {
  pathId: string;
  success: boolean;
  actualProfitUsd?: number;
  txSignature?: string;
  error?: string;
  executedAt: number;
}

// ─── Cycle ────────────────────────────────────────────────────────────────────

export interface ScanCycle {
  cycleId: string;
  startedAt: number;
  completedAt?: number;
  pairsScanned: number;
  opportunitiesFound: number;
  opportunitiesExecuted: number;
  totalProfitUsd: number;
  paperTrading: boolean;
}
