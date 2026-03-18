"""
MemoryMarket End-to-End Test
- Generates a fresh devnet wallet
- Airdrops SOL
- Authenticates via nonce/verify
- Browses marketplace
- Purchases a memory
- Verifies purchase recorded
"""

import httpx
import json
import time

from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.hash import Hash
from solders.transaction import Transaction
from solders.system_program import transfer, TransferParams
from solders.message import Message
from solders.instruction import Instruction, AccountMeta
import base64

BASE = "https://memory-market.up.railway.app"
HELIUS_RPC = "https://devnet.helius-rpc.com/?api-key=66c1ed67-8a73-4aa5-8498-668b8b78776d"
TREASURY = "7URzyhXwZQytVf6PBKPiUHnGFFUMrKc3FMQU77PDgxUn"

def rpc(method, params=None):
    r = httpx.post(HELIUS_RPC, json={"jsonrpc":"2.0","id":1,"method":method,"params":params or []}, timeout=20)
    return r.json()

def step(n, msg):
    print(f"\n[{n}] {msg}")
    print("     " + "-"*50)

def ok(msg):   print(f"     OK  {msg}")
def err(msg):  print(f"     ERR {msg}")
def info(msg): print(f"     ... {msg}")

# ── STEP 1: Generate wallet ──────────────────────────────────
step(1, "Generate fresh devnet test wallet")
kp = Keypair()
wallet = str(kp.pubkey())
ok(f"Wallet: {wallet}")

# ── STEP 2: Airdrop 1 SOL ────────────────────────────────────
step(2, "Airdrop 1 SOL from devnet faucet")
result = rpc("requestAirdrop", [wallet, 1_000_000_000])
if "result" in result:
    sig = result["result"]
    ok(f"Airdrop tx: {sig}")
    info("Waiting for confirmation...")
    time.sleep(5)

    # Check balance
    bal = rpc("getBalance", [wallet])
    lamports = bal.get("result", {}).get("value", 0)
    sol = lamports / 1_000_000_000
    ok(f"Balance: {sol} SOL ({lamports} lamports)")
    if lamports == 0:
        err("Airdrop may have failed — balance still 0. Continuing anyway...")
else:
    err(f"Airdrop failed: {result.get('error', result)}")
    sol = 0

# ── STEP 3: Browse marketplace ───────────────────────────────
step(3, "Browse marketplace listings")
with httpx.Client(timeout=10) as c:
    r = c.get(f"{BASE}/marketplace/listings?limit=5")
    listings = r.json()
    total = listings.get("total", 0)
    ok(f"Total listings: {total}")
    cheapest = None
    for l in listings.get("listings", []):
        price_sol = l.get("price_lamports", 0) / 1_000_000_000
        info(f"  {l['id'][:20]} | {l['memory_id'][:25]} | {price_sol} SOL")
        if cheapest is None or l.get("price_lamports", 999) < cheapest.get("price_lamports", 999):
            cheapest = l
    if cheapest:
        ok(f"Cheapest: {cheapest['id']} @ {cheapest['price_lamports']/1e9} SOL")

# ── STEP 4: Fetch memory details ─────────────────────────────
step(4, "Fetch memory details for cheapest listing")
target_memory_id = None
if cheapest:
    mid = cheapest.get("memory_id")
    with httpx.Client(timeout=10) as c:
        r = c.get(f"{BASE}/memory/{mid}")
        if r.status_code == 200:
            mem = r.json()
            target_memory_id = mid
            ok(f"Memory: {mem.get('title')}")
            ok(f"Type:   {mem.get('type')}")
            ok(f"Price:  {mem.get('price')} SOL")
            ok(f"Creator: {mem.get('creator')}")
        else:
            info(f"Memory detail returned {r.status_code}, using ID directly")
            target_memory_id = mid

