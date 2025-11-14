"""
Test script for /sentient/agent endpoint
Run this after starting the agent server
"""

import requests
import json
import sys

def test_sentient_endpoint():
    """Test the Sentient agent endpoint"""
    url = "http://localhost:8001/sentient/agent"
    
    # Test cases
    test_cases = [
        {
            "name": "Reminder Request",
            "data": {
                "message": "remind me to call my sister tomorrow evening",
                "wallet": "0x1234567890123456789012345678901234567890"
            }
        },
        {
            "name": "Spending Query",
            "data": {
                "message": "how much did I spend last week?",
                "wallet": "0x1234567890123456789012345678901234567890"
            }
        },
        {
            "name": "Grocery Query",
            "data": {
                "message": "what groceries do I need?",
                "wallet": "0x1234567890123456789012345678901234567890"
            }
        }
    ]
    
    print("🧪 Testing Sentient Agent Endpoint\n")
    print("=" * 60)
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n📋 Test {i}: {test['name']}")
        print(f"   Message: {test['data']['message']}")
        print(f"   Wallet: {test['data']['wallet'][:20]}...")
        print("\n   Response:")
        print("   " + "-" * 56)
        
        try:
            response = requests.post(
                url,
                json=test['data'],
                stream=True,
                timeout=30
            )
            
            if response.status_code == 200:
                print("   ✅ Status: 200 OK")
                print("\n   Events:")
                
                event_count = 0
                for line in response.iter_lines():
                    if line:
                        line_str = line.decode('utf-8')
                        if line_str.startswith('data:'):
                            event_count += 1
                            try:
                                event_data = json.loads(line_str[5:].strip())
                                event_type = event_data.get('type', 'unknown')
                                content = event_data.get('data', {}).get('content', '')
                                print(f"   [{event_type.upper()}]: {content[:60]}...")
                            except json.JSONDecodeError:
                                print(f"   [RAW]: {line_str[:60]}...")
                
                print(f"\n   ✅ Received {event_count} events")
            else:
                print(f"   ❌ Status: {response.status_code}")
                print(f"   Error: {response.text}")
        
        except requests.exceptions.ConnectionError:
            print("   ❌ Connection Error: Is the agent server running?")
            print("   💡 Start it with: python agent_server.py")
            return False
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            return False
        
        print("   " + "-" * 56)
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    return True

if __name__ == "__main__":
    success = test_sentient_endpoint()
    sys.exit(0 if success else 1)



