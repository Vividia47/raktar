const API_BASE_URL = "http://localhost:5282";

async function getUsers(userId) {
    const response = await fetch(
        `${API_BASE_URL}/user?userId=${userId}`
    );

    if (!response.ok) {
        throw new Error("Nem sikerült lekérni a felhasználókat.");
    }

    const data = await response.json();

    return data.result;
}

async function usersExist() {
    const response = await fetch(`${API_BASE_URL}/user/exists`);

    if (!response.ok) {
        throw new Error("Nem sikerült ellenőrizni a felhasználókat.");
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

async function addGoods(product, userId) {
    const response = await fetch(`${API_BASE_URL}/goods?userId=${userId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült létrehozni a terméket.");
    }

    return data.result;
}

async function updateGoods(id, product, userId) {
    const response = await fetch(`${API_BASE_URL}/goods?id=${id}&userId=${userId}`, {
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

async function deleteGoods(id, userId) {
    const response = await fetch(
        `${API_BASE_URL}/goods?id=${id}&userId=${userId}`,
        {
        method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült törölni a terméket.");
    }

    return data.result;
}

async function movementGoods(id, movement) {
    const response = await fetch(`${API_BASE_URL}/goods/movement?id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movement)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült rögzíteni a készletmozgást.");
    }

    return data.result;
}

async function getHistory() {
    const response = await fetch(`${API_BASE_URL}/history`);

    if (!response.ok) {
        throw new Error("Nem sikerült lekérni a készletmozgásokat.");
    }

    const data = await response.json();

    return data.result;
}

function requireLogin() {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
        window.location.href = "index.html";
    }
}

function getLoggedInUser() {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
        return null;
    }

    return JSON.parse(savedUser);
}

function hasRole(...allowedRanks) {
    const user = getLoggedInUser();

    if (!user) {
        return false;
    }

    return allowedRanks.includes(user.userRank);
}

async function updateSellingPrice(id, sprice, userId) {
    const response = await fetch(`${API_BASE_URL}/goods/price?id=${id}&userId=${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sprice)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült módosítani az eladási árat.");
    }

    return data.result;
}

async function changePassword(id, passwordData) {
    const response = await fetch(`${API_BASE_URL}/user/change-password?id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(passwordData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült módosítani a jelszót.");
    }

    return data;
}