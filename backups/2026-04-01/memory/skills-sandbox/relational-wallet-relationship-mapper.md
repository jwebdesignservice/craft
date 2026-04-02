---
name: wallet-relationship-mapper
description: Techniques and schemas for mapping relationships between wallets — detect insiders, track smart money, identify coordinated activity, and build entity graphs from on-chain data
type: relational
domain_tags: ["wallets", "on-chain", "analytics", "entities", "graph", "investigation"]
price_sol: 0.15
---

# Wallet Relationship Mapper — Relational Memory

## What This Gives You

The ability to look at a cluster of wallet addresses and determine: who's connected, who's funding whom, who's coordinating, and what entities they represent. This is the foundation of on-chain intelligence.

---

## Part 1: Relationship Types

### Direct Relationships (on-chain observable)

| Relationship | How to detect | Confidence |
|-------------|--------------|------------|
| **Funded by** | Wallet A sent SOL to Wallet B (first inbound tx) | HIGH |
| **Transfers to** | Regular token transfers between wallets | HIGH |
| **Shared program interaction** | Both wallets interact with same custom program | MEDIUM |
| **Same token profile** | Both hold same rare tokens in similar proportions | MEDIUM |
| **Temporal clustering** | Transactions from both wallets within same block or short window | MEDIUM-HIGH |
| **Same NFT collection holder** | Both wallets hold NFTs from same small collection | LOW-MEDIUM |

### Inferred Relationships (behavioural)

| Relationship | How to detect | Confidence |
|-------------|--------------|------------|
| **Same entity (sybil)** | Funded from same source, similar tx patterns, move in lockstep | MEDIUM-HIGH |
| **Insider ring** | Buys token before public announcement, connected to team wallet | HIGH (if pattern clear) |
| **Wash trading** | Circular token flow: A→B→C→A, often with NFTs | HIGH |
| **Bot cluster** | Identical tx patterns, sub-second timing, programmatic amounts | HIGH |
| **VC/fund** | Large early buys, vesting unlocks, multiple portfolio tokens held | MEDIUM |

---

## Part 2: Entity Resolution Schema

When you identify a cluster of related wallets, create an entity record:

```json
{
  "entity_id": "uuid",
  "label": "Suspected insider ring — Project X",
  "confidence": 0.85,
  "wallets": [
    {
      "address": "7Kx9...",
      "role": "primary",
      "first_seen": "2024-01-15",
      "funded_by": "3Yt2...",
      "total_volume_sol": 15420
    },
    {
      "address": "3Yt2...",
      "role": "funder",
      "first_seen": "2023-11-02",
      "funded_by": "CEX_withdrawal",
      "total_volume_sol": 89200
    }
  ],
  "relationships": [
    {
      "from": "3Yt2...",
      "to": "7Kx9...",
      "type": "funded_by",
      "first_tx": "sig_abc123",
      "amount_sol": 50,
      "timestamp": "2024-01-15T03:22:00Z"
    }
  ],
  "tags": ["insider", "project-x", "pre-launch-buyer"],
  "notes": "3Yt2 funded 7Kx9 three days before Project X token launch. 7Kx9 bought 2% of supply in first block."
}
```

---

## Part 3: Mapping Algorithms

### Algorithm 1: Funding Tree Expansion

Start from a known wallet. Trace all outbound SOL transfers. For each recipient, check if they subsequently interacted with the same tokens/programs.

```python
def build_funding_tree(root_wallet: str, depth: int = 3) -> dict:
    tree = {"address": root_wallet, "children": []}
    if depth == 0:
        return tree
    
    outbound_txs = get_sol_transfers_from(root_wallet)
    for tx in outbound_txs:
        recipient = tx['to']
        if is_program_or_system(recipient):
            continue  # skip program interactions
        child = build_funding_tree(recipient, depth - 1)
        child['funded_amount'] = tx['amount']
        child['funded_at'] = tx['timestamp']
        tree['children'].append(child)
    
    return tree
```

