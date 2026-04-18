let products = [];
let selectedCards = [];
const saved = localStorage.getItem("cards");
if (saved) {
    selectedCards = JSON.parse(saved);
    updateTotals();
}


async function loadData() {
    //update to data_local.txt later
    const response = await fetch(`data.txt?v=${Date.now()}`);
    const text = await response.text();
    const lines = text.split("\n").filter(line => line.trim() !== "");

    let version = "unknown";

    // Check first line for version
    if (lines.length > 0 && lines[0].startsWith("#version=")) {
        version = lines[0].split("=")[1];
        lines.shift(); // remove version line
    }
    
    if (currVersion && currVersion !== version) {
        console.log("Data updated!");
    }
        
    products = text.split("\n")
        .filter(line => line.trim() !== "")
        .map(line => {
            const parts = line.split("|");
            return {
                name: parts[0],
                subtype: parts[1],
                price: parts[2],
                image: parts[3],
                id: parts[4]
            };
        });
    
    localStorage.setItem("dataVersion", version);
}

function render(results) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    results.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <img src="${p.image}" loading="lazy" />
            <div>
                <b>${p.name}</b><br/>
                ${p.subtype}<br/>
                $${p.price}<br/>
            </div>
        `;

        const addButton = document.createElement("button");
        addButton.textContent = "Add";

        addButton.addEventListener("click", () => {
            addCard(p.id, p.name, p.price);
        });

        div.appendChild(addButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removeCard(p.id);
        });

        div.appendChild(removeButton);

        container.appendChild(div);
    });
}

function addCard(id, name, price) {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) return;

    if (!selectedCards[id]) {
        selectedCards[id] = {
            name,
            price: priceNum,
            qty: 0
        };
    }

    selectedCards[id].qty++;

    updateTotals();
    renderSelectedCards();

    localStorage.setItem("cards", JSON.stringify(selectedCards));
}

function removeCard(id) {
    if (!selectedCards[id]) return;

    selectedCards[id].qty--;

    if (selectedCards[id].qty <= 0) {
        delete selectedCards[id];
    }

    updateTotals();
    renderSelectedCards();
    localStorage.setItem("cards", JSON.stringify(selectedCards));
}

function clearAll(){
    selectedCards = {};
    updateTotals();
    renderSelectedCards();
    localStorage.setItem("cards", JSON.stringify(selectedCards)); // if using storage
}

function updateTotals() {
    let total = 0;

    for (const id in selectedCards) {
        const card = selectedCards[id];
        total += card.price * card.qty;
    }

    const cashValue = total * 0.7;
    const tradeValue = total * 0.8;

    document.getElementById("totals").innerHTML = `
        <b>Total Market:</b> $${total.toFixed(2)}<br/>
        <b>Cash (70%):</b> $${cashValue.toFixed(2)}<br/>
        <b>Trade (80%):</b> $${tradeValue.toFixed(2)}
    `;
}

function runSearch() {
    const input = document.getElementById("search");
    const value = input.value.toLowerCase();

    if (!value.trim()) return;

    let filtered = products
        .filter(p =>
            p.name.toLowerCase().includes(value) &&
            p.price !== "None" &&
            !isNaN(parseFloat(p.price))
        )
        .sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    render(filtered);
}

function renderSelectedCards() {
    const container = document.getElementById("selectedList");
    container.innerHTML = "";

    for (const id in selectedCards) {
        const card = selectedCards[id];

        const div = document.createElement("div");
        div.className = "cart-item";

        const text = document.createElement("div");
        text.innerHTML = `
            <b>${card.name || "Unknown"}</b><br/>
            Qty: ${card.qty || 0} | $${card.price?.toFixed(2) || "0.00"}
        `;
        const btnContainer = document.createElement("div");

        const addBtn = document.createElement("button");
        addBtn.textContent = "+";
        addBtn.addEventListener("click", () => addCard(id, card.name, card.price));

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "-";
        removeBtn.addEventListener("click", () => removeCard(id));

        btnContainer.appendChild(addBtn);
        btnContainer.appendChild(removeBtn);
        div.appendChild(text);
        div.appendChild(btnContainer);
        container.appendChild(div);
    }
}

document.getElementById("search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        runSearch();
    }
});

document.getElementById("searchBtn").addEventListener("click", runSearch);

//document.getElementById("clearBtn").addEventListener("click", clearAll);

// init
loadData();

window.onload = () => {
    document.getElementById("search").focus();
};
