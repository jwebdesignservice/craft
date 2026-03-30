---
name: crypto-market-knowledge
description: Structured market mechanics knowledge covering crypto cycles, on-chain analytics, liquidity dynamics, and trading psychology — gives an agent real market intelligence
type: semantic
domain_tags: ["crypto", "markets", "trading", "on-chain", "cycles", "defi", "analytics"]
price_sol: 0.18
---

# Crypto Market Knowledge — Semantic Memory

## What This Gives You

Market intelligence that goes beyond price. An agent loaded with this understands *why* markets move, how to read on-chain signals, the mechanics of liquidity, and the psychological traps that destroy portfolios. No generic advice — actionable mental models grounded in how crypto actually works.

---

## Part 1: Market Structure

### 1.1 Crypto Market Cycles

Crypto markets follow identifiable macro cycles driven by Bitcoin halving, liquidity conditions, and narrative rotation.

**Four-Year Cycle (approximate):**
```
Year 1: Accumulation (post-crash lows, low interest, insiders accumulate)
Year 2: Recovery (halving occurs, narrative builds, retail returns)
Year 3: Bull market (parabolic moves, all-time highs, peak euphoria)
Year 4: Bear market (80–90% drawdowns, capitulation, projects die)
```

**Halving mechanics:** Bitcoin's block reward cuts in half ~every 210,000 blocks (~4 years). Supply issuance drops. If demand stays constant or grows, price pressure is upward. Historical post-halving peaks: ~12–18 months after the halving.

**Important:** Cycles are getting less clean as crypto matures and correlates more with macro liquidity (Fed rate cycles). 2024–2025 cycle shows weaker altcoin performance relative to BTC vs. 2020–2021.

---

### 1.2 Bitcoin Dominance as a Signal

**BTC.D (Bitcoin Dominance):** BTC market cap as % of total crypto market cap.

| BTC.D level | Market signal |
|-------------|--------------|
| Rising (>55%) | Risk-off. Capital rotating from alts to BTC. Bear or early bull. |
| Falling (<45%) | Risk-on. Capital flowing into alts. Classic "altseason". |
| 45–55% | Transition zone. Watch direction, not level. |

**Altseason trigger:** When BTC.D falls below ~45% AND BTC price is rising = both can win. When BTC.D falls because BTC price is falling, that's not altseason — that's capital fleeing crypto entirely.

---

### 1.3 Market Cap Categories

| Tier | Market Cap | Characteristics |
|------|-----------|----------------|
| Mega cap | >$50B | BTC, ETH. Correlated with macro. Lower volatility (relative). |
| Large cap | $5B–$50B | SOL, BNB, XRP. Liquid, tracked by institutions. |
| Mid cap | $500M–$5B | Most top-50 alts. High volatility. Narrative-driven. |
| Small cap | $50M–$500M | Higher risk/reward. Thin liquidity. |
| Micro cap | <$50M | Highly speculative. Easily manipulated. Most fail. |

**For Solana ecosystem tokens specifically:** Most are mid-to-small cap. Liquidity pools on Raydium/Orca are 10–100x thinner than CEX pairs. A $500k buy can move price 5–20%.

---

## Part 2: On-Chain Analytics

### 2.1 Key On-Chain Metrics and What They Tell You

**Exchange Reserves (BTC/ETH/SOL)**
- Rising exchange reserves = coins moving to exchanges = preparing to sell = bearish
- Falling exchange reserves = coins leaving exchanges = going to cold storage = bullish (HODLing)
- Source: Glassnode, CryptoQuant, Nansen

**SOPR (Spent Output Profit Ratio)**
- SOPR > 1: Average holder is selling at profit
- SOPR < 1: Average holder is selling at loss (capitulation signal)
- SOPR reset: When SOPR drops to 1 and bounces, strong support confirmed

**Active Addresses (daily)**
- Rising active addresses + rising price = organic growth
- Rising price + flat addresses = speculative pump, not broad adoption
- Falling addresses during price rise = warning sign

**DEX Volume (Solana-specific)**
- Jupiter swap volume is a proxy for Solana retail activity
- Spike in DEX volume without price movement = accumulation or distribution
- Check: https://defillama.com/chain/Solana (volume tab)

**Whale Alerts**
- Large wallet movements (>$1M) tracked by Lookonchain, Whale Alert
- Follow known institutional and VC wallets on Nansen or Arkham

---

### 2.2 Wallet Behaviour Classification

| Behaviour | Interpretation |
|-----------|---------------|
| Accumulating (small consistent buys, never sells) | Long-term holder, bullish signal |
| Distribution (large sells into pumps) | Smart money exiting |
| Bot/arbitrage (100s of small txs, symmetric buys/sells) | MEV or arb bot, neutral signal |
| Rug setup (concentrated token distribution in 1–3 wallets) | High rug risk |
| Insider (buys token before announcement, then sells after) | Front-running / insider trading |

---

### 2.3 Liquidity Analysis (DeFi)

