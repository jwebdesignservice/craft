"""
Skills Ingestion Script
Reads all .md files from skills-incoming/ and POSTs each to the MemoryMarket API.
"""

import os
import json
import re
import httpx

API_BASE = "https://memory-market.up.railway.app"
SKILLS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skills-incoming")
CREATOR_WALLET = "4YAurT42wEVTyVrhGx7m5sJ87HrmrVBqCEY2Y714SyRK"  # Valid base58 JMoon skills wallet


def get_auth_token():
    """Get JWT token via nonce/verify flow (MVP: accepts any signature)."""
    with httpx.Client(timeout=15) as client:
        r = client.get(API_BASE + "/auth/nonce/" + CREATOR_WALLET)
        if r.status_code != 200:
            print("[WARN] Could not get nonce: " + str(r.status_code))
            return None
        nonce = r.json().get("nonce")
        verify_r = client.post(API_BASE + "/auth/verify", json={
            "wallet_address": CREATOR_WALLET,
            "signature": "demo_signature_" + nonce,
            "message": nonce,
        })
        if verify_r.status_code == 200:
            token = verify_r.json().get("token")
            print("[OK] Auth token obtained")
            return token
        print("[WARN] Auth verify failed: " + str(verify_r.status_code) + " " + verify_r.text[:100])
        return None


def parse_frontmatter(content):
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        return {}, content

    fm_text = match.group(1)
    body = content[match.end():]
    meta = {}

    for line in fm_text.split('\n'):
        if ':' in line:
            key, _, val = line.partition(':')
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if val.startswith('['):
                try:
                    val = json.loads(val)
                except Exception:
                    val = [v.strip().strip('"') for v in val.strip('[]').split(',')]
            elif re.match(r'^\d+\.\d+$', val):
                val = float(val)
            meta[key] = val

    return meta, body.strip()


def ingest_skill(filename, meta, body, token=None):
    name = meta.get("name", filename.replace(".md", ""))
    description = meta.get("description", "")
    memory_type = meta.get("type", "procedural")
    domain_tags = meta.get("domain_tags", [])
    price_sol = float(meta.get("price_sol", 0.1))

    if isinstance(domain_tags, str):
        domain_tags = [domain_tags]

    title = name.replace("-", " ").title()

    payload = {
        "title": title,
        "description": description[:500] if description else "",
        "content": body,
        "type": memory_type,
        "domain_tags": domain_tags,
        "price": price_sol,
        "list_for_sale": True,
        "creator_wallet": CREATOR_WALLET,
    }

    print("\n[+] Ingesting: " + name)
    print("    Type: " + memory_type + " | Price: " + str(price_sol) + " SOL")

    with httpx.Client(timeout=30) as client:
        r = client.post(API_BASE + "/memory/create", json=payload)
        if r.status_code not in (200, 201):
            print("    [FAIL] Create failed: " + str(r.status_code) + " - " + r.text[:200])
            return None

        memory = r.json()
        memory_id = memory.get("id") or memory.get("memory_id")
        print("    [OK] Created: " + str(memory_id))

        if price_sol > 0:
            listing_payload = {
                "memory_id": memory_id,
                "price_model": "one_time",
                "price_lamports": int(price_sol * 1_000_000_000),
                "seller_wallet": CREATOR_WALLET,
            }
            headers = {}
            if token:
                headers["Authorization"] = "Bearer " + token
                headers["X-Wallet"] = CREATOR_WALLET
            lr = client.post(API_BASE + "/marketplace/list", json=listing_payload, headers=headers)
            if lr.status_code in (200, 201):
                print("    [OK] Listed on marketplace")
            else:
                print("    [WARN] Listing failed: " + str(lr.status_code) + " - " + lr.text[:150])

        return memory_id


def main():
    token = get_auth_token()

    files = [f for f in os.listdir(SKILLS_DIR) if f.endswith(".md")]
    print("Found " + str(len(files)) + " skills to ingest")

    success = []
    failed = []

    for filename in sorted(files):
        path = os.path.join(SKILLS_DIR, filename)
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        meta, body = parse_frontmatter(content)
        if not meta:
            print("[WARN] No frontmatter in " + filename + ", skipping")
            failed.append(filename)
            continue

        memory_id = ingest_skill(filename, meta, body, token=token)
        if memory_id:
            success.append(filename)
        else:
            failed.append(filename)

    print("\n" + "="*50)
    print("[OK] Ingested: " + str(len(success)))
    print("[FAIL] Failed: " + str(len(failed)))
    if failed:
        print("Failed files: " + str(failed))


if __name__ == "__main__":
    main()
