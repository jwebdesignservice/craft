---
name: token-launch-intelligence
description: Complete knowledge for AI agents to deploy and manage ERC-20 tokens on Base using Uniswap V4 pools with built-in MEV protection and configurable fee distribution. Covers token deployment, swapping, liquidity management, fee claiming, portfolio tracking, and cross-chain DeFi via Wayfinder. Use when an agent needs to launch a token, manage liquidity, execute swaps, or monitor on-chain DeFi positions on Base.
type: procedural
domain_tags: ["defi", "base", "erc20", "token-launch", "uniswap", "mev", "liquidity", "swaps", "on-chain"]
price_sol: 0.20
source: "Clawncher by clawn.ch (https://clawn.ch/er/skill.md)"
---

# Token Launch Intelligence

Deploy ERC-20 tokens on Base with Uniswap V4 pools, MEV protection, and configurable fee distribution.

---

## Install

```bash
npm install @clawnch/clawncher-sdk viem
npm install -g clawncher   # CLI
```

---

## Deploy a Token

```typescript
import { ClawnchApiDeployer } from '@clawnch/clawncher-sdk';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY');
const wallet = createWalletClient({ account, chain: base, transport: http() });
const publicClient = createPublicClient({ chain: base, transport: http() });

const deployer = new ClawnchApiDeployer({ apiKey: 'your-api-key', wallet, publicClient, network: 'mainnet' });

const result = await deployer.deploy({
  name: 'My Token',
  symbol: 'MYTKN',
  image: 'https://example.com/logo.png',
  description: 'Token deployed via Clawncher',
  rewards: {
    recipients: [
      { recipient: '0xDeployer...', admin: '0xDeployer...', bps: 8000, feePreference: 'Paired' },
    ],
  },
});
console.log('Token deployed:', result.tokenAddress);
```

### First-time Setup
```typescript
// Register agent (one-time, returns API key)
const { apiKey } = await ClawnchApiDeployer.register({ wallet, publicClient }, {
  name: 'MyAgent',
  wallet: account.address,
  description: 'An AI agent that launches tokens',
});

// Approve $CLAWNCH spend (one-time)
await deployer.approveClawnch();
// Note: 100 CLAWNCH burned per deploy
```

### CLI Deploy
```bash
clawncher deploy --name "My Token" --symbol MYTKN --network mainnet --private-key 0x...
```

---

## Swap Tokens

```typescript
import { ClawnchSwapper, NATIVE_TOKEN_ADDRESS } from '@clawnch/clawncher-sdk';
const swapper = new ClawnchSwapper({ wallet, publicClient });

// Get price
const price = await swapper.getPrice({
  sellToken: NATIVE_TOKEN_ADDRESS,
  buyToken: '0xTokenAddress...',
  sellAmount: parseEther('0.01'),
});

// Execute swap
const result = await swapper.swap({
  sellToken: NATIVE_TOKEN_ADDRESS,
  buyToken: '0xTokenAddress...',
  sellAmount: parseEther('0.01'),
  slippageBps: 100,  // 1%
});
```

```bash
clawncher swap --sell ETH --buy 0xToken... --amount 0.01 --network mainnet
```

---

## Claim Fees

```typescript
import { ClawncherClaimer } from '@clawnch/clawncher-sdk';
const claimer = new ClawncherClaimer({ wallet, publicClient, network: 'mainnet' });

await claimer.claimAll('0xTokenAddress...', account.address);         // Collect + claim everything
await claimer.claimBatch(tokens, feeOwner, { onProgress });           // Batch claim
```

```bash
clawncher fees claim 0xToken... --network mainnet --private-key 0x...
clawncher fees check 0xWallet... -t 0xToken1,0xToken2
```

---

## Liquidity Management

```typescript
import { ClawnchLiquidity } from '@clawnch/clawncher-sdk';
const liquidity = new ClawnchLiquidity({ wallet, publicClient });

// Mint V3 position
const mint = await liquidity.v3MintPosition({
  token0: '0x...', token1: '0x...', fee: 3000,
  tickLower: -887220, tickUpper: 887220,
  amount0Desired: parseEther('1000'),
  amount1Desired: parseEther('0.1'),
});

await liquidity.v3AddLiquidity(mint.tokenId, { amount0Desired: parseEther('500'), amount1Desired: parseEther('0.05') });
await liquidity.v3RemoveLiquidity(mint.tokenId, { percentageToRemove: 0.5 });
await liquidity.v3CollectFees(mint.tokenId);
```

---

## Portfolio & Watching

```typescript
import { ClawnchPortfolio, ClawnchWatcher } from '@clawnch/clawncher-sdk';

const portfolio = new ClawnchPortfolio({ publicClient, network: 'mainnet' });
const claimable = await portfolio.getTotalClaimable('0xWallet...', ['0xToken1...']);

const watcher = new ClawnchWatcher({ publicClient, network: 'mainnet' });
watcher.watchDeployments((event) => {
  console.log(`New token: ${event.tokenSymbol} at ${event.tokenAddress}`);
});
```

```bash
clawncher watch --network mainnet
```

---

## MEV Protection

Descending fee curve at launch prevents sandwich attacks:
- **80%** fee at t=0 ? decays to **5%** over 30 seconds
- After decay: normal 1% LP rewards only

---

## Fee Structure

- 1% LP rewards on every swap
- 80% to deployer (configurable, up to 7 recipients)
- 20% protocol

---

## Token Deploy Options

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ? | Token name |
| `symbol` | ? | Token symbol |
| `rewards` | ? | Fee recipients (bps sum max 8000) |
| `image` | optional | Logo URL |
| `vault` | optional | Token lockup (min 7 days) |
| `devBuy` | optional | Instant ETH buy at launch |

---

## Contract Addresses (Base Mainnet)

| Contract | Address |
|----------|---------|
| Factory | `0xE85A59c628F7d27878ACeB4bf3b35733630083a9` |
| Hook | `0xb429d62f8f3bFFb98CdB9569533eA23bF0Ba28CC` |
| LP Locker | `0x63D2DfEA64b3433F4071A98665bcD7Ca14d93496` |
| FeeLocker | `0xF3622742b1E446D92e45E22923Ef11C2fcD55D68` |
| MEV Module | `0xebB25BB797D82CB78E1bc70406b13233c0854413` |
