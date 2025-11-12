#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto-setup script to create/update .env file with EXA_KEY
This version runs automatically without user input
"""

import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    except:
        pass

def create_env_file():
    """Create .env file with EXA_KEY and other default values"""
    env_content = """# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Backend Environment Variables
HF_TOKEN=your_huggingface_token
SENTIENT_KEY=your_sentient_api_key
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_FROM_NUMBER=+1234567890
COVALENT_KEY=your_covalent_api_key
WEB3_STORAGE_TOKEN=your_web3storage_token
EXA_KEY=d6b1af81-badf-43d3-835e-ca4728a0ea26

# Google Calendar (optional)
GOOGLE_CREDENTIALS_PATH=./credentials/google-credentials.json

# Smart Contract Deployment
PRIVATE_KEY=your_private_key
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
BASE_RPC_URL=https://mainnet.base.org
SENT_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
"""
    
    env_path = Path(".env")
    exa_key = "d6b1af81-badf-43d3-835e-ca4728a0ea26"
    
    if env_path.exists():
        # Read existing content
        with open(env_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update EXA_KEY if it exists, otherwise add it
        if "EXA_KEY=" in content:
            lines = content.split('\n')
            updated_lines = []
            for line in lines:
                if line.startswith("EXA_KEY="):
                    updated_lines.append(f"EXA_KEY={exa_key}")
                else:
                    updated_lines.append(line)
            content = '\n'.join(updated_lines)
        else:
            # Add EXA_KEY if it doesn't exist
            content += f"\nEXA_KEY={exa_key}\n"
        
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("[OK] Updated EXA_KEY in existing .env file")
    else:
        # Create new .env file
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(env_content)
        print("[OK] Created .env file with EXA_KEY")
    
    print(f"[INFO] EXA_KEY has been set to: {exa_key}")
    print("[INFO] You can edit .env file to add other API keys as needed")

if __name__ == "__main__":
    create_env_file()


