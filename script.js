if (isNaN(precio) || precio <= 0) {
    resultado.textContent = "Ingresa un precio mayor que 0.";
    return;
}