let eventosHistorial = [];
let historialUnidadActual = "todas";
let historialTipoActual = "todos";
let historialBusquedaActual = "";
let historialVistaActual = "cronologia";
document.addEventListener("DOMContentLoaded", cargarHistorial);
async function cargarHistorial() {
    const timeline = document.getElementById("historial-timeline");
    if (!timeline)
        return;
    try {
        const respuesta = await fetch("docs/HISTORIAL.md");
        if (!respuesta.ok)
            throw new Error("No fue posible cargar HISTORIAL.md");
        const markdown = await respuesta.text();
        eventosHistorial = parsearHistorial(markdown);
        construirTiposHistorial();
        configurarControlesHistorial();
        actualizarResumenHistorial();
        renderizarHistorial();
    }
    catch (error) {
        console.error(error);
        timeline.innerHTML = "<p class=\"error-carga\">No fue posible cargar el historial.</p>";
    }
}
function parsearHistorial(markdown) {
    const encabezados = [
        ...markdown.matchAll(/^###\s+(.+)$/gm)
    ];
    return encabezados.map((coincidencia, indice) => {
        const inicio = coincidencia.index;
        const fin = indice + 1 < encabezados.length ? encabezados[indice + 1].index : markdown.length;
        const bloque = markdown.slice(inicio, fin).trim();
        const evento = {
            titulo: coincidencia[1].trim(),
            tipo: datoHistorial(bloque, "Tipo") || "Evento",
            estado: datoHistorial(bloque, "Estado") || "Registrado",
            unidad: datoHistorial(bloque, "Unidad") || "General",
            fecha: datoHistorial(bloque, "Fecha"),
            fechaHora: datoHistorial(bloque, "FechaHora"),
            precision: datoHistorial(bloque, "Precisi\u00F3n"),
            fuente: datoHistorial(bloque, "Fuente"),
            descripcion: descripcionHistorial(bloque),
            indice
        };
        evento.tiempo = tiempoHistorial(evento);
        return evento;
    }).filter(evento => evento.fecha || evento.fechaHora || evento.descripcion);
}
function datoHistorial(bloque, campo) {
    const resultado = bloque.match(new RegExp(`\\*\\*${campo}:\\*\\*\\s*([^\\n]+)`, "i"));
    return resultado ? resultado[1].trim().replace(/\.$/, "") : "";
}
function descripcionHistorial(bloque) {
    return bloque.replace(/^###\s+[^\n]+\n?/, "").replace(/\*\*(?:Tipo|Estado|Unidad|Fecha|FechaHora|Precisión|Fuente):\*\*[^\n]*\n?/gi, "").replace(/---+/g, "").replace(/```[\s\S]*?```/g, "").replace(/\n{3,}/g, "\n\n").trim();
}
function tiempoHistorial(evento) {
    if (evento.fechaHora) {
        const tiempo = new Date(evento.fechaHora).getTime();
        if (!Number.isNaN(tiempo))
            return tiempo;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(evento.fecha || "")) {
        const [anio, mes, dia] = evento.fecha.split("-").map(Number);
        return new Date(anio, mes - 1, dia).getTime();
    }
    return 0;
}
function configurarControlesHistorial() {
    document.querySelectorAll("[data-historial-unidad]").forEach(boton => boton.addEventListener("click", () => {
        document.querySelectorAll("[data-historial-unidad]").forEach(elemento => elemento.classList.remove("activo"));
        boton.classList.add("activo");
        historialUnidadActual = boton.dataset.historialUnidad;
        renderizarHistorial();
    }));
    document.querySelectorAll("[data-historial-vista]").forEach(boton => boton.addEventListener("click", () => {
        document.querySelectorAll("[data-historial-vista]").forEach(elemento => elemento.classList.remove("activo"));
        boton.classList.add("activo");
        historialVistaActual = boton.dataset.historialVista;
        renderizarHistorial();
    }));
    const tipo = document.getElementById("historial-tipo");
    if (tipo)
        tipo.addEventListener("change", () => {
            historialTipoActual = tipo.value;
            renderizarHistorial();
        });
    const busqueda = document.getElementById("historial-busqueda");
    if (busqueda)
        busqueda.addEventListener("input", () => {
            historialBusquedaActual = normalizarHistorial(busqueda.value);
            renderizarHistorial();
        });
    const limpiar = document.getElementById("historial-limpiar");
    if (limpiar)
        limpiar.addEventListener("click", limpiarHistorial);
}
function construirTiposHistorial() {
    const select = document.getElementById("historial-tipo");
    if (!select)
        return;
    const existentes = new Set([
        ...select.options
    ].map(opcion => opcion.value));
    [
        ...new Set(eventosHistorial.map(evento => evento.tipo))
    ].sort((a, b) => a.localeCompare(b, "es")).forEach(tipo => {
        if (existentes.has(tipo))
            return;
        const opcion = document.createElement("option");
        opcion.value = tipo;
        opcion.textContent = tipo;
        select.appendChild(opcion);
    });
}
function limpiarHistorial() {
    historialUnidadActual = "todas";
    historialTipoActual = "todos";
    historialBusquedaActual = "";
    document.querySelectorAll("[data-historial-unidad]").forEach(boton => boton.classList.toggle("activo", boton.dataset.historialUnidad === "todas"));
    const tipo = document.getElementById("historial-tipo"), busqueda = document.getElementById("historial-busqueda");
    if (tipo)
        tipo.value = "todos";
    if (busqueda)
        busqueda.value = "";
    renderizarHistorial();
}
function actualizarResumenHistorial() {
    asignarHistorial("historial-total", eventosHistorial.length);
    asignarHistorial("historial-unidades", new Set(eventosHistorial.map(evento => evento.unidad).filter(unidad => /^U[1-5]$/.test(unidad))).size);
    asignarHistorial("historial-actividades", eventosHistorial.filter(evento => evento.tipo === "Actividad").length);
    asignarHistorial("historial-hitos", eventosHistorial.filter(evento => evento.tipo === "Hito").length);
}
function eventosHistorialVisibles() {
    return eventosHistorial.filter(evento => {
        const unidad = historialUnidadActual === "todas" || evento.unidad === historialUnidadActual;
        const tipo = historialTipoActual === "todos" || evento.tipo === historialTipoActual;
        const texto = normalizarHistorial([
            evento.titulo,
            evento.tipo,
            evento.estado,
            evento.unidad,
            evento.descripcion,
            evento.fuente
        ].join(" "));
        const busqueda = historialBusquedaActual === "" || texto.includes(historialBusquedaActual);
        return unidad && tipo && busqueda;
    }).sort((a, b) => (b.tiempo - a.tiempo) || (b.indice - a.indice));
}
function renderizarHistorial() {
    const visibles = eventosHistorialVisibles();
    const resultados = document.getElementById("historial-resultados");
    if (resultados)
        resultados.textContent = `${visibles.length} de ${eventosHistorial.length} eventos mostrados.`;
    const timeline = document.getElementById("historial-timeline"), unidades = document.getElementById("historial-unidades-contenedor");
    if (historialVistaActual === "cronologia") {
        timeline.hidden = false;
        unidades.hidden = true;
        renderizarTimelineHistorial(visibles);
    }
    else {
        timeline.hidden = true;
        unidades.hidden = false;
        renderizarUnidadesHistorial(visibles);
    }
}
function renderizarTimelineHistorial(eventos) {
    const contenedor = document.getElementById("historial-timeline");
    if (!contenedor)
        return;
    contenedor.innerHTML = "";
    if (!eventos.length) {
        contenedor.innerHTML = "<p class=\"historial-resultados\">No hay eventos que coincidan con los filtros.</p>";
        return;
    }
    eventos.forEach(evento => {
        const articulo = document.createElement("article");
        articulo.className = "historial-evento";
        articulo.innerHTML = `<div class="historial-evento-meta"><time>${fechaHistorial(evento)}</time><span>${evento.unidad}</span><span>${evento.tipo}</span><span>${evento.estado}</span></div><h3>${evento.titulo}</h3><p>${resumirHistorial(evento.descripcion)}</p>`;
        contenedor.appendChild(articulo);
    });
}
function renderizarUnidadesHistorial(eventos) {
    const contenedor = document.getElementById("historial-unidades-contenedor");
    if (!contenedor)
        return;
    contenedor.innerHTML = "";
    const grupos = {};
    eventos.forEach(evento => {
        const clave = evento.unidad || "General";
        (grupos[clave] ||= []).push(evento);
    });
    Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b, "es")).forEach(([unidad, lista]) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "historial-unidad-card";
        tarjeta.innerHTML = `<h3>${unidad}</h3><ul>${lista.map(evento => `<li>${evento.titulo}</li>`).join("")}</ul>`;
        contenedor.appendChild(tarjeta);
    });
}
function fechaHistorial(evento) {
    if (evento.fechaHora) {
        const fecha = new Date(evento.fechaHora);
        if (!Number.isNaN(fecha.getTime()))
            return new Intl.DateTimeFormat("es-MX", {
                dateStyle: "medium",
                timeStyle: "short"
            }).format(fecha);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(evento.fecha || "")) {
        const [anio, mes, dia] = evento.fecha.split("-").map(Number);
        return new Intl.DateTimeFormat("es-MX", {
            dateStyle: "medium"
        }).format(new Date(anio, mes - 1, dia));
    }
    return "Sin fecha";
}
function resumirHistorial(texto) {
    const limpio = String(texto || "").replace(/[`*_>#-]/g, "").replace(/\s+/g, " ").trim();
    return limpio.length > 360 ? limpio.slice(0, 360) + "\u2026" : limpio;
}
function normalizarHistorial(texto) {
    return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function asignarHistorial(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento)
        elemento.textContent = valor;
}
