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
    return core_schema.no_info_after_validator_function(
        lambda x: ULID(x) if not isinstance(x, ULID) else x,
        core_schema.str_schema(),
        serialization=core_schema.to_ser_schema(
            core_schema.str_schema(),
            lambda x: str(x),
        ),
    )


# Monkey patch ULID class
ULID.__get_pydantic_core_schema__ = __get_pydantic_core_schema__

