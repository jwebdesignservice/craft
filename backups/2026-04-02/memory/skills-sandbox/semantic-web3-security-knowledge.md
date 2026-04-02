---
name: web3-security-knowledge
description: Complete reference on Web3 and Solana attack vectors, red flags, and on-chain security patterns — load this and your agent can actually protect users from scams
type: semantic
domain_tags: ["security", "scams", "web3", "solana", "auditing", "rug-pulls", "phishing"]
price_sol: 0.20
---

# Web3 Security Knowledge — Semantic Memory

## What This Gives You

An agent loaded with this memory can identify scams, explain exploit mechanics, audit contracts for red flags, and give users actionable protection advice. This is the difference between a Web3 agent that accidentally endorses rugs and one that catches them.

---

## Part 1: Solana-Specific Attack Vectors

### 1.1 Transaction Simulation Attacks
**How it works:** Malicious dApps show users a simulated transaction that looks benign (e.g., "Approve to claim airdrop") but the actual on-chain transaction drains tokens or grants unlimited authority.

**Red flags:**
- dApp uses a custom RPC — simulations can be manipulated at the RPC level
- Transaction requests `setAuthority` on your token accounts
- "Simulate" button not available before signing
- Very high compute unit limit requested (1.4M CU) for a simple action

**Protection:**
- Always simulate on a trusted RPC before signing
- Use wallets with transaction inspection (Backpack, Phantom transaction preview)
- Never sign transactions prompted by pop-ups you didn't initiate

---

### 1.2 Drainer Contracts (Solana Drainers)
**How it works:** User connects wallet to malicious site. Site requests signature for a transaction that:
1. Transfers all SOL from wallet
2. Transfers all SPL token balances
3. Closes token accounts (recovering rent, sending to attacker)
4. Burns NFTs (if attacker wants to prevent recovery)

**Common vectors:** Fake NFT minting sites, fake airdrop claims, fake DEX frontends, compromised Discord links.

**Technical mechanism:**
```
Malicious program calls:
- system_program::transfer (all SOL)
- spl_token::transfer (each token)
- spl_token::close_account (each token account → rent to attacker)
```

