// Crypto Scanner - Solana meme coin trend monitor
// Sources: CoinGecko, DexScreener, Reddit (if configured)

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load optional Reddit credentials
const envPath = path.join(__dirname, '.env.reddit');
let redditEnv = {};
try {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) redditEnv[key.trim()] = value.trim();
  });
} catch(e) { /* Reddit not configured yet */ }

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      headers: {
        'User-Agent': 'OpenClaw-CryptoScanner/1.0',
        ...options.headers
      },
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('Parse error: ' + data.substring(0, 100))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

// 1. CoinGecko - Trending coins (free, no key)
async function getCoinGeckoTrending() {
  try {
    const data = await fetchJSON('https://api.coingecko.com/api/v3/search/trending');
    return (data.coins || []).slice(0, 7).map(c => ({
      name: c.item.name,
      symbol: c.item.symbol,
      rank: c.item.market_cap_rank,
      price_change: c.item.data?.price_change_percentage_24h?.usd || null,
      volume: c.item.data?.total_volume || null,
      source: 'CoinGecko'
    }));
  } catch(e) {
    return [];
  }
}

// 2. DexScreener - Trending Solana pairs (free, no key)
async function getDexScreenerTrending() {
  try {
    const data = await fetchJSON('https://api.dexscreener.com/token-boosts/top/v1');
    const solana = (data || [])
      .filter(p => p.chainId === 'solana')
      .slice(0, 8)
      .map(p => ({
        name: p.tokenAddress,
        symbol: p.tokenAddress?.substring(0, 8) + '...',
        boosts: p.amount,
        url: p.url,
        source: 'DexScreener Boosts'
      }));
    return solana;
  } catch(e) {
    return [];
  }
}

// 3. DexScreener - Latest Solana pairs
async function getDexScreenerLatest() {
  try {
    const data = await fetchJSON('https://api.dexscreener.com/latest/dex/search/?q=solana');
    const pairs = (data.pairs || [])
      .filter(p => p.chainId === 'solana')
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .slice(0, 8)
      .map(p => ({
        name: p.baseToken?.name || 'Unknown',
        symbol: p.baseToken?.symbol || '?',
        price_usd: parseFloat(p.priceUsd || 0).toFixed(8),
        price_change_24h: p.priceChange?.h24 || 0,
        volume_24h: p.volume?.h24 || 0,
        liquidity: p.liquidity?.usd || 0,
        txns_24h: (p.txns?.h24?.buys || 0) + (p.txns?.h24?.sells || 0),
        url: p.url,
        source: 'DexScreener'
      }));
    return pairs;
  } catch(e) {
    return [];
  }
}

// 4. Reddit - Crypto subreddits (if configured)
async function getRedditTrending() {
  if (!redditEnv.REDDIT_CLIENT_ID) return [];
  try {
    // Get access token
    const tokenData = await new Promise((resolve, reject) => {
      const auth = Buffer.from(`${redditEnv.REDDIT_CLIENT_ID}:${redditEnv.REDDIT_CLIENT_SECRET}`).toString('base64');
      const body = 'grant_type=password&username=' + encodeURIComponent(redditEnv.REDDIT_USERNAME) +
        '&password=' + encodeURIComponent(redditEnv.REDDIT_PASSWORD);
      const req = https.request('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + auth,
          'User-Agent': 'OpenClaw-CryptoScanner/1.0',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

    if (!tokenData.access_token) return [];
    const token = tokenData.access_token;

    const subreddits = ['CryptoMoonShots', 'memecoins', 'SatoshiStreetBets', 'solana'];
    const posts = [];

    for (const sub of subreddits) {
      try {
        const data = await fetchJSON(`https://oauth.reddit.com/r/${sub}/hot?limit=5`, {
          headers: {
            'Authorization': 'Bearer ' + token,
            'User-Agent': 'OpenClaw-CryptoScanner/1.0'
          }
        });
        (data.data?.children || []).forEach(p => {
          posts.push({
            subreddit: sub,
            title: p.data.title,
            score: p.data.score,
            comments: p.data.num_comments,
            url: 'https://reddit.com' + p.data.permalink,
            source: 'Reddit'
          });
        });
      } catch(e) { /* skip failed subreddit */ }
    }

    return posts.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch(e) {
    return [];
  }
}

// Format number
function fmt(n) {
  if (!n) return 'N/A';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
}

// Main scan
async function runScan() {
  const [geckoTrending, dexLatest, redditPosts] = await Promise.all([
    getCoinGeckoTrending(),
    getDexScreenerLatest(),
    getRedditTrending()
  ]);

  const result = {
    timestamp: new Date().toISOString(),
    coingecko_trending: geckoTrending,
    solana_dex_trending: dexLatest,
    reddit_posts: redditPosts
  };

  console.log(JSON.stringify(result, null, 2));
}

runScan().catch(err => {
  console.error('SCAN_ERROR:', err.message);
  process.exit(1);
});
