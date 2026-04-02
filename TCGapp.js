let products = [];

async function loadData() {
    const response = await fetch("data.txt");
    const text = await response.text();

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
                ID: ${p.id}
            </div>
        `;

        container.appendChild(div);
    });
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

document.getElementById("search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        runSearch();
    }
});

document.getElementById("searchBtn").addEventListener("click", runSearch);

// init
loadData();

window.onload = () => {
    document.getElementById("search").focus();
};
