let editingUserId = null;
let changingPasswordUserId = null;
let pendingDeleteUserId = null;
let allUsers = [];

async function loadUsers() {
    const tableBody = document.getElementById("users-table-body");
    showTableLoading(tableBody, 5);

    try {

        const user = getLoggedInUser();

        if (!user) {
            return;
        }

        allUsers = await getUsers(user.idU);

        displayUsers();

    } catch (error) {

        console.error(error);

        showTableError(
            tableBody,
            5,
            "Nem sikerült betölteni a felhasználókat.",
            loadUsers
        );
        showNotification("Nem sikerült betölteni a felhasználókat.", "danger");

    }
}

document.getElementById("edit-user-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userId = editingUserId;
    const saveButton = event.submitter;

    if (!userId) {
        return;
    }

    const user = {
        userName: document.getElementById("edit-user-name").value,
        fullName: document.getElementById("edit-user-full-name").value,
        userRank: Number(document.getElementById("edit-user-rank").value)
    };

    setButtonLoading(saveButton, true);

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
    } finally {
        setButtonLoading(saveButton, false);
    }
});

document.getElementById("users-table-body").addEventListener("click", function (event) {

    const passwordButton = event.target.closest(".change-password-button");

    if (!passwordButton) {
        return;
    }

    changingPasswordUserId = passwordButton.dataset.id;

    document.getElementById("change-user-password").value = "";
    document.getElementById("change-user-password-confirm").value = "";

    const modal = new bootstrap.Modal(
        document.getElementById("change-user-password-modal")
    );

    modal.show();
});

document.getElementById("change-user-password-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const saveButton = event.submitter;
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
    setButtonLoading(saveButton, true);

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
    } finally {
        setButtonLoading(saveButton, false);
    }
});

document.getElementById("users-table-body").addEventListener("click", function (event) {

    const editButton = event.target.closest(".edit-user-button");

    if (!editButton) {
        return;
    }

    const userId = editButton.dataset.id;
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

            if (label === "Szerepkör" && user.userRank === 1) {
                const shieldIcon = document.createElement("i");
                shieldIcon.className = "bi bi-shield-lock ms-1";
                shieldIcon.setAttribute("aria-hidden", "true");
                shieldIcon.title = "Raktárvezető";
                cell.appendChild(shieldIcon);
            }

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

document.getElementById("add-user-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const saveButton = event.submitter;
    const user = {
        userName: document.getElementById("add-user-name").value,
        fullName: document.getElementById("add-user-full-name").value,
        password: document.getElementById("add-user-password").value,
        userRank: Number(document.getElementById("add-user-rank").value)
    };

    setButtonLoading(saveButton, true);

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
    } finally {
        setButtonLoading(saveButton, false);
    }
});

document.getElementById("users-table-body").addEventListener("click", async function (event) {

    const deleteButton = event.target.closest(".delete-user-button");

    if (!deleteButton) {
        return;
    }

    const userId = deleteButton.dataset.id;
    const selectedUser = allUsers.find(user => user.idU == userId);

    pendingDeleteUserId = userId;
    document.getElementById("delete-user-name").textContent =
        selectedUser?.fullName || selectedUser?.userName || `ID: ${userId}`;

    new bootstrap.Modal(
        document.getElementById("delete-user-modal")
    ).show();
});

document.getElementById("confirm-delete-user-button").addEventListener("click", async function () {
    if (!pendingDeleteUserId) {
        return;
    }

    try {
        const currentUser = getLoggedInUser();

        await deleteUser(
            pendingDeleteUserId,
            currentUser.idU
        );

        bootstrap.Modal.getInstance(
            document.getElementById("delete-user-modal")
        ).hide();

        showNotification("A felhasználó sikeresen törölve.", "success");
        loadUsers();
    } catch (error) {
        console.error(error);
        showNotification(error.message, "danger");
    } finally {
        pendingDeleteUserId = null;
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