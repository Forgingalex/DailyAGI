"""
Base Agent class for all LifeOS agents
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import os
from transformers import pipeline
from huggingface_hub import login

# OML Fingerprint for agent identification
OML_FINGERPRINT = "dailyagi_v1_0x1234567890abcdef"


class BaseAgent(ABC):
    """Base class for all DAILYAGI agents"""
    
    def __init__(self, name: str):
        self.name = name
        self.hf_token = os.getenv("HF_TOKEN")
        if self.hf_token:
            try:
                login(token=self.hf_token)
            except:
                pass  # Already logged in or token invalid
    
    @abstractmethod
    async def run(self, address: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Main agent execution method"""
        pass
    
    def get_dobby_reasoning(self, prompt: str, max_length: int = 200) -> str:
        """
        Use Dobby (Hugging Face) for reasoning tasks
        Mock implementation using transformers
        """
        try:
            # In production, this would use Sentient's Dobby API
            # For now, we'll use a simple text generation model
            generator = pipeline(
                "text-generation",
                model="gpt2",  # Placeholder - replace with Dobby model
                tokenizer="gpt2",
                max_length=max_length,
                do_sample=True,
                temperature=0.7
            )
            result = generator(prompt, max_length=max_length)[0]
            return result.get("generated_text", prompt)
        except Exception as e:
            print(f"Dobby reasoning error: {e}")
            return f"[Dobby Reasoning] {prompt}"
    
    def get_oml_fingerprint(self) -> str:
        """Return OML fingerprint for this agent"""
        return OML_FINGERPRINT


