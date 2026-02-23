import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import config from './config.js';

export class OverlayServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.clients = new Set();
    this.currentState = {
      project: 'Starting up...',
      narration: 'CRAFT is initializing...',
      phase: 'planning',
      progress: 0,
      commands: [],
      connected: false,
    };

    this.setupRoutes();
    this.setupWebSocket();
  }

  setupRoutes() {
    // Serve the overlay HTML (for OBS browser source)
    this.app.get('/overlay', (req, res) => {
      res.send(this.getOverlayHTML());
    });

    // API endpoint for current state
    this.app.get('/api/status', (req, res) => {
      res.json(this.currentState);
    });

    // API endpoint for viewer suggestions
    this.app.post('/api/suggest', express.json(), (req, res) => {
      const { suggestion } = req.body;
      if (suggestion) {
        this.onSuggestion?.(suggestion);
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'No suggestion provided' });
      }
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.send(JSON.stringify(this.currentState));
      
      ws.on('close', () => this.clients.delete(ws));
    });
  }

  // Broadcast state update to all connected overlay clients
  broadcast(state) {
    this.currentState = { ...this.currentState, ...state };
    const data = JSON.stringify(this.currentState);
    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  }

  start() {
    this.server.listen(config.web.port, () => {
      console.log(`[Overlay] Server running at http://localhost:${config.web.port}`);
      console.log(`[Overlay] OBS Browser Source: http://localhost:${config.web.port}/overlay`);
    });
  }

  getOverlayHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    background: transparent;
    color: #fff;
    overflow: hidden;
  }
  .overlay {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid rgba(15, 255, 80, 0.3);
    border-radius: 16px;
    padding: 20px 24px;
    backdrop-filter: blur(10px);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .logo {
    font-weight: 800;
    font-size: 18px;
    color: #0FFF50;
  }
  .phase {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #0FFF50;
    background: rgba(15, 255, 80, 0.1);
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid rgba(15, 255, 80, 0.3);
  }
  .project {
    font-size: 14px;
    color: #999;
    margin-bottom: 8px;
  }
  .narration {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  .progress-bar {
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: #0FFF50;
    border-radius: 2px;
    transition: width 1s ease;
    box-shadow: 0 0 10px rgba(15, 255, 80, 0.5);
  }
  .commands {
    margin-top: 12px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #666;
    max-height: 60px;
    overflow: hidden;
  }
  .cmd { color: #0FFF50; opacity: 0.6; }
</style>
</head>
<body>
<div class="overlay">
  <div class="header">
    <div class="logo">⛏ CRAFT</div>
    <div class="phase" id="phase">PLANNING</div>
  </div>
  <div class="project" id="project">Starting up...</div>
  <div class="narration" id="narration">CRAFT is initializing...</div>
  <div class="progress-bar"><div class="progress-fill" id="progress" style="width:0%"></div></div>
  <div class="commands" id="commands"></div>
</div>
<script>
  const ws = new WebSocket('ws://' + location.host);
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    document.getElementById('phase').textContent = d.phase?.toUpperCase() || 'PLANNING';
    document.getElementById('project').textContent = 'Building: ' + (d.project || 'Unknown');
    document.getElementById('narration').textContent = d.narration || '';
    document.getElementById('progress').style.width = (d.progress || 0) + '%';
    if (d.commands?.length) {
      document.getElementById('commands').innerHTML = d.commands.slice(-3).map(c => '<div class="cmd">/' + c + '</div>').join('');
    }
  };
</script>
</body>
</html>`;
  }
}