**Total Value Locked (TVL)**
- Rising TVL + rising price = real capital inflow, sustainable
- Rising TVL + falling price = dumps are happening despite inflows (bearish)
- Falling TVL + rising price = price rising on thin liquidity (fragile)

**Liquidity Depth**
For any Solana token, check Birdeye or GeckoTerminal:
- "2% depth" = how much you can buy/sell before moving price 2%
- If $10k moves the price 2%, it's a very thin market
- Good liquidity: at least $100k depth on each side for a $1M mcap token

**Impermanent Loss (for LPs):**
```
IL = 2 * sqrt(price_ratio) / (1 + price_ratio) - 1

If token goes 4x vs your paired asset:
IL = 2 * sqrt(4) / (1 + 4) - 1 = 2*2/5 - 1 = -0.2 = -20% vs holding
```
At 4x move, you've lost 20% relative to just holding. Fee income must exceed this to make LP profitable.

---

## Part 3: Market Psychology Frameworks

### 3.1 The Stages of a Pump

1. **Stealth phase:** Insiders accumulate. Price flat. Low volume.
2. **Awareness phase:** First articles/tweets. Small price movement. Retail notices.
3. **Mania phase:** Rapid price increase. FOMO kicks in. Everyone talking about it.
4. **Blow-off top:** Vertical price action, massive volume. This is when insiders sell.
5. **Denial:** "It's just a correction." Price 20–40% off peak.
6. **Capitulation:** Retail throws in the towel. Price 70–90% off peak.
7. **Despair:** No one talks about it anymore. Actually the best buy zone.

**Actionable rule:** If you first heard about a token during stage 3, you are retail in this trade. Size accordingly.

---

### 3.2 Common Cognitive Biases in Crypto

**Sunk cost fallacy:** "I'm already down 60%, might as well hold." Loss of 60% requires a 150% gain just to break even. Evaluate the asset on its current merits, not your entry price.

**Recency bias:** Assuming the last 6 months will continue. Bull markets feel permanent until they're not. Bear markets feel permanent until they're not.

**Narrative anchoring:** Believing a project's old narrative despite changed fundamentals. Check: is the team still building? Is there real usage?

**Confirmation bias:** Only reading bullish takes on your holdings. Actively seek the best bear case for anything you own.

**Herding:** "Everyone is buying, so I should too." Everyone buying is often the top signal, not the start.

---

### 3.3 Position Sizing Framework

**Kelly Criterion (simplified for crypto):**
```
Bet size = (Win probability * Win multiple - Loss probability) / Win multiple

Example: 60% chance of 3x, 40% chance of total loss
= (0.6 * 3 - 0.4) / 3 = (1.8 - 0.4) / 3 = 1.4/3 = 46% of bankroll

Full Kelly is usually too aggressive. Use 25-33% Kelly (quarter Kelly).
```

**Practical tiers for a crypto portfolio:**

| Tier | Allocation | Asset types |
|------|-----------|-------------|
| Core | 50–60% | BTC, ETH, SOL |
| Established alts | 20–30% | Large/mid cap with real usage |
| Speculation | 5–15% | Small caps, new launches |
| NFTs/experimental | 0–5% | Treat as fun money, not investment |

---

## Part 4: Market Mechanics Reference

### Funding Rates (Perpetual Futures)
Funding rate is paid between long and short holders every 8 hours.
- **Positive funding:** Longs pay shorts. Market is bullish/overleveraged long. Counter-signal: crowded trade.
- **Negative funding:** Shorts pay longs. Market is bearish/overleveraged short. Can be a bottom signal.
- Extreme funding (>0.1%/8hr or <-0.05%/8hr) often precedes sharp reversals.

### Liquidation Cascades
When leveraged positions are liquidated, it creates market orders that move price further in the liquidation direction, triggering more liquidations.
- **Long liquidation cascade:** Price drops → longs liquidated → more selling → price drops more.
- **Check:** CoinGlass shows liquidation heatmaps — clusters of liquidations act as magnets.

### Basis Trade (Cash and Carry)
Buying spot asset + shorting same asset perpetual futures.
- Profit = funding rate collected (if positive) + basis convergence at expiry
- Risk-free when done with same asset. Used by institutions to earn yield without directional exposure.
- When basis trade unwinds (rates go negative), can cause spot sell pressure.

---

## Part 5: Key Data Sources

| Source | Best for |
|--------|---------|
| CoinGecko | Token prices, market caps, exchanges |
| DeFiLlama | TVL, protocol revenue, chain comparisons |
| Glassnode | BTC/ETH on-chain analytics |
| Nansen | Wallet labelling, smart money tracking |
| Arkham | Wallet investigation, entity mapping |
| Lookonchain | Real-time whale tracking |
| CoinGlass | Liquidation data, funding rates, open interest |
| Birdeye | Solana token analytics, holder distribution |
| GeckoTerminal | DEX pool analytics, any chain |
| Token Terminal | Protocol fundamentals (revenue, fees, users) |
