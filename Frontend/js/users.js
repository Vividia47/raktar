let editingUserId = null;
let changingPasswordUserId = null;
let allUsers = [];

async function loadUsers() {

    try {

        const user = getLoggedInUser();

        if (!user) {
            return;
        }

        allUsers = await getUsers(user.idU);

        displayUsers();

    } catch (error) {

        console.error(error);

        showNotification("Nem sikerült betölteni a felhasználókat.", "danger");

    }
}

document.getElementById("save-edit-user-button").addEventListener("click", async function () {

    const userId = editingUserId;

    if (!userId) {
        return;
    }

    const user = {
        userName: document.getElementById("edit-user-name").value,
        fullName: document.getElementById("edit-user-full-name").value,
        userRank: Number(document.getElementById("edit-user-rank").value)
    };

    try {

        await updateUser(userId, user);

        showNotification("A felhasználó sikeresen frissítve.", "success");

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("edit-user-modal")
        );

        modal.hide();

        loadUsers();

    } catch (error) {

        console.error(error);
        showNotification(error.message, "danger");
    }
});

document.getElementById("users-table-body").addEventListener("click", function (event) {

    if (!event.target.classList.contains("change-password-button")) {
        return;
    }

    changingPasswordUserId = event.target.dataset.id;

    document.getElementById("change-user-password").value = "";
    document.getElementById("change-user-password-confirm").value = "";

    const modal = new bootstrap.Modal(
        document.getElementById("change-user-password-modal")
    );

    modal.show();
});

document.getElementById("save-user-password-button").addEventListener("click", async function () {

    const newPassword = document.getElementById("change-user-password").value;
    const confirmPassword = document.getElementById("change-user-password-confirm").value;

    if (!newPassword) {
        showNotification("Kérjük, adjon meg egy új jelszót.", "warning");
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification("A két jelszó nem egyezik.", "warning");
        return;
    }

    const currentUser = getLoggedInUser();

    try {

        await changeUserPassword(
            changingPasswordUserId,
            currentUser.idU,
            {
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }
        );

        showNotification("A jelszó sikeresen módosítva.", "success");

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("change-user-password-modal")
        );

        modal.hide();

    } catch (error) {

        console.error(error);
        showNotification(error.message, "danger");
    }
});

document.getElementById("users-table-body").addEventListener("click", function (event) {

    if (!event.target.classList.contains("edit-user-button")) {
        return;
    }

    const userId = event.target.dataset.id;
    editingUserId = userId;

    const user = getLoggedInUser();

    getUsers(user.idU).then(function (users) {

        const selectedUser = users.find(function (user) {
            return user.idU == userId;
        });

        if (!selectedUser) {
            return;
        }

        document.getElementById("edit-user-name").value =
            selectedUser.userName;

        document.getElementById("edit-user-full-name").value =
            selectedUser.fullName;

        document.getElementById("edit-user-rank").value =
            selectedUser.userRank;

        const modal = new bootstrap.Modal(
            document.getElementById("edit-user-modal")
        );

        modal.show();
    });
});

