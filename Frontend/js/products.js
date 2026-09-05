let allProducts = [];

async function loadProducts() {
    try {
        allProducts = await getGoods();

        const addProductButton = document.getElementById("add-product-button");

        if (addProductButton) {
            addProductButton.style.display = hasRole(1, 2) ? "" : "none";
        }

        displayProducts();

    } catch (error) {
        console.error(error);
        showNotification("Nem sikerült betölteni a termékeket.", "danger");
    }
}


function displayProducts() {

    const tableBody = document.getElementById("products-table-body");
    const resultCount = document.getElementById("product-result-count");

    const search = document
        .getElementById("product-search")
        .value
        .toLowerCase()
        .trim();

    const stockFilter = document
        .getElementById("product-stock-filter")
        .value;

    const sort = document
        .getElementById("product-sort")
        .value;


    let filteredProducts = allProducts.filter(product => {

        const searchText = [
            product.name ?? "",
            product.article ?? "",
            product.barcode ?? ""
        ]
        .join(" ")
        .toLowerCase();


        const matchesSearch =
            search === "" ||
            searchText.includes(search);


        const orderQuantity = Math.max(
            (product.minStock ?? 0) - (product.stock ?? 0),
            0
        );


        const matchesStock =
            stockFilter === "" ||
            (stockFilter === "low" && orderQuantity > 0) ||
            (stockFilter === "ok" && orderQuantity === 0);


        return matchesSearch && matchesStock;

    });



    filteredProducts.sort((a, b) => {

        switch (sort) {

            case "name-asc":
                return (a.name ?? "")
                    .localeCompare(b.name ?? "");


            case "name-desc":
                return (b.name ?? "")
                    .localeCompare(a.name ?? "");


            case "price-asc":
                return (a.sprice ?? 0) - (b.sprice ?? 0);


            case "price-desc":
                return (b.sprice ?? 0) - (a.sprice ?? 0);


            default:
                return a.idP - b.idP;
        }

    });



    if (resultCount) {
        resultCount.textContent =
            `${filteredProducts.length} találat`;
    }



    tableBody.innerHTML = "";


    if (filteredProducts.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="15" class="text-center text-muted py-4">
                    Nincs találat
                </td>
            </tr>
        `;

        return;
    }



    filteredProducts.forEach(product => {

        const row = document.createElement("tr");


        const orderQuantity = Math.max(
            (product.minStock ?? 0) - (product.stock ?? 0),
            0
        );


        if (orderQuantity > 0) {
            row.classList.add("low-stock");
        }



        [
            ["ID", product.idP],
            ["Cikkszám", product.article ?? ""],
            ["Vonalkód", product.barcode ?? ""],
            ["Megnevezés", product.name ?? ""],
            ["ÁFA", product.vat ?? ""],
            ["Beszerzési ár", product.lpprice ?? ""],
            ["Eladási ár", product.sprice ?? ""],
            ["Készlet", product.stock ?? ""],
            ["Min. készlet", product.minStock ?? ""],
            ["Rendelendő mennyiség", orderQuantity],
            ["Egység", product.unit ?? ""],
            ["Polc", product.shelf ?? ""],
            ["Gyűjtő", product.bundle ?? ""],
            ["Gyűjtő egység", product.bunit ?? ""]
        ].forEach(([label, value]) => {
            const cell = document.createElement("td");
            cell.dataset.label = label;
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionsCell = document.createElement("td");
        actionsCell.dataset.label = "Műveletek";
        actionsCell.classList.add("text-end");

        if (hasRole(1, 2, 3)) {
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "btn btn-sm btn-primary edit-product-button";
            editButton.dataset.id = product.idP;
            editButton.textContent = "Szerkesztés";
            actionsCell.appendChild(editButton);
        }

        if (hasRole(1, 2)) {
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn btn-sm btn-danger delete-product-button";
            deleteButton.dataset.id = product.idP;
            deleteButton.textContent = "Törlés";
            actionsCell.appendChild(deleteButton);
        }

        row.appendChild(actionsCell);


        tableBody.appendChild(row);

    });

}

document
    .getElementById("product-search")
    .addEventListener("input", displayProducts);


document
    .getElementById("product-stock-filter")
    .addEventListener("change", displayProducts);


document
    .getElementById("product-sort")
    .addEventListener("change", displayProducts);



document
    .getElementById("product-clear-filters")
    .addEventListener("click", function () {

        document.getElementById("product-search").value = "";

        document.getElementById("product-stock-filter").value = "";

        document.getElementById("product-sort").value = "default";

        displayProducts();

    });



document
    .getElementById("back-button")
    .addEventListener("click", function () {

        navigateBack();

    });




document
    .getElementById("add-product-form")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const product = {

            article: document.getElementById("product-article").value,

            barcode: document.getElementById("product-barcode").value,

            name: document.getElementById("product-name").value,

            vat: Number(
                document.getElementById("product-vat").value
            ),

            sprice: Number(
                document.getElementById("product-sprice").value
            ),

            minStock: Number(
                document.getElementById("product-min-stock").value
            ),

            unit: document.getElementById("product-unit").value,

            shelf: document.getElementById("product-shelf").value,

            bundle: Number(
                document.getElementById("product-bundle").value
            ),

            bunit: document.getElementById("product-bunit").value

        };


        try {

            const user = getLoggedInUser();

            await addGoods(product, user.idU);


            showNotification("Sikeres termékfelvétel!", "success");


            document
                .getElementById("add-product-form")
                .reset();



            const modalElement =
                document.getElementById("add-product-modal");


            const modal =
                bootstrap.Modal.getInstance(modalElement);


            document.activeElement.blur();

            modal.hide();


            await loadProducts();


        } catch (error) {

            console.error(error);

            showNotification(error.message, "danger");

        }

    });

    document
    .getElementById("products-table-body")
    .addEventListener("click", async function (event) {


        if (event.target.classList.contains("edit-product-button")) {


            const productId = event.target.dataset.id;


            document
                .getElementById("edit-product-form")
                .dataset.id = productId;



            const products = await getGoods();


            const product = products.find(
                p => p.idP == productId
            );


            if (!product) {
                return;
            }



            document.getElementById("edit-product-article").value =
                product.article ?? "";


            document.getElementById("edit-product-barcode").value =
                product.barcode ?? "";


            document.getElementById("edit-product-name").value =
                product.name ?? "";


            document.getElementById("edit-product-vat").value =
                product.vat ?? "";


            document.getElementById("edit-product-sprice").value =
                product.sprice ?? "";


            document.getElementById("edit-product-min-stock").value =
                product.minStock ?? "";


            document.getElementById("edit-product-unit").value =
                product.unit ?? "";


            document.getElementById("edit-product-shelf").value =
                product.shelf ?? "";


            document.getElementById("edit-product-bundle").value =
                product.bundle ?? "";


            document.getElementById("edit-product-bunit").value =
                product.bunit ?? "";



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

                document.getElementById(fieldId).disabled =
                    user.userRank === 3;

            });



            // Salespeople can still change selling price
            document
                .getElementById("edit-product-sprice")
                .disabled = false;



            const modal = new bootstrap.Modal(
                document.getElementById("edit-product-modal")
            );


            modal.show();

        }



        if (event.target.classList.contains("delete-product-button")) {


            const productId = event.target.dataset.id;



            const confirmed = confirm(

                "Biztosan törölni szeretné ezt a terméket?\n\n" +

                "A termékhez tartozó mozgástörténet is törlődni fog.\n" +

                "Ez a művelet nem vonható vissza."

            );



            if (!confirmed) {

                return;

            }



            try {


                const user = getLoggedInUser();


                await deleteGoods(
                    productId,
                    user.idU
                );


                showNotification("Sikeres törlés!", "success");


                await loadProducts();



            } catch (error) {

                console.error(error);

                showNotification(error.message, "danger");

            }

        }


    });





document
    .getElementById("edit-product-modal")
    .addEventListener("hide.bs.modal", function () {

        document.activeElement.blur();

    });





document
    .getElementById("edit-product-form")
    .addEventListener("submit", async function (event) {


        event.preventDefault();



        const productId = this.dataset.id;


        const user = getLoggedInUser();



        try {



            if (user.userRank === 3) {



                const sprice = Number(

                    document
                        .getElementById("edit-product-sprice")
                        .value

                );



                await updateSellingPrice(

                    productId,

                    sprice,

                    user.idU

                );



            } else {



                const product = {


                    article:
                        document
                            .getElementById("edit-product-article")
                            .value,


                    barcode:
                        document
                            .getElementById("edit-product-barcode")
                            .value,


                    name:
                        document
                            .getElementById("edit-product-name")
                            .value,


                    vat: Number(

                        document
                            .getElementById("edit-product-vat")
                            .value

                    ),


                    minStock: Number(

                        document
                            .getElementById("edit-product-min-stock")
                            .value

                    ),


                    unit:
                        document
                            .getElementById("edit-product-unit")
                            .value,


                    shelf:
                        document
                            .getElementById("edit-product-shelf")
                            .value,


                    bundle: Number(

                        document
                            .getElementById("edit-product-bundle")
                            .value

                    ),


                    bunit:
                        document
                            .getElementById("edit-product-bunit")
                            .value

                };



                await updateGoods(

                    productId,

                    product,

                    user.idU

                );


            }



            showNotification("Sikeres módosítás!", "success");



            const modal = bootstrap.Modal.getInstance(

                document.getElementById("edit-product-modal")

            );



            document.activeElement.blur();


            modal.hide();



            await loadProducts();



        } catch (error) {


            console.error(error);


            showNotification(error.message, "danger");


        }


    });


loadProducts();