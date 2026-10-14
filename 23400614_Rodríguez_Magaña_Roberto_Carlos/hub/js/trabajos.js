const CLAVE_FAVORITOS = "pw-hub-favoritos-v1";
let trabajosRegistrados = [];
let trabajosUnidadActual = "todas";
let trabajosTipoActual = "todos";
let trabajosBusquedaActual = "";
let trabajosOrdenActual = "curso";
let trabajosVistaActual = "todos";
let favoritosTrabajos = cargarFavoritos();
let trabajoActualVisor = null;
let tokenRenderVisor = 0;
let ultimoElementoFocoVisor = null;
const cacheContenidoTrabajos = new Map();
const trabajosGrid = document.getElementById("trabajos-grid");
const trabajosBusqueda = document.getElementById("trabajos-busqueda");
const trabajosTipo = document.getElementById("trabajos-tipo");
const trabajosOrden = document.getElementById("trabajos-orden");
const trabajosLimpiar = document.getElementById("trabajos-limpiar");
const trabajosResultados = document.getElementById("trabajos-resultados");
const trabajosContexto = document.getElementById("trabajos-contexto");
const trabajosVisor = document.getElementById("trabajos-visor");
const trabajosVisorMeta = document.getElementById("trabajos-visor-meta");
const trabajosVisorTitulo = document.getElementById("trabajos-visor-titulo");
const trabajosVisorContenido = document.getElementById("trabajos-visor-contenido");
const trabajosVisorAbrir = document.getElementById("trabajos-visor-abrir");
const trabajosVisorCerrar = document.getElementById("trabajos-visor-cerrar");
async function cargarExploradorTrabajos() {
    try {
        const respuesta = await fetch("data/unidades.json");
        if (!respuesta.ok) {
            throw new Error("No fue posible cargar unidades.json");
        }
        const datos = await respuesta.json();
        trabajosRegistrados = construirListaTrabajos(datos);
        limpiarFavoritosInvalidos();
        construirFiltroTipos();
        crearFiltrosEspeciales();
        configurarControlesTrabajos();
        renderizarTrabajos();
    }
    catch (error) {
        console.error(error);
        if (trabajosGrid) {
            trabajosGrid.innerHTML = `
                <p class="error-carga">
                    No fue posible cargar el explorador de trabajos.
                </p>
            `;
        }
        if (trabajosResultados) {
            trabajosResultados.textContent = "No se pudieron cargar los trabajos.";
        }
    }
}
function construirListaTrabajos(datos) {
    const lista = [];
    datos.unidades.forEach(unidad => {
        unidad.trabajos.forEach((trabajo, indice) => {
            const tipo = trabajo.tipo || obtenerTipoDesdeRuta(trabajo.ruta);
            lista.push({
                id: crearIdTrabajo(unidad.numero, trabajo.ruta, indice),
                unidad: unidad.numero,
                unidadTitulo: unidad.titulo,
                unidadEstado: unidad.estado,
                ordenUnidad: unidad.numero,
                ordenTrabajo: indice,
                nombre: trabajo.nombre,
                ruta: trabajo.ruta,
                tipo,
                destacado: Boolean(trabajo.destacado),
                descripcion: trabajo.descripcion || "Sin descripci\u00F3n."
            });
        });
    });
    return lista;
}
function crearIdTrabajo(unidad, ruta, indice) {
    const base = `${unidad}:${ruta || indice}`;
    return encodeURIComponent(base);
}
function obtenerTipoDesdeRuta(ruta) {
    const extension = String(ruta || "").split(".").pop().toLowerCase();
    switch (extension) {
        case "html":
        case "htm": return "html";
        case "md": return "markdown";
        case "pdf": return "pdf";
        case "txt": return "texto";
        default: return extension || "archivo";
    }
}
function cargarFavoritos() {
    try {
        const guardados = localStorage.getItem(CLAVE_FAVORITOS);
        if (!guardados) {
            return new Set();
        }
        const datos = JSON.parse(guardados);
        if (!Array.isArray(datos)) {
            return new Set();
        }
        return new Set(datos);
    }
    catch (error) {
        console.warn("No fue posible cargar los favoritos.", error);
        return new Set();
    }
}
function guardarFavoritos() {
    try {
        localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify([
            ...favoritosTrabajos
        ]));
    }
    catch (error) {
        console.warn("No fue posible guardar los favoritos.", error);
    }
}
function limpiarFavoritosInvalidos() {
    const idsValidos = new Set(trabajosRegistrados.map(trabajo => trabajo.id));
    favoritosTrabajos = new Set([
        ...favoritosTrabajos
    ].filter(id => idsValidos.has(id)));
    guardarFavoritos();
}
function alternarFavorito(id) {
    if (favoritosTrabajos.has(id)) {
        favoritosTrabajos.delete(id);
    }
    else {
        favoritosTrabajos.add(id);
    }
    guardarFavoritos();
    renderizarTrabajos();
}
function construirFiltroTipos() {
    if (!trabajosTipo) {
        return;
    }
    trabajosTipo.querySelectorAll("option:not([value='todos'])").forEach(opcion => opcion.remove());
    const tipos = [
        ...new Set(trabajosRegistrados.map(trabajo => trabajo.tipo.toLowerCase()))
    ].sort();
    tipos.forEach(tipo => {
        const opcion = document.createElement("option");
        opcion.value = tipo;
        opcion.textContent = formatearTipoTrabajo(tipo);
        trabajosTipo.appendChild(opcion);
    });
}
function crearFiltrosEspeciales() {
    if (document.getElementById("trabajos-filtros-especiales")) {
        return;
    }
    const filtrosUnidad = document.getElementById("trabajos-filtros-unidad");
    const estado = document.querySelector(".trabajos-estado");
    if (!filtrosUnidad || !estado) {
        return;
    }
    const contenedor = document.createElement("div");
    contenedor.id = "trabajos-filtros-especiales";
    contenedor.className = "trabajos-filtros-especiales";
    contenedor.innerHTML = `
        <span class="trabajos-filtros-etiqueta">Vista</span>

        <button
            type="button"
            class="trabajos-vista activo"
            data-trabajos-vista="todos"
        >
            Todos
        </button>

        <button
            type="button"
            class="trabajos-vista"
            data-trabajos-vista="favoritos"
        >
            Favoritos
            <span id="trabajos-total-favoritos">0</span>
        </button>

        <button
            type="button"
            class="trabajos-vista"
            data-trabajos-vista="destacados"
        >
            Destacados
            <span id="trabajos-total-destacados">0</span>
        </button>
    `;
    estado.parentNode.insertBefore(contenedor, estado);
}
function configurarControlesTrabajos() {
    document.querySelectorAll("[data-trabajos-unidad]").forEach(boton => {
        boton.addEventListener("click", () => {
            document.querySelectorAll("[data-trabajos-unidad]").forEach(elemento => elemento.classList.remove("activo"));
            boton.classList.add("activo");
            trabajosUnidadActual = boton.dataset.trabajosUnidad;
            renderizarTrabajos();
        });
    });
    document.querySelectorAll("[data-trabajos-vista]").forEach(boton => {
        boton.addEventListener("click", () => {
            document.querySelectorAll("[data-trabajos-vista]").forEach(elemento => elemento.classList.remove("activo"));
            boton.classList.add("activo");
            trabajosVistaActual = boton.dataset.trabajosVista;
            renderizarTrabajos();
        });
    });
    if (trabajosBusqueda) {
        trabajosBusqueda.addEventListener("input", () => {
            trabajosBusquedaActual = normalizarTextoTrabajo(trabajosBusqueda.value);
            renderizarTrabajos();
        });
    }
    if (trabajosTipo) {
        trabajosTipo.addEventListener("change", () => {
            trabajosTipoActual = trabajosTipo.value;
            renderizarTrabajos();
        });
    }
    if (trabajosOrden) {
        trabajosOrden.addEventListener("change", () => {
            trabajosOrdenActual = trabajosOrden.value;
            renderizarTrabajos();
        });
    }
    if (trabajosLimpiar) {
        trabajosLimpiar.addEventListener("click", limpiarExploradorTrabajos);
    }
    if (trabajosVisorCerrar) {
        trabajosVisorCerrar.addEventListener("click", cerrarVisorTrabajo);
    }
    document.addEventListener("keydown", manejarTecladoVisor);
}
function limpiarExploradorTrabajos() {
    trabajosUnidadActual = "todas";
    trabajosTipoActual = "todos";
    trabajosBusquedaActual = "";
    trabajosOrdenActual = "curso";
    trabajosVistaActual = "todos";
    if (trabajosBusqueda) {
        trabajosBusqueda.value = "";
    }
    if (trabajosTipo) {
        trabajosTipo.value = "todos";
    }
    if (trabajosOrden) {
        trabajosOrden.value = "curso";
    }
    document.querySelectorAll("[data-trabajos-unidad]").forEach(boton => {
        boton.classList.toggle("activo", boton.dataset.trabajosUnidad === "todas");
    });
    document.querySelectorAll("[data-trabajos-vista]").forEach(boton => {
        boton.classList.toggle("activo", boton.dataset.trabajosVista === "todos");
    });
    cerrarVisorTrabajo();
    renderizarTrabajos();
}
function obtenerTrabajosVisibles() {
    const lista = trabajosRegistrados.filter(trabajo => {
        const coincideUnidad = trabajosUnidadActual === "todas" || String(trabajo.unidad) === trabajosUnidadActual;
        const coincideTipo = trabajosTipoActual === "todos" || trabajo.tipo.toLowerCase() === trabajosTipoActual;
        const coincideVista = trabajosVistaActual === "todos" || (trabajosVistaActual === "favoritos" && favoritosTrabajos.has(trabajo.id)) || (trabajosVistaActual === "destacados" && trabajo.destacado);
        const texto = normalizarTextoTrabajo([
            trabajo.nombre,
            trabajo.descripcion,
            trabajo.tipo,
            `U${trabajo.unidad}`,
            trabajo.unidadTitulo
        ].join(" "));
        const coincideBusqueda = trabajosBusquedaActual === "" || texto.includes(trabajosBusquedaActual);
        return (coincideUnidad && coincideTipo && coincideVista && coincideBusqueda);
    });
    return ordenarTrabajos(lista);
}
function ordenarTrabajos(lista) {
    const copia = [
        ...lista
    ];
    switch (trabajosOrdenActual) {
        case "az": return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", {
            sensitivity: "base"
        }));
        case "za": return copia.sort((a, b) => b.nombre.localeCompare(a.nombre, "es", {
            sensitivity: "base"
        }));
        case "unidad-desc": return copia.sort((a, b) => (b.ordenUnidad - a.ordenUnidad) || (a.ordenTrabajo - b.ordenTrabajo));
        default: return copia.sort((a, b) => (a.ordenUnidad - b.ordenUnidad) || (a.ordenTrabajo - b.ordenTrabajo));
    }
}
function renderizarTrabajos() {
    if (!trabajosGrid) {
        return;
    }
    const trabajos = obtenerTrabajosVisibles();
    actualizarContadoresEspeciales();
    actualizarEstadoTrabajos(trabajos);
    trabajosGrid.innerHTML = "";
    if (trabajos.length === 0) {
        trabajosGrid.innerHTML = `
            <p class="trabajos-sin-resultados">
                No existen trabajos que coincidan con los filtros actuales.
            </p>
        `;
        return;
    }
    trabajos.forEach(trabajo => {
        const tarjeta = document.createElement("article");
        const favorito = favoritosTrabajos.has(trabajo.id);
        tarjeta.className = "trabajo-explorador";
        if (favorito) {
            tarjeta.classList.add("trabajo-es-favorito");
        }
        if (trabajo.destacado) {
            tarjeta.classList.add("trabajo-es-destacado");
        }
        tarjeta.innerHTML = `
            <div class="trabajo-explorador-cabecera">
                <span class="trabajo-unidad">U${trabajo.unidad}</span>

                <span class="trabajo-tipo">
                    ${formatearTipoTrabajo(trabajo.tipo)}
                </span>

                <button
                    type="button"
                    class="trabajo-favorito ${favorito ? "activo" : ""}"
                    data-trabajo-favorito="${trabajo.id}"
                    aria-pressed="${favorito}"
                    aria-label="${favorito ? "Quitar de favoritos" : "Agregar a favoritos"}"
                    title="${favorito ? "Quitar de favoritos" : "Agregar a favoritos"}"
                >
                    ${favorito ? "\u2605" : "\u2606"}
                </button>
            </div>

            ${trabajo.destacado ? `<span class="trabajo-destacado">Destacado</span>` : ""}

            <p class="trabajo-unidad-titulo">
                ${trabajo.unidadTitulo}
            </p>

            <h3>${trabajo.nombre}</h3>

            <p class="trabajo-descripcion">
                ${trabajo.descripcion}
            </p>

            <div class="trabajo-acciones">
                <button
                    type="button"
                    class="trabajo-preview"
                    data-trabajo-preview="${trabajo.id}"
                >
                    Vista previa
                </button>

                <a
                    href="${generarRutaVisorExterno(trabajo)}"
                    class="trabajo-abrir"
                    data-trabajo-abrir="${trabajo.id}"
                >
                    Abrir trabajo
                </a>
            </div>
        `;
        trabajosGrid.appendChild(tarjeta);
    });
    configurarBotonesPreview();
    configurarBotonesFavorito();
}
function configurarBotonesFavorito() {
    document.querySelectorAll("[data-trabajo-favorito]").forEach(boton => {
        boton.addEventListener("click", () => {
            alternarFavorito(boton.dataset.trabajoFavorito);
        });
    });
}
function actualizarContadoresEspeciales() {
    const totalFavoritos = document.getElementById("trabajos-total-favoritos");
    const totalDestacados = document.getElementById("trabajos-total-destacados");
    if (totalFavoritos) {
        totalFavoritos.textContent = favoritosTrabajos.size;
    }
    if (totalDestacados) {
        totalDestacados.textContent = trabajosRegistrados.filter(trabajo => trabajo.destacado).length;
    }
}
function actualizarEstadoTrabajos(trabajos) {
    if (!trabajosResultados || !trabajosContexto) {
        return;
    }
    const total = trabajosRegistrados.length;
    const visibles = trabajos.length;
    trabajosResultados.textContent = visibles === 1 ? `1 trabajo encontrado de ${total}.` : `${visibles} trabajos encontrados de ${total}.`;
    const filtrosActivos = [];
    if (trabajosUnidadActual !== "todas") {
        filtrosActivos.push(`U${trabajosUnidadActual}`);
    }
    if (trabajosTipoActual !== "todos") {
        filtrosActivos.push(formatearTipoTrabajo(trabajosTipoActual));
    }
    if (trabajosVistaActual === "favoritos") {
        filtrosActivos.push("favoritos");
    }
    if (trabajosVistaActual === "destacados") {
        filtrosActivos.push("destacados");
    }
    if (trabajosBusquedaActual) {
        filtrosActivos.push("b\u00FAsqueda activa");
    }
    trabajosContexto.textContent = filtrosActivos.length > 0 ? `Filtros: ${filtrosActivos.join(" \u00B7 ")}` : "Mostrando todo el portafolio registrado.";
}
function configurarBotonesPreview() {
    document.querySelectorAll("[data-trabajo-preview]").forEach(boton => {
        boton.addEventListener("click", () => {
            const trabajo = trabajosRegistrados.find(elemento => elemento.id === boton.dataset.trabajoPreview);
            if (trabajo) {
                mostrarVistaPreviaTrabajo(trabajo);
            }
        });
    });
}
async function mostrarVistaPreviaTrabajo(trabajo) {
    if (!trabajosVisor || !trabajosVisorMeta || !trabajosVisorTitulo || !trabajosVisorContenido || !trabajosVisorAbrir) {
        return;
    }
    trabajoActualVisor = trabajo;
    ultimoElementoFocoVisor = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    trabajosVisor.hidden = false;
    trabajosVisorMeta.textContent = `U${trabajo.unidad} · ${formatearTipoTrabajo(trabajo.tipo)}`;
    trabajosVisorTitulo.textContent = trabajo.nombre;
    trabajosVisorAbrir.href = generarRutaVisorExterno(trabajo);
    trabajosVisorAbrir.target = "_self";
    trabajosVisorAbrir.removeAttribute("rel");
    prepararEstructuraVisor(trabajo);
    activarVisorModal();
    await renderizarVistaNormalTrabajo(trabajo);
}
function activarVisorModal() {
    if (!trabajosVisor) {
        return;
    }
    if (trabajosVisor.parentElement !== document.body) {
        document.body.appendChild(trabajosVisor);
    }
    const backdropAnterior = document.querySelector(".trabajos-visor-backdrop");
    if (backdropAnterior) {
        backdropAnterior.remove();
    }
    const backdrop = document.createElement("div");
    backdrop.className = "trabajos-visor-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.addEventListener("click", cerrarVisorTrabajo);
    document.body.appendChild(backdrop);
    document.body.classList.add("visor-trabajo-abierto");
    trabajosVisor.classList.add("trabajos-visor-modal");
    trabajosVisor.setAttribute("role", "dialog");
    trabajosVisor.setAttribute("aria-modal", "true");
    trabajosVisor.setAttribute("aria-labelledby", "trabajos-visor-titulo");
    requestAnimationFrame(() => {
        backdrop.classList.add("visible");
        trabajosVisor.classList.add("visible");
        if (trabajosVisorCerrar) {
            trabajosVisorCerrar.focus({
                preventScroll: true
            });
        }
    });
}
function desactivarVisorModal() {
    document.body.classList.remove("visor-trabajo-abierto");
    const backdrop = document.querySelector(".trabajos-visor-backdrop");
    if (backdrop) {
        backdrop.classList.remove("visible");
        window.setTimeout(() => {
            if (backdrop.isConnected) {
                backdrop.remove();
            }
        }, 180);
    }
    if (trabajosVisor) {
        trabajosVisor.classList.remove("visible", "trabajos-visor-modal");
        trabajosVisor.removeAttribute("role");
        trabajosVisor.removeAttribute("aria-modal");
        trabajosVisor.removeAttribute("aria-labelledby");
    }
}
function manejarTecladoVisor(evento) {
    if (evento.key === "Escape" && trabajosVisor && !trabajosVisor.hidden) {
        cerrarVisorTrabajo();
    }
}
function prepararEstructuraVisor(trabajo) {
    trabajosVisorContenido.innerHTML = `
        <div
            class="trabajos-visor-superficie"
            id="trabajos-visor-superficie"
        >
            <p class="estado-carga trabajos-visor-cargando">
                Cargando vista previa...
            </p>
        </div>
    `;
}
async function renderizarVistaNormalTrabajo(trabajo) {
    const superficie = document.getElementById("trabajos-visor-superficie");
    if (!superficie) {
        return;
    }
    const token = ++tokenRenderVisor;
    superficie.innerHTML = `
        <p class="estado-carga trabajos-visor-cargando">
            Cargando vista previa...
        </p>
    `;
    try {
        await renderizarDisenoTrabajo(trabajo, superficie, token);
    }
    catch (error) {
        if (token !== tokenRenderVisor) {
            return;
        }
        console.error(error);
        superficie.innerHTML = `
            <p class="error-carga trabajos-visor-cargando">
                No fue posible cargar la vista previa.
            </p>
        `;
    }
}
async function renderizarDisenoTrabajo(trabajo, superficie, token) {
    const tipo = normalizarTipoTrabajo(trabajo.tipo);
    if (tipo === "html" || tipo === "pdf") {
        if (token !== tokenRenderVisor) {
            return;
        }
        superficie.innerHTML = `
            <iframe
                src="${trabajo.ruta}"
                title="Vista previa de ${escaparHtmlTrabajo(trabajo.nombre)}"
                class="trabajos-visor-frame"
            ></iframe>
        `;
        return;
    }
    if (tipo === "markdown") {
        const markdown = await cargarFuenteTrabajo(trabajo);
        if (token !== tokenRenderVisor) {
            return;
        }
        superficie.innerHTML = `
            <article class="trabajos-preview-markdown">
                ${window.marked ? marked.parse(markdown) : `<pre>${escaparHtmlTrabajo(markdown)}</pre>`}
            </article>
        `;
        corregirRutasPreviewTrabajo(superficie, trabajo.ruta);
        return;
    }
    if (esImagenTrabajo(tipo)) {
        if (token !== tokenRenderVisor) {
            return;
        }
        superficie.innerHTML = `
            <div class="trabajos-preview-imagen">
                <img
                    src="${trabajo.ruta}"
                    alt="${escaparHtmlTrabajo(trabajo.nombre)}"
                >
            </div>
        `;
        return;
    }
    if (token !== tokenRenderVisor) {
        return;
    }
    superficie.innerHTML = `
        <div class="trabajos-preview-no-disponible">
            <p>
                Este tipo de archivo no cuenta con una representación visual.
            </p>
            <p>
                Utiliza el botón flotante de código para consultar su contenido.
            </p>
        </div>
    `;
}
async function renderizarCodigoTrabajo(trabajo, superficie, token) {
    const tipo = normalizarTipoTrabajo(trabajo.tipo);
    if (!obtenerModosDisponibles(trabajo).codigo) {
        if (token !== tokenRenderVisor) {
            return;
        }
        superficie.innerHTML = `
            <div class="trabajos-preview-no-disponible">
                <p>
                    El código fuente no está disponible para este tipo de archivo.
                </p>
            </div>
        `;
        return;
    }
    let fuente = await cargarFuenteTrabajo(trabajo);
    if (token !== tokenRenderVisor) {
        return;
    }
    if (tipo === "json") {
        try {
            fuente = JSON.stringify(JSON.parse(fuente), null, 2);
        }
        catch {
            // Si no se puede formatear, se muestra el contenido original.
        }
    }
    const pre = document.createElement("pre");
    pre.className = "trabajos-preview-codigo";
    const code = document.createElement("code");
    code.textContent = fuente;
    pre.appendChild(code);
    superficie.innerHTML = "";
    superficie.appendChild(pre);
}
async function cargarFuenteTrabajo(trabajo) {
    if (cacheContenidoTrabajos.has(trabajo.ruta)) {
        return cacheContenidoTrabajos.get(trabajo.ruta);
    }
    const respuesta = await fetch(trabajo.ruta);
    if (!respuesta.ok) {
        throw new Error(`No fue posible cargar ${trabajo.ruta}`);
    }
    const contenido = await respuesta.text();
    cacheContenidoTrabajos.set(trabajo.ruta, contenido);
    return contenido;
}
function obtenerModosDisponibles(trabajo) {
    const tipo = normalizarTipoTrabajo(trabajo?.tipo);
    if (tipo === "pdf" || esImagenTrabajo(tipo)) {
        return {
            diseno: true,
            codigo: false
        };
    }
    if (tipo === "html" || tipo === "markdown") {
        return {
            diseno: true,
            codigo: true
        };
    }
    return {
        diseno: false,
        codigo: true
    };
}
function esImagenTrabajo(tipo) {
    return [
        "png",
        "jpg",
        "jpeg",
        "gif",
        "webp",
        "svg"
    ].includes(tipo);
}
function normalizarTipoTrabajo(tipo) {
    const valor = String(tipo || "").toLowerCase();
    if (valor === "md") {
        return "markdown";
    }
    if (valor === "txt") {
        return "texto";
    }
    return valor;
}
function generarRutaVisorExterno(trabajo) {
    const rutaAbsoluta = new URL(trabajo.ruta || "", window.location.href).href;
    const parametros = new URLSearchParams({
        archivo: rutaAbsoluta,
        tipo: normalizarTipoTrabajo(trabajo.tipo || obtenerTipoDesdeRuta(trabajo.ruta || "")),
        titulo: trabajo.nombre || "Trabajo"
    });
    return `vistas/trabajo.html?${parametros.toString()}`;
}
function corregirRutasPreviewTrabajo(contenedor, rutaDocumento) {
    const ultimaBarra = rutaDocumento.lastIndexOf("/");
    const carpetaBase = ultimaBarra !== -1 ? rutaDocumento.substring(0, ultimaBarra + 1) : "";
    contenedor.querySelectorAll("img").forEach(imagen => {
        const src = imagen.getAttribute("src");
        if (src && esRutaRelativaTrabajo(src)) {
            imagen.src = carpetaBase + src;
        }
    });
    contenedor.querySelectorAll("a").forEach(enlace => {
        const href = enlace.getAttribute("href");
        if (href && esRutaRelativaTrabajo(href)) {
            enlace.href = carpetaBase + href;
        }
    });
}
function esRutaRelativaTrabajo(ruta) {
    return !(ruta.startsWith("http://") || ruta.startsWith("https://") || ruta.startsWith("#") || ruta.startsWith("mailto:") || ruta.startsWith("data:"));
}
function cerrarVisorTrabajo() {
    tokenRenderVisor++;
    trabajoActualVisor = null;
    desactivarVisorModal();
    if (trabajosVisor) {
        trabajosVisor.hidden = true;
    }
    if (trabajosVisorTitulo) {
        trabajosVisorTitulo.textContent = "Trabajo";
    }
    if (trabajosVisorMeta) {
        trabajosVisorMeta.textContent = "Vista previa";
    }
    if (trabajosVisorContenido) {
        trabajosVisorContenido.innerHTML = "";
    }
    if (trabajosVisorAbrir) {
        trabajosVisorAbrir.href = "#";
    }
    if (ultimoElementoFocoVisor && ultimoElementoFocoVisor.isConnected) {
        const elemento = ultimoElementoFocoVisor;
        ultimoElementoFocoVisor = null;
        requestAnimationFrame(() => {
            elemento.focus({
                preventScroll: true
            });
        });
    }
    else {
        ultimoElementoFocoVisor = null;
    }
}
function formatearTipoTrabajo(tipo) {
    const valor = String(tipo).toLowerCase();
    switch (valor) {
        case "html": return "HTML";
        case "markdown":
        case "md": return "Markdown";
        case "pdf": return "PDF";
        case "texto":
        case "txt": return "Texto";
        case "css": return "CSS";
        case "js": return "JavaScript";
        case "json": return "JSON";
        default: return (valor.charAt(0).toUpperCase() + valor.slice(1));
    }
}
function normalizarTextoTrabajo(texto) {
    return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function escaparHtmlTrabajo(texto) {
    const div = document.createElement("div");
    div.textContent = String(texto ?? "");
    return div.innerHTML;
}
window.mostrarVistaPreviaTrabajoHub = mostrarVistaPreviaTrabajo;
document.addEventListener("DOMContentLoaded", cargarExploradorTrabajos);
