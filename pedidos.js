
"use strict";

// ==========================================
// MODULO DE GESTION DE PEDIDOS
// ==========================================

const pedidoForm = document.getElementById("pedidoForm");
const listaPedidos = document.getElementById("listaPedidos");
const mensajePedido = document.getElementById("mensajePedido");
const notificacionPedido = document.getElementById("notificacionPedido");

const preciosProductos = {
    "Capuchino": 55,
    "Americano": 40,
    "Pastel de chocolate": 60
};

let pedidos = cargarPedidos();
let siguientePedido = obtenerSiguientePedido();

// Cargar pedidos guardados
function cargarPedidos() {
    try {
        const datos = localStorage.getItem("cloudCoffeePedidos");
        const resultado = datos ? JSON.parse(datos) : [];

        return Array.isArray(resultado) ? resultado : [];
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        return [];
    }
}

// Obtener el siguiente identificador
function obtenerSiguientePedido() {
    const mayorId = pedidos.reduce(function (mayor, pedido) {
        return Math.max(mayor, Number(pedido.id) || 0);
    }, 0);

    return mayorId + 1;
}

// Guardar pedidos
function guardarPedidos() {
    try {
        localStorage.setItem(
            "cloudCoffeePedidos",
            JSON.stringify(pedidos)
        );

        return true;
    } catch (error) {
        console.error("Error al guardar pedidos:", error);
        mensajePedido.textContent =
            "No se pudieron guardar los pedidos.";

        return false;
    }
}

// Crear una celda de tabla segura
function crearCelda(valor) {
    const celda = document.createElement("td");
    celda.textContent = valor;
    return celda;
}

// Mostrar pedidos registrados
function mostrarPedidos() {
    listaPedidos.replaceChildren();

    pedidos.forEach(function (pedido) {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(`#${pedido.id}`));
        fila.appendChild(crearCelda(pedido.cliente));
        fila.appendChild(crearCelda(pedido.producto));
        fila.appendChild(crearCelda(pedido.cantidad));
        fila.appendChild(crearCelda(pedido.estado));

        const acciones = document.createElement("td");

        if (pedido.estado === "Pendiente") {
            acciones.appendChild(
                crearBoton("Preparar", function () {
                    cambiarEstado(pedido.id, "En preparación");
                })
            );
        } else if (pedido.estado === "En preparación") {
            acciones.appendChild(
                crearBoton("Marcar como listo", function () {
                    cambiarEstado(pedido.id, "Listo");
                })
            );
        } else if (pedido.estado === "Listo") {
            acciones.appendChild(
                crearBoton("Entregar", function () {
                    cambiarEstado(pedido.id, "Entregado");
                })
            );
        }

        fila.appendChild(acciones);
        listaPedidos.appendChild(fila);
    });
}

// Crear botones de acciones
function crearBoton(texto, accion) {
    const boton = document.createElement("button");

    boton.type = "button";
    boton.textContent = texto;
    boton.addEventListener("click", accion);

    return boton;
}

// Registrar un pedido
pedidoForm.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const cliente = document
        .getElementById("clientePedido")
        .value.trim();

    const producto = document.getElementById("productoPedido").value;
    const cantidad = Number(
        document.getElementById("cantidadPedido").value
    );

    if (
        !cliente ||
        !Object.hasOwn(preciosProductos, producto) ||
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        cantidad > 50
    ) {
        mensajePedido.textContent =
            "Verifica los datos del pedido.";

        return;
    }

    const pedido = {
        id: siguientePedido,
        cliente: cliente,
        producto: producto,
        cantidad: cantidad,
        total: preciosProductos[producto] * cantidad,
        estado: "Pendiente",
        fecha: new Date().toISOString()
    };

    pedidos.push(pedido);

    if (!guardarPedidos()) {
        pedidos.pop();
        return;
    }

    siguientePedido++;
    mostrarPedidos();
    pedidoForm.reset();

    mensajePedido.textContent =
        `Pedido #${pedido.id} registrado correctamente.`;
});

// Actualizar estado del pedido
function cambiarEstado(id, nuevoEstado) {
    const pedido = pedidos.find(function (item) {
        return item.id === id;
    });

    if (!pedido) return;

    pedido.estado = nuevoEstado;

    if (!guardarPedidos()) {
        pedido.estado = "Pendiente";
        return;
    }

    mostrarPedidos();

    if (nuevoEstado === "Listo") {
        notificacionPedido.textContent =
            `¡Pedido #${pedido.id} de ${pedido.cliente} está listo!`;
    }
}

// Mostrar pedidos al iniciar
mostrarPedidos();
