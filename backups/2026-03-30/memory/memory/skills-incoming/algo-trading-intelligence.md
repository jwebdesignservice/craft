---
name: algo-trading-intelligence
description: Complete knowledge for AI agents to deploy and operate institutional-grade algorithmic trading infrastructure using Hummingbot. Covers deploying the trading API server, running automated market-making and liquidity provision strategies on CEXs and DEXs, CLMM pool exploration on Meteora (Solana), LP position deployment, monitoring, and performance analysis. Use when an agent needs to run HFT bots, provide liquidity, automate trading across exchanges, or manage concentrated liquidity positions.
type: procedural
domain_tags: ["algo-trading", "hft", "market-making", "liquidity", "meteora", "solana", "defi", "hummingbot", "clmm", "dex", "cex"]
price_sol: 0.22
source: "Hummingbot by Hummingbot Foundation (Apache-2.0) — https://github.com/hummingbot/hummingbot | Skills: https://github.com/hummingbot/skills"
---

# Algo Trading Intelligence

Deploy and operate automated trading infrastructure. Market-making, liquidity provision, and HFT strategies across CEXs and DEXs — fully autonomous.

---

## Architecture

```
Hummingbot API        ? REST API server, orchestrates bots
Hummingbot MCP        ? MCP server for AI agent integration (optional)
Condor                ? Telegram/terminal UI (optional)
Gateway               ? DEX/on-chain connector (required for LP)
```

---

## Deploy Trading Infrastructure

### 1. Check environment
```bash
bash <(curl -s https://raw.githubusercontent.com/hummingbot/skills/main/skills/hummingbot-deploy/scripts/check_env.sh)
# Checks: Docker, Docker Compose, Git, Make, TTY
```

### 2. Install Hummingbot API
```bash
git clone https://github.com/hummingbot/hummingbot-api.git ~/hummingbot-api
cd ~/hummingbot-api
make setup    # Prompts: username, password, config password (defaults: admin/admin/admin)
make deploy
sleep 2 && docker logs hummingbot-api 2>&1 | grep -i "uvicorn running"
```

API runs at: `http://localhost:8000`
Docs at: `http://localhost:8000/docs`

### Container/headless install
```bash
cat > .env << EOF
USERNAME=admin
PASSWORD=admin
CONFIG_PASSWORD=admin
DEBUG_MODE=false
BROKER_HOST=hummingbot-broker
BROKER_PORT=1883
BROKER_USERNAME=admin
BROKER_PASSWORD=password
DATABASE_URL=postgresql+asyncpg://hbot:hummingbot-api@hummingbot-postgres:5432/hummingbot_api
BOTS_PATH=/hummingbot-api/bots
EOF
make deploy
```

### 3. Configure credentials (.env)
```bash
API_URL=http://localhost:8000
API_USER=admin
API_PASS=admin
```

### 4. Install MCP Server (for AI agent access)
```bash
git clone https://github.com/hummingbot/mcp.git ~/hummingbot-mcp
cd ~/hummingbot-mcp && make setup && make deploy
```

---

## LP Agent — Meteora CLMM Pools (Solana)

### Prerequisites
```bash
bash <(curl -s https://raw.githubusercontent.com/hummingbot/skills/main/skills/lp-agent/scripts/check_prerequisites.sh)

# Start Gateway (required for on-chain operations)
python scripts/manage_gateway.py start

# Set custom Solana RPC (avoid rate limits)
python scripts/manage_gateway.py network solana-mainnet-beta --node-url https://your-rpc.com
```

### Explore Pools
```bash
# Top pools by 24h volume
python scripts/list_meteora_pools.py

# Search by token
python scripts/list_meteora_pools.py --query SOL
python scripts/list_meteora_pools.py --query SOL-USDC

# Sort by metric
python scripts/list_meteora_pools.py --query SOL --sort apr
python scripts/list_meteora_pools.py --query SOL --sort tvl
python scripts/list_meteora_pools.py --query SOL --sort fees

# Pool details (real-time + historical)
python scripts/get_meteora_pool.py <pool_address>
python scripts/get_meteora_pool.py <pool_address> --json
```

**Output columns:** Pool, TVL, Vol 24h, Fees 24h, APR, Fee %, Bin Step

### LP Strategies

**LP Executor** — Range-based liquidity provision
- Set price range, deposit tokens, collect fees
- Best for: stable pairs, low volatility pools

**Rebalancer Controller** — Dynamic range management
- Automatically rebalances when price moves out of range
- Best for: volatile pairs, active management

### Deploy LP Position
```bash
# Via Hummingbot API (once running)
# POST /api/v1/accounts/{account_id}/bots
# Body: strategy config with pool address, range, amounts
```

### Monitor Performance
```bash
python scripts/visualize_performance.py <bot_id>
```

---

## Trading Strategies Available

Hummingbot ships with 50+ strategies:

**Market Making:**
- `pure_market_making` — Place bid/ask around mid price
- `cross_exchange_market_making` — Hedge on another exchange
- `avellaneda_market_making` — Inventory-aware MM with optimal spread

**Arbitrage:**
- `arbitrage` — Cross-exchange spot arb
- `amm_arb` — DEX/CEX arbitrage via AMM

**Liquidity Provision:**
- `lp_v2` — Uniswap V3 style CLMM LP
- Meteora DLMM LP (via lp-agent skill)

**Trend / Grid:**
- `twap` — Time-weighted average price execution
- `grid_strategy` — Grid trading with configurable levels

---

## Key API Endpoints

```bash
# Health
GET  /health

# Accounts (exchange credentials)
POST /api/v1/accounts
GET  /api/v1/accounts

# Bots
POST   /api/v1/accounts/{id}/bots          # Deploy bot
GET    /api/v1/accounts/{id}/bots          # List bots
DELETE /api/v1/accounts/{id}/bots/{bot_id} # Stop bot

# Market data
GET /api/v1/market-data/prices
GET /api/v1/market-data/order-book
```

---

## Supported Exchanges

**CEX (100+):** Binance, Coinbase, OKX, Bybit, Kraken, KuCoin, Gate.io, HTX, MEXC, and more

**DEX:** Uniswap V3, Pancakeswap, Raydium, Meteora, dYdX, Drift, and more

---

## Common Agent Workflows

### Deploy a market-making bot
```bash
# 1. Add exchange credentials
curl -X POST http://localhost:8000/api/v1/accounts \
  -H "Content-Type: application/json" \
  -d '{"name": "binance", "credentials": {"api_key": "...", "secret_key": "..."}}'

# 2. Deploy pure market making strategy
curl -X POST http://localhost:8000/api/v1/accounts/{id}/bots \
  -H "Content-Type: application/json" \
  -d '{"strategy": "pure_market_making", "config": {"trading_pair": "BTC-USDT", "bid_spread": 0.001, "ask_spread": 0.001}}'
```

### Find best Meteora LP opportunity
```bash
python scripts/list_meteora_pools.py --sort apr --limit 20
python scripts/get_meteora_pool.py <top_pool_address>
# Analyse bin distribution, deploy LP position
```

### Monitor all bots
```bash
curl http://localhost:8000/api/v1/accounts/{id}/bots
```
