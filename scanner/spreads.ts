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

