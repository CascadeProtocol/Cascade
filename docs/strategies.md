# Arb Strategies

## Simple two-venue spread

Buy on the venue with the lowest price, sell on the highest.
Viable when: net profit after gas > `MIN_NET_PROFIT_USD`.

**Risk**: price moves between quote and execution. Mitigated by fast scan interval (3s) and slippage tolerance.

## Tuning `MIN_SPREAD_PCT`

Lower threshold = more opportunities, more false positives from stale quotes.
Higher threshold = fewer trades, higher signal quality.

Recommended starting point: **0.20%**. Adjust based on backtest win rate.

## Gas cost model

Two transactions per arb (buy + sell). Estimated at $0.05 total.
Revisit if Solana base fee changes.

## Pair selection

Start with high-liquidity pairs (SOL/USDC, JUP/USDC).
Low-liquidity pairs have larger spreads but higher price impact.
