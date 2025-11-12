"""
Grocery Agent - Uses vision AI to detect missing items and create shopping lists
"""

import os
import uuid
from typing import Dict, Any, List
from datetime import datetime
from agents.base import BaseAgent
from utils.ipfs import IPFSStorage
from utils.exa_vision import ExaVisionClient

# OML Fingerprint
OML_FINGERPRINT = "dailyagi_grocery_v1_0x4567890abcdef123"


class GroceryAgent(BaseAgent):
    """Agent for processing fridge images and generating grocery lists"""
    
    def __init__(self):
        super().__init__("GroceryAgent")
        self.ipfs = IPFSStorage()
        self.exa = ExaVisionClient()
    
    async def run(self, address: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main execution method for grocery agent
        Uses Dobby reasoning to generate shopping list
        """
        if "image_data" in params:
            return await self.process_image(
                address=address,
                image_data=params["image_data"],
                filename=params.get("filename", "fridge.jpg")
            )
        elif "cid" in params:
            return await self.get_list_from_ipfs(params["cid"])
        else:
            return {"error": "Missing image_data or cid parameter"}
    
    async def process_image(
        self,
        address: str,
        image_data: bytes,
        filename: str
    ) -> Dict[str, Any]:
        """Process fridge image and generate grocery list"""
        # Use Exa Vision API to detect items
        detected_items = await self.exa.detect_items(image_data)
        
        # Use Dobby reasoning to generate shopping list
        reasoning_prompt = f"""
        Based on the detected items in the fridge: {detected_items}
        Generate a shopping list of missing essential items.
        Consider: milk, eggs, bread, vegetables, fruits, meat, etc.
        Format as JSON with name, quantity, and category for each item.
        """
        
        shopping_list_text = self.get_dobby_reasoning(reasoning_prompt)
        
        # Parse shopping list (in production, Dobby would return structured JSON)
        items = self.parse_shopping_list(shopping_list_text, detected_items)
        
        # Create grocery list object
        grocery_list = {
            "id": str(uuid.uuid4()),
            "address": address,
            "items": items,
            "detected_items": detected_items,
            "timestamp": datetime.now().isoformat(),
            "filename": filename
        }
        
        # Store on IPFS
        try:
            cid = await self.ipfs.store_json(grocery_list)
            grocery_list["cid"] = cid
        except Exception as e:
            print(f"IPFS storage failed: {e}")
            grocery_list["cid"] = None
        
        return {
            "items": items,
            "cid": grocery_list.get("cid"),
            "timestamp": grocery_list["timestamp"]
        }
    
    def parse_shopping_list(self, reasoning_text: str, detected_items: List[str]) -> List[Dict[str, str]]:
        """
        Parse Dobby reasoning output into structured shopping list
        In production, Dobby would return JSON directly
        """
        # Mock parsing - in production, use structured output from Dobby
        essential_items = [
            {"name": "Milk", "quantity": "1 gallon", "category": "Dairy"},
            {"name": "Eggs", "quantity": "1 dozen", "category": "Dairy"},
            {"name": "Bread", "quantity": "1 loaf", "category": "Bakery"},
            {"name": "Bananas", "quantity": "1 bunch", "category": "Fruits"},
            {"name": "Chicken Breast", "quantity": "1 lb", "category": "Meat"},
            {"name": "Lettuce", "quantity": "1 head", "category": "Vegetables"},
        ]
        
        # Filter out items that were detected
        missing_items = [
            item for item in essential_items
            if not any(detected.lower() in item["name"].lower() for detected in detected_items)
        ]
        
        return missing_items[:10]  # Return top 10 items
    
    async def get_list_from_ipfs(self, cid: str) -> Dict[str, Any]:
        """Retrieve grocery list from IPFS"""
        try:
            data = await self.ipfs.retrieve_json(cid)
            return data
        except Exception as e:
            return {"error": f"Failed to retrieve from IPFS: {e}"}


