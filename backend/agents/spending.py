"""
Spending Agent - Analyzes on-chain transactions and provides spending insights
"""

import os
from typing import Dict, Any, List
from datetime import datetime, timedelta
from agents.base import BaseAgent
from utils.covalent import CovalentClient
from utils.ipfs import IPFSStorage

# OML Fingerprint
OML_FINGERPRINT = "dailyagi_spending_v1_0x7890abcdef123456"


class SpendingAgent(BaseAgent):
    """Agent for analyzing spending patterns from on-chain transactions"""
    
    def __init__(self):
        super().__init__("SpendingAgent")
        self.covalent = CovalentClient()
        self.ipfs = IPFSStorage()
    
    async def run(self, address: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main execution method for spending agent
        Uses Dobby for transaction classification
        """
        time_range = params.get("timeRange", "30d")
        return await self.analyze(address, time_range)
    
    async def analyze(self, address: str, time_range: str = "30d") -> Dict[str, Any]:
        """Analyze spending for an address"""
        # Calculate date range
        days = {"7d": 7, "30d": 30, "90d": 90}.get(time_range, 30)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Fetch transactions from Covalent
        transactions = await self.covalent.get_transactions(
            address=address,
            start_date=start_date,
            end_date=end_date
        )
        
        # Classify transactions using Dobby
        classified_txs = []
        categories = {}
        total_spent = 0.0
        
        for tx in transactions:
            # Use Dobby for classification
            classification_prompt = f"""
            Classify this transaction: {tx.get('description', '')} 
            Amount: ${tx.get('value', 0)}
            Determine category: coffee, food, bills, shopping, entertainment, other
            """
            
            category = self.classify_transaction(classification_prompt, tx)
            value = float(tx.get("value", 0))
            
            classified_tx = {
                **tx,
                "category": category,
                "value": value
            }
            classified_txs.append(classified_tx)
            
            # Aggregate by category
            if category not in categories:
                categories[category] = 0.0
            categories[category] += value
            total_spent += value
        
        # Generate spending nudge if needed
        nudge = None
        if total_spent > 1000:  # Threshold for nudges
            nudge_prompt = f"""
            User has spent ${total_spent} in the last {days} days.
            Generate a friendly spending nudge message.
            """
            nudge = self.get_dobby_reasoning(nudge_prompt)
        
        # Prepare chart data
        chart_data = self.prepare_chart_data(classified_txs, days)
        
        # Store analysis on IPFS
        analysis = {
            "address": address,
            "time_range": time_range,
            "total_spent": total_spent,
            "categories": categories,
            "transactions": classified_txs,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            cid = await self.ipfs.store_json(analysis)
            analysis["cid"] = cid
        except Exception as e:
            print(f"IPFS storage failed: {e}")
        
        return {
            "transactions": classified_txs,
            "totalSpent": total_spent,
            "categories": categories,
            "chartData": chart_data,
            "nudge": nudge,
            "cid": analysis.get("cid")
        }
    
    def classify_transaction(self, prompt: str, tx: Dict[str, Any]) -> str:
        """
        Classify transaction using Dobby text classification
        """
        try:
            # Simple keyword-based classification (replace with Dobby in production)
            description = tx.get("description", "").lower()
            value = float(tx.get("value", 0))
            
            if any(word in description for word in ["coffee", "cafe", "starbucks"]):
                return "coffee"
            elif any(word in description for word in ["food", "restaurant", "dining"]):
                return "food"
            elif any(word in description for word in ["bill", "utility", "rent"]):
                return "bills"
            elif any(word in description for word in ["shop", "store", "amazon"]):
                return "shopping"
            elif any(word in description for word in ["movie", "game", "entertainment"]):
                return "entertainment"
            else:
                return "other"
        except Exception as e:
            print(f"Classification error: {e}")
            return "other"
    
    def prepare_chart_data(self, transactions: List[Dict[str, Any]], days: int) -> List[Dict[str, str]]:
        """Prepare data for spending chart"""
        # Group by date
        daily_spending = {}
        for tx in transactions:
            date = tx.get("timestamp", datetime.now().isoformat())[:10]
            if date not in daily_spending:
                daily_spending[date] = 0.0
            daily_spending[date] += float(tx.get("value", 0))
        
        # Convert to chart format
        chart_data = [
            {"date": date, "amount": amount}
            for date, amount in sorted(daily_spending.items())
        ]
        
        return chart_data


