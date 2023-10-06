document.addEventListener("DOMContentLoaded", function () {
    const nombreInput = document.getElementById("nombreInput");
    const nombreBtn = document.getElementById("nombreBtn");
    const edadSection = document.getElementById("edadSection");
    const edadInput = document.getElementById("edadInput");
    const edadBtn = document.getElementById("edadBtn");
    const direccionSection = document.getElementById("direccionSection");
    const direccionInput = document.getElementById("direccionInput");
    const direccionBtn = document.getElementById("direccionBtn");
    const telefonoSection = document.getElementById("telefonoSection");
    const telefonoInput = document.getElementById("telefonoInput");
    const telefonoBtn = document.getElementById("telefonoBtn");
    const productosSection = document.getElementById("productosSection");
    const productoSelect = document.getElementById("productoSelect");
    const productoBtn = document.getElementById("productoBtn");
    const resultado = document.getElementById("resultado");
    const productoInfo = document.getElementById("productoInfo");
    const productoPrecio = document.getElementById("productoPrecio");
    const comprarBtn = document.getElementById("comprarBtn");
    const continuarComprandoBtn = document.getElementById("continuarComprandoBtn");
    const compraSection = document.getElementById("compraSection");
    const comprasInfo = document.getElementById("comprasInfo");
    const totalGasto = document.getElementById("totalGasto");
    const datosComprador = document.getElementById("datosComprador");
    const nombreError = document.getElementById("nombreError");
    const edadError = document.getElementById("edadError");
    const direccionError = document.getElementById("direccionError");
    const telefonoError = document.getElementById("telefonoError");
    const productoError = document.getElementById("productoError");
    const comprasHistorial = document.getElementById("comprasHistorial");
    const historialCompras = document.getElementById("historialCompras"); // Elemento del historial de compras

    const APP_PREFIX = "juguetes_";

    let nombre = "";
    let edad = 0;
    let direccion = "";
    let telefono = "";
    let selectedProduct = null;
    let totalCost = 0;
    let compras = [];
    let compradorData = {};

    const storedNombre = localStorage.getItem(APP_PREFIX + "nombre");
    const storedDireccion = localStorage.getItem(APP_PREFIX + "direccion");
    const storedTelefono = localStorage.getItem(APP_PREFIX + "telefono");

    if (storedNombre) {
        nombreInput.value = storedNombre;
        direccionInput.value = storedDireccion;
        telefonoInput.value = storedTelefono;
    }

    nombreBtn.addEventListener("click", function () {
        nombre = nombreInput.value;
        if (nombre.trim() === "") {
            nombreError.textContent = "Por favor, ingresa tu nombre.";
            return;
        }
        nombreError.textContent = "";
        edadSection.style.display = "block";
        nombreInput.disabled = true;
    });

    edadBtn.addEventListener("click", function () {
        edad = parseInt(edadInput.value);
        if (isNaN(edad) || edad <= 0) {
            edadError.textContent = "Por favor, ingresa una edad válida.";
            return;
        }
        if (edad > 12) {
            edadError.textContent = "Lo siento, esta tienda está disponible solo para niños menores de 12 años.";
            return;
        }
        edadError.textContent = "";
        direccionSection.style.display = "block";
        edadInput.disabled = true;
    });

    direccionBtn.addEventListener("click", function () {
        direccion = direccionInput.value;
        if (direccion.trim() === "") {
            direccionError.textContent = "Por favor, ingresa tu dirección.";
            return;
        }
        direccionError.textContent = "";
        telefonoSection.style.display = "block";
        direccionInput.disabled = true;
    });

    telefonoBtn.addEventListener("click", function () {
        telefono = telefonoInput.value;
        if (telefono.trim() === "") {
            telefonoError.textContent = "Por favor, ingresa tu número de teléfono.";
            return;
        }
        telefonoError.textContent = "";
        productosSection.style.display = "block";
        telefonoInput.disabled = true;
    });

    function fetchProducts() {
        return new Promise((resolve, reject) => {
            const products = [
                { nombrejuguete: "Casa grande", precio: 5000 },
                { nombrejuguete: "Casa mediana", precio: 3500 },
                { nombrejuguete: "Casa pequeña", precio: 2500 },
                { nombrejuguete: "Pack juguetes", precio: 500 },
            ];
            resolve(products);
        });
    }

    function fetchProductosFrecuentes() {
        return fetch('productosFrecuentes.json')
            .then(response => response.json())
            .then(data => {
                return data.productosFrecuentes;
            })
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    function guardarComprasEnLocalStorage() {
        localStorage.setItem(APP_PREFIX + "compras", JSON.stringify(compras));
        localStorage.setItem(APP_PREFIX + "totalCost", totalCost);
        localStorage.setItem(APP_PREFIX + "historialCompras", JSON.stringify(comprasHistorial.innerHTML));
    }

    function cargarComprasDesdeLocalStorage() {
        const storedCompras = JSON.parse(localStorage.getItem(APP_PREFIX + "compras")) || [];
        const storedTotalCost = parseFloat(localStorage.getItem(APP_PREFIX + "totalCost")) || 0;
        const storedHistorialCompras = localStorage.getItem(APP_PREFIX + "historialCompras") || '';

        compras = storedCompras;
        totalCost = storedTotalCost;
        comprasHistorial.innerHTML = storedHistorialCompras;
    }

    productoBtn.addEventListener("click", function () {
        fetchProducts()
            .then((products) => {
                const selectedProductName = productoSelect.value;
                selectedProduct = products.find(
                    (product) => product.nombrejuguete === selectedProductName
                );

                if (!selectedProduct) {
                    productoError.textContent =
                        "El producto seleccionado no se encuentra en la lista.";
                    return;
                }
                productoError.textContent = "";
                resultado.style.display = "block";
                productoInfo.innerHTML = `
                <h3>ID: ${selectedProduct.id}</h3>
                <h3>Nombre: ${selectedProduct.nombrejuguete}</h3>
                <h3>Precio: $${selectedProduct.precio}</h3>
                `;
                productoPrecio.style.display = "block";
                productoPrecio.textContent = `Precio: $${selectedProduct.precio}`;

                Swal.fire({
                    icon: "success",
                    title: "Consulta exitosa",
                    text: `El precio de "${selectedProductName}" es $${selectedProduct.precio}`,
                });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar la lista de productos.",
                });
            });
    });

    comprarBtn.addEventListener("click", function () {
        compras.push(selectedProduct);
        totalCost += selectedProduct.precio;
        productoInfo.innerHTML = "";
        productoPrecio.style.display = "none";

        let compraDetails = `<p>Producto: ${selectedProduct.nombrejuguete} - Precio: $${selectedProduct.precio}</p>`;
        comprasInfo.innerHTML += compraDetails;

        const historialDetails = `<p>Producto: ${selectedProduct.nombrejuguete} - Precio: $${selectedProduct.precio}</p>`;
        comprasHistorial.innerHTML += historialDetails;

        guardarComprasEnLocalStorage();

        Swal.fire({
            icon: "question",
            title: "¿Deseas agregar más productos al carrito?",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                productoSelect.value = "Casa grande";
                resultado.style.display = "none";
            } else {
                mostrarResumenCompra();

                compraSection.style.display = "block";
                historialCompras.style.display = "block";
                resultado.style.display = "none";
            }
        });
    });

    continuarComprandoBtn.addEventListener("click", function () {
        productoSelect.value = "Casa grande";
        resultado.style.display = "none";
    });

    function mostrarResumenCompra() {
        compraSection.style.display = "block";
        totalGasto.textContent = "$" + totalCost.toFixed(2);

        compradorData.nombre = nombre;
        compradorData.direccion = direccion;
        compradorData.telefono = telefono;

        localStorage.setItem(APP_PREFIX + "nombre", compradorData.nombre);
        localStorage.setItem(APP_PREFIX + "direccion", compradorData.direccion);
        localStorage.setItem(APP_PREFIX + "telefono", compradorData.telefono);

        document.getElementById("nombreComprador").textContent = compradorData.nombre;
        document.getElementById("direccionComprador").textContent = compradorData.direccion;
        document.getElementById("telefonoComprador").textContent = compradorData.telefono;

        const mensajeDespedida = `¡Gracias por su compra, ${compradorData.nombre}! Esperamos que disfrute de su juguete.`;
        const mensajeDespedidaElement = document.createElement("p");
        mensajeDespedidaElement.textContent = mensajeDespedida;
        datosComprador.appendChild(mensajeDespedidaElement);
    }

    cargarComprasDesdeLocalStorage();

    fetchProductosFrecuentes()

        .then((productosFrecuentes) => {
            comprasProductosFrecuentes.innerHTML = "<h2>Compras de Productos Frecuentes</h2>";
            if (productosFrecuentes.length === 0) {
                comprasProductosFrecuentes.innerHTML += "<p>No hay productos frecuentes disponibles.</p>";
            } else {
                productosFrecuentes.forEach((producto) => {
                    comprasProductosFrecuentes.innerHTML += `
                        <div>
                            <h3>${producto.nombrejuguete}</h3>
                            <p>Precio: $${producto.precio}</p>
                        </div>
                    `;
                });
            }
        })
        .catch((error) => {
            console.error(error);
            comprasProductosFrecuentes.innerHTML = "<h2>Error al cargar productos frecuentes.</h2>";
        });

    historialCompras.style.display = "block";
});