**Protection:**
- Verify dApp domain matches official source (bookmark, don't Google)
- Use a burner wallet for new dApp interactions
- Set a hardware wallet (Ledger) as final approver for large holdings
- Never approve transactions with `closeAccount` you didn't initiate

---

### 1.3 Fake Token Attacks
**How it works:** Attacker mints a token with the same name/symbol as a legitimate one (e.g., "USDC" or "JUP") and airdrops it to wallets. Users see "free USDC" and try to swap it — the swap approval either drains their wallet or the swap silently fails after approval is granted.

**Identification:**
- Check mint address against official sources (CoinGecko, protocol docs)
- Legitimate USDC mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- Legitimate USDT mint: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`
- Legitimate SOL (wSOL): `So11111111111111111111111111111111111111112`

**Rule:** If you can't verify the mint address against an official source, the token is suspect.

---

### 1.4 Memo/Reference Scams
**How it works:** Attacker sends tiny SOL (0.001) with a memo: "You've won! Claim your prize at [fake-domain].com". Victim goes to site, connects wallet, gets drained.

**Protection:** Unsolicited inbound transactions with memos or links = guaranteed scam. Ignore and block sender.

---

### 1.5 Validator Impersonation
**How it works:** Fake validators with legitimate-sounding names promise higher APY. User delegates stake to them. Attacker can: charge 100% commission (takes all rewards), or simply never vote (user earns 0).

**Protection:**
- Delegate only to validators with public identity (website, Twitter, track record)
- Check commission rate (legitimate validators: 0–10%)
- Check vote rate (should be >95%)
- Use Marinade or Jito for automated validator selection

---

## Part 2: Universal Web3 Scam Patterns

### 2.1 Rug Pull Taxonomy

**Hard Rug:** Developer drains liquidity pool and disappears. Token price goes to zero instantly.
- *Indicators:* LP not locked, anonymous team, no audit, sudden large buys to pump before exit

**Slow Rug:** Developers gradually sell their allocation. Price declines over weeks.
- *Indicators:* Dev wallet has large % of supply, no vesting schedule, roadmap items never delivered

**Soft Rug:** Project abandoned without formal exit. Team stops communicating.
- *Indicators:* Discord/Twitter goes silent, GitHub last commit months ago, no product shipped

**Exit Scam:** Project raises funds (IDO, NFT mint, VC) then disappears.
- *Indicators:* Anonymous team, no legal entity, no KYC of founders, too-good returns promised

---

### 2.2 The 7 Red Flags (Pre-Investment Checklist)

| Flag | Check | Danger signal |
|------|-------|--------------|
| Team | Public identities? | Anonymous = higher risk |
| Audit | Contract audited? | No audit = unreviewed code |
| LP | Liquidity locked? | Unlocked LP = rug risk |
| Tokenomics | % held by team? | >20% team allocation without vesting = dump risk |
| Whitepaper | Specific, technical? | Vague/plagiarised = red flag |
| Social proof | Organic community? | Bot followers, fake engagement = coordinated pump |
| Contract | Verified on-chain? | Unverified source = hidden functionality |

---

### 2.3 Social Engineering Attacks

**Discord DM scam:** "Congrats, you've been selected for our whitelist. Claim here: [link]"
*Rule:* Legitimate projects never DM first about claims. Never.

**"Support" impersonation:** Fake mod or team member DMs after you post in public support channel.
*Rule:* Real support happens in public channels, not DMs.

**Twitter impersonation:** Fake accounts reply to official tweets with "Mint is live at [link]"
*Rule:* Bookmark official sites. Never click links from replies, even if the account looks real.

**Fake collab announcement:** "We're partnering with [Tier-1 project]" — unverified, used to pump price.
*Rule:* Check the Tier-1 project's official account. Did they announce it too?

---

## Part 3: Smart Contract Red Flags

### Solana Program Red Flags

```rust
// RED FLAG 1: Admin can drain any account
pub fn admin_withdraw(ctx: Context<AdminWithdraw>, amount: u64) -> Result<()> {
    // No signer check — anyone can call this if they know the program
    transfer(from: user_vault, to: attacker, amount)
}

// RED FLAG 2: Unchecked account ownership
pub fn process(ctx: Context<Process>) -> Result<()> {
    // Never checks ctx.accounts.mint.owner — could be a spoofed account
    let supply = ctx.accounts.mint.supply;
}

// RED FLAG 3: Integer overflow (pre-checked-math programs)
let new_balance = user_balance + reward_amount; // Overflows if sum > u64::MAX
```

### Signs of a Well-Audited Program
- Anchor framework used (reduces boilerplate vulnerability surface)
- All instructions use `has_one` and `constraint` checks
- No `unwrap()` without explicit error handling
- No direct lamport transfers bypassing SPL token program
- Upgrade authority renounced (immutable) OR held by multisig (Squads)
- Open source on GitHub with recent commits

---

## Part 4: Recovery Procedures

### If Wallet is Drained
1. **Do NOT reuse the compromised wallet.** Create a new one immediately.
2. Check if any accounts remain that haven't been closed (some drainers miss staked SOL, vesting accounts).
3. Report the drainer contract address on https://scamsniffer.io and in relevant Discord servers.
4. Document the transaction signatures — useful for any law enforcement report.
5. If significant loss (>$10k): Contact Chainalysis or TRM Labs. On-chain forensics have recovered funds in some cases.

### If You Approved a Bad Transaction
If you approved `setAuthority` to an attacker, they can drain at any time. Act immediately:
1. Revoke authority: use https://revoke.cash (EVM) or https://sol-incinerator.com (Solana)
2. Transfer remaining assets to a new wallet before attacker acts
3. Close all compromised token accounts

---

## Part 5: Security Tooling Reference

| Tool | Purpose | URL |
|------|---------|-----|
| Revoke.cash | Revoke EVM approvals | revoke.cash |
| Sol Incinerator | Close/burn Solana accounts | sol-incinerator.com |
| Rugcheck.xyz | Solana token risk scoring | rugcheck.xyz |
| RugDoc | Cross-chain audit database | rugdoc.io |
| De.Fi Shield | Portfolio risk scanner | de.fi |
| Scam Sniffer | Real-time phishing detection | scamsniffer.io |
| Solana FM | Deep transaction inspection | solana.fm |
| Sec3 | Solana program auditor | sec3.dev |
| OtterSec | Solana/Aptos auditor | osec.io |
| Neodyme | Premier Solana security firm | neodyme.io |
