"""
Usage Tracking Module for dailyAGI
Tracks agent invocations for monetization and OML compliance
"""

from datetime import datetime
from typing import Optional
import logging

logger = logging.getLogger(__name__)


def log_agent_invocation(
    wallet_address: str,
    agent_id: str,
    version: str = "0.1.0",
    cost: float = 0.0,
    agent_type: Optional[str] = None
) -> dict:
    """
    Log an agent invocation for usage tracking and monetization.
    
    This is a placeholder implementation. In production, this should:
    - Send to Sentient usage tracking API (when available)
    - Record in internal database/ledger
    - Update OML usage metrics
    - Track for royalty calculations
    
    Args:
        wallet_address: User's wallet address
        agent_id: Identifier for the agent (e.g., "dailyagi")
        version: Agent version
        cost: Cost in SENT tokens (for usage-based fees)
        agent_type: Type of agent invoked (reminders, spending, grocery)
    
    Returns:
        dict: Logged record
    """
    record = {
        "wallet": wallet_address,
        "agent_id": agent_id,
        "version": version,
        "timestamp": datetime.utcnow().isoformat(),
        "cost": cost,
        "agent_type": agent_type
    }
    
    # Log to console (in production, send to Sentient API or database)
    logger.info(f"LOG_INVOCATION: {record}")
    print(f"Usage log: {record}")
    
    # TODO: Integrate with actual Sentient usage endpoint when available
    # Example:
    # response = requests.post(
    #     "https://api.sentient.xyz/usage/track",
    #     json=record,
    #     headers={"Authorization": f"Bearer {SENTIENT_API_KEY}"}
    # )
    
    return record


def calculate_usage_cost(agent_type: str, is_premium: bool = False) -> float:
    """
    Calculate the cost for an agent invocation.
    
    Args:
        agent_type: Type of agent (reminders, spending, grocery)
        is_premium: Whether user has premium access (staked SENT)
    
    Returns:
        float: Cost in SENT tokens
    """
    # Free tier: basic reminders are free
    if agent_type == "reminders" and not is_premium:
        return 0.0
    
    # Premium features or advanced agents: 0.001 SENT per invocation
    if is_premium:
        return 0.0  # Premium users don't pay per-use
    
    # Usage-based fee for non-premium advanced features
    return 0.001  # 0.001 SENT per invocation