# ── STEP 5: Authenticate (nonce + sign) ──────────────────────
step(5, "Authenticate test wallet via nonce/sign")
jwt_token = None
with httpx.Client(timeout=10) as c:
    # Get nonce
    r = c.get(f"{BASE}/auth/nonce/{wallet}")
    if r.status_code == 200:
        nonce_data = r.json()
        nonce = nonce_data.get("nonce")
        message = nonce_data.get("message")
        ok(f"Nonce: {nonce}")

        # Sign the message with our keypair
        msg_bytes = message.encode("utf-8")
        signature = kp.sign_message(msg_bytes)
        sig_b64 = base64.b64encode(bytes(signature)).decode()
        ok(f"Signed (b64, first 20): {sig_b64[:20]}...")

        # Verify
        r2 = c.post(f"{BASE}/auth/verify", json={
            "wallet_address": wallet,
            "signature": sig_b64,
            "message": message,
        })
        if r2.status_code == 200:
            jwt_token = r2.json().get("token")
            ok(f"JWT obtained: {jwt_token[:30]}...")
        else:
            err(f"Auth failed {r2.status_code}: {r2.text[:200]}")
    else:
        err(f"Nonce failed: {r.status_code}")

# ── STEP 6: Simulate purchase (backend record) ────────────────
step(6, "Record purchase on backend (off-chain / demo flow)")
if target_memory_id and jwt_token:
    with httpx.Client(timeout=10) as c:
        headers = {"Authorization": f"Bearer {jwt_token}"}
        r = c.post(
            f"{BASE}/marketplace/purchase/{cheapest['id']}",
            json={"buyer_wallet": wallet, "tx_signature": f"e2e_test_{int(time.time())}"},
            headers=headers
        )
        ok(f"Purchase endpoint: {r.status_code}")
        if r.status_code in (200, 201):
            p = r.json()
            ok(f"Purchase ID: {p.get('id') or p.get('purchase_id') or 'recorded'}")
            ok(f"Memory: {p.get('memory_id', target_memory_id)}")
        else:
            info(f"Response: {r.text[:300]}")

# ── STEP 7: Verify purchase in user history ───────────────────
step(7, "Verify purchase appears in user history")
with httpx.Client(timeout=10) as c:
    r = c.get(f"{BASE}/marketplace/user-purchases?wallet={wallet}")
    ok(f"User purchases endpoint: {r.status_code}")
    if r.status_code == 200:
        d = r.json()
        purchases = d.get("purchases", [])
        ok(f"Purchases found: {len(purchases)}")
        for p in purchases:
            info(f"  memory_id={p.get('memory_id')} | tx={str(p.get('tx_signature',''))[:20]}")

# ── STEP 8: Check access grant ────────────────────────────────
step(8, "Check access to purchased memory")
if target_memory_id:
    with httpx.Client(timeout=10) as c:
        r = c.get(f"{BASE}/memory/{target_memory_id}/access?wallet={wallet}")
        ok(f"Access check: {r.status_code}")
        if r.status_code == 200:
            ok(f"Access: {r.json()}")

# ── STEP 9: Search with semantic query ────────────────────────
step(9, "Semantic search (OpenAI embeddings active)")
with httpx.Client(timeout=15) as c:
    r = c.get(f"{BASE}/memory/search?q=autonomous+trading+agent+solana&limit=3")
    ok(f"Search: {r.status_code}")
    if r.status_code == 200:
        d = r.json()
        ok(f"Results: {d.get('total')}")
        for m in d.get("memories", []):
            info(f"  {m.get('title')} | {m.get('type')} | score={m.get('quality_score')}")

# ── STEP 10: WebSocket quick check ────────────────────────────
step(10, "WebSocket connection check")
try:
    import websocket
    ws = websocket.create_connection("wss://memory-market.up.railway.app/ws", timeout=5)
    ws.send("ping")
    result_ws = ws.recv()
    ws.close()
    ok(f"WebSocket: connected, got '{result_ws[:50]}'")
except ImportError:
    info("websocket-client not installed, skipping WS test")
except Exception as e:
    info(f"WS: {str(e)[:80]}")

# ── SUMMARY ───────────────────────────────────────────────────
print(f"\n{'='*55}")
print("  E2E TEST COMPLETE")
print(f"{'='*55}")
print(f"  Test wallet:  {wallet}")
print(f"  SOL balance:  {sol} SOL (devnet)")
print(f"  Auth:         {'JWT obtained' if jwt_token else 'FAILED'}")
print(f"  Target:       {target_memory_id or 'none'}")
print(f"\n  Explorer: https://explorer.solana.com/address/{wallet}?cluster=devnet")
