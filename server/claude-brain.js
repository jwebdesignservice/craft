import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(__dirname, 'brain-state.json');

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

const SYSTEM_PROMPT = `You are CRAFT — an autonomous AI city builder creating a massive living city in Minecraft on a live stream.

ENVIRONMENT: Minecraft Java 1.21, FLAT superflat world. CREATIVE MODE. The grass surface is at Y=assignedOrigin.y. Roads REPLACE the grass at that Y level. Building floors REPLACE grass at that Y. Walls start at assignedOrigin.y+1 and go UP. NOTHING floats or stacks on top of grass.

COMMANDS (no leading slash):
- setblock X Y Z minecraft:block_name — single blocks/details
- fill X1 Y1 Z1 X2 Y2 Z2 minecraft:block_name — volumes
- fill X1 Y1 Z1 X2 Y2 Z2 minecraft:block_name replace minecraft:other
- tp CRAFT_Bot X Y Z — teleport to observe
- summon minecraft:villager X Y Z — spawn NPCs to populate the city

USE BLOCKSTATES: stairs[facing=north,half=top], slabs[type=top], logs[axis=x], trapdoors[half=top,open=true], lanterns[hanging=true], doors[facing=south,half=lower].

YOUR MISSION: Build a giant, interconnected city that grows over time. NOT random builds — a real city with roads connecting everything, districts, and life.

CITY LAYOUT (build in this order, expanding outward from center):
1. TOWN CENTER (0,Z=0): Main road (gray_concrete + white_concrete stripes), town square, fountain
2. SHOPS & MARKET: Food stalls (fences+slabs+trapdoors as counters, wool awnings), bakery, butcher, general store along the main road
3. RESIDENTIAL: Houses of varying sizes along side roads — cottages, townhouses, apartments
4. SKYSCRAPERS: Tall modern buildings (10-20 blocks high) — offices, hotel, apartments
5. BARS & RESTAURANTS: Interiors with tables (slabs), chairs (stairs), counters, barrels, flower pots
6. FARM DISTRICT: Wheat/carrot/potato fields (farmland+crops), barn, animal pens (fences) with cows/pigs/chickens/sheep
7. PARK & GARDENS: Trees, benches (stairs), pond, flower beds, paths
8. BRIDGES: Decorative stone/wood bridges connecting districts over dry ravines or pathways
9. INFRASTRUCTURE: Streetlights (fence+lantern), benches, signs, market stalls, bus stops

ROADS ARE CRITICAL — every building MUST connect to the road network:
- Roads must be FLUSH with the ground, NOT on top. Use: fill X1 assignedOrigin.y Z1 X2 assignedOrigin.y Z2 minecraft:gray_concrete replace minecraft:grass_block — this replaces the grass surface so the road sits level with the terrain. NEVER place road blocks at assignedOrigin.y+1 or above.
- ONE MAIN ROAD runs along the X axis at Z=0 (from assignedOrigin). ALL side roads branch off this main road.
- Main roads: 5 wide (Z=-2 to Z=2), gray_concrete with white_concrete center stripe at Z=0
- Side roads: 3 wide, branch PERPENDICULAR from the main road to each building entrance
- Before building ANY new structure, FIRST extend the main road to reach it, THEN add a side road connecting to the building's entrance
- Sidewalks: smooth_stone_slab on both sides of roads
- Intersections: place lanterns on fence posts at corners
- NEVER leave a building without a road connecting it to the main road

LIFE — spawn villagers in completed areas:
- 2-3 villagers per shop/building after finishing it
- Animals in farm pens (summon cows, pigs, chickens, sheep)

ARCHITECTURE RULES:
- Walls need DEPTH: pillars, recessed windows, trim. No flat boxes.
- 3-5 materials per building. Glass panes for windows.
- Interiors MANDATORY: furniture, lighting, floors.
- Roofs overhang by 1-2 blocks. Use stairs for slopes.
- Each building should look DIFFERENT — vary styles, heights, materials.

RULES:
- Max 20 commands per cycle. Prefer setblock for a visible block-by-block building effect. Only use fill for floors/roads (keep fills small, max 10 blocks per axis). The stream audience wants to WATCH you build — not see things appear instantly.
- Build at "assignedOrigin" coordinates. Track coords precisely in "thinking".
- ALWAYS lay roads FIRST when entering a new area, then build alongside them.
- Narrate for stream viewers — tell them what district/building you're working on.
- NEVER place water, water blocks, or water features of any kind. No fountains, pools, rivers, canals, or moats. Keep everything dry.

OUTPUT (respond ONLY with this JSON):
{
  "thinking": "City planning — what area, coordinates, what you're building and why",
  "narration": "Exciting 1-2 sentence stream update",
  "commands": ["command1", "command2"],
  "phase": "roads|foundation|walls|interior|roof|detail|landscaping|populating|complete",
  "project": "Current building/area name",
  "progress": 0-100,
  "district": "center|market|residential|commercial|farm|park|industrial",
  "blueprint": {"origin":{"x":0,"y":-60,"z":0},"dimensions":{"w":15,"d":12,"h":10},"palette":["block1","block2"]}
}

No leading slash on commands. START: Build the main road and town square at the assignedOrigin. Lay roads first, then build the first market stalls alongside them.`;

