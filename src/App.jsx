// CASCADE — Autonomous cross-venue arbitrage scanner for Solana. Single-file landing surface.
import React from "react";
import {
  Github,
  ArrowUpRight,
  ArrowDown,
  Check,
  X,
  Zap,
  Calculator,
  Clock,
  SkipForward,
  Radar,
  TrendingUp,
  Route,
  Activity,
  Brain,
  Send,
  Target,
  ShieldCheck,
  Hand,
  RefreshCcw,
} from "lucide-react";

export default function CascadeLanding() {
  return (
    <div className="scroll-smooth bg-[#050505] text-white font-sans antialiased min-h-screen selection:bg-cyan-500/30">
      {/* ================= STICKY TOP NAV ================= */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <a href="#top" className="text-[15px] font-semibold tracking-[0.18em] text-white">
            CASCADE
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {[
              ["SCANNER", "#scanner"],
              ["DOCTRINE", "#doctrine"],
              ["LOOP", "#loop"],
              ["DECISION", "#decision"],
              ["LAUNCH", "#launch"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 sm:inline-block">
              CA:PENDING
            </span>
            <a
              href="https://github.com/CascadeProtocol/Cascade"
              className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#scanner"
              className="rounded-md bg-cyan-400 px-3 py-1.5 text-[12px] font-semibold tracking-wide text-black transition-colors hover:bg-cyan-300"
            >
              Launch Cascade
            </a>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section id="top" className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-7xl grid-cols-1 items-center gap-14 px-6 py-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* LEFT */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-400/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                LIVE ARBITRAGE SCANNER
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                4 VENUES · 3-SECOND SCAN CYCLE
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.6rem] text-pretty">
              <span className="block text-white">Prices drift across DEXes.</span>
              <span className="block text-white/35">Cascade trades the gap.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-white/60">
              Autonomous arbitrage scanner watching Jupiter, Raydium, Orca, and Meteora every 3 seconds. Spread, simulate, decide — before the window closes.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#scanner"
                className="inline-flex items-center gap-2 rounded-md bg-cyan-400 px-5 py-3 text-[13px] font-semibold tracking-wide text-black transition-colors hover:bg-cyan-300"
              >
                View the live run
              </a>
              <a
                href="#loop"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-transparent px-5 py-3 text-[13px] font-semibold tracking-wide text-white/85 transition-colors hover:border-white/40 hover:text-white"
              >
                Read the architecture <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* RIGHT — OPPORTUNITY → VERDICT PANEL */}
          <div className="relative">
            <div className="rounded-xl border border-white/10 bg-[#0b0b0c] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_60px_-20px_rgba(0,0,0,0.6)]">
              {/* A. Header row */}
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                <span>scanner.cycle/4182</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-300/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  DECIDED · 740ms
                </span>
              </div>

              {/* B. Opportunity card */}
              <div className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  OPPORTUNITY DETECTED
                </div>
                <div className="mt-2 rounded-lg border border-cyan-400/45 bg-cyan-400/[0.06] p-5">
                  <div className="font-mono text-xl text-white">
                    SOL/USDC spread: 0.31%
                  </div>
                  <div className="mt-2 font-mono text-[12px] text-white/55">
                    Jupiter $138.40 · Raydium $138.83 · 12s window
                  </div>
                </div>
              </div>

              {/* C. Transition */}
              <div className="my-4 flex flex-col items-center gap-1">
                <ArrowDown className="h-5 w-5 text-cyan-400/80" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  CASCADE EVALUATED
                </span>
              </div>

              {/* D. Verdict */}
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-emerald-300">
                    EXECUTE
                  </span>
                  <span className="font-mono text-[11px] text-white/55">confidence 0.82</span>
                </div>

                <ul className="mt-3 space-y-1.5 font-mono text-[12px] text-white/65">
                  {[
                    "Spread clears the 0.20% floor",
                    "Net edge after gas: +0.21%",
                    "Quote freshness: fresh (4s old)",
                    "Liquidity covers $1,000 position",
                    "No wash-quote signature on any venue",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check className="mt-[3px] h-3.5 w-3.5 flex-shrink-0 text-cyan-300" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* E. Footer row */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-white/45">
                  <span>filled $138.71</span>
                  <span>·</span>
                  <span>12s window</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-300">
                    <Check className="h-3.5 w-3.5" /> win
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE ARBITRAGE SCANNER ================= */}
      <section id="scanner" className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">SCANNER</div>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            <span className="block text-white">Live across four venues.</span>
            <span className="block text-white/35">Decided every cycle.</span>
          </h2>

          <ScannerDashboard />

          <p className="mt-8 max-w-2xl font-mono text-[12px] leading-relaxed text-white/45">
            Live mainnet. Every venue, every cycle, every guard. No path executes until all six gates clear.
          </p>

          <div className="mt-10 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["0.20%", "Minimum spread"],
              ["8s", "Max quote age"],
              ["0.70", "Confidence threshold"],
            ].map(([n, label]) => (
              <div key={label} className="px-2 py-6 sm:px-8">
                <div className="font-mono text-3xl font-semibold tracking-tight text-white">{n}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DOCTRINE ================= */}
      <section id="doctrine" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">DOCTRINE</div>
              <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
                <span className="block text-white">Edge survives the friction.</span>
                <span className="block text-white/35">Or it doesn&apos;t survive at all.</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
                Four rules govern what counts as an opportunity. A spread that fails any one of them is not an opportunity — it is a stale number on a screen.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { n: "01", t: "Edge survives the race.", b: "A spread is only an opportunity if it survives oracle drift, gas, slippage, and the seconds it takes to act.", Icon: Zap },
                { n: "02", t: "Simulate before commit.", b: "Every path runs through a price-impact and slippage model before the agent votes EXECUTE.", Icon: Calculator },
                { n: "03", t: "Stale quotes get rejected.", b: "Spread snapshots older than 8 seconds never reach the agent. The window has already closed.", Icon: Clock },
                { n: "04", t: "The skip is the product.", b: "Most scanned paths get SKIP. That is the discipline working, not a missed opportunity.", Icon: SkipForward },
              ].map(({ n, t, b, Icon }) => (
                <DoctrineCard key={n} n={n} t={t} b={b} Icon={Icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= LOOP ================= */}
      <section id="loop" className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">THE LOOP</div>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            <span className="block text-white">Six steps.</span>
            <span className="block text-white/35">Every three seconds.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/55">
            The same path on every cycle. A spread that survives all six is the only kind Cascade trades.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "Scan", b: "Pull prices from Jupiter, Raydium, Orca, and Meteora in parallel.", Icon: Radar },
              { n: "02", t: "Spread", b: "Compute best bid/ask across venues. Flag pairs where the spread clears the floor.", Icon: TrendingUp },
              { n: "03", t: "Path", b: "Build the arbitrage route. Compute gas-adjusted net profit.", Icon: Route },
              { n: "04", t: "Simulate", b: "Apply price impact and slippage. Re-check whether the edge still survives.", Icon: Activity },
              { n: "05", t: "Decide", b: "Claude votes EXECUTE, MONITOR, or SKIP. Confidence has to clear the threshold.", Icon: Brain },
              { n: "06", t: "Execute", b: "Approved paths go through the trade executor. Every cycle is logged, win or skip.", Icon: Send },
            ].map(({ n, t, b, Icon }) => (
              <LoopCard key={n} n={n} t={t} b={b} Icon={Icon} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= DECISION ================= */}
      <section id="decision" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">DECISION</div>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            <span className="block text-white">What gets executed.</span>
            <span className="block text-white/35">And what the guards stop.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/55">
            A path either reaches a clean execute or it does not. There is no in-between, no warning-only ship.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DecisionPanel
              title="READY TO EXECUTE"
              dotClass="bg-cyan-400"
              iconType="check"
              items={[
                "Spread clears the 0.20% floor",
                "Net edge clears the minimum after gas and slippage",
                "Quote freshness inside the 8-second window",
                "No wash-quote signature on any venue",
                "Confidence above the 0.70 threshold",
                "Position size within the cap",
              ]}
            />
            <DecisionPanel
              title="REASONS A PATH IS SKIPPED"
              dotClass="bg-amber-400"
              iconType="x"
              items={[
                "Net edge collapses after gas and slippage",
                "Quote snapshot stale (older than 8 seconds)",
                "Single-venue outlier flagged as wash",
                "Confidence below the floor",
                "Position would exceed the size cap",
                "Slippage tolerance breach during simulation",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================= PRINCIPLES ================= */}
      <section id="principles" className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">PRINCIPLES</div>
              <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
                <span className="block text-white">Rules of the cycle.</span>
                <span className="block text-white/35">Every three seconds, every venue.</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
                The discipline does not bend for a number that looks good on paper. The threshold is the threshold on every cycle.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { n: "01", t: "Net edge over raw spread.", b: "A 0.5% spread that nets 0% after gas isn't an opportunity. The math gates it.", Icon: Target },
                { n: "02", t: "The agent earns confidence.", b: "Confidence at or above 0.70 to execute. The threshold is a constraint, not a suggestion.", Icon: ShieldCheck },
                { n: "03", t: "Stale is the same as wrong.", b: "A stale quote is structurally indistinguishable from a wash quote. Both get rejected.", Icon: Hand },
                { n: "04", t: "The skipped path is not a regret.", b: "The product is the discipline. The next cycle starts in three seconds.", Icon: RefreshCcw },
              ].map(({ n, t, b, Icon }) => (
                <DoctrineCard key={n} n={n} t={t} b={b} Icon={Icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= LAUNCH ================= */}
      <section id="launch" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">LAUNCH</div>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl text-pretty">
            A token for a scanner that earns every fill.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Cascade launches on Pump.fun as a fair launch. The contract address is pinned at the top of this page and fills the moment it drops.
          </p>
          <div className="mt-10">
            <a
              href="https://x.com/"
              className="inline-flex items-center gap-2 rounded-md bg-cyan-400 px-5 py-3 text-[13px] font-semibold tracking-wide text-black transition-colors hover:bg-cyan-300"
            >
              Follow for the drop: X <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-4xl px-6 py-32 text-center">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl text-pretty">
            Cross-venue arbitrage you can verify.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-white/60">
            An autonomous Solana scanner that earns every fill.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#scanner"
              className="inline-flex items-center gap-2 rounded-md bg-cyan-400 px-5 py-3 text-[13px] font-semibold tracking-wide text-black transition-colors hover:bg-cyan-300"
            >
              Launch Cascade
            </a>
            <a
              href="https://github.com/CascadeProtocol/Cascade"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-transparent px-5 py-3 text-[13px] font-semibold tracking-wide text-white/85 transition-colors hover:border-white/40 hover:text-white"
            >
              View on GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">SITE</div>
              <ul className="mt-4 space-y-2 text-[14px]">
                {[
                  ["Scanner", "#scanner"],
                  ["Doctrine", "#doctrine"],
                  ["Loop", "#loop"],
                  ["Decision", "#decision"],
                  ["Launch", "#launch"],
                ].map(([l, h]) => (
                  <li key={l}>
                    <a href={h} className="text-white/70 transition-colors hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">PROJECT</div>
              <ul className="mt-4 space-y-2 text-[14px]">
                <li><a href="https://github.com/CascadeProtocol/Cascade" className="text-white/70 transition-colors hover:text-white">Docs</a></li>
                <li><a href="#scanner" className="text-white/70 transition-colors hover:text-white">Status</a></li>
                <li><a href="https://github.com/CascadeProtocol/Cascade" className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white">GitHub <ArrowUpRight className="h-3.5 w-3.5" /></a></li>
                <li><a href="https://x.com/" className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white">X <ArrowUpRight className="h-3.5 w-3.5" /></a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[11px] text-white/45">
            <div>Cascade | CascadeProtocol | © 2026</div>
            <div>v1.0 · live</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =====================================================================
   COMPONENTS
   ===================================================================== */

function DoctrineCard({ n, t, b, Icon }) {
  return (
    <div className="group relative flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-6 transition-colors duration-200 hover:border-cyan-500/40">
      <div className="flex items-start justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">{n}</div>
        <Icon className="h-[20px] w-[20px] text-cyan-400/70" />
      </div>
      <div className="mt-5 text-[17px] font-semibold leading-snug text-white">{t}</div>
      <p className="mt-2 text-[14px] leading-relaxed text-white/55">{b}</p>
    </div>
  );
}

function LoopCard({ n, t, b, Icon }) {
  return (
    <div className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-8 transition-colors duration-200 hover:border-cyan-500/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="font-mono text-[12px] font-semibold tracking-[0.18em] text-amber-300">{n}</div>
          <div className="h-px w-10 bg-amber-300/40" />
        </div>
        <Icon className="h-[22px] w-[22px] text-cyan-400/80" />
      </div>
      <div className="mt-6 text-[18px] font-semibold leading-snug text-white">{t}</div>
      <p className="mt-2 text-[14px] leading-relaxed text-white/55">{b}</p>
    </div>
  );
}

function DecisionPanel({ title, dotClass, iconType, items }) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-7">
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">{title}</div>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((line) => (
          <li key={line} className="flex items-start gap-3">
            {iconType === "check" ? (
              <Check className="mt-[3px] h-4 w-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <X className="mt-[3px] h-4 w-4 flex-shrink-0 text-cyan-400" />
            )}
            <span className="text-[14.5px] leading-relaxed text-white/75">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =====================================================================
   SCANNER DASHBOARD
   ===================================================================== */

function ScannerDashboard() {
  const venues = [
    { venue: "Jupiter", pair: "SOL/USDC", bid: "138.39", ask: "138.40", depth: "$1.84M", fresh: "fresh" },
    { venue: "Raydium", pair: "SOL/USDC", bid: "138.83", ask: "138.85", depth: "$1.27M", fresh: "fresh" },
    { venue: "Orca",    pair: "SOL/USDC", bid: "138.55", ask: "138.57", depth: "$0.92M", fresh: "fresh" },
    { venue: "Meteora", pair: "SOL/USDC", bid: "138.61", ask: "138.63", depth: "$0.41M", fresh: "stale" },
  ];

  const queue = [
    { time: "14:02:17", pair: "SOL/USDC",   spread: "0.31%", net: "+0.21%", verdict: "EXECUTE" },
    { time: "14:02:14", pair: "JTO/USDC",   spread: "0.18%", net: "-0.04%", verdict: "SKIP"    },
    { time: "14:02:11", pair: "BONK/USDC",  spread: "0.42%", net: "+0.07%", verdict: "MONITOR" },
    { time: "14:02:08", pair: "JUP/USDC",   spread: "0.14%", net: "-0.02%", verdict: "SKIP"    },
    { time: "14:02:05", pair: "PYTH/USDC",  spread: "0.09%", net: "-0.05%", verdict: "SKIP"    },
    { time: "14:02:02", pair: "WIF/USDC",   spread: "0.27%", net: "+0.11%", verdict: "EXECUTE" },
  ];

  return (
    <div className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0b]">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-5 py-3">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/65">
          <span className="text-white">CASCADE</span>
          <span className="text-white/30">·</span>
          <span>LIVE SCANNER</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> LIVE
          </span>
          <span className="text-white/55">venues <span className="text-white">4 connected</span></span>
          <span className="text-white/55">uptime <span className="text-white">31d 04h</span></span>
          <span className="text-white/55">last cycle <span className="text-white">740ms</span></span>
          <span className="text-white/55">success <span className="text-white">98.2%</span></span>
        </div>
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-1 gap-px bg-white/5 lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — venue prices */}
        <div className="bg-[#0a0a0b] p-5">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">VENUE PRICES</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">snapshot · 4s old</div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse font-mono text-[12px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-white/40">
                  <th className="border-b border-white/10 py-2 pr-3 font-normal">VENUE</th>
                  <th className="border-b border-white/10 py-2 pr-3 font-normal">PAIR</th>
                  <th className="border-b border-white/10 py-2 pr-3 font-normal">BID</th>
                  <th className="border-b border-white/10 py-2 pr-3 font-normal">ASK</th>
                  <th className="border-b border-white/10 py-2 pr-3 font-normal">DEPTH</th>
                  <th className="border-b border-white/10 py-2 font-normal">FRESHNESS</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {venues.map((v) => {
                  const highlight = v.venue === "Jupiter" || v.venue === "Raydium";
                  return (
                    <tr key={v.venue} className={highlight ? "bg-cyan-400/[0.04]" : ""}>
                      <td className={`border-b border-white/5 py-2.5 pr-3 ${highlight ? "text-cyan-200" : "text-white"}`}>{v.venue}</td>
                      <td className="border-b border-white/5 py-2.5 pr-3 text-white/65">{v.pair}</td>
                      <td className="border-b border-white/5 py-2.5 pr-3">{v.bid}</td>
                      <td className="border-b border-white/5 py-2.5 pr-3">{v.ask}</td>
                      <td className="border-b border-white/5 py-2.5 pr-3 text-white/60">{v.depth}</td>
                      <td className="border-b border-white/5 py-2.5">
                        <span className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                          v.fresh === "fresh"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/5 text-white/45"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${v.fresh === "fresh" ? "bg-emerald-400" : "bg-white/40"}`} />
                          {v.fresh}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT — selected opp + queue */}
        <div className="flex flex-col gap-px bg-white/5">
          {/* Selected opportunity */}
          <div className="bg-[#0a0a0b] p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">SELECTED OPPORTUNITY</div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-emerald-300">
                EXECUTE
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 font-mono text-[12px]">
              <Field label="path"          value="Jupiter → Raydium" />
              <Field label="pair"          value="SOL/USDC" />
              <Field label="spread"        value="0.31%" />
              <Field label="gas estimate"  value="$0.04" />
              <Field label="simulated net" value={<span className="text-emerald-300">+$2.10 (+0.21%)</span>} />
              <Field label="confidence"    value="0.82" />
            </div>
          </div>

          {/* Decision queue */}
          <div className="bg-[#0a0a0b] p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">DECISION QUEUE</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">last 6 cycles</div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[460px] border-collapse font-mono text-[11.5px]">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-white/40">
                    <th className="border-b border-white/10 py-2 pr-3 font-normal">TIME</th>
                    <th className="border-b border-white/10 py-2 pr-3 font-normal">PAIR</th>
                    <th className="border-b border-white/10 py-2 pr-3 font-normal">SPREAD</th>
                    <th className="border-b border-white/10 py-2 pr-3 font-normal">NET EDGE</th>
                    <th className="border-b border-white/10 py-2 font-normal">VERDICT</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((q) => (
                    <tr key={q.time}>
                      <td className="border-b border-white/5 py-2 pr-3 text-white/55">{q.time}</td>
                      <td className="border-b border-white/5 py-2 pr-3 text-white/85">{q.pair}</td>
                      <td className="border-b border-white/5 py-2 pr-3 text-white/75">{q.spread}</td>
                      <td className={`border-b border-white/5 py-2 pr-3 ${q.net.startsWith("+") ? "text-emerald-300" : "text-white/45"}`}>{q.net}</td>
                      <td className="border-b border-white/5 py-2">
                        <VerdictChip v={q.verdict} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Guardrail log */}
      <div className="border-t border-white/10 bg-black/40 p-5">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">GUARDRAIL LOG</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">cycle 4182</div>
        </div>
        <ol className="mt-4 space-y-1.5 font-mono text-[12px] leading-relaxed text-white/65">
          <li><span className="text-white/35 mr-3">01</span>Wash-quote check: 4 venues compared, no single-venue divergence above 0.3%.</li>
          <li><span className="text-white/35 mr-3">02</span>Stale-quote filter: oldest snapshot 4s, all paths within 8s window.</li>
          <li><span className="text-white/35 mr-3">03</span>Slippage model: applied 50 bps, edge survives.</li>
          <li><span className="text-white/35 mr-3">04</span>Capital cap: position $1,000 within MAX, no overflow.</li>
          <li><span className="text-white/35 mr-3">05</span>Confidence: 0.82, above the 0.70 threshold.</li>
          <li><span className="text-white/35 mr-3">06</span><span className="text-emerald-300">EXECUTE: ready. No blocking guards.</span></li>
        </ol>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-1 text-white">{value}</div>
    </div>
  );
}

function VerdictChip({ v }) {
  if (v === "EXECUTE") {
    return (
      <span className="inline-flex items-center rounded-sm border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-emerald-300">
        EXECUTE
      </span>
    );
  }
  if (v === "MONITOR") {
    return (
      <span className="inline-flex items-center rounded-sm border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-amber-300">
        MONITOR
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-sm border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white/55">
      SKIP
    </span>
  );
}
