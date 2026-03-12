import httpx

HELIUS     = "https://devnet.helius-rpc.com/?api-key=66c1ed67-8a73-4aa5-8498-668b8b78776d"
TREASURY   = "7URzyhXwZQytVf6PBKPiUHnGFFUMrKc3FMQU77PDgxUn"
STAKE_POOL = "2Kt9EHiShox6jADUihz45EHMauYJZTbcmuvBnzwAQQBe"
JMOON      = "4YAurT42wEVTyVrhGx7m5sJ87HrmrVBqCEY2Y714SyRK"
PREV_SIG   = "4hLLDK2m3hzg2rh6EESBByVSu9DHgFHCFU5dm8XvZgtBdgd6pkN1kdCfeq7cqHvazgJRxwyKB2No5nswxzeG2xV1"

def get_latest_sig(addr):
    r = httpx.post(HELIUS, json={"jsonrpc":"2.0","id":1,"method":"getSignaturesForAddress","params":[addr,{"limit":1}]}, timeout=10)
    sigs = r.json().get("result", [])
    return sigs[0].get("signature") if sigs else None

def get_tx(sig):
    r = httpx.post(HELIUS, json={"jsonrpc":"2.0","id":1,"method":"getTransaction","params":[sig,{"encoding":"jsonParsed","commitment":"confirmed","maxSupportedTransactionVersion":0}]}, timeout=10)
    return r.json().get("result")

with httpx.Client(timeout=15) as c:
    # Find new tx on JMoon wallet
    jmoon_sig = get_latest_sig(JMOON)
    treasury_sig = get_latest_sig(TREASURY)

    print("=== Post-Purchase Verification ===\n")

    # Check JMoon wallet
    if jmoon_sig:
        print(f"JMoon wallet NEW tx: {jmoon_sig[:50]}")
        print(f"Explorer: https://explorer.solana.com/tx/{jmoon_sig}?cluster=devnet\n")
    else:
        print("JMoon wallet: no transactions yet\n")

    # Use treasury latest tx to find the purchase
    new_tx_sig = jmoon_sig or (treasury_sig if treasury_sig != PREV_SIG else None)

    if not new_tx_sig:
        print("No new transaction found yet — try again in a few seconds")
        exit()

    # Parse the transaction
    tx = get_tx(new_tx_sig)
    if not tx:
        print("Transaction not found on-chain yet")
        exit()

    meta = tx.get("meta", {})
    pre  = meta.get("preBalances", [])
    post = meta.get("postBalances", [])
    keys = tx.get("transaction", {}).get("message", {}).get("accountKeys", [])

    print(f"Transaction breakdown:")
    print(f"{'Account':<52} {'Change':>12}  Role")
    print("-" * 75)

    changes = {}
    for i, key in enumerate(keys):
        addr = key if isinstance(key, str) else key.get("pubkey", "?")
        if i < len(pre) and i < len(post):
            diff = (post[i] - pre[i]) / 1e9
            if abs(diff) > 0.000001:
                role = ""
                if addr == TREASURY:   role = "TREASURY (4%)"
                elif addr == STAKE_POOL: role = "STAKE POOL (1%)"
                elif addr == JMOON:    role = "JMOON SELLER (95%)"
                else:                  role = "buyer"
                print(f"  {addr[:48]:<50} {diff:>+10.5f}  {role}")
                changes[addr] = diff

    # Summary
    buyer_paid = abs(min(changes.values())) if changes else 0
    jmoon_got  = changes.get(JMOON, 0)
    treas_got  = changes.get(TREASURY, 0)
    pool_got   = changes.get(STAKE_POOL, 0)

    print(f"\n{'='*55}")
    print(f"  SPLIT RESULT")
    print(f"{'='*55}")
    if buyer_paid > 0:
        print(f"  Buyer paid:     {buyer_paid:.5f} SOL")
        print(f"  Seller (JMoon): {jmoon_got:.5f} SOL  ({jmoon_got/buyer_paid*100:.1f}%)  {'PASS' if abs(jmoon_got/buyer_paid - 0.95) < 0.02 else 'CHECK'}")
        print(f"  Treasury:       {treas_got:.5f} SOL  ({treas_got/buyer_paid*100:.1f}%)  {'PASS' if abs(treas_got/buyer_paid - 0.04) < 0.02 else 'CHECK'}")
        print(f"  Stake pool:     {pool_got:.5f} SOL  ({pool_got/buyer_paid*100:.1f}%)  {'PASS' if abs(pool_got/buyer_paid - 0.01) < 0.005 else 'CHECK'}")
