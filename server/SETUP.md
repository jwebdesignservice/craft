# CRAFT Server Setup Guide

## Prerequisites
- Node.js 18+ (you have v24 ✅)
- Java 21+ (for Minecraft server)
- Minecraft Java Edition server

---

## Step 1: Download Minecraft Server

1. Download Paper MC (recommended): https://papermc.io/downloads
2. Download the latest `.jar` file
3. Create a folder: `C:\Users\Jack\Desktop\minecraft-server`
4. Put the jar file there

## Step 2: Start Minecraft Server (first time)

```powershell
cd C:\Users\Jack\Desktop\minecraft-server
java -Xmx4G -Xms2G -jar paper-1.21.4-xxx.jar --nogui
```

It will create files and stop. Edit these:

**server.properties:**
```
online-mode=false
enable-rcon=true
rcon.port=25575
rcon.password=craftadmin123
gamemode=creative
level-type=flat
spawn-protection=0
```

**eula.txt:**
```
eula=true
```

Start the server again.

## Step 3: Setup CRAFT Engine

```powershell
cd "C:\Users\Jack\Desktop\AI Website\htdocs\Websites\CRAFT\server"
copy .env.example .env
```

Edit `.env` with your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key
RCON_PASSWORD=craftadmin123
```

Install dependencies:
```powershell
npm install
```

## Step 4: Run CRAFT

1. Make sure Minecraft server is running
2. Start CRAFT:
```powershell
npm start
```

3. In the Minecraft server console, give the bot operator:
```
op CRAFT_Bot
```

## Step 5: Stream Setup (OBS)

1. Open OBS Studio
2. Add a **Game Capture** source → select Minecraft client (spectate the server)
3. Add a **Browser Source** → URL: `http://localhost:3000/overlay`
   - Width: 1920, Height: 1080
4. Stream to Kick/Twitch/YouTube

---

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Claude API    │────▶│  CRAFT Engine │────▶│ Minecraft Server│
│  (the brain)    │◀────│  (Node.js)    │◀────│  (Paper MC)     │
└─────────────────┘     └──────┬───────┘     └─────────────────┘
                               │
                        ┌──────▼───────┐
                        │ Overlay Server│──▶ OBS Browser Source
                        │  (Express+WS) │──▶ Website embed
                        └──────────────┘
```

## File Structure
```
server/
├── index.js           # Main entry — runs the autonomous loop
├── claude-brain.js    # Claude API integration (the AI brain)
├── minecraft-bot.js   # Mineflayer bot (connects to MC server)
├── overlay-server.js  # Web server for stream overlay + API
├── config.js          # Configuration from .env
├── .env               # Your secrets (API keys, passwords)
└── package.json       # Dependencies
```
