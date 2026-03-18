import httpx
import json

BASE = "https://memory-market.up.railway.app/webhooks/helius"
SECRET = "aa039e6b3b3641f4a6525a5e75df7c3c5fa119de52ee05ccc910416db147398d"

# Minimal Helius-format transaction payload
MOCK_TX = [{
    "signature": "test_sig_abc123",
    "type": "TRANSFER",
    "timestamp": 1709000000,
    "fee": 5000,
    "feePayer": "7URzyhXwZQytVf6PBKPiUHnGFFUMrKc3FMQU77PDgxUn",
    "slot": 123456,
    "nativeTransfers": [{
        "fromUserAccount": "SendingWallet1111111111111111111111111111111",
        "toUserAccount": "7URzyhXwZQytVf6PBKPiUHnGFFUMrKc3FMQU77PDgxUn",
        "amount": 100000000
    }],
    "tokenTransfers": [],
    "accountData": [],
    "description": "Test transfer to treasury",
    "events": {}
}]

print("=== Webhook Verification Test ===\n")

with httpx.Client(timeout=10) as c:
    # Test 1: correct secret
    r1 = c.post(BASE, json=MOCK_TX, headers={"Authorization": SECRET})
    print(f"[1] Correct secret   -> {r1.status_code}", "PASS" if r1.status_code == 200 else "FAIL")
    if r1.status_code != 200:
        print("    Response:", r1.text[:200])

    # Test 2: wrong secret
    r2 = c.post(BASE, json=MOCK_TX, headers={"Authorization": "wrongsecret"})
    print(f"[2] Wrong secret     -> {r2.status_code}", "PASS (correctly rejected)" if r2.status_code == 401 else "FAIL")

    # Test 3: no secret
    r3 = c.post(BASE, json=MOCK_TX)
    print(f"[3] No secret        -> {r3.status_code}", "PASS (correctly rejected)" if r3.status_code == 401 else "FAIL")

print("\n=== Done ===")
