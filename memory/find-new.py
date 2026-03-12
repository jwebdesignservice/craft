import httpx

BASE = "https://memory-market.up.railway.app"

# Get all listings and find newest non-seeded one
r = httpx.get(f"{BASE}/marketplace/listings?limit=50", timeout=10)
data = r.json()
listings = data.get("listings", [])
print(f"Total listings: {data.get('total')}")
print()

# Non-seeded, non-JMoon listings
custom = [l for l in listings if not l.get("memory_id","").startswith("skill_") and not l.get("seller_wallet","").startswith("MemoryMarket")]
print(f"User-created listings: {len(custom)}")
for l in custom:
    sol = l.get("price_lamports",0)/1e9
    mid = l.get("memory_id","")
    # Fetch memory title
    try:
        r2 = httpx.get(f"{BASE}/memory/{mid}", timeout=5)
        title = r2.json().get("title","?") if r2.status_code == 200 else "?"
        creator = r2.json().get("creator_wallet","?")[:30] if r2.status_code == 200 else "?"
    except:
        title, creator = "?", "?"

    print(f"\n  listing: {l.get('id','?')[:25]}")
    print(f"  memory:  {mid}")
    print(f"  title:   {title}")
    print(f"  price:   {sol} SOL")
    print(f"  creator: {creator}")
    print(f"  active:  {l.get('is_active')}")
    print(f"  URL: https://memory-market.vercel.app/memory/{mid}")

# Also search by demo-list for recent items
print("\n--- Recent memories (demo-list) ---")
r3 = httpx.get(f"{BASE}/memory/demo-list", timeout=10)
items = r3.json() if isinstance(r3.json(), list) else r3.json().get("memories", [])
recent = [m for m in items if "test" in str(m.get("title","")).lower() or "Test" in str(m.get("title",""))]
for m in recent:
    print(f"  {m.get('id')} | {m.get('title')} | wallet={m.get('creator_wallet','?')[:25]}")
