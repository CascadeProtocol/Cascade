# CLAUDE.md

## What this is

Cascade scans four Solana DEXes (Jupiter, Raydium, Orca, Meteora) every 3 seconds looking for price spreads. When a viable spread is found, a Claude agent runs a two-step evaluation (simulate → decide) and either executes, skips, or flags for monitoring.

## Layout

```
index.ts          ← entry point + scan loop
venues/           ← one adapter per DEX
  base.ts
  jupiter.ts      ← Jupiter v6 quote API
  raydium.ts      ← Raydium v3 price API
  orca.ts         ← Orca Whirlpool list
  meteora.ts      ← Meteora DLMM API
scanner/
  monitor.ts      ← parallel price fetch for all pairs
  spreads.ts      ← best bid/ask + spread % computation
paths/
  finder.ts       ← path viability check + profit estimate
  simulator.ts    ← price impact + slippage refinement
runner/
  agent.ts        ← Claude agent loop (simulate → arb_decision)
  executor.ts     ← paper/live trade execution
lib/
  config.ts       ← Zod env validation
  types.ts        ← all shared interfaces
  logger.ts       ← structured JSONL logger
sim/
  backtest.ts     ← synthetic history simulation
tests/
docs/
  strategies.md   ← tuning guide
```

## Adding a venue

1. Create `venues/your-venue.ts` extending `BaseVenue`
2. Implement `id`, `getPrice()`, `isHealthy()`
3. Add to `PriceMonitor.venues` array in `scanner/monitor.ts`

## Key rules

- `PAPER_TRADING=true` is the default — never change this without testing
- Agent always calls `simulate_path` before `arb_decision`
- Never use `console.log` — use `createLogger(ns)` from `lib/logger.ts`


