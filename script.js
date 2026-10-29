"use strict";

// Calculadora de promociones
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

// Gestión de inventario
const inventarioForm = document.getElementById("inventarioForm");
const listaInventario = document.getElementById("listaInventario");
const mensajeInventario = document.getElementById("mensajeInventario");

let inventario = cargarInventario();

function cargarInventario() {
  try {
    const datos = localStorage.getItem("cloudCoffeeInventario");
    const resultado = datos ? JSON.parse(datos) : [];

    return Array.isArray(resultado) ? resultado : [];
  } catch (error) {
    return [];
  }
}

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

mostrarInventario();