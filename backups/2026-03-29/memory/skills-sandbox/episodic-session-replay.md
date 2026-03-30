---
name: session-replay
description: Inject past conversation sessions back into an agent's context window to restore continuity across disconnected sessions
type: episodic
domain_tags: ["session", "replay", "continuity", "context-injection", "memory-restoration"]
price_sol: 0.04
---

# Session Replay — Episodic Memory

## What This Gives You

The ability to pick up exactly where you left off. When a user returns after hours, days, or weeks, a session replay injects the most relevant prior context so the agent behaves as if it remembers — because it does.

---

## The Problem It Solves

LLMs have no persistent memory across sessions by default. Every conversation starts blank. For agents that handle ongoing relationships — support, trading assistants, coaches, research companions — this is a trust-destroying amnesia. Session replay fixes it.

---

## Replay Architecture

```
User returns → Load user_id → Retrieve N most relevant past sessions
→ Score and select best context → Compress to fit context budget
→ Inject as prefill → Agent responds with full continuity
```

---

## Session Retrieval Algorithm

### Step 1: Fetch candidates
```python
def get_candidate_sessions(user_id: str, limit: int = 20) -> list:
    return db.query(
        "SELECT * FROM sessions WHERE user_id = ? ORDER BY timestamp_end DESC LIMIT ?",
        [user_id, limit]
    )
```

### Step 2: Score candidates for relevance
```python
def score_for_replay(session: dict, current_query: str) -> float:
    recency = recency_score(session['timestamp_end'])          # 0–1, decays over time
    semantic = cosine_sim(embed(current_query), session['embedding'])  # 0–1
    outcome_weight = 1.2 if session['outcome'] == 'unresolved' else 1.0
    quality = session.get('quality_score', 0.5)
    
    return (0.40 * recency + 0.35 * semantic + 0.25 * quality) * outcome_weight

def recency_score(timestamp: str) -> float:
    age_hours = (now() - parse(timestamp)).total_seconds() / 3600
    return math.exp(-age_hours / 168)  # Half-life of 1 week
```

### Step 3: Select top sessions within token budget
```python
TOKEN_BUDGET = 2000  # Reserve for replay; rest goes to current conversation

def select_sessions(candidates: list, budget: int) -> list:
    candidates.sort(key=lambda s: s['replay_score'], reverse=True)
    selected, used = [], 0
    for s in candidates:
        cost = estimate_tokens(s)
        if used + cost <= budget:
            selected.append(s)
            used += cost
    return selected
```

---

## Compression Formats

Never inject raw transcripts — they're too verbose. Choose a compression level based on available token budget.

### Level 1 — Summary (50–100 tokens per session)
```
[Session 2025-01-14] User asked about staking SOL on Marinade. 
Resolved: explained mSOL mechanics, recommended 100 SOL minimum. 
User was satisfied, planned to stake next day.
```

### Level 2 — Key turns (100–300 tokens per session)
Extract only the highest-information turns: first user message, the resolution moment, any commitments made.

### Level 3 — Verbatim last N turns (300–800 tokens per session)
For sessions where exact wording matters (legal, medical, code review). Inject the last 5–10 turns verbatim.

---

## Injection Prompt Template

```python
REPLAY_PREFIX = """
<memory>
The following are summaries of prior conversations with this user. 
Use them to maintain continuity. Do not mention them unless relevant.
Do not repeat back their content verbatim. Just know them.

{session_summaries}
</memory>
"""

def build_context(sessions: list) -> str:
    summaries = "\n\n".join([compress(s, level=1) for s in sessions])
    return REPLAY_PREFIX.format(session_summaries=summaries)
```

---

## Continuity Signals to Always Track

These are the most valuable things to extract from any session for replay:

| Signal | Why It Matters |
|--------|---------------|
| **Open commitments** | "I'll check that tomorrow" — user expects follow-through |
| **Named preferences** | Tools, tokens, risk appetite, communication style |
| **Unresolved problems** | If it wasn't fixed, they'll bring it up again |
| **Key entities mentioned** | Wallets, projects, people, contracts |
| **Emotional high/low points** | Know when they were frustrated or delighted |
| **Stated goals** | What they're ultimately trying to achieve |

---

## Summarisation Prompt (for generating summaries at log-time)

```
You are a memory distiller. Given this conversation transcript, extract:
1. The user's main goal or question
2. What was resolved (or not)
3. Any commitments made (by either party)
4. Named entities (wallets, projects, tools, people)
5. User's apparent expertise level and communication style

Output as compact JSON. Be ruthless about brevity.
Max 150 tokens total.
```

---

## Edge Cases

**Very long history (100+ sessions):**  
Cluster sessions by topic embedding. Only fetch from relevant clusters for the current query.

**Conflicting information across sessions:**  
Always prefer the most recent session for factual claims. Flag conflicts explicitly:
> "Previously you said X, but in a later session you mentioned Y — which applies here?"

**User explicitly wants a fresh start:**  
Detect phrases like "let's start over", "forget what I said before", "ignore our history". Clear the replay context for this session.

**Multi-agent handoff:**  
When a conversation transfers between agents, bundle the replay context as a `handoff_packet` and pass it directly. Don't rely on the user to re-explain.

---

## What Good Replay Looks Like

❌ **Without replay:**
> User: "Did you ever find a fix for that staking issue?"
> Agent: "I don't have any context about a staking issue. Could you describe it?"

✅ **With replay:**
> User: "Did you ever find a fix for that staking issue?"
> Agent: "From our last chat on the 14th — you were seeing the mSOL conversion rate drop during high network load. The fix was to use Marinade's 'unstake now' path instead of the delayed route. Did that work out?"
