# Path Ranking Before Quote Fanout

Cascade should not spray every venue combination with requests. A cheap pre-rank keeps quote fanout focused on routes that can plausibly clear fees and latency.

## Rank higher when

- The path touches venues with recent fill evidence.
- Token transitions are simple enough to unwind if the tail leg fails.
- Expected edge survives a modest spread widening assumption.
- The venue mix is diverse enough to avoid one stale source poisoning the route.

## Rank lower when

- The path depends on a thin middle hop.
- A leg crosses a venue that has shown delayed updates.
- The route only looks profitable before fees or priority costs.

## Operational aim

The top of the ranking should be small enough for frequent refreshes and stable enough that the runner does not churn between nearly identical routes.
