import httpx

BASE = "https://memory-market.up.railway.app"
HELIUS = "https://devnet.helius-rpc.com/?api-key=66c1ed67-8a73-4aa5-8498-668b8b78776d"

print("=== Verifying Real Purchase ===\n")

with httpx.Client(timeout=15) as c:
    # Check recent purchases on backend
    r = c.get(f"{BASE}/marketplace/purchases/demo?limit=10")
    if r.status_code == 200:
        d = r.json()
        purchases = d.get("purchases", [])
        print(f"Total purchases recorded: {len(purchases)}")
        for p in purchases[-3:]:
            print(f"  memory_id : {p.get('memory_id')}")
            print(f"  buyer     : {p.get('buyer_wallet','?')[:20]}...")
            print(f"  tx        : {p.get('tx_signature','?')[:40]}")
            print()

    # Check indexed webhook transactions
    r2 = c.get(f"{BASE}/webhooks/transactions?limit=5")
    if r2.status_code == 200:
        d2 = r2.json()
        txs = d2.get("transactions", [])
        print(f"Indexed on-chain transactions: {len(txs)}")
        for tx in txs:
            print(f"  sig  : {str(tx.get('signature',''))[:40]}")
            print(f"  type : {tx.get('tx_type')}")
            print(f"  amt  : {tx.get('total_sol')} SOL")
            print()
