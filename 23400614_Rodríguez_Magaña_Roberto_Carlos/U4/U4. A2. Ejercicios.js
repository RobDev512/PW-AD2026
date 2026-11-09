// Actividad 2: Ejercicios
/*  1.  Escribe un programa que genere 2 numeros aleatorios y que escriba en
 *      consola que números se generaron. Ademas, el programa deberá señalar si
 *      los números son iguales, y en caso de que no lo sea, mostrará cuál es el mayor.
 * 
 *  2.  Elabora un programa que genére un número aleatorio entre el número 2 y el
 *      10, y después escriba la tabla de multiplicar del numero generado.
 * 
 *  3.  Escribe un programa que solicite 10 numeros entre el 1 y el 100, y determine 
 *      cuántos de esos números son pares y cuantos impares
 */

// Ejercicio 1:
    console.log('-------------- Ejercicio 1 --------------');

    let num1 = Math.floor(Math.random() * 100) + 1;
    let num2 = Math.floor(Math.random() * 100) + 1;

    console.log("Números generados: num1:", num1 , "y num2:", num2);

    if (num1 == num2){
        console.log("Los números son iguales");
    } 
    else if (num1 > num2){
        console.log("El número mayor es num1:", num1, "y el menor es num2:", num2);
    }
    else {
        console.log("El número mayor es num2:", num2, "y el menor es num1:", num1);
    }


// Ejercicio 2:
    console.log('');
    console.log('-------------- Ejercicio 2 --------------');

    let numRandom = Math.floor(Math.random() * 9) + 2;
    
    console.log("Número aleatorio generado: numRandom:", numRandom);
    console.log('======= Tabla del: ', numRandom, ' =======');
    
    for (let i = 1; i <= 10; i++){
        console.log(numRandom, "×", i, "= ", numRandom*i);
    }
    
    
// Ejercicio 3:
    console.log('');
    console.log('-------------- Ejercicio 3 --------------');

    let pares = 0;
    let impares = 0;
    let numero = 0;

    for (let i = 1; i <= 10; i++) {
        numero = parseInt(prompt("Ingrese un número entre 1 y 100:"));
        
        if (numero >= 1 && numero <= 100) {
            if (numero % 2 === 0) {
                pares++;
            } 
            else {
                impares++;
            }
        } 
        else {
            console.log("Número fuera de rango, intente de nuevo.");
            i--;
        }
    }

    console.log("Cantidad de números pares:", pares);
    console.log("Cantidad de números impares:", impares);
    