async function checkUsers() {
    try {
        const users = await getUsers();

        if (users.length === 0) {
            console.log("Nincs még felhasználó");
        } else {
            console.log("Vannak felhasználók");
        }

    } catch (error) {
        console.error(error);
    }
}

checkUsers();