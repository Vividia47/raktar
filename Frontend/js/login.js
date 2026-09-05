async function checkUsers() {
    try {
        const users = await getUsers();

        const registerSection = document.getElementById("register-section");
        const loginSection = document.getElementById("login-section");

        if (users.length === 0) {
            registerSection.classList.remove("d-none");
            loginSection.classList.add("d-none");

            console.log("No users - showing registration");
        } else {
            registerSection.classList.add("d-none");
            loginSection.classList.remove("d-none");

            console.log("Users exist - showing login");
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