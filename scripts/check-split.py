import httpx

HELIUS = "https://devnet.helius-rpc.com/?api-key=66c1ed67-8a73-4aa5-8498-668b8b78776d"
TREASURY = "7URzyhXwZQytVf6PBKPiUHnGFFUMrKc3FMQU77PDgxUn"
STAKE_POOL = "2Kt9EHiShox6jADUihz45EHMauYJZTbcmuvBnzwAQQBe"

# Most recent treasury transaction
TX_SIG = "4hLLDK2m3hzg2rh6EESBByVSu9DHgFHCFU5dm8XvZgtBdgd6pkN1kdCfeq7cqHvazgJRxwyKB2No5nswxzeG2xV1"

with httpx.Client(timeout=15) as c:
    r = c.post(HELIUS, json={
        "jsonrpc": "2.0", "id": 1,
        "method": "getTransaction",
        "params": [TX_SIG, {"encoding": "jsonParsed", "commitment": "confirmed", "maxSupportedTransactionVersion": 0}]
    })
    tx = r.json().get("result")

    if not tx:
        print("Transaction not found or expired from devnet history")
        exit()

    meta = tx.get("meta", {})
    pre  = meta.get("preBalances", [])
    post = meta.get("postBalances", [])
    keys = tx.get("transaction", {}).get("message", {}).get("accountKeys", [])

    print(f"Transaction: {TX_SIG[:30]}...\n")
    print(f"{'Account':<50} {'Change (SOL)':>14}")
    print("-" * 66)

    accounts = {}
    for i, key in enumerate(keys):
        addr = key if isinstance(key, str) else key.get("pubkey", "?")
        if i < len(pre) and i < len(post):
            diff = (post[i] - pre[i]) / 1e9
            if abs(diff) > 0.000001:
                label = ""
                if addr == TREASURY:   label = " ← TREASURY (4%)"
                elif addr == STAKE_POOL: label = " ← STAKE POOL (1%)"
                print(f"{addr[:46]:<50} {diff:>+14.6f} SOL{label}")
                accounts[addr] = diff

    print("\n--- Fee Split Analysis ---")
    total_out = sum(v for v in accounts.values() if v < 0 and list(accounts.keys())[list(accounts.values()).index(v)] not in [TREASURY, STAKE_POOL])
    treasury_in  = accounts.get(TREASURY, 0)
    stakepool_in = accounts.get(STAKE_POOL, 0)

    # Find buyer (largest negative change, excluding fee)
    buyer = min(accounts, key=lambda k: accounts[k])
    buyer_out = abs(accounts[buyer])

    if buyer_out > 0:
        print(f"Buyer paid:       {buyer_out:.6f} SOL")
        print(f"Treasury got:     {treasury_in:.6f} SOL  ({treasury_in/buyer_out*100:.1f}%)")
        print(f"Stake pool got:   {stakepool_in:.6f} SOL  ({stakepool_in/buyer_out*100:.1f}%)")
        seller_amount = buyer_out - treasury_in - stakepool_in - abs(meta.get('fee', 0)/1e9)
        print(f"Seller got:       ~{seller_amount:.6f} SOL  ({seller_amount/buyer_out*100:.1f}%)")
