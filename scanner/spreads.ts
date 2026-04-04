import type { VenuePrice, SpreadSnapshot } from "../lib/types.js";

export function computeSpread(pair: string, prices: VenuePrice[]): SpreadSnapshot {
  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const bestBid = sorted[0]!;   // lowest = best to buy from
  const bestAsk = sorted[sorted.length - 1]!; // highest = best to sell to

  const spreadPct =
    bestBid.price > 0
      ? ((bestAsk.price - bestBid.price) / bestBid.price) * 100
      : 0;

  return {
    pair,
    prices,
    bestBid,
    bestAsk,
    spreadPct,
    capturedAt: Date.now(),
  };
}

export function isStale(snapshot: SpreadSnapshot, maxAgeMs = 10000): boolean {
  return Date.now() - snapshot.capturedAt > maxAgeMs;
}

/**
 * Heuristic wash-trading filter.
 * A spread that appears on exactly one venue while others are tightly clustered
 * is often a stale/bad quote rather than a real opportunity. Flag it for the
 * agent to scrutinize rather than executing automatically.
 */
export function isPotentialWashQuote(snapshot: SpreadSnapshot): boolean {
  if (snapshot.prices.length < 3) return false;
  const sorted = [...snapshot.prices].sort((a, b) => a.price - b.price);
  const mid = sorted[Math.floor(sorted.length / 2)]!.price;
  const outliers = sorted.filter((p) => Math.abs(p.price - mid) / mid > 0.003);
  // If only 1 venue is diverging by > 0.3% from the median, suspect bad quote
  return outliers.length === 1;
}

