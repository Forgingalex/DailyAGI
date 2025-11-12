"""
DAILYAGI Backend - FastAPI with ROMA Orchestration
Main entry point for the LifeOS Agent system
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import socketio

from agents.reminders import RemindersAgent
from agents.spending import SpendingAgent
from agents.grocery import GroceryAgent
from utils.enclave import MockEnclave
from utils.ipfs import IPFSStorage

load_dotenv()

app = FastAPI(
    title="DAILYAGI API",
    description="Decentralized AI Life Assistant Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.IO for real-time notifications
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode='asgi')
socket_app = socketio.ASGIApp(sio, app)

# Initialize agents
reminders_agent = RemindersAgent()
spending_agent = SpendingAgent()
grocery_agent = GroceryAgent()
enclave = MockEnclave()
ipfs = IPFSStorage()

# OML Fingerprint (auto-generated for each agent)
OML_FINGERPRINT = "dailyagi_v1_0x1234567890abcdef"


class AgentRequest(BaseModel):
    address: str
    agent_type: str
    params: Optional[Dict[str, Any]] = None


class ReminderCreate(BaseModel):
    address: str
    title: str
    description: Optional[str] = ""
    datetime: str


class SpendingRequest(BaseModel):
    address: str
    timeRange: str = "30d"


@app.get("/")
async def root():
    return {
        "message": "DAILYAGI API",
        "version": "1.0.0",
        "status": "online"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "agents": {
            "reminders": "active",
            "spending": "active",
            "grocery": "active"
        }
    }


@app.post("/agent/run")
async def run_agent(request: AgentRequest):
    """
    ROMA Orchestration endpoint - routes to appropriate agent
    """
    try:
        agent_type = request.agent_type.lower()
        
        if agent_type == "reminders":
            result = await reminders_agent.run(
                address=request.address,
                params=request.params or {}
            )
        elif agent_type == "spending":
            result = await spending_agent.run(
                address=request.address,
                params=request.params or {}
            )
        elif agent_type == "grocery":
            result = await grocery_agent.run(
                address=request.address,
                params=request.params or {}
            )
        else:
            raise HTTPException(status_code=400, detail=f"Unknown agent type: {agent_type}")
        
        return {
            "success": True,
            "agent": agent_type,
            "oml_fingerprint": OML_FINGERPRINT,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Reminders Agent Endpoints
@app.get("/agent/reminders")
async def get_reminders(address: str):
    """Get all reminders for an address"""
    try:
        reminders = await reminders_agent.get_reminders(address)
        return {"reminders": reminders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/reminders")
async def create_reminder(reminder: ReminderCreate):
    """Create a new reminder"""
    try:
        result = await reminders_agent.create_reminder(
            address=reminder.address,
            title=reminder.title,
            description=reminder.description,
            datetime_str=reminder.datetime
        )
        
        # Emit Socket.IO event
        await sio.emit('reminder_created', {
            'address': reminder.address,
            'reminder': result
        })
        
        return {"reminder": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/agent/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str, address: str):
    """Delete a reminder"""
    try:
        await reminders_agent.delete_reminder(address, reminder_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Spending Agent Endpoints
@app.post("/agent/spending")
async def analyze_spending(request: SpendingRequest):
    """Analyze spending for an address"""
    try:
        result = await spending_agent.analyze(
            address=request.address,
            time_range=request.timeRange
        )
        
        # Emit Socket.IO event for spending nudges
        if result.get('nudge'):
            await sio.emit('spending_nudge', {
                'address': request.address,
                'message': result['nudge']
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Grocery Agent Endpoints
@app.post("/agent/grocery")
async def process_grocery(
    image: UploadFile = File(...),
    address: str = Form(...)
):
    """Process fridge image and generate grocery list"""
    try:
        image_data = await image.read()
        result = await grocery_agent.process_image(
            address=address,
            image_data=image_data,
            filename=image.filename or "fridge.jpg"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/agent/grocery/{cid}")
async def get_grocery_list(cid: str):
    """Retrieve grocery list from IPFS"""
    try:
        result = await grocery_agent.get_list_from_ipfs(cid)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Premium Features Check
@app.get("/premium/status/{address}")
async def check_premium_status(address: str):
    """Check if user has premium access (staked SENT tokens)"""
    try:
        # This would check the ERC-20 staking contract
        # For now, return mock data
        return {
            "premium": False,
            "staked_amount": "0",
            "unlock_date": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:socket_app", host="0.0.0.0", port=8000, reload=True)

