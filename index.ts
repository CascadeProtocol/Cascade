import { config } from "./lib/config.js";
import { createLogger } from "./lib/logger.js";
import { PriceMonitor } from "./scanner/monitor.js";
import { findPaths } from "./paths/finder.js";
import { ArbAgent } from "./runner/agent.js";
import { TradeExecutor } from "./runner/executor.js";
import { randomUUID } from "crypto";
import type { ScanCycle } from "./lib/types.js";

const log = createLogger("Cascade");

async function main() {
  log.info("Cascade starting", {
    paperTrading: config.PAPER_TRADING,
    scanInterval: config.SCAN_INTERVAL_MS,
    pairs: config.WATCH_PAIRS,
    minSpread: `${config.MIN_SPREAD_PCT}%`,
    minProfit: `$${config.MIN_NET_PROFIT_USD}`,
  });

  const monitor = new PriceMonitor();
  const agent = new ArbAgent();
  const executor = new TradeExecutor();

  const runCycle = async () => {
    const cycle: ScanCycle = {
      cycleId: randomUUID(),
      startedAt: Date.now(),
      pairsScanned: 0,
      opportunitiesFound: 0,
      opportunitiesExecuted: 0,
      totalProfitUsd: 0,
      paperTrading: config.PAPER_TRADING,
    };

    // 1. Scan all venues for price spreads
    const snapshots = await monitor.scanAll();
    cycle.pairsScanned = snapshots.length;

    // 2. Find profitable paths
    const paths = findPaths(snapshots);
    const viablePaths = paths.filter((p) => p.viable);
    cycle.opportunitiesFound = viablePaths.length;

    log.info("Scan complete", {
      scanned: cycle.pairsScanned,
      opportunities: viablePaths.length,
    });

    // 3. Agent evaluates each viable path
    for (const path of viablePaths) {
      const snapshot = snapshots.find((s) => s.pair === path.pair);
      if (!snapshot) continue;

      try {
        const decision = await agent.evaluate(path, snapshot);
        if (!decision) continue;

        log.info("Agent decision", {
          action: decision.action,
          pair: path.pair,
          confidence: decision.confidence,
          reasoning: decision.reasoning.slice(0, 100),
        });

        if (decision.action === "EXECUTE") {
          const result = await executor.execute(path, decision);
          if (result.success) {
            cycle.opportunitiesExecuted++;
            cycle.totalProfitUsd += result.actualProfitUsd ?? 0;
          }
        }
      } catch (err) {
        log.error("Error evaluating path", { pathId: path.id, err });
      }
    }

    cycle.completedAt = Date.now();
    const stats = executor.getStats();

    log.info("Cycle complete", {
      cycleId: cycle.cycleId,
      executed: cycle.opportunitiesExecuted,
      cycleProfit: `$${cycle.totalProfitUsd.toFixed(2)}`,
      totalProfit: `$${stats.totalProfitUsd.toFixed(2)}`,
      winRate: `${(stats.winRate * 100).toFixed(1)}%`,
    });
  };

  await runCycle();
  setInterval(runCycle, config.SCAN_INTERVAL_MS);
  log.info(`Next scan in ${config.SCAN_INTERVAL_MS / 1000}s`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
