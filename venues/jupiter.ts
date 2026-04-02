import { BaseVenue } from "./base.js";
import type { TokenPair, VenuePrice } from "../lib/types.js";
import { config } from "../lib/config.js";

export class JupiterVenue extends BaseVenue {
  readonly id = "jupiter" as const;

  async getPrice(pair: TokenPair): Promise<VenuePrice> {
    const amount = BigInt(10 ** pair.decimalsIn); // 1 unit

    const res = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${pair.inputMint}&outputMint=${pair.outputMint}&amount=${amount}&slippageBps=${config.SLIPPAGE_BPS}`
    );
    const data = (await res.json()) as {
      outAmount?: string;
      priceImpactPct?: string;
      routePlan?: Array<{ swapInfo?: { feeAmount?: string } }>;
    };

    const outAmount = Number(data.outAmount ?? 0) / 10 ** pair.decimalsOut;
    const priceImpact = Number(data.priceImpactPct ?? 0);

    return {
      venueId: this.id,
      pair: pair.symbol,
      price: outAmount,
      liquidityUsd: 0, // Jupiter doesn't expose per-quote liquidity
      timestamp: Date.now(),
    };
  }

  async isHealthy(): Promise<boolean> {
    try {
      const res = await fetch("https://quote-api.jup.ag/v6/health");
      return res.ok;
    } catch {
      return false;
    }
  }
}
