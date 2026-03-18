import httpx

r = httpx.get("https://memory-market.up.railway.app/memory/search?q=trading+solana+portfolio&limit=3", timeout=10)
print("Status:", r.status_code)
data = r.json()
print("Total:", data.get("total"))
for m in data.get("memories", []):
    print(" -", m.get("title"), "|", m.get("type"), "| score:", m.get("quality_score"))
