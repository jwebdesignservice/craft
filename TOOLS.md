# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Vercel

- **Account:** jwebdesignservice
- **Team:** jack-wilsons-projects-79c1513c
- **Token:** Stored in `.env` (VERCEL_TOKEN)
- **CLI:** Installed globally (`vercel` command)
- **Deployment Script:** `deploy.ps1` in workspace root
- **Guide:** See `VERCEL_GUIDE.md` for full deployment instructions

### Active Projects
- diaspora-scan
- talking-werner (wernerterminal.com)
- black-history-month
- talking-jeff
- pressure-washing-and-lawn-care
- engineering-nicaragua
- car-booking-system
- jack-and-dil-mvp-site
- my-port (jwebdesign.co.uk)
- eastside-truck-transport

### Quick Commands
```powershell
# Preview deploy
.\deploy.ps1

# Production deploy
.\deploy.ps1 -Environment production

# List projects
vercel projects list --token $env:VERCEL_TOKEN

# Check who's logged in
vercel whoami --token $env:VERCEL_TOKEN
```

---

Add whatever helps you do your job. This is your cheat sheet.
