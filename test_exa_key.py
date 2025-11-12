#!/usr/bin/env python3
"""
Test script to verify EXA_KEY is working
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_exa_key():
    """Test if EXA_KEY is loaded correctly"""
    exa_key = os.getenv("EXA_KEY")
    
    print("=" * 50)
    print("EXA_KEY Test")
    print("=" * 50)
    
    if not exa_key:
        print("❌ EXA_KEY not found in environment variables")
        print("   Make sure .env file exists and contains EXA_KEY")
        return False
    
    if exa_key == "your_exa_api_key":
        print("⚠️  EXA_KEY is still set to placeholder value")
        print("   Please update .env with your actual API key")
        return False
    
    print(f"✅ EXA_KEY found: {exa_key[:20]}...{exa_key[-10:]}")
    print(f"   Full key: {exa_key}")
    print()
    
    # Test importing ExaVisionClient
    try:
        sys.path.insert(0, 'backend')
        from utils.exa_vision import ExaVisionClient
        
        client = ExaVisionClient()
        print("✅ ExaVisionClient imported successfully")
        print(f"   API Key loaded: {client.api_key[:20] if client.api_key else 'None'}...")
        print()
        
        if client.api_key == exa_key:
            print("✅ API key matches environment variable")
        else:
            print("⚠️  API key mismatch")
        
        return True
    except Exception as e:
        print(f"❌ Error importing ExaVisionClient: {e}")
        return False

if __name__ == "__main__":
    success = test_exa_key()
    sys.exit(0 if success else 1)


