const API_BASE_URL = "http://localhost:5282";

async function getUsers() {
    const response = await fetch(`${API_BASE_URL}/user`);

    if (!response.ok) {
        throw new Error("Nem sikerült lekérni a felhasználókat.");
    }

    const data = await response.json();

    return data.result;
}