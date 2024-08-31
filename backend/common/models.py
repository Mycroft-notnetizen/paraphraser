from pydantic import BaseModel

class Item(BaseModel):
    name : str
    descriptions : str



class HealthResponse(BaseModel):
    """Represents the health response"""

    alive: bool
