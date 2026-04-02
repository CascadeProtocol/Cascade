import { createLogger } from "../lib/logger.js";
import { config } from "../lib/config.js";
import type { ArbPath, AgentDecision, ExecutionResult } from "../lib/types.js";

const log = createLogger("Executor");

export class TradeExecutor {
  private totalProfitUsd = 0;
  private totalTrades = 0;
  private wins = 0;

  async execute(path: ArbPath, decision: AgentDecision): Promise<ExecutionResult> {
    if (decision.action !== "EXECUTE") {
      return {
        pathId: path.id,
        success: false,
        error: `Decision was ${decision.action}, not EXECUTE`,
        executedAt: Date.now(),
      };
    }

    if (decision.confidence < config.CONFIDENCE_THRESHOLD) {
      log.warn("Confidence below threshold — skipping", {
        confidence: decision.confidence,
        threshold: config.CONFIDENCE_THRESHOLD,
      });
      return {
        pathId: path.id,
        success: false,
        error: `Confidence ${decision.confidence} below threshold ${config.CONFIDENCE_THRESHOLD}`,
        executedAt: Date.now(),
      };
    }

    const sizeUsd = decision.adjustedSizeUsd ?? path.sizeUsd;

    if (config.PAPER_TRADING) {
      const profit = path.estimatedNetProfitUsd * (0.85 + Math.random() * 0.3);
      this.totalProfitUsd += profit;
      this.totalTrades++;
      if (profit > 0) this.wins++;

      log.info("[PAPER] Arb executed", {
        pair: path.pair,
        buy: path.buyVenue,
        sell: path.sellVenue,
        sizeUsd,
        profitUsd: profit.toFixed(2),
      });

      return {
        pathId: path.id,
        success: true,
        actualProfitUsd: profit,
        txSignature: `PAPER_${Date.now()}`,
        executedAt: Date.now(),
      };
    }

    // Live execution — buy on buyVenue, sell on sellVenue
    log.warn("Live execution not yet implemented — set PAPER_TRADING=true");
    return {
      pathId: path.id,
      success: false,
      error: "Live execution not implemented",
      executedAt: Date.now(),
    };
  }

  getStats() {
    return {
      totalTrades: this.totalTrades,
      wins: this.wins,
      winRate: this.totalTrades > 0 ? this.wins / this.totalTrades : 0,
      totalProfitUsd: this.totalProfitUsd,
    };
  }
}
