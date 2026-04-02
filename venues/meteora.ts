import { BaseVenue } from "./base.js";
import type { TokenPair, VenuePrice } from "../lib/types.js";

export class MeteoraVenue extends BaseVenue {
  readonly id = "meteora" as const;

  async getPrice(pair: TokenPair): Promise<VenuePrice> {
    const res = await fetch(
      `https://dlmm-api.meteora.ag/pair/all_by_groups?token=${pair.inputMint}`
    );
    const data = (await res.json()) as {
      data?: Array<{
        mint_x?: string;
        mint_y?: string;
        current_price?: number;
        liquidity?: number;
      }>;
    };

    const pool = data.data?.find(
      (p) =>
        (p.mint_x === pair.inputMint && p.mint_y === pair.outputMint) ||
        (p.mint_y === pair.inputMint && p.mint_x === pair.outputMint)
    );

    return {
      venueId: this.id,
      pair: pair.symbol,
      price: pool?.current_price ?? 0,
      liquidityUsd: pool?.liquidity ?? 0,
      timestamp: Date.now(),
    };
  }

  async isHealthy(): Promise<boolean> {
    try {
      const res = await fetch("https://dlmm-api.meteora.ag/pair/all");
      return res.ok;
    } catch {
      return false;
    }
  }
}
