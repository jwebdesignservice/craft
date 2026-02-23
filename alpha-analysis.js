// Alpha Analyst - Deep token analysis script
// Fetches detailed data for top coins from the crypto scan

const https = require('https');

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      headers: { 'User-Agent': 'OpenClaw-AlphaAnalyst/1.0', ...options.headers },
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function fmt(n) {
  if (!n || isNaN(n)) return 'N/A';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K';
  return '$' + parseFloat(n).toFixed(4);
}

function pct(n) {
  if (!n || isNaN(n)) return 'N/A';
  const sign = n >= 0 ? '+' : '';
  return sign + parseFloat(n).toFixed(2) + '%';
}

function ratio(a, b) {
  if (!a || !b || b === 0) return 'N/A';
  return ((a / b) * 100).toFixed(1) + '%';
}

function momentumScore(priceChange, volumeTrend, txns) {
  let score = 50;
  if (priceChange > 50) score += 25;
  else if (priceChange > 20) score += 15;
  else if (priceChange > 5) score += 8;
  else if (priceChange < -30) score -= 20;
  else if (priceChange < -10) score -= 10;
  if (txns > 10000) score += 15;
  else if (txns > 5000) score += 8;
  else if (txns < 500) score -= 10;
  return Math.min(100, Math.max(0, score));
}

function safetyScore(liquidity, mcap, topHolderPct) {
  let score = 50;
  if (liquidity > 100000) score += 20;
  else if (liquidity > 50000) score += 10;
  else if (liquidity < 10000) score -= 20;
  const liqRatio = mcap > 0 ? (liquidity / mcap) * 100 : 0;
  if (liqRatio > 10) score += 15;
  else if (liqRatio < 2) score -= 15;
  if (topHolderPct) {
    if (topHolderPct > 50) score -= 25;
    else if (topHolderPct > 30) score -= 10;
    else if (topHolderPct < 20) score += 10;
  }
  return Math.min(100, Math.max(0, score));
}

function riskLevel(safety) {
  if (safety >= 70) return '🟢LOW';
  if (safety >= 50) return '🟡MED';
  if (safety >= 30) return '🟠HIGH';
  return '🔴EXTREME';
}

