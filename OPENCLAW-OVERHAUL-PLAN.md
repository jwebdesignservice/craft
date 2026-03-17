# OpenClaw System Overhaul Plan
**Created:** 2026-03-15
**For:** JMoon + wils
**Goal:** Clean, maintainable, fully-connected OpenClaw setup

---

## 🔍 Current State Analysis

### Issues Found:
1. ❌ **Exec permissions were disabled** - Fixed (ask="always", security="full")
2. ❌ **User permissions too restrictive** - Fixed (granted full wildcard access)
3. ❌ **29 hardcoded channel IDs** - Brittle, breaks on new channels
4. ❌ **Empty bindings array** - No global agent binding
5. ⚠️ **Two user auth paths exist** - Could consolidate

### What Works:
- ✅ 20 agents defined with proper workspaces
- ✅ Discord integration active
- ✅ Agent-to-agent communication enabled (research/alpha/planner)
- ✅ Multiple Anthropic auth profiles configured
- ✅ Grok-4 model added

---

## 🎯 Ideal Target State

### 1. **Permissions (DONE ✅)**
```json
{
  "tools": {
    "exec": {
      "ask": "always",
      "security": "full"
    }
  },
  "commands": {
    "allowFrom": {
      "809133430315024384": ["*"],  // wils - full access
      "1370781720563024089": ["*"]  // JMoon - full access
    }
  }
}
```

### 2. **Discord Config (TO DO)**
**Problem:** 29 hardcoded channel IDs = maintenance nightmare

**Solution:** Use guild-level config + bindings
```json
{
  "channels": {
    "discord": {
      "guilds": {
        "1471449053220044935": {
          "requireMention": false,
          // Remove individual channel overrides
          // Let guild policy handle everything
        }
      }
    }
  },
  "bindings": [
    {
      "agent": "talking-epstein",
      "channel": "discord",
      "guild": "1471449053220044935",
      "mode": "listen"
    }
  ]
}
```

### 3. **Agent Bindings (TO DO)**
**Current:** Empty bindings array
**Goal:** Main agent (talking-epstein) responds in all Discord channels

### 4. **Web Tools (OPTIONAL)**
**Current:** search + fetch disabled
**Consider:** Enable for research/browsing tasks?

---

## 📋 Implementation Steps

### Phase 1: Backup (NOW)
1. ✅ Save current config to git
2. ✅ Document current state
3. ✅ Create restore point

### Phase 2: Surgical Fixes (NOW)
1. ✅ Fix permissions (DONE)
2. ⏳ Simplify Discord config (guild-level)
3. ⏳ Add global agent binding
4. ⏳ Test in one channel first

### Phase 3: Validation (AFTER)
1. ⏳ Test command execution
2. ⏳ Test agent responses in all channels
3. ⏳ Verify new channels auto-work
4. ⏳ Document final config

### Phase 4: Handoff to Super Slick Bot (LATER)
1. ⏳ Export full system state
2. ⏳ Have bot review + refactor
3. ⏳ Apply bot's recommendations
4. ⏳ Start fresh with optimized config

---

## 🚀 Next Commands

```powershell
# 1. Initialize git in .openclaw (if not already)
cd C:\Users\Jack\.openclaw
git init
git add openclaw.json
git commit -m "Backup before overhaul - 2026-03-15"

# 2. Apply simplified Discord config
# (Will use config.patch)

# 3. Test in #general first
# (Send test message, verify response)

# 4. Roll out to all channels
# (Remove per-channel overrides)
```

---

## 📝 Config Patches Ready

### Patch 1: Simplify Discord (removes hardcoded channels)
```json
{
  "channels": {
    "discord": {
      "guilds": {
        "1471449053220044935": {
          "requireMention": false
        }
      }
    }
  }
}
```

### Patch 2: Bind main agent globally
```json
{
  "bindings": [
    {
      "agent": "talking-epstein",
      "channel": "discord",
      "guild": "1471449053220044935"
    }
  ]
}
```

---

## 🔐 Security Notes

- ✅ Both users have full wildcard command access
- ✅ Verbal exec approval enabled (ask="always")
- ✅ exec.security="full" for maximum control
- ⚠️ MEMORY.md in .gitignore (confirmed - don't commit secrets)

---

## 📊 Before/After Comparison

| Metric | Before | After (Target) |
|--------|--------|----------------|
| Hardcoded channels | 29 | 0 |
| Exec permissions | Denied | Full + verbal |
| Command access | Empty arrays | Wildcard (*) |
| Agent bindings | 0 | 1 (main) |
| Maintainability | Low | High |

---

## 🎬 Rollout Strategy

1. **Backup current state** ✅ (this doc)
2. **Apply fixes in dev** ⏳ (test in #general first)
3. **Validate** ⏳ (confirm all channels work)
4. **Deploy** ⏳ (apply globally)
5. **Monitor** ⏳ (watch for issues)
6. **Iterate** ⏳ (tune based on usage)

---

## 📞 Support & Recovery

If something breaks:
1. `/status` - Check gateway health
2. `openclaw doctor` - Auto-diagnose
3. Restore from git backup:
   ```powershell
   cd C:\Users\Jack\.openclaw
   git checkout openclaw.json
   openclaw gateway restart
   ```

---

**Status:** Phase 1 (Backup) + Step 1 of Phase 2 (Permissions) COMPLETE
**Next:** Apply Discord simplification + agent binding
