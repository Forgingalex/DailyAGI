"""
Twilio SMS client for reminder notifications
"""

import os
from twilio.rest import Client as TwilioRestClient

class TwilioClient:
    """Handle SMS notifications via Twilio"""
    
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_SID")
        self.auth_token = os.getenv("TWILIO_TOKEN")
        self.from_number = os.getenv("TWILIO_FROM_NUMBER", "+1234567890")
        
        if self.account_sid and self.auth_token:
            self.client = TwilioRestClient(self.account_sid, self.auth_token)
        else:
            self.client = None
            print("Warning: Twilio credentials not set, SMS disabled")
    
    async def send_reminder_sms(self, to: str, message: str) -> bool:
        """Send SMS reminder"""
        if not self.client:
            print(f"Mock SMS to {to}: {message}")
            return True
        
        try:
            message = self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=to
            )
            return message.sid is not None
        except Exception as e:
            print(f"Twilio SMS error: {e}")
            return False

