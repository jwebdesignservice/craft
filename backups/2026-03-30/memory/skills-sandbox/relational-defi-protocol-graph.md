---
name: defi-protocol-graph
description: A structured relationship map of Solana DeFi protocols — how they connect, compose, and depend on each other — so agents can reason about cross-protocol risk and opportunity
type: relational
domain_tags: ["defi", "solana", "protocols", "composability", "risk", "graph"]
price_sol: 0.12
---

# DeFi Protocol Graph — Relational Memory

## What This Gives You

A knowledge graph of how Solana DeFi protocols connect. Load this and your agent understands which protocols depend on which, where risk cascades, which composability paths exist, and how to route users through multi-protocol strategies without breaking things.

---

## Core Protocol Nodes

### Liquidity Layer (DEXes)
```
Jupiter ─── aggregates ──→ Raydium
         ├─ aggregates ──→ Orca
         ├─ aggregates ──→ Meteora
         ├─ aggregates ──→ Phoenix (orderbook DEX)
         ├─ aggregates ──→ Lifinity
         └─ aggregates ──→ OpenBook (on-chain orderbook)

Raydium ─── uses orderbook ──→ OpenBook
Meteora ─── DLMM pools ──→ independent liquidity
Orca ────── Whirlpools ──→ independent CLMM liquidity
```

### Lending Layer
```
Kamino ──── borrows from ──→ Kamino Lend (own lending market)
       ├── LP positions from ──→ Orca Whirlpools
       ├── LP positions from ──→ Raydium CLMM
       └── LP positions from ──→ Meteora DLMM

MarginFi ── independent lending pools
         ├── accepts collateral ──→ SOL, mSOL, JitoSOL, USDC, USDT
         └── flash loans available

Solend/Save ── legacy lending
            └── accepts collateral ──→ SOL, mSOL, USDC
```

### Liquid Staking Layer
```
Marinade ──→ mSOL ──→ accepted as collateral by ──→ Kamino, MarginFi, Solend
Jito ──────→ JitoSOL ──→ accepted as collateral by ──→ Kamino, MarginFi
Sanctum ───→ INF (infinite LST) ──→ liquidity layer for all LSTs
         ├── wraps ──→ mSOL, JitoSOL, bSOL, and 50+ validator LSTs
         └── enables ──→ LST-to-LST swaps without unwinding stake
```

### Stablecoin Layer
```
USDC (Circle) ──→ primary stablecoin on Solana
              ──→ base pair on Jupiter, Raydium, Orca
USDT (Tether) ──→ secondary, less DeFi integration
UXD ───────────→ algo-stable (delta-neutral), lower adoption
PYUSD (PayPal) ─→ growing adoption, institutional bridge
```

---

## Dependency Graph (Critical Paths)

### What breaks if Jupiter goes down?
- **Impact:** HIGH. Most swaps route through Jupiter. Retail loses best-price routing.
- **Fallback:** Direct pool swaps on Raydium/Orca still work. Worse pricing.
- **Cascade:** Any protocol that auto-swaps via Jupiter (Kamino rebalancing, margin calls) would need manual intervention.

### What breaks if Marinade depegs?
- **Impact:** CRITICAL. mSOL is used as collateral across lending markets.
- **Cascade:** Kamino and MarginFi positions backed by mSOL become undercollateralised → liquidation cascade → forced mSOL selling → deeper depeg.
- **Historical parallel:** stETH depeg (ETH, June 2022) caused 3AC collapse.

### What breaks if USDC depegs?
- **Impact:** SYSTEMIC. Nearly all DeFi pricing anchors to USDC.
- **Cascade:** Every lending market, every LP position with USDC half, every perp contract with USDC margin.
- **Historical:** March 2023 USDC briefly hit $0.87 (SVB exposure). Solana DeFi TVL dropped 15% in hours.

