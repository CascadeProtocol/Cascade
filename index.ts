import { randomUUID } from "crypto";
import { config } from "./lib/config.js";
import { createLogger } from "./lib/logger.js";
import { PriceMonitor } from "./scanner/monitor.js";
import { findPaths } from "./paths/finder.js";
import { ArbAgent } from "./runner/agent.js";
import { TradeExecutor } from "./runner/executor.js";
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
  let cycleInFlight = false;
  let skippedCycles = 0;

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

    try {
      const snapshots = await monitor.scanAll();
      cycle.pairsScanned = snapshots.length;

      const paths = findPaths(snapshots);
      const viablePaths = paths.filter((path) => path.viable);
      cycle.opportunitiesFound = viablePaths.length;

      log.info("Scan complete", {
        cycleId: cycle.cycleId,
        scanned: cycle.pairsScanned,
        opportunities: viablePaths.length,
      });

      for (const path of viablePaths) {
        const snapshot = snapshots.find((item) => item.pair === path.pair);
        if (!snapshot) {
          log.warn("Skipping viable path with no matching snapshot", {
            cycleId: cycle.cycleId,
            pathId: path.id,
            pair: path.pair,
          });
          continue;
        }

        try {
          const decision = await agent.evaluate(path, snapshot);
          if (!decision) {
            continue;
          }

          log.info("Agent decision", {
            cycleId: cycle.cycleId,
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
          log.error("Error evaluating path", {
            cycleId: cycle.cycleId,
            pathId: path.id,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    } catch (err) {
      log.error("Cycle failed before completion", {
        cycleId: cycle.cycleId,
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    } finally {
      cycle.completedAt = Date.now();
      const durationMs = cycle.completedAt - cycle.startedAt;
      const stats = executor.getStats();

      log.info("Cycle complete", {
        cycleId: cycle.cycleId,
        executed: cycle.opportunitiesExecuted,
        cycleProfit: `$${cycle.totalProfitUsd.toFixed(2)}`,
        totalProfit: `$${stats.totalProfitUsd.toFixed(2)}`,
        winRate: `${(stats.winRate * 100).toFixed(1)}%`,
        durationMs,
      });

      if (durationMs > config.SCAN_INTERVAL_MS) {
        log.warn("Cycle exceeded configured interval", {
          cycleId: cycle.cycleId,
          durationMs,
          intervalMs: config.SCAN_INTERVAL_MS,
        });
      }
    }
  };

  const tick = async () => {
    if (cycleInFlight) {
      skippedCycles++;
      log.warn("Skipping scan tick because the prior cycle is still running", {
        skippedCycles,
      });
      return;
    }

    cycleInFlight = true;
    try {
      await runCycle();
    } catch (err) {
      log.error("Runner tick failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      cycleInFlight = false;
    }
  };

  await tick();
  setInterval(() => {
    void tick();
  }, config.SCAN_INTERVAL_MS);
  log.info(`Next scan in ${config.SCAN_INTERVAL_MS / 1000}s`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
