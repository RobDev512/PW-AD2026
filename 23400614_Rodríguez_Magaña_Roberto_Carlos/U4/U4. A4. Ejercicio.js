// Actividad 4: Ejercicio
/*  Una intitución educativa necesita un programa que permita registrar las calificaciones de varios 
 *  estudiantes y determinar si aprobaron o reprobaron. Desarrolla un programa en JavaScript que realize 
 *  lo siguiente:
 * 
 *  1.  Solicite cuántos alumnos se desean registrar.
 *  2.  Para cada alumno, solicite su nombre.
 *  3.  Solicite tres calificaciones (de 0 a 100).
 *  4.  Calcule el promedio de las tres calificaciones.
 *  5.  Determine si el estudiante aprobó o reprobó, considerando que la calificación mínima aprobatoria
 *      es 70.
 *  6.  Muestre el nombre, las tres calificaciones, el promedio y el resultado de cada estudiante.
 *  7.  Al finalizar, muestre un resumen con:
 *    •  Total de alumnos registrados.
 *    •  Cantidad de alumnos aprobados.
 *    •  Cantidad de alumnos reprobados.
 *  
 *  Condiciones:
 *    • Si alguna calificación es menor que 0 o mayor que 100, mostrar un mensaje de calificación 
 *      inválida.
 *    • Si el promedio es mayor o igual a 70, el alumno está APROBADO.
 *    • Si el promedio es menor a 70, el alumno está REPROBADO.
 */

/// Ejercicio:
let totalAlumnos = 0;
let alumnosAprobados = 0;
let alumnosReprobados = 0;
let nombre = "";
let calificaciones = [];
let calificacion = 0;
let suma = 0;
let promedio = 0;
let resultado = "";

// Solicitar cantidad de alumnos
totalAlumnos = Number(prompt("¿Cuántos alumnos desea registrar?"));

while (!Number.isInteger(totalAlumnos) || totalAlumnos <= 0) {
    totalAlumnos = Number(prompt("Cantidad inválida. Ingrese nuevamente el número de alumnos:"));
}

// Registrar alumnos
for (let i = 0; i < totalAlumnos; i++) {
    nombre = prompt("Ingrese el nombre del alumno " + (i + 1) + ":");

    calificaciones = [];
    suma = 0;

    // Solicitar las tres calificaciones
    for (let j = 0; j < 3; j++) {
        calificacion = parseFloat(prompt("Ingrese la calificación " + (j + 1) + " de " + nombre + ":"));

        while (isNaN(calificacion) || calificacion < 0 || calificacion > 100) {
            calificacion = parseFloat(prompt("Calificación inválida. Ingrese nuevamente la calificación " + (j + 1) + " de " + nombre + " (0-100):"));
        }

        calificaciones.push(calificacion);
        suma += calificacion;
    }

    // Calcular promedio
    promedio = suma / 3;

    // Determinar resultado
    if (promedio >= 70) {
        resultado = "APROBADO";
        alumnosAprobados++;
    }
    else {
        resultado = "REPROBADO";
        alumnosReprobados++;
    }

    // Mostrar información del alumno
    console.log("-------- Alumno " + (i + 1) + " --------");
    console.log("Nombre: " + nombre);
    console.log("Calificaciones: " + calificaciones.join(", "));
    console.log("Promedio: " + promedio.toFixed(2));
    console.log("Resultado: " + resultado);
    console.log("");
}

// Resumen final
console.log("======== RESUMEN FINAL ========");
console.log("Total de alumnos registrados: " + totalAlumnos);
console.log("Alumnos aprobados: " + alumnosAprobados);
console.log("Alumnos reprobados: " + alumnosReprobados);