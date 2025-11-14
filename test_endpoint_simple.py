"""Simple test for Sentient agent endpoint"""
import requests
import json

url = "http://localhost:8001/sentient/agent"
data = {
    "message": "remind me to call my sister tomorrow",
    "wallet": "0x1234567890123456789012345678901234567890"
}

print("Testing Sentient Agent Endpoint...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data, indent=2)}")
print("\nSending request...\n")

try:
    response = requests.post(url, json=data, stream=True, timeout=10)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("\n✅ Success! Streaming response:\n")
        for line in response.iter_lines():
            if line:
                print(f"  {line.decode('utf-8')}")
    else:
        print(f"\n❌ Error: {response.text}")
except requests.exceptions.ConnectionError:
    print("\n❌ Connection Error: Server not running on port 8001")
    print("💡 Start the server with: cd backend && python agent_server.py")
except Exception as e:
    print(f"\n❌ Error: {e}")



