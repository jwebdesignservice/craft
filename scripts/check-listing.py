import httpx

BASE = "https://memory-market.up.railway.app"

# Search for the 'testing' memory
r = httpx.get(f"{BASE}/memory/search?q=testing&limit=10", timeout=10)
memories = r.json().get("memories", [])
found = [m for m in memories if "test" in m.get("title","").lower()]

print(f"=== Memory Search: 'testing' ===")
print(f"Results: {len(found)}\n")
for m in found:
    print(f"  ID:             {m.get('id')}")
    print(f"  Title:          {m.get('title')}")
    print(f"  creator_wallet: {m.get('creator_wallet','MISSING')}")
    print(f"  price:          {m.get('price')} SOL")
    print(f"  listed:         {m.get('is_listed')}")
    print()

# Check marketplace listings
r2 = httpx.get(f"{BASE}/marketplace/listings?limit=50", timeout=10)
data = r2.json()
total = data.get("total")
listings = data.get("listings", [])
print(f"=== Marketplace ===")
print(f"Total listings: {total}")

# Find 'testing' listing
test_listings = [l for l in listings if "test" in l.get("memory_id","").lower()]
if not test_listings:
    # Check by matching memory IDs from search
    if found:
        mid = found[0].get("id")
        test_listings = [l for l in listings if l.get("memory_id") == mid]

if test_listings:
    for l in test_listings:
        sol = l.get("price_lamports",0)/1e9
        print(f"\n  FOUND IN MARKETPLACE:")
        print(f"  listing_id:    {l.get('id')}")
        print(f"  memory_id:     {l.get('memory_id')}")
        print(f"  price:         {sol} SOL")
        print(f"  seller_wallet: {l.get('seller_wallet','MISSING')}")
        print(f"  active:        {l.get('is_active')}")
        print(f"\n  Marketplace URL: https://memory-market.vercel.app/memory/{l.get('memory_id')}")
else:
    print("\n  NOT found in listings yet")
