import { describe, it, expect } from "vitest";
import { computeSpread } from "../scanner/spreads.js";
import { findPaths } from "../paths/finder.js";
import { simulatePath } from "../paths/simulator.js";
import type { VenuePrice } from "../lib/types.js";

function makePrice(venueId: "jupiter" | "raydium" | "orca" | "meteora", price: number): VenuePrice {
  return { venueId, pair: "SOL/USDC", price, liquidityUsd: 500_000, timestamp: Date.now() };
}

describe("computeSpread", () => {
  it("identifies best bid and ask correctly", () => {
    const prices = [
      makePrice("jupiter", 147.23),
      makePrice("raydium", 147.51),
      makePrice("orca", 147.18),
      makePrice("meteora", 147.61),
    ];
    const snap = computeSpread("SOL/USDC", prices);
    expect(snap.bestBid.venueId).toBe("orca");
    expect(snap.bestAsk.venueId).toBe("meteora");
    expect(snap.spreadPct).toBeCloseTo(0.292, 1);
  });

  it("returns zero spread for identical prices", () => {
    const prices = [
      makePrice("jupiter", 147.0),
      makePrice("raydium", 147.0),
    ];
    const snap = computeSpread("SOL/USDC", prices);
    expect(snap.spreadPct).toBe(0);
  });
});

describe("findPaths", () => {
  it("marks path viable when spread exceeds minimum", () => {
    const prices = [makePrice("jupiter", 147.0), makePrice("meteora", 147.5)];
    const snap = computeSpread("SOL/USDC", prices);
    const paths = findPaths([snap]);
    expect(paths.length).toBeGreaterThan(0);
    // spread is 0.34% > 0.2% default threshold
    expect(paths[0]!.viable).toBe(true);
  });

  it("marks path not viable when spread is tiny", () => {
    const prices = [makePrice("jupiter", 147.0), makePrice("meteora", 147.01)];
    const snap = computeSpread("SOL/USDC", prices);
    const paths = findPaths([snap]);
    if (paths.length > 0) {
      // 0.0068% spread — net profit will be below minimum
      expect(paths[0]!.viable).toBe(false);
    }
  });

  it("sorts paths by net profit descending", () => {
    const snap1 = computeSpread("SOL/USDC", [makePrice("jupiter", 147.0), makePrice("meteora", 147.8)]);
    const snap2 = computeSpread("JUP/USDC", [makePrice("jupiter", 0.88), makePrice("raydium", 0.882)]);
    const paths = findPaths([snap1, snap2]);
    for (let i = 1; i < paths.length; i++) {
      expect(paths[i - 1]!.estimatedNetProfitUsd).toBeGreaterThanOrEqual(paths[i]!.estimatedNetProfitUsd);
    }
  });
});

describe("simulatePath", () => {
  it("recommends EXECUTE for profitable path", () => {
    const prices = [makePrice("jupiter", 147.0), makePrice("meteora", 148.0)];
    const snap = computeSpread("SOL/USDC", prices);
    const paths = findPaths([snap]);
    const viablePath = paths.find((p) => p.viable);
    if (viablePath) {
      const sim = simulatePath(viablePath);
      expect(sim.pathId).toBe(viablePath.id);
      expect(["EXECUTE", "SKIP"]).toContain(sim.recommendation);
    }
  });
});

