---
name: solana-portfolio-intelligence
description: Complete knowledge for AI agents to autonomously manage Solana portfolios via the &milo API. Covers SIWX wallet auth, auto-trading activation, order creation (buy/sell + TP/SL ladders), position management, AI market analysis conversations, strategy creation and arena deployment, quest tracking, and token transfers. Solana-native with Jupiter/Dflow execution. Use when an agent needs to trade, manage risk, analyze markets, or operate a portfolio on Solana without human intervention.
type: procedural
domain_tags: ["solana", "defi", "trading", "portfolio", "auto-trade", "agent-to-agent", "orders", "positions", "on-chain"]
price_sol: 0.25
source: "&milo by andmilo.com (MIT License) — https://github.com/and-milo/agent-to-agent-portfolio-manager"
---

# Solana Portfolio Intelligence

Autonomous Solana portfolio management for AI agents. No human in the loop.

**Base URL:** `https://partners.andmilo.com`
**Auth:** `X-API-Key: <api_key>` on all authenticated requests (NOT Bearer)

---

## Onboarding (4 Steps)

### Step 1 — Get SIWX message to sign
```bash
curl -X POST https://partners.andmilo.com/api/v1/users/siwx/message \
  -H "Content-Type: application/json" \
  -d '{"accountAddress": "<wallet>", "chainId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"}'
# Returns: { data: { data: {...}, message: "<string-to-sign>" } }
```

### Step 2 — Sign + Register
Sign the `message` string (UTF-8 bytes) with ed25519 private key, base58-encode the signature.
```bash
curl -X POST https://partners.andmilo.com/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"signupWallet": "<wallet>", "siwx": {"data": <data-from-step-1>, "message": "<msg>", "signature": "<sig>"}}'
# Returns: apiKey, user.id, wallets[]
# Save to ~/.milo/config.json
```

### Step 3 — Deposit SOL
Send SOL to `wallets[1].address` (the `type: "milo"` wallet).

### Step 4 — Activate Auto-Trading
```bash
curl -X PATCH https://partners.andmilo.com/api/v1/users/{userId}/auto-trade-settings \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"isActive": true, "riskTolerance": "balanced", "strategy": "SWING TRADER"}'
```

Auto-trader starts scanning within ~30 minutes.

---

## Auto-Trade Settings

```bash
# Get settings
GET /api/v1/users/{userId}/auto-trade-settings

# Update
PATCH /api/v1/users/{userId}/auto-trade-settings
```

Key fields:
| Field | Values |
|-------|--------|
| `riskTolerance` | `conservative`, `balanced`, `degen` |
| `strategy` | `VALUE INVESTOR`, `SWING TRADER`, `SCALPER`, `CUSTOM` |
| `instructions` | Free-text trading instructions |
| `customTickers` | `["SOL", "JUP", "BONK"]` |
| `isActive` | `true` / `false` |

Asset classes for allocation: `trenches`, `memes`, `promising-memes`, `staking`, `native`, `majors`, `stables`, `xStocks`, `custom`

---

## Orders (Buy / Sell + TP/SL)

```bash
POST /api/v1/wallets/{walletId}/orders
```

```json
{
  "tokenAddress": "So11111111111111111111111111111111111111112",
  "type": "buy",
  "status": "active",
  "payload": {
    "type": "buy",
    "amount": { "type": "absolute_usd", "amount": 50 },
    "trigger": { "type": "absolute", "trigger": "price", "operator": "gte", "value": 0 },
    "execution": {}
  },
  "takeProfits": [
    { "percentage": 50, "profitPercentage": 20 },
    { "percentage": 50, "profitPercentage": 50 }
  ],
  "stopLosses": [
    { "percentage": 100, "lossPercentage": 15 }
  ]
}
```

**Amount types:**
- `{ "type": "absolute_usd", "amount": 50 }` — $50 USD
- `{ "type": "absolute", "amount": 1000000 }` — raw token amount
- `{ "type": "relative", "percentage": 50 }` — 50% of position (sell only)

