/**
 * Backtester — replays synthetic spread history through the path finder
 * to evaluate strategy parameters without real API calls.
 *
 * Usage: bun run sim
 */
import { createLogger } from "../lib/logger.js";
import { findPaths } from "../paths/finder.js";
import { simulatePath } from "../paths/simulator.js";
import type { SpreadSnapshot, VenuePrice } from "../lib/types.js";

const log = createLogger("Backtest");

function generateHistory(pair: string, days: number): SpreadSnapshot[] {
  const snapshots: SpreadSnapshot[] = [];
  const ticks = (days * 24 * 60 * 60 * 1000) / 3000; // 3s intervals
  const basePrice = 147.0;

  for (let i = 0; i < ticks; i++) {
    const ts = Date.now() - (ticks - i) * 3000;
    const venues = ["jupiter", "raydium", "orca", "meteora"] as const;
    const prices: VenuePrice[] = venues.map((v) => ({
      venueId: v,
      pair,
      price: basePrice * (1 + (Math.random() - 0.495) * 0.005),
      liquidityUsd: 500_000 + Math.random() * 2_000_000,
      timestamp: ts,
    }));

    const sorted = [...prices].sort((a, b) => a.price - b.price);
    const bestBid = sorted[0]!;
    const bestAsk = sorted[sorted.length - 1]!;
    const spreadPct = ((bestAsk.price - bestBid.price) / bestBid.price) * 100;

    snapshots.push({
      pair,
      prices,
      bestBid,
      bestAsk,
      spreadPct,
      capturedAt: ts,
      oldestSourceTimestamp: ts,
      sourceMaxAgeMs: 0,
      isPotentialWashQuote: false,
    });
  }
  return snapshots;
}

async function runBacktest(pair: string, days = 7) {
  log.info("Starting backtest", { pair, days });

  const history = generateHistory(pair, days);
  let totalTrades = 0;
  let wins = 0;
  let totalProfit = 0;

  for (const snap of history) {
    const paths = findPaths([snap]);
    const viable = paths.filter((p) => p.viable);

    for (const path of viable) {
      const sim = simulatePath(path);
      if (sim.recommendation === "EXECUTE") {
        totalTrades++;
        const actualProfit = sim.projectedProfitUsd * (0.8 + Math.random() * 0.4);
        totalProfit += actualProfit;
        if (actualProfit > 0) wins++;
      }
    }
  }

  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  log.info("Backtest complete", {
    pair,
    days,
    totalTrades,
    winRate: `${winRate.toFixed(1)}%`,
    totalProfit: `$${totalProfit.toFixed(2)}`,
    avgProfitPerTrade: totalTrades > 0 ? `$${(totalProfit / totalTrades).toFixed(2)}` : "N/A",
  });

  console.table({
    Pair: pair,
    Days: days,
    Trades: totalTrades,
    "Win Rate": `${winRate.toFixed(1)}%`,
    "Total Profit": `$${totalProfit.toFixed(2)}`,
  });
}

await runBacktest("SOL/USDC", 7);
await runBacktest("BONK/USDC", 7);

