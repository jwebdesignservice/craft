import 'dotenv/config';

export default {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    maxTokens: parseInt(process.env.MAX_TOKENS) || 4096,
  },
  minecraft: {
    host: process.env.MC_HOST || 'localhost',
    port: parseInt(process.env.MC_PORT) || 25565,
    username: process.env.MC_BOT_USERNAME || 'CRAFT_Bot',
  },
  rcon: {
    host: process.env.RCON_HOST || 'localhost',
    port: parseInt(process.env.RCON_PORT) || 25575,
    password: process.env.RCON_PASSWORD || '',
  },
  web: {
    port: parseInt(process.env.WEB_PORT) || 3000,
  },
  // How long each build cycle runs before Claude evaluates
  cycleDurationMs: 60000, // 1 minute per build step
  // Pause between cycles
  cyclePauseMs: 5000,
};
