"""
Full MemoryMarket Audit Script
Verifies every endpoint and service connection from LAUNCH_CHECKLIST.md + APIS_AND_CONNECTIONS.md
"""
import httpx
import json

BASE = "https://memory-market.up.railway.app"
FRONTEND = "https://memory-market.vercel.app"
SECRET = "aa039e6b3b3641f4a6525a5e75df7c3c5fa119de52ee05ccc910416db147398d"
TREASURY = "7URzyhXwZQytVf6PBKPiUHnGFFUMrKc3FMQU77PDgxUn"

results = []

def check(label, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    results.append((status, label, detail))
    print(f"  [{status}] {label}" + (f" — {detail}" if detail else ""))

def section(name):
    print(f"\n{'='*55}")
    print(f"  {name}")
    print(f"{'='*55}")

with httpx.Client(timeout=12, follow_redirects=True) as c:

    # ── 1. ROOT & HEALTH ──────────────────────────────────────
    section("1. Root & Health")
    r = c.get(f"{BASE}/")
    check("GET /  (root health)", r.status_code == 200, f"status={r.status_code}")

    r = c.get(f"{BASE}/health")
    check("GET /health  200", r.status_code == 200)
    if r.status_code == 200:
        h = r.json()
        check("ENV=production", h.get("env") == "production", h.get("env"))
        check("database_configured=true", h.get("database_configured") is True)
        check("pgvector_enabled=true", h.get("pgvector_enabled") is True)
        check("ipfs=connected", h.get("ipfs") == "connected", h.get("ipfs"))
        check("solana_rpc set (Helius)", "helius" in str(h.get("solana_rpc", "")), h.get("solana_rpc","")[:40])

    # ── 2. /docs DISABLED ────────────────────────────────────
    section("2. Security — /docs disabled in production")
    r = c.get(f"{BASE}/docs")
    check("/docs is 404 (disabled)", r.status_code == 404, f"got {r.status_code}")

    # ── 3. CORS ───────────────────────────────────────────────
    section("3. CORS")
    r = c.options(f"{BASE}/health", headers={
        "Origin": "https://memory-market.vercel.app",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Authorization"
    })
    acao = r.headers.get("access-control-allow-origin", "")
    check("CORS allows memory-market.vercel.app", "memory-market.vercel.app" in acao, acao)
    acam = r.headers.get("access-control-allow-methods", "")
    check("CORS allows GET/POST/DELETE", all(m in acam for m in ["GET","POST","DELETE"]), acam)
    acah = r.headers.get("access-control-allow-headers", "")
    check("CORS allows Authorization header", "Authorization" in acah)
    check("CORS allows X-Wallet header", "X-Wallet" in acah)

    # ── 4. MEMORY ENDPOINTS ──────────────────────────────────
    section("4. Memory Endpoints")
    r = c.get(f"{BASE}/memory/search?q=solana&limit=3")
    check("GET /memory/search  200", r.status_code == 200)
    if r.status_code == 200:
        d = r.json()
        check("Search returns results", len(d.get("memories", [])) > 0, f"total={d.get('total')}")

    r = c.get(f"{BASE}/memory/demo-list")
    check("GET /memory/demo-list  200", r.status_code == 200, f"status={r.status_code}")

    r = c.get(f"{BASE}/memory/by-creator?wallet={TREASURY}")
    check("GET /memory/by-creator  200", r.status_code == 200, f"status={r.status_code}")

    # ── 5. MARKETPLACE ───────────────────────────────────────
    section("5. Marketplace Endpoints")
    r = c.get(f"{BASE}/marketplace/listings?limit=5")
    check("GET /marketplace/listings  200", r.status_code == 200)
    if r.status_code == 200:
        d = r.json()
        total = d.get("total", 0)
        check("Marketplace has listings", total > 0, f"total={total}")
        check("27 listings (18 seed + 9 JMoon)", total == 27, f"got {total}")

    r = c.get(f"{BASE}/marketplace/purchases/demo")
    check("GET /marketplace/purchases/demo  200", r.status_code == 200, f"status={r.status_code}")

    # ── 6. QUALITY / STAKING ─────────────────────────────────
    section("6. Quality & Staking Endpoints")
    r = c.get(f"{BASE}/quality/leaderboard?limit=5")
    check("GET /quality/leaderboard  200", r.status_code == 200, f"status={r.status_code}")

    r = c.get(f"{BASE}/quality/pool-stats")
    check("GET /quality/pool-stats  200", r.status_code == 200, f"status={r.status_code}")

    r = c.get(f"{BASE}/quality/metrics/mem_9dd5b756f17bb921")
    check("GET /quality/metrics/{id}  200", r.status_code == 200, f"status={r.status_code}")

    # ── 7. AGENT ENDPOINTS ──────────────────────────────────
    section("7. Agent Endpoints")
    # /agent/bootstrap requires wallet auth — verify it rejects unauthenticated calls correctly
    r = c.post(f"{BASE}/agent/bootstrap", json={"agent_id": "test_agent", "wallet": TREASURY})
    check("POST /agent/bootstrap auth-protected (422 without wallet headers)", r.status_code == 422, f"status={r.status_code}")

    # ── 8. AUTH ──────────────────────────────────────────────
    section("8. Auth Endpoints")
    r = c.get(f"{BASE}/auth/nonce/{TREASURY}")
    check("GET /auth/nonce/{wallet}  200", r.status_code == 200)
    if r.status_code == 200:
        nonce = r.json().get("nonce", "")
        check("Nonce returned (32 chars)", len(nonce) == 32, f"len={len(nonce)}")

    r = c.post(f"{BASE}/auth/verify", json={"wallet_address": TREASURY, "signature": "bad", "message": "x"})
    check("POST /auth/verify rejects bad sig (401)", r.status_code == 401, f"got {r.status_code}")

    # ── 9. WEBHOOKS ──────────────────────────────────────────
    section("9. Webhook & Indexer")
    r = c.get(f"{BASE}/webhooks/health")
    check("GET /webhooks/health  200", r.status_code == 200)
    if r.status_code == 200:
        wh = r.json()
        check("webhook_secret_configured=true", wh.get("webhook_secret_configured") is True)
        check("db_connected=true", wh.get("db_connected") is True)
        check("Treasury wallet set", wh.get("treasury_wallet") == TREASURY)

    MOCK_TX = [{"signature":"audit_test_sig","type":"TRANSFER","timestamp":1709000000,"fee":5000,
                "feePayer": TREASURY,"nativeTransfers":[],"tokenTransfers":[],"accountData":[],"description":"audit","events":{}}]

    r = c.post(f"{BASE}/webhooks/helius", json=MOCK_TX, headers={"Authorization": SECRET})
    check("POST /webhooks/helius correct secret  200", r.status_code == 200, f"status={r.status_code}")

    r = c.post(f"{BASE}/webhooks/helius", json=MOCK_TX, headers={"Authorization": "wrong"})
    check("POST /webhooks/helius wrong secret  401", r.status_code == 401, f"got {r.status_code}")

    r = c.post(f"{BASE}/webhooks/helius", json=MOCK_TX)
    check("POST /webhooks/helius no secret  401", r.status_code == 401, f"got {r.status_code}")

    r = c.get(f"{BASE}/webhooks/transactions?limit=5")
    check("GET /webhooks/transactions  200", r.status_code == 200, f"status={r.status_code}")

    r = c.get(f"{BASE}/webhooks/transactions/stats")
    check("GET /webhooks/transactions/stats  200", r.status_code == 200, f"status={r.status_code}")

    r = c.get(f"{BASE}/webhooks/test-pgvector")
    check("GET /webhooks/test-pgvector  200", r.status_code == 200, f"status={r.status_code}")
    if r.status_code == 200:
        pg = r.json()
        check("pgvector operational", pg.get("pgvector_working") is True or pg.get("table_created") is True, str(pg)[:80])

    # ── 10. WEBSOCKET (basic check) ──────────────────────────
    section("10. WebSocket")
    import socket
    try:
        s = socket.create_connection(("memory-market.up.railway.app", 443), timeout=5)
        s.close()
        check("WS host reachable (TCP 443)", True, "TCP OK")
    except Exception as ex:
        check("WS host reachable", False, str(ex))

    # ── 11. FRONTEND ─────────────────────────────────────────
    section("11. Frontend (Vercel)")
    r = c.get(FRONTEND)
    check("GET memory-market.vercel.app  200", r.status_code == 200, f"status={r.status_code}")
    check("HTML content returned", len(r.content) > 1000, f"{len(r.content)} bytes")

    # ── SUMMARY ──────────────────────────────────────────────
    passed = sum(1 for s,_,_ in results if s == "PASS")
    failed = sum(1 for s,_,_ in results if s == "FAIL")
    print(f"\n{'='*55}")
    print(f"  AUDIT SUMMARY: {passed} passed, {failed} failed")
    print(f"{'='*55}")
    if failed > 0:
        print("\n  FAILURES:")
        for s, label, detail in results:
            if s == "FAIL":
                print(f"    x {label}" + (f" — {detail}" if detail else ""))
