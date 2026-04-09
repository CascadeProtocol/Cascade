import type { ArbPath } from "../lib/types.js";
import { config } from "../lib/config.js";

export interface SimResult {
  pathId: string;
  projectedProfitUsd: number;
  priceImpactAdjusted: boolean;
  adjustedSizeUsd: number;
  recommendation: "EXECUTE" | "SKIP";
  notes: string[];
}

/**
 * Refines the path estimate with price impact and slippage adjustments.
 * Called by the agent before final decision.
 */
export function simulatePath(path: ArbPath): SimResult {
  const notes: string[] = [];
  const depthCapUsd = Math.min(path.buyLiquidityUsd, path.sellLiquidityUsd);
  const adjustedSizeUsd = Math.min(path.sizeUsd, Math.max(depthCapUsd / 3, 0));
  const sizeScale = path.sizeUsd > 0 ? adjustedSizeUsd / path.sizeUsd : 0;

  const reserveDepth = Math.max(depthCapUsd, adjustedSizeUsd);
  const impactPct = adjustedSizeUsd > 0
    ? Math.min(adjustedSizeUsd / (reserveDepth + adjustedSizeUsd), config.MAX_PRICE_IMPACT_PCT / 100)
    : 1;
  const impactFactor = 1 - impactPct;
  const adjustedProfit = path.estimatedNetProfitUsd * sizeScale * impactFactor;

  if (impactFactor < 0.99) {
    notes.push(`Price impact reduces profit by ${((1 - impactFactor) * 100).toFixed(2)}%`);
  }

  // Slippage reserve
  const slippageCost = (path.slippageBps / 10000) * adjustedSizeUsd;
  const finalProfit = adjustedProfit - slippageCost;

  if (slippageCost > 0.5) {
    notes.push(`Slippage reserve: -$${slippageCost.toFixed(2)}`);
  }

  // Check liquidity
  const minLiquidity = adjustedSizeUsd * 3;
  if (depthCapUsd < minLiquidity) {
    notes.push(`Liquidity capped size to $${adjustedSizeUsd.toFixed(0)} across ${path.buyVenue}/${path.sellVenue}`);
  }

  const recommendation =
    finalProfit >= config.MIN_NET_PROFIT_USD ? "EXECUTE" : "SKIP";

  if (finalProfit < config.MIN_NET_PROFIT_USD) {
    notes.push(`Post-simulation profit $${finalProfit.toFixed(2)} below threshold`);
  }

  return {
    pathId: path.id,
    projectedProfitUsd: finalProfit,
    priceImpactAdjusted: impactFactor < 1,
    adjustedSizeUsd,
    recommendation,
    notes,
  };
}

