// ==========================================
// 1. DATOS DE REGIONES Y COMUNAS
// ==========================================
const datosRegiones = {
    "Metropolitana": ["Santiago", "Huechuraba", "Maipú", "Providencia"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"]
};

// Cargar regiones al iniciar la página
document.addEventListener("DOMContentLoaded", function() {
    let selectRegion = document.getElementById("region");
    if (selectRegion) {
        for (let region in datosRegiones) {
            let option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            selectRegion.appendChild(option);
        }
    }

    // Cargar productos en el catálogo o mantenedor si existen los contenedores
    renderizarCatalogo();
    renderizarTablaAdmin();
});

// Función para actualizar el combo de comunas según la región seleccionada
function cargarComunas() {
    let regionSel = document.getElementById("region").value;
    let selectComuna = document.getElementById("comuna");
    
    if (!selectComuna) return;

    selectComuna.innerHTML = '<option value="">Seleccione Comuna...</option>';

    if (regionSel && datosRegiones[regionSel]) {
        datosRegiones[regionSel].forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            selectComuna.appendChild(option);
        });
    }
}


// ==========================================
// 2. INICIO DE SESIÓN
// ==========================================
function ingresar() {
    let correo = document.getElementById("correo").value;
    let clave = document.getElementById("clave").value;

    if (correo === "" || clave === "") {
        alert("Debe completar todos los campos");
        return;
    }

    let formatoCorreo = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formatoCorreo.test(correo)) {
        alert("Ingrese un correo válido");
        return;
    }

    if (clave.length < 4 || clave.length > 10) {
        alert("La clave debe tener entre 4 y 10 caracteres");
        return;
    }

    // Redirección por roles
    if (correo === "admin@demo.cl" && clave === "1234") {
        window.location.href = "admin.html"; 
    } else if (correo === "usuario@demo.cl" && clave === "5678") {
        window.location.href = "usuario.html"; 
    } else {
        alert("Correo o clave incorrectos");
    }
}


// ==========================================
// 3. REGISTRO DE USUARIO Y VALIDACIONES
// ==========================================
function registrarUsuario() {
    let run = document.getElementById("run").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let apellidos = document.getElementById("apellidos").value.trim();
    let correo = document.getElementById("reg_correo").value.trim();
    let tipoUsuario = document.getElementById("tipo_usuario").value;
    let region = document.getElementById("region").value;
    let comuna = document.getElementById("comuna").value;
    let direccion = document.getElementById("direccion").value.trim();

    // Validar campos obligatorios
    if (!run || !nombre || !apellidos || !correo || !tipoUsuario || !region || !comuna || !direccion) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

    // Validar RUN chileno sin puntos ni guion
    if (!validarRut(run)) {
        alert("El RUN ingresado no es válido (ingrese sin puntos ni guion).");
        return;
    }

    // Validar formato de correo
    let formatoCorreo = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formatoCorreo.test(correo)) {
        alert("Ingrese un correo electrónico válido.");
        return;
    }

    alert("Usuario registrado con éxito.");
    window.location.href = "login.html";
}

// Algoritmo de validación de Dígito Verificador (RUT)
function validarRut(rut) {
    if (!/^[0-9]+[0-kK]$/.test(rut)) return false;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * parseInt(cuerpo.charAt(i));
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvEsperado;
}


// ==========================================
// 4. MANTENEDOR DE PRODUCTOS Y CARRITO
// ==========================================

// Carga productos guardados o crea la lista por defecto
let productos = JSON.parse(localStorage.getItem("productos")) || [
    { id: 1, nombre: "Guitarra Eléctrica Fender", categoria: "Guitarras", precio: 450000, imagen: "https://via.placeholder.com/200" },
    { id: 2, nombre: "Teclado Yamaha 61 Teclas", categoria: "Teclados", precio: 280000, imagen: "https://via.placeholder.com/200" },
    { id: 3, nombre: "Micrófono Shure SM58", categoria: "Audio", precio: 110000, imagen: "https://via.placeholder.com/200" }
];

if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Muestra las tarjetas de productos en usuario.html
function renderizarCatalogo() {
    let contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return; 

    contenedor.innerHTML = "";
    productos.forEach(prod => {
        contenedor.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${prod.imagen}" class="card-img-top p-3" alt="${prod.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${prod.nombre}</h5>
                        <p class="text-muted small">${prod.categoria}</p>
                        <p class="fs-5 fw-bold text-success">$${prod.precio.toLocaleString("es-CL")}</p>
                        <button onclick="agregarAlCarrito(${prod.id})" class="btn btn-primary mt-auto">Añadir al Carrito</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Muestra la tabla de gestión en admin.html
function renderizarTablaAdmin() {
    let tabla = document.getElementById("tabla-admin-productos");
    if (!tabla) return; 

    tabla.innerHTML = "";
    productos.forEach((prod, index) => {
        tabla.innerHTML += `
            <tr>
                <td><img src="${prod.imagen}" width="50" height="50" class="rounded"></td>
                <td class="fw-bold">${prod.nombre}</td>
                <td><span class="badge bg-secondary">${prod.categoria}</span></td>
                <td>$${prod.precio.toLocaleString("es-CL")}</td>
                <td>
                    <button onclick="eliminarProducto(${index})" class="btn btn-sm btn-danger">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Permite al Administrador agregar productos
function agregarProducto() {
    let nombre = document.getElementById("prod-nombre").value.trim();
    let precio = parseInt(document.getElementById("prod-precio").value);
    let categoria = document.getElementById("prod-categoria").value;
    let imagen = document.getElementById("prod-imagen").value.trim();

    if (!nombre || isNaN(precio) || !categoria || !imagen) {
        alert("Complete todos los datos del producto.");
        return;
    }

    let nuevoProducto = { id: Date.now(), nombre, categoria, precio, imagen };
    productos.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productos));

    document.getElementById("form-producto").reset();
    renderizarTablaAdmin();
    alert("Producto agregado exitosamente.");
}

// Permite al Administrador eliminar productos
function eliminarProducto(index) {
    if (confirm("¿Desea eliminar este producto?")) {
        productos.splice(index, 1);
        localStorage.setItem("productos", JSON.stringify(productos));
        renderizarTablaAdmin();
    }
}

// Agrega items al carrito mediante LocalStorage
function agregarAlCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let prod = productos.find(p => p.id === id);

    if (prod) {
        carrito.push(prod);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`${prod.nombre} fue añadido al carrito.`);
    }
}