
"use strict";

// ==========================================
// CALCULADORA DE PROMOCIONES
// ==========================================

const promoForm = document.getElementById("promoForm");

promoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const precio = Number(document.getElementById("precio").value);
  const tipoPromo = document.getElementById("tipoPromo").value;
  let descuento = 0;

  if (!Number.isFinite(precio) || precio <= 0) {
    document.getElementById("resultado").textContent =
      "Ingresa un precio válido mayor que cero.";
    return;
  }

  if (tipoPromo === "estudiante") descuento = 0.10;
  if (tipoPromo === "cumple") descuento = 0.15;

  const precioFinal = precio * (1 - descuento);

  document.getElementById("resultado").textContent =
    `Precio final: $${precioFinal.toFixed(2)}`;
});


// ==========================================
// GESTIÓN DE INVENTARIO
// ==========================================

const inventarioForm = document.getElementById("inventarioForm");
const listaInventario = document.getElementById("listaInventario");
const mensajeInventario = document.getElementById("mensajeInventario");

let inventario = cargarInventario();


// Cargar inventario desde el almacenamiento local
function cargarInventario() {
  try {
    const datos = localStorage.getItem("cloudCoffeeInventario");
    const resultado = datos ? JSON.parse(datos) : [];

    return Array.isArray(resultado) ? resultado : [];
  } catch (error) {
    return [];
  }
}


// Guardar inventario en el almacenamiento local
function guardarInventario() {
  try {
    localStorage.setItem(
      "cloudCoffeeInventario",
      JSON.stringify(inventario)
    );

    return true;

  } catch (error) {
    mensajeInventario.textContent =
      "No se pudo guardar el inventario en este navegador.";

    return false;
  }
}


// Mostrar los ingredientes registrados
function mostrarInventario() {
  listaInventario.replaceChildren();

  inventario.forEach(function (item, indice) {
    const fila = document.createElement("tr");

    const estado =
      item.cantidad <= item.minimo
        ? "Existencias bajas"
        : "Disponible";

    const valores = [
      item.nombre,
      `${item.cantidad} ${item.unidad}`,
      `${item.minimo} ${item.unidad}`,
      estado
    ];

    valores.forEach(function (valor) {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    // Botón para eliminar ingredientes
    const celdaAcciones = document.createElement("td");
    const botonEliminar = document.createElement("button");

    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";

    botonEliminar.setAttribute(
      "aria-label",
      `Eliminar ${item.nombre}`
    );

    botonEliminar.addEventListener("click", function () {
      const inventarioAnterior = inventario;

      inventario = inventario.filter(
        function (_, posicion) {
          return posicion !== indice;
        }
      );

      if (guardarInventario()) {
        mostrarInventario();

        mensajeInventario.textContent =
          `Se eliminó "${item.nombre}" del inventario.`;

      } else {
        inventario = inventarioAnterior;
      }
    });

    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);

    listaInventario.appendChild(fila);
  });
}


// Registrar o actualizar ingredientes
inventarioForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document
    .getElementById("ingrediente")
    .value.trim();

  const cantidad = Number(
    document.getElementById("cantidad").value
  );

  const unidad = document.getElementById("unidad").value;

  const minimo = Number(
    document.getElementById("minimo").value
  );

  // Validar información
  if (
    !nombre ||
    !Number.isFinite(cantidad) ||
    !Number.isFinite(minimo) ||
    cantidad < 0 ||
    minimo < 0
  ) {
    mensajeInventario.textContent =
      "Revisa el nombre, la cantidad y el nivel mínimo.";

    return;
  }

  // Comprobar si el ingrediente ya existe
  const existente = inventario.find(function (item) {
    return (
      item.nombre.toLowerCase() === nombre.toLowerCase() &&
      item.unidad === unidad
    );
  });

  const inventarioAnterior = inventario.map(function (item) {
    return { ...item };
  });

  if (existente) {
    existente.cantidad = cantidad;
    existente.minimo = minimo;

  } else {
    inventario.push({
      nombre,
      cantidad,
      unidad,
      minimo
    });
  }

  // Guardar cambios
  if (!guardarInventario()) {
    inventario = inventarioAnterior;
    return;
  }

  mostrarInventario();
  inventarioForm.reset();

  mensajeInventario.textContent = existente
    ? `Se actualizaron las existencias de "${nombre}".`
    : `Se registró "${nombre}" correctamente.`;
});


// Mostrar inventario al cargar la página
mostrarInventario();
