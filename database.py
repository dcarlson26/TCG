# backend/database.py

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "pokemon.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def initialize_database():
    conn = get_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            product_id INTEGER NOT NULL,

            inventory_method TEXT NOT NULL,

            inventory_price REAL NOT NULL,

            inventory_date TEXT NOT NULL,

            condition TEXT,

            notes TEXT
        )
    """)

    conn.commit()
    conn.close()

def add_inventory(
    product_id: int,
    inventory_method: str,
    inventory_price: float,
    condition: str,
    inventory_date: str,
    notes: str | None = None,
):
    conn = get_connection()

    conn.execute(
        """
        INSERT INTO inventory
        (
            product_id,
            inventory_method,
            inventory_price,
            inventory_date,
            condition,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            product_id,
            inventory_method,
            inventory_price,
            inventory_date,
            condition,
            notes,
        ),
    )

    conn.commit()
    conn.close()

def get_all_inventory():
    conn = get_connection()

    rows = conn.execute("""
        SELECT *
        FROM inventory
        ORDER BY inventory_date DESC
    """).fetchall()

    conn.close()

    return [dict(row) for row in rows]