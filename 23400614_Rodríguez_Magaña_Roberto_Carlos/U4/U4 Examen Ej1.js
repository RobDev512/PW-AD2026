// Programación Web. U4. Exámen
/* 
 * EU4: Ejercicio 1
 * Elabora un programa que solicite un número entero positivo N.
 * El programa deber imprimir una piramide utilizando el carácter *
 * 
 * Ejemplo:
 *  Si N = 5
 *      *
 *     ***
 *    *****
 *   *******
 *  *********
 * 
 * Restricciones:
 *  Utilizar unicamente ciclos for
 */

// Ejercicio 1
    let n = 0;
    let espacios = '';
    let asteriscos = '';

    n = parseInt(prompt("Ingresa un número entero positivo:")); 
   
    for (let i = 1; i <= n; i++) {  
        espacios = " ".repeat(n - i);  
        asteriscos = "*".repeat(2 * i - 1);  
        
        console.log(espacios + asteriscos);  
    }
