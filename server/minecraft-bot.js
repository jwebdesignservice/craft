import mineflayer from 'mineflayer';
import { pathfinder } from 'mineflayer-pathfinder';
import config from './config.js';

export class MinecraftBot {
  constructor() {
    this.bot = null;
    this.connected = false;
    this.commandQueue = [];
    this.lastPosition = null;
    this.onStatusChange = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      console.log(`[MC Bot] Connecting to ${config.minecraft.host}:${config.minecraft.port}...`);

      this.bot = mineflayer.createBot({
        host: config.minecraft.host,
        port: config.minecraft.port,
        username: config.minecraft.username,
        version: false, // Auto-detect server version
      });

      this.bot.loadPlugin(pathfinder);

      this.bot.once('spawn', () => {
        console.log('[MC Bot] Connected and spawned!');
        this.connected = true;
        this.lastPosition = this.bot.entity.position;
        
        // Give the bot operator permissions reminder
        console.log('[MC Bot] Make sure to run: /op ' + config.minecraft.username);
        
        resolve();
      });

      this.bot.on('error', (err) => {
        console.error('[MC Bot] Error:', err.message);
        if (!this.connected) reject(err);
      });

      this.bot.on('kicked', (reason) => {
        console.error('[MC Bot] Kicked:', reason);
        this.connected = false;
        this.onStatusChange?.('disconnected');
      });

      this.bot.on('end', () => {
        console.log('[MC Bot] Disconnected');
        this.connected = false;
        this.onStatusChange?.('disconnected');
      });

      // Log chat messages (useful for stream overlay)
      this.bot.on('chat', (username, message) => {
        if (username !== this.bot.username) {
          console.log(`[MC Chat] ${username}: ${message}`);
        }
      });
    });
  }

  // Execute a single command
  async executeCommand(command) {
    if (!this.connected || !this.bot) {
      console.error('[MC Bot] Not connected');
      return { success: false, error: 'Not connected' };
    }

    try {
      // Auto-fix: if placing a road block, force it to ground Y (replace grass, not stack on top)
      const roadBlocks = ['gray_concrete', 'white_concrete', 'smooth_stone_slab', 'stone_bricks'];
      const isRoad = roadBlocks.some(b => command.includes(b));

      // If it's a setblock command, walk to it and place with a visible delay
      const setblockMatch = command.match(/^setblock\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(.*)/);
      if (setblockMatch) {
        let [, x, y, z, block] = setblockMatch;
        x = +x; y = +y; z = +z;
        // Force road blocks to ground level
        if (isRoad && this.groundY != null && y > this.groundY) {
          y = this.groundY;
          command = `setblock ${x} ${y} ${z} ${block}`;
        }
        await this.walkNear(x, y, z);
        await this.lookAt(x, y, z);
        await this.sleep(150);
      }

      // If it's a fill command, break it into individual setblocks for visual effect
      const fillMatch = command.match(/^fill\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(.*)/);
      if (fillMatch) {
        let [, x1s, y1s, z1s, x2s, y2s, z2s, blockArgs] = fillMatch;
        // Force road fills to ground level
        if (isRoad && this.groundY != null) {
          if (+y1s > this.groundY) y1s = String(this.groundY);
          if (+y2s > this.groundY) y2s = String(this.groundY);
          command = `fill ${x1s} ${y1s} ${z1s} ${x2s} ${y2s} ${z2s} ${blockArgs}`;
        }
        const x1 = Math.min(+x1s, +x2s), x2 = Math.max(+x1s, +x2s);
        const y1 = Math.min(+y1s, +y2s), y2 = Math.max(+y1s, +y2s);
        const z1 = Math.min(+z1s, +z2s), z2 = Math.max(+z1s, +z2s);
        const totalBlocks = (x2-x1+1) * (y2-y1+1) * (z2-z1+1);
        
        // If small enough (≤200 blocks), place block by block for visual effect
        if (totalBlocks <= 200) {
          for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
              for (let z = z1; z <= z2; z++) {
                await this.lookAt(x, y, z);
                this.bot.chat(`/setblock ${x} ${y} ${z} ${blockArgs.split(' replace ')[0]}`);
                await this.sleep(40); // 40ms per block — quick but visible
              }
            }
          }
          return { success: true, command, blockByBlock: true, totalBlocks };
        }
        
        // Large fills (>200 blocks): do the fill but with a longer pause to watch
        const mx = Math.round((x1 + x2) / 2);
        const my = Math.round((y1 + y2) / 2);
        const mz = Math.round((z1 + z2) / 2);
        await this.walkNear(mx, my, mz);
        await this.lookAt(mx, my, mz);
        await this.sleep(300);
      }

      this.bot.chat(`/${command}`);
      await this.sleep(500);
      
      return { success: true, command };
    } catch (err) {
      console.error(`[MC Bot] Command failed: ${command}`, err.message);
      return { success: false, command, error: err.message };
    }
  }

  // Execute a batch of commands
  async executeCommands(commands) {
    const results = [];
    for (const cmd of commands) {
      console.log(`[MC Bot] Executing: /${cmd}`);
      const result = await this.executeCommand(cmd);
      results.push(result);
    }
    return results;
  }

  // Walk near a position
  async walkNear(x, y, z) {
    try {
      const pos = this.bot.entity.position;
      const dx = x - pos.x;
      const dz = z - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist > 3) {
        // Teleport near the target (3 blocks away)
        const angle = Math.atan2(dz, dx);
        const nx = Math.round(x - Math.cos(angle) * 3);
        const nz = Math.round(z - Math.sin(angle) * 3);
        this.bot.chat(`/tp ${this.bot.username} ${nx} ${y + 1} ${nz}`);
        await this.sleep(300);
      }
    } catch (e) {
      // Ignore movement errors
    }
  }

  // Look at a position
  async lookAt(x, y, z) {
    try {
      await this.bot.lookAt({ x: x + 0.5, y: y + 0.5, z: z + 0.5 });
    } catch (e) {
      // Ignore look errors
    }
  }

  // Get the current game state for Claude
  getGameState() {
    if (!this.connected || !this.bot) {
      return { connected: false };
    }

    const pos = this.bot.entity.position;
    const time = this.bot.time?.timeOfDay || 0;
    const weather = this.bot.isRaining ? 'rain' : 'clear';
    const health = this.bot.health;
    const players = Object.keys(this.bot.players || {});

    // Get nearby blocks (simplified view)
    const nearbyBlocks = this.scanNearbyBlocks(pos, 5);

    return {
      connected: true,
      position: { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) },
      time: time,
      weather: weather,
      health: health,
      players: players,
      nearbyBlocks: nearbyBlocks,
    };
  }

  // Scan blocks around the bot
  scanNearbyBlocks(center, radius) {
    const blocks = {};
    try {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const block = this.bot.blockAt(center.offset(dx, 0, dz));
          if (block && block.name !== 'air') {
            blocks[block.name] = (blocks[block.name] || 0) + 1;
          }
        }
      }
    } catch (e) {
      // Ignore scan errors
    }
    return blocks;
  }

  // Teleport bot to a location
  async teleport(x, y, z) {
    await this.executeCommand(`tp ${this.bot.username} ${x} ${y} ${z}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  disconnect() {
    if (this.bot) {
      this.bot.quit();
      this.connected = false;
    }
  }
}
