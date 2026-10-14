let fasesRoadmap = [];
let filtroRoadmapActual = "todos";
let vistaRoadmapActual = "tarjetas";
document.addEventListener("DOMContentLoaded", cargarRoadmap);
async function cargarRoadmap() {
    const contenedor = document.getElementById("roadmap-contenedor");
    if (!contenedor)
        return;
    try {
        const respuesta = await fetch("docs/ROADMAP.md");
        if (!respuesta.ok)
            throw new Error("No fue posible cargar ROADMAP.md");
        const markdown = await respuesta.text();
        fasesRoadmap = parsearRoadmap(markdown);
        configurarControlesRoadmap();
        actualizarResumenRoadmap();
        renderizarRoadmap();
    }
    catch (error) {
        console.error(error);
        contenedor.innerHTML = "<p class=\"error-carga\">No fue posible cargar el roadmap.</p>";
    }
}
function parsearRoadmap(markdown) {
    const encabezados = [
        ...markdown.matchAll(/^#\s+Fase\s+(\d+)\s*-\s*(.+)$/gm)
    ];
    return encabezados.map((coincidencia, indice) => {
        const inicio = coincidencia.index;
        const fin = indice + 1 < encabezados.length ? encabezados[indice + 1].index : markdown.length;
        const bloque = markdown.slice(inicio, fin).trim();
        const estadoOriginal = datoRoadmap(bloque, "Estado") || "Planeada";
        return {
            numero: Number(coincidencia[1]),
            titulo: coincidencia[2].trim(),
            estado: normalizarEstadoRoadmap(estadoOriginal),
            estadoTexto: estadoOriginal,
            objetivo: seccionRoadmap(bloque, "Objetivo"),
            detalle: detalleRoadmap(bloque)
        };
    });
}
function datoRoadmap(bloque, campo) {
    const resultado = bloque.match(new RegExp(`\\*\\*${campo}:\\*\\*\\s*([^\\n]+)`, "i"));
    return resultado ? resultado[1].trim() : "";
}
function seccionRoadmap(bloque, titulo) {
    const resultado = bloque.match(new RegExp(`##\\s+${titulo}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "i"));
    return resultado ? limpiarMarkdownRoadmap(resultado[1]) : "";
}
function detalleRoadmap(bloque) {
    return bloque.replace(/^#\s+Fase[^\n]+\n?/, "").replace(/\*\*Estado:\*\*[^\n]*\n?/i, "").trim();
}
function normalizarEstadoRoadmap(estado) {
    const valor = String(estado).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (valor.includes("complet"))
        return "completada";
    if (valor.includes("desarrollo"))
        return "desarrollo";
    if (valor.includes("vision futura") || valor.includes("futuro") || valor.includes("futura"))
        return "futura";
    return "planeada";
}
function configurarControlesRoadmap() {
    document.querySelectorAll("[data-roadmap-filtro]").forEach(boton => boton.addEventListener("click", () => {
        document.querySelectorAll("[data-roadmap-filtro]").forEach(elemento => elemento.classList.remove("activo"));
        boton.classList.add("activo");
        filtroRoadmapActual = boton.dataset.roadmapFiltro;
        renderizarRoadmap();
    }));
    document.querySelectorAll("[data-roadmap-vista]").forEach(boton => boton.addEventListener("click", () => {
        document.querySelectorAll("[data-roadmap-vista]").forEach(elemento => elemento.classList.remove("activo"));
        boton.classList.add("activo");
        vistaRoadmapActual = boton.dataset.roadmapVista;
        renderizarRoadmap();
    }));
}
function actualizarResumenRoadmap() {
    const completadas = fasesRoadmap.filter(f => f.estado === "completada").length;
    const desarrollo = fasesRoadmap.filter(f => f.estado === "desarrollo").length;
    const futuras = fasesRoadmap.filter(f => [
        "planeada",
        "futura"
    ].includes(f.estado)).length;
    const porcentaje = fasesRoadmap.length ? Math.round(completadas / fasesRoadmap.length * 100) : 0;
    asignarRoadmap("roadmap-total", fasesRoadmap.length);
    asignarRoadmap("roadmap-completadas", completadas);
    asignarRoadmap("roadmap-desarrollo", desarrollo);
    asignarRoadmap("roadmap-futuras", futuras);
    asignarRoadmap("roadmap-porcentaje", `${porcentaje}%`);
    const barra = document.getElementById("roadmap-barra-progreso");
    if (barra)
        barra.style.width = `${porcentaje}%`;
}
function fasesRoadmapVisibles() {
    return filtroRoadmapActual === "todos" ? fasesRoadmap : fasesRoadmap.filter(fase => fase.estado === filtroRoadmapActual);
}
function renderizarRoadmap() {
    const tarjetas = document.getElementById("roadmap-contenedor"), timeline = document.getElementById("roadmap-timeline");
    if (!tarjetas || !timeline)
        return;
    const fases = fasesRoadmapVisibles();
    if (vistaRoadmapActual === "tarjetas") {
        tarjetas.hidden = false;
        timeline.hidden = true;
        renderizarTarjetasRoadmap(fases);
    }
    else {
        tarjetas.hidden = true;
        timeline.hidden = false;
        renderizarTimelineRoadmap(fases);
    }
}
function renderizarTarjetasRoadmap(fases) {
    const contenedor = document.getElementById("roadmap-contenedor");
    contenedor.innerHTML = "";
    if (!fases.length) {
        contenedor.innerHTML = "<p class=\"estado-carga\">No hay fases en este filtro.</p>";
        return;
    }
    fases.forEach(fase => {
        const tarjeta = document.createElement("article");
        tarjeta.className = `roadmap-fase ${fase.estado}`;
        tarjeta.innerHTML = `<div class="roadmap-fase-cabecera"><div><p class="roadmap-fase-numero">Fase ${fase.numero}</p><h3>${fase.titulo}</h3></div><span class="roadmap-estado">${fase.estadoTexto}</span></div><p>${fase.objetivo || "Evoluci\u00F3n documentada del Hub acad\u00E9mico."}</p><details><summary>Ver detalles</summary><div class="roadmap-detalle">${window.marked ? marked.parse(fase.detalle) : limpiarMarkdownRoadmap(fase.detalle)}</div></details>`;
        contenedor.appendChild(tarjeta);
    });
}
function renderizarTimelineRoadmap(fases) {
    const contenedor = document.getElementById("roadmap-timeline");
    contenedor.innerHTML = "";
    fases.forEach(fase => {
        const item = document.createElement("article");
        item.className = "roadmap-timeline-item";
        item.innerHTML = `<h3>Fase ${fase.numero} · ${fase.titulo}</h3><p>${fase.estadoTexto}${fase.objetivo ? ` · ${fase.objetivo}` : ""}</p>`;
        contenedor.appendChild(item);
    });
}
function limpiarMarkdownRoadmap(texto) {
    return String(texto || "").replace(/[`*_>#-]/g, "").replace(/\s+/g, " ").trim();
}
function asignarRoadmap(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento)
        elemento.textContent = valor;
}
