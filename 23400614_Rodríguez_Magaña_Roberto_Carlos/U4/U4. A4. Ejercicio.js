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

// Ejercicio:
    let totalAlumnos = parseInt(prompt("¿Cuántos alumnos desea registrar?"));
    let alumnosAprobados = 0;
    let alumnosReprobados = 0;
    let nombre = '';
    let calificaciones = [];
    let promedio = 0;
    let resultado = '';
    let cal = 0;

    for (let i = 0; i < totalAlumnos; i++) {
        nombre = prompt(`Ingrese el nombre del alumno ${i + 1}:`);
        
        calificaciones = [];
        
        for (let j = 0; j < 3; j++) {
            cal = parseFloat(prompt(`Ingrese la calificación ${j + 1} de ${nombre} (0-100):`));
            
            while (cal < 0 || cal > 100 || isNaN(cal)) {
                cal = parseFloat(prompt(`Calificación inválida. Ingrese nuevamente la calificación ${j + 1} de ${nombre} (0-100):`));
            }
            
            calificaciones.push(cal);
        }
        
        promedio = calificaciones.reduce((a, b) => a + b, 0) / 3;
        resultado = promedio >= 70 ? "APROBADO" : "REPROBADO";

        if (resultado === "APROBADO") {
            alumnosAprobados++;
        } 
        else {
            alumnosReprobados++;
        }

        console.log(`Alumno: ${nombre}`);
        console.log(`Calificaciones: ${calificaciones.join(", ")}`);
        console.log(`Promedio: ${promedio.toFixed(2)}`);
        console.log(`Resultado: ${resultado}`);
        console.log('');
        console.log("-----------------------------");
    }
    
    console.log(`Total de alumnos registrados: ${totalAlumnos}`);
    console.log(`Cantidad de alumnos aprobados: ${alumnosAprobados}`);
    console.log(`Cantidad de alumnos reprobados: ${alumnosReprobados}`);
