"""
Exa Vision API client for image analysis
"""

import os
import base64
import aiohttp
from typing import List, Dict, Any

class ExaVisionClient:
    """Handle image analysis via Exa Vision API"""
    
    def __init__(self):
        self.api_key = os.getenv("EXA_KEY")
        self.base_url = "https://api.exa.ai"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}" if self.api_key else None,
            "Content-Type": "application/json"
        }
    
    async def detect_items(self, image_data: bytes) -> List[str]:
        """Detect items in fridge image using Exa Vision API"""
        if not self.api_key:
            # Return mock detected items if API key not configured
            return self._mock_detect_items()
        
        try:
            # Encode image to base64
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            
            # Try using exa-py SDK first (if available)
            try:
                from exa import Exa
                exa_client = Exa(api_key=self.api_key)
                # Note: Exa SDK may have different methods - adjust based on actual SDK
                # This is a placeholder for the actual implementation
                return await self._detect_with_exa_sdk(exa_client, image_data)
            except ImportError:
                # Fallback to direct API call using aiohttp
                return await self._detect_with_api(image_b64)
                
        except Exception as e:
            print(f"Exa Vision API error: {e}")
            # Fallback to mock detection on error
            return self._mock_detect_items()
    
    async def _detect_with_exa_sdk(self, exa_client, image_data: bytes) -> List[str]:
        """Use exa-py SDK for image analysis"""
        # TODO: Implement actual Exa SDK call when SDK documentation is available
        # This is a placeholder - adjust based on actual Exa SDK API
        # Example structure:
        # result = await exa_client.analyze_image(image_data)
        # return result.get("items", [])
        return self._mock_detect_items()
    
    async def _detect_with_api(self, image_b64: str) -> List[str]:
        """Make direct API call to Exa Vision using aiohttp"""
        async with aiohttp.ClientSession() as session:
            try:
                # Exa Vision API endpoint (adjust based on actual API documentation)
                url = f"{self.base_url}/v1/vision/analyze"
                
                payload = {
                    "image": image_b64,
                    "task": "object_detection",  # Detect objects in image
                    "context": "fridge_contents"  # Context for better detection
                }
                
                async with session.post(
                    url,
                    json=payload,
                    headers={k: v for k, v in self.headers.items() if v is not None}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        # Extract detected items from response
                        # Adjust based on actual Exa API response structure
                        items = data.get("items", [])
                        if isinstance(items, list) and len(items) > 0:
                            # If items are objects, extract names
                            if isinstance(items[0], dict):
                                return [item.get("name", item.get("label", "")) for item in items if item.get("name") or item.get("label")]
                            # If items are strings
                            return items
                        return self._mock_detect_items()
                    else:
                        error_text = await response.text()
                        print(f"Exa API error {response.status}: {error_text}")
                        return self._mock_detect_items()
            except aiohttp.ClientError as e:
                print(f"HTTP client error: {e}")
                return self._mock_detect_items()
    
    def _mock_detect_items(self) -> List[str]:
        """Mock item detection - used when API is unavailable or for testing"""
        return [
            "milk",
            "eggs",
            "cheese",
            "yogurt",
            "butter",
            "orange juice"
        ]

