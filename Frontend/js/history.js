async function loadHistory() {
    try {
        const history = await getHistory();
        const products = await getGoods();
        const user = getLoggedInUser();
const users = await getUsers(user.idU);

        const tableBody = document.getElementById("history-table-body");

        tableBody.innerHTML = "";

        history.forEach(record => {

            const product = products.find(p => p.idP == record.idP);
            const user = users.find(u => u.idU == record.idU);

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${record.idH}</td>
                <td>${product ? product.name : record.idP}</td>
                <td>${user ? user.fullName : record.idU}</td>
                <td>${record.date ? new Date(record.date).toLocaleString("hu-HU") : ""}</td>
                <td>${record.invoiceNr ?? ""}</td>
                <td>${record.quantity ?? ""}</td>
                <td>${getMovementName(record.direction)}</td>
                <td>${record.pprice ?? ""}</td>
                <td>${record.sprice ?? ""}</td>
                <td>${record.serialNr ?? ""}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
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

loadHistory();

document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "index.html";
});