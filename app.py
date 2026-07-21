from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.database import initialize_database

initialize_database()
app = FastAPI()

from backend.models import inventory
from backend.database import add_inventory

@app.post("/api/inventory")
def create_inventory(inventory: inventory):

    add_inventory(
        inventory.product_id,
        inventory.inventory_method,
        inventory.inventory_price,
        inventory.condition,
        inventory.inventory_date,
        inventory.notes,
    )

    return {"success": True}

from backend.models import inventory
from backend.database import add_inventory

from backend.database import get_all_inventory

@app.get("/api/inventory")
def inventory():

    return get_all_inventory()

frontend_dir = Path(__file__).parent.parent / "frontend"

app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
