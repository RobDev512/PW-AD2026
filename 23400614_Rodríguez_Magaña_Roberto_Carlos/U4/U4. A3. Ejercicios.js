// Actividad 3: Ejercicios
/*  1.  Escribe un programa que genere de forma continua números 
 *      entre el 0 y el 5, hasta que salga el numero 0
 * 
 *  2.  Una tienda departamental paga a sus empleados el 10% de
 *      comisión a quienes vendan menos de $10,000.00 en artículos,
 *      mientras que otorga un 15% a quienes vendan $10,000.00 o 
 *      más. Diseña un programa que solicite un número entre $5,000
 *      y $30,000 (validar entrada hasta que sea número válido) en
 *      ventas para un empleado, y muestre en pantalla cuánto dinero
 *      va a recibir por comisión
 */

// Ejercicio 1:
    console.log('-------------- Ejercicio 1 --------------');
    
    let num = 0;

    do {
        num = Math.floor(Math.random() * 6);
        
        if (num > 0) {
            console.log("Numero generado:", num, ", No es 0, se continua");
        }
        else {console.log("Numero generado:", num, ". Es 0, fin del programa");}
    }
    while(num > 0);


// Ejercicio 2:
    console.log('');
    console.log('-------------- Ejercicio 2 --------------');

    let ventas = 0;
    let tasa = 0;
    let comision = 0;

    do {
        ventas = parseFloat(prompt("Ingrese el monto de ventas ($5,000 a $30,000):"));

        if (isNaN(ventas) || ventas < 5000 || ventas > 30000) {
            console.log("Error: debe ingresar un número entre $5,000 y $30,000.");
        }

    } while (isNaN(ventas) || ventas < 5000 || ventas > 30000);

    if (ventas < 10000) tasa = 0.10;
    else tasa = 0.15;

    comision = ventas * tasa;

    console.log("Ventas registradas:", ventas);
    console.log("Porcentaje de comisión:", (tasa * 100) + "%");
    console.log("Comisión a recibir: $" + comision);