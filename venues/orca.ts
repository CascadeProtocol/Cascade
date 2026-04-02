import { BaseVenue } from "./base.js";
import type { TokenPair, VenuePrice } from "../lib/types.js";

export class OrcaVenue extends BaseVenue {
  readonly id = "orca" as const;

  async getPrice(pair: TokenPair): Promise<VenuePrice> {
    // Orca Whirlpool price via their public API
    const res = await fetch(
      `https://api.orca.so/v1/whirlpool/list`
    );
    const data = (await res.json()) as {
      whirlpools?: Array<{
        tokenA?: { mint?: string };
        tokenB?: { mint?: string };
        price?: number;
        tvl?: number;
      }>;
    };

    const pool = data.whirlpools?.find(
      (p) =>
        (p.tokenA?.mint === pair.inputMint && p.tokenB?.mint === pair.outputMint) ||
        (p.tokenB?.mint === pair.inputMint && p.tokenA?.mint === pair.outputMint)
    );

    const price = pool?.price ?? 0;
    const isReversed = pool?.tokenB?.mint === pair.inputMint;

    return {
      venueId: this.id,
      pair: pair.symbol,
      price: isReversed && price > 0 ? 1 / price : price,
      liquidityUsd: pool?.tvl ?? 0,
      timestamp: Date.now(),
    };
  }

  async isHealthy(): Promise<boolean> {
    try {
      const res = await fetch("https://api.orca.so/v1/whirlpool/list");
      return res.ok;
    } catch {
      return false;
    }
  }
}
