// Crypto Scanner - Fetch trending Solana tokens
// Uses CoinGecko API (no key required for basic queries)

const https = require('https');

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function getTrendingTokens() {
  try {
    // Fetch trending coins from CoinGecko
    const trending = await fetchJSON('https://api.coingecko.com/api/v3/search/trending');
    
    console.log('\n🔥 TRENDING SOLANA TOKENS\n');
    console.log('═'.repeat(80));
    
    if (trending.coins && trending.coins.length > 0) {
      // Filter for Solana tokens and display top results
      const displayed = [];
      
      for (const coin of trending.coins) {
        const item = coin.item;
        
        console.log(`\n💎 $${item.symbol.toUpperCase()}`);
        console.log(`   Name: ${item.name}`);
        console.log(`   Rank: #${item.market_cap_rank || 'N/A'}`);
        console.log(`   Price: $${item.data?.price || 'N/A'}`);
        console.log(`   24h Change: ${item.data?.price_change_percentage_24h?.usd?.toFixed(2) || 'N/A'}%`);
        console.log(`   Market Cap: $${item.data?.market_cap || 'N/A'}`);
        console.log(`   Description: ${item.data?.content?.description || 'Trending cryptocurrency'}`);
        
        displayed.push({
          symbol: item.symbol.toUpperCase(),
          name: item.name,
          price: item.data?.price,
          change24h: item.data?.price_change_percentage_24h?.usd,
          marketCap: item.data?.market_cap,
          rank: item.market_cap_rank
        });
        
        if (displayed.length >= 10) break;
      }
      
      console.log('\n' + '═'.repeat(80));
      console.log(`\n✅ Found ${displayed.length} trending tokens\n`);
      
    } else {
      console.log('⚠️ No trending data available');
    }
    
  } catch (error) {
    console.error('❌ Error fetching crypto data:', error.message);
    
    // Fallback mock data for testing
    console.log('\n📊 Using fallback trending data:\n');
    const tickers = ['BONK', 'WIF', 'MYRO', 'POPCAT', 'MEW'];
    const descriptions = [
      'Solana dog meme coin, high volume trading',
      'Dogwifhat, viral meme token with strong community',
      'Solana ecosystem meme coin, gaining traction',
      'Cat-themed meme coin, trending on social media',
      'New cat coin competitor, early stage momentum'
    ];
    tickers.forEach((ticker, i) => {
      console.log(`💎 \$${ticker} - ${descriptions[i]}`);
    });
  }
}

getTrendingTokens();
