let allHistory = [];
let allProducts = [];
let allUsers = [];

async function loadHistory() {

const tableBody = document.getElementById("history-table-body");
showTableLoading(tableBody, 10);

try {

    allHistory = await getHistory();
    allProducts = await getGoods();
    allUsers = await getUserNames();

    populateFilters();
    displayHistory();

} catch (error) {

    console.error(error);
    showTableError(
        tableBody,
        10,
        error.message || "Nem sikerült betölteni az előzményeket.",
        loadHistory
    );
    showNotification(error.message, "danger");

}

}

function populateFilters() {

const movementFilter = document.getElementById("history-movement-filter");

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

movementFilter.innerHTML = `<option value="">Mind</option>`;

Object.entries(movementTypes).forEach(([code, name]) => {

    const option = document.createElement("option");

    option.value = code;
    option.textContent = name;

    movementFilter.appendChild(option);

});

}

function displayHistory() {

const tableBody = document.getElementById("history-table-body");
const resultCount = document.getElementById("history-result-count");

const search = document
    .getElementById("history-search")
    .value
    .toLowerCase()
    .trim();

const movementFilter =
    document.getElementById("history-movement-filter").value;

const sort =
    document.getElementById("history-sort").value;

let filteredHistory = allHistory.filter(record => {

    const product = allProducts.find(
        p => p.idP == record.idP
    );

    const user = allUsers.find(
        u => u.idU == record.idU
    );

    const productName = product?.name ?? "";
    const userName = user?.fullName ?? "";

    const searchText = [

        productName,
        userName,
        record.invoiceNr ?? "",
        record.serialNr ?? ""

    ].join(" ").toLowerCase();


    const matchesSearch =
        search === "" ||
        searchText.includes(search);


    const matchesMovement =
        movementFilter === "" ||
        record.direction == movementFilter;


    return (
        matchesSearch &&
        matchesMovement
    );

});


filteredHistory.sort((a, b) => {

    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (sort === "oldest") {
        return dateA - dateB;
    }

    return dateB - dateA;

});

resultCount.textContent = `${filteredHistory.length} találat`;

tableBody.innerHTML = "";

if (filteredHistory.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="10" class="text-center text-muted py-4">
                Nincs találat
            </td>
        </tr>
    `;

    return;

}

filteredHistory.forEach(record => {

    const product = allProducts.find(
        p => p.idP == record.idP
    );

    const user = allUsers.find(
        u => u.idU == record.idU
    );

    const row = document.createElement("tr");

    [
        ["ID", record.idH],
        ["Termék", product ? product.name : record.idP],
        ["Felhasználó", user ? user.fullName : record.idU],
        [
            "Dátum",
            record.date
                ? new Date(record.date).toLocaleString("hu-HU")
                : ""
        ],
        ["Bizonylatszám", record.invoiceNr ?? ""],
        ["Mennyiség", record.quantity ?? ""],
        ["Mozgás típusa", getMovementName(record.direction)],
        ["Beszerzési ár", record.pprice ?? ""],
        ["Eladási ár", record.sprice ?? ""],
        ["Sorozatszám", record.serialNr ?? ""]
    ].forEach(([label, value]) => {
        const cell = document.createElement("td");
        cell.dataset.label = label;

        let displayValue = value;

        if (
            value !== "" &&
            value !== null &&
            value !== undefined &&
            (label === "Beszerzési ár" || label === "Eladási ár")
        ) {
            displayValue = `${value} Ft`;
            cell.classList.add("numeric-with-unit");
        }

        cell.textContent = displayValue;
        row.appendChild(cell);
    });

    tableBody.appendChild(row);

});

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

document.getElementById("history-search").addEventListener(
"input",
displayHistory
);

document.getElementById("history-movement-filter").addEventListener(
"change",
displayHistory
);

document.getElementById("history-sort").addEventListener(
"change",
displayHistory
);

document.getElementById("history-clear-filters").addEventListener(
"click",
function () {

    document.getElementById("history-search").value = "";

    document.getElementById("history-movement-filter").value = "";

    document.getElementById("history-sort").value = "newest";

    displayHistory();

}

);

loadHistory();

document.getElementById("back-button").addEventListener(
"click",
function () {

    navigateBack();

}

);
