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

        alert("Nem sikerült betölteni a felhasználókat.");

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

        alert("A felhasználó sikeresen frissítve.");

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("edit-user-modal")
        );

        modal.hide();

        loadUsers();

    } catch (error) {

        console.error(error);
        alert(error.message);
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
        alert("Kérjük, adjon meg egy új jelszót.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("A két jelszó nem egyezik.");
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

        alert("A jelszó sikeresen módosítva.");

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("change-user-password-modal")
        );

        modal.hide();

    } catch (error) {

        console.error(error);
        alert(error.message);
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
            user.idU,
            user.userName,
            user.fullName,
            getRoleName(user.userRank)
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        const actionsCell = document.createElement("td");

        [
            ["btn btn-sm btn-primary edit-user-button", "Szerkesztés"],
            ["btn btn-sm btn-secondary change-password-button", "Jelszó"],
            ["btn btn-sm btn-danger delete-user-button", "Törlés"]
        ].forEach(([className, label]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = className;
            button.dataset.id = user.idU;
            button.textContent = label;
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

        alert("A felhasználó sikeresen létrejött.");

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("add-user-modal")
        );

        modal.hide();

        loadUsers();

    } catch (error) {

        console.error(error);
        alert("Nem sikerült létrehozni a felhasználót.");
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

        alert("A felhasználó sikeresen törölve.");

        loadUsers();

    } catch (error) {

        console.error(error);
        alert(error.message);
    }
});

document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "index.html";
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