export class ClaudeBrain {
  constructor() {
    this.conversationHistory = [];
    this.currentProject = null;
    this.currentBlueprint = null;
    this.buildLog = [];
    this.completedBuilds = [];
    this.nextOriginX = 500;
    this._loadState();
  }

  _loadState() {
    console.log(`[Brain] State file path: ${STATE_FILE}`);
    try {
      if (existsSync(STATE_FILE)) {
        const data = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
        this.nextOriginX = data.nextOriginX || 0;
        this.completedBuilds = data.completedBuilds || [];
        this.currentProject = data.currentProject || null;
        this.currentBlueprint = data.currentBlueprint || null;
        this.conversationHistory = data.conversationHistory || [];
        this.buildLog = data.buildLog || [];
        console.log(`[Brain] ✅ Restored state — resuming at X=${this.nextOriginX}, project: ${this.currentProject || 'new'}, completed: ${this.completedBuilds.length} builds`);
      } else {
        console.log('[Brain] No state file found, starting fresh');
      }
    } catch (e) {
      console.error('[Brain] Failed to load state:', e.message);
    }
  }

  // Called after bot connects — if we restored state, tell Claude not to rebuild
  injectResumeContext() {
    if (this.currentProject && this.conversationHistory.length > 0) {
      const lastLog = this.buildLog[this.buildLog.length - 1];
      this.conversationHistory.push({
        role: 'user',
        content: `RESUME: The server was restarted. You were working on "${this.currentProject}" at ~${lastLog?.progress || 0}% progress. The blocks you already placed ARE STILL THERE in the world. Do NOT rebuild what you already built. Continue from where you left off — build the NEXT part. Check your previous messages to see what you already did.`,
      });
      console.log(`[Brain] Injected resume context for "${this.currentProject}"`);
    }
  }

  _saveState() {
    try {
      const state = {
        nextOriginX: this.nextOriginX,
        completedBuilds: this.completedBuilds,
        currentProject: this.currentProject,
        currentBlueprint: this.currentBlueprint,
        conversationHistory: this.conversationHistory.slice(-30),
        buildLog: this.buildLog.slice(-20),
      };
      writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
      console.log(`[Brain] 💾 Saved state — X=${this.nextOriginX}, project: ${this.currentProject}`);
    } catch (e) {
      console.error('[Brain] ❌ Failed to save state:', e.message);
    }
  }

  async think(gameState) {
    // Build context with game state + build memory + assigned origin
    const context = {
      gameState,
      currentProject: this.currentProject,
      currentBlueprint: this.currentBlueprint,
      assignedOrigin: { x: this.nextOriginX, y: this.groundY || -60, z: 0 },
      completedBuilds: this.completedBuilds.slice(-3).map(b => ({ name: b.name, origin: b.origin })),
      cycleNumber: this.buildLog.length + 1,
    };

    this.conversationHistory.push({
      role: 'user',
      content: `GAME STATE:\n${JSON.stringify(context, null, 2)}\n\nContinue building. What's next?`,
    });

    // Keep conversation history manageable (last 30 messages)
    if (this.conversationHistory.length > 30) {
      this.conversationHistory = this.conversationHistory.slice(-30);
    }

    try {
      const response = await client.messages.create({
        model: config.anthropic.model,
        max_tokens: config.anthropic.maxTokens,
        system: SYSTEM_PROMPT,
        messages: this.conversationHistory,
      });

      const text = response.content[0].text;
      this.conversationHistory.push({ role: 'assistant', content: text });

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        this.currentProject = parsed.project || this.currentProject;
        
        // Track blueprint for continuity
        if (parsed.blueprint) {
          this.currentBlueprint = parsed.blueprint;
        }
        
        this.buildLog.push({
          timestamp: Date.now(),
          phase: parsed.phase,
          project: parsed.project,
          narration: parsed.narration,
          commandCount: parsed.commands?.length || 0,
          progress: parsed.progress || 0,
        });
        this._saveState();
        return parsed;
      }

      // Fallback if response isn't proper JSON
      return {
        thinking: text,
        narration: 'Processing...',
        commands: [],
        phase: 'planning',
        project: this.currentProject || 'Unknown',
        progress: 0,
      };
    } catch (err) {
      console.error('[Claude Brain] Error:', err.message);
      return {
        thinking: `Error: ${err.message}`,
        narration: 'Taking a moment to think...',
        commands: [],
        phase: 'planning',
        project: this.currentProject || 'Unknown',
        progress: 0,
      };
    }
  }

  // Inject viewer suggestion into the conversation
  addViewerSuggestion(suggestion) {
    this.conversationHistory.push({
      role: 'user',
      content: `VIEWER SUGGESTION: "${suggestion}" — Consider this for your next build or incorporate it if it fits.`,
    });
  }

  // Start a fresh project (called when progress hits 100)
  newProject() {
    if (this.currentProject) {
      this.completedBuilds.push({
        name: this.currentProject,
        origin: { x: this.nextOriginX, z: 0 },
        completedAt: Date.now(),
      });
    }
    // City grows outward — each new building is near the last but offset
    this.nextOriginX += 20;
    this.conversationHistory = [];
    this.currentProject = null;
    this.currentBlueprint = null;
    this.buildLog = [];
    this._saveState();
  }

  getStatus() {
    return {
      project: this.currentProject,
      historyLength: this.conversationHistory.length,
      buildLog: this.buildLog.slice(-10),
    };
  }
}
