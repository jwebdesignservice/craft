# PROJECTS.md — Active Projects Index

Track all active projects with consistent paths and status. Update this as projects are added, deployed, or archived.

---

## Project Format

Each project entry:
- **Name** — Project identifier
- **Where** — Full path to project folder
- **Status** — Development / Deployed / Archived / Blocked
- **Discord** — Associated Discord channel (if any)
- **Notes** — Key details, links, tech stack

---

## Active Projects

### CRAFT
- **Where:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\CRAFT\server`
- **Status:** Blocked (needs valid Anthropic API key)
- **Discord:** N/A
- **Notes:** Minecraft bot with Claude AI brain, Paper MC 1.21.11, mineflayer 4.35.0

### Memory Market
- **Where:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\memory-market`
- **Status:** Development
- **Discord:** <#1475880443201978379> (#🧠〡memory-market)
- **Notes:** AI agent memory marketplace, Solana-based, Layer 2 of AgentStack

### Chat-JPT
- **Where:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\CHAT JPT`
- **Status:** Development
- **Discord:** <#1472963710892113940> (#💬〡chat-jpt)
- **Notes:** Chat application project

### KOL-Vault
- **Where:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\KOL-Vault` (to be created)
- **Status:** Planning
- **Discord:** <#1479501992547192945> (#🔐〡kol-vault)
- **Notes:** Fresh project, just created channel

### Project Manager (This Workspace)
- **Where:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager`
- **Status:** Active
- **Discord:** Multiple channels (main agent workspace)
- **Notes:** OpenClaw agent workspace, contains AGENTS.md, MEMORY.md, all protocols

---

## Deployed Projects (Vercel)

### diaspora-scan
- **Status:** Deployed
- **URL:** TBD
- **Notes:** Vercel account: jwebdesignservice, team: jack-wilsons-projects-79c1513c

### talking-werner
- **Status:** Deployed
- **URL:** wernerterminal.com
- **Notes:** Live production site

### black-history-month
- **Status:** Deployed

### talking-jeff
- **Status:** Deployed

### pressure-washing-and-lawn-care
- **Status:** Deployed

### engineering-nicaragua
- **Status:** Deployed

### car-booking-system
- **Status:** Deployed

### jack-and-dil-mvp-site
- **Status:** Deployed

### my-port
- **Status:** Deployed
- **URL:** jwebdesign.co.uk

### eastside-truck-transport
- **Status:** Deployed

---

## Archived / On Hold

_(Move completed or abandoned projects here)_

---

## Quick Commands

### Create new project workspace
```powershell
# 1. Create Discord channel (if needed)
# (Use message tool: action=channel-create)

# 2. Create local folder
mkdir "C:\Users\Jack\Desktop\AI Website\htdocs\Websites\<project-name>"

# 3. Create memory file
New-Item "memory\discord\<project-name>.md" -ItemType File

# 4. Add to PROJECTS.md
```

### Deploy project
```powershell
# From project folder
.\deploy.ps1              # Preview
.\deploy.ps1 -Environment production  # Production
```

### Check Vercel projects
```powershell
vercel projects list --token $env:VERCEL_TOKEN
```

---

**Path Standard:** All projects under `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\<project-name>`

Keep this file updated as projects evolve.
