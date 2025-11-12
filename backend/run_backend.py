#!/usr/bin/env python3
"""
Simple script to run the backend and show any errors
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Starting backend...")
    print("=" * 50)
    
    # Try importing main components
    print("1. Importing dependencies...")
    from dotenv import load_dotenv
    load_dotenv()
    print("   ✓ dotenv loaded")
    
    import socketio
    print("   ✓ socketio imported")
    
    from fastapi import FastAPI
    print("   ✓ fastapi imported")
    
    print("\n2. Importing agents...")
    from agents.reminders import RemindersAgent
    print("   ✓ RemindersAgent imported")
    
    from agents.spending import SpendingAgent
    print("   ✓ SpendingAgent imported")
    
    from agents.grocery import GroceryAgent
    print("   ✓ GroceryAgent imported")
    
    print("\n3. Starting server...")
    import uvicorn
    uvicorn.run("main:socket_app", host="0.0.0.0", port=8000, reload=True)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)


