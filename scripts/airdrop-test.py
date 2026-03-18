import httpx, time

wallet = "F1tXWH5dADubAYbHhSHAfVMCJXRdheWVBDZ6PiBCFv7o"

endpoints = [
    "https://rpc.ankr.com/solana_devnet",
    "https://devnet.genesysgo.net",
    "https://api.devnet.solana.com",
]

for ep in endpoints:
    try:
        r = httpx.post(ep, json={"jsonrpc":"2.0","id":1,"method":"requestAirdrop","params":[wallet, 500_000_000]}, timeout=8)
        res = r.json()
        sig = res.get("result")
        if sig:
            print(f"Airdrop OK via {ep}")
            print(f"  tx: {sig}")
            time.sleep(6)
            # Confirm balance
            r2 = httpx.post(ep, json={"jsonrpc":"2.0","id":1,"method":"getBalance","params":[wallet]}, timeout=8)
            bal = r2.json().get("result",{}).get("value",0)
            print(f"  Balance: {bal/1e9} SOL")
            break
        else:
            print(f"{ep}: {res.get('error',{}).get('message','failed')}")
    except Exception as e:
        print(f"{ep}: {str(e)[:60]}")
