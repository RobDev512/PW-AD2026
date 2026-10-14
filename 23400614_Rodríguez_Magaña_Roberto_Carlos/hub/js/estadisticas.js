const estadisticaTrabajos = document.getElementById("estadistica-trabajos");
const estadisticaUnidadesCompletadas = document.getElementById("estadistica-unidades-completadas");
const estadisticaEventos = document.getElementById("estadistica-eventos");
const estadisticaAvance = document.getElementById("estadistica-avance");
const estadisticaUnidadActual = document.getElementById("estadistica-unidad-actual");
const estadisticasProgresoRelleno = document.getElementById("estadisticas-progreso-relleno");
const estadisticasEstados = document.getElementById("estadisticas-estados");
const estadisticasTrabajosUnidad = document.getElementById("estadisticas-trabajos-unidad");
const estadisticasTiposTrabajo = document.getElementById("estadisticas-tipos-trabajo");
const estadisticasEventosUnidad = document.getElementById("estadisticas-eventos-unidad");
const estadisticasTiposEvento = document.getElementById("estadisticas-tipos-evento");
async function cargarEstadisticas() {
    if (!estadisticaTrabajos || !estadisticasTrabajosUnidad)
        return;
    try {
        const [respuestaUnidades, respuestaHistorial] = await Promise.all([
            fetch("data/unidades.json"),
            fetch("docs/HISTORIAL.md")
        ]);
        if (!respuestaUnidades.ok || !respuestaHistorial.ok)
            throw new Error("No fue posible cargar las fuentes de estad\u00EDsticas.");
        const datosUnidades = await respuestaUnidades.json();
        const historialMarkdown = await respuestaHistorial.text();
        const eventos = extraerEventosEstadisticos(historialMarkdown);
        renderizarEstadisticasGenerales(datosUnidades, eventos);
        renderizarTrabajosPorUnidad(datosUnidades);
        renderizarTiposDeTrabajo(datosUnidades);
        renderizarEventosPorUnidad(datosUnidades, eventos);
        renderizarTiposDeEvento(eventos);
    }
    catch (error) {
        console.error(error);
        mostrarErrorEstadisticas();
    }
}
function renderizarEstadisticasGenerales(datos, eventos) {
    const unidades = datos.unidades || [];
    const totalUnidades = unidades.length;
    const completadas = unidades.filter(unidad => unidad.estado === "completada").length;
    const actuales = unidades.filter(unidad => unidad.estado === "actual");
    const pendientes = unidades.filter(unidad => unidad.estado === "pendiente").length;
    const totalTrabajos = unidades.reduce((total, unidad) => total + (unidad.trabajos ? unidad.trabajos.length : 0), 0);
    const porcentaje = totalUnidades > 0 ? Math.round(completadas / totalUnidades * 100) : 0;
    estadisticaTrabajos.textContent = totalTrabajos;
    estadisticaUnidadesCompletadas.textContent = `${completadas}/${totalUnidades}`;
    estadisticaEventos.textContent = eventos.length;
    estadisticaAvance.textContent = `${porcentaje}%`;
    estadisticasProgresoRelleno.style.width = `${porcentaje}%`;
    const unidadActual = actuales[0];
    estadisticaUnidadActual.textContent = unidadActual ? `Unidad actual: U${unidadActual.numero}` : "Sin unidad actual";
    estadisticasEstados.innerHTML = `<div class="estadisticas-estado estado-completadas"><strong>${completadas}</strong><span>Completadas</span></div><div class="estadisticas-estado estado-actuales"><strong>${actuales.length}</strong><span>Actual</span></div><div class="estadisticas-estado estado-pendientes"><strong>${pendientes}</strong><span>Pendientes</span></div>`;
}
function renderizarTrabajosPorUnidad(datos) {
    renderizarBarrasEstadisticas(estadisticasTrabajosUnidad, datos.unidades.map(unidad => ({
        etiqueta: `U${unidad.numero}`,
        detalle: unidad.titulo,
        valor: unidad.trabajos ? unidad.trabajos.length : 0
    })));
}
function renderizarTiposDeTrabajo(datos) {
    const conteo = {};
    datos.unidades.forEach(unidad => (unidad.trabajos || []).forEach(trabajo => {
        const tipo = formatearTipoEstadistica(trabajo.tipo || obtenerTipoRutaEstadistica(trabajo.ruta));
        conteo[tipo] = (conteo[tipo] || 0) + 1;
    }));
    const valores = Object.entries(conteo).map(([etiqueta, valor]) => ({
        etiqueta,
        valor
    })).sort((a, b) => b.valor - a.valor);
    renderizarBarrasEstadisticas(estadisticasTiposTrabajo, valores);
}
function renderizarEventosPorUnidad(datos, eventos) {
    const valores = datos.unidades.map(unidad => {
        const clave = `U${unidad.numero}`;
        return {
            etiqueta: clave,
            detalle: unidad.titulo,
            valor: eventos.filter(evento => evento.unidad === clave).length
        };
    });
    renderizarBarrasEstadisticas(estadisticasEventosUnidad, valores);
}
function renderizarTiposDeEvento(eventos) {
    const conteo = {};
    eventos.forEach(evento => {
        const tipo = evento.tipo || "Otro";
        conteo[tipo] = (conteo[tipo] || 0) + 1;
    });
    const valores = Object.entries(conteo).map(([etiqueta, valor]) => ({
        etiqueta,
        valor
    })).sort((a, b) => b.valor - a.valor);
    renderizarBarrasEstadisticas(estadisticasTiposEvento, valores);
}
function renderizarBarrasEstadisticas(contenedor, valores) {
    contenedor.innerHTML = "";
    if (valores.length === 0) {
        contenedor.innerHTML = "<p class=\"estadisticas-vacio\">Todav\u00EDa no existen datos suficientes.</p>";
        return;
    }
    const maximo = Math.max(...valores.map(elemento => elemento.valor), 1);
    valores.forEach(elemento => {
        const porcentaje = elemento.valor > 0 ? elemento.valor / maximo * 100 : 0;
        const fila = document.createElement("div");
        fila.className = "estadisticas-barra-fila";
        fila.innerHTML = `<div class="estadisticas-barra-info"><div><strong>${elemento.etiqueta}</strong>${elemento.detalle ? `<span>${elemento.detalle}</span>` : ""}</div><b>${elemento.valor}</b></div><div class="estadisticas-barra"><div class="estadisticas-barra-valor" style="width: ${porcentaje}%"></div></div>`;
        contenedor.appendChild(fila);
    });
}
function extraerEventosEstadisticos(markdown) {
    const coincidencias = [
        ...markdown.matchAll(/^###\s+(.+)$/gm)
    ];
    const eventos = [];
    coincidencias.forEach((coincidencia, indice) => {
        const inicio = coincidencia.index;
        const fin = indice + 1 < coincidencias.length ? coincidencias[indice + 1].index : markdown.length;
        const bloque = markdown.slice(inicio, fin);
        eventos.push({
            titulo: coincidencia[1].trim(),
            tipo: extraerDatoEstadistica(bloque, "Tipo") || "Otro",
            unidad: extraerDatoEstadistica(bloque, "Unidad") || "General"
        });
    });
    return eventos;
}
function extraerDatoEstadistica(bloque, campo) {
    const resultado = bloque.match(new RegExp(`\\*\\*${campo}:\\*\\*\\s*([^\\n]+)`, "i"));
    return resultado ? resultado[1].trim().replace(/\.$/, "") : "";
}
function obtenerTipoRutaEstadistica(ruta = "") {
    const extension = ruta.split(".").pop().toLowerCase();
    switch (extension) {
        case "html":
        case "htm": return "html";
        case "md": return "markdown";
        case "pdf": return "pdf";
        case "txt": return "texto";
        default: return extension || "archivo";
    }
}
function formatearTipoEstadistica(tipo) {
    const valor = String(tipo).toLowerCase();
    switch (valor) {
        case "html": return "HTML";
        case "markdown":
        case "md": return "Markdown";
        case "pdf": return "PDF";
        case "texto":
        case "txt": return "Texto";
        default: return valor.charAt(0).toUpperCase() + valor.slice(1);
    }
}
function mostrarErrorEstadisticas() {
    [
        estadisticasTrabajosUnidad,
        estadisticasTiposTrabajo,
        estadisticasEventosUnidad,
        estadisticasTiposEvento
    ].forEach(contenedor => {
        if (contenedor)
            contenedor.innerHTML = "<p class=\"error-carga\">No fue posible calcular las estad\u00EDsticas.</p>";
    });
}
document.addEventListener("DOMContentLoaded", cargarEstadisticas);
