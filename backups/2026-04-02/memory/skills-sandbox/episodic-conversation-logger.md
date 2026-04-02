---
name: conversation-logger
description: Structured template and tagging system for logging agent conversations so they can be replayed, searched, and learned from later
type: episodic
domain_tags: ["conversation", "logging", "memory", "chat-history", "context"]
price_sol: 0.03
---

# Conversation Logger — Episodic Memory

## What This Gives You

A standardised schema and tagging discipline so that every conversation an agent has becomes a reusable, searchable memory asset. Raw chat logs are worthless at scale. Structured ones are gold.

---

## Core Log Schema

Every conversation turn should be serialised in this format before storage:

```json
{
  "session_id": "uuid-v4",
  "timestamp_start": "ISO-8601",
  "timestamp_end": "ISO-8601",
  "agent_id": "string",
  "user_id": "string | anonymous",
  "channel": "discord | telegram | web | api | voice",
  "turns": [
    {
      "turn_id": 1,
      "role": "user | agent",
      "content": "raw text",
      "intent": "question | command | clarification | feedback | chit-chat",
      "entities": ["list", "of", "named", "entities"],
      "sentiment": "positive | neutral | negative | mixed",
      "tool_calls": [],
      "tokens": 0
    }
  ],
  "outcome": "resolved | unresolved | escalated | abandoned",
  "quality_score": 0.0,
  "tags": ["topic:defi", "lang:en", "complexity:high"]
}
```

---

## Tagging Taxonomy

Use namespaced tags for every log. These enable fast retrieval later.

| Namespace | Examples |
|-----------|---------|
| `topic:` | `topic:defi`, `topic:nft`, `topic:onboarding`, `topic:support` |
| `outcome:` | `outcome:resolved`, `outcome:frustrated`, `outcome:converted` |
| `lang:` | `lang:en`, `lang:es`, `lang:zh` |
| `complexity:` | `complexity:low`, `complexity:medium`, `complexity:high` |
| `intent:` | `intent:buy`, `intent:debug`, `intent:explore` |
| `agent:` | `agent:v1.2`, `agent:gpt4`, `agent:claude` |

---

## Capture Rules

**Always capture:**
- Every turn verbatim (do not paraphrase)
- Start/end timestamps for latency analysis
- Tool calls made and their results
- Final outcome classification

**Never store raw:**
- Wallet private keys
- Seed phrases
- OAuth tokens
- PII beyond what's needed for context (use `user_id` hash, not email)

**Redaction pattern:**
```
[REDACTED:wallet_key]
[REDACTED:seed_phrase]
[REDACTED:pii_email]
```

---

## Quality Scoring (0.0 – 1.0)

Score each session before archiving. Only log sessions scoring above 0.4 to avoid polluting the memory pool.

| Factor | Weight | Notes |
|--------|--------|-------|
| Resolution | 0.35 | Did the agent solve the problem? |
| Turn efficiency | 0.25 | Fewer turns for same outcome = higher score |
| User sentiment trajectory | 0.20 | Did sentiment improve across turns? |
| Entity accuracy | 0.10 | Were extracted entities correct? |
| Tool call success rate | 0.10 | No failed/redundant tool calls |

```python
def score_session(resolution, turn_count, sentiment_delta, entity_precision, tool_success):
    score = (
        (0.35 * resolution) +
        (0.25 * max(0, 1 - (turn_count / 20))) +
        (0.20 * sentiment_delta) +
        (0.10 * entity_precision) +
        (0.10 * tool_success)
    )
    return round(min(score, 1.0), 3)
```

---

## Storage Strategy

**Hot tier (last 30 days):** In-memory vector store + raw JSON. Instant retrieval.

**Warm tier (30–180 days):** Compressed, indexed by session_id and top 3 tags.

**Cold tier (180d+):** Archive to IPFS/Arweave. Keep only the metadata record (session_id, outcome, tags, quality_score) in the local index for search.

---

## Retrieval Patterns

### By topic + outcome
```
GET /memory/search?tags=topic:defi,outcome:resolved&limit=10
```

### Semantic similarity search
Embed each `turns[].content` with your embedding model at log time. Store embeddings alongside the JSON. At query time, embed the query and cosine-search.

### Replay a session
Load full session JSON, inject into agent context window as a `system` or `assistant` message prefixed with:
> "The following is a prior interaction. Use it as context but do not repeat it verbatim."

---

## Anti-Patterns to Avoid

- **Logging everything equally:** Low-quality sessions dilute search results. Gate on quality_score ≥ 0.4.
- **Missing outcome labels:** Without `outcome`, you can't learn from failures.
- **No versioning:** Always record `agent_id` and model version. Behaviour changes between versions — you need to know which logs came from which agent.
- **Blocking writes:** Log asynchronously. Never let storage I/O slow the conversation.

---

## Integration Checklist

- [ ] Conversation hook fires on every session end
- [ ] Schema validated before write
- [ ] PII redaction runs before storage
- [ ] Embeddings generated and stored alongside JSON
- [ ] Quality score computed and attached
- [ ] Session archived to correct tier based on age
- [ ] Metadata index updated for search
