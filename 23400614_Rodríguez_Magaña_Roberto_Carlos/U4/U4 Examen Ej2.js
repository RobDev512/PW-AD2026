
/* EU4: Ejercicio 2
 * Programa que simule un cajero automático
 * con un saldo inicial de $5000.
 *
 * Opciones:
 * 1. Consultar saldo.
 * 2. Depositar dinero.
 * 3. Retirar dinero.
 * 4. Salir.
 *
 * Restricciones:
 * Utilizar variables, condicionales, switch y ciclos.
 * No utilizar funciones ni arreglos.
 */

// Ejercicio 2
let op = 0;
let saldo = 5000;
let cantidad = 0;

do {
    op = Number(prompt(
        "==== CAJERO AUTOMÁTICO ====\n" +
        "1. Consultar saldo.\n" +
        "2. Depositar dinero.\n" +
        "3. Retirar dinero.\n" +
        "4. Salir.\n\n" +
        "Seleccione una opción:"
    ));

    switch (op) {
        case 1:
            console.log("Su saldo actual es: $" + saldo);
            break;

        case 2:
            do {
                cantidad = Number(prompt("Ingrese la cantidad a depositar:"));

                if (isNaN(cantidad) || cantidad <= 0) {
                    console.log("Error. Ingrese una cantidad válida.");
                }

            } 
            while (isNaN(cantidad) || cantidad <= 0);

            saldo += cantidad;

            console.log("Depósito realizado correctamente.");
            console.log("Saldo nuevo: $" + saldo);
            break;

        case 3:
            do {
                cantidad = Number(prompt("Ingrese la cantidad a retirar:"));

                if (isNaN(cantidad) || cantidad <= 0) {
                    console.log("Error. Ingrese una cantidad válida.");
                }
                else if (cantidad > saldo) {
                    console.log("Error. Saldo insuficiente.");
                }

            } 
            while (isNaN(cantidad) || cantidad <= 0 || cantidad > saldo);

            saldo -= cantidad;

            console.log("Retiro realizado correctamente.");
            console.log("Saldo nuevo: $" + saldo);
            break;

        case 4:
            alert("Gracias por utilizar el cajero automático.");
            break;

        default:
            alert("Opción incorrecta. Intente nuevamente.");
            break;
    }

} 
while (op != 4);
