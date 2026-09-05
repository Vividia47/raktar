async function checkUsers() {
    try {
        const users = await getUsers();

        const registerSection = document.getElementById("register-section");
        const loginSection = document.getElementById("login-section");

        if (users.length === 0) {
            registerSection.classList.remove("d-none");
            loginSection.classList.add("d-none");

            console.log("Nincs felhasználó - regisztrációs űrlap megjelenítése");
        } else {
            registerSection.classList.add("d-none");
            loginSection.classList.remove("d-none");

            console.log("Felhasználók léteznek - bejelentkezési űrlap megjelenítése");
        }

    } catch (error) {
        console.error(error);
    }
}

checkUsers();

document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("register-username").value;
    const fullname = document.getElementById("register-fullname").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;

    if (password !== passwordConfirm) {
        alert("A jelszavak nem egyeznek.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: username,
                fullName: fullname,
                password: password,
                userRank: 1
            })
        });

        if (!response.ok) {
            throw new Error("Felhasználó létrehozása sikertelen.");
        }

        alert("Raktárvezetői fiók sikeresen létrehozva.");

        document.getElementById("register-form").reset();

        checkUsers();

    } catch (error) {
        console.error(error);
        alert("Hiba történt a fiók létrehozása során.");
    }
});

document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Sikertelen bejelentkezés.");
            return;
        }

        alert(`Üdvözöljük, ${data.result.fullName}!`);

document.getElementById("auth-section").classList.add("d-none");
document.getElementById("dashboard-section").classList.remove("d-none");

document.getElementById("welcome-message").textContent =
    `Üdvözöljük, ${data.result.fullName}!`;

console.log("Sikeres bejelentkezés:", data.result);

    } catch (error) {
        console.error(error);
        alert("Hiba történt a bejelentkezés során.");
    }
});

document.getElementById("logout-button").addEventListener("click", function () {
    document.getElementById("dashboard-section").classList.add("d-none");
    document.getElementById("auth-section").classList.remove("d-none");

    document.getElementById("login-form").reset();

    checkUsers();
});