const API_BASE_URL = "http://localhost:5282";

function initializePasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach(toggle => {
        toggle.addEventListener("click", function () {
            const input = document.getElementById(toggle.dataset.passwordTarget);
            const icon = toggle.querySelector("i");

            if (!input || !icon) {
                return;
            }

            const isVisible = input.type === "text";
            input.type = isVisible ? "password" : "text";
            icon.className = isVisible ? "bi bi-eye" : "bi bi-eye-slash";
            toggle.setAttribute(
                "aria-label",
                isVisible ? "Jelszó megjelenítése" : "Jelszó elrejtése"
            );
        });
    });
}

initializePasswordToggles();

function showTableLoading(tableBody, columnCount, rowCount = 4) {
    tableBody.innerHTML = "";

    for (let index = 0; index < rowCount; index += 1) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = columnCount;
        cell.className = "table-loading-cell";

        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-line";
        skeleton.setAttribute("aria-hidden", "true");
        cell.appendChild(skeleton);
        row.appendChild(cell);
        tableBody.appendChild(row);
    }
}

function showTableError(tableBody, columnCount, message, retryCallback) {
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = columnCount;
    cell.className = "text-center table-error-cell py-4";

    const text = document.createElement("p");
    text.className = "mb-3";
    text.textContent = message;

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "btn btn-primary btn-sm";
    retryButton.innerHTML = '<i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Újrapróbálás';
    retryButton.addEventListener("click", retryCallback);

    cell.appendChild(text);
    cell.appendChild(retryButton);
    row.appendChild(cell);
    tableBody.appendChild(row);
}

function setButtonLoading(button, isLoading) {
    if (!button) {
        return;
    }

    if (isLoading) {
        button.disabled = true;
        button.dataset.originalContent = button.innerHTML;
        button.dataset.originalAriaLabel = button.getAttribute("aria-label") || "";
        button.dataset.originalTitle = button.getAttribute("title") || "";
        button.innerHTML = '<i class="bi bi-three-dots button-loading-icon" aria-hidden="true"></i>';
        button.setAttribute("aria-label", "Mentés folyamatban");
        button.setAttribute("title", "Mentés folyamatban");
        return;
    }

    button.disabled = false;
    button.innerHTML = button.dataset.originalContent || button.innerHTML;

    if (button.dataset.originalAriaLabel) {
        button.setAttribute("aria-label", button.dataset.originalAriaLabel);
    } else {
        button.removeAttribute("aria-label");
    }

    if (button.dataset.originalTitle) {
        button.setAttribute("title", button.dataset.originalTitle);
    } else {
        button.removeAttribute("title");
    }

    delete button.dataset.originalContent;
    delete button.dataset.originalAriaLabel;
    delete button.dataset.originalTitle;
}

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

async function getUserNames() {
    const response = await fetch(
        `${API_BASE_URL}/user/names`
    );

    if (!response.ok) {
        throw new Error("Nem sikerült lekérni a felhasználóneveket.");
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

async function addUser(user) {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error("Nem sikerült létrehozni a felhasználót.");
    }

    return await response.json();
}

async function updateUser(id, user) {
    const response = await fetch(
        `${API_BASE_URL}/user?id=${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Nem sikerült frissíteni a felhasználót.");
    }

    return data;
}

async function deleteUser(id, userId) {
    const response = await fetch(
        `${API_BASE_URL}/user?id=${id}&userId=${userId}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Nem sikerült törölni a felhasználót."
        );
    }

    return data;
}

async function changeUserPassword(id, userId, passwordData) {
    const response = await fetch(
        `${API_BASE_URL}/user/change-password-manager?id=${id}&userId=${userId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(passwordData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Nem sikerült módosítani a jelszót."
        );
    }

    return data;
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

function showNotification(message, type = "info") {
    let container = document.getElementById("notification-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        container.className = "notification-container";
        container.setAttribute("aria-live", "polite");
        container.setAttribute("aria-atomic", "true");
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
    notification.setAttribute("role", type === "danger" ? "alert" : "status");
    notification.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close";
    closeButton.setAttribute("aria-label", "Bezárás");
    closeButton.addEventListener("click", () => notification.remove());

    notification.appendChild(closeButton);
    container.appendChild(notification);

    window.setTimeout(() => notification.remove(), 5000);
}

function navigateBack() {
    const hasSameOriginReferrer =
        document.referrer &&
        new URL(document.referrer).origin === window.location.origin;

    if (hasSameOriginReferrer && window.history.length > 1) {
        window.history.back();
        return;
    }

    window.location.href = "index.html";
}

function initializeModalFocusManagement() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("show.bs.modal", function () {
            const activeElement = document.activeElement;

            if (activeElement && !modal.contains(activeElement)) {
                modal._returnFocusElement = activeElement;
            }
        });

        modal.addEventListener("hidden.bs.modal", function () {
            const returnFocusElement = modal._returnFocusElement;

            if (returnFocusElement && document.contains(returnFocusElement)) {
                returnFocusElement.focus();
            }

            modal._returnFocusElement = null;
        });
    });
}

initializeModalFocusManagement();