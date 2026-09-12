let movementProducts = [];
let movementHistory = [];

async function loadMovementProducts() {
    try {
        movementProducts = await getGoods();

        const select = document.getElementById("movement-product");

        movementProducts.forEach(product => {
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

async function loadMovementHistory() {
    try {
        movementHistory = await getHistory();
        renderInvoiceHistory();
    } catch (error) {
        console.error(error);
        showNotification("Nem sikerült betölteni a bizonylat előzményeit.", "danger");
    }
}

function getMovementName(code) {
    const movementTypes = {
        101: "101 - Beszerzés",
        102: "102 - Bizományos bevételezés",
        103: "103 - Téves selejtezés visszavétele",
        104: "104 - Saját rezsi anyag visszavétele",
        201: "201 - Értékesítés",
        202: "202 - Bizományos kiadás",
        203: "203 - Selejtezés",
        204: "204 - Saját rezsi felhasználás"
    };

    return movementTypes[code] ?? `Ismeretlen (${code})`;
}

function renderInvoiceHistory() {
    const invoice = document
        .getElementById("movement-invoice")
        .value
        .trim()
        .toLowerCase();
    const section = document.getElementById("invoice-history-section");
    const list = document.getElementById("invoice-history-list");
    const count = document.getElementById("invoice-history-count");

    if (!invoice) {
        section.classList.add("d-none");
        list.replaceChildren();
        count.textContent = "";
        return;
    }

    const matchingMovements = movementHistory.filter(record =>
        (record.invoiceNr ?? "").trim().toLowerCase() === invoice
    );

    section.classList.remove("d-none");
    list.replaceChildren();
    count.textContent = `${matchingMovements.length} találat`;

    if (matchingMovements.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "text-muted mb-0";
        emptyMessage.textContent = "Ehhez a bizonylatszámhoz még nincs rögzített mozgás.";
        list.appendChild(emptyMessage);
        return;
    }

    matchingMovements.forEach(record => {
        const product = movementProducts.find(item => item.idP == record.idP);
        const item = document.createElement("div");
        item.className = "movement-history-item";

        const productCell = document.createElement("div");
        const productName = document.createElement("strong");
        productName.textContent = product?.name ?? `Termék ID: ${record.idP}`;
        const date = document.createElement("span");
        date.className = "movement-history-meta";
        date.textContent = record.date
            ? new Date(record.date).toLocaleString("hu-HU")
            : "Dátum nélkül";
        productCell.append(productName, date);

        const typeCell = document.createElement("div");
        typeCell.textContent = getMovementName(record.direction);

        const quantityCell = document.createElement("div");
        quantityCell.textContent = `Mennyiség: ${record.quantity ?? ""}`;

        const priceCell = document.createElement("div");
        priceCell.textContent = `Beszerzési ár: ${record.pprice ?? ""} Ft`;

        item.append(productCell, typeCell, quantityCell, priceCell);
        list.appendChild(item);
    });
}

loadMovementProducts();
loadMovementHistory();

document.getElementById("movement-invoice").addEventListener(
    "input",
    renderInvoiceHistory
);

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
        mcode: movementCode,
        stock: Number(document.getElementById("movement-quantity").value),
        lpprice: Number(document.getElementById("movement-price").value),
        invoiceNr: document.getElementById("movement-invoice").value,
        sprice: 0,
        serialNr: document.getElementById("movement-serial").value
    };

    const submitButton = event.submitter;
    const invoiceNumber = movement.invoiceNr;
    setButtonLoading(submitButton, true);

    try {
        await movementGoods(productId, movement);

        showNotification("Sikeres készletmozgás!", "success");

        document.getElementById("movement-form").reset();
        await loadMovementHistory();
        document.getElementById("movement-invoice").value = invoiceNumber;
        renderInvoiceHistory();

    } catch (error) {
        console.error(error);
        showNotification(error.message, "danger");
    } finally {
        setButtonLoading(submitButton, false);
    }
});

document.getElementById("back-button").addEventListener("click", function () {
    navigateBack();
});