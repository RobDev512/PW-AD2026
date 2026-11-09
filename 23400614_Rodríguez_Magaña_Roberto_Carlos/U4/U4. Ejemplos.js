// Constantes
const pi = 3.1416;
console.log(pi);

// Variables
let numero = 25;
console.log(numero);

numero = "Cinco";
console.log(numero);


// Condicionales
let temperatura = 30;
if (temperatura > 30) {
    console.log("Hace calor");
}
else if (temperatura >= 20) {
    console.log("Clima agradable");
}
else {
    console.log("Hace frio")
}

let edad = 15;
if (edad > 18) {
    console.log("Mayor de edad");
}
else {
    console.log("Menor de edad");
}

let mensaje = edad >= 18 ? "Mayor" : "Menor";
console.log(mensaje);


// Ciclos
//  For
for (let i = 0; i < 3; i++) {
   console.log(i);
}

const frutas = ["Naranja", "Fresa", "Mango"];
console.log(frutas);
frutas.push("Sandia sin semilla");
console.log(frutas);
console.log(frutas[2]);
console.log(frutas.length);


