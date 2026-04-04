import { createLogger } from "../lib/logger.js";
import { config } from "../lib/config.js";
import type { TokenPair, VenuePrice, SpreadSnapshot } from "../lib/types.js";
import { JupiterVenue } from "../venues/jupiter.js";
import { RaydiumVenue } from "../venues/raydium.js";
import { OrcaVenue } from "../venues/orca.js";
import { MeteoraVenue } from "../venues/meteora.js";
import type { BaseVenue } from "../venues/base.js";
import { computeSpread } from "./spreads.js";

const log = createLogger("Monitor");

// Well-known pair definitions
const KNOWN_PAIRS: Record<string, TokenPair> = {
  "SOL/USDC": {
    symbol: "SOL/USDC",
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimalsIn: 9,
    decimalsOut: 6,
  },
  "JUP/USDC": {
    symbol: "JUP/USDC",
    inputMint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimalsIn: 6,
    decimalsOut: 6,
  },
  "BONK/USDC": {
    symbol: "BONK/USDC",
    inputMint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimalsIn: 5,
    decimalsOut: 6,
  },
  "WIF/USDC": {
    symbol: "WIF/USDC",
    inputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimalsIn: 6,
    decimalsOut: 6,
  },
};

export class PriceMonitor {
  private venues: BaseVenue[];
  private snapshots = new Map<string, SpreadSnapshot>();

  constructor() {
    this.venues = [
      new JupiterVenue(),
      new RaydiumVenue(),
      new OrcaVenue(),
      new MeteoraVenue(),
    ];
  }

  async scanPair(symbol: string): Promise<SpreadSnapshot | null> {
    const pair = KNOWN_PAIRS[symbol];
    if (!pair) {
      log.warn("Unknown pair", { symbol });
      return null;
    }

    const results = await Promise.allSettled(
      this.venues.map((v) => v.getPrice(pair))
    );

    const prices: VenuePrice[] = results
      .filter((r): r is PromiseFulfilledResult<VenuePrice> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((p) => p.price > 0);

    if (prices.length < 2) {
      log.debug("Insufficient venue data", { symbol, count: prices.length });
      return null;
    }

    // Log any venues that failed — persistent failures indicate API key issues
    // or rate limiting that should be investigated before missing real opportunities
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      log.debug("Venue fetch failures", { symbol, failed: failed.length, total: results.length });
    }

    const snapshot = computeSpread(pair.symbol, prices);
    this.snapshots.set(symbol, snapshot);
    return snapshot;
  }

  async scanAll(): Promise<SpreadSnapshot[]> {
    const results = await Promise.allSettled(
      config.WATCH_PAIRS.map((p) => this.scanPair(p))
    );

    return results
      .filter((r): r is PromiseFulfilledResult<SpreadSnapshot> =>
        r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);
  }

  getSnapshot(symbol: string): SpreadSnapshot | undefined {
    return this.snapshots.get(symbol);
  }

  getAllSnapshots(): SpreadSnapshot[] {
    return Array.from(this.snapshots.values());
  }
}

