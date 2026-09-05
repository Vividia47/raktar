async function loadMovementProducts() {
    try {
        const products = await getGoods();

        const select = document.getElementById("movement-product");

        products.forEach(product => {
            const option = document.createElement("option");

            option.value = product.idP;
            option.textContent = `${product.article ?? ""} - ${product.name}`;

            select.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        showNotification("Nem sikerült betölteni a termékeket.", "danger");
    }
}

loadMovementProducts();

document.getElementById("movement-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const productId = document.getElementById("movement-product").value;
    const movementCode = Number(document.getElementById("movement-type").value);

    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
        showNotification("Nincs bejelentkezett felhasználó.", "warning");
        return;
    }

    const user = JSON.parse(savedUser);

    const movement = {
        idU: user.idU,
        mcode: movementCode,
        stock: Number(document.getElementById("movement-quantity").value),
        lpprice: Number(document.getElementById("movement-price").value),
        invoiceNr: document.getElementById("movement-invoice").value,
        sprice: 0,
        serialNr: document.getElementById("movement-serial").value
    };

    try {
        await movementGoods(productId, movement);

        showNotification("Sikeres készletmozgás!", "success");

        document.getElementById("movement-form").reset();

    } catch (error) {
        console.error(error);
        showNotification(error.message, "danger");
    }
});

document.getElementById("back-button").addEventListener("click", function () {
    navigateBack();
});