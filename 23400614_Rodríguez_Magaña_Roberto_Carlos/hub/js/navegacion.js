const SECCIONES_NAVEGACION = [
"progreso",
"actividad",
"unidad1",
"unidad2",
"unidad3",
"unidad4",
"unidad5",
"trabajos",
"estadisticas",
"historial",
"roadmap",
"documentacion"
];
let destinoNavegacionTemporal = null;
let bloqueoNavegacionHasta = 0;
let actualizacionNavegacionPendiente = false;
let hashInicialAplicado = false;
document.addEventListener(
"DOMContentLoaded",
() => {
configurarMenusDesplegables();
configurarDocumentacionDesdeNav();
configurarCierreExterior();
configurarEnlacesInternos();
configurarNavegacionActiva();
aplicarHashInicialSiEsNecesario();
}
);
function configurarMenusDesplegables() {
const desplegables =
document.querySelectorAll(
".nav-desplegable"
);
desplegables.forEach(
(desplegable) => {
const boton =
desplegable.querySelector(
".nav-desplegable-boton"
);
const menu =
desplegable.querySelector(
".nav-desplegable-menu"
);
const elementosMenu =
menu.querySelectorAll(
"a, button"
);
boton.addEventListener(
"click",
() => {
const abierto =
desplegable.classList.contains(
"abierto"
);
if (abierto) {
cerrarDesplegable(
desplegable
);
}
else {
abrirDesplegable(
desplegable
);
}
}
);
boton.addEventListener(
"keydown",
(evento) => {
if (
evento.key ===
"ArrowDown" &&
menu.hidden
) {
evento.preventDefault();
abrirDesplegable(
desplegable
);
const primerElemento =
menu.querySelector(
"a, button"
);
if (primerElemento) {
primerElemento.focus();
}
}
}
);
elementosMenu.forEach(
(elemento) => {
elemento.addEventListener(
"click",
() => {
if (
!elemento.hasAttribute(
"data-nav-doc"
)
) {
cerrarDesplegable(
desplegable
);
}
}
);
}
);
desplegable.addEventListener(
"keydown",
(evento) => {
if (
evento.key ===
"Escape"
) {
cerrarDesplegable(
desplegable
);
boton.focus();
}
}
);
}
);
}
function abrirDesplegable(
desplegable
) {
cerrarTodosLosMenus(
desplegable
);
const boton =
desplegable.querySelector(
".nav-desplegable-boton"
);
const menu =
desplegable.querySelector(
".nav-desplegable-menu"
);
desplegable.classList.add(
"abierto"
);
boton.setAttribute(
"aria-expanded",
"true"
);
menu.hidden =
false;
}
function cerrarDesplegable(
desplegable
) {
const boton =
desplegable.querySelector(
".nav-desplegable-boton"
);
const menu =
desplegable.querySelector(
".nav-desplegable-menu"
);
desplegable.classList.remove(
"abierto"
);
if (boton) {
boton.setAttribute(
"aria-expanded",
"false"
);
}
if (menu) {
menu.hidden =
true;
}
}
function cerrarTodosLosMenus(
excepcion = null
) {
document
.querySelectorAll(
".nav-desplegable.abierto"
)
.forEach(
(desplegable) => {
if (
desplegable !==
excepcion
) {
cerrarDesplegable(
desplegable
);
}
}
);
}
function configurarDocumentacionDesdeNav() {
document
.querySelectorAll(
"[data-nav-doc]"
)
.forEach(
(botonNav) => {
botonNav.addEventListener(
"click",
() => {
const documento =
botonNav.dataset
.navDoc;
const botonDocumento =
document.querySelector(
`.boton-documento[data-doc="${documento}"]`
);
if (botonDocumento) {
botonDocumento.click();
setTimeout(
() => {
const visor =
document.getElementById(
"visor-markdown"
);
if (visor) {
marcarNavegacionActiva(
"documentacion"
);
visor.scrollIntoView({
behavior:
"smooth",
block:
"start"
});
}
},
80
);
}
cerrarTodosLosMenus();
}
);
}
);
}
function configurarCierreExterior() {
document.addEventListener(
"click",
(evento) => {
document
.querySelectorAll(
".nav-desplegable.abierto"
)
.forEach(
(desplegable) => {
if (
!desplegable.contains(
evento.target
)
) {
cerrarDesplegable(
desplegable
);
}
}
);
}
);
}
function configurarEnlacesInternos() {
document
.querySelectorAll(
'.navegacion-hub a[href^="#"]'
)
.forEach(
(enlace) => {
enlace.addEventListener(
"click",
(evento) => {
const href =
enlace.getAttribute(
"href"
);
if (
!href ||
href === "#"
) {
return;
}
const idDestino =
href.slice(1);
const destino =
document.getElementById(
idDestino
);
if (!destino) {
return;
}
evento.preventDefault();
iniciarNavegacionHacia(
idDestino
);
registrarDestinoEnURL(
idDestino
);
desplazarASeccion(
idDestino
);
}
);
}
);
}
function iniciarNavegacionHacia(
idDestino
) {
destinoNavegacionTemporal =
idDestino;
bloqueoNavegacionHasta =
performance.now() +
900;
marcarNavegacionActiva(
idDestino
);
setTimeout(
() => {
if (
destinoNavegacionTemporal ===
idDestino
) {
destinoNavegacionTemporal =
null;
solicitarActualizacionNavegacion();
}
},
950
);
}
function registrarDestinoEnURL(
idDestino
) {
const hash =
`#${idDestino}`;
if (
window.location.hash ===
hash
) {
return;
}
try {
history.pushState(
{
seccion:
idDestino
},
"",
hash
);
}
catch (error) {
console.warn(
"No fue posible registrar el hash en el historial.",
error
);
}
}
function configurarNavegacionActiva() {
window.addEventListener(
"scroll",
solicitarActualizacionNavegacion,
{
passive: true
}
);
window.addEventListener(
"resize",
solicitarActualizacionNavegacion
);
window.addEventListener(
"popstate",
() => {
const idDestino =
obtenerIdDesdeHash();
const destino =
document.getElementById(
idDestino
);
if (destino) {
iniciarNavegacionHacia(
idDestino
);
desplazarASeccion(
idDestino
);
}
}
);
const contenedorUnidades =
document.getElementById(
"contenedor-unidades"
);
if (contenedorUnidades) {
const observador =
new MutationObserver(
() => {
aplicarHashInicialSiEsNecesario();
solicitarActualizacionNavegacion();
}
);
observador.observe(
contenedorUnidades,
{
childList: true,
subtree: true
}
);
}
solicitarActualizacionNavegacion();
}
function solicitarActualizacionNavegacion() {
if (
actualizacionNavegacionPendiente
) {
return;
}
actualizacionNavegacionPendiente =
true;
requestAnimationFrame(
() => {
actualizarSeccionActiva();
actualizacionNavegacionPendiente =
false;
}
);
}
function esSeccionNavegable(
seccion
) {
if (!seccion) {
return false;
}
if (
seccion.hidden ||
seccion.classList.contains(
"seccion-oculta-config"
) ||
seccion.closest(
".seccion-oculta-config"
)
) {
return false;
}
return (
window.getComputedStyle(
seccion
).display !==
"none"
);
}
function actualizarSeccionActiva() {
if (
destinoNavegacionTemporal &&
performance.now() <
bloqueoNavegacionHasta
) {
marcarNavegacionActiva(
destinoNavegacionTemporal
);
return;
}
destinoNavegacionTemporal =
null;
if (
window.scrollY <
160
) {
marcarNavegacionActiva(
"inicio"
);
sincronizarHashSinCrearEntrada(
"inicio"
);
return;
}
const nav =
document.querySelector(
".navegacion-principal"
);
const alturaNav =
nav
? nav.offsetHeight
: 70;
const lineaActivacion =
Math.max(
alturaNav + 120,
window.innerHeight *
0.42
);
let idActivo =
null;
for (
const id of
SECCIONES_NAVEGACION
) {
const seccion =
document.getElementById(
id
);
if (
!esSeccionNavegable(
seccion
)
) {
continue;
}
const rect =
seccion.getBoundingClientRect();
if (
rect.top <=
lineaActivacion &&
rect.bottom >
lineaActivacion
) {
idActivo =
id;
break;
}
}
if (!idActivo) {
let distanciaMenor =
Number.POSITIVE_INFINITY;
SECCIONES_NAVEGACION.forEach(
(id) => {
const seccion =
document.getElementById(
id
);
if (
!esSeccionNavegable(
seccion
)
) {
return;
}
const rect =
seccion
.getBoundingClientRect();
const distancia =
Math.abs(
rect.top -
lineaActivacion
);
if (
distancia <
distanciaMenor
) {
distanciaMenor =
distancia;
idActivo =
id;
}
}
);
}
const cercaDelFinal =
window.innerHeight +
window.scrollY >=
document.documentElement.scrollHeight -
10;
const seccionDocumentacion =
document.getElementById(
"documentacion"
);
if (
cercaDelFinal &&
esSeccionNavegable(
seccionDocumentacion
)
) {
idActivo =
"documentacion";
}
if (!idActivo) {
idActivo =
"inicio";
}
marcarNavegacionActiva(
idActivo
);
sincronizarHashSinCrearEntrada(
idActivo
);
}
function marcarNavegacionActiva(
idActivo
) {
document
.querySelectorAll(
".navegacion-hub .nav-activo"
)
.forEach(
(elemento) =>
elemento.classList.remove(
"nav-activo"
)
);
document
.querySelectorAll(
".navegacion-hub .nav-subactivo"
)
.forEach(
(elemento) =>
elemento.classList.remove(
"nav-subactivo"
)
);
if (
idActivo ===
"inicio"
) {
activarEnlacePrincipal(
"#inicio"
);
return;
}
if (
idActivo ===
"progreso" ||
/^unidad[1-5]$/.test(
idActivo
)
) {
activarPadre(
"menu-curso"
);
activarSubEnlace(
`#${idActivo}`
);
return;
}
if (
[
"actividad",
"trabajos",
"estadisticas",
"historial",
"roadmap"
].includes(
idActivo
)
) {
activarPadre(
"menu-explorar"
);
activarSubEnlace(
`#${idActivo}`
);
return;
}
if (
idActivo ===
"documentacion"
) {
activarPadre(
"menu-documentacion"
);
activarSubEnlace(
"#documentacion"
);
}
}
function activarEnlacePrincipal(
selector
) {
const enlace =
document.querySelector(
`.navegacion-interior > a[href="${selector}"]`
);
if (enlace) {
enlace.classList.add(
"nav-activo"
);
}
}
function activarPadre(
idMenu
) {
const boton =
document.querySelector(
`.nav-desplegable-boton[aria-controls="${idMenu}"]`
);
if (boton) {
boton.classList.add(
"nav-activo"
);
}
}
function activarSubEnlace(
selector
) {
const enlace =
document.querySelector(
`.nav-desplegable-menu a[href="${selector}"]`
);
if (enlace) {
enlace.classList.add(
"nav-subactivo"
);
}
}
function sincronizarHashSinCrearEntrada(
idActivo
) {
const nuevoHash =
`#${idActivo}`;
if (
window.location.hash ===
nuevoHash
) {
return;
}
try {
history.replaceState(
history.state,
"",
nuevoHash
);
}
catch (error) {
}
}
function obtenerIdDesdeHash() {
const id =
window.location.hash
.replace(
"#",
""
);
return id ||
"inicio";
}
function desplazarASeccion(
idDestino
) {
const destino =
document.getElementById(
idDestino
);
if (!destino) {
return;
}
const nav =
document.querySelector(
".navegacion-principal"
);
const alturaNav =
nav
? nav.offsetHeight
: 70;
const espacioVisual =
16;
const posicionDestino =
window.scrollY +
destino
.getBoundingClientRect()
.top -
alturaNav -
espacioVisual;
window.scrollTo({
top:
Math.max(
0,
posicionDestino
),
behavior:
"smooth"
});
}
function aplicarHashInicialSiEsNecesario() {
if (
hashInicialAplicado
) {
return;
}
const id =
obtenerIdDesdeHash();
if (
id === "inicio"
) {
hashInicialAplicado =
true;
marcarNavegacionActiva(
"inicio"
);
return;
}
const destino =
document.getElementById(
id
);
if (!destino) {
return;
}
hashInicialAplicado =
true;
iniciarNavegacionHacia(
id
);
setTimeout(
() => {
desplazarASeccion(
id
);
},
100
);
}
