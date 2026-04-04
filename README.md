# Cascade

![License](https://img.shields.io/badge/license-MIT-blue)
![Runtime](https://img.shields.io/badge/runtime-Bun_1.2-black)
![Chain](https://img.shields.io/badge/chain-Solana-9945FF)
![Venues](https://img.shields.io/badge/venues-Jupiter_·_Raydium_·_Orca_·_Meteora-orange)

Autonomous cross-venue arbitrage scanner for Solana. Monitors price spreads across four DEXes every 3 seconds and uses a Claude agent to evaluate, simulate, and execute opportunities before they close.

<br/>

![Cascade arbitrage scanner](assets/preview.svg)

<br/>

---

## The opportunity

Prices across Solana DEXes are never perfectly synchronized. Jupiter, Raydium, Orca, and Meteora each run independent AMM curves — when one updates faster than the others, a window opens. Most windows are under 0.1% and close in seconds. The ones worth taking average 0.2–0.5% and last 3–15 seconds.

Cascade watches all four venues simultaneously, finds those windows, and lets Claude decide whether to act.

---

## What it does

Every 3 seconds:

1. **Scan** — fetch prices for all watched pairs from Jupiter, Raydium, Orca, and Meteora in parallel
2. **Spread** — compute best bid/ask across venues, flag pairs where spread exceeds `MIN_SPREAD_PCT`
3. **Find paths** — for each viable spread, calculate an arb path with gas-adjusted net profit
4. **Agent evaluates** — Claude calls `simulate_path` to apply price impact + slippage, then issues `EXECUTE`, `SKIP`, or `MONITOR`
5. **Execute** — approved paths go through `TradeExecutor` (paper mode by default)

---

## Agent decision loop

The Claude agent has two tools per evaluation:

```
simulate_path   → refines gross profit with price impact + slippage model
arb_decision    → final verdict: EXECUTE | SKIP | MONITOR
```

It always simulates before deciding. If the post-simulation profit drops below `MIN_NET_PROFIT_USD`, it skips regardless of the raw spread. This filters out a large class of false positives from stale quotes.

---

## Quickstart

```bash
git clone https://github.com/YOUR_USERNAME/cascade
cd cascade
bun install
cp .env.example .env    # fill in ANTHROPIC_API_KEY + HELIUS_API_KEY
bun run dev             # paper trading by default
```

Run the historical simulation:

```bash
bun run sim
```

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PAPER_TRADING` | `true` | Safe default — no on-chain execution |
| `MIN_SPREAD_PCT` | `0.20` | Minimum spread to trigger agent evaluation |
| `MIN_NET_PROFIT_USD` | `5` | Minimum post-gas, post-slippage profit |
| `MAX_POSITION_USD` | `1000` | Max size per arb trade |
| `SLIPPAGE_BPS` | `50` | Slippage tolerance (0.5%) |
| `SCAN_INTERVAL_MS` | `3000` | Price fetch frequency |
| `WATCH_PAIRS` | `SOL/USDC,...` | Comma-separated pairs to monitor |
| `CONFIDENCE_THRESHOLD` | `0.70` | Minimum agent confidence to execute |

---

## Adding a venue

Create `venues/your-venue.ts` extending `BaseVenue`, implement `getPrice()` and `isHealthy()`, then add it to `PriceMonitor.venues` in `scanner/monitor.ts`. The rest of the pipeline picks it up automatically.

---

## Technical Spec

### Price Impact Model — Constant Product AMM

Cascade uses a Constant Product approximation for price impact estimation on Raydium v3 and Orca Whirlpool:

```
impactFactor = 1 − tradeSize / (reserveDepth + tradeSize)
adjustedProfit = grossProfit × impactFactor
```

Reserve depth is approximated conservatively at 20× the trade size (if the actual pool depth is unknown from the quote). This over-estimates impact, which is the correct bias — it's better to skip a profitable trade than to take a losing one.

**Meteora DLMM note:** DLMM bins have discrete price steps. Real impact is stepwise, not smooth. The CP model still applies as a conservative lower bound — actual impact is typically lower if the trade stays within a single bin.

### Stale Quote Filter

Arb windows on Solana close in 3–15 seconds. Cascade rejects paths where the spread snapshot is older than `MAX_QUOTE_AGE_SECONDS` (default 8s) before making a Claude agent call. This avoids spending ~800ms on an agent evaluation for a spread that almost certainly no longer exists.

Data age is also passed to the agent prompt as `Quote freshness: fresh | stale` — the agent factors this into its confidence score.

### Wash-Quote Heuristic

A spread where exactly one venue diverges > 0.3% from the median of the rest is flagged as a potential bad quote before reaching the agent:

```
sorted prices: [1.2340, 1.2342, 1.2343, 1.2387] ← Raydium only outlier
→ isPotentialWashQuote = true → agent scrutinizes before EXECUTE
```

This catches a large class of stale Jupiter aggregator quotes and venue API glitches before they reach the decision layer.

### Gas Cost Model

Solana transaction cost is approximated at:
```
baseFee = 5000 lamports (~$0.0007 at $140/SOL)
priorityFee = 100_000 lamports typical (~$0.014)
total ≈ $0.015 per tx
```

A 2-leg arb (buy + sell) costs ~$0.03 in gas. This is already included in `estimatedGasCostUsd` before the agent sees the path. The `MIN_NET_PROFIT_USD` threshold (default $5) provides 166× gas coverage.

### Why No Flash Loans

Solana does not support EVM-style atomic flash loans in a single transaction. Cross-program invocations (CPIs) can compose, but there's no native "borrow-swap-repay-or-revert" primitive. Cascade executes legs sequentially with `MAX_POSITION_USD` as the capital ceiling.

---

## Stack

- **Runtime**: Bun 1.2
- **Agent**: Claude Agent SDK — `simulate_path → arb_decision` tool loop
- **Venues**: Jupiter v6 · Raydium v3 · Orca Whirlpool · Meteora DLMM
- **Simulation**: price impact + slippage model before every execution decision

---

## License

MIT


