"""
Reminders Agent - Handles calendar-based reminders and SMS notifications
"""

import os
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from agents.base import BaseAgent
from utils.ipfs import IPFSStorage
from utils.twilio_client import TwilioClient
from utils.google_calendar import GoogleCalendarClient

# OML Fingerprint
OML_FINGERPRINT = "dailyagi_reminders_v1_0xabcdef1234567890"


class RemindersAgent(BaseAgent):
    """Agent for managing reminders with Google Calendar and Twilio SMS"""
    
    def __init__(self):
        super().__init__("RemindersAgent")
        self.ipfs = IPFSStorage()
        self.twilio = TwilioClient()
        self.calendar = GoogleCalendarClient()
        self.reminders_store: Dict[str, List[Dict[str, Any]]] = {}
    
    async def run(self, address: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main execution method for reminders agent
        Uses Dobby reasoning to determine reminder actions
        """
        action = params.get("action", "create")
        
        # Use Dobby reasoning to process the request
        reasoning_prompt = f"""
        Process reminder request: {params}
        Address: {address}
        Action: {action}
        Determine the best course of action for this reminder.
        """
        
        reasoning = self.get_dobby_reasoning(reasoning_prompt)
        
        if action == "create":
            return await self.create_reminder(
                address=address,
                title=params.get("title", ""),
                description=params.get("description", ""),
                datetime_str=params.get("datetime", "")
            )
        elif action == "list":
            return await self.get_reminders(address)
        elif action == "delete":
            return await self.delete_reminder(address, params.get("id", ""))
        else:
            return {"error": "Unknown action", "reasoning": reasoning}
    
    async def create_reminder(
        self,
        address: str,
        title: str,
        description: str,
        datetime_str: str
    ) -> Dict[str, Any]:
        """Create a new reminder and store on IPFS"""
        reminder_id = str(uuid.uuid4())
        reminder = {
            "id": reminder_id,
            "title": title,
            "description": description,
            "datetime": datetime_str,
            "completed": False,
            "created_at": datetime.now().isoformat(),
            "address": address
        }
        
        # Store on IPFS
        try:
            cid = await self.ipfs.store_json(reminder)
            reminder["cid"] = cid
        except Exception as e:
            print(f"IPFS storage failed: {e}")
            reminder["cid"] = None
        
        # Add to local store
        if address not in self.reminders_store:
            self.reminders_store[address] = []
        self.reminders_store[address].append(reminder)
        
        # Sync with Google Calendar (if configured)
        try:
            await self.calendar.create_event(
                title=title,
                description=description,
                start_time=datetime_str
            )
        except Exception as e:
            print(f"Calendar sync failed: {e}")
        
        # Send SMS notification (if configured)
        try:
            await self.twilio.send_reminder_sms(
                to=address,  # In production, use user's phone number
                message=f"Reminder: {title} at {datetime_str}"
            )
        except Exception as e:
            print(f"SMS notification failed: {e}")
        
        return reminder
    
    async def get_reminders(self, address: str) -> List[Dict[str, Any]]:
        """Get all reminders for an address"""
        return self.reminders_store.get(address, [])
    
    async def delete_reminder(self, address: str, reminder_id: str) -> Dict[str, Any]:
        """Delete a reminder"""
        if address in self.reminders_store:
            self.reminders_store[address] = [
                r for r in self.reminders_store[address]
                if r["id"] != reminder_id
            ]
        return {"success": True, "id": reminder_id}

