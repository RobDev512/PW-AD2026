/*
    =========================================================
    PW HUB v1.2.1 - PROYECTOS POR CARPETAS
    =========================================================

    Mantiene las actividades de U2 y U3 agrupadas como proyectos y
    permite explorar sus recursos sin convertir cada archivo interno
    en un trabajo independiente.
*/

(() => {
    "use strict";

    const VERSION = "1.2.1";
    const REPOSITORIO = "RobDev512/PW-AD2026";
    const RAMA = "main";
    const RAIZ_ALUMNO = "23400614_Rodríguez_Magaña_Roberto_Carlos";
    const CLAVE_CACHE = "pw-hub-proyectos-recursos-v1";
    const VIGENCIA_CACHE = 15 * 60 * 1000;
    const DRAWIO_VIEWER_URL =
        "https://viewer.diagrams.net/js/viewer-static.min.js";
    const DRAWIO_VIEWER_TIMEOUT = 8000;

    const cacheFuente = new Map();
    const cacheProyecto = new Map();
    let promesaArbolGitHub = null;
    let promesaVisorDrawio = null;
    let tokenProyecto = 0;

    const FALLBACKS = {
        "U2/U2 Act 1 - Ejercicio1/": [
            "Ejercicio1 - U2 Act 1.html",
            "pan-frances.png"
        ],
        "U2/U2 Act 2 - Ejercicio2/": [
            "Ejercicio2 - U2 Act 2.html",
            "tears-for-fears.jpg"
        ],
        "U2/U2 Act 5 - Ejercicio5/": [
            "Ejercicio5 - U2 Act 5.html",
            "Michael.jpg"
        ],
        "U3/U3. A4 - Ej1/": [
            "Ej1 - U3A4.html",
            "pan-frances.png"
        ],
        "U3/U3. A5 - Ej2/": [
            "Ej2 - U3A5.html",
            "tears-for-fears.jpg"
        ],
        "U3/U3. A6 - Instagram/": [
            "Perfil - U3A6.html",
            "css/styles.css",
            "diseno/Perfil - U3A6.drawio",
            "diseno/Perfil - U3A6.png",
            "img/perfil/foto.jpg",
            "img/publicaciones/publicacion-01.png",
            "img/publicaciones/publicacion-02.png",
            "img/publicaciones/publicacion-03.png",
            "img/publicaciones/publicacion-04.png",
            "img/publicaciones/publicacion-05.png",
            "img/publicaciones/publicacion-06.png",
            "img/publicaciones/publicacion-07.png",
            "img/publicaciones/publicacion-08.png",
            "img/publicaciones/publicacion-09.png"
        ]
    };

    const gruposOrden = [
        "Página",
        "Código",
        "Diseño",
        "Imágenes",
        "Documentos",
        "Otros"
    ];

    const vistaPreviaOriginal = window.mostrarVistaPreviaTrabajoHub;

    if (typeof vistaPreviaOriginal === "function") {
        window.mostrarVistaPreviaTrabajoHub = (trabajo) => {
            if (esProyectoCarpeta(trabajo)) {
                return mostrarProyecto(trabajo);
            }

            document
                .getElementById("trabajos-visor")
                ?.classList.remove("pw-proyecto-modal-activo");

            return vistaPreviaOriginal(trabajo);
        };
    }

    document.addEventListener(
        "click",
        interceptarPreviewExplorador,
        true
    );

    document.addEventListener("DOMContentLoaded", () => {
        decorarTarjetasProyecto();
        observarTarjetasProyecto();
    });

    window.PWHubProjects = {
        version: VERSION,
        esProyecto: esProyectoCarpeta,
        obtenerInfo: obtenerInfoProyecto,
        abrir: mostrarProyecto
    };

    function interceptarPreviewExplorador(evento) {
        const boton = evento.target.closest("[data-trabajo-preview]");
        if (!boton) return;

        let trabajo = null;

        try {
            if (
                typeof trabajosRegistrados !== "undefined" &&
                Array.isArray(trabajosRegistrados)
            ) {
                trabajo =
                    trabajosRegistrados.find(
                        (elemento) =>
                            elemento.id === boton.dataset.trabajoPreview
                    ) || null;
            }
        } catch {
            trabajo = null;
        }

        if (!esProyectoCarpeta(trabajo)) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();
        mostrarProyecto(trabajo);
    }

    function esProyectoCarpeta(trabajo) {
        return Boolean(obtenerInfoProyecto(trabajo));
    }

    function obtenerInfoProyecto(trabajo) {
        if (!trabajo?.ruta) return null;

        const ruta = normalizarRutaRelativa(trabajo.ruta);
        const coincidencia = ruta.match(/^U([23])\/(.+)\/([^/]+)$/i);
        if (!coincidencia) return null;

        const unidad = Number(coincidencia[1]);
        const carpeta = coincidencia[2];
        if (!carpeta) return null;

        return {
            unidad,
            carpeta,
            raiz: `U${unidad}/${carpeta}/`,
            principal: ruta,
            nombre: trabajo.nombre || carpeta
        };
    }

    async function mostrarProyecto(trabajo) {
        const info = obtenerInfoProyecto(trabajo);
        if (!info) return vistaPreviaOriginal?.(trabajo);

        const visor = document.getElementById("trabajos-visor");
        const meta = document.getElementById("trabajos-visor-meta");
        const titulo = document.getElementById("trabajos-visor-titulo");
        const contenido = document.getElementById("trabajos-visor-contenido");
        const abrir = document.getElementById("trabajos-visor-abrir");

        if (!visor || !meta || !titulo || !contenido || !abrir) return;

        tokenProyecto += 1;
        const token = tokenProyecto;

        try {
            if (typeof ultimoElementoFocoVisor !== "undefined") {
                ultimoElementoFocoVisor =
                    document.activeElement instanceof HTMLElement
                        ? document.activeElement
                        : null;
            }
        } catch {
            // El retorno de foco es opcional.
        }

        visor.hidden = false;
        visor.classList.add("pw-proyecto-modal-activo");
        meta.textContent = `U${info.unidad} · Proyecto por carpeta`;
        titulo.textContent = trabajo.nombre || info.nombre;
        abrir.href = generarRutaVisorRecurso({
            ruta: trabajo.ruta,
            tipo: trabajo.tipo || obtenerTipoDesdeRuta(trabajo.ruta),
            nombre: trabajo.nombre || info.nombre
        });
        abrir.target = "_self";
        abrir.removeAttribute("rel");

        contenido.innerHTML = `
            <div class="pw-proyecto-cargando">
                <span class="pw-proyecto-spinner" aria-hidden="true"></span>
                <p>Explorando archivos del proyecto...</p>
            </div>
        `;

        if (typeof activarVisorModal === "function") {
            activarVisorModal();
        }

        try {
            const recursos = await obtenerRecursosProyecto(info, trabajo);

            if (token !== tokenProyecto || visor.hidden) return;

            construirExploradorProyecto({
                trabajo,
                info,
                recursos,
                contenido,
                abrir,
                token
            });
        } catch (error) {
            console.error(
                "PW Hub: no fue posible explorar el proyecto.",
                error
            );

            if (token !== tokenProyecto || visor.hidden) return;

            contenido.innerHTML = `
                <div class="pw-proyecto-error">
                    <strong>No fue posible cargar los recursos del proyecto.</strong>
                    <span>La página principal sigue disponible desde “Abrir trabajo”.</span>
                </div>
            `;
        }
    }

    async function obtenerRecursosProyecto(info, trabajo) {
        if (cacheProyecto.has(info.raiz)) {
            return cacheProyecto.get(info.raiz);
        }

        const cacheLocal = leerCacheProyecto(info.raiz);
        if (cacheLocal) {
            cacheProyecto.set(info.raiz, cacheLocal);
            return cacheLocal;
        }

        try {
            const recursos = await consultarRecursosGitHub(info);
            if (recursos.length > 0) {
                cacheProyecto.set(info.raiz, recursos);
                guardarCacheProyecto(info.raiz, recursos);
                return recursos;
            }
        } catch (error) {
            console.warn(
                "PW Hub: se utilizará el inventario local del proyecto.",
                error
            );
        }

        const fallback = obtenerRecursosFallback(info, trabajo);
        cacheProyecto.set(info.raiz, fallback);
        return fallback;
    }

    async function consultarRecursosGitHub(info) {
        const datos = await obtenerArbolGitHub();
        const prefijo = `${RAIZ_ALUMNO}/${info.raiz}`;

        return datos.tree
            .filter(
                (elemento) =>
                    elemento?.type === "blob" &&
                    typeof elemento.path === "string" &&
                    elemento.path.startsWith(prefijo)
            )
            .map((elemento) => {
                const rutaAlumno = elemento.path.slice(
                    RAIZ_ALUMNO.length + 1
                );
                return crearRecurso(rutaAlumno, info);
            })
            .sort((a, b) =>
                compararRecursos(a, b, info.principal)
            );
    }

    async function obtenerArbolGitHub() {
        if (!promesaArbolGitHub) {
            const url =
                `https://api.github.com/repos/${REPOSITORIO}/` +
                `git/trees/${encodeURIComponent(RAMA)}?recursive=1`;

            promesaArbolGitHub = fetch(url, {
                headers: { Accept: "application/vnd.github+json" },
                cache: "no-store"
            })
                .then(async (respuesta) => {
                    if (!respuesta.ok) {
                        throw new Error(`GitHub respondió ${respuesta.status}`);
                    }
                    const datos = await respuesta.json();
                    if (!Array.isArray(datos.tree)) {
                        throw new Error("GitHub no devolvió un árbol válido.");
                    }
                    return datos;
                })
                .catch((error) => {
                    promesaArbolGitHub = null;
                    throw error;
                });
        }

        return promesaArbolGitHub;
    }

    function obtenerRecursosFallback(info, trabajo) {
        const rutas =
            FALLBACKS[info.raiz] ||
            [info.principal.slice(info.raiz.length)];

        const recursos = rutas.map((rutaInterna) =>
            crearRecurso(`${info.raiz}${rutaInterna}`, info)
        );

        const principal = normalizarRutaRelativa(trabajo.ruta);

        if (
            !recursos.some(
                (recurso) =>
                    normalizarRutaRelativa(recurso.ruta) === principal
            )
        ) {
            recursos.unshift(crearRecurso(principal, info));
        }

        return recursos.sort((a, b) =>
            compararRecursos(a, b, info.principal)
        );
    }

    function crearRecurso(rutaAlumno, info) {
        const rutaNormalizada = normalizarRutaRelativa(rutaAlumno);
        const relativaProyecto = rutaNormalizada.startsWith(info.raiz)
            ? rutaNormalizada.slice(info.raiz.length)
            : rutaNormalizada;
        const nombre = relativaProyecto.split("/").pop() || relativaProyecto;
        const tipo = obtenerTipoDesdeRuta(rutaNormalizada);

        return {
            ruta: `../${rutaNormalizada}`,
            rutaAlumno: rutaNormalizada,
            relativa: relativaProyecto,
            nombre,
            tipo,
            categoria: obtenerCategoriaRecurso(relativaProyecto, tipo)
        };
    }

    function construirExploradorProyecto({
        trabajo,
        info,
        recursos,
        contenido,
        abrir,
        token
    }) {
        const grupos = agruparRecursos(recursos);

        contenido.innerHTML = `
            <div class="pw-proyecto-layout">
                <aside class="pw-proyecto-archivos" aria-label="Archivos del proyecto">
                    <div class="pw-proyecto-archivos-cabecera">
                        <div>
                            <span>Proyecto</span>
                            <strong>${recursos.length} ${recursos.length === 1 ? "archivo" : "archivos"}</strong>
                        </div>
                        <code>${escaparHtml(info.carpeta)}</code>
                    </div>

                    <div class="pw-proyecto-lista">
                        ${grupos.map(renderizarGrupoRecursos).join("")}
                    </div>
                </aside>

                <section class="pw-proyecto-panel">
                    <header class="pw-proyecto-toolbar">
                        <div class="pw-proyecto-recurso-actual">
                            <span id="pw-proyecto-tipo-actual">Archivo</span>
                            <strong id="pw-proyecto-nombre-actual">Selecciona un recurso</strong>
                            <code id="pw-proyecto-ruta-actual"></code>
                        </div>

                        <div
                            class="pw-proyecto-modos"
                            id="pw-proyecto-modos"
                            role="group"
                            aria-label="Modo de visualización"
                        ></div>
                    </header>

                    <div
                        class="pw-proyecto-superficie"
                        id="pw-proyecto-superficie"
                    ></div>
                </section>
            </div>
        `;

        const principal =
            recursos.find(
                (recurso) => recurso.rutaAlumno === info.principal
            ) || recursos[0];

        contenido
            .querySelectorAll("[data-pw-recurso]")
            .forEach((boton) => {
                boton.addEventListener("click", () => {
                    const indice = Number(boton.dataset.pwRecurso);
                    const recurso = recursos[indice];
                    if (recurso) {
                        seleccionarRecurso({
                            recurso,
                            recursos,
                            contenido,
                            abrir,
                            token
                        });
                    }
                });
            });

        if (principal) {
            seleccionarRecurso({
                recurso: principal,
                recursos,
                contenido,
                abrir,
                token
            });
        }

        decorarSeleccionProyecto(contenido, principal);
    }

    function agruparRecursos(recursos) {
        return gruposOrden
            .map((categoria) => ({
                categoria,
                recursos: recursos
                    .map((recurso, indice) => ({ ...recurso, indice }))
                    .filter((recurso) => recurso.categoria === categoria)
            }))
            .filter((grupo) => grupo.recursos.length > 0);
    }

    function renderizarGrupoRecursos(grupo) {
        return `
            <section class="pw-proyecto-grupo">
                <h4>${escaparHtml(grupo.categoria)}</h4>
                <div class="pw-proyecto-grupo-lista">
                    ${grupo.recursos.map((recurso) => `
                        <button
                            type="button"
                            class="pw-proyecto-archivo"
                            data-pw-recurso="${recurso.indice}"
                            title="${escaparHtml(recurso.relativa)}"
                        >
                            <span class="pw-proyecto-extension">${escaparHtml(etiquetaTipo(recurso.tipo))}</span>
                            <span class="pw-proyecto-archivo-texto">
                                <strong>${escaparHtml(recurso.nombre)}</strong>
                                <small>${escaparHtml(recurso.relativa)}</small>
                            </span>
                        </button>
                    `).join("")}
                </div>
            </section>
        `;
    }

    async function seleccionarRecurso({
        recurso,
        recursos,
        contenido,
        abrir,
        token
    }) {
        if (token !== tokenProyecto || !contenido.isConnected) return;

        decorarSeleccionProyecto(contenido, recurso);

        const nombre = contenido.querySelector("#pw-proyecto-nombre-actual");
        const ruta = contenido.querySelector("#pw-proyecto-ruta-actual");
        const tipo = contenido.querySelector("#pw-proyecto-tipo-actual");
        const modos = contenido.querySelector("#pw-proyecto-modos");

        if (nombre) nombre.textContent = recurso.nombre;
        if (ruta) ruta.textContent = recurso.relativa;
        if (tipo) tipo.textContent = recurso.categoria;

        const modoInicial = obtenerModoInicial(recurso, recursos);

        construirModosRecurso({
            recurso,
            recursos,
            contenido,
            abrir,
            modos,
            modoInicial,
            token
        });

        await renderizarRecurso({
            recurso,
            recursos,
            contenido,
            abrir,
            modo: modoInicial,
            token
        });
    }

    function construirModosRecurso({
        recurso,
        recursos,
        contenido,
        abrir,
        modos,
        modoInicial,
        token
    }) {
        if (!modos) return;

        const opciones = obtenerModosRecurso(recurso, recursos);

        modos.innerHTML = opciones.length > 1
            ? opciones.map((modo) => `
                <button
                    type="button"
                    class="pw-proyecto-modo ${modo.id === modoInicial ? "activo" : ""}"
                    data-pw-modo="${modo.id}"
                >
                    ${escaparHtml(modo.etiqueta)}
                </button>
            `).join("")
            : "";

        modos.querySelectorAll("[data-pw-modo]").forEach((boton) => {
            boton.addEventListener("click", async () => {
                modos.querySelectorAll(".pw-proyecto-modo").forEach((elemento) => {
                    elemento.classList.toggle("activo", elemento === boton);
                });

                await renderizarRecurso({
                    recurso,
                    recursos,
                    contenido,
                    abrir,
                    modo: boton.dataset.pwModo,
                    token
                });
            });
        });
    }

    async function renderizarRecurso({
        recurso,
        recursos,
        contenido,
        abrir,
        modo,
        token
    }) {
        const superficie = contenido.querySelector("#pw-proyecto-superficie");
        if (!superficie) return;

        superficie.classList.remove("pw-proyecto-superficie-iframe");
        superficie.innerHTML = `
            <div class="pw-proyecto-cargando pw-proyecto-cargando-interno">
                <span class="pw-proyecto-spinner" aria-hidden="true"></span>
                <p>Cargando ${escaparHtml(recurso.nombre)}...</p>
            </div>
        `;

        try {
            const tipo = recurso.tipo;

            if (tipo === "html" || tipo === "pdf") {
                if (modo === "codigo") {
                    await renderizarCodigo(recurso, superficie, token);
                } else {
                    renderizarIframe(recurso, superficie);
                }
            } else if (tipo === "markdown") {
                if (modo === "codigo") {
                    await renderizarCodigo(recurso, superficie, token);
                } else {
                    await renderizarMarkdown(recurso, superficie, token);
                }
            } else if (esImagen(tipo)) {
                renderizarImagen(recurso, superficie);
            } else if (tipo === "drawio") {
                if (modo === "codigo") {
                    await renderizarCodigo(recurso, superficie, token);
                } else if (modo === "png") {
                    const visual = encontrarVisualDrawio(recurso, recursos);
                    if (!visual) {
                        throw new Error(
                            "El archivo Draw.io no tiene una exportación PNG asociada."
                        );
                    }
                    renderizarImagen(visual, superficie);
                } else {
                    await renderizarDrawio(recurso, superficie, token);
                }
            } else {
                await renderizarCodigo(recurso, superficie, token);
            }

            if (token !== tokenProyecto || !contenido.isConnected) return;

            abrir.href = generarRutaVisorRecurso(recurso, modo, recursos);
        } catch (error) {
            console.error(error);
            if (token !== tokenProyecto || !contenido.isConnected) return;

            superficie.innerHTML = `
                <div class="pw-proyecto-error">
                    <strong>No fue posible mostrar este archivo.</strong>
                    <span>${escaparHtml(recurso.relativa)}</span>
                </div>
            `;
        }
    }

    function renderizarIframe(recurso, superficie) {
        superficie.classList.add("pw-proyecto-superficie-iframe");
        superficie.innerHTML = `
            <iframe
                src="${recurso.ruta}"
                class="pw-proyecto-frame"
                title="Vista de ${escaparHtml(recurso.nombre)}"
            ></iframe>
        `;
    }

    function renderizarImagen(recurso, superficie) {
        superficie.innerHTML = "";

        const visor = document.createElement("div");
        visor.className = "pw-proyecto-imagen-visor";
        visor.tabIndex = 0;
        visor.setAttribute(
            "aria-label",
            `Visor ampliable de ${recurso.nombre}`
        );

        const controles = document.createElement("div");
        controles.className = "pw-proyecto-imagen-controles";
        controles.setAttribute("role", "group");
        controles.setAttribute("aria-label", "Controles de la imagen");
        controles.innerHTML = `
            <button type="button" data-pw-imagen-zoom="menos" aria-label="Alejar" title="Alejar">−</button>
            <button type="button" data-pw-imagen-zoom="mas" aria-label="Acercar" title="Acercar">+</button>
            <button type="button" data-pw-imagen-ajustar aria-label="Ajustar imagen" title="Ajustar imagen">Ajustar</button>
            <button type="button" data-pw-imagen-pantalla aria-label="Pantalla completa" title="Pantalla completa">⛶</button>
        `;

        const escenario = document.createElement("div");
        escenario.className = "pw-proyecto-imagen-escenario";

        const imagen = document.createElement("img");
        imagen.className = "pw-proyecto-imagen-zoomable";
        imagen.src = recurso.ruta;
        imagen.alt = recurso.nombre;
        imagen.loading = "eager";
        imagen.draggable = false;

        escenario.appendChild(imagen);
        visor.append(controles, escenario);
        superficie.appendChild(visor);

        const iniciar = () => {
            if (!visor.isConnected) return;
            configurarVisorImagen({ visor, escenario, imagen });
        };

        if (imagen.complete && imagen.naturalWidth > 0) {
            iniciar();
        } else {
            imagen.addEventListener("load", iniciar, { once: true });
        }
    }

    function configurarVisorImagen({ visor, escenario, imagen }) {
        const estado = {
            escala: 1,
            x: 0,
            y: 0,
            arrastrando: false,
            puntero: null,
            inicioX: 0,
            inicioY: 0,
            baseX: 0,
            baseY: 0,
            autoAjuste: true,
            pantallaPendiente: false,
            ajusteProgramado: null
        };

        const anchoNatural = Math.max(1, imagen.naturalWidth || 1);
        const altoNatural = Math.max(1, imagen.naturalHeight || 1);

        const aplicar = () => {
            imagen.style.width = `${Math.max(1, anchoNatural * estado.escala)}px`;
            imagen.style.height = "auto";
            imagen.style.left = `calc(50% + ${estado.x}px)`;
            imagen.style.top = `calc(50% + ${estado.y}px)`;
        };

        const calcularAjuste = () => {
            const margen = 40;
            const disponibleX = Math.max(1, escenario.clientWidth - margen);
            const disponibleY = Math.max(1, escenario.clientHeight - margen);
            return Math.min(
                disponibleX / anchoNatural,
                disponibleY / altoNatural,
                1
            );
        };

        const ajustar = () => {
            if (!visor.isConnected) return;
            estado.escala = Math.max(0.03, calcularAjuste());
            estado.x = 0;
            estado.y = 0;
            estado.autoAjuste = true;
            aplicar();
        };

        const programarAjuste = () => {
            if (estado.ajusteProgramado) {
                cancelAnimationFrame(estado.ajusteProgramado);
            }
            estado.ajusteProgramado = requestAnimationFrame(() => {
                estado.ajusteProgramado = requestAnimationFrame(() => {
                    estado.ajusteProgramado = null;
                    ajustar();
                });
            });
        };

        const cambiarZoom = (direccion) => {
            const factor = direccion > 0 ? 1.22 : 1 / 1.22;
            const minimo = Math.max(0.03, calcularAjuste() * 0.45);
            const maximo = 6;
            const nueva = Math.min(
                maximo,
                Math.max(minimo, estado.escala * factor)
            );
            if (Math.abs(nueva - estado.escala) < 0.0001) return;
            estado.escala = nueva;
            estado.autoAjuste = false;
            aplicar();
        };

        visor
            .querySelector('[data-pw-imagen-zoom="menos"]')
            ?.addEventListener("click", () => cambiarZoom(-1));
        visor
            .querySelector('[data-pw-imagen-zoom="mas"]')
            ?.addEventListener("click", () => cambiarZoom(1));
        visor
            .querySelector("[data-pw-imagen-ajustar]")
            ?.addEventListener("click", programarAjuste);

        const botonPantalla = visor.querySelector("[data-pw-imagen-pantalla]");

        botonPantalla?.addEventListener("click", async () => {
            if (estado.pantallaPendiente) return;
            estado.pantallaPendiente = true;
            botonPantalla.disabled = true;

            try {
                if (document.fullscreenElement === visor) {
                    await document.exitFullscreen();
                } else if (typeof visor.requestFullscreen === "function") {
                    await visor.requestFullscreen();
                } else {
                    visor.classList.toggle("pw-proyecto-imagen-pantalla-fallback");
                    programarAjuste();
                }
            } catch (error) {
                console.warn(
                    "PW Hub: no fue posible cambiar el modo de pantalla completa de la imagen.",
                    error
                );
            } finally {
                estado.pantallaPendiente = false;
                botonPantalla.disabled = false;
            }
        });

        escenario.addEventListener("pointerdown", (evento) => {
            if (evento.button !== 0) return;
            estado.arrastrando = true;
            estado.puntero = evento.pointerId;
            estado.inicioX = evento.clientX;
            estado.inicioY = evento.clientY;
            estado.baseX = estado.x;
            estado.baseY = estado.y;
            estado.autoAjuste = false;
            escenario.classList.add("pw-proyecto-imagen-arrastrando");
            escenario.setPointerCapture?.(evento.pointerId);
            evento.preventDefault();
        });

        escenario.addEventListener("pointermove", (evento) => {
            if (
                !estado.arrastrando ||
                evento.pointerId !== estado.puntero
            ) {
                return;
            }

            estado.x = estado.baseX + (evento.clientX - estado.inicioX);
            estado.y = estado.baseY + (evento.clientY - estado.inicioY);
            aplicar();
        });

        const terminarArrastre = (evento) => {
            if (evento.pointerId !== estado.puntero) return;
            estado.arrastrando = false;
            estado.puntero = null;
            escenario.classList.remove("pw-proyecto-imagen-arrastrando");
        };

        escenario.addEventListener("pointerup", terminarArrastre);
        escenario.addEventListener("pointercancel", terminarArrastre);

        visor.addEventListener(
            "wheel",
            (evento) => {
                if (!evento.ctrlKey) return;
                evento.preventDefault();
                cambiarZoom(evento.deltaY < 0 ? 1 : -1);
            },
            { passive: false }
        );

        escenario.addEventListener("dblclick", (evento) => {
            evento.preventDefault();
            cambiarZoom(1);
        });

        let observador = null;

        const alCambiarPantalla = () => {
            if (!visor.isConnected) {
                document.removeEventListener(
                    "fullscreenchange",
                    alCambiarPantalla
                );
                observador?.disconnect();
                return;
            }

            const activo =
                document.fullscreenElement === visor ||
                visor.classList.contains("pw-proyecto-imagen-pantalla-fallback");

            botonPantalla?.classList.toggle("activo", activo);
            botonPantalla?.setAttribute(
                "aria-label",
                activo ? "Salir de pantalla completa" : "Pantalla completa"
            );
            botonPantalla?.setAttribute(
                "title",
                activo ? "Salir de pantalla completa" : "Pantalla completa"
            );
            programarAjuste();
        };

        document.addEventListener("fullscreenchange", alCambiarPantalla);

        if (typeof ResizeObserver === "function") {
            observador = new ResizeObserver(() => {
                if (!visor.isConnected) {
                    observador.disconnect();
                    return;
                }
                if (!estado.arrastrando && estado.autoAjuste) {
                    programarAjuste();
                }
            });
            observador.observe(escenario);
        }

        programarAjuste();
    }

    async function renderizarDrawio(recurso, superficie, token) {
        try {
            const fuente = await cargarFuente(recurso.ruta);
            if (token !== tokenProyecto || !superficie.isConnected) return;

            validarFuenteDrawio(fuente);
            superficie.innerHTML = "";

            const contenedor = document.createElement("div");
            contenedor.className = "pw-proyecto-drawio";

            const aviso = document.createElement("div");
            aviso.className = "pw-proyecto-drawio-aviso";
            aviso.innerHTML = `
                <span>Draw.io</span>
                <p>Diagrama interpretado directamente desde el XML de <code>${escaparHtml(recurso.nombre)}</code>.</p>
            `;

            const lienzo = document.createElement("div");
            lienzo.className = "pw-proyecto-drawio-render";
            lienzo.tabIndex = 0;
            lienzo.setAttribute(
                "aria-label",
                `Lienzo interactivo de ${recurso.nombre}`
            );

            const controles = document.createElement("div");
            controles.className = "pw-proyecto-drawio-controles";
            controles.setAttribute("role", "group");
            controles.setAttribute("aria-label", "Controles del diagrama");
            controles.innerHTML = `
                <button type="button" data-pw-drawio-zoom="menos" aria-label="Alejar" title="Alejar">−</button>
                <button type="button" data-pw-drawio-zoom="mas" aria-label="Acercar" title="Acercar">+</button>
                <button type="button" data-pw-drawio-ajustar aria-label="Ajustar diagrama" title="Ajustar diagrama">Ajustar</button>
                <button type="button" data-pw-drawio-pantalla aria-label="Pantalla completa" title="Pantalla completa">⛶</button>
            `;

            const escenario = document.createElement("div");
            escenario.className = "pw-proyecto-drawio-escenario";

            const grafico = document.createElement("div");
            grafico.className = "mxgraph pw-proyecto-drawio-graph";
            grafico.setAttribute(
                "data-mxgraph",
                JSON.stringify({
                    highlight: "#35c9f3",
                    nav: false,
                    lightbox: false,
                    "auto-fit": false,
                    responsive: false,
                    "dark-mode": "auto",
                    xml: fuente
                })
            );

            escenario.appendChild(grafico);
            lienzo.append(controles, escenario);
            contenedor.append(aviso, lienzo);
            superficie.appendChild(contenedor);

            await cargarVisorDrawio();

            if (token !== tokenProyecto || !grafico.isConnected) return;

            if (
                !window.GraphViewer ||
                typeof window.GraphViewer.createViewerForElement !== "function"
            ) {
                throw new Error(
                    "El visor oficial de diagrams.net no quedó disponible."
                );
            }

            const visor = await crearVisorDrawio(grafico);
            if (token !== tokenProyecto || !grafico.isConnected) return;

            configurarLienzoDrawio({ lienzo, escenario, grafico, visor });
        } catch (error) {
            console.warn(
                "PW Hub: no fue posible interpretar el archivo Draw.io.",
                error
            );

            if (token !== tokenProyecto || !superficie.isConnected) return;

            superficie.innerHTML = `
                <div class="pw-proyecto-error pw-proyecto-drawio-error">
                    <strong>No fue posible cargar el visor interactivo de Draw.io.</strong>
                    <span>El archivo sigue disponible en los modos PNG y XML.</span>
                </div>
            `;
        }
    }

    function configurarLienzoDrawio({ lienzo, escenario, grafico, visor }) {
        const graph = visor?.graph;
        if (!graph || !graph.view) {
            throw new Error(
                "El visor de Draw.io no entregó un grafo utilizable."
            );
        }

        graph.useScrollbarsForPanning = false;

        const estado = {
            arrastrando: false,
            puntero: null,
            inicioX: 0,
            inicioY: 0,
            deltaX: 0,
            deltaY: 0,
            translateX: 0,
            translateY: 0,
            pantallaPendiente: false,
            autoAjuste: true,
            ajusteProgramado: null
        };

        const obtenerEscala = () => Number(graph.view?.scale || 1);

        const actualizarDatoZoom = () => {
            grafico.dataset.pwZoom = obtenerEscala().toFixed(3);
        };

        const ajustar = () => {
            if (!lienzo.isConnected || !grafico.isConnected) return;
            graph.panGraph?.(0, 0);
            graph.fit?.(24);
            estado.autoAjuste = true;
            estado.deltaX = 0;
            estado.deltaY = 0;
            actualizarDatoZoom();
        };

        const programarAjuste = () => {
            if (estado.ajusteProgramado) {
                cancelAnimationFrame(estado.ajusteProgramado);
            }
            estado.ajusteProgramado = requestAnimationFrame(() => {
                estado.ajusteProgramado = requestAnimationFrame(() => {
                    estado.ajusteProgramado = null;
                    ajustar();
                });
            });
        };

        const cambiarZoom = (direccion) => {
            const escala = obtenerEscala();
            if (direccion > 0 && escala >= 4) return;
            if (direccion < 0 && escala <= 0.12) return;

            estado.autoAjuste = false;
            graph.panGraph?.(0, 0);
            if (direccion > 0) graph.zoomIn?.();
            else graph.zoomOut?.();
            actualizarDatoZoom();
        };

        lienzo
            .querySelector('[data-pw-drawio-zoom="menos"]')
            ?.addEventListener("click", () => cambiarZoom(-1));
        lienzo
            .querySelector('[data-pw-drawio-zoom="mas"]')
            ?.addEventListener("click", () => cambiarZoom(1));
        lienzo
            .querySelector("[data-pw-drawio-ajustar]")
            ?.addEventListener("click", programarAjuste);

        const botonPantalla = lienzo.querySelector("[data-pw-drawio-pantalla]");

        botonPantalla?.addEventListener("click", async () => {
            if (estado.pantallaPendiente) return;
            estado.pantallaPendiente = true;
            botonPantalla.disabled = true;

            try {
                if (document.fullscreenElement === lienzo) {
                    await document.exitFullscreen();
                } else if (typeof lienzo.requestFullscreen === "function") {
                    await lienzo.requestFullscreen();
                } else {
                    lienzo.classList.toggle(
                        "pw-proyecto-drawio-pantalla-fallback"
                    );
                    programarAjuste();
                }
            } catch (error) {
                console.warn(
                    "PW Hub: no fue posible cambiar el modo de pantalla completa.",
                    error
                );
            } finally {
                estado.pantallaPendiente = false;
                botonPantalla.disabled = false;
            }
        });

        lienzo.addEventListener("pointerdown", (evento) => {
            if (
                evento.button !== 0 ||
                evento.target.closest(".pw-proyecto-drawio-controles")
            ) {
                return;
            }

            const vista = graph.getView?.() || graph.view;
            estado.arrastrando = true;
            estado.autoAjuste = false;
            estado.puntero = evento.pointerId;
            estado.inicioX = evento.clientX;
            estado.inicioY = evento.clientY;
            estado.deltaX = 0;
            estado.deltaY = 0;
            estado.translateX = Number(vista.translate?.x || 0);
            estado.translateY = Number(vista.translate?.y || 0);

            lienzo.classList.add("pw-proyecto-drawio-arrastrando");
            lienzo.setPointerCapture?.(evento.pointerId);
            evento.preventDefault();
        });

        lienzo.addEventListener("pointermove", (evento) => {
            if (
                !estado.arrastrando ||
                evento.pointerId !== estado.puntero
            ) {
                return;
            }

            estado.deltaX = evento.clientX - estado.inicioX;
            estado.deltaY = evento.clientY - estado.inicioY;
            graph.panGraph?.(estado.deltaX, estado.deltaY);
        });

        const terminarArrastre = (evento) => {
            if (evento.pointerId !== estado.puntero) return;

            const vista = graph.getView?.() || graph.view;
            const escala = Number(vista.scale || 1) || 1;

            graph.panGraph?.(0, 0);
            vista.setTranslate?.(
                estado.translateX + estado.deltaX / escala,
                estado.translateY + estado.deltaY / escala
            );

            estado.arrastrando = false;
            estado.puntero = null;
            estado.deltaX = 0;
            estado.deltaY = 0;
            lienzo.classList.remove("pw-proyecto-drawio-arrastrando");
        };

        lienzo.addEventListener("pointerup", terminarArrastre);
        lienzo.addEventListener("pointercancel", terminarArrastre);

        lienzo.addEventListener(
            "wheel",
            (evento) => {
                if (!evento.ctrlKey) return;
                evento.preventDefault();
                cambiarZoom(evento.deltaY < 0 ? 1 : -1);
            },
            { passive: false }
        );

        let observador = null;

        const limpiarControladores = () => {
            document.removeEventListener(
                "fullscreenchange",
                alCambiarPantalla
            );
            observador?.disconnect();
            if (estado.ajusteProgramado) {
                cancelAnimationFrame(estado.ajusteProgramado);
                estado.ajusteProgramado = null;
            }
        };

        const alCambiarPantalla = () => {
            if (!lienzo.isConnected) {
                limpiarControladores();
                return;
            }

            const activo =
                document.fullscreenElement === lienzo ||
                lienzo.classList.contains(
                    "pw-proyecto-drawio-pantalla-fallback"
                );

            botonPantalla?.classList.toggle("activo", activo);
            botonPantalla?.setAttribute(
                "aria-label",
                activo ? "Salir de pantalla completa" : "Pantalla completa"
            );
            botonPantalla?.setAttribute(
                "title",
                activo ? "Salir de pantalla completa" : "Pantalla completa"
            );

            programarAjuste();
        };

        document.addEventListener("fullscreenchange", alCambiarPantalla);

        if (typeof ResizeObserver === "function") {
            observador = new ResizeObserver(() => {
                if (!lienzo.isConnected) {
                    limpiarControladores();
                    return;
                }
                if (!estado.arrastrando && estado.autoAjuste) {
                    programarAjuste();
                }
            });
            observador.observe(escenario);
        }

        programarAjuste();
    }

    function crearVisorDrawio(grafico) {
        return new Promise((resolver, rechazar) => {
            let terminado = false;
            const temporizador = setTimeout(() => {
                if (terminado) return;
                terminado = true;
                rechazar(
                    new Error(
                        "El visor de Draw.io no terminó de crear el diagrama."
                    )
                );
            }, 5000);

            try {
                window.GraphViewer.createViewerForElement(grafico, (visor) => {
                    if (terminado) return;
                    terminado = true;
                    clearTimeout(temporizador);
                    resolver(visor);
                });
            } catch (error) {
                clearTimeout(temporizador);
                rechazar(error);
            }
        });
    }

    function validarFuenteDrawio(fuente) {
        const documento = new DOMParser().parseFromString(
            fuente,
            "application/xml"
        );

        if (documento.querySelector("parsererror")) {
            throw new Error("El archivo Draw.io contiene XML no válido.");
        }

        const raiz = documento.documentElement?.tagName?.toLowerCase();
        if (raiz !== "mxfile" && raiz !== "mxgraphmodel") {
            throw new Error(
                "El XML no corresponde a un diagrama Draw.io compatible."
            );
        }
    }

    async function cargarVisorDrawio() {
        if (
            window.GraphViewer &&
            typeof window.GraphViewer.createViewerForElement === "function"
        ) {
            return;
        }

        if (promesaVisorDrawio) return promesaVisorDrawio;

        promesaVisorDrawio = new Promise((resolver, rechazar) => {
            let terminado = false;
            let temporizador = null;

            const finalizar = (error = null) => {
                if (terminado) return;
                terminado = true;
                if (temporizador) clearTimeout(temporizador);
                if (error) rechazar(error);
                else resolver();
            };

            const verificar = () => {
                if (
                    window.GraphViewer &&
                    typeof window.GraphViewer.createViewerForElement ===
                        "function"
                ) {
                    finalizar();
                } else {
                    finalizar(
                        new Error(
                            "El visor oficial de diagrams.net no expuso GraphViewer."
                        )
                    );
                }
            };

            let script = document.querySelector(
                "script[data-pw-drawio-viewer]"
            );

            if (!script) {
                window.onDrawioViewerLoad = verificar;
                script = document.createElement("script");
                script.src = DRAWIO_VIEWER_URL;
                script.async = true;
                script.dataset.pwDrawioViewer = VERSION;
                document.head.appendChild(script);
            }

            script.addEventListener("load", verificar, { once: true });
            script.addEventListener(
                "error",
                () =>
                    finalizar(
                        new Error(
                            "No fue posible descargar el visor oficial de diagrams.net."
                        )
                    ),
                { once: true }
            );

            temporizador = setTimeout(
                () =>
                    finalizar(
                        new Error(
                            "El visor de Draw.io excedió el tiempo de espera."
                        )
                    ),
                DRAWIO_VIEWER_TIMEOUT
            );

            if (
                window.GraphViewer &&
                typeof window.GraphViewer.createViewerForElement === "function"
            ) {
                finalizar();
            }
        }).catch((error) => {
            promesaVisorDrawio = null;
            throw error;
        });

        return promesaVisorDrawio;
    }

    async function renderizarCodigo(recurso, superficie, token) {
        let fuente = await cargarFuente(recurso.ruta);
        if (token !== tokenProyecto) return;

        if (recurso.tipo === "json") {
            try {
                fuente = JSON.stringify(JSON.parse(fuente), null, 2);
            } catch {
                // Conserva el original.
            }
        }

        const pre = document.createElement("pre");
        pre.className = "pw-proyecto-codigo";
        const code = document.createElement("code");
        code.textContent = fuente;
        pre.appendChild(code);
        superficie.innerHTML = "";
        superficie.appendChild(pre);
    }

    async function renderizarMarkdown(recurso, superficie, token) {
        const fuente = await cargarFuente(recurso.ruta);
        if (token !== tokenProyecto) return;

        superficie.innerHTML = `
            <article class="pw-proyecto-markdown">
                ${
                    window.marked
                        ? marked.parse(fuente)
                        : `<pre>${escaparHtml(fuente)}</pre>`
                }
            </article>
        `;
    }

    async function cargarFuente(ruta) {
        if (cacheFuente.has(ruta)) return cacheFuente.get(ruta);

        const respuesta = await fetch(ruta, { cache: "no-cache" });
        if (!respuesta.ok) {
            throw new Error(`No fue posible cargar ${ruta}`);
        }

        const contenido = await respuesta.text();
        cacheFuente.set(ruta, contenido);
        return contenido;
    }

    function obtenerModosRecurso(recurso, recursos) {
        if (recurso.tipo === "html") {
            return [
                { id: "diseno", etiqueta: "Diseño" },
                { id: "codigo", etiqueta: "Código HTML" }
            ];
        }

        if (recurso.tipo === "markdown") {
            return [
                { id: "diseno", etiqueta: "Vista" },
                { id: "codigo", etiqueta: "Markdown" }
            ];
        }

        if (recurso.tipo === "drawio") {
            const tieneVisual = Boolean(
                encontrarVisualDrawio(recurso, recursos)
            );
            const modos = [{ id: "diagrama", etiqueta: "Diagrama" }];
            if (tieneVisual) modos.push({ id: "png", etiqueta: "PNG" });
            modos.push({ id: "codigo", etiqueta: "XML" });
            return modos;
        }

        return [];
    }

    function obtenerModoInicial(recurso) {
        if (
            recurso.tipo === "html" ||
            recurso.tipo === "markdown" ||
            recurso.tipo === "pdf" ||
            esImagen(recurso.tipo)
        ) {
            return "diseno";
        }

        if (recurso.tipo === "drawio") return "diagrama";
        return "codigo";
    }

    function encontrarVisualDrawio(recurso, recursos) {
        const ruta = recurso.rutaAlumno;
        const punto = ruta.lastIndexOf(".");
        const base = punto >= 0 ? ruta.slice(0, punto) : ruta;
        const extensiones = ["png", "svg", "jpg", "jpeg", "webp"];

        return (
            recursos.find((candidato) =>
                extensiones.some(
                    (extension) =>
                        candidato.rutaAlumno.toLowerCase() ===
                        `${base}.${extension}`.toLowerCase()
                )
            ) || null
        );
    }

    function generarRutaVisorRecurso(
        recurso,
        modo = "diseno",
        recursos = []
    ) {
        let destino = recurso;

        if (recurso.tipo === "drawio" && modo === "png") {
            destino = encontrarVisualDrawio(recurso, recursos) || recurso;
        }

        const rutaAbsoluta = new URL(
            destino.ruta || "",
            window.location.href
        ).href;

        const parametros = new URLSearchParams({
            archivo: rutaAbsoluta,
            tipo: destino.tipo || obtenerTipoDesdeRuta(destino.ruta),
            titulo: destino.nombre || "Recurso"
        });

        return `vistas/trabajo.html?${parametros.toString()}`;
    }

    function decorarSeleccionProyecto(contenido, recurso) {
        if (!recurso) return;

        contenido.querySelectorAll("[data-pw-recurso]").forEach((boton) => {
            const texto = boton.querySelector("small")?.textContent || "";
            boton.classList.toggle("activo", texto === recurso.relativa);
        });
    }

    function decorarTarjetasProyecto() {
        decorarTarjetasExplorador();
        decorarTarjetasUnidad();
    }

    function decorarTarjetasExplorador() {
        document.querySelectorAll(".trabajo-explorador").forEach((tarjeta) => {
            const boton = tarjeta.querySelector("[data-trabajo-preview]");
            if (!boton) return;

            let trabajo = null;
            try {
                if (
                    typeof trabajosRegistrados !== "undefined" &&
                    Array.isArray(trabajosRegistrados)
                ) {
                    trabajo =
                        trabajosRegistrados.find(
                            (elemento) =>
                                elemento.id === boton.dataset.trabajoPreview
                        ) || null;
                }
            } catch {
                trabajo = null;
            }

            if (!esProyectoCarpeta(trabajo)) return;
            boton.textContent = "Explorar archivos";
            agregarBadgeProyecto(tarjeta.querySelector(".trabajo-tipo"));
        });
    }

    function decorarTarjetasUnidad() {
        document.querySelectorAll(".unidad-trabajo").forEach((tarjeta) => {
            const enlace = tarjeta.querySelector("[data-unidad-abrir-trabajo]");
            const boton = tarjeta.querySelector("[data-unidad-vista-previa]");
            if (!enlace || !boton) return;

            const trabajo = obtenerTrabajoDesdeEnlace(enlace);
            if (!esProyectoCarpeta(trabajo)) return;

            boton.textContent = "Explorar archivos";
            agregarBadgeProyecto(tarjeta.querySelector(".unidad-trabajo-tipo"));
        });
    }

    function obtenerTrabajoDesdeEnlace(enlace) {
        try {
            const url = new URL(enlace.href, window.location.href);
            const archivo = url.searchParams.get("archivo");
            if (!archivo) return null;

            const archivoUrl = new URL(archivo);
            const baseAlumno = new URL("../", window.location.href);
            let ruta = decodeURIComponent(archivoUrl.pathname);
            const base = decodeURIComponent(baseAlumno.pathname);
            if (ruta.startsWith(base)) ruta = ruta.slice(base.length);

            return { ruta: `../${ruta.replace(/^\/+/, "")}` };
        } catch {
            return null;
        }
    }

    function agregarBadgeProyecto(contenedor) {
        if (!contenedor || contenedor.querySelector(".pw-proyecto-badge")) {
            return;
        }

        const badge = document.createElement("span");
        badge.className = "pw-proyecto-badge";
        badge.textContent = "Proyecto";
        contenedor.appendChild(badge);
    }

    function observarTarjetasProyecto() {
        if (!document.body) return;

        let pendiente = null;
        const observador = new MutationObserver(() => {
            if (pendiente) clearTimeout(pendiente);
            pendiente = setTimeout(() => {
                pendiente = null;
                decorarTarjetasProyecto();
            }, 80);
        });

        observador.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function obtenerCategoriaRecurso(ruta, tipo) {
        const rutaMinusculas = String(ruta).toLowerCase();

        if (tipo === "html" || tipo === "markdown") return "Página";

        if (["css", "js", "json", "txt", "xml"].includes(tipo)) {
            return "Código";
        }

        if (
            tipo === "drawio" ||
            rutaMinusculas.startsWith("diseno/") ||
            rutaMinusculas.startsWith("diseño/")
        ) {
            return "Diseño";
        }

        if (esImagen(tipo)) return "Imágenes";
        if (tipo === "pdf") return "Documentos";
        return "Otros";
    }

    function compararRecursos(a, b, principal) {
        if (a.rutaAlumno === principal) return -1;
        if (b.rutaAlumno === principal) return 1;

        const grupoA = gruposOrden.indexOf(a.categoria);
        const grupoB = gruposOrden.indexOf(b.categoria);
        if (grupoA !== grupoB) return grupoA - grupoB;

        return a.relativa.localeCompare(b.relativa, "es", {
            numeric: true,
            sensitivity: "base"
        });
    }

    function obtenerTipoDesdeRuta(ruta) {
        const limpia = String(ruta || "").split(/[?#]/)[0];
        const extension = limpia.includes(".")
            ? limpia.split(".").pop().toLowerCase()
            : "archivo";
        const mapa = { htm: "html", md: "markdown", jpeg: "jpeg" };
        return mapa[extension] || extension;
    }

    function etiquetaTipo(tipo) {
        const mapa = {
            html: "HTML",
            markdown: "MD",
            css: "CSS",
            js: "JS",
            json: "JSON",
            txt: "TXT",
            xml: "XML",
            drawio: "DRAWIO",
            png: "PNG",
            jpg: "JPG",
            jpeg: "JPEG",
            webp: "WEBP",
            svg: "SVG",
            gif: "GIF",
            pdf: "PDF"
        };

        return mapa[tipo] || String(tipo || "FILE").toUpperCase();
    }

    function esImagen(tipo) {
        return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(tipo);
    }

    function normalizarRutaRelativa(ruta) {
        let valor = String(ruta || "")
            .replace(/\\/g, "/")
            .split(/[?#]/)[0]
            .trim();

        try {
            valor = decodeURIComponent(valor);
        } catch {
            // Conserva la ruta original.
        }

        while (valor.startsWith("../")) valor = valor.slice(3);
        while (valor.startsWith("./")) valor = valor.slice(2);
        return valor.replace(/^\/+/, "");
    }

    function leerCacheProyecto(raiz) {
        try {
            const texto = localStorage.getItem(CLAVE_CACHE);
            if (!texto) return null;

            const datos = JSON.parse(texto);
            const entrada = datos?.[raiz];
            if (
                !entrada ||
                !Array.isArray(entrada.recursos) ||
                Date.now() - Number(entrada.actualizado || 0) > VIGENCIA_CACHE
            ) {
                return null;
            }

            return entrada.recursos;
        } catch {
            return null;
        }
    }

    function guardarCacheProyecto(raiz, recursos) {
        try {
            const texto = localStorage.getItem(CLAVE_CACHE);
            const datos = texto ? JSON.parse(texto) : {};
            datos[raiz] = { actualizado: Date.now(), recursos };
            localStorage.setItem(CLAVE_CACHE, JSON.stringify(datos));
        } catch {
            // El caché del explorador es opcional.
        }
    }

    function escaparHtml(texto) {
        const div = document.createElement("div");
        div.textContent = String(texto ?? "");
        return div.innerHTML;
    }
})();
