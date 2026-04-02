import { BaseVenue } from "./base.js";
import type { TokenPair, VenuePrice } from "../lib/types.js";

export class RaydiumVenue extends BaseVenue {
  readonly id = "raydium" as const;

  async getPrice(pair: TokenPair): Promise<VenuePrice> {
    const res = await fetch(
      `https://api-v3.raydium.io/mint/price?mints=${pair.inputMint},${pair.outputMint}`
    );
    const data = (await res.json()) as {
      data?: Record<string, string>;
    };

    const priceIn = Number(data.data?.[pair.inputMint] ?? 0);
    const priceOut = Number(data.data?.[pair.outputMint] ?? 1);
    const price = priceOut > 0 ? priceIn / priceOut : 0;

    return {
      venueId: this.id,
      pair: pair.symbol,
      price,
      liquidityUsd: 0,
      timestamp: Date.now(),
    };
  }

  async isHealthy(): Promise<boolean> {
    try {
      const res = await fetch("https://api-v3.raydium.io/main/info");
      return res.ok;
    } catch {
      return false;
    }
  }
}
