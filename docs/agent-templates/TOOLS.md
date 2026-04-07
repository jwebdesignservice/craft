# TOOLS.md — Template

*Environment-specific notes. Device names, SSH hosts, preferred voices, local setup.*

Skills define HOW tools work. This file is for YOUR specifics — unique to your setup.

---

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- API endpoints (local services)
- Anything environment-specific

## Example Entries

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod

### Local Services
- Paperclip: http://127.0.0.1:3100
- Gateway: http://127.0.0.1:18789
```

---

*Keep this lean. If it's not environment-specific, it doesn't belong here.*