function displayUsers() {

    const tableBody = document.getElementById("users-table-body");
    const resultCount = document.getElementById("user-result-count");

    const search = document
        .getElementById("user-search")
        .value
        .toLowerCase()
        .trim();

    const roleFilter =
        document.getElementById("user-role-filter").value;


    const filteredUsers = allUsers.filter(user => {

        const matchesSearch =
            search === "" ||
            user.userName.toLowerCase().includes(search) ||
            user.fullName.toLowerCase().includes(search);


        const matchesRole =
            roleFilter === "" ||
            user.userRank == roleFilter;


        return matchesSearch && matchesRole;

    });

    resultCount.textContent = `${filteredUsers.length} találat`;


    tableBody.innerHTML = "";


    if (filteredUsers.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    Nincs találat
                </td>
            </tr>
        `;

        return;

    }


    filteredUsers.forEach(function (user) {

        const row = document.createElement("tr");


        if (user.userRank === 1) {

            row.classList.add("manager-user");

        }


        [
            ["ID", user.idU],
            ["Felhasználónév", user.userName],
            ["Teljes név", user.fullName],
            ["Szerepkör", getRoleName(user.userRank)]
        ].forEach(([label, value]) => {
            const cell = document.createElement("td");
            cell.dataset.label = label;
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        const actionsCell = document.createElement("td");
        actionsCell.dataset.label = "Műveletek";
        actionsCell.classList.add("text-end");

        [
            ["btn btn-sm btn-primary edit-user-button", "Szerkesztés"],
            ["btn btn-sm btn-secondary change-password-button", "Jelszó"],
            ["btn btn-sm btn-danger delete-user-button", "Törlés"]
        ].forEach(([className, label]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = className;
            button.dataset.id = user.idU;

            if (className.includes("edit-user-button")) {
                button.setAttribute("aria-label", label);
                button.title = label;

                const editIcon = document.createElement("i");
                editIcon.className = "bi bi-pencil";
                editIcon.setAttribute("aria-hidden", "true");
                button.appendChild(editIcon);
            } else if (className.includes("delete-user-button")) {
                button.setAttribute("aria-label", label);
                button.title = label;

                const deleteIcon = document.createElement("i");
                deleteIcon.className = "bi bi-trash";
                deleteIcon.setAttribute("aria-hidden", "true");
                button.appendChild(deleteIcon);
            } else if (className.includes("change-password-button")) {
                button.setAttribute("aria-label", label);
                button.title = label;

                const keyIcon = document.createElement("i");
                keyIcon.className = "bi bi-key";
                keyIcon.setAttribute("aria-hidden", "true");
                button.appendChild(keyIcon);
            } else {
                button.textContent = label;
            }

            actionsCell.appendChild(button);
        });

        row.appendChild(actionsCell);


        tableBody.appendChild(row);

    });

}

function getRoleName(rank) {
    const roles = {
        1: "Raktárvezető",
        2: "Raktáros",
        3: "Kereskedő",
        4: "Anyagbeszerző"
    };

    return roles[rank] || "Ismeretlen";
}

document.getElementById("save-user-button").addEventListener("click", async function () {

    const user = {
        userName: document.getElementById("add-user-name").value,
        fullName: document.getElementById("add-user-full-name").value,
        password: document.getElementById("add-user-password").value,
        userRank: Number(document.getElementById("add-user-rank").value)
    };

    try {

        await addUser(user);

        showNotification("A felhasználó sikeresen létrejött.", "success");

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("add-user-modal")
        );

        modal.hide();

        loadUsers();

    } catch (error) {

        console.error(error);
        showNotification("Nem sikerült létrehozni a felhasználót.", "danger");
    }
});

document.getElementById("users-table-body").addEventListener("click", async function (event) {

    if (!event.target.classList.contains("delete-user-button")) {
        return;
    }

    const userId = event.target.dataset.id;
    const currentUser = getLoggedInUser();

    const confirmed = confirm(
        "Biztosan törölni szeretné ezt a felhasználót?\n\n" +
        "Ez a művelet nem vonható vissza."
    );

    if (!confirmed) {
        return;
    }

    try {

        await deleteUser(userId, currentUser.idU);

        showNotification("A felhasználó sikeresen törölve.", "success");

        loadUsers();

    } catch (error) {

        console.error(error);
        showNotification(error.message, "danger");
    }
});

document.getElementById("back-button").addEventListener("click", function () {
    navigateBack();
});

document.getElementById("user-clear-filters").addEventListener("click", function () {
    document.getElementById("user-search").value = "";
    document.getElementById("user-role-filter").value = "";
    displayUsers();
});

document.getElementById("user-search").addEventListener(
    "input",
    displayUsers
);


document.getElementById("user-role-filter").addEventListener(
    "change",
    displayUsers
);

loadUsers();