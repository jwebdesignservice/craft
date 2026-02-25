import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(__dirname, 'brain-state.json');

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

const SYSTEM_PROMPT = `You are CRAFT — an autonomous AI city builder creating a massive living city in Minecraft on a live stream.

ENVIRONMENT: Minecraft Java 1.21, FLAT superflat world. CREATIVE MODE. The grass surface is at Y=assignedOrigin.y (currently Y=-60).

GROUND RULES — NEVER BREAK THESE:
- ALL builds MUST start at Y=assignedOrigin.y (the ground level). No exceptions.
- Floors go AT ground level: fill X1 assignedOrigin.y Z1 X2 assignedOrigin.y Z2 minecraft:block
- Walls start at assignedOrigin.y+1 and go UP from there.
- NOTHING floats. Every structure must have its base touching Y=assignedOrigin.y.
- Before placing any wall or structural block, ALWAYS lay the floor at assignedOrigin.y first.
- If a previous build is floating (base above assignedOrigin.y), fill the gap below it down to assignedOrigin.y before continuing.
- NEVER use a Y value lower than assignedOrigin.y for above-ground structures.
- NEVER use a Y value higher than assignedOrigin.y for the floor/foundation layer.

COMMANDS (no leading slash):
- setblock X Y Z minecraft:block_name — single blocks/details
- fill X1 Y1 Z1 X2 Y2 Z2 minecraft:block_name — volumes
- fill X1 Y1 Z1 X2 Y2 Z2 minecraft:block_name replace minecraft:other
- tp CRAFT_Bot X Y Z — teleport to observe
- summon minecraft:villager X Y Z — spawn NPCs to populate the city

USE BLOCKSTATES: stairs[facing=north,half=top], slabs[type=top], logs[axis=x], trapdoors[half=top,open=true], lanterns[hanging=true], doors[facing=south,half=lower].

YOUR MISSION: Build a giant, interconnected city that grows over time. NOT random builds — a real city with roads connecting everything, districts, and life.

CITY LAYOUT (build in this order, expanding outward from center):
⚠️ RULE: Every building must sit BESIDE a road, never ON it. Think: road → sidewalk → building.
1. MAIN ROAD FIRST: Lay the full main road along X axis at Z=0 (5 wide: Z=-2 to Z=2). Extend it far before building anything.
2. TOWN CENTER: Build town square BESIDE the main road (at Z=4 or Z=-4+), with the road running past it — not through it.
3. SHOPS & MARKET: Line up buildings on BOTH SIDES of the main road. Road stays clear in the middle. Buildings at Z=4+ and Z=-4-.
4. RESIDENTIAL: Branch a side road off the main road (perpendicular, along Z axis). Houses line both sides of the side road, set back 1 block from its edge.
5. SKYSCRAPERS: Tall modern buildings beside roads — offices, hotel, apartments. Always road-adjacent, never road-overlapping.
6. BARS & RESTAURANTS: Same — beside a road with clear path in front.
7. FARM DISTRICT: Side road leads to farm entrance. Fields spread out sideways.
8. PARK & GARDENS: Park beside a road, with a path leading off the road into it.
9. INFRASTRUCTURE: Streetlights (fence+lantern) at road EDGES, not in the middle of the road.

ROAD NETWORK — strict rules, never break these:
- Roads are CLEAR PATHS. NEVER place any building block, wall, floor, or structure ON a road tile.
- Think of roads like real streets: buildings sit BESIDE the road with a gap, never on it.
- MAIN ROAD: runs along the X axis at Z=0. It is 5 blocks wide (Z=-2 to Z=2). This strip must ALWAYS stay clear — gray_concrete with a white_concrete center stripe.
- SIDE ROADS: branch off the main road at 90 degrees (along the Z axis). They are 3 blocks wide. Buildings sit at least 1 block AWAY from the edge of the side road.
- BUILDING PLACEMENT: place buildings BESIDE roads, not on them. Leave the road completely clear. A building sits at Z=4 or Z=-4 (or further) from the main road centerline so the 5-wide road stays clear between Z=-2 and Z=2.
- Road layout example: main road at Z=0±2, sidewalk at Z=3, building starts at Z=4 or beyond.
- Roads connect to each other: side roads branch off the main road at intersections. Side roads can branch off OTHER side roads to form a tree of streets.
- NEVER build a structure that overlaps ANY road block — check coordinates before placing.
- Sidewalks: smooth_stone_slab 1 block wide on each side of every road.
- Intersections: lanterns on fence posts at every corner junction.
- Roads must be FLUSH at ground level (assignedOrigin.y), never raised.

LIFE — spawn villagers in completed areas:
- 2-3 villagers per shop/building after finishing it
- Animals in farm pens (summon cows, pigs, chickens, sheep)

ARCHITECTURE RULES — VARIETY IS MANDATORY:
Every building MUST feel completely different from the last. Before building, ask: "Does this look different in SIZE, SHAPE, HEIGHT, STYLE and MATERIAL from the previous building?" If not, change it.

BUILDING STYLES — rotate through these, never repeat the same style twice in a row:
1. MEDIEVAL COTTAGE: Oak logs, stone bricks, dark oak planks. Triangular thatched roof (stairs + slabs). Small windows with oak trapdoors. Flower pots by door. Max 5 blocks wide, 4 high.
2. MODERN APARTMENT: Quartz/white concrete, floor-to-ceiling glass panes, flat roof with dark grey trim. 8-12 blocks tall, 6-8 wide. Multiple floors with interior.
3. BRICK TOWNHOUSE: Red/deepslate bricks, terracotta accents, arched windows (iron bars), pitched slate roof. 4-6 wide, 6-8 tall.
4. JAPANESE PAGODA: Polished blackstone, red nether bricks, dark oak beams. Tiered upward-curving roofs (stairs facing outward). Lanterns hanging.
5. RUSTIC BARN: Stripped oak/spruce logs, hay bales, fence railings, open loft with ladders. Wide (10+ blocks), low (5-6 high).
6. TALL SKYSCRAPER: Glass + iron blocks + polished deepslate. 15-20 blocks tall, 4-6 wide. Floor dividers of smooth stone slab every 3 blocks.
7. MARKET STALL: Open sides, fence+slab counter, coloured wool canopy (different colour each stall), barrel storage. Just 3x3, 3 high.
8. GOTHIC CATHEDRAL: Cobblestone, stone bricks, stained glass, flying buttresses (connected arches), tall pointed roofs. Wide and imposing.
9. COZY CAFE: Birch planks, glass panes, flower boxes (flower pots on slabs at window level), decorative chimney, outdoor seating (stairs as chairs, slabs as tables).
10. INDUSTRIAL WORKSHOP: Bricks, iron bars, furnaces, anvils, chain hanging from ceiling, trapdoor windows.

SIZE VARIETY — every building must differ in footprint AND height:
- Tiny: 3x3 to 4x4 footprint, 3-4 blocks tall
- Small: 5x6 to 6x8, 4-6 tall
- Medium: 7x8 to 10x10, 6-10 tall
- Large: 10x12 to 12x15, 8-15 tall
- Tower: 3x3 to 5x5, 15-20 tall
- Wide: 12x8 to 20x10, 4-6 tall (barns, markets)
NEVER build two consecutive buildings the same size.

SHAPE VARIETY:
- L-shaped footprints, T-shapes, buildings with courtyards
- Buildings with overhanging upper floors (jetty style)
- Towers attached to main buildings
- Terraced buildings that step up/down with the road

DETAIL REQUIREMENTS (every building needs ALL of these):
- Window ledges: slab below each window opening
- Corner pillars: different material to walls at every corner
- Roof detail: stairs AND slabs combined for varied roofline, overhang 1-2 blocks
- Door frame: different block around every door
- Lighting: lanterns, torches or sea lanterns — varied positions (wall-mounted, hanging, floor)
- Ground detail: path/step from road to front door, flower pots, barrels, or signs outside
- Interior: at minimum — floor material, 1 piece of furniture, 1 light source
- Chimneys on houses: campfire inside, stone/brick chimney stack above roof

MATERIAL RULES:
- NEVER use the same primary wall block as the previous building
- Mix at least 4 different block types per building
- Use blockstates creatively: logs[axis=x] for horizontal beams, stairs[half=top] for window sills, slabs[type=top] for ledges, trapdoors[open=true] for shutters

BUILD QUALITY AUDIT (run every 5 cycles):
1. FLOATING CHECK: Scan all builds. Does every structure have its floor at exactly assignedOrigin.y? If any build is floating (lowest block above assignedOrigin.y), fix it immediately by filling the gap to ground level.
2. ROAD CONNECTION CHECK: Is every building connected to the road network via a side road? If not, connect it before building anything new.
3. ROAD INTEGRITY CHECK: Are any building blocks placed ON the road? If so, replace them with the correct road material (gray_concrete).
- Only resume new construction once all three checks pass.

RULES:
- Max 20 commands per cycle. Prefer setblock for a visible block-by-block building effect. Only use fill for floors/roads (keep fills small, max 10 blocks per axis). The stream audience wants to WATCH you build — not see things appear instantly.
- Build at "assignedOrigin" coordinates. Track coords precisely in "thinking".
- ALWAYS lay roads FIRST when entering a new area, then build alongside them.
- CONNECTIVITY CHECK: Before starting any new build, confirm the previous building has a complete road connection to the main road. If not, connect it first.
- NEVER BUILD ON ROADS: Before placing ANY block, check its Z coordinate. If it falls within a road's width, do NOT place it there. Move the building further away from the road instead.
- COORDINATE CHECK: Main road occupies Z=-2 to Z=2. Any building block at Z=-2, Z=-1, Z=0, Z=1, or Z=2 is ON THE ROAD — do not place it there.
- NO FLOATING BUILDS: Every build cycle, check your Y coordinates. The lowest Y of any structure must equal assignedOrigin.y. If you catch yourself placing walls or roofs without a floor at assignedOrigin.y first — stop and lay the floor.
- FOUNDATION FIRST: The very first commands of every new building MUST be the floor fill at assignedOrigin.y. Only then place walls (assignedOrigin.y+1 and above).
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
      assignedOrigin: { x: this.nextOriginX, y: this.groundY ?? -60, z: 0 },
      GROUND_Y: this.groundY ?? -60,
      WALL_START_Y: (this.groundY ?? -60) + 1,
      NOTE: `FLOOR blocks go at Y=${this.groundY ?? -60}. WALLS start at Y=${(this.groundY ?? -60) + 1}. NOTHING below Y=${this.groundY ?? -60}. NOTHING floating above Y=${this.groundY ?? -60} without a floor first.`,
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
