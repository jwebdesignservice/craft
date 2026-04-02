# Skills Sandbox Report

**Generated:** 2026-02-26  
**Skills created:** 9 (3 Episodic, 3 Semantic, 3 Relational)  
**API tested:** ✅ Healthy  

---

## Episodic Skills

| Name | Description | Viability | Reasoning |
|------|------------|-----------|-----------|
| **conversation-logger** | Structured schema and tagging system for logging agent conversations as searchable, replayable memories | **HIGH** | Universal need — every agent that talks to users needs this. Low price point (0.03 SOL) means impulse buy. Schema + quality scoring is genuinely useful. |
| **session-replay** | Inject past sessions back into context to restore continuity across disconnected conversations | **HIGH** | Solves the #1 complaint about AI agents (amnesia). The retrieval algorithm and compression formats are immediately implementable. Differentiator for any agent. |
| **interaction-patterns** | Library of 20 battle-tested user behaviour patterns with detection rules and best responses | **HIGH** | Makes any agent immediately better at conversation. Pattern catalogue format is easy to consume. Crypto-specific patterns (FOMO, rug anxiety) add domain value. |

## Semantic Skills

| Name | Description | Viability | Reasoning |
|------|------------|-----------|-----------|
| **solana-ecosystem-knowledge** | Deep factual reference covering Solana architecture, DeFi protocols, token standards, NFTs, and key metrics | **HIGH** | The single most requested knowledge domain for Solana agents. Prevents hallucination about protocol specifics. Broad utility — every Solana-focused agent needs this. |
| **web3-security-knowledge** | Complete reference on attack vectors, scam patterns, red flags, and recovery procedures for Web3 | **HIGH** | Security knowledge has outsized value — prevents real financial losses. High willingness-to-pay. Drainer taxonomy and red flag checklist are genuinely protective. |
| **crypto-market-knowledge** | Market mechanics, on-chain analytics, cycle theory, psychology frameworks, and position sizing | **MED-HIGH** | Valuable but more opinionated than pure reference. Market data ages faster than protocol knowledge. Still strong — the psychology and analytics sections are evergreen. |

## Relational Skills

| Name | Description | Viability | Reasoning |
|------|------------|-----------|-----------|
| **defi-protocol-graph** | Structured relationship map of Solana DeFi protocols — dependencies, composability paths, cascade risks | **HIGH** | Unique offering — no one else is packaging protocol interdependency knowledge as agent memory. The risk propagation matrix alone is worth the price. |
| **wallet-relationship-mapper** | Techniques and schemas for mapping wallet-to-wallet relationships and detecting coordinated activity | **MED-HIGH** | Powerful but niche — most useful for investigation/analytics agents. The algorithms are solid but require RPC access to implement. Ethics section adds credibility. |
| **agent-social-graph** | Schema for mapping trust, delegation, and reputation between AI agents in multi-agent networks | **MED** | Forward-looking — agent-to-agent social graphs aren't mainstream yet. But as MemoryMarket grows, this becomes critical infrastructure. Good long-term bet. |

---

## API Test Results

| Endpoint | Status | Response |
|----------|--------|----------|
| `GET /health` | ✅ **200 OK** | `{"status":"healthy","env":"production","solana_rpc":"https://api.devnet.solana.com","database":"connected","ipfs":"connected"}` |
| `GET /memory/search?limit=2` | ✅ **200 OK** | Returned 2 memories (total: 6). Types: procedural, episodic. Prices: 0.50, 0.15 SOL. Quality scores: 0.92, 0.88. |

**Notes:**
- API is on Railway (production)
- Solana RPC pointing to devnet (expected for current phase)
- Database and IPFS both connected
- Search pagination working (offset/limit)

---

## Pricing Recommendations

| Type | Skill | Recommended Price | Rationale |
|------|-------|------------------|-----------|
| Episodic | conversation-logger | **0.03 SOL** | Entry-level tool, high volume potential |
| Episodic | session-replay | **0.04 SOL** | Slightly more complex, clear ROI for users |
| Episodic | interaction-patterns | **0.05 SOL** | Premium episodic — curated patterns, not raw logs |
| Semantic | solana-ecosystem-knowledge | **0.15 SOL** | Dense reference material, broad utility |
| Semantic | web3-security-knowledge | **0.20 SOL** | High-value protective knowledge, premium justified |
| Semantic | crypto-market-knowledge | **0.18 SOL** | Strong content but ages faster |
| Relational | defi-protocol-graph | **0.12 SOL** | Unique, actionable, moderate complexity |
| Relational | wallet-relationship-mapper | **0.15 SOL** | Technical depth, investigation value |
| Relational | agent-social-graph | **0.10 SOL** | Forward-looking, lower immediate demand |

**Pricing philosophy:** Stay at the low end of each category's range to drive volume and marketplace activity. Better to sell 100 at 0.15 SOL than 5 at 0.50 SOL at this stage.

---

## Top 3 to Ship First

### 1. 🥇 `solana-ecosystem-knowledge` (Semantic, 0.15 SOL)
**Why first:** Broadest appeal. Every Solana agent needs ground-truth protocol knowledge. Demonstrates the marketplace's value proposition clearly. Easy to market: "Stop your agent from hallucinating about Solana."

### 2. 🥈 `web3-security-knowledge` (Semantic, 0.20 SOL)
**Why second:** Highest perceived value. Security knowledge prevents real financial losses. Easy narrative: "Your agent just saved you from a rug pull." Premium pricing justified. Great for press/marketing.

### 3. 🥉 `interaction-patterns` (Episodic, 0.05 SOL)
**Why third:** Low price point, easy impulse buy. Immediately makes any conversational agent better. Good showcase of the episodic memory type. Different enough from semantic skills to demonstrate marketplace breadth.

---

## Files Created

```
memory/skills-sandbox/
├── episodic-conversation-logger.md     (4.9 KB)
├── episodic-session-replay.md          (6.0 KB)
├── episodic-interaction-patterns.md    (8.4 KB)
├── semantic-solana-ecosystem-knowledge.md (7.1 KB)
├── semantic-web3-security-knowledge.md    (8.6 KB)
├── semantic-crypto-market-knowledge.md    (9.5 KB)
├── relational-defi-protocol-graph.md      (6.8 KB)
├── relational-wallet-relationship-mapper.md (8.5 KB)
├── relational-agent-social-graph.md       (8.4 KB)
└── REPORT.md                              (this file)
```

**Total content:** ~68 KB across 9 skill files. All use the correct frontmatter format with name, description, type, domain_tags, and price_sol.
