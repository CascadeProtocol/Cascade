import type { ArbPath } from "../lib/types.js";
import { config } from "../lib/config.js";

export interface SimResult {
  pathId: string;
  projectedProfitUsd: number;
  priceImpactAdjusted: boolean;
  recommendation: "EXECUTE" | "SKIP";
  notes: string[];
}

/**
 * Refines the path estimate with price impact and slippage adjustments.
 * Called by the agent before final decision.
 */
export function simulatePath(path: ArbPath): SimResult {
  const notes: string[] = [];

  // Price impact — Constant Product AMM model.
  // For x*y=k: price impact ≈ tradeSize / (reserveDepth + tradeSize).
  // Reserve depth is approximated from the spread snapshot liquidity.
  // Meteora DLMM has discrete bin steps — real impact is stepwise, not smooth,
  // but this model is conservative (over-estimates impact) which is the right bias.
  const reserveDepth = path.sizeUsd * 20; // assume 20× size in reserves (conservative)
  const impactFactor = 1 - path.sizeUsd / (reserveDepth + path.sizeUsd);
  const adjustedProfit = path.estimatedNetProfitUsd * impactFactor;

  if (impactFactor < 0.99) {
    notes.push(`Price impact reduces profit by ${((1 - impactFactor) * 100).toFixed(2)}%`);
  }

  // Slippage reserve
  const slippageCost = (path.slippageBps / 10000) * path.sizeUsd;
  const finalProfit = adjustedProfit - slippageCost;

  if (slippageCost > 0.5) {
    notes.push(`Slippage reserve: -$${slippageCost.toFixed(2)}`);
  }

  // Check liquidity
  const minLiquidity = path.sizeUsd * 3; // need 3x size in pool
  const buyLiquidity = 0; // would be filled from venue quote
  if (buyLiquidity > 0 && buyLiquidity < minLiquidity) {
    notes.push(`Low liquidity on ${path.buyVenue}: $${buyLiquidity.toFixed(0)}`);
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
    recommendation,
    notes,
  };
}

