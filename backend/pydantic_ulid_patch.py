"""
Monkey patch to add Pydantic support for ULID types.
This must be imported before sentient_agent_framework.
"""
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema
from ulid import ULID


def __get_pydantic_core_schema__(
    source_type: type[ULID],
    handler: GetCoreSchemaHandler,
) -> core_schema.CoreSchema:
    """
    Add Pydantic support for ULID type.
    """
    def validate_ulid(value):
        if isinstance(value, ULID):
            return value
        if isinstance(value, str):
            return ULID.from_str(value)
        return ULID(value)
    
    return core_schema.no_info_after_validator_function(
        validate_ulid,
        core_schema.str_schema(),
    )


# Monkey patch ULID class
ULID.__get_pydantic_core_schema__ = __get_pydantic_core_schema__

