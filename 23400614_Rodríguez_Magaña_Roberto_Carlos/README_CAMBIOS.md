# PW Hub - Sincronización automática + modo offline

## Qué corrige

Antes, subir un archivo a `U3` no hacía que apareciera en PW Hub.
La interfaz solo mostraba lo escrito manualmente en `hub/data/unidades.json`.

Ahora el Hub:

1. carga `unidades.json`;
2. consulta el árbol público de GitHub;
3. detecta HTML, PDF y Markdown nuevos dentro de U1-U5;
4. conserva los nombres/descripciones manuales;
5. agrega automáticamente lo nuevo;
6. guarda la última detección para usarla como respaldo.

## U3

El fallback local incluye desde ahora:

- `Ejercicio1CSS.html`
- `flex.html`
- `grid.html`

## Archivos que NO se convierten automáticamente en tarjetas

- CSS
- JavaScript
- imágenes
- TXT
- `README.md` situado directamente en la raíz de una unidad
- `base.html`

Esos archivos pueden seguir siendo dependencias de los trabajos y sí se
guardan para el modo offline cuando pertenecen a U1-U5.

## Modo offline

Se añade `service-worker.js` en la raíz del portafolio.

No hay:
- manifest;
- botón de instalar;
- comportamiento de PWA instalable.

Solo se usa el Service Worker como respaldo.

Después de visitar el Hub con internet, el navegador guarda:

- estructura principal del Hub;
- CSS y JavaScript;
- documentación;
- datos JSON;
- visor universal;
- recursos de marca esenciales;
- archivos detectados dentro de U1-U5.

## Importante

Los Service Workers requieren HTTP/HTTPS.

Funcionan en:

- GitHub Pages;
- `http://localhost:5505/...`

No funcionan al abrir el Hub directamente mediante `file:///`.

## Archivos modificados / nuevos

- `README.md`
- `service-worker.js` NUEVO
- `hub/index.html`
- `hub/data/unidades.json`
- `hub/js/hub.js`
- `hub/js/sincronizacion.js` NUEVO
- `hub/docs/README.md`
- `hub/docs/ROADMAP.md`
- `hub/docs/HISTORIAL.md`
- `hub/docs/CIERRE.md`
