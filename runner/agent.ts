import Anthropic from "@anthropic-ai/sdk";
import { config } from "../lib/config.js";
import { createLogger } from "../lib/logger.js";
import type { ArbPath, AgentDecision, SpreadSnapshot } from "../lib/types.js";
import { simulatePath } from "../paths/simulator.js";

const log = createLogger("ArbAgent");

const TOOLS: Anthropic.Tool[] = [
  {
    name: "simulate_path",
    description: "Run price impact and slippage simulation on an arb path before deciding.",
    input_schema: {
      type: "object" as const,
      properties: {
        path_id: { type: "string" },
      },
      required: ["path_id"],
    },
  },
  {
    name: "arb_decision",
    description: "Submit your final decision on whether to execute this arbitrage path.",
    input_schema: {
      type: "object" as const,
      properties: {
        action: { type: "string", enum: ["EXECUTE", "SKIP", "MONITOR"] },
        path_id: { type: "string" },
        confidence: { type: "number" },
        reasoning: { type: "string" },
        adjusted_size_usd: { type: "number", description: "Override position size if needed" },
      },
      required: ["action", "path_id", "confidence", "reasoning"],
    },
  },
];

const SYSTEM = `You are an autonomous arbitrage agent operating on Solana DEXes.

You receive an arbitrage path and must decide: EXECUTE, SKIP, or MONITOR.

Decision rules:
- Always call simulate_path first to get price-impact-adjusted profit
- EXECUTE only if: adjusted net profit > $${config.MIN_NET_PROFIT_USD}, spread > ${config.MIN_SPREAD_PCT}%, and you have high confidence (> ${config.CONFIDENCE_THRESHOLD})
- SKIP if simulation reduces profit below threshold, or if the spread looks like a data artifact
- MONITOR if the opportunity is marginal but could improve (spread between 0.15–${config.MIN_SPREAD_PCT}%)

Be conservative. A missed opportunity is better than a loss from bad data.
Set confidence as a genuine probability, never 1.0.`;

export class ArbAgent {
  private client: Anthropic;
  private pathIndex = new Map<string, ArbPath>();

  constructor() {
    this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
  }

  async evaluate(path: ArbPath, context: SpreadSnapshot): Promise<AgentDecision | null> {
    this.pathIndex.set(path.id, path);

    const prompt = `Evaluate this arbitrage opportunity:

Pair: ${path.pair}
Buy on: ${path.buyVenue} @ $${path.buyPrice.toFixed(6)}
Sell on: ${path.sellVenue} @ $${path.sellPrice.toFixed(6)}
Spread: ${path.spreadPct.toFixed(3)}%
Estimated gross profit: $${path.estimatedGrossProfitUsd.toFixed(2)}
Gas cost: $${path.estimatedGasCostUsd.toFixed(2)}
Estimated net profit: $${path.estimatedNetProfitUsd.toFixed(2)}
Position size: $${path.sizeUsd}

Context:
- ${context.prices.length} venues reporting prices
- Prices range from $${Math.min(...context.prices.map((p) => p.price)).toFixed(6)} to $${Math.max(...context.prices.map((p) => p.price)).toFixed(6)}
- Data age: ${((Date.now() - context.capturedAt) / 1000).toFixed(1)}s`;

    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: prompt },
    ];

    let decision: AgentDecision | null = null;

    agentLoop: while (true) {
      const response = await this.client.messages.create({
        model: config.CLAUDE_MODEL,
        max_tokens: 2048,
        system: SYSTEM,
        tools: TOOLS,
        messages,
      });

      if (response.stop_reason === "end_turn") break agentLoop;

      if (response.stop_reason === "tool_use") {
        const toolBlocks = response.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
        );
        const results: Anthropic.ToolResultBlockParam[] = [];

        for (const tb of toolBlocks) {
          if (tb.name === "arb_decision") {
            const inp = tb.input as {
              action: AgentDecision["action"];
              path_id: string;
              confidence: number;
              reasoning: string;
              adjusted_size_usd?: number;
            };
            decision = {
              action: inp.action,
              pathId: inp.path_id,
              confidence: inp.confidence,
              reasoning: inp.reasoning,
              adjustedSizeUsd: inp.adjusted_size_usd,
            };
            break agentLoop;
          }

          if (tb.name === "simulate_path") {
            const p = this.pathIndex.get((tb.input as { path_id: string }).path_id);
            if (!p) {
              results.push({ type: "tool_result", tool_use_id: tb.id, content: "Path not found" });
              continue;
            }
            const sim = simulatePath(p);
            results.push({
              type: "tool_result",
              tool_use_id: tb.id,
              content: JSON.stringify(sim),
            });
          }
        }

        messages.push({ role: "assistant", content: response.content });
        if (results.length > 0) {
          messages.push({ role: "user", content: results });
        }
        continue;
      }

      break agentLoop;
    }

    return decision;
  }
}