async function analyzeToken(pair) {
  const name = pair.baseToken?.name || 'Unknown';
  const symbol = pair.baseToken?.symbol || '???';
  const price = parseFloat(pair.priceUsd || 0);
  const mcap = pair.fdv || pair.marketCap || 0;
  const fdv = pair.fdv || 0;
  const vol24h = pair.volume?.h24 || 0;
  const liquidity = pair.liquidity?.usd || 0;
  const priceChange24h = pair.priceChange?.h24 || 0;
  const priceChange1h = pair.priceChange?.h1 || 0;
  const buys = pair.txns?.h24?.buys || 0;
  const sells = pair.txns?.h24?.sells || 0;
  const txns = buys + sells;

  const momentum = momentumScore(priceChange24h, vol24h, txns);
  const safety = safetyScore(liquidity, mcap, null);
  const risk = riskLevel(safety);

  const volTrend = vol24h > 500000 ? 'Increasing' : vol24h > 100000 ? 'Stable' : 'Declining';
  const priceMomentum = Math.abs(priceChange24h) > 20 ? 'Strong' : Math.abs(priceChange24h) > 5 ? 'Moderate' : 'Weak';
  const direction = priceChange24h > 5 ? 'Bullish' : priceChange24h < -5 ? 'Bearish' : 'Neutral';
  const priceAction = priceChange24h > 10 ? 'Breaking out' : priceChange24h < -10 ? 'Dumping' : 'Consolidating';
  const whaleActivity = sells > buys * 1.5 ? 'Distributing' : buys > sells * 1.5 ? 'Accumulating' : 'Neutral';
  const sentiment = priceChange24h > 5 ? 'Bullish' : priceChange24h < -5 ? 'Bearish' : 'Neutral';
  const community = txns > 5000 ? 'High' : txns > 1000 ? 'Med' : 'Low';

  const positives = [];
  const risks = [];
  if (liquidity > 50000) positives.push('Good liquidity');
  if (vol24h > 100000) positives.push('Strong volume');
  if (buys > sells) positives.push('More buyers than sellers');
  if (priceChange24h > 10) positives.push('Strong upward momentum');
  if (liquidity < 20000) risks.push('Low liquidity');
  if (priceChange24h < -20) risks.push('Sharp price decline');
  if (sells > buys * 1.5) risks.push('Heavy selling pressure');
  if (mcap < 100000) risks.push('Micro cap');
  if (positives.length === 0) positives.push('Early stage');
  if (risks.length === 0) risks.push('Normal market risks');

  const buyRatio = sells > 0 ? (buys / sells).toFixed(1) : 'N/A';

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DEEP ANALYSIS: $${symbol}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 MARKET ANALYSIS:
• Market Cap: ${fmt(mcap)} | Fully Diluted: ${fmt(fdv)}
• 24h Volume: ${fmt(vol24h)} | Volume/MCap Ratio: ${ratio(vol24h, mcap)}
• Liquidity: ${fmt(liquidity)} | Liquidity/MCap Ratio: ${ratio(liquidity, mcap)}
• Price Action: ${priceAction} (${pct(priceChange24h)} 24h)
• 1h Change: ${pct(priceChange1h)}

📈 MOMENTUM SCORE: ${momentum}/100
├─ Volume Trend: ${volTrend}
├─ Price Momentum: ${priceMomentum}
├─ Buyer vs Seller Ratio: ${buyRatio}:1
└─ Direction: ${direction}

👥 HOLDER ANALYSIS:
• Buys 24h: ${buys.toLocaleString()} | Sells 24h: ${sells.toLocaleString()}
• Total Txns: ${txns.toLocaleString()}
• Whale Activity: ${whaleActivity}
• Dev Wallet: Unknown

🔒 RISK ASSESSMENT:
Safety Score: ${safety}/100
✅ Positives: ${positives.join(', ')}
❌ Risks: ${risks.join(', ')}
Risk Level: ${risk}

📣 SENTIMENT:
• Overall: ${sentiment}
• Community: ${community} activity (${txns.toLocaleString()} txns/24h)
• Narrative: Solana meme — ${priceChange24h > 0 ? 'momentum building' : 'cooling off'}
• DexScreener: ${pair.url || 'N/A'}`;
}

async function runAnalysis() {
  // Fetch from multiple endpoints and merge for wider coverage
  const [search1, search2, search3, boosts] = await Promise.all([
    fetchJSON('https://api.dexscreener.com/latest/dex/search/?q=sol+meme'),
    fetchJSON('https://api.dexscreener.com/latest/dex/search/?q=solana+token'),
    fetchJSON('https://api.dexscreener.com/latest/dex/search/?q=pump+fun'),
    fetchJSON('https://api.dexscreener.com/token-boosts/top/v1')
  ]);

  const allPairs = [
    ...(search1?.pairs || []),
    ...(search2?.pairs || []),
    ...(search3?.pairs || [])
  ];

  // Deduplicate by pair address
  const seen = new Set();
  const uniquePairs = allPairs.filter(p => {
    if (seen.has(p.pairAddress)) return false;
    seen.add(p.pairAddress);
    return true;
  });

  const data = { pairs: uniquePairs };
  if (!data || !data.pairs) { console.log('NO_DATA'); process.exit(1); }

  const pairs = data.pairs
    .filter(p => p.chainId === 'solana' && p.volume?.h24 > 5000)
    .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));

  const top20 = pairs.slice(0, 20);
  const top10 = pairs.slice(0, 10);

  if (top20.length === 0) { console.log('NO_DATA'); process.exit(0); }

  // Build quick-view top 20 list
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  let output = `🏆 **SOLANA TOP 20 — ${now} UTC**\n`;
  output += `${'─'.repeat(40)}\n`;
  output += `\`RANK  TICKER        PRICE         24H%      VOL 24H     TXNs\`\n`;

  top20.forEach((p, i) => {
    const sym = ('$' + (p.baseToken?.symbol || '???')).padEnd(12);
    const price = ('$' + parseFloat(p.priceUsd || 0).toFixed(6)).padEnd(14);
    const chg = pct(p.priceChange?.h24 || 0);
    const arrow = (p.priceChange?.h24 || 0) >= 0 ? '📈' : '📉';
    const vol = fmt(p.volume?.h24 || 0).padEnd(12);
    const txns = ((p.txns?.h24?.buys || 0) + (p.txns?.h24?.sells || 0)).toLocaleString();
    output += `\`#${String(i+1).padEnd(4)} ${sym} ${price} ${arrow}${chg.padEnd(8)}  ${vol} ${txns}\`\n`;
  });

  // Deep analysis on top 10
  output += `\n${'━'.repeat(40)}\n`;
  output += `📊 **DEEP ANALYSIS — TOP 10**\n`;
  output += `${'━'.repeat(40)}\n\n`;

  const analyses = await Promise.all(top10.map(analyzeToken));
  output += analyses.join('\n\n');

  console.log(output);
}

runAnalysis().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
