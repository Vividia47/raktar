const API_BASE_URL = "http://localhost:5282";

async function getUsers() {
    const response = await fetch(`${API_BASE_URL}/user`);

    if (!response.ok) {
        throw new Error("Nem sikerült lekérni a felhasználókat.");
    }

    const data = await response.json();

    return data.result;
}

async function getGoods() {
    const response = await fetch(`${API_BASE_URL}/goods`);

    if (!response.ok) {
        throw new Error("Nem sikerült lekérni a termékeket.");
    }

    const data = await response.json();

    return data.result;
}

async function addGoods(product) {
    const response = await fetch(`${API_BASE_URL}/goods`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült létrehozni a terméket.");
    }

    return data.result;
}

async function updateGoods(id, product) {
    const response = await fetch(`${API_BASE_URL}/goods?id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült módosítani a terméket.");
    }

    return data.result;
}