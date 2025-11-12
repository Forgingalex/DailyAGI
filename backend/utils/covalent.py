"""
Covalent API client for fetching blockchain transactions
"""

import os
import requests
from typing import List, Dict, Any
from datetime import datetime

class CovalentClient:
    """Handle blockchain transaction fetching via Covalent API"""
    
    def __init__(self):
        self.api_key = os.getenv("COVALENT_KEY")
        self.base_url = "https://api.covalenthq.com/v1"
    
    async def get_transactions(
        self,
        address: str,
        start_date: datetime,
        end_date: datetime,
        chains: List[int] = [137, 8453]  # Polygon, Base
    ) -> List[Dict[str, Any]]:
        """Fetch transactions for an address"""
        if not self.api_key:
            # Return mock transactions
            return self._get_mock_transactions()
        
        all_transactions = []
        
        for chain_id in chains:
            try:
                url = f"{self.base_url}/{chain_id}/address/{address}/transactions_v2/"
                params = {
                    "key": self.api_key,
                    "page-size": 100
                }
                
                response = requests.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    items = data.get("data", {}).get("items", [])
                    
                    for item in items:
                        tx = {
                            "hash": item.get("tx_hash", ""),
                            "value": float(item.get("value", 0)) / 1e18,  # Convert from wei
                            "timestamp": item.get("block_signed_at", ""),
                            "from": item.get("from_address", ""),
                            "to": item.get("to_address", ""),
                            "description": self._generate_description(item)
                        }
                        all_transactions.append(tx)
            except Exception as e:
                print(f"Covalent API error for chain {chain_id}: {e}")
        
        return all_transactions
    
    def _generate_description(self, tx_item: Dict[str, Any]) -> str:
        """Generate human-readable description from transaction"""
        to_address = tx_item.get("to_address", "")
        value = float(tx_item.get("value", 0)) / 1e18
        
        # Simple description based on value and address
        if value < 0.01:
            return "Small transaction"
        elif value < 1:
            return "Medium transaction"
        else:
            return f"Large transaction: ${value:.2f}"
    
    def _get_mock_transactions(self) -> List[Dict[str, Any]]:
        """Return mock transactions for testing"""
        from datetime import timedelta
        now = datetime.now()
        
        return [
            {
                "hash": "0x1234567890abcdef",
                "value": 5.50,
                "timestamp": (now - timedelta(days=1)).isoformat(),
                "from": "0xuser",
                "to": "0xcoffee",
                "description": "Coffee shop purchase"
            },
            {
                "hash": "0xabcdef1234567890",
                "value": 25.00,
                "timestamp": (now - timedelta(days=2)).isoformat(),
                "from": "0xuser",
                "to": "0xrestaurant",
                "description": "Restaurant dining"
            },
            {
                "hash": "0x9876543210fedcba",
                "value": 100.00,
                "timestamp": (now - timedelta(days=5)).isoformat(),
                "from": "0xuser",
                "to": "0xstore",
                "description": "Shopping store purchase"
            },
        ]


