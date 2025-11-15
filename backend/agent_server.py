"""
Sentient Agent Server for dailyAGI
Uses Sentient-Agent-Framework to expose /sentient/agent endpoint for Sentient Chat
"""

# IMPORTANT: Import Pydantic ULID patch BEFORE sentient_agent_framework
import pydantic_ulid_patch  # noqa: F401

import os
import logging

# Import from sentient_agent_framework - check what's actually available
# The API may vary by version, so we'll inspect and use what's available
import sentient_agent_framework as saf

# Check what's available in the package
if hasattr(saf, 'AbstractAgent'):
    AbstractAgent = saf.AbstractAgent
elif hasattr(saf, 'Agent'):
    AbstractAgent = saf.Agent
else:
    # Try importing from submodules
    try:
        from sentient_agent_framework.interface.agent import AbstractAgent
    except ImportError:
        try:
            from sentient_agent_framework.agent import AbstractAgent
        except ImportError:
            raise ImportError("Could not find AbstractAgent in sentient_agent_framework")

# Import other classes similarly
DefaultServer = getattr(saf, 'DefaultServer', None)
if not DefaultServer:
    try:
        from sentient_agent_framework.implementation.default_server import DefaultServer
    except ImportError:
        try:
            from sentient_agent_framework.server import DefaultServer
        except ImportError:
            raise ImportError("Could not find DefaultServer in sentient_agent_framework")

Session = getattr(saf, 'Session', None)
Query = getattr(saf, 'Query', None)
ResponseHandler = getattr(saf, 'ResponseHandler', None)

# If not in main module, try submodules
if not Session:
    try:
        from sentient_agent_framework.interface import Session, Query, ResponseHandler
    except ImportError:
        try:
            from sentient_agent_framework.types import Session, Query, ResponseHandler
        except ImportError:
            # Use generic types if not found
            from typing import Any
            Session = Any
            Query = Any
            ResponseHandler = Any

from agents.meta_agent import LifeOSAgent
from usage_tracking import log_agent_invocation, calculate_usage_cost

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DailyAGIAgent(AbstractAgent):
    """
    dailyAGI Agent for Sentient Chat integration.
    
    This agent:
    - Receives queries from Sentient Chat
    - Routes to LifeOSAgent (MetaAgent) for ROMA orchestration
    - Streams progress events via ResponseHandler
    - Logs usage for monetization
    """
    
    def __init__(self):
        super().__init__(name="dailyAGI")
        self.meta_agent = LifeOSAgent()
        self.agent_id = "dailyagi"
        self.version = "0.1.0"
    
    async def assist(
        self,
        session: Session,
        query: Query,
        response_handler: ResponseHandler
    ):
        """
        Main assist method called by Sentient framework.
        
        Args:
            session: User session context
            query: User's query with message and metadata
            response_handler: Handler for streaming responses
        """
        # Extract wallet and message from query
        wallet = query.metadata.get("wallet") if query.metadata else None
        user_input = query.prompt if hasattr(query, "prompt") else str(query)
        
        # Fallback: try to get wallet from query content if not in metadata
        if not wallet:
            # In some implementations, wallet might be in query content
            wallet = getattr(query, "wallet", None)
        
        if not wallet:
            await response_handler.emit_text_block(
                "ERROR",
                "Wallet address is required. Please connect your wallet."
            )
            await response_handler.complete()
            return
        
        logger.info(f"Processing request from wallet {wallet}: {user_input}")
        
        try:
            # Emit start event
            await response_handler.emit_text_block(
                "START",
                "dailyAGI is processing your request…"
            )
            
            # Run MetaAgent with progress tracking
            async for progress_step in self.meta_agent.run_with_progress(
                user_input,
                wallet
            ):
                await response_handler.emit_text_block(
                    "PROGRESS",
                    progress_step
                )
            
            # Get final answer
            final_answer = await self.meta_agent.handle_task(user_input, wallet)
            
            # Emit final message
            await response_handler.emit_text_block(
                "MESSAGE",
                final_answer
            )
            
            # Log usage (placeholder for Sentient usage API)
            # TODO: Check if user has premium (staked SENT)
            is_premium = False  # Placeholder - check staking contract
            intent = self.meta_agent.detect_intent(user_input)
            agent_type = intent.get("agent_type", "unknown")
            cost = calculate_usage_cost(agent_type, is_premium)
            
            log_agent_invocation(
                wallet_address=wallet,
                agent_id=self.agent_id,
                version=self.version,
                cost=cost,
                agent_type=agent_type
            )
            
            # Complete the stream
            await response_handler.complete()
            
        except Exception as e:
            logger.error(f"Error processing request: {e}", exc_info=True)
            await response_handler.emit_text_block(
                "ERROR",
                f"An error occurred: {str(e)}"
            )
            await response_handler.complete()


def main():
    """Run the Sentient agent server"""
    agent = DailyAGIAgent()
    
    # Get port from environment or default to 8001 (to avoid conflict with FastAPI)
    port = int(os.getenv("SENTIENT_AGENT_PORT", 8001))
    host = os.getenv("SENTIENT_AGENT_HOST", "0.0.0.0")
    
    logger.info(f"Starting dailyAGI Sentient Agent Server on {host}:{port}")
    
    server = DefaultServer(agent, host=host, port=port)
    server.run()


if __name__ == "__main__":
    main()

