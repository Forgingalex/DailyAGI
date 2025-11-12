"""
IPFS Storage utility using web3.storage
"""

import os
import json
from typing import Dict, Any, Optional
try:
    from web3storage import Client
except ImportError:
    Client = None

class IPFSStorage:
    """Handle IPFS storage via web3.storage"""
    
    def __init__(self):
        self.token = os.getenv("WEB3_STORAGE_TOKEN")
        if self.token:
            self.client = Client(self.token)
        else:
            self.client = None
            print("Warning: WEB3_STORAGE_TOKEN not set, IPFS storage disabled")
    
    async def store_json(self, data: Dict[str, Any]) -> str:
        """Store JSON data on IPFS and return CID"""
        if not self.client:
            # Return mock CID if token not configured
            return "QmMockCID1234567890abcdef"
        
        try:
            json_str = json.dumps(data)
            cid = self.client.put(json_str.encode())
            return cid
        except Exception as e:
            print(f"IPFS storage error: {e}")
            # Return mock CID on error
            return f"QmMockCID{hash(str(data)) % 1000000}"
    
    async def retrieve_json(self, cid: str) -> Dict[str, Any]:
        """Retrieve JSON data from IPFS"""
        if not self.client:
            return {"error": "IPFS client not configured"}
        
        try:
            # In production, use web3.storage client to retrieve
            # For now, return mock data
            return {"error": "Retrieval not implemented in mock"}
        except Exception as e:
            return {"error": f"IPFS retrieval error: {e}"}
    
    async def store_file(self, file_data: bytes, filename: str) -> str:
        """Store file on IPFS and return CID"""
        if not self.client:
            return "QmMockFileCID1234567890"
        
        try:
            cid = self.client.put(file_data)
            return cid
        except Exception as e:
            print(f"IPFS file storage error: {e}")
            return f"QmMockFileCID{hash(filename) % 1000000}"

