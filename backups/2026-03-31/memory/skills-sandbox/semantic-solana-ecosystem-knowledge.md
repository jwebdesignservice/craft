---
name: solana-ecosystem-knowledge
description: Deep factual knowledge of the Solana blockchain ecosystem — protocols, tokenomics, validators, and infrastructure — ready to load into any agent
type: semantic
domain_tags: ["solana", "blockchain", "defi", "ecosystem", "web3", "crypto"]
price_sol: 0.15
---

# Solana Ecosystem Knowledge — Semantic Memory

## What This Gives You

A structured knowledge base covering the Solana ecosystem that an agent can load and reason from immediately. No hallucination about protocol details, no gaps on how validators work, no confusion about token standards. Ground truth, as of Q1 2025.

---

## Layer 1: The Chain

### Core Architecture
- **Consensus:** Proof of History (PoH) + Tower BFT (a variant of PBFT)
- **Block time:** ~400ms average (400–800ms in practice)
- **Throughput:** 65,000 TPS theoretical; 2,000–5,000 TPS observed on mainnet
- **Finality:** Optimistic ~400ms; hard finality ~12.8 seconds (32 confirmations)
- **Transaction cost:** Base fee 5,000 lamports (~$0.0005 at $100 SOL). Priority fees dynamic based on compute unit market.
- **Compute units:** Each instruction has a CU cost. Default limit: 200,000 CU/tx. Max: 1,400,000 CU/tx.

### Account Model
Solana uses an account-based model (not UTXO). Key distinctions:
- **Programs** are stateless. All state lives in **data accounts**.
- Every account has a `lamport` balance, `owner` program, and `data` field.
- **Rent:** Accounts must maintain a minimum balance (~0.00203928 SOL for 128 bytes) to be rent-exempt. Below this, accounts are purged.
- **PDAs (Program Derived Addresses):** Deterministic addresses derived from a seed + program ID. No private key. Used for escrow, vaults, state.

### Token Standards
- **SPL Token:** The standard. Analogous to ERC-20. Each token has a `Mint` account and users hold `Token Accounts`.
- **Token-2022 (Token Extensions):** Newer standard. Adds: transfer fees, confidential transfers, interest-bearing tokens, metadata on mint, transfer hooks.
- **Metaplex NFT Standard:** `Metadata` account attached to SPL token with `supply=1`. `MasterEdition` for limited editions.
- **cNFTs (Compressed NFTs):** State stored in Merkle tree via Bubblegum. 1 million NFTs for ~$110 vs ~$27,000 for uncompressed.

---

## Layer 2: Core Infrastructure

### RPC Providers
| Provider | Free Tier | Notes |
|----------|-----------|-------|
| Helius | 100k req/day | Best for devs; has DAS API for NFTs |
| QuickNode | 10M credits/mo | Reliable; good for production |
| Alchemy | 300M compute units/mo | Strong Ethereum heritage |
| Triton | Paid only | Best raw performance |
| Public RPC (`api.mainnet-beta.solana.com`) | Unlimited but rate-limited | Unstable for production |

**DAS (Digital Asset Standard) API:** Helius, QuickNode, and others implement this. Single API to query NFTs, cNFTs, token accounts, without raw account parsing.

### Wallets
- **Phantom:** Most popular consumer wallet. Browser extension + mobile. Multi-chain (SOL + ETH + BTC).
- **Backpack:** xNFT wallet. Supports embedded apps inside the wallet.
- **Solflare:** Strong staking UI. Hardware wallet support (Ledger).
- **Squads:** Multisig wallet. The standard for DAOs and teams. V4 is current.
- **Tiplink:** Wallet-as-link. No app required. Good for onboarding.

### Block Explorers
- **Solscan:** Most used. Good for token analytics.
- **SolanaFM:** Better for program/instruction-level inspection.
- **Explorer.solana.com:** Official. Verbose but complete.
- **Xray:** By Helius. Best UX; human-readable transaction descriptions.

---

## Layer 3: DeFi Protocols

### DEXes (Decentralised Exchanges)

