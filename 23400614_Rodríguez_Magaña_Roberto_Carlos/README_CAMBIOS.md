# PW Hub - Corrección de renombres

## Qué encontré en GitHub

U3 contiene actualmente:

- `Ejercicio0CSS.html`
- `Ejercicio1.html`
- `flex.html`
- `grid.html`
- `pan-frances.png`

La tarjeta 404 aparecía porque `hub/data/unidades.json` todavía apuntaba a:

`../U3/Ejercicio1CSS.html`

Ese archivo ya no existe.

## Corrección

El catálogo base ahora usa:

`../U3/Ejercicio0CSS.html`

con el nombre:

**Ejercicio 0 - Modelo de caja CSS**

También se registra:

`../U3/Ejercicio1.html`

como:

**Ejercicio 1 - Receta Pan Francés con CSS**

## Mejora adicional

La sincronización automática ahora elimina de la vista cualquier referencia
manual HTML/PDF/Markdown que GitHub confirme que ya no existe.

Así, futuros renombres no deberían dejar tarjetas 404.

## Caché

`service-worker.js` cambia de `pw-hub-offline-v1` a
`pw-hub-offline-v2` para retirar rutas viejas de la caché.
