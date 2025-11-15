"""
Sentient Agent Server for dailyAGI
Simple FastAPI server that exposes /sentient/agent endpoint for Sentient Chat
This is a standalone server that doesn't rely on sentient-agent-framework's AbstractAgent
"""

# IMPORTANT: Import Pydantic ULID patch BEFORE sentient_agent_framework
import pydantic_ulid_patch  # noqa: F401

import os
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json

from agents.meta_agent import LifeOSAgent
from usage_tracking import log_agent_invocation, calculate_usage_cost

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="dailyAGI Sentient Agent Server")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MetaAgent
meta_agent = LifeOSAgent()
agent_id = "dailyagi"
version = "0.1.0"


class AgentRequest(BaseModel):
    """Request model for Sentient Chat"""
    message: str
    wallet: str
    metadata: Optional[Dict[str, Any]] = None


async def generate_response(message: str, wallet: str):
    """
    Generate streaming response for Sentient Chat.
    Yields SSE-formatted events.
    """
    try:
        # Emit start event
        yield f"data: {json.dumps({'type': 'START', 'content': 'dailyAGI is processing your request…'})}\n\n"
        
        # Run MetaAgent with progress tracking
        async for progress_step in meta_agent.run_with_progress(message, wallet):
            yield f"data: {json.dumps({'type': 'PROGRESS', 'content': progress_step})}\n\n"
        
        # Get final answer
        final_answer = await meta_agent.handle_task(message, wallet)
        
        # Emit final message
        yield f"data: {json.dumps({'type': 'MESSAGE', 'content': final_answer})}\n\n"
        
        # Log usage
        is_premium = False  # Placeholder - check staking contract
        intent = meta_agent.detect_intent(message)
        agent_type = intent.get("agent_type", "unknown")
        cost = calculate_usage_cost(agent_type, is_premium)
        
        log_agent_invocation(
            wallet_address=wallet,
            agent_id=agent_id,
            version=version,
            cost=cost,
            agent_type=agent_type
        )
        
        # Complete
        yield f"data: {json.dumps({'type': 'DONE', 'content': ''})}\n\n"
        
    except Exception as e:
        logger.error(f"Error processing request: {e}", exc_info=True)
        yield f"data: {json.dumps({'type': 'ERROR', 'content': f'An error occurred: {str(e)}'})}\n\n"


@app.post("/sentient/agent")
async def sentient_agent(request: AgentRequest):
    """
    Main endpoint for Sentient Chat integration.
    Accepts POST requests with message and wallet, streams SSE responses.
    """
    if not request.wallet:
        raise HTTPException(status_code=400, detail="Wallet address is required")
    
    logger.info(f"Processing request from wallet {request.wallet}: {request.message}")
    
    return StreamingResponse(
        generate_response(request.message, request.wallet),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "agent": agent_id, "version": version}


def main():
    """Run the Sentient agent server"""
    import uvicorn
    
    # Get port from environment - Render provides PORT, fallback to SENTIENT_AGENT_PORT or 8001
    port_str = os.getenv("PORT") or os.getenv("SENTIENT_AGENT_PORT", "8001")
    # Handle case where SENTIENT_AGENT_PORT might be set to literal "$PORT"
    if port_str == "$PORT":
        port_str = os.getenv("PORT", "8001")
    port = int(port_str)
    
    host = os.getenv("SENTIENT_AGENT_HOST", "0.0.0.0")
    
    logger.info(f"Starting dailyAGI Sentient Agent Server on {host}:{port}")
    
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    main()