**Raydium**
- AMM + CLMM (Concentrated Liquidity Market Maker)
- Integrated with OpenBook orderbook
- Key pools: SOL/USDC, SOL/USDT
- Fee tiers: 0.01%, 0.05%, 0.25%, 1%
- LaunchLab: token launch platform

**Orca**
- Whirlpools = CLMM pools (same model as Uniswap V3)
- Strong UI; good for retail LPs
- Fee tiers: 0.01%, 0.05%, 0.3%, 1%, 2%

**Jupiter**
- Aggregator routing across all DEXes
- Not a DEX itself — finds best swap path
- DCA (Dollar Cost Average) built in
- Perps (leverage trading) via Jupiter Perps program
- Current swap volume: #1 by far on Solana

**Meteora**
- Dynamic liquidity vaults (DLMM)
- Binned liquidity model — LPs earn more when price is in their range
- Popular for new token launches

### Lending/Borrowing

**Kamino Finance**
- Auto-compounding liquidity strategies + lending
- kTokens represent LP positions
- Borrow against LP positions

**MarginFi**
- Permissionless lending pools
- mrgn points program (airdrop farming)
- Flash loans available

**Solend (now Solayer)**
- Original Solana lending protocol
- Now focused on restaking (sSol)

### Liquid Staking

**Marinade Finance**
- mSOL: liquid staking token for native SOL stake
- ~8% of all staked SOL
- ~6.5–7% APY (varies)
- Native stake pool: spread across 100+ validators

**Jito**
- JitoSOL: liquid staking with MEV yield
- ~6.8–8% APY (includes MEV tips)
- JTO governance token
- Bundles: MEV infrastructure used by most validators

**Sanctum**
- LST aggregator/liquidity layer
- Allows any validator to have liquid staking
- INF: infinite LST liquidity pool

---

## Layer 4: NFT Ecosystem

### Marketplaces
- **Tensor:** #1 by volume. Pro-grade UI. Points/airdrop farming.
- **Magic Eden:** Most recognised brand. Multi-chain (SOL + ETH + BTC + Polygon).
- **Dialect:** Social layer + stickers/messages tied to NFTs.

### Key Collections (by floor and cultural relevance, Q1 2025)
- **Mad Lads:** By Backpack team. High floor (~100+ SOL). Status symbol.
- **Okay Bears:** First SOL blue-chip. Floor ~15 SOL.
- **DeGods:** Controversial. Migrated to ETH, then back to SOL (partially).
- **Claynosaurz:** High quality art. Strong community.
- **SMB (Solana Monkey Business):** OG collection. High floor.

---

## Layer 5: Key Numbers to Know

| Metric | Value (Q1 2025) |
|--------|----------------|
| Total validators | ~1,700 active |
| Nakamoto coefficient | ~32 (top 32 validators = 33% stake) |
| Total staked SOL | ~390M SOL (~65% of supply) |
| SOL supply | ~570M circulating |
| Avg transactions/day | ~80–100M (including votes) |
| Non-vote transactions/day | ~30–50M |
| TVL (DeFi) | ~$5–8B (varies) |

---

## Layer 6: Common Misconceptions to Correct

**"Solana has high fees"** — Wrong. Fees are fractions of a cent. Priority fees during congestion can reach $0.01–0.05 but rarely more.

**"Solana goes down a lot"** — Historically true (2021–2022). Post-QUIC + scheduler updates, mainnet has been stable since Feb 2023. Not a fair critique of current state.

**"Solana is centralised"** — Partially valid concern (Nakamoto coefficient ~32 vs ETH ~50+). But no single entity controls the chain. Ongoing validator set growth.

**"Solana is just for memecoins"** — Retail perception. Institutional DeFi (Kamino, MarginFi) is substantial. Payments (Solana Pay, Visa pilot) growing.

**"SPL tokens are like ERC-20"** — Similar in concept. Key difference: every token transfer requires the receiver to have a Token Account pre-created (or the sender creates it, paying rent). This surprises devs coming from EVM.
