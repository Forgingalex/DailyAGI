"""
Google Calendar client for reminder synchronization
"""

import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

class GoogleCalendarClient:
    """Handle Google Calendar integration"""
    
    def __init__(self):
        self.credentials_path = os.getenv("GOOGLE_CREDENTIALS_PATH")
        self.service = None
        
        if self.credentials_path and os.path.exists(self.credentials_path):
            try:
                creds = Credentials.from_authorized_user_file(
                    self.credentials_path,
                    ['https://www.googleapis.com/auth/calendar']
                )
                if creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                self.service = build('calendar', 'v3', credentials=creds)
            except Exception as e:
                print(f"Google Calendar init error: {e}")
        else:
            print("Warning: Google Calendar credentials not configured")
    
    async def create_event(
        self,
        title: str,
        description: str,
        start_time: str
    ) -> bool:
        """Create calendar event"""
        if not self.service:
            print(f"Mock calendar event: {title} at {start_time}")
            return True
        
        try:
            from datetime import datetime
            start = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            end = start.replace(hour=start.hour + 1)
            
            event = {
                'summary': title,
                'description': description,
                'start': {
                    'dateTime': start.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end.isoformat(),
                    'timeZone': 'UTC',
                },
            }
            
            event = self.service.events().insert(
                calendarId='primary',
                body=event
            ).execute()
            
            return event.get('id') is not None
        except Exception as e:
            print(f"Google Calendar error: {e}")
            return False


