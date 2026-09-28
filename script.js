document.getElementById("promoForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const precio = parseFloat(document.getElementById("precio").value);
  const tipoPromo = document.getElementById("tipoPromo").value;
  let descuento = 0;

  if (tipoPromo === "estudiante") descuento = 0.10;
  if (tipoPromo === "cumple") descuento = 0.15;

  const precioFinal = precio - (precio * descuento);
  document.getElementById("resultado").textContent =
    `Precio final: $${precioFinal.toFixed(2)}`;
});
    