### What breaks if Solana validators halt?
- **Impact:** TOTAL. All DeFi stops.
- **Recovery:** Validator restart procedure exists; historically recovered in 4–18 hours.
- **Mitigation:** Nothing — this is base-layer risk. Diversify across chains if this concerns you.

---

## Composability Paths (Multi-Protocol Strategies)

### Strategy 1: Leveraged Staking
```
SOL → Marinade (stake) → mSOL
mSOL → Kamino Lend (deposit as collateral)
Borrow SOL against mSOL → Marinade (stake again) → mSOL
Repeat (max 3 loops for ~3x leverage on staking yield)

Risk: mSOL depeg triggers liquidation of entire looped position.
Effective yield: ~7% × leverage factor, minus borrow rate
```

### Strategy 2: Delta-Neutral LP
```
SOL → Split 50/50
50% → Orca Whirlpool (SOL/USDC LP, earn fees)
50% → Jupiter Perps (short SOL, hedge price exposure)

Net: Earn LP fees + funding rate, no directional SOL exposure
Risk: Funding rate turns negative (you pay), or LP impermanent loss exceeds fees during volatility spike
```

### Strategy 3: LST Yield Stacking
```
SOL → Jito (stake) → JitoSOL (~7.5% APY from staking + MEV)
JitoSOL → Sanctum INF pool (earn swap fees when people convert LSTs)
Total yield: Staking APY + MEV + swap fees ≈ 8–10%
Risk: Smart contract risk across Jito + Sanctum
```

### Strategy 4: Stablecoin Yield
```
USDC → MarginFi (lend) → ~5–12% APY (variable)
Or: USDC → Kamino USDC/USDT vault → earn LP fees on stable pair
Risk: Smart contract exploit, stablecoin depeg, variable rate drops
```

---

## Risk Propagation Matrix

| Event | Directly affected | Secondary cascade | Severity |
|-------|-------------------|-------------------|----------|
| Jupiter exploit | All swap users | Protocols using Jupiter for rebalancing | HIGH |
| Marinade mSOL depeg | Marinade stakers | Kamino, MarginFi (collateral), Orca mSOL pools | CRITICAL |
| Kamino exploit | Kamino depositors | Orca/Raydium (LP withdrawals), lending market | HIGH |
| MarginFi bad debt | MarginFi lenders | Minimal cascade (isolated pools) | MEDIUM |
| Orca Whirlpool bug | Orca LPs | Jupiter routing degrades, Kamino vaults affected | HIGH |
| USDC depeg | Everyone | Total DeFi repricing, lending liquidation wave | CRITICAL |
| Solana congestion | All users | Failed txs, stuck liquidations, oracle lag | MEDIUM |

---

## Protocol Trust Scores (Heuristic)

Based on: audit status, TVL, track record, team, open-source, upgrade authority.

| Protocol | Trust | Reasoning |
|----------|-------|-----------|
| Jupiter | HIGH | Audited (OtterSec), $2B+ daily volume, strong team |
| Raydium | HIGH | Long track record, audited, core infra |
| Orca | HIGH | Audited, conservative engineering |
| Kamino | MED-HIGH | Newer but audited, growing TVL, complex (more surface area) |
| MarginFi | MED | Audited but had governance controversy (2024) |
| Marinade | HIGH | Audited, longest-running LST, transparent |
| Jito | HIGH | Audited, MEV infrastructure is core to Solana |
| Meteora | MED-HIGH | Growing fast, audited, newer code |
| Sanctum | MED | Novel mechanics, smaller track record |

---

## How to Use This Graph

1. **Before recommending a strategy:** Trace all protocol dependencies. If any node in the chain has trust < MED, flag it.
2. **On risk questions:** Walk the cascade path. "If X breaks, what happens to Y?"
3. **For yield comparisons:** Compare strategies by total risk surface area, not just headline APY.
4. **For portfolio construction:** Don't concentrate in protocols that share dependencies. mSOL collateral on Kamino + mSOL LP on Orca = correlated risk.
