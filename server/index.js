import { ClaudeBrain } from './claude-brain.js';
import { MinecraftBot } from './minecraft-bot.js';
import { OverlayServer } from './overlay-server.js';
import config from './config.js';

console.log(`
  ██████╗██████╗  █████╗ ███████╗████████╗
 ██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝
 ██║     ██████╔╝███████║█████╗     ██║   
 ██║     ██╔══██╗██╔══██║██╔══╝     ██║   
 ╚██████╗██║  ██║██║  ██║██║        ██║   
  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝   
  
  Claude AI × Minecraft — Autonomous Builder
  ============================================
`);

const brain = new ClaudeBrain();
const bot = new MinecraftBot();
const overlay = new OverlayServer();

let running = false;
let cycleCount = 0;

// Handle viewer suggestions from the overlay
overlay.onSuggestion = (suggestion) => {
  console.log(`[Suggestion] Viewer says: "${suggestion}"`);
  brain.addViewerSuggestion(suggestion);
};

// The main autonomous loop
async function runCycle() {
  cycleCount++;
  console.log(`\n${'='.repeat(50)}`);
  console.log(`[CRAFT] Cycle #${cycleCount}`);
  console.log(`${'='.repeat(50)}`);

  // 1. Get current game state
  const gameState = bot.getGameState();
  console.log('[CRAFT] Game state:', JSON.stringify(gameState, null, 2));

  // 2. Ask Claude what to do
  console.log('[CRAFT] Asking Claude...');
  const decision = await brain.think(gameState);

  console.log(`[CRAFT] Phase: ${decision.phase}`);
  console.log(`[CRAFT] Project: ${decision.project}`);
  console.log(`[CRAFT] Narration: ${decision.narration}`);
  console.log(`[CRAFT] Commands: ${decision.commands?.length || 0}`);

  // 3. Update the stream overlay
  overlay.broadcast({
    project: decision.project,
    narration: decision.narration,
    phase: decision.phase,
    progress: decision.progress,
    district: decision.district,
    blueprint: decision.blueprint,
    commands: decision.commands,
    connected: bot.connected,
    cycleCount,
  });

  // 4. Execute commands in Minecraft
  if (decision.commands && decision.commands.length > 0) {
    console.log('[CRAFT] Executing commands...');
    const results = await bot.executeCommands(decision.commands);
    
    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`[CRAFT] Results: ${success} succeeded, ${failed} failed`);
  }

  // 5. Auto-start new project when complete
  if (decision.progress >= 100) {
    console.log(`[CRAFT] ✅ "${decision.project}" COMPLETE! Starting new project...`);
    brain.newProject();
  }

  // 6. Wait before next cycle
  console.log(`[CRAFT] Next cycle in ${config.cyclePauseMs / 1000}s...`);
}

// Main loop runner
async function startLoop() {
  running = true;
  
  while (running) {
    try {
      await runCycle();
      await sleep(config.cyclePauseMs);
    } catch (err) {
      console.error('[CRAFT] Cycle error:', err.message);
      await sleep(10000); // Wait longer on error
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Startup sequence
async function main() {
  try {
    // 1. Start the overlay web server
    overlay.start();

    // 2. Connect to Minecraft
    console.log('[CRAFT] Connecting to Minecraft server...');
    await bot.connect();
    console.log('[CRAFT] Connected to Minecraft!');

    // 3. Initial setup — teleport to a clear area and set time
    console.log('[CRAFT] Setting up build area...');
    await bot.executeCommands([
      'gamemode creative ' + config.minecraft.username,
      'time set day',
      'weather clear',
      'gamerule doDaylightCycle false',
      'gamerule doWeatherCycle false',
    ]);

    // Detect actual ground level — entity.position.y is feet height (top of grass block)
    // Subtract 1 to get the actual grass block Y coordinate
    await sleep(1000);
    const groundY = Math.floor(bot.bot.entity.position.y) - 1;
    console.log(`[CRAFT] Detected ground level: Y=${groundY} (grass block)`);
    brain.groundY = groundY;
    bot.groundY = groundY;
    
    await bot.executeCommand('tp ' + config.minecraft.username + ' 500 ' + (groundY + 1) + ' 500');

    // 4. If resuming from a previous session, tell Claude what's already built
    brain.injectResumeContext();

    // 5. Start the autonomous loop
    console.log('[CRAFT] Starting autonomous build loop!');
    console.log('[CRAFT] Press Ctrl+C to stop\n');
    
    await startLoop();
  } catch (err) {
    console.error('[CRAFT] Fatal error:', err.message);
    console.error('\nMake sure:');
    console.error('  1. Minecraft server is running on ' + config.minecraft.host + ':' + config.minecraft.port);
    console.error('  2. Server is in offline mode (server.properties: online-mode=false)');
    console.error('  3. ANTHROPIC_API_KEY is set in .env');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[CRAFT] Shutting down...');
  running = false;
  bot.disconnect();
  process.exit(0);
});

main();
