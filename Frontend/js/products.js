async function loadProducts() {
    try {
        const products = await getGoods();

        const tableBody = document.getElementById("products-table-body");

        tableBody.innerHTML = "";

        products.forEach(product => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.idP}</td>
                <td>${product.article ?? ""}</td>
                <td>${product.barcode ?? ""}</td>
                <td>${product.name ?? ""}</td>
                <td>${product.vat ?? ""}</td>
                <td>${product.lpPrice ?? ""}</td>
                <td>${product.sPrice ?? ""}</td>
                <td>${product.stock ?? ""}</td>
                <td>${product.minStock ?? ""}</td>
                <td>${product.unit ?? ""}</td>
                <td>${product.shelf ?? ""}</td>
                <td>${product.bundle ?? ""}</td>
                <td>${product.bUnit ?? ""}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary">
                        Megtekintés
                    </button>
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