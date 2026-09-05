async function loadProducts() {
    try {
        const products = await getGoods();

        const addProductButton = document.getElementById("add-product-button");

if (addProductButton) {
    addProductButton.style.display = hasRole(1, 2) ? "" : "none";
}

        const tableBody = document.getElementById("products-table-body");

        tableBody.innerHTML = "";

        products.forEach(product => {

            const row = document.createElement("tr");

const orderQuantity = Math.max(
    (product.minStock ?? 0) - (product.stock ?? 0),
    0
);

            row.innerHTML = `
                <td>${product.idP}</td>
                <td>${product.article ?? ""}</td>
                <td>${product.barcode ?? ""}</td>
                <td>${product.name ?? ""}</td>
                <td>${product.vat ?? ""}</td>
                <td>${product.lpprice ?? ""}</td>
                <td>${product.sprice ?? ""}</td>
                <td>${product.stock ?? ""}</td>
                <td>${product.minStock ?? ""}</td>
<td>${orderQuantity}</td>
<td>${product.unit ?? ""}</td>
                <td>${product.shelf ?? ""}</td>
                <td>${product.bundle ?? ""}</td>
                <td>${product.bunit ?? ""}</td>
                <td>
    ${hasRole(1, 2, 3) ? `
    <button
        class="btn btn-sm btn-outline-primary edit-product-button"
        data-id="${product.idP}">
        Szerkesztés
    </button>
` : ""}

${hasRole(1, 2) ? `
    <button
        class="btn btn-sm btn-outline-danger delete-product-button"
        data-id="${product.idP}">
        Törlés
    </button>
` : ""}
</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
    }
}

loadProducts();

document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "index.html";
});

document.getElementById("add-product-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const product = {
        article: document.getElementById("product-article").value,
        barcode: document.getElementById("product-barcode").value,
        name: document.getElementById("product-name").value,
        vat: Number(document.getElementById("product-vat").value),
        sprice: Number(document.getElementById("product-sprice").value),
        minStock: Number(document.getElementById("product-min-stock").value),
        unit: document.getElementById("product-unit").value,
        shelf: document.getElementById("product-shelf").value,
        bundle: Number(document.getElementById("product-bundle").value),
        bunit: document.getElementById("product-bunit").value
    };

    try {
        const newProduct = await addGoods(product);

        alert("Sikeres termékfelvétel!");

        document.getElementById("add-product-form").reset();

        const modalElement = document.getElementById("add-product-modal");
const modal = bootstrap.Modal.getInstance(modalElement);

document.activeElement.blur();

modal.hide();

await loadProducts();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

document.getElementById("products-table-body").addEventListener("click", async function (event) {

    if (event.target.classList.contains("edit-product-button")) {

    const productId = event.target.dataset.id;

    document.getElementById("edit-product-form").dataset.id = productId;

    const products = await getGoods();

    const product = products.find(p => p.idP == productId);

document.getElementById("edit-product-article").value = product.article ?? "";
document.getElementById("edit-product-barcode").value = product.barcode ?? "";
document.getElementById("edit-product-name").value = product.name ?? "";
document.getElementById("edit-product-vat").value = product.vat ?? "";
document.getElementById("edit-product-sprice").value = product.sprice ?? "";
document.getElementById("edit-product-min-stock").value = product.minStock ?? "";
document.getElementById("edit-product-unit").value = product.unit ?? "";
document.getElementById("edit-product-shelf").value = product.shelf ?? "";
document.getElementById("edit-product-bundle").value = product.bundle ?? "";
document.getElementById("edit-product-bunit").value = product.bunit ?? "";

const user = getLoggedInUser();

const editableFields = [
    "edit-product-article",
    "edit-product-barcode",
    "edit-product-name",
    "edit-product-vat",
    "edit-product-sprice",
    "edit-product-min-stock",
    "edit-product-unit",
    "edit-product-shelf",
    "edit-product-bundle",
    "edit-product-bunit"
];

editableFields.forEach(fieldId => {
    document.getElementById(fieldId).disabled = user.userRank === 3;
});

document.getElementById("edit-product-sprice").disabled = false;

    console.log("Szerkesztendő termék:", product);

    const modal = new bootstrap.Modal(
        document.getElementById("edit-product-modal")
    );

    modal.show();
}

});

document.getElementById("edit-product-modal").addEventListener("hide.bs.modal", function () {
    document.activeElement.blur();
});

document.getElementById("edit-product-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const productId = this.dataset.id;
    const user = getLoggedInUser();

    try {
        if (user.userRank === 3) {

            const sprice = Number(
                document.getElementById("edit-product-sprice").value
            );

            await updateSellingPrice(productId, sprice);

        } else {

            const product = {
                article: document.getElementById("edit-product-article").value,
                barcode: document.getElementById("edit-product-barcode").value,
                name: document.getElementById("edit-product-name").value,
                vat: Number(document.getElementById("edit-product-vat").value),
                minStock: Number(document.getElementById("edit-product-min-stock").value),
                unit: document.getElementById("edit-product-unit").value,
                shelf: document.getElementById("edit-product-shelf").value,
                bundle: Number(document.getElementById("edit-product-bundle").value),
                bunit: document.getElementById("edit-product-bunit").value
            };

            await updateGoods(productId, product);
        }

        alert("Sikeres módosítás!");

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("edit-product-modal")
        );

        document.activeElement.blur();

        modal.hide();

        await loadProducts();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

document.getElementById("products-table-body").addEventListener("click", async function (event) {

    if (event.target.classList.contains("delete-product-button")) {

        const productId = event.target.dataset.id;

        const confirmed = confirm("Biztosan törölni szeretné ezt a terméket?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteGoods(productId);

            alert("Sikeres törlés!");

            await loadProducts();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

});