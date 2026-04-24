import { z } from "zod";
import "dotenv/config";

const TEST_ENV = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

const ConfigSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  HELIUS_API_KEY: z.string().min(1),
  SOLANA_RPC_URL: z.string().url(),

  // Trading
  PAPER_TRADING: z.string().transform((v) => v === "true").default("true"),
  MIN_SPREAD_PCT: z.coerce.number().min(0).default(0.2),
  MIN_NET_PROFIT_USD: z.coerce.number().min(0).default(5),
  MAX_POSITION_USD: z.coerce.number().min(0).default(1000),
  MAX_PRICE_IMPACT_PCT: z.coerce.number().min(0).default(0.5),
  SLIPPAGE_BPS: z.coerce.number().min(0).default(50),

  // Scanner
  SCAN_INTERVAL_MS: z.coerce.number().min(1000).default(3000),
  WATCH_PAIRS: z
    .string()
    .default("SOL/USDC,JUP/USDC,BONK/USDC,WIF/USDC")
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),

  // Agent
  CLAUDE_MODEL: z.string().default("claude-sonnet-4-5-20251001"),
  CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.70),
  MAX_QUOTE_AGE_SECONDS: z.coerce.number().min(1).default(8),
});

export type Config = z.infer<typeof ConfigSchema>;

function loadConfig(): Config {
  const env = TEST_ENV
    ? {
        ANTHROPIC_API_KEY: "test-anthropic-key",
        HELIUS_API_KEY: "test-helius-key",
        SOLANA_RPC_URL: "https://example.com",
        MIN_NET_PROFIT_USD: "1",
        ...process.env,
      }
    : process.env;
  const result = ConfigSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Configuration error:");
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();

