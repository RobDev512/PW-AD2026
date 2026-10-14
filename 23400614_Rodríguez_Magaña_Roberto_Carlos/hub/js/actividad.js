const LIMITE_ACTIVIDAD_RECIENTE = 4;
const actividadGrid = document.getElementById("actividad-grid");
async function cargarActividadReciente() {
    if (!actividadGrid) {
        return;
    }
    try {
        const respuesta = await fetch("docs/HISTORIAL.md");
        if (!respuesta.ok) {
            throw new Error("No fue posible cargar HISTORIAL.md");
        }
        const markdown = await respuesta.text();
        const eventos = parsearActividadHistorial(markdown);
        const recientes = eventos.sort(compararActividadReciente).slice(0, LIMITE_ACTIVIDAD_RECIENTE);
        renderizarActividadReciente(recientes);
    }
    catch (error) {
        console.error(error);
        actividadGrid.innerHTML = `
<p class="error-carga">
No fue posible cargar la actividad reciente.
</p>
`;
    }
}
function parsearActividadHistorial(markdown) {
    const expresionEventos = /^###\s+(.+)$/gm;
    const coincidencias = [
        ...markdown.matchAll(expresionEventos)
    ];
    const eventos = [];
    coincidencias.forEach((coincidencia, indice) => {
        const inicio = coincidencia.index;
        const fin = indice + 1 < coincidencias.length ? coincidencias[indice + 1].index : markdown.length;
        const bloque = markdown.slice(inicio, fin).trim();
        const titulo = coincidencia[1].trim();
        const evento = {
            titulo,
            tipo: extraerDatoActividad(bloque, "Tipo") || "Evento",
            estado: extraerDatoActividad(bloque, "Estado") || "Registrado",
            unidad: extraerDatoActividad(bloque, "Unidad") || "General",
            fecha: extraerDatoActividad(bloque, "Fecha"),
            fechaHora: extraerDatoActividad(bloque, "FechaHora"),
            fuente: extraerDatoActividad(bloque, "Fuente") || "Historial",
            descripcion: extraerDescripcionActividad(bloque),
            ordenOriginal: indice
        };
        if (evento.fecha || evento.fechaHora)
            eventos.push(evento);
    });
    return eventos;
}
function extraerDatoActividad(bloque, campo) {
    const expresion = new RegExp(`\\*\\*${campo}:\\*\\*\\s*([^\\n]+)`, "i");
    const resultado = bloque.match(expresion);
    return resultado ? resultado[1].trim().replace(/\.$/, "") : "";
}
function extraerDescripcionActividad(bloque) {
    let texto = bloque.replace(/^###\s+[^\n]+\n?/, "").replace(/\*\*(?:Tipo|Estado|Unidad|Fecha|FechaHora|Precisión|Fuente):\*\*[^\n]*\n?/gi, "").replace(/```[\s\S]*?```/g, " ").replace(/[`*_>#-]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
    if (!texto)
        return "Evento registrado en el historial.";
    const limite = 165;
    if (texto.length > limite)
        texto = texto.slice(0, limite).trimEnd() + "\u2026";
    return texto;
}
function compararActividadReciente(a, b) {
    const tiempoA = obtenerTiempoActividad(a);
    const tiempoB = obtenerTiempoActividad(b);
    if (tiempoA === tiempoB)
        return b.ordenOriginal - a.ordenOriginal;
    return tiempoB - tiempoA;
}
function obtenerTiempoActividad(evento) {
    if (evento.fechaHora) {
        const tiempo = new Date(evento.fechaHora).getTime();
        if (!Number.isNaN(tiempo))
            return tiempo;
    }
    if (evento.fecha && /^\d{4}-\d{2}-\d{2}$/.test(evento.fecha)) {
        const [anio, mes, dia] = evento.fecha.split("-").map(Number);
        return new Date(anio, mes - 1, dia, 0, 0, 0).getTime();
    }
    return 0;
}
function formatearFechaActividad(evento) {
    if (evento.fechaHora) {
        const fecha = new Date(evento.fechaHora);
        if (!Number.isNaN(fecha.getTime()))
            return new Intl.DateTimeFormat("es-MX", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit"
            }).format(fecha);
    }
    if (evento.fecha && /^\d{4}-\d{2}-\d{2}$/.test(evento.fecha)) {
        const [anio, mes, dia] = evento.fecha.split("-").map(Number);
        return new Intl.DateTimeFormat("es-MX", {
            day: "numeric",
            month: "short"
        }).format(new Date(anio, mes - 1, dia));
    }
    return "Sin fecha";
}
function normalizarTipoActividad(tipo) {
    return String(tipo).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}
function renderizarActividadReciente(eventos) {
    actividadGrid.innerHTML = "";
    if (eventos.length === 0) {
        actividadGrid.innerHTML = `<p class="actividad-vacia">Todavía no existen eventos con fecha registrados.</p>`;
        return;
    }
    eventos.forEach(evento => {
        const tarjeta = document.createElement("article");
        const claseTipo = normalizarTipoActividad(evento.tipo);
        tarjeta.className = `actividad-tarjeta actividad-${claseTipo}`;
        tarjeta.innerHTML = `<div class="actividad-meta"><time>${formatearFechaActividad(evento)}</time><span class="actividad-unidad">${evento.unidad}</span><span class="actividad-tipo">${evento.tipo}</span></div><h3>${evento.titulo}</h3><p>${evento.descripcion}</p><div class="actividad-pie"><span>${evento.fuente}</span><button type="button" class="actividad-ver-evento" data-actividad-evento="${codificarDatoActividad(evento.titulo)}">Ver en historial</button></div>`;
        actividadGrid.appendChild(tarjeta);
    });
    configurarEnlacesActividad();
}
function codificarDatoActividad(texto) {
    return encodeURIComponent(texto);
}
function configurarEnlacesActividad() {
    actividadGrid.querySelectorAll("[data-actividad-evento]").forEach(boton => {
        boton.addEventListener("click", () => {
            const titulo = decodeURIComponent(boton.dataset.actividadEvento);
            const buscador = document.getElementById("historial-busqueda");
            if (buscador) {
                buscador.value = titulo;
                buscador.dispatchEvent(new Event("input", {
                    bubbles: true
                }));
            }
            const historial = document.getElementById("historial");
            if (historial) {
                if (typeof desplazarASeccion === "function")
                    desplazarASeccion("historial");
                else
                    historial.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", cargarActividadReciente);
