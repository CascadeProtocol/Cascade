# Changelog

## [1.0.0] — 2026-04-03

### Added
- Four venue adapters: Jupiter v6, Raydium v3, Orca Whirlpool, Meteora DLMM
- PriceMonitor — parallel price fetch across all venues every 3s
- SpreadSnapshot — best bid/ask computation per pair
- PathFinder — viable arb path detection with gas-adjusted net profit
- PathSimulator — price impact + slippage refinement before execution
- ArbAgent — Claude-powered EXECUTE / SKIP / MONITOR decision loop
- TradeExecutor — paper trading mode with win rate tracking
- Backtester (`sim/backtest.ts`) — synthetic spread history simulation
- 9 unit tests covering spread computation, path finding, simulation
