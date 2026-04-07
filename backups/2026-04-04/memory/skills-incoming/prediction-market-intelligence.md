---
name: prediction-market-intelligence
description: Complete knowledge for AI agents to interact with Polymarket prediction markets. Covers browsing markets, placing limit and market orders, managing positions, order book analysis, price history, CTF token operations (split/merge/redeem), on-chain portfolio data, leaderboards, and scripting with JSON output. Use when an agent needs to trade prediction markets, research market sentiment, monitor positions, or automate Polymarket strategies.
type: procedural
domain_tags: ["prediction-markets", "polymarket", "trading", "clob", "orders", "defi", "polygon", "usdc"]
price_sol: 0.18
source: "polymarket-cli by Polymarket (MIT License) — https://github.com/Polymarket/polymarket-cli"
---

# Prediction Market Intelligence

Full control of Polymarket prediction markets from any AI agent. Browse, research, trade, and monitor — no browser needed.

---

## Install

```bash
# macOS / Linux
brew tap Polymarket/polymarket-cli https://github.com/Polymarket/polymarket-cli
brew install polymarket

# Shell script
curl -sSL https://raw.githubusercontent.com/Polymarket/polymarket-cli/main/install.sh | sh
```

---

## Quick Start (no wallet needed)

```bash
polymarket markets list --limit 5
polymarket markets search "bitcoin"
polymarket events list --tag politics
polymarket markets get will-trump-win-the-2024-election
polymarket -o json markets list --limit 3   # JSON for scripts
```

---

## Wallet Setup

```bash
polymarket wallet create              # Generate new wallet
polymarket wallet import 0xKEY...     # Import existing
polymarket approve set                # Approve USDC + CTF contracts (needs MATIC for gas)
```

Config: `~/.config/polymarket/config.json`
```json
{ "private_key": "0x...", "chain_id": 137, "signature_type": "proxy" }
```

Or via env: `POLYMARKET_PRIVATE_KEY=0x...`

---

## Market Research

```bash
# Browse
polymarket markets list --active true --order volume_num --limit 10
polymarket markets search "election" --limit 5
polymarket markets get <slug-or-id>
polymarket events list --tag politics --active true

# Order book & prices (no wallet needed)
polymarket clob book <token_id>
polymarket clob price <token_id> --side buy
polymarket clob midpoint <token_id>
polymarket clob spread <token_id>
polymarket clob price-history <token_id> --interval 1d --fidelity 30

# Batch queries
polymarket clob batch-prices "TOKEN1,TOKEN2" --side buy
polymarket clob midpoints "TOKEN1,TOKEN2"
```

**Price history intervals:** `1m` `1h` `6h` `1d` `1w` `max`

---

## Trading

```bash
# Limit order (buy 10 shares at $0.50)
polymarket clob create-order \
  --token <token_id> \
  --side buy --price 0.50 --size 10

# Market order (buy $5 worth)
polymarket clob market-order \
  --token <token_id> \
  --side buy --amount 5

# Post multiple orders
polymarket clob post-orders \
  --tokens "TOKEN1,TOKEN2" \
  --side buy \
  --prices "0.40,0.60" \
  --sizes "10,10"

# Cancel
polymarket clob cancel <ORDER_ID>
polymarket clob cancel-all

# Check balance
polymarket clob balance --asset-type collateral
polymarket clob orders
polymarket clob trades
```

**Order types:** `GTC` (default) | `FOK` | `GTD` | `FAK` | `--post-only`

---

## Portfolio Monitoring

```bash
# On-chain data (no wallet needed)
polymarket data positions 0xWALLET
polymarket data value 0xWALLET
polymarket data trades 0xWALLET --limit 50
polymarket data activity 0xWALLET
polymarket data closed-positions 0xWALLET

# Leaderboards
polymarket data leaderboard --period month --order-by pnl --limit 10

# Market data
polymarket data holders 0xCONDITION_ID
polymarket data open-interest 0xCONDITION_ID
```

---

## CTF Token Operations (Advanced)

```bash
# Split $10 USDC into YES/NO tokens
polymarket ctf split --condition 0xCONDITION --amount 10

# Merge tokens back to USDC
polymarket ctf merge --condition 0xCONDITION --amount 10

# Redeem winning tokens after market resolves
polymarket ctf redeem --condition 0xCONDITION
```

Requires MATIC for gas on Polygon.

---

## Scripting (JSON Output)

```bash
# Pipe to jq
polymarket -o json markets list --limit 100 | jq '.[].question'
polymarket -o json clob midpoint TOKEN_ID | jq '.mid'

# Error handling
if ! result=$(polymarket -o json clob balance --asset-type collateral 2>/dev/null); then
  echo "Failed to fetch balance"
fi
```

---

## Common Agent Workflows

### Research a market before trading
```bash
polymarket markets get <slug>
polymarket clob book <token_id>
polymarket clob price-history <token_id> --interval 1h
polymarket -o json data open-interest <condition_id> | jq .
```

### Auto-monitor positions
```bash
polymarket data positions 0xWALLET
polymarket clob orders
polymarket data value 0xWALLET
```

### Arbitrage scan
```bash
polymarket -o json clob midpoints "TOKEN1,TOKEN2,TOKEN3" | jq '.[] | select(.mid < 0.5)'
```

---

## Bridge (Cross-chain Deposit)

```bash
polymarket bridge deposit 0xWALLET        # Get deposit addresses (EVM, Solana, Bitcoin)
polymarket bridge supported-assets         # List chains + tokens
polymarket bridge status 0xDEPOSIT        # Check deposit status
```
