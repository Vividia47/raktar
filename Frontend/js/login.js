async function checkUsers() {
    try {
        const usersExistResult = await usersExist();

        const registerSection = document.getElementById("register-section");
        const loginSection = document.getElementById("login-section");

        if (!usersExistResult) {
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
        showNotification("Nem sikerült ellenőrizni a felhasználókat.", "danger");
    }
}

checkUsers();

function updateDashboard() {
    const user = getLoggedInUser();

    if (!user) {
        return;
    }

    const roles = {
        1: "Raktárvezető",
        2: "Raktáros",
        3: "Kereskedő",
        4: "Anyagbeszerző"
    };

    const userInfo = document.getElementById("user-info");

    if (userInfo) {
        userInfo.textContent =
            `Bejelentkezve: ${user.fullName} — ${roles[user.userRank]}`;
    }

    const stockMovementsCard =
        document.getElementById("stock-movements-card");

    if (stockMovementsCard) {
        stockMovementsCard.style.display =
            hasRole(1, 2) ? "" : "none";
    }

    const usersCard = document.getElementById("users-card");

if (usersCard) {
    usersCard.style.display = hasRole(1) ? "" : "none";
}

}

const savedUser = localStorage.getItem("loggedInUser");

if (savedUser) {
    const user = JSON.parse(savedUser);

    document.getElementById("auth-section").classList.add("d-none");
    document.getElementById("dashboard-section").classList.remove("d-none");

    updateDashboard();
}

document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("register-username").value;
    const fullname = document.getElementById("register-fullname").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;

    if (password !== passwordConfirm) {
        showNotification("A jelszavak nem egyeznek.", "warning");
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

        showNotification("Raktárvezetői fiók sikeresen létrehozva.", "success");

        document.getElementById("register-form").reset();

        checkUsers();

    } catch (error) {
        console.error(error);
        showNotification("Hiba történt a fiók létrehozása során.", "danger");
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
            showNotification(data.message || "Sikertelen bejelentkezés.", "danger");
            return;
        }

localStorage.setItem("loggedInUser", JSON.stringify(data.result));

document.getElementById("auth-section").classList.add("d-none");
document.getElementById("dashboard-section").classList.remove("d-none");

updateDashboard();

    } catch (error) {
        console.error(error);
        showNotification("Hiba történt a bejelentkezés során.", "danger");
    }
});

document.getElementById("logout-button").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");

    document.getElementById("dashboard-section").classList.add("d-none");
    document.getElementById("auth-section").classList.remove("d-none");

    document.getElementById("login-form").reset();

    checkUsers();
});

[
    ["products-card", "products.html"],
    ["stock-navigation-card", "stock.html"],
    ["history-card", "history.html"],
    ["users-navigation-card", "users.html"]
].forEach(([cardId, page]) => {
    const card = document.getElementById(cardId);

    if (!card) {
        return;
    }

    const openPage = () => {
        window.location.href = page;
    };

    card.addEventListener("click", openPage);
    card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPage();
        }
    });
});

document.getElementById("change-password-button").addEventListener("click", function () {
    const modal = new bootstrap.Modal(
        document.getElementById("change-password-modal")
    );

    modal.show();
});

document.getElementById("change-password-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const user = getLoggedInUser();

    const passwordData = {
        currentPassword: document.getElementById("current-password").value,
        newPassword: document.getElementById("new-password").value,
        confirmPassword: document.getElementById("confirm-password").value
    };

    try {
        await changePassword(user.idU, passwordData);

        showNotification("Sikeres jelszómódosítás! Kérjük, jelentkezzen be újra.", "success");

        localStorage.removeItem("loggedInUser");

        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
        showNotification(error.message, "danger");
    }
});