**Pruning rules:**
- Ignore transfers < 0.01 SOL (dust/rent)
- Ignore transfers to known programs (Jupiter, Raydium, etc.)
- Ignore CEX deposit addresses (they're shared)
- Stop expansion at depth 3 (beyond this, noise exceeds signal)

### Algorithm 2: Temporal Correlation

Find wallets that transact within narrow time windows on the same token.

```python
def find_correlated_wallets(token_mint: str, window_seconds: int = 30) -> list:
    all_swaps = get_swaps_for_token(token_mint, last_24h=True)
    clusters = []
    
    for i, swap_a in enumerate(all_swaps):
        cluster = [swap_a['wallet']]
        for swap_b in all_swaps[i+1:]:
            time_diff = abs(swap_b['timestamp'] - swap_a['timestamp'])
            if time_diff <= window_seconds:
                cluster.append(swap_b['wallet'])
            elif time_diff > window_seconds:
                break  # sorted by time, so no more matches
        
        if len(cluster) >= 3:  # 3+ wallets in same window = suspicious
            clusters.append({
                'wallets': list(set(cluster)),
                'timestamp': swap_a['timestamp'],
                'token': token_mint
            })
    
    return deduplicate_clusters(clusters)
```

### Algorithm 3: Token Holding Similarity

Wallets holding the same unusual combination of tokens are likely the same entity.

```python
def holding_similarity(wallet_a: str, wallet_b: str) -> float:
    tokens_a = set(get_token_mints(wallet_a))
    tokens_b = set(get_token_mints(wallet_b))
    
    # Weight rare tokens higher (fewer holders = more distinctive)
    intersection = tokens_a & tokens_b
    weighted_overlap = sum(1 / log(get_holder_count(t) + 1) for t in intersection)
    total = sum(1 / log(get_holder_count(t) + 1) for t in tokens_a | tokens_b)
    
    return weighted_overlap / total if total > 0 else 0
```

Similarity > 0.6 with rare tokens = very likely same entity.

---

## Part 4: Investigation Playbooks

### Playbook A: "Is this token launch an insider job?"

1. Get the token mint address
2. Fetch first 50 buyers (by block time)
3. For each early buyer, trace funding source
4. If 3+ early buyers share a common funder → insider cluster
5. Check if common funder is connected to token deployer wallet
6. Cross-reference temporal patterns (all bought within same minute?)

**Verdict framework:**
- Common funder + same-block buys + connected to deployer = **Confirmed insider ring**
- Common funder + early buys + no deployer link = **Suspected coordination**
- No common funder + organic timing spread = **Likely clean launch**

### Playbook B: "Is this wallet smart money?"

1. Pull last 100 token trades for the wallet
2. Calculate hit rate: % of trades that were profitable within 7 days
3. Calculate timing score: average position in the buy queue (early = smart)
4. Check funding source: CEX withdrawal (privacy-seeking) or on-chain history?
5. Check if wallet is labelled on Nansen, Arkham, or DeBank

**Smart money criteria:**
- Hit rate > 60% over 50+ trades
- Average buy position: top 5% of buyers
- Consistent profit-taking (doesn't diamond-hand to zero)
- Portfolio concentrated in 5–15 tokens (conviction, not spray)

### Playbook C: "Map this project's insider network"

1. Start with the token deployer wallet
2. Expand funding tree (depth 3)
3. For each wallet in tree, check token holdings
4. Identify wallets that bought the project's token pre-launch or in first block
5. Map all inter-wallet transfers
6. Visualise as graph: deployer → funders → buyers → sellers

---

## Part 5: Data Sources for Wallet Analysis

| Source | What it provides | Access |
|--------|-----------------|--------|
| Solana RPC (`getSignaturesForAddress`) | Raw transaction history | Free (rate-limited) |
| Helius DAS API | Parsed transactions, token holdings | Free tier available |
| Birdeye API | Token holder lists, trade history | Free tier available |
| Nansen | Pre-labelled wallets (funds, exchanges, smart money) | Paid |
| Arkham Intelligence | Entity-wallet mapping, alerts | Free tier |
| SolanaFM | Transaction parsing, account inspection | Free |
| Flipside Crypto | SQL queries on Solana data | Free |
| Dune Analytics | SQL queries (limited Solana) | Free tier |

---

## Part 6: Privacy and Ethics

**This knowledge is dual-use.** It can protect users from scams AND it can be used to stalk or dox people.

**Ethical guidelines:**
- Use wallet mapping to protect users (identify scams, insider trading, rug pulls)
- Do NOT use it to identify individuals behind pseudonymous wallets unless investigating fraud
- Do NOT share wallet-entity mappings publicly without strong justification
- Aggregate patterns are fine; individual targeting is not
- When in doubt: "Would I be comfortable if this analysis were done on my wallets?"
