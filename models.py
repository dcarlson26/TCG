from pydantic import BaseModel


class inventory(BaseModel):
    product_id: int
    inventory_method: str
    inventory_price: float
    inventory_date: str
    condition: str
    notes: str | None = None