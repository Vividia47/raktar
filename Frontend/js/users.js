async function loadUsers() {
    try {
        const user = getLoggedInUser();

        if (!user) {
            return;
        }

        const users = await getUsers(user.idU);

        const tableBody = document.getElementById("users-table-body");

        tableBody.innerHTML = "";

        users.forEach(function (user) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.idU}</td>
                <td>${user.userName}</td>
                <td>${user.fullName}</td>
                <td>${getRoleName(user.userRank)}</td>
                <td>
                    <button class="btn btn-sm btn-primary">
                        Szerkesztés
                    </button>

                    <button class="btn btn-sm btn-danger">
                        Törlés
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        alert("Nem sikerült betölteni a felhasználókat.");
    }
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


document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "index.html";
});


document.getElementById("add-user-button").addEventListener("click", function () {
    alert("Új felhasználó funkció később.");
});


loadUsers();