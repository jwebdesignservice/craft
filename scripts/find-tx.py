import httpx, json

BASE = "https://memory-market.up.railway.app"
HELIUS = "https://devnet.helius-rpc.com/?api-key=66c1ed67-8a73-4aa5-8498-668b8b78776d"
TREASURY = "7URzyhXwZQytVf6PBKPiUHnGFFUMrKc3FMQU77PDgxUn"

print("=== Locating Purchase Transaction ===\n")

with httpx.Client(timeout=15) as c:
    # Check all indexed transactions with full detail
    r = c.get(f"{BASE}/webhooks/transactions?limit=20")
    txs = r.json().get("transactions", [])
    print(f"Indexed transactions: {len(txs)}")
    for tx in txs:
        sig = tx.get("signature","")
        if not sig.startswith("test_") and not sig.startswith("e2e_") and not sig.startswith("audit_"):
            print(f"\n  REAL TX FOUND:")
            print(f"  sig  : {sig}")
            print(f"  type : {tx.get('tx_type')}")
            print(f"  amt  : {tx.get('total_sol')} SOL")
            print(f"  actor: {tx.get('actor_wallet','?')[:30]}")
            print(f"  Explorer: https://explorer.solana.com/tx/{sig}?cluster=devnet")

    # Also check treasury wallet recent txs via Helius
    r2 = c.post(HELIUS, json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [TREASURY, {"limit": 5, "commitment": "confirmed"}]
    })
    sigs = r2.json().get("result", [])
    print(f"\nTreasury wallet recent txs: {len(sigs)}")
    for s in sigs:
        sig = s.get("signature","")
        slot = s.get("slot")
        err = s.get("err")
        status = "OK" if err is None else f"ERR: {err}"
        print(f"  {sig[:50]} | slot={slot} | {status}")
        if err is None:
            print(f"  Explorer: https://explorer.solana.com/tx/{sig}?cluster=devnet")
