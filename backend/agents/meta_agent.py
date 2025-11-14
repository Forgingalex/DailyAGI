"""
MetaAgent (LifeOSAgent) - ROMA Orchestrator for dailyAGI
Routes user intents to appropriate sub-agents and coordinates multi-agent workflows
"""

import re
from typing import Dict, Any, AsyncGenerator, Optional
from agents.base import BaseAgent
from agents.reminders import RemindersAgent
from agents.spending import SpendingAgent
from agents.grocery import GroceryAgent
from utils.enclave import MockEnclave

# OML Fingerprint for MetaAgent
OML_FINGERPRINT = "dailyagi_meta_v1_0x1234567890abcdef"


class LifeOSAgent:
    """
    MetaAgent that orchestrates all dailyAGI sub-agents using ROMA runtime.
    
    This agent:
    - Detects user intent from natural language
    - Routes to appropriate sub-agent (Reminders, Spending, Grocery)
    - Coordinates multi-agent workflows
    - Tracks progress for streaming responses
    """
    
    def __init__(self):
        self.reminders_agent = RemindersAgent()
        self.spending_agent = SpendingAgent()
        self.grocery_agent = GroceryAgent()
        self.enclave = MockEnclave()
        self._last_result = None  # Store last result to avoid re-running
        self._last_intent = None
        self._last_params = None
        
        # Intent detection patterns
        self.reminder_keywords = [
            "remind", "reminder", "schedule", "calendar", "appointment",
            "meeting", "call", "task", "todo", "remember", "alert"
        ]
        self.spending_keywords = [
            "spend", "spending", "expense", "transaction", "money",
            "cost", "budget", "wallet", "balance", "purchase", "buy"
        ]
        self.grocery_keywords = [
            "grocery", "groceries", "shopping", "fridge", "refrigerator",
            "food", "items", "list", "buy", "need", "missing"
        ]
    
    def detect_intent(self, message: str) -> Dict[str, Any]:
        """
        Detect user intent using keyword matching and Dobby reasoning.
        
        In production, this would use Sentient's Dobby for more sophisticated
        intent detection. For now, we use pattern matching.
        
        Args:
            message: User's natural language message
        
        Returns:
            dict: Intent detection result with agent_type and confidence
        """
        message_lower = message.lower()
        
        # Count keyword matches
        reminder_score = sum(1 for kw in self.reminder_keywords if kw in message_lower)
        spending_score = sum(1 for kw in self.spending_keywords if kw in message_lower)
        grocery_score = sum(1 for kw in self.grocery_keywords if kw in message_lower)
        
        # Use Dobby reasoning for ambiguous cases
        if reminder_score == spending_score == grocery_score == 0:
            # No clear intent, use Dobby to reason
            reasoning_prompt = f"Determine the intent of this message: {message}"
            reasoning = self.reminders_agent.get_dobby_reasoning(reasoning_prompt)
            
            # Fallback to reminders if unclear
            return {
                "agent_type": "reminders",
                "confidence": 0.5,
                "reasoning": reasoning
            }
        
        # Determine highest scoring intent
        scores = {
            "reminders": reminder_score,
            "spending": spending_score,
            "grocery": grocery_score
        }
        
        max_score = max(scores.values())
        agent_type = max(scores, key=scores.get)
        
        # Calculate confidence
        total_score = sum(scores.values())
        confidence = max_score / total_score if total_score > 0 else 0.5
        
        return {
            "agent_type": agent_type,
            "confidence": confidence,
            "scores": scores
        }
    
    def extract_params(self, message: str, agent_type: str) -> Dict[str, Any]:
        """
        Extract parameters from user message for the target agent.
        
        Args:
            message: User's message
            agent_type: Detected agent type
        
        Returns:
            dict: Parameters for the agent
        """
        params = {}
        
        if agent_type == "reminders":
            # Extract time references
            time_patterns = [
                r"tomorrow",
                r"next week",
                r"(\d+)\s*(day|days|hour|hours|minute|minutes)",
                r"at\s+(\d+):(\d+)",
            ]
            
            # Extract title/description
            if "remind me" in message.lower():
                # Extract text after "remind me"
                match = re.search(r"remind me (?:to|about)?\s*(.+)", message.lower())
                if match:
                    params["title"] = match.group(1).strip()
            
        elif agent_type == "spending":
            # Extract time range
            if "last week" in message.lower() or "this week" in message.lower():
                params["timeRange"] = "7d"
            elif "last month" in message.lower() or "this month" in message.lower():
                params["timeRange"] = "30d"
            else:
                params["timeRange"] = "30d"  # Default
        
        elif agent_type == "grocery":
            # Check for image references
            if "image" in message.lower() or "photo" in message.lower() or "picture" in message.lower():
                params["has_image"] = True
        
        return params
    
    async def run_with_progress(
        self,
        message: str,
        wallet: str
    ) -> AsyncGenerator[str, None]:
        """
        Run agent with progress tracking for streaming responses.
        
        This method yields progress updates that can be streamed to Sentient Chat.
        Stores results for use in handle_task() to avoid re-running agents.
        
        Args:
            message: User's natural language message
            wallet: User's wallet address
        
        Yields:
            str: Progress update messages
        """
        # Step 1: Detect intent
        yield "Analyzing your request..."
        intent = self.detect_intent(message)
        agent_type = intent["agent_type"]
        self._last_intent = intent
        
        yield f"Detected intent: {agent_type} (confidence: {intent['confidence']:.0%})"
        
        # Step 2: Extract parameters
        yield "Extracting parameters..."
        params = self.extract_params(message, agent_type)
        self._last_params = params
        
        # Step 3: Route to appropriate agent
        if agent_type == "reminders":
            yield "Routing to Reminders Agent..."
            yield "Processing reminder request..."
            result = await self.reminders_agent.run(wallet, {
                "action": "create",
                **params
            })
        elif agent_type == "spending":
            yield "Routing to Spending Agent..."
            yield "Fetching on-chain transactions..."
            yield "Analyzing spending patterns..."
            result = await self.spending_agent.run(wallet, {
                "timeRange": params.get("timeRange", "30d")
            })
        elif agent_type == "grocery":
            yield "Routing to Grocery Agent..."
            yield "Processing grocery request..."
            result = await self.grocery_agent.run(wallet, params)
        else:
            yield "Unknown agent type, using default..."
            result = {"error": "Unknown agent type"}
        
        # Store result for handle_task
        self._last_result = result
        yield "Finalizing response..."
    
    async def handle_task(
        self,
        message: str,
        wallet: str
    ) -> str:
        """
        Handle the complete task and return final answer.
        
        This method is called after run_with_progress() to get the final result.
        Uses cached results from run_with_progress() to avoid re-running agents.
        
        Args:
            message: User's natural language message
            wallet: User's wallet address
        
        Returns:
            str: Final answer to send to user
        """
        # Use cached results if available (from run_with_progress)
        if self._last_result is not None and self._last_intent is not None:
            intent = self._last_intent
            result = self._last_result
        else:
            # Fallback: detect and run if not called via run_with_progress
            intent = self.detect_intent(message)
            params = self.extract_params(message, intent["agent_type"])
            
            if intent["agent_type"] == "reminders":
                result = await self.reminders_agent.run(wallet, {
                    "action": "create",
                    **params
                })
            elif intent["agent_type"] == "spending":
                result = await self.spending_agent.run(wallet, {
                    "timeRange": params.get("timeRange", "30d")
                })
            elif intent["agent_type"] == "grocery":
                result = await self.grocery_agent.run(wallet, params)
            else:
                return "I'm not sure how to help with that. Try asking about reminders, spending, or groceries!"
        
        agent_type = intent["agent_type"]
        
        # Format response based on agent type
        if agent_type == "reminders":
            if "error" in result:
                return f"I encountered an error: {result['error']}"
            
            title = result.get("title", "Reminder")
            datetime_str = result.get("datetime", "")
            return f"✅ Reminder set: {title} at {datetime_str}"
        
        elif agent_type == "spending":
            if "error" in result:
                return f"I encountered an error: {result['error']}"
            
            total = result.get("total", 0)
            categories = result.get("categories", {})
            
            response = f"💰 Spending Summary:\nTotal: ${total:.2f}\n\n"
            for category, amount in categories.items():
                response += f"{category.capitalize()}: ${amount:.2f}\n"
            
            if result.get("nudge"):
                response += f"\n💡 {result['nudge']}"
            
            return response
        
        elif agent_type == "grocery":
            if "error" in result:
                return f"I encountered an error: {result['error']}"
            
            missing_items = result.get("missing_items", [])
            if missing_items:
                response = f"🛒 Missing items detected:\n"
                for item in missing_items:
                    response += f"• {item}\n"
                
                if result.get("list_cid"):
                    response += f"\n📦 Shopping list saved to IPFS: {result['list_cid']}"
            else:
                response = "✅ Your fridge looks well-stocked! No missing items detected."
            
            return response
        
        else:
            return "I'm not sure how to help with that. Try asking about reminders, spending, or groceries!"

