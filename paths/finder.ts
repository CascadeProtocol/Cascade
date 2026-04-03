import { config } from "../lib/config.js";
import { createLogger } from "../lib/logger.js";
import type { SpreadSnapshot, ArbPath } from "../lib/types.js";
import { randomUUID } from "crypto";

const log = createLogger("PathFinder");

const GAS_COST_USD = 0.05; // ~0.0003 SOL per tx, two txs per arb

export function findPaths(snapshots: SpreadSnapshot[]): ArbPath[] {
  const paths: ArbPath[] = [];

  for (const snap of snapshots) {
    if (snap.spreadPct < config.MIN_SPREAD_PCT) continue;

    const grossProfit = (snap.spreadPct / 100) * config.MAX_POSITION_USD;
    const netProfit = grossProfit - GAS_COST_USD;

    const viable = netProfit >= config.MIN_NET_PROFIT_USD;

    const path: ArbPath = {
      id: randomUUID(),
      pair: snap.pair,
      buyVenue: snap.bestBid.venueId,
      sellVenue: snap.bestAsk.venueId,
      buyPrice: snap.bestBid.price,
      sellPrice: snap.bestAsk.price,
      spreadPct: snap.spreadPct,
      sizeUsd: config.MAX_POSITION_USD,
      estimatedGrossProfitUsd: grossProfit,
      estimatedGasCostUsd: GAS_COST_USD,
      estimatedNetProfitUsd: netProfit,
      slippageBps: config.SLIPPAGE_BPS,
      viable,
      viabilityReason: viable
        ? `Net profit $${netProfit.toFixed(2)} exceeds minimum $${config.MIN_NET_PROFIT_USD}`
        : netProfit < config.MIN_NET_PROFIT_USD
        ? `Net profit $${netProfit.toFixed(2)} below minimum $${config.MIN_NET_PROFIT_USD}`
        : "Spread too tight",
    };

    paths.push(path);
    log.debug("Path found", {
      pair: path.pair,
      spread: `${path.spreadPct.toFixed(3)}%`,
      net: `$${netProfit.toFixed(2)}`,
      viable,
    });
  }

  // Sort by net profit descending
  return paths.sort((a, b) => b.estimatedNetProfitUsd - a.estimatedNetProfitUsd);
}

