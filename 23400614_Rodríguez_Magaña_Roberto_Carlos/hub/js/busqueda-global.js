/* =========================================================
   PW HUB v1.2.0 - NAVEGACIÓN Y BÚSQUEDA GLOBAL
   Candidato 12
   ========================================================= */

(() => {
    "use strict";

    const VERSION = "1.2.0";
    const MAX_RESULTADOS = 14;
    const RETARDO_URL = 180;

    const SECCIONES = [
        { titulo: "Inicio", detalle: "Resumen académico", destino: "inicio", secciones: [] },
        { titulo: "Progreso general", detalle: "Curso y avance de unidades", destino: "progreso", secciones: ["progreso"] },
        { titulo: "Actividad reciente", detalle: "Últimos cambios del portafolio", destino: "actividad", secciones: ["actividad"] },
        { titulo: "Todos los trabajos", detalle: "Explorador, búsqueda y filtros", destino: "trabajos", secciones: ["trabajos"] },
        { titulo: "Estadísticas", detalle: "Datos calculados del portafolio", destino: "estadisticas", secciones: ["estadisticas"] },
        { titulo: "Historial", detalle: "Cronología académica y técnica", destino: "historial", secciones: ["historial"] },
        { titulo: "Roadmap", detalle: "Versiones publicadas y planeadas", destino: "roadmap", secciones: ["roadmap"] },
        { titulo: "Documentación", detalle: "README, Historial y Roadmap Markdown", destino: "documentacion", secciones: ["documentacion"] }
    ];

    const PARAMETROS_CONTEXTO = {
        trabajos: ["trabajos-q", "trabajos-unidad", "trabajos-tipo", "trabajos-orden"],
        historial: ["historial-q", "historial-unidad", "historial-tipo", "historial-vista"],
        roadmap: ["roadmap-filtro", "roadmap-vista", "roadmap-item"],
        documentacion: ["doc", "doc-seccion"]
    };

    let indice = [];
    let resultados = [];
    let seleccionado = 0;
    let abierto = false;
    let construccionIndice = null;
    let temporizadorURL = null;
    let restaurando = false;
    let ultimoActivador = null;
    let rafMenusNavegacion = 0;

    window.PWHubBusquedaGlobal = {
        version: VERSION,
        abrir: abrirPaleta,
        cerrar: cerrarPaleta,
        reconstruir: reconstruirIndice,
        restaurarURL: aplicarEstadoDesdeURL
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }

    function iniciar() {
        crearBotonesBusqueda();
        crearPaleta();
        registrarBloqueoInterfaz();
        registrarAtajos();
        registrarVisibilidadBusqueda();
        registrarEstadoCompartible();
        registrarAjusteDesplegablesNavegacion();
        reconstruirIndice();

        window.setTimeout(() => aplicarEstadoDesdeURL(), 120);
        window.setTimeout(() => aplicarEstadoDesdeURL(), 700);
        window.setTimeout(() => aplicarEstadoDesdeURL(), 1600);

        window.addEventListener("popstate", () => {
            window.setTimeout(() => aplicarEstadoDesdeURL(), 40);
        });

        window.addEventListener("hashchange", () => {
            window.setTimeout(() => aplicarEstadoDesdeURL(), 40);
        });

        window.addEventListener("pw-hub-catalogo-actualizado", () => {
            reconstruirIndice(true);
        });
    }

    function crearBotonesBusqueda() {
        crearBotonNavegacion();
        crearBotonFlotanteMovil();
    }

    function crearBotonNavegacion() {
        if (document.getElementById("pw-busqueda-nav")) return;

        const interior = document.querySelector(".navegacion-interior");
        if (!interior) return;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "pw-busqueda-nav";
        boton.id = "pw-busqueda-nav";
        boton.setAttribute("aria-label", "Abrir búsqueda global");
        boton.title = "Buscar en PW Hub · Ctrl/Cmd + K";
        boton.innerHTML = `
            <svg class="pw-busqueda-nav-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5"></circle>
                <path d="m16 16 4.2 4.2"></path>
            </svg>
            <span class="pw-busqueda-nav-texto">Buscar</span>
            <span class="pw-busqueda-nav-atajo">Ctrl K</span>
        `;
        boton.addEventListener("click", abrirPaleta);

        const github = interior.querySelector(".nav-github");
        interior.insertBefore(boton, github || null);
    }

    function crearBotonFlotanteMovil() {
        if (document.getElementById("pw-busqueda-flotante")) return;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "nav-configuracion configuracion-flotante pw-busqueda-flotante";
        boton.id = "pw-busqueda-flotante";
        boton.setAttribute("aria-label", "Abrir búsqueda global");
        boton.title = "Buscar en PW Hub";
        boton.innerHTML = `
            <span class="nav-configuracion-icono pw-busqueda-flotante-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="6.5"></circle>
                    <path d="m16 16 4.2 4.2"></path>
                </svg>
            </span>
        `;
        boton.addEventListener("click", abrirPaleta);
        document.body.appendChild(boton);
    }

    function crearPaleta() {
        if (document.getElementById("pw-paleta-comandos")) return;

        const paleta = document.createElement("div");
        paleta.className = "pw-paleta";
        paleta.id = "pw-paleta-comandos";
        paleta.hidden = true;
        paleta.setAttribute("role", "dialog");
        paleta.setAttribute("aria-modal", "true");
        paleta.setAttribute("aria-label", "Búsqueda global de PW Hub");
        paleta.innerHTML = `
            <div class="pw-paleta-panel">
                <div class="pw-paleta-cabecera">
                    <svg class="pw-paleta-lupa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <circle cx="11" cy="11" r="6.5"></circle>
                        <path d="m16 16 4.2 4.2"></path>
                    </svg>
                    <input
                        id="pw-paleta-busqueda"
                        class="pw-paleta-input"
                        type="search"
                        autocomplete="off"
                        spellcheck="false"
                        placeholder="Buscar secciones, unidades, trabajos, historial, roadmap..."
                        aria-label="Buscar en PW Hub"
                    >
                    <button type="button" class="pw-paleta-cerrar" id="pw-paleta-cerrar">Esc</button>
                </div>
                <div class="pw-paleta-meta">
                    <span id="pw-paleta-estado">Escribe para buscar en todo el Hub</span>
                    <span>Ctrl/Cmd + K</span>
                </div>
                <div class="pw-paleta-resultados" id="pw-paleta-resultados" role="listbox"></div>
                <div class="pw-paleta-pie">
                    <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
                    <span><kbd>Enter</kbd> abrir</span>
                    <span><kbd>Esc</kbd> cerrar</span>
                </div>
            </div>
        `;

        document.body.appendChild(paleta);

        const input = paleta.querySelector("#pw-paleta-busqueda");
        const cerrar = paleta.querySelector("#pw-paleta-cerrar");

        input.addEventListener("input", renderizarResultados);
        input.addEventListener("keydown", manejarTecladoPaleta);
        cerrar.addEventListener("click", cerrarPaleta);

        paleta.addEventListener("mousedown", (evento) => {
            if (evento.target === paleta) cerrarPaleta();
        });
    }

    function registrarBloqueoInterfaz() {
        if (!document.body || document.body.dataset.pwBloqueoRegistrado === "true") {
            actualizarBloqueoInterfaz();
            return;
        }

        document.body.dataset.pwBloqueoRegistrado = "true";

        const observador = new MutationObserver(() => {
            actualizarBloqueoInterfaz();
        });

        observador.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"]
        });

        actualizarBloqueoInterfaz();
    }

    function actualizarBloqueoInterfaz() {
        if (!document.body) return;

        const bloquear =
            abierto ||
            document.body.classList.contains("personalizacion-abierta");

        document.documentElement.classList.toggle(
            "pw-scroll-bloqueado",
            bloquear
        );

        document.body.classList.toggle(
            "pw-scroll-bloqueado",
            bloquear
        );
    }

    function registrarAjusteDesplegablesNavegacion() {
        const navegacion = document.querySelector(".navegacion-hub");
        if (!navegacion) return;

        const programar = () => {
            window.cancelAnimationFrame(rafMenusNavegacion);
            rafMenusNavegacion = window.requestAnimationFrame(
                ajustarDesplegablesNavegacion
            );
        };

        navegacion.addEventListener("click", (evento) => {
            if (evento.target.closest(".nav-desplegable-boton")) {
                window.setTimeout(programar, 0);
            }
        });

        window.addEventListener("resize", programar, { passive: true });
        window.addEventListener("scroll", programar, { passive: true });

        const observador = new MutationObserver(programar);
        observador.observe(navegacion, {
            subtree: true,
            attributes: true,
            attributeFilter: ["hidden"]
        });
    }

    function ajustarDesplegablesNavegacion() {
        const menus = document.querySelectorAll(
            ".navegacion-hub .nav-desplegable-menu"
        );

        menus.forEach((menu) => {
            if (window.innerWidth <= 650 || menu.hidden) {
                menu.classList.remove("pw-menu-ajustado-v12");
                menu.style.removeProperty("max-height");
                menu.style.removeProperty("--pw-menu-ajuste-x");
                return;
            }

            menu.style.removeProperty("max-height");
            menu.style.setProperty("--pw-menu-ajuste-x", "0px");
            menu.classList.add("pw-menu-ajustado-v12");

            let rect = menu.getBoundingClientRect();
            const margenHorizontal = 14;
            const limiteDerecho = window.innerWidth - margenHorizontal;
            let ajusteX = 0;

            if (rect.left < margenHorizontal) {
                ajusteX += margenHorizontal - rect.left;
            }

            if (rect.right + ajusteX > limiteDerecho) {
                ajusteX += limiteDerecho - (rect.right + ajusteX);
            }

            menu.style.setProperty(
                "--pw-menu-ajuste-x",
                `${Math.round(ajusteX)}px`
            );

            rect = menu.getBoundingClientRect();
            const disponible = Math.floor(
                window.innerHeight - rect.top - 14
            );
            const limite = Math.min(520, Math.max(80, disponible));

            menu.style.maxHeight = `${limite}px`;
        });
    }

    function registrarAtajos() {
        document.addEventListener("keydown", (evento) => {
            if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "k") {
                evento.preventDefault();
                evento.stopPropagation();
                abierto ? cerrarPaleta() : abrirPaleta();
                return;
            }

            if (evento.key === "Escape" && abierto) {
                evento.preventDefault();
                cerrarPaleta();
            }
        }, true);
    }

    async function abrirPaleta(evento) {
        if (evento?.currentTarget instanceof HTMLElement) {
            ultimoActivador = evento.currentTarget;
        }

        const paleta = document.getElementById("pw-paleta-comandos");
        const input = document.getElementById("pw-paleta-busqueda");
        if (!paleta || !input) return;

        paleta.hidden = false;
        abierto = true;
        document.body.dataset.pwPaletaAbierta = "true";
        actualizarBloqueoInterfaz();
        input.value = "";
        seleccionado = 0;
        renderizarResultados();
        window.setTimeout(() => input.focus(), 0);

        await reconstruirIndice();
        if (abierto) renderizarResultados();
    }

    function cerrarPaleta() {
        const paleta = document.getElementById("pw-paleta-comandos");
        if (!paleta) return;
        paleta.hidden = true;
        abierto = false;
        delete document.body.dataset.pwPaletaAbierta;
        actualizarBloqueoInterfaz();
        const destinoFoco =
            ultimoActivador?.isConnected
                ? ultimoActivador
                : document.getElementById("pw-busqueda-nav");

        destinoFoco?.focus();
    }

    async function reconstruirIndice(forzar = false) {
        if (construccionIndice && !forzar) return construccionIndice;

        construccionIndice = (async () => {
            const nuevoIndice = [];

            SECCIONES.forEach((seccion) => {
                nuevoIndice.push(crearResultado({
                    tipo: "Sección",
                    titulo: seccion.titulo,
                    detalle: seccion.detalle,
                    buscar: `${seccion.titulo} ${seccion.detalle}`,
                    secciones: seccion.secciones,
                    accion: () => navegar(seccion.destino)
                }));
            });

            try {
                if (typeof window.obtenerDatosHubSincronizados === "function") {
                    const datos = await window.obtenerDatosHubSincronizados();
                    agregarUnidadesYTrabajos(nuevoIndice, datos);
                }
            } catch (error) {
                console.warn("PW Hub: búsqueda global usará el DOM para trabajos.", error);
                agregarUnidadesYTrabajosDesdeDOM(nuevoIndice);
            }

            await Promise.all([
                agregarHistorial(nuevoIndice),
                agregarRoadmap(nuevoIndice),
                agregarDocumentacion(nuevoIndice)
            ]);

            indice = deduplicarResultados(nuevoIndice);
            return indice;
        })().finally(() => {
            construccionIndice = null;
        });

        return construccionIndice;
    }

    function agregarUnidadesYTrabajos(destino, datos) {
        const unidades = Array.isArray(datos?.unidades) ? datos.unidades : [];

        unidades.forEach((unidad) => {
            const numero = String(unidad.numero || "").trim();
            const titulo = unidad.titulo || `Unidad ${numero}`;
            const temas = Array.isArray(unidad.temas) ? unidad.temas.join(" · ") : "";

            destino.push(crearResultado({
                tipo: "Unidad",
                titulo: `U${numero} · ${titulo}`,
                detalle: temas || unidad.descripcion || "Unidad del curso",
                buscar: `${titulo} ${unidad.descripcion || ""} ${temas} U${numero}`,
                secciones: ["unidades"],
                accion: () => navegar(`unidad${numero}`)
            }));

            (unidad.trabajos || []).forEach((trabajo) => {
                destino.push(crearResultado({
                    tipo: "Trabajo",
                    titulo: trabajo.nombre || "Trabajo",
                    detalle: `U${numero} · ${trabajo.descripcion || formatearTipo(trabajo.tipo)}`,
                    buscar: `${trabajo.nombre || ""} ${trabajo.descripcion || ""} ${trabajo.tipo || ""} U${numero} ${titulo}`,
                    secciones: ["unidades", "trabajos"],
                    accion: () => abrirTrabajo(trabajo, numero)
                }));
            });
        });
    }

    function agregarUnidadesYTrabajosDesdeDOM(destino) {
        document.querySelectorAll(".unidad-card").forEach((unidad) => {
            const id = unidad.id || "";
            const numero = id.replace(/\D/g, "");
            const titulo = unidad.querySelector("h3")?.textContent?.trim() || `Unidad ${numero}`;
            destino.push(crearResultado({
                tipo: "Unidad",
                titulo: `U${numero} · ${titulo}`,
                detalle: "Unidad del curso",
                buscar: `${titulo} U${numero}`,
                secciones: ["unidades"],
                accion: () => navegar(id)
            }));
        });

        document.querySelectorAll(".unidad-trabajo").forEach((tarjeta) => {
            const titulo = tarjeta.querySelector("h5")?.textContent?.trim();
            const enlace = tarjeta.querySelector("a[href]")?.href;
            if (!titulo) return;
            destino.push(crearResultado({
                tipo: "Trabajo",
                titulo,
                detalle: tarjeta.querySelector("p:not(.unidad-trabajo-tipo)")?.textContent?.trim() || "Trabajo del curso",
                buscar: tarjeta.textContent,
                secciones: ["unidades", "trabajos"],
                accion: () => enlace ? (window.location.href = enlace) : navegar("trabajos")
            }));
        });
    }

    async function agregarHistorial(destino) {
        try {
            const markdown = await obtenerTexto("docs/HISTORIAL.md");
            const encabezados = extraerEncabezados(markdown, /^###\s+(.+)$/gm);
            encabezados.forEach((titulo) => {
                destino.push(crearResultado({
                    tipo: "Historial",
                    titulo,
                    detalle: "Evento del historial del portafolio",
                    buscar: titulo,
                    secciones: ["historial"],
                    accion: () => abrirHistorial(titulo)
                }));
            });
        } catch (error) {
            console.warn("PW Hub: no fue posible indexar HISTORIAL.md", error);
        }
    }

    async function agregarRoadmap(destino) {
        try {
            const markdown = await obtenerTexto("docs/ROADMAP.md");
            const encabezados = extraerEncabezados(markdown, /^#\s+(v\d+\.\d+\.\d+\s+-\s+.+)$/gm);
            encabezados.forEach((titulo) => {
                destino.push(crearResultado({
                    tipo: "Roadmap",
                    titulo,
                    detalle: "Versión del roadmap de PW Hub",
                    buscar: titulo,
                    secciones: ["roadmap"],
                    accion: () => abrirRoadmap(titulo)
                }));
            });
        } catch (error) {
            console.warn("PW Hub: no fue posible indexar ROADMAP.md", error);
        }
    }

    async function agregarDocumentacion(destino) {
        const documentos = [
            { archivo: "README.md", etiqueta: "README" },
            { archivo: "HISTORIAL.md", etiqueta: "Historial Markdown" },
            { archivo: "ROADMAP.md", etiqueta: "Roadmap Markdown" }
        ];

        for (const documento of documentos) {
            destino.push(crearResultado({
                tipo: "Documento",
                titulo: documento.etiqueta,
                detalle: documento.archivo,
                buscar: `${documento.etiqueta} ${documento.archivo}`,
                secciones: ["documentacion"],
                accion: () => abrirDocumento(documento.archivo)
            }));
        }

        try {
            const markdown = await obtenerTexto("docs/README.md");
            const encabezados = extraerEncabezados(markdown, /^##\s+(.+)$/gm).slice(0, 40);
            encabezados.forEach((titulo) => {
                destino.push(crearResultado({
                    tipo: "Documento",
                    titulo,
                    detalle: "Sección de README.md",
                    buscar: `${titulo} README documentación`,
                    secciones: ["documentacion"],
                    accion: () => abrirDocumento("README.md", titulo)
                }));
            });
        } catch (error) {
            console.warn("PW Hub: no fue posible indexar README.md", error);
        }
    }

    function registrarVisibilidadBusqueda() {
        document.addEventListener("change", (evento) => {
            const control = evento.target;
            if (!(control instanceof HTMLInputElement)) return;
            if (!control.matches("[data-seccion-visible]")) return;

            if (abierto) {
                renderizarResultados();
            }
        });
    }

    function resultadoVisiblePorConfiguracion(resultado) {
        const claves = Array.isArray(resultado.secciones)
            ? resultado.secciones
            : [];

        // Inicio / Resumen académico es estructural desde v1.1.1.
        if (!claves.length) return true;

        // Un trabajo puede seguir siendo visible si está activa la vista de
        // Unidades o el explorador Todos los trabajos.
        return claves.some((clave) => seccionActivaEnConfiguracion(clave));
    }

    function seccionActivaEnConfiguracion(clave) {
        const control = document.querySelector(
            `[data-seccion-visible="${clave}"]`
        );

        if (control instanceof HTMLInputElement) {
            return control.checked;
        }

        const selectores = {
            progreso: "#progreso",
            actividad: "#actividad",
            unidades: ".seccion-portafolio",
            trabajos: "#trabajos",
            estadisticas: "#estadisticas",
            historial: "#historial",
            roadmap: "#roadmap",
            documentacion: "#documentacion"
        };

        const elemento = document.querySelector(selectores[clave] || "");
        return elemento
            ? !elemento.classList.contains("seccion-oculta-config")
            : true;
    }

    function crearResultado(configuracion) {
        return {
            ...configuracion,
            secciones: Array.isArray(configuracion.secciones)
                ? configuracion.secciones
                : [],
            clave: normalizar(`${configuracion.tipo} ${configuracion.titulo} ${configuracion.buscar || ""}`)
        };
    }

    function deduplicarResultados(lista) {
        const vistos = new Set();
        return lista.filter((resultado) => {
            const clave = `${resultado.tipo}|${normalizar(resultado.titulo)}`;
            if (vistos.has(clave)) return false;
            vistos.add(clave);
            return true;
        });
    }

    function renderizarResultados() {
        const contenedor = document.getElementById("pw-paleta-resultados");
        const input = document.getElementById("pw-paleta-busqueda");
        const estado = document.getElementById("pw-paleta-estado");
        if (!contenedor || !input) return;

        const consulta = normalizar(input.value);
        resultados = buscar(consulta).slice(0, MAX_RESULTADOS);
        seleccionado = Math.min(seleccionado, Math.max(0, resultados.length - 1));

        if (estado) {
            estado.textContent = consulta
                ? `${resultados.length} resultado${resultados.length === 1 ? "" : "s"} visible${resultados.length === 1 ? "" : "s"}`
                : "Accesos rápidos del contenido habilitado en Configuración";
        }

        if (!resultados.length) {
            contenedor.innerHTML = '<p class="pw-paleta-vacio">No se encontraron coincidencias entre las secciones visibles. Puedes activar más contenido desde Configuración.</p>';
            return;
        }

        contenedor.innerHTML = resultados.map((resultado, indiceResultado) => `
            <button
                type="button"
                class="pw-paleta-resultado${indiceResultado === seleccionado ? " activo" : ""}"
                data-indice="${indiceResultado}"
                data-tipo="${escapar(resultado.tipo)}"
                role="option"
                aria-selected="${indiceResultado === seleccionado ? "true" : "false"}"
            >
                <span class="pw-paleta-tipo">${escapar(resultado.tipo)}</span>
                <span class="pw-paleta-textos">
                    <span class="pw-paleta-titulo">${escapar(resultado.titulo)}</span>
                    <span class="pw-paleta-detalle">${escapar(resultado.detalle || "")}</span>
                </span>
                <span class="pw-paleta-ir" aria-hidden="true">↵</span>
            </button>
        `).join("");

        contenedor.querySelectorAll(".pw-paleta-resultado").forEach((boton) => {
            boton.addEventListener("mouseenter", () => {
                seleccionado = Number(boton.dataset.indice || 0);
                actualizarSeleccionVisual();
            });
            boton.addEventListener("click", () => ejecutarResultado(Number(boton.dataset.indice || 0)));
        });
    }

    function buscar(consulta) {
        const indiceVisible = indice.filter(resultadoVisiblePorConfiguracion);

        if (!consulta) {
            const preferidos = ["Sección", "Unidad", "Trabajo", "Roadmap", "Documento"];
            return [...indiceVisible].sort((a, b) => preferidos.indexOf(a.tipo) - preferidos.indexOf(b.tipo));
        }

        const tokens = consulta.split(/\s+/).filter(Boolean);
        return indiceVisible
            .map((resultado) => ({ resultado, puntuacion: puntuar(resultado, consulta, tokens) }))
            .filter((item) => item.puntuacion > 0)
            .sort((a, b) => b.puntuacion - a.puntuacion || a.resultado.titulo.localeCompare(b.resultado.titulo, "es"))
            .map((item) => item.resultado);
    }

    function puntuar(resultado, consulta, tokens) {
        const titulo = normalizar(resultado.titulo);
        const clave = resultado.clave;
        let puntos = 0;

        if (titulo === consulta) puntos += 120;
        if (titulo.startsWith(consulta)) puntos += 65;
        if (titulo.includes(consulta)) puntos += 40;
        if (clave.includes(consulta)) puntos += 26;

        for (const token of tokens) {
            if (!clave.includes(token)) return 0;
            puntos += titulo.includes(token) ? 12 : 5;
        }

        return puntos;
    }

    function manejarTecladoPaleta(evento) {
        if (evento.key === "ArrowDown") {
            evento.preventDefault();
            if (resultados.length) seleccionado = (seleccionado + 1) % resultados.length;
            actualizarSeleccionVisual(true);
        } else if (evento.key === "ArrowUp") {
            evento.preventDefault();
            if (resultados.length) seleccionado = (seleccionado - 1 + resultados.length) % resultados.length;
            actualizarSeleccionVisual(true);
        } else if (evento.key === "Enter") {
            evento.preventDefault();
            ejecutarResultado(seleccionado);
        } else if (evento.key === "Escape") {
            evento.preventDefault();
            cerrarPaleta();
        }
    }

    function actualizarSeleccionVisual(asegurarVisible = false) {
        const botones = [...document.querySelectorAll(".pw-paleta-resultado")];
        botones.forEach((boton, indiceBoton) => {
            const activo = indiceBoton === seleccionado;
            boton.classList.toggle("activo", activo);
            boton.setAttribute("aria-selected", activo ? "true" : "false");
            if (activo && asegurarVisible) boton.scrollIntoView({ block: "nearest" });
        });
    }

    function ejecutarResultado(indiceResultado) {
        const resultado = resultados[indiceResultado];
        if (!resultado) return;
        cerrarPaleta();
        resultado.accion?.();
    }

    function navegar(destino) {
        if (window.PWHubVistasInternas?.navegar) {
            window.PWHubVistasInternas.navegar(destino);
        } else {
            window.location.hash = `#${destino}`;
        }
    }

    function abrirTrabajo(trabajo, unidad) {
        if (trabajo?.ruta) {
            const rutaAbsoluta = new URL(trabajo.ruta, window.location.href).href;
            const parametros = new URLSearchParams({
                archivo: rutaAbsoluta,
                tipo: String(trabajo.tipo || "archivo").toLowerCase(),
                titulo: trabajo.nombre || "Trabajo"
            });
            window.location.href = `vistas/trabajo.html?${parametros.toString()}`;
            return;
        }

        navegar(`unidad${unidad}`);
    }

    function abrirHistorial(titulo) {
        actualizarURL({
            hash: "historial",
            parametros: { "historial-q": titulo }
        }, true);
        navegar("historial");
        window.setTimeout(() => aplicarEstadoDesdeURL(), 80);
        window.setTimeout(() => resaltarCoincidencia("#historial-timeline > *, #historial-unidades-contenedor > *", titulo), 450);
    }

    function abrirRoadmap(titulo) {
        const version = (titulo.match(/v\d+\.\d+\.\d+/i) || [titulo])[0];
        actualizarURL({
            hash: "roadmap",
            parametros: { "roadmap-item": version }
        }, true);
        navegar("roadmap");
        window.setTimeout(() => aplicarEstadoDesdeURL(), 120);
        window.setTimeout(() => resaltarCoincidencia("#roadmap-contenedor article, #roadmap-contenedor [class*='roadmap']", version), 600);
    }

    async function abrirDocumento(archivo, seccion = "") {
        actualizarURL({
            hash: "documentacion",
            parametros: { doc: archivo, "doc-seccion": seccion || null }
        }, true);
        navegar("documentacion");
        window.setTimeout(() => restaurarDocumentoDesdeURL(), 120);
    }

    function registrarEstadoCompartible() {
        const registrarInput = (selector, parametro, evento = "input") => {
            const elemento = document.querySelector(selector);
            if (!elemento) return;
            elemento.addEventListener(evento, () => {
                if (restaurando) return;
                programarURL(parametro, elemento.value);
            });
        };

        registrarInput("#trabajos-busqueda", "trabajos-q");
        registrarInput("#trabajos-tipo", "trabajos-tipo", "change");
        registrarInput("#trabajos-orden", "trabajos-orden", "change");
        registrarInput("#historial-busqueda", "historial-q");
        registrarInput("#historial-tipo", "historial-tipo", "change");

        document.addEventListener("click", (evento) => {
            const trabajoUnidad = evento.target.closest("[data-trabajos-unidad]");
            if (trabajoUnidad && !restaurando) {
                programarURL("trabajos-unidad", trabajoUnidad.dataset.trabajosUnidad);
                return;
            }

            const historialUnidad = evento.target.closest("[data-historial-unidad]");
            if (historialUnidad && !restaurando) {
                programarURL("historial-unidad", historialUnidad.dataset.historialUnidad);
                return;
            }

            const historialVista = evento.target.closest("[data-historial-vista]");
            if (historialVista && !restaurando) {
                programarURL("historial-vista", historialVista.dataset.historialVista);
                return;
            }

            const roadmapFiltro = evento.target.closest("[data-roadmap-filtro]");
            if (roadmapFiltro && !restaurando) {
                programarURL("roadmap-filtro", roadmapFiltro.dataset.roadmapFiltro);
                return;
            }

            const roadmapVista = evento.target.closest("[data-roadmap-vista]");
            if (roadmapVista && !restaurando) {
                programarURL("roadmap-vista", roadmapVista.dataset.roadmapVista);
            }
        });
    }

    function programarURL(parametro, valor) {
        window.clearTimeout(temporizadorURL);
        temporizadorURL = window.setTimeout(() => {
            actualizarURL({ parametros: { [parametro]: valor } }, false);
        }, RETARDO_URL);
    }

    function actualizarURL({ hash = null, parametros = {} }, crearEntrada = false) {
        const url = new URL(window.location.href);

        Object.entries(parametros).forEach(([clave, valor]) => {
            const limpio = String(valor ?? "").trim();
            const esDefault = esValorPredeterminado(clave, limpio);
            if (!limpio || esDefault) url.searchParams.delete(clave);
            else url.searchParams.set(clave, limpio);
        });

        if (hash) url.hash = `#${hash.replace(/^#/, "")}`;

        try {
            history[crearEntrada ? "pushState" : "replaceState"](history.state, "", url);
        } catch {
            // Si history falla, no se interrumpe el Hub.
        }
    }

    function esValorPredeterminado(clave, valor) {
        const defaults = {
            "trabajos-unidad": "todas",
            "trabajos-tipo": "todos",
            "trabajos-orden": "curso",
            "historial-unidad": "todas",
            "historial-tipo": "todos",
            "historial-vista": "cronologia",
            "roadmap-filtro": "todos",
            "roadmap-vista": "mapa"
        };
        return defaults[clave] === valor;
    }

    function aplicarEstadoDesdeURL() {
        const url = new URL(window.location.href);
        restaurando = true;

        try {
            aplicarInput("#trabajos-busqueda", url.searchParams.get("trabajos-q"), "input");
            aplicarInput("#trabajos-tipo", url.searchParams.get("trabajos-tipo"), "change");
            aplicarInput("#trabajos-orden", url.searchParams.get("trabajos-orden"), "change");
            aplicarBoton("[data-trabajos-unidad]", "trabajosUnidad", url.searchParams.get("trabajos-unidad"));

            aplicarInput("#historial-busqueda", url.searchParams.get("historial-q"), "input");
            aplicarInput("#historial-tipo", url.searchParams.get("historial-tipo"), "change");
            aplicarBoton("[data-historial-unidad]", "historialUnidad", url.searchParams.get("historial-unidad"));
            aplicarBoton("[data-historial-vista]", "historialVista", url.searchParams.get("historial-vista"));

            aplicarBoton("[data-roadmap-filtro]", "roadmapFiltro", url.searchParams.get("roadmap-filtro"));
            aplicarBoton("[data-roadmap-vista]", "roadmapVista", url.searchParams.get("roadmap-vista"));
        } finally {
            restaurando = false;
        }

        restaurarRoadmapItemDesdeURL();
        restaurarDocumentoDesdeURL();
    }

    function aplicarInput(selector, valor, evento) {
        if (valor === null) return;
        const elemento = document.querySelector(selector);
        if (!elemento) return;

        if (elemento.tagName === "SELECT" && ![...elemento.options].some((opcion) => opcion.value === valor)) return;
        if (elemento.value === valor) return;

        elemento.value = valor;
        elemento.dispatchEvent(new Event(evento, { bubbles: true }));
    }

    function aplicarBoton(selector, claveDataset, valor) {
        if (!valor) return;
        const botones = [...document.querySelectorAll(selector)];
        const boton = botones.find((item) => String(item.dataset[claveDataset]) === String(valor));
        if (boton && !boton.classList.contains("activo")) boton.click();
    }

    function restaurarRoadmapItemDesdeURL() {
        const url = new URL(window.location.href);
        const item = url.searchParams.get("roadmap-item");
        if (!item || window.location.hash !== "#roadmap") return;

        window.setTimeout(() => {
            resaltarCoincidencia("#roadmap-contenedor article, #roadmap-contenedor [class*='roadmap']", item);
        }, 420);
    }

    async function restaurarDocumentoDesdeURL() {
        const url = new URL(window.location.href);
        const archivo = url.searchParams.get("doc");
        const seccion = url.searchParams.get("doc-seccion") || "";
        if (!archivo || window.location.hash !== "#documentacion") return;
        if (typeof window.cargarDocumentoHub !== "function") return;

        await window.cargarDocumentoHub(archivo);

        if (seccion) {
            window.setTimeout(() => resaltarEncabezadoDocumento(seccion), 80);
        }
    }

    function resaltarEncabezadoDocumento(texto) {
        const contenedor = document.getElementById("contenido-markdown");
        if (!contenedor) return;
        const objetivo = [...contenedor.querySelectorAll("h1, h2, h3, h4")]
            .find((elemento) => normalizar(elemento.textContent).includes(normalizar(texto)));
        resaltarElemento(objetivo);
    }

    function resaltarCoincidencia(selector, texto) {
        const normalizado = normalizar(texto);
        const candidatos = [...document.querySelectorAll(selector)];
        const objetivo = candidatos.find((elemento) => normalizar(elemento.textContent).includes(normalizado));
        resaltarElemento(objetivo);
    }

    function resaltarElemento(elemento) {
        if (!elemento) return;
        elemento.classList.remove("pw-busqueda-destino");
        void elemento.offsetWidth;
        elemento.classList.add("pw-busqueda-destino");
        elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => elemento.classList.remove("pw-busqueda-destino"), 1600);
    }

    async function obtenerTexto(ruta) {
        const respuesta = await fetch(ruta, { cache: "no-cache" });
        if (!respuesta.ok) throw new Error(`No fue posible cargar ${ruta}`);
        return respuesta.text();
    }

    function extraerEncabezados(markdown, expresion) {
        const resultados = [];
        let coincidencia;
        expresion.lastIndex = 0;
        while ((coincidencia = expresion.exec(markdown)) !== null) {
            resultados.push(coincidencia[1].trim());
        }
        return resultados;
    }

    function normalizar(valor) {
        return String(valor || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9ñáéíóúü\s.-]/gi, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function formatearTipo(tipo) {
        const limpio = String(tipo || "archivo").toLowerCase();
        const mapa = { html: "HTML", pdf: "PDF", markdown: "Markdown", md: "Markdown" };
        return mapa[limpio] || limpio.toUpperCase();
    }

    function escapar(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