**Trigger types:**
- Market: `{ "type": "absolute", "trigger": "price", "operator": "gte", "value": 0 }`
- Limit: `{ "type": "absolute", "trigger": "price", "operator": "lte", "value": 150.00 }`
- Stop: `{ "type": "relative", "trigger": "price", "operator": "drop", "value": 10 }` (10% drop)
- TP: `{ "type": "relative", "trigger": "price", "operator": "rise", "value": 25 }` (25% rise)

```bash
# Manage orders
GET    /api/v1/users/{userId}/orders?status=active
GET    /api/v1/users/{userId}/orders/{orderId}
POST   /api/v1/users/{userId}/orders/{orderId}/pause
POST   /api/v1/users/{userId}/orders/{orderId}/activate
DELETE /api/v1/users/{userId}/orders/{orderId}
```

---

## AI Conversations (Async — must poll)

```bash
# Start conversation
POST /api/v1/users/{userId}/conversations
{ "message": "What's trending on Solana?", "agentType": "market-analyst" }
# Returns conversationId

# Poll every 2-3s until processing: false
GET /api/v1/users/{userId}/conversations/{conversationId}/messages

# Continue conversation
POST /api/v1/users/{userId}/conversations/{conversationId}/messages
{ "message": "Compare JUP vs BONK for a DePIN play" }
```

Agent types: `market-analyst` | `auto-trader` | `milo-game-agent`

Free tier: 2 writes/60s. Over limit ? 402 ? pay `0.25 USDC` or `0.01 SOL` to `TREASURY_WALLET` with `X-PAYMENT` header.

---

## Portfolio

```bash
GET /api/v1/wallets/{walletId}/holdings                    # Token balances + USD
GET /api/v1/wallets/{walletId}/transactions                # All transactions
GET /api/v1/wallets/{walletId}/executed-transactions       # Order-linked trades (cursor pagination)
GET /api/v1/users/{userId}/positions?status=active         # Positions + PnL
GET /api/v1/users/{userId}/diary-logs                      # Auto-trade diary

POST /api/v1/users/{userId}/positions/{thesisId}/close     # Close one position
POST /api/v1/users/{userId}/positions/close-all            # Close all positions
```

---

## Strategies

```bash
# Create
POST /api/v1/users/{userId}/auto-trade-settings/strategies
{ "name": "SOL DCA", "strategy": "SWING TRADER", "allocation": {"majors": 45, "native": 25}, "isPublic": false }

# Link to settings
PATCH /api/v1/users/{userId}/auto-trade-settings
{ "strategyId": "<uuid>", "isActive": true }

# Sync when strategy updates (check strategySync.synced in settings response)
POST /api/v1/users/{userId}/auto-trade-settings/strategies/{strategyId}/sync
```

---

## Arena (Public Strategy Competition)

```bash
# Deploy public strategy to leaderboard
POST /api/v1/users/{userId}/arena/deploy
{ "strategyId": "<uuid>" }   # Must be public + owned

# Withdraw holdings back
POST /api/v1/users/{userId}/arena/withdraw
{ "strategyId": "<uuid>" }

# Leaderboard
GET /api/v1/users/{userId}/arena/leaderboard?timeframe=30d&sortKey=pnl&sortDirection=desc
```

---

## Token Transfers

```bash
POST /api/v1/wallets/{walletId}/actions/send
{ "recipient": "<address>", "token": "<mint>", "amount": 1.5 }
# SOL mint: So11111111111111111111111111111111111111112
```

---

## Quests & Bones

```bash
GET  /api/v1/users/{userId}/quests?unclaimed=true    # Find completable quests
POST /api/v1/users/{userId}/quests/{questId}/claim   # Claim bones
GET  /api/v1/users/{userId}/quests/bones             # Bones balance
```

---

## Heartbeat Protocol

Run every 4+ hours: check positions ? check quests ? talk to auto-trader.
Full protocol: `https://partners.andmilo.com/heartbeat.md`

---

## Key Rate Limits

| Action | Limit |
|--------|-------|
| Portfolio reads | 60/min |
| Conversations write | 2 free/min then paid |
| Orders create | 5/min |
| Wallet send | 10/min |
| Arena deploy/withdraw | 5/min |

429 ? check `Retry-After` header. 402 ? pay overage.
