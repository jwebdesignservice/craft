# Cross-Agent Communication Protocol

## Problem

When agent A sends a message to agent B's channel, agent B doesn't automatically respond because:
1. Message is from the bot (not a human)
2. No explicit mention/trigger
3. Context doesn't transfer

**Goal:** Enable verified cross-agent handoffs ONLY when authorized by JMoon or wils.

---

## Authorization

**Verified User IDs:** See `AGENT-ROSTER.md` → Operators section for canonical IDs.
- JMoon: `1370781720563024089`
- wils: `809133430315024384`

**Rule:** Cross-agent communication is ONLY enabled when:
1. Original request came from a verified user ID (see AGENT-ROSTER.md)
2. Message contains explicit handoff marker
3. Target agent acknowledges receipt

---

## Protocol Format

### Step 1: User Requests Cross-Agent Action

User (JMoon/wils) says in any channel:
```
@agent send [message] to #agent-gork
```

OR:

```
handover to #agent-karen: [context]
```

### Step 2: Sending Agent Marks Message

When sending to another agent's channel, include:
```
[HANDOVER from @JMoon via #general]

[Content here]

---
📋 Context handoff - please acknowledge
```

### Step 3: Receiving Agent Responds

Target agent sees the handover marker and:
1. Verifies sender is authorized (check user ID in metadata)
2. Loads context from handover
3. Acknowledges receipt:
```
✅ Handover received from #general
Context loaded. Ready to proceed.
```

---

## Implementation

### In AGENTS.md - Add to Startup Protocol

```markdown
## Cross-Agent Handover Detection

**On every message, check for handover markers:**

1. Look for `[HANDOVER from @Username via #channel]` in message
2. Extract metadata:
   - Original user ID
   - Source channel
   - Context payload
3. Verify user ID matches authorized list:
   - 1370781720563024089 (JMoon)
   - 809133430315024384 (wils)
4. If verified → Load context and respond
5. If NOT verified → Ignore (silent)

**Handover marker format:**
```
[HANDOVER from @JMoon via #general]
[Context: Brief summary]
[Task: What to do]
---
📋 Context handoff - please acknowledge
```
```

### Message Tool Usage

When user requests cross-agent send:
```javascript
message.send({
  channel: "discord",
  target: "1482476661977911308", // #agent-gork
  message: `[HANDOVER from @${username} via #${currentChannel}]

Context: ${summary}
Task: ${task}

Original request by: ${userId}
---
📋 Context handoff - please acknowledge`
})
```

---

## Security Rules

**✅ ALLOWED:**
- Operator user IDs (see AGENT-ROSTER.md) initiate handover
- Message contains [HANDOVER] marker
- Target agent verifies before responding

**❌ BLOCKED:**
- Any other user ID attempts handover
- Messages without handover marker
- Unverified cross-agent communication

**Silent Ignore:**
If handover marker present but user ID not verified → Do NOT respond, do NOT acknowledge

---

## Example Flow

### Scenario: JMoon asks main agent to update agent-gork

**1. JMoon in #general:**
```
Send deployment status to #agent-gork
```

**2. Main agent sends to #agent-gork:**
```
[HANDOVER from @JMoon via #general]

Context: Railway deployment completed
Task: Confirm bot is running and check recent tweets

Original request by: 1370781720563024089
---
📋 Context handoff - please acknowledge
```

**3. Agent-gork (auto-detects handover):**
```
✅ Handover received from #general

Checking deployment status...
[proceeds with task]
```

---

## Detection Pattern (for AGENTS.md)

Add to startup protocol:

```markdown
### Cross-Agent Message Detection

**Before responding to ANY message:**

1. Check if message contains: `[HANDOVER from @`
2. If yes:
   a. Extract user ID from "Original request by: [ID]"
   b. Verify ID is 1370781720563024089 OR 809133430315024384
   c. If verified → Load context and respond
   d. If NOT verified → SILENT (no response, no error)
3. If no handover marker → Normal message processing
```

---

## Alternative: Mention-Based Handoff

Simpler approach - require explicit mention:

**User says:**
```
@main tell @agent-gork to check deployment status
```

**Main agent:**
```
@agent-gork [from @JMoon] - Check deployment status

Railway deployment completed. Verify bot running.
```

**Agent-gork sees mention and verifies sender metadata**

---

## Recommended Implementation

**Phase 1 (Manual):**
- User explicitly asks for cross-agent send
- Sending agent includes [HANDOVER] marker
- Receiving agent manually acknowledges (not automated yet)

**Phase 2 (Semi-Auto):**
- Update AGENTS.md with detection pattern
- Agents auto-detect handover markers
- Verify user ID before responding

**Phase 3 (Fully Auto):**
- Natural language handoff detection
- "send this to agent-karen" triggers automatic handover
- Full context transfer with verification

---

## Config Changes Needed

Add to openclaw.json:

```json
{
  "crossAgentComm": {
    "enabled": true,
    "authorizedUsers": [
      "1370781720563024089",
      "809133430315024384"
    ],
    "handoverMarker": "[HANDOVER from @",
    "requireVerification": true,
    "silentOnUnauthorized": true
  }
}
```

---

## Usage Examples

### Send Status Update
```
Send deployment status to #agent-gork
```

### Request Action
```
Tell #agent-karen to test personality with crypto scam scenario
```

### Context Handoff
```
Handover to #agent-gork: Monitor first 10 replies and report back
```

### Multi-Agent Broadcast
```
Send "deployment complete" to #agent-gork and #agent-karen
```

---

## Next Steps

1. **Update AGENTS.md** - Add handover detection pattern
2. **Test manually** - Send handover messages and verify detection
3. **Automate** - Add to session startup protocol
4. **Monitor** - Log all cross-agent communication attempts

**Status:** 🟡 Protocol designed, needs implementation in AGENTS.md
