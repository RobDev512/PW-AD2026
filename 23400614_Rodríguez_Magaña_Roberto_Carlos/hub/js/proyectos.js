/*
    =========================================================
    PW HUB v1.2.2 - PROYECTOS POR CARPETAS
    =========================================================

    Mantiene las actividades de U1, U2 y U3 agrupadas como proyectos y
    permite explorar sus recursos sin convertir cada archivo interno
    en un trabajo independiente.
*/

(() => {
    "use strict";

    const VERSION = "1.2.2";
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
    // Una lectura por render. El árbol se comparte con el explorador de archivos.
    const cuadriculasAutoRevisadas = new WeakSet();
    const archivosInicialesPorUnidad = new Map();


    const FALLBACKS = {
        "U1/catalogo-peliculas/": [
            "README.md",
            "ciencia-ficcion.txt",
            "comedia.txt"
        ],
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
        ],
        "U3/U3. A7 - Netflix/": [
            "Netflix - U3A7.html",
            "css/styles.css",
            "img/hero-background.jpg",
            "img/netflix-logo.png",
            "img/netflix-logo2.png"
        ],
        "U3/U3. A8 - Google/": [
            "Google - U3A8.html",
            "css/styles.css",
            "img/Google_icon.png"
        ],
        "U3/U3. A9 - Nexo/": [
            "Nexo - U3A9.html",
            "css/styles.css",
            "img/LogoIttepic.png",
            "img/background.jpg",
            "img/logoNexo.png",
            "img/logosTec.png",
            "svg/Contraseña.svg",
            "svg/Correo.svg",
            "svg/Ingresar.svg"
        ],
        "U3/U3. A10 - Netflix 2/": [
            "Netflix2 - U3A10.html",
            "css/styles.css",
            "img/Pelicula1.png",
            "img/Pelicula2.png",
            "img/Pelicula3.png",
            "img/Pelicula4.png",
            "img/Pelicula5.png",
            "img/Pelicula6.png",
            "img/netflix-logo.png",
            "img/netflix-logo2.png"
        ],
        "U4/U4. A1. Tarea 1/": [
            "U4. A1. Tarea 1.pdf",
            "U4. A1. Tarea 1.PNG",
            "U4. A1. Tarea 1.pptx"
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
            if (esScriptU4(trabajo)) {
                return mostrarVistaPreviaScriptU4(trabajo);
            }
            const abrirNormal = document.getElementById("trabajos-visor-abrir");
            if (abrirNormal) abrirNormal.textContent = "Abrir trabajo";

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

        if (esScriptU4(trabajo)) {
            evento.preventDefault();
            evento.stopImmediatePropagation();
            mostrarVistaPreviaScriptU4(trabajo);
            return;
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
        const coincidencia = ruta.match(/^U([1-5])\/(.+)\/([^/]+)$/i);
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
        // El enlace pudo quedar renombrado por la vista previa anterior de JS.
        abrir.textContent = "Abrir trabajo";
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

        // En la tarea de U4, el PNG es la ruta del catálogo para mantener
        // la tarjeta visible antes del push; al explorar se abre primero el PDF.
        const principal = (
            info.unidad === 4 && info.carpeta === "U4. A1. Tarea 1"
                ? recursos.find((recurso) => recurso.tipo === "pdf")
                : null
        ) || recursos.find(
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

        if (typeof superficie.pwPptxCleanup === "function") superficie.pwPptxCleanup();
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
            } else if (tipo === "pptx") {
                await renderizarPresentacion(recurso, superficie, token);
            } else if (tipo === "ppt") {
                throw new Error("Para mostrar diapositivas se necesita un archivo PPTX.");
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

    async function renderizarPresentacion(recurso, superficie, token) {
        const modulo = await import(new URL("js/visor-pptx.js", document.baseURI).href);
        if (token !== tokenProyecto || !superficie.isConnected) return;
        await modulo.montarVisorPptx({
            ruta: recurso.ruta,
            nombre: recurso.nombre,
            contenedor: superficie,
            vigente: () => token === tokenProyecto && !document.getElementById("trabajos-visor")?.hidden
        });
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
            punteros: new Map(),
            gestoPinza: null,
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

        const limitarEscala = (escala) => {
            const minimo = Math.max(0.03, calcularAjuste() * 0.45);
            return Math.min(6, Math.max(minimo, escala));
        };

        const ajustar = () => {
            if (!visor.isConnected) return;
            estado.escala = Math.max(0.03, calcularAjuste());
            estado.x = 0;
            estado.y = 0;
            estado.autoAjuste = true;
            estado.gestoPinza = null;
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
            const nueva = limitarEscala(estado.escala * factor);
            if (Math.abs(nueva - estado.escala) < 0.0001) return;
            estado.escala = nueva;
            estado.autoAjuste = false;
            aplicar();
        };

        const obtenerDosPunteros = () =>
            Array.from(estado.punteros.values()).slice(0, 2);

        const medirPinza = () => {
            const [a, b] = obtenerDosPunteros();
            if (!a || !b) return null;
            return {
                distancia: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
                centroX: (a.x + b.x) / 2,
                centroY: (a.y + b.y) / 2
            };
        };

        const iniciarPinza = () => {
            const medida = medirPinza();
            if (!medida) return;

            const rect = escenario.getBoundingClientRect();
            const centroLocalX = medida.centroX - rect.left;
            const centroLocalY = medida.centroY - rect.top;

            estado.gestoPinza = {
                distancia: medida.distancia,
                escala: estado.escala,
                centroX: centroLocalX,
                centroY: centroLocalY,
                imagenX: escenario.clientWidth / 2 + estado.x,
                imagenY: escenario.clientHeight / 2 + estado.y
            };
            estado.arrastrando = false;
            estado.puntero = null;
            estado.autoAjuste = false;
            escenario.classList.remove("pw-proyecto-imagen-arrastrando");
        };

        const actualizarPinza = () => {
            const medida = medirPinza();
            const base = estado.gestoPinza;
            if (!medida || !base) return;

            const rect = escenario.getBoundingClientRect();
            const centroX = medida.centroX - rect.left;
            const centroY = medida.centroY - rect.top;
            const nuevaEscala = limitarEscala(
                base.escala * (medida.distancia / base.distancia)
            );
            const relacion = nuevaEscala / base.escala;

            const imagenX =
                centroX - (base.centroX - base.imagenX) * relacion;
            const imagenY =
                centroY - (base.centroY - base.imagenY) * relacion;

            estado.escala = nuevaEscala;
            estado.x = imagenX - escenario.clientWidth / 2;
            estado.y = imagenY - escenario.clientHeight / 2;
            estado.autoAjuste = false;
            aplicar();
        };

        const iniciarArrastreCon = (puntero) => {
            if (!puntero) return;
            estado.arrastrando = true;
            estado.puntero = puntero.id;
            estado.inicioX = puntero.x;
            estado.inicioY = puntero.y;
            estado.baseX = estado.x;
            estado.baseY = estado.y;
            estado.autoAjuste = false;
            escenario.classList.add("pw-proyecto-imagen-arrastrando");
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
            if (evento.pointerType !== "touch" && evento.button !== 0) return;

            estado.punteros.set(evento.pointerId, {
                id: evento.pointerId,
                x: evento.clientX,
                y: evento.clientY
            });
            escenario.setPointerCapture?.(evento.pointerId);

            if (estado.punteros.size >= 2) {
                iniciarPinza();
            } else {
                iniciarArrastreCon(estado.punteros.get(evento.pointerId));
            }

            evento.preventDefault();
        });

        escenario.addEventListener("pointermove", (evento) => {
            if (!estado.punteros.has(evento.pointerId)) return;

            estado.punteros.set(evento.pointerId, {
                id: evento.pointerId,
                x: evento.clientX,
                y: evento.clientY
            });

            if (estado.punteros.size >= 2) {
                if (!estado.gestoPinza) iniciarPinza();
                actualizarPinza();
                evento.preventDefault();
                return;
            }

            if (
                estado.arrastrando &&
                evento.pointerId === estado.puntero
            ) {
                estado.x = estado.baseX + (evento.clientX - estado.inicioX);
                estado.y = estado.baseY + (evento.clientY - estado.inicioY);
                aplicar();
                evento.preventDefault();
            }
        });

        const terminarPuntero = (evento) => {
            if (!estado.punteros.has(evento.pointerId)) return;

            estado.punteros.delete(evento.pointerId);
            try {
                escenario.releasePointerCapture?.(evento.pointerId);
            } catch {
                // El navegador puede liberar la captura automáticamente.
            }

            if (estado.punteros.size >= 2) {
                iniciarPinza();
                return;
            }

            estado.gestoPinza = null;

            if (estado.punteros.size === 1) {
                iniciarArrastreCon(Array.from(estado.punteros.values())[0]);
                return;
            }

            estado.arrastrando = false;
            estado.puntero = null;
            escenario.classList.remove("pw-proyecto-imagen-arrastrando");
        };

        escenario.addEventListener("pointerup", terminarPuntero);
        escenario.addEventListener("pointercancel", terminarPuntero);

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
                if (
                    !estado.arrastrando &&
                    !estado.gestoPinza &&
                    estado.autoAjuste
                ) {
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
            punteros: new Map(),
            gestoPinza: null,
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

        const obtenerVista = () => graph.getView?.() || graph.view;
        const obtenerEscala = () => Number(obtenerVista()?.scale || 1);
        const limitarEscala = (escala) => Math.min(4, Math.max(0.12, escala));

        const actualizarDatoZoom = () => {
            grafico.dataset.pwZoom = obtenerEscala().toFixed(3);
        };

        const aplicarEscalaYTraslacion = (escala, x, y) => {
            const vista = obtenerVista();
            graph.panGraph?.(0, 0);

            if (typeof vista.scaleAndTranslate === "function") {
                vista.scaleAndTranslate(escala, x, y);
            } else {
                vista.setScale?.(escala);
                vista.setTranslate?.(x, y);
            }

            actualizarDatoZoom();
        };

        const ajustar = () => {
            if (!lienzo.isConnected || !grafico.isConnected) return;
            graph.panGraph?.(0, 0);
            graph.fit?.(24);
            estado.autoAjuste = true;
            estado.deltaX = 0;
            estado.deltaY = 0;
            estado.gestoPinza = null;
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

        const consolidarArrastre = () => {
            if (!estado.arrastrando) return;
            const vista = obtenerVista();
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

        const iniciarArrastreCon = (puntero) => {
            if (!puntero) return;
            const vista = obtenerVista();

            estado.arrastrando = true;
            estado.puntero = puntero.id;
            estado.inicioX = puntero.x;
            estado.inicioY = puntero.y;
            estado.translateX = Number(vista.translate?.x || 0);
            estado.translateY = Number(vista.translate?.y || 0);
            estado.deltaX = 0;
            estado.deltaY = 0;
            estado.autoAjuste = false;
            lienzo.classList.add("pw-proyecto-drawio-arrastrando");
        };

        const obtenerDosPunteros = () =>
            Array.from(estado.punteros.values()).slice(0, 2);

        const medirPinza = () => {
            const [a, b] = obtenerDosPunteros();
            if (!a || !b) return null;
            return {
                distancia: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
                centroX: (a.x + b.x) / 2,
                centroY: (a.y + b.y) / 2
            };
        };

        const iniciarPinza = () => {
            const medida = medirPinza();
            if (!medida) return;

            consolidarArrastre();

            const vista = obtenerVista();
            const escala = Number(vista.scale || 1) || 1;
            const rect = escenario.getBoundingClientRect();
            const centroX = medida.centroX - rect.left;
            const centroY = medida.centroY - rect.top;
            const translateX = Number(vista.translate?.x || 0);
            const translateY = Number(vista.translate?.y || 0);

            estado.gestoPinza = {
                distancia: medida.distancia,
                escala,
                graficoX: centroX / escala - translateX,
                graficoY: centroY / escala - translateY
            };
            estado.autoAjuste = false;
        };

        const actualizarPinza = () => {
            const medida = medirPinza();
            const base = estado.gestoPinza;
            if (!medida || !base) return;

            const rect = escenario.getBoundingClientRect();
            const centroX = medida.centroX - rect.left;
            const centroY = medida.centroY - rect.top;
            const escala = limitarEscala(
                base.escala * (medida.distancia / base.distancia)
            );
            const translateX = centroX / escala - base.graficoX;
            const translateY = centroY / escala - base.graficoY;

            aplicarEscalaYTraslacion(escala, translateX, translateY);
            estado.autoAjuste = false;
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
                evento.target.closest(".pw-proyecto-drawio-controles") ||
                (evento.pointerType !== "touch" && evento.button !== 0)
            ) {
                return;
            }

            estado.punteros.set(evento.pointerId, {
                id: evento.pointerId,
                x: evento.clientX,
                y: evento.clientY
            });
            lienzo.setPointerCapture?.(evento.pointerId);

            if (estado.punteros.size >= 2) {
                iniciarPinza();
            } else {
                iniciarArrastreCon(estado.punteros.get(evento.pointerId));
            }

            evento.preventDefault();
        });

        lienzo.addEventListener("pointermove", (evento) => {
            if (!estado.punteros.has(evento.pointerId)) return;

            estado.punteros.set(evento.pointerId, {
                id: evento.pointerId,
                x: evento.clientX,
                y: evento.clientY
            });

            if (estado.punteros.size >= 2) {
                if (!estado.gestoPinza) iniciarPinza();
                actualizarPinza();
                evento.preventDefault();
                return;
            }

            if (
                estado.arrastrando &&
                evento.pointerId === estado.puntero
            ) {
                estado.deltaX = evento.clientX - estado.inicioX;
                estado.deltaY = evento.clientY - estado.inicioY;
                graph.panGraph?.(estado.deltaX, estado.deltaY);
                evento.preventDefault();
            }
        });

        const terminarPuntero = (evento) => {
            if (!estado.punteros.has(evento.pointerId)) return;

            if (
                estado.arrastrando &&
                evento.pointerId === estado.puntero
            ) {
                consolidarArrastre();
            }

            estado.punteros.delete(evento.pointerId);
            try {
                lienzo.releasePointerCapture?.(evento.pointerId);
            } catch {
                // El navegador puede liberar la captura automáticamente.
            }

            if (estado.punteros.size >= 2) {
                iniciarPinza();
                return;
            }

            estado.gestoPinza = null;

            if (estado.punteros.size === 1) {
                iniciarArrastreCon(Array.from(estado.punteros.values())[0]);
                return;
            }

            estado.arrastrando = false;
            estado.puntero = null;
            lienzo.classList.remove("pw-proyecto-drawio-arrastrando");
        };

        lienzo.addEventListener("pointerup", terminarPuntero);
        lienzo.addEventListener("pointercancel", terminarPuntero);

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

        const alCambiarPantalla = () => {
            if (!lienzo.isConnected) {
                document.removeEventListener(
                    "fullscreenchange",
                    alCambiarPantalla
                );
                observador?.disconnect();
                return;
            }

            const activo =
                document.fullscreenElement === lienzo ||
                lienzo.classList.contains("pw-proyecto-drawio-pantalla-fallback");

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
                    observador.disconnect();
                    return;
                }
                if (
                    !estado.arrastrando &&
                    !estado.gestoPinza &&
                    estado.autoAjuste
                ) {
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
        if (recurso.tipo === "pptx") return "presentacion";
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
        decorarMiniaturasU4();
        decorarArchivosUnidad();
        decorarProyectoFinal();
        decorarAccesoProyectoFinal();
        decorarProyectoEnProgreso();
        prepararTarjetasAutomaticas();
    }


    /*
     * Proyecto final transversal: NO es una unidad ni forma parte de
     * unidad.trabajos. Se presenta fuera de las secciones U1–U5.
     * La rúbrica proviene de datosHub.proyectoFinal, no de un trabajo ficticio.
     */
    function decorarProyectoFinal() {
        if (document.getElementById("proyecto-final")) return;
        const referencia = document.getElementById("unidad5") ||
            document.getElementById("unidad4");
        if (!referencia) return;
        let proyecto = null;
        try {
            proyecto = typeof datosHub !== "undefined" ? datosHub?.proyectoFinal : null;
        } catch { proyecto = null; }
        if (!proyecto || !proyecto.rubrica) return;
        const rubrica = proyecto.rubrica;
        const criterios = Array.isArray(rubrica.criterios) ? rubrica.criterios : [];
        const puntaje = criterios.reduce((suma, c) => suma + (Number(c.puntos) || 0), 0);
        const escapar = (valor) => escaparHtml(String(valor ?? ""));
        const seccion = document.createElement("section");
        seccion.id = "proyecto-final";
        seccion.className = "pw-proyecto-final";
        seccion.setAttribute("aria-labelledby", "pw-proyecto-final-titulo");
        seccion.innerHTML = `
            <div class="pw-pf-encabezado">
                <div class="pw-pf-cabecera-textos">
                    <span class="pw-pf-sobretitulo">PROYECTO DE LA MATERIA</span>
                    <h2 id="pw-proyecto-final-titulo">${escapar(proyecto.titulo)}</h2>
                </div>
                <span class="pw-pf-estado">EN PLANEACIÓN</span>
            </div>
            <p class="pw-pf-descripcion">${escapar(proyecto.descripcion)}</p>
            <div class="pw-pf-notas">
                <div><strong>Orientación temática</strong><p>${escapar(proyecto.orientacion)}</p></div>
                <div><strong>Restricción comentada en clase</strong><p>${escapar(proyecto.restriccion)}</p></div>
            </div>
            <p class="pw-pf-aclaracion">${escapar(proyecto.nota)}</p>
            <details class="pw-pf-rubrica">
                <summary>
                    <span class="pw-pf-rubrica-titulo">Rúbrica de evaluación <small>${criterios.length} criterios · selecciona para consultar</small></span>
                    <span class="pw-pf-puntaje">${puntaje} / ${escapar(rubrica.puntajeMaximo)} pts</span>
                    <span class="pw-pf-flecha" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="m6 9 6 6 6-6"/></svg></span>
                </summary>
                <p class="pw-pf-rubrica-contexto">Se muestran los puntajes máximos y las condiciones del nivel «Excelente» de la rúbrica compartida. No significa que el proyecto ya esté realizado.</p>
                <div class="pw-pf-criterios">
                    ${criterios.map((criterio, indice) => `
                        <details class="pw-pf-criterio">
                            <summary><span><b>${indice + 1}.</b> ${escapar(criterio.nombre)}</span><strong>${Number(criterio.puntos) || 0} pts</strong></summary>
                            <p>${escapar(criterio.excelente)}</p>
                        </details>`).join("")}
                </div>
            </details>`;
        referencia.insertAdjacentElement("afterend", seccion);
    }


    /*
     * Acceso al proyecto en el mismo submenú de Curso.
     * Reutiliza el item ya existente de U5 para mantener su estilo y
     * comportamiento de navegación. No edita navegación histórica.
     * Al activarse primero entra a Curso/U5 y luego baja al proyecto.
     */
    function decorarAccesoProyectoFinal() {
        if (!document.getElementById("proyecto-final")) return;
        if (document.querySelector("[data-pw-acceso-proyecto-final]")) return;

        const candidatos = [...document.querySelectorAll("a, button, [role='menuitem']")];
        const enMenu = (elemento) => Boolean(elemento.closest(
            'nav, header, [role="menu"], [class*="submenu"], ' +
            '[id*="submenu"], [class*="dropdown"], [id*="dropdown"], ' +
            '[class*="desplegable"], [id*="menu-curso"]'
        ));
        const u5 = candidatos.find((elemento) => {
            if (!enMenu(elemento) || elemento.closest("#unidad5")) return false;
            const texto = (elemento.textContent || "").replace(/\s+/g, " ").trim();
            const destino = [elemento.getAttribute("href"), elemento.getAttribute("data-unidad"),
                elemento.getAttribute("data-target"), elemento.getAttribute("data-section")]
                .filter(Boolean).join(" ");
            return /\bunidad\s*5\b|^u\s*5\b/i.test(texto) ||
                /unidad5|^5$/.test(destino.toLowerCase());
        });
        if (!u5) return;

        const contenedor = u5.closest('li, .submenu-item, .dropdown-item, .menu-item') || u5;
        // Un item no puede envolver otros enlaces de unidad.
        const original = contenedor.querySelectorAll('a,button,[role="menuitem"]').length > 1
            ? u5 : contenedor;
        const duplicado = original.cloneNode(true);
        const enlace = duplicado.matches('a,button,[role="menuitem"]')
            ? duplicado : duplicado.querySelector('a,button,[role="menuitem"]');
        if (!enlace) return;
        duplicado.dataset.pwAccesoProyectoFinal = "1";
        duplicado.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        enlace.removeAttribute('id');
        enlace.removeAttribute('onclick');
        enlace.removeAttribute('aria-current');
        enlace.setAttribute('aria-label', 'Ir al Proyecto final de Programación Web');
        enlace.setAttribute('title', 'Proyecto final de Programación Web');
        if (enlace.tagName === 'A') enlace.setAttribute('href', '#proyecto-final');
        [duplicado, enlace].forEach(el => {
            el.classList.remove('active', 'activo', 'selected', 'seleccionado', 'actual');
            for (const data of ['unidad','target','section','seccion','destino','nav','ruta','route','hash']) {
                el.removeAttribute('data-' + data);
            }
        });
        // En el menu de Curso, «U5» se dibuja dentro de un circulo muy pequeno.
        // Nunca se debe escribir «Proyecto final» dentro de esa insignia: se usa PF
        // y el nombre completo va en el texto descriptivo del elemento clonado.
        const walker = document.createTreeWalker(enlace, NodeFilter.SHOW_TEXT);
        const textos = [];
        while (walker.nextNode()) textos.push(walker.currentNode);
        const visibles = textos.filter(n => n.textContent.trim());
        const insignia = visibles.find(n => /\bunidad\s*5\b|^\s*u\s*5\s*$/i.test(n.textContent));
        if (insignia && insignia.parentElement !== enlace) {
            insignia.textContent = 'PF';
            insignia.parentElement.classList.add('pw-pf-menu-insignia');
        }
        const nombre = visibles.find(n => n !== insignia);
        if (nombre) {
            nombre.textContent = 'Proyecto final';
            visibles.filter(n => n !== insignia && n !== nombre)
                .forEach(n => n.textContent = '');
        } else if (insignia) {
            // Variante de menu con una sola etiqueta: se agrega el titulo afuera
            // del circulo sin alterar el elemento original de Unidad 5.
            const nombreExtra = document.createElement('span');
            nombreExtra.className = 'pw-pf-menu-nombre';
            nombreExtra.textContent = 'Proyecto final';
            enlace.appendChild(nombreExtra);
        } else {
            enlace.textContent = 'Proyecto final';
        }

        enlace.addEventListener('click', (evento) => {
            evento.preventDefault();
            evento.stopImmediatePropagation();
            // Entra al mismo panel Curso que ya maneja la opcion Unidad 5.
            enlace.dispatchEvent(new Event('pw-pf-navegar'));
            u5.click();
            const ir = () => document.getElementById('proyecto-final')?.scrollIntoView({
                behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'start'
            });
            requestAnimationFrame(() => requestAnimationFrame(ir));
            setTimeout(ir, 160);
        }, true);

        original.insertAdjacentElement('afterend', duplicado);
        prepararEstadoYScrollProyectoFinal({ enlace, u5, original, duplicado });
    }

    /*
     * La opcion PF se dibuja independientemente de la Unidad 5. El scrollspy
     * antiguo puede seguir marcando U5 porque PF se situa justo despues.
     * No usamos MutationObserver para desmarcar U5: observar y modificar
     * las mismas clases provocaba un ciclo de actualizaciones en C6.
     */
    function prepararEstadoYScrollProyectoFinal({ enlace, u5, original, duplicado }) {
        const proyecto = document.getElementById('proyecto-final');
        if (!proyecto || !enlace) return;

        const menu = enlace.closest('.nav-desplegable-menu') ||
            enlace.closest('[role="menu"]');
        const clases = ['active', 'activo', 'selected', 'seleccionado', 'actual',
            'is-active', 'nav-activo'];
        let hastaClick = 0;
        let pendiente = false;

        // Identificar la plantilla U5 sin cambiar sus rutas ni sus eventos.
        for (const item of new Set([original, u5])) {
            if (item) item.dataset.pwPfPlantillaU5 = '1';
        }

        const actualizarSeleccion = () => {
            pendiente = false;
            if (!enlace.isConnected || !proyecto.isConnected) return;
            const rect = proyecto.getBoundingClientRect();
            const limite = Math.max(110, Math.min(260, window.innerHeight * .38));
            const activo = performance.now() < hastaClick ||
                (rect.top <= limite && rect.bottom > 90);

            duplicado.classList.toggle('pw-pf-menu-activo', activo);
            if (enlace !== duplicado) enlace.classList.toggle('pw-pf-menu-activo', activo);
            menu?.classList.toggle('pw-pf-seccion-activa', activo);
            if (activo) {
                enlace.setAttribute('aria-current', 'location');
                // La limpieza se ejecuta al cambiar el scroll, NO al mutar
                // clases. Las reglas CSS tambien neutralizan el estilo nativo
                // en caso de que el scrollspy vuelva a marcar U5.
                for (const item of new Set([original, u5])) {
                    if (!item) continue;
                    if (clases.some(c => item.classList.contains(c))) {
                        item.classList.remove(...clases);
                    }
                    if (item.hasAttribute('aria-current')) item.removeAttribute('aria-current');
                }
            } else {
                enlace.removeAttribute('aria-current');
            }
        };
        const programarSeleccion = () => {
            if (pendiente) return;
            pendiente = true;
            requestAnimationFrame(actualizarSeleccion);
        };
        window.addEventListener('scroll', programarSeleccion, { passive: true });
        window.addEventListener('resize', programarSeleccion, { passive: true });
        window.addEventListener('hashchange', programarSeleccion);
        enlace.addEventListener('pw-pf-navegar', () => {
            hastaClick = performance.now() + 900;
            programarSeleccion();
            setTimeout(programarSeleccion, 950);
        });

        // C9: el desplazamiento se gestiona únicamente por el navegador.
        // La altura disponible se controla desde navegacion.js y navegacion.css.
        // No interceptamos wheel ni scrollTop: hacerlo causaba saltos y parpadeos.
        actualizarSeleccion();
    }


    /*
     * El progreso del curso sigue midiendo únicamente U1–U5. El Proyecto final
     * se muestra DESPUÉS de esas cinco tarjetas como acceso independiente,
     * sin crear una unidad ficticia ni alterar el porcentaje académico.
     */
    function decorarProyectoEnProgreso() {
        if (!document.getElementById('proyecto-final')) return;
        if (document.querySelector('[data-pw-pf-progreso]')) return;

        const titulo = [...document.querySelectorAll('h1,h2,h3,h4')]
            .find(el => /avance en programaci[oó]n web/i.test(el.textContent.trim()));
        if (!titulo) return;

        // Elegir el contenedor mas pequeno que agrupe el encabezado y U1–U5.
        // No dependemos de clases internas del panel, que pueden variar.
        let contenedor = titulo.parentElement;
        for (let nivel = 0; nivel < 6 && contenedor; nivel++, contenedor = contenedor.parentElement) {
            const marcas = [...contenedor.querySelectorAll('span,div,strong')]
                .filter(n => n.children.length === 0 && /^U[1-5]$/.test(n.textContent.trim()))
                .map(n => n.textContent.trim());
            if (new Set(marcas).size === 5) break;
        }
        if (!contenedor || contenedor === document.body || contenedor === document.documentElement) return;

        const acceso = document.createElement('a');
        acceso.className = 'pw-pf-progreso-acceso';
        acceso.dataset.pwPfProgreso = '1';
        acceso.href = '#proyecto-final';
        acceso.setAttribute('aria-label', 'Ver Proyecto final de Programación Web');
        acceso.innerHTML = `
            <span class="pw-pf-progreso-icono" aria-hidden="true">PF</span>
            <span class="pw-pf-progreso-cuerpo">
                <strong>Proyecto final de Programación Web</strong>
                <small>Proyecto de la materia · apartado separado del avance por unidades</small>
            </span>
            <span class="pw-pf-progreso-estado">En planeación</span>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
        acceso.addEventListener('click', (evento) => {
            evento.preventDefault();
            const opcion = document.querySelector(
                '[data-pw-acceso-proyecto-final] a, ' +
                '[data-pw-acceso-proyecto-final] button, ' +
                'a[data-pw-acceso-proyecto-final], ' +
                'button[data-pw-acceso-proyecto-final]'
            );
            if (opcion) opcion.click();
            else document.getElementById('proyecto-final')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        contenedor.appendChild(acceso);
    }


    /*
     * AUTOCATÁLOGO (mantenimiento académico, sin cambio de versión)
     *
     * El catálogo editorial sigue siendo prioritario. El árbol público de
     * GitHub permite incorporar actividades futuras sin actualizar a mano
     * unidades.json. Las carpetas/archivos con Ux.Ay se agrupan en una tarjeta;
     * los recursos internos (CSS, imágenes, etc.) no crean tarjetas adicionales.
     * Las rutas que ya eran documentación o ejemplos de clase conservan su
     * clasificación anterior. Offline se utiliza el catálogo publicado.
     */
    function prepararTarjetasAutomaticas() {
        let unidades;
        try {
            unidades = typeof datosHub !== "undefined" &&
                Array.isArray(datosHub?.unidades) ? datosHub.unidades : null;
        } catch { unidades = null; }
        if (!unidades) return;

        const pendientes = unidades.filter((unidad) => {
            const cuadricula = document.querySelector(
                `[data-unidad-trabajos="${unidad.numero}"]`
            );
            if (!cuadricula || cuadriculasAutoRevisadas.has(cuadricula)) return false;
            cuadriculasAutoRevisadas.add(cuadricula);
            if (!archivosInicialesPorUnidad.has(unidad.numero)) {
                archivosInicialesPorUnidad.set(
                    unidad.numero,
                    new Set(aplanarRutasArchivos(unidad.archivosUnidad).map(
                        (ruta) => normalizarRutaRelativa(ruta).toLowerCase()
                    ))
                );
            }
            return true;
        });
        if (!pendientes.length) return;

        obtenerArbolGitHub().then(({ tree }) => {
            if (!Array.isArray(tree)) return;
            pendientes.forEach((unidad) => {
                const cuadricula = document.querySelector(
                    `[data-unidad-trabajos="${unidad.numero}"]`
                );
                if (!cuadricula || !document.getElementById(`unidad${unidad.numero}`)) return;
                reconciliarTarjetasAutomaticas(unidad, cuadricula, tree);
            });
        }).catch((error) => {
            // Sin Internet o con límite de la API, el catálogo editorial basta.
            console.info("PW Hub: autocátalogo sin conexión con GitHub; se mantiene el catálogo local.", error);
        });
    }

    function aplanarRutasArchivos(nodos) {
        return (Array.isArray(nodos) ? nodos : []).flatMap((nodo) =>
            Array.isArray(nodo?.archivos)
                ? aplanarRutasArchivos(nodo.archivos)
                : nodo?.ruta ? [nodo.ruta] : []
        );
    }

    function claveGrupoAutomatica(numero, ruta) {
        const rutaNormal = normalizarRutaRelativa(ruta);
        const prefijo = `U${numero}/`;
        if (!rutaNormal.toLowerCase().startsWith(prefijo.toLowerCase())) return null;
        const partes = rutaNormal.slice(prefijo.length).split("/").filter(Boolean);
        if (!partes.length) return null;
        const inicial = partes[0];
        const patron = new RegExp(
            `^U${numero}[\\s._-]*A(?:CT(?:IVIDAD)?)?[\\s._-]*(\\d{1,3})(?=[\\s._-]|$)`,
            "i"
        );
        const actividad = inicial.match(patron);
        if (actividad) return `a:${numero}:${Number(actividad[1])}`;
        if (partes.length > 1) return `carpeta:${numero}:${inicial.toLocaleLowerCase("es")}`;
        return `archivo:${numero}:${inicial.toLocaleLowerCase("es")}`;
    }

    function tipoArchivoAutomatico(ruta) {
        const ext = (String(ruta).split(".").pop() || "").toLowerCase();
        return ({ md: "markdown", htm: "html", jpeg: "jpg" })[ext] || ext || "archivo";
    }

    function tituloArchivoAutomatico(numero, ruta) {
        const normal = normalizarRutaRelativa(ruta);
        const partes = normal.replace(new RegExp(`^U${numero}/`, "i"), "")
            .split("/").filter(Boolean);
        const primerNombre = partes[0] || "Trabajo";
        const actividad = primerNombre.match(new RegExp(
            `^U${numero}[\\s._-]*A(?:CT(?:IVIDAD)?)?[\\s._-]*(\\d{1,3})(?=[\\s._-]|$)`, "i"
        ));
        let base = primerNombre.replace(/\.[^.]+$/, "");
        if (partes.length > 1) base = primerNombre;
        if (actividad) base = base.slice(actividad[0].length);
        base = base.replace(/^[\s._-]+/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
        base = base.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2");
        const tipo = tipoArchivoAutomatico(ruta);
        const lenguaje = ({ js: "JavaScript", html: "HTML", css: "CSS", json: "JSON",
            pdf: "PDF", pptx: "PowerPoint", markdown: "Markdown" })[tipo];
        if (!base) base = lenguaje ? `Archivo ${lenguaje}` : "Trabajo";
        if (/^ejercicios?$/i.test(base) && lenguaje) {
            base += ` de ${lenguaje}`;
        }
        if (actividad) return `Actividad ${Number(actividad[1])} - ${base}`;
        return base.charAt(0).toLocaleUpperCase("es") + base.slice(1);
    }

    function reconciliarTarjetasAutomaticas(unidad, cuadricula, tree) {
        const numero = Number(unidad.numero);
        const prefijo = `${RAIZ_ALUMNO}/U${numero}/`;
        const excluidas = new Set(
            (unidad.archivosUnidadExcluidos || []).map(
                (ruta) => normalizarRutaRelativa(ruta).toLowerCase()
            )
        );
        const archivos = tree.filter((elemento) => {
            if (elemento?.type !== "blob" || !elemento.path?.startsWith(prefijo)) return false;
            const fragmentos = elemento.path.slice(prefijo.length).split("/");
            if (fragmentos.some((segmento) => segmentoEmpiezaOculto(segmento))) return false;
            const ruta = `U${numero}/${fragmentos.join("/")}`;
            return !excluidas.has(ruta.toLowerCase()) &&
                !["readme.md", "license", "license.md"].includes(fragmentos.join("/").toLowerCase());
        }).map((el) => `U${numero}/${el.path.slice(prefijo.length)}`);

        // Sincronizacion.js puede haber creado tarjetas PDF/HTML a nivel de
        // archivo. Conservamos la versión editorial de cada actividad.
        const trabajos = Array.isArray(unidad.trabajos) ? unidad.trabajos : [];
        const originales = [...cuadricula.querySelectorAll(":scope > .unidad-trabajo")];
        const mejores = new Map();
        trabajos.forEach((trabajo, indice) => {
            const clave = claveGrupoAutomatica(numero, trabajo.ruta);
            if (!clave) return;
            const anterior = mejores.get(clave);
            if (!anterior ||
                (anterior.trabajo.automatico && !trabajo.automatico) ||
                (anterior.trabajo.automatico && trabajo.automatico &&
                    prioridadArchivoAutomatico(trabajo.ruta) <
                    prioridadArchivoAutomatico(anterior.trabajo.ruta))) {
                mejores.set(clave, { trabajo, indice });
            }
        });
        const conservados = trabajos.filter((trabajo, indice) => {
            const clave = claveGrupoAutomatica(numero, trabajo.ruta);
            if (!clave) return true;
            const principal = mejores.get(clave);
            if (!principal || principal.indice === indice) return true;
            originales[indice]?.remove();
            return false;
        });
        // No alteramos los trabajos de otras unidades ni repetimos elementos.
        if (conservados.length !== trabajos.length) unidad.trabajos = conservados;
        // Los PDF/HTML descubiertos por sincronizacion.js ya tenían tarjeta,
        // pero su nombre automático no respetaba «Ux. Ay. ...».
        const tarjetasVisibles = [...cuadricula.querySelectorAll(":scope > .unidad-trabajo")];
        conservados.forEach((trabajo, indice) => {
            if (!trabajo.automatico) return;
            const titulo = tituloArchivoAutomatico(numero, trabajo.ruta);
            trabajo.nombre = titulo;
            const h5 = tarjetasVisibles[indice]?.querySelector("h5");
            if (h5) h5.textContent = titulo;
        });

        const presentes = new Set(
            conservados.map((t) => claveGrupoAutomatica(numero, t.ruta)).filter(Boolean)
        );
        const grupos = new Map();
        archivos.forEach((ruta) => {
            const clave = claveGrupoAutomatica(numero, ruta);
            if (!clave) return;
            if (!grupos.has(clave)) grupos.set(clave, []);
            grupos.get(clave).push(ruta);
        });

        const base = archivosInicialesPorUnidad.get(numero) || new Set();
        for (const [clave, grupo] of grupos) {
            if (presentes.has(clave)) continue;
            // Elementos editoriales antiguos (README, test, ejemplos de clase)
            // se siguen viendo en el árbol, sin convertirse en otra tarjeta.
            const nuevos = grupo.filter((ruta) => !base.has(ruta.toLowerCase()));
            if (!nuevos.length) continue;
            // Si la carpeta ya existía como documentación/material de clase,
            // añadir nuevos recursos no la convierte en un nuevo proyecto.
            if (grupo.some((ruta) => base.has(ruta.toLowerCase()))) continue;
            const principal = [...grupo].sort((a, b) =>
                prioridadArchivoAutomatico(a) - prioridadArchivoAutomatico(b) ||
                a.localeCompare(b, "es", { numeric: true })
            )[0];
            if (!principal) continue;
            const tipo = tipoArchivoAutomatico(principal);
            const trabajo = {
                nombre: tituloArchivoAutomatico(numero, principal),
                ruta: `../${principal}`,
                tipo,
                descripcion: grupo.length > 1
                    ? `Trabajo detectado automáticamente en U${numero}, con ${grupo.length} archivos relacionados. Puedes consultar los recursos en Archivos de la unidad.`
                    : `Archivo ${tipo.toUpperCase()} detectado automáticamente en la Unidad ${numero}.`,
                automatico: true
            };
            unidad.trabajos.push(trabajo);
            agregarTarjetaAutomatica(unidad, cuadricula, trabajo);
            presentes.add(clave);
        }
        // El sincronizador anterior podía agregar PDF/HTML antes que JS.
        // Conservamos la secuencia académica A1, A2, A3, A4... en U4/U5.
        if (numero === 4 || numero === 5) ordenarTarjetasPorActividad(unidad, cuadricula);
        // Las nuevas tarjetas se decoran mediante el observador ya existente.
    }

    function ordenarTarjetasPorActividad(unidad, cuadricula) {
        const tarjetas = [...cuadricula.querySelectorAll(":scope > .unidad-trabajo")];
        if (tarjetas.length !== unidad.trabajos.length) return;
        const ordenados = unidad.trabajos.map((trabajo, indice) => {
            const clave = claveGrupoAutomatica(unidad.numero, trabajo.ruta) || "";
            const actividad = clave.match(/^a:\d+:(\d+)$/);
            return { trabajo, tarjeta: tarjetas[indice], indice,
                numero: actividad ? Number(actividad[1]) : Number.POSITIVE_INFINITY };
        }).sort((a, b) => a.numero - b.numero || a.indice - b.indice);
        if (ordenados.some((entrada, i) => entrada.indice !== i)) {
            unidad.trabajos = ordenados.map((entrada) => entrada.trabajo);
            // DocumentFragment evita múltiples repintados del catálogo.
            const fragmento = document.createDocumentFragment();
            ordenados.forEach(({ tarjeta }) => fragmento.appendChild(tarjeta));
            cuadricula.appendChild(fragmento);
        }
    }

    function segmentoEmpiezaOculto(segmento) {
        return segmento.startsWith(".") || /^(?:node_modules|__macosx|dist|build)$/i.test(segmento);
    }

    function prioridadArchivoAutomatico(ruta) {
        const tipo = tipoArchivoAutomatico(ruta);
        const orden = ["html", "js", "pdf", "pptx", "markdown", "png", "jpg", "webp",
            "svg", "drawio", "txt", "json", "css"];
        const indice = orden.indexOf(tipo);
        return indice === -1 ? 99 : indice;
    }

    function agregarTarjetaAutomatica(unidad, cuadricula, trabajo) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "unidad-trabajo";
        tarjeta.dataset.pwTarjetaAutomatica = "true";
        const previa = document.createElement("div");
        previa.className = "unidad-trabajo-preview";
        previa.dataset.pwU4Miniatura = "1"; // Evita volver a crear la miniatura automática.
        const tipo = tipoArchivoAutomatico(trabajo.ruta);
        const urlArchivo = new URL(trabajo.ruta, window.location.href);
        if (["png", "jpg", "gif", "svg", "webp", "avif"].includes(tipo)) {
            const img = document.createElement("img");
            img.src = urlArchivo.href;
            img.alt = `Vista previa de ${trabajo.nombre}`;
            img.loading = "lazy";
            img.className = "pw-u4-mini-imagen";
            previa.appendChild(img);
        } else if (["html", "pdf"].includes(tipo)) {
            const iframe = document.createElement("iframe");
            iframe.src = urlArchivo.href;
            iframe.title = `Vista previa de ${trabajo.nombre}`;
            iframe.loading = "lazy";
            previa.appendChild(iframe);
        } else if (["js", "css", "json", "txt", "markdown", "xml"].includes(tipo)) {
            const pre = document.createElement("pre");
            pre.className = "pw-u4-mini-codigo";
            pre.textContent = "// Cargando archivo...";
            previa.appendChild(pre);
            fetch(urlArchivo.href).then((r) => {
                if (!r.ok) throw new Error(String(r.status));
                return r.text();
            }).then((s) => { if (pre.isConnected) pre.textContent = s.slice(0, 2200); })
                .catch(() => { if (pre.isConnected) pre.textContent = "Vista previa no disponible"; });
        } else {
            const panel = document.createElement("div");
            panel.className = "preview-markdown-mini";
            panel.textContent = `${tipo.toUpperCase()} · Archivo disponible`;
            previa.appendChild(panel);
        }
        const info = document.createElement("div");
        info.className = "unidad-trabajo-info";
        const etiq = document.createElement("p");
        etiq.className = "unidad-trabajo-tipo";
        etiq.textContent = tipo.toUpperCase();
        const titulo = document.createElement("h5");
        titulo.textContent = trabajo.nombre;
        const descripcion = document.createElement("p");
        descripcion.textContent = trabajo.descripcion;
        const acciones = document.createElement("div");
        acciones.className = "unidad-trabajo-acciones";
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "unidad-trabajo-vista-previa";
        boton.setAttribute("data-unidad-vista-previa", "");
        boton.textContent = "Vista previa";
        const completo = { ...trabajo, unidad: unidad.numero, unidadTitulo: unidad.titulo,
            unidadEstado: unidad.estado };
        boton.addEventListener("click", () => {
            window.mostrarVistaPreviaTrabajoHub?.(completo);
        });
        const abrir = document.createElement("a");
        abrir.setAttribute("data-unidad-abrir-trabajo", "");
        abrir.href = `vistas/trabajo.html?${new URLSearchParams({
            archivo: urlArchivo.href, tipo: tipo, titulo: trabajo.nombre
        })}`;
        abrir.textContent = "Abrir trabajo";
        acciones.append(boton, abrir);
        info.append(etiq, titulo, descripcion, acciones);
        tarjeta.append(previa, info);
        cuadricula.appendChild(tarjeta);
    }

    function esScriptU4(trabajo) {
        if (!trabajo?.ruta) return false;
        return /^U4\/(?:[^/]+\/)*[^/]+\.js$/i.test(normalizarRutaRelativa(trabajo.ruta));
    }

    async function mostrarVistaPreviaScriptU4(trabajo) {
        if (typeof vistaPreviaOriginal !== "function") return;
        await vistaPreviaOriginal(trabajo);
        const contenido = document.querySelector("#trabajos-visor-contenido .trabajos-visor-superficie");
        const abrir = document.getElementById("trabajos-visor-abrir");
        if (!contenido || !contenido.isConnected) return;
        if (abrir) abrir.textContent = "Editor y consola";
        const bloque = document.createElement("div");
        bloque.className = "pw-js-previa-modal";
        const meta = document.createElement("p");
        meta.textContent = "Vista previa del código JavaScript · Para editarlo o ejecutarlo, abre Editor y consola.";
        const pre = document.createElement("pre");
        pre.textContent = "Cargando código...";
        bloque.append(meta, pre);
        contenido.replaceChildren(bloque);
        try {
            const ruta = new URL(trabajo.ruta, window.location.href);
            if (ruta.origin !== window.location.origin) throw new Error("Ruta externa");
            const respuesta = await fetch(ruta.href);
            if (!respuesta.ok) throw new Error("Error HTTP " + respuesta.status);
            const fuente = await respuesta.text();
            if (bloque.isConnected) pre.textContent = fuente;
        } catch (error) {
            if (bloque.isConnected) pre.textContent = "No se pudo cargar el código. Usa Abrir trabajo.";
            console.warn("PW Hub: vista previa JS no disponible", error);
        }
    }

    function decorarMiniaturasU4() {
        document.querySelectorAll("#unidad4 .unidad-trabajo").forEach((tarjeta) => {
            const enlace = tarjeta.querySelector("[data-unidad-abrir-trabajo]");
            const preview = tarjeta.querySelector(".unidad-trabajo-preview");
            if (!enlace || !preview || preview.dataset.pwU4Miniatura) return;
            let ruta;
            try {
                const params = new URL(enlace.href, window.location.href).searchParams;
                ruta = new URL(params.get("archivo"), window.location.href);
                if (ruta.origin !== window.location.origin) return;
            } catch { return; }
            const archivo = decodeURIComponent(ruta.pathname).toLowerCase();
            const esTareaPresentacion = /\/u4\/u4\. a1\. tarea 1\/u4\. a1\. tarea 1\.pdf$/.test(archivo);
            if (!esTareaPresentacion && !/\.(?:jpe?g|png|gif|webp|svg|js)$/.test(archivo)) return;
            preview.dataset.pwU4Miniatura = "1";
            if (esTareaPresentacion || /\.(?:jpe?g|png|gif|webp|svg)$/.test(archivo)) {
                const img = document.createElement("img");
                img.className = "pw-u4-mini-imagen";
                img.alt = "Vista previa de la actividad";
                img.loading = "lazy";
                if (esTareaPresentacion) {
                    const nombreBase = "U4. A1. Tarea 1";
                    const rutaPNG = new URL(nombreBase + ".PNG", ruta.href);
                    const rutaPng = new URL(nombreBase + ".png", ruta.href);
                    img.src = rutaPNG.href;
                    img.addEventListener("error", () => {
                        if (img.src !== rutaPng.href) img.src = rutaPng.href;
                    });
                } else {
                    img.src = ruta.href;
                }
                preview.replaceChildren(img);
            } else {
                const pre = document.createElement("pre");
                pre.className = "pw-u4-mini-codigo";
                pre.textContent = "// Cargando código JavaScript...";
                preview.replaceChildren(pre);
                fetch(ruta.href).then((respuesta) => {
                    if (!respuesta.ok) throw new Error(String(respuesta.status));
                    return respuesta.text();
                }).then((fuente) => {
                    if (pre.isConnected) pre.textContent = fuente.slice(0, 2200);
                }).catch(() => {
                    if (pre.isConnected) pre.textContent = "// Código disponible al abrir el trabajo";
                });
            }
        });
    }

    function decorarArchivosUnidad() {
        let unidades = [];

        try {
            if (
                typeof datosHub !== "undefined" &&
                Array.isArray(datosHub?.unidades)
            ) {
                unidades = datosHub.unidades;
            }
        } catch {
            unidades = [];
        }

        unidades.forEach((unidadDatos) => {
            const archivos = Array.isArray(unidadDatos.archivosUnidad)
                ? unidadDatos.archivosUnidad
                : [];
            const debeMostrar =
                archivos.length > 0 ||
                unidadDatos.archivosUnidadAutomaticos === true;

            if (!debeMostrar) return;

            const unidad = document.getElementById(`unidad${unidadDatos.numero}`);
            if (
                !unidad ||
                unidad.querySelector("[data-pw-archivos-unidad]")
            ) {
                return;
            }

            const contenido = unidad.querySelector(".unidad-contenido");
            if (!contenido) return;

            const panel = crearPanelArchivosUnidad(unidadDatos, archivos);
            const temas = contenido.querySelector(".unidad-temas");

            if (temas) {
                const lateral = document.createElement("div");
                lateral.className = "pw-unidad-lateral";

                temas.insertAdjacentElement("beforebegin", lateral);
                lateral.appendChild(temas);
                lateral.appendChild(panel);
            } else {
                contenido.insertBefore(panel, contenido.firstChild);
            }

            configurarToggleArchivosUnidad(panel);

            // El inventario base permite uso offline; online incorporamos
            // nuevos archivos sin esperar a que la lista esté vacía.
            if (unidadDatos.archivosUnidadAutomaticos === true) {
                actualizarArchivosUnidadAutomaticos(unidadDatos, panel);
            }
        });
    }

    function crearPanelArchivosUnidad(unidadDatos, archivos) {
        const lista = Array.isArray(archivos) ? archivos : [];
        const totalArchivos = contarArchivosUnidad(lista);
        const sinArchivos = totalArchivos === 0;
        const actividadesClase = contarCategoriaArchivosUnidad(
            lista,
            "actividad-clase"
        );
        const resumen = sinArchivos
            ? `Se habilitará automáticamente cuando existan archivos en U${unidadDatos.numero}.`
            : actividadesClase
                ? `${actividadesClase} ${unidadDatos.numero === 1 ? "actividades" : "material"} de clase · ${totalArchivos} archivos`
                : `${totalArchivos} archivos`;
        const idContenido = `pw-u${unidadDatos.numero}-archivos-contenido`;
        const nota = unidadDatos.numero === 1 && !sinArchivos
            ? `
                <p class="pw-unidad-archivos-nota">
                    Los archivos test.txt, test2.txt y test3.txt corresponden a actividades realizadas en clase.
                    Perfil personal, Comandos de Git y Catálogo de películas se mantienen como los tres trabajos principales de U1.
                </p>
            `
            : "";
        const panel = document.createElement("section");

        panel.className = `pw-unidad-archivos${sinArchivos ? " sin-archivos" : ""}`;
        panel.dataset.pwArchivosUnidad = "1";
        panel.dataset.pwUnidad = String(unidadDatos.numero);
        panel.innerHTML = `
            <button
                type="button"
                class="pw-unidad-archivos-toggle"
                aria-expanded="false"
                ${sinArchivos ? 'aria-disabled="true" disabled' : `aria-controls="${idContenido}"`}
                data-pw-toggle-archivos-unidad
            >
                <span class="pw-unidad-archivos-cabecera-texto">
                    <span class="pw-unidad-archivos-etiqueta">
                        ${sinArchivos ? "Estructura preparada" : "Estructura real"} de U${unidadDatos.numero}
                    </span>
                    <strong>Archivos de la unidad</strong>
                    <span class="pw-unidad-archivos-resumen">${resumen}</span>
                </span>

                <span class="pw-unidad-archivos-cabecera-meta">
                    <span class="pw-unidad-archivos-contador">
                        ${sinArchivos ? "Sin archivos" : `${totalArchivos} archivos`}
                    </span>
                    <span class="pw-unidad-archivos-chevron" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                            <path d="M7 10l5 5 5-5"></path>
                        </svg>
                    </span>
                </span>
            </button>

            ${sinArchivos ? "" : `
                <div
                    id="${idContenido}"
                    class="pw-unidad-archivos-desplegable"
                    data-pw-archivos-contenido
                    hidden
                >
                    <div
                        class="pw-unidad-arbol"
                        role="tree"
                        aria-label="Archivos de la Unidad ${unidadDatos.numero}"
                    >
                        <div class="pw-unidad-carpeta-raiz">
                            <span class="pw-unidad-carpeta-raiz-marca" aria-hidden="true"></span>
                            <strong>U${unidadDatos.numero}</strong>
                        </div>

                        <div class="pw-unidad-arbol-nivel">
                            ${renderizarNodosUnidad(lista, true)}
                        </div>
                    </div>
                    ${nota}
                </div>
            `}
        `;

        return panel;
    }

    function configurarToggleArchivosUnidad(panel) {
        const toggle = panel?.querySelector("[data-pw-toggle-archivos-unidad]");
        const desplegable = panel?.querySelector("[data-pw-archivos-contenido]");

        if (!toggle || !desplegable || toggle.disabled) return;

        toggle.addEventListener("click", () => {
            const abierto = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!abierto));
            desplegable.hidden = abierto;
            panel.classList.toggle("abierto", !abierto);
        });
    }

    async function actualizarArchivosUnidadAutomaticos(unidadDatos, panelActual) {
        try {
            const detectados = await consultarArchivosUnidadGitHub(unidadDatos.numero);
            if (!detectados.length || !panelActual?.isConnected) return;

            // Conservamos las etiquetas editoriales de las actividades ya
            // registradas, pero el árbol online incluye archivos nuevos.
            const originales = Array.isArray(unidadDatos.archivosUnidad)
                ? unidadDatos.archivosUnidad : [];
            const metadatos = new Map();
            const registrar = (nodos) => (nodos || []).forEach((nodo) => {
                if (nodo?.ruta) {
                    metadatos.set(normalizarRutaRelativa(nodo.ruta), nodo);
                }
                if (Array.isArray(nodo?.archivos)) registrar(nodo.archivos);
            });
            registrar(originales);
            const fusionar = (nodos) => nodos.map((nodo) => {
                if (Array.isArray(nodo?.archivos)) {
                    return { ...nodo, archivos: fusionar(nodo.archivos) };
                }
                const editorial = metadatos.get(normalizarRutaRelativa(nodo.ruta));
                return editorial ? {
                    ...nodo,
                    etiqueta: editorial.etiqueta,
                    categoria: editorial.categoria
                } : nodo;
            });
            const rutas = (nodos) => (nodos || []).flatMap((nodo) =>
                Array.isArray(nodo?.archivos) ? rutas(nodo.archivos) :
                nodo?.ruta ? [normalizarRutaRelativa(nodo.ruta)] : []
            ).sort();
            const omitidos = new Set(
                (unidadDatos.archivosUnidadExcluidos || []).map(normalizarRutaRelativa)
            );
            // El catálogo conserva los recursos recién añadidos mientras aún
            // no están publicados. GitHub aporta el resto; evita el JPEG obsoleto.
            const unidas = [...new Set([
                ...rutas(originales),
                ...rutas(detectados).filter((ruta) => !omitidos.has(ruta))
            ])].sort();
            const prefijo = `U${unidadDatos.numero}/`;
            const arbol = construirArbolArchivosUnidad(
                unidas.filter((ruta) => ruta.startsWith(prefijo))
                    .map((ruta) => ruta.slice(prefijo.length)),
                unidadDatos.numero
            );
            const etiquetasCarpeta = new Map();
            const buscarCarpetas = (nodos, padre = "") => (nodos || []).forEach((nodo) => {
                if (!nodo?.carpeta || !Array.isArray(nodo.archivos)) return;
                const rutaCarpeta = `${padre}${nodo.carpeta}/`;
                etiquetasCarpeta.set(rutaCarpeta, nodo.etiqueta);
                buscarCarpetas(nodo.archivos, rutaCarpeta);
            });
            buscarCarpetas(originales);
            const preservarEtiquetas = (nodos, padre = "") => (nodos || []).map((nodo) => {
                if (!nodo?.carpeta || !Array.isArray(nodo.archivos)) return nodo;
                const rutaCarpeta = `${padre}${nodo.carpeta}/`;
                return {
                    ...nodo,
                    etiqueta: etiquetasCarpeta.get(rutaCarpeta) || nodo.etiqueta,
                    archivos: preservarEtiquetas(nodo.archivos, rutaCarpeta)
                };
            });
            const archivos = preservarEtiquetas(fusionar(arbol));
            if (JSON.stringify(rutas(originales)) === JSON.stringify(rutas(archivos))) return;

            unidadDatos.archivosUnidad = archivos;
            const panelNuevo = crearPanelArchivosUnidad(unidadDatos, archivos);
            panelActual.replaceWith(panelNuevo);
            configurarToggleArchivosUnidad(panelNuevo);
        } catch (error) {
            console.info(
                `PW Hub: U${unidadDatos.numero} aún no tiene archivos disponibles o no fue posible consultar GitHub.`,
                error
            );
        }
    }

    async function consultarArchivosUnidadGitHub(numeroUnidad) {
        const datos = await obtenerArbolGitHub();
        const prefijo = `${RAIZ_ALUMNO}/U${numeroUnidad}/`;
        const rutas = datos.tree
            .filter(
                (elemento) =>
                    elemento?.type === "blob" &&
                    typeof elemento.path === "string" &&
                    elemento.path.startsWith(prefijo)
            )
            .map((elemento) => elemento.path.slice(prefijo.length))
            .filter(
                (ruta) =>
                    ruta &&
                    !ruta.split("/").some((segmento) => segmento.startsWith("."))
            );

        return construirArbolArchivosUnidad(rutas, numeroUnidad);
    }

    function construirArbolArchivosUnidad(rutas, numeroUnidad) {
        const raiz = [];
        const ordenadas = [...rutas].sort((a, b) =>
            a.localeCompare(b, "es", { numeric: true, sensitivity: "base" })
        );

        ordenadas.forEach((rutaRelativa) => {
            const partes = rutaRelativa.split("/").filter(Boolean);
            if (!partes.length) return;

            let nivel = raiz;

            partes.forEach((parte, indice) => {
                const esArchivo = indice === partes.length - 1;

                if (esArchivo) {
                    nivel.push({
                        nombre: parte,
                        ruta: `../U${numeroUnidad}/${rutaRelativa}`,
                        tipo: obtenerTipoDesdeRuta(rutaRelativa)
                    });
                    return;
                }

                let carpeta = nivel.find(
                    (nodo) => nodo?.carpeta === parte && Array.isArray(nodo.archivos)
                );

                if (!carpeta) {
                    carpeta = { carpeta: parte, archivos: [] };
                    nivel.push(carpeta);
                }

                nivel = carpeta.archivos;
            });
        });

        return raiz;
    }

    function contarArchivosUnidad(nodos) {
        return (nodos || []).reduce((total, nodo) => {
            if (Array.isArray(nodo?.archivos)) {
                return total + contarArchivosUnidad(nodo.archivos);
            }
            return total + (nodo?.ruta ? 1 : 0);
        }, 0);
    }

    function contarCategoriaArchivosUnidad(nodos, categoria) {
        return (nodos || []).reduce((total, nodo) => {
            const propio = nodo?.categoria === categoria && nodo?.ruta ? 1 : 0;
            const hijos = Array.isArray(nodo?.archivos)
                ? contarCategoriaArchivosUnidad(nodo.archivos, categoria)
                : 0;
            return total + propio + hijos;
        }, 0);
    }

    function renderizarNodosUnidad(nodos, esRaiz = false) {
        const lista = Array.isArray(nodos) ? nodos : [];
        if (!lista.length) return "";

        if (!esRaiz) {
            return lista.map(renderizarNodoUnidad).join("");
        }

        const categorias = [
            ["documentacion", "Documentación", "pw-unidad-grupo"],
            ["actividad-clase", "Actividades en clase", "pw-unidad-grupo pw-unidad-grupo-clase"]
        ];
        const usados = new Set();
        let html = "";

        categorias.forEach(([categoria, titulo, clase]) => {
            const elementos = lista.filter(
                (nodo) => nodo?.categoria === categoria && !nodo?.carpeta
            );
            if (!elementos.length) return;

            elementos.forEach((nodo) => usados.add(nodo));
            html += `
                <div class="${clase}">
                    <p class="pw-unidad-grupo-titulo">${titulo}</p>
                    ${elementos.map(renderizarNodoUnidad).join("")}
                </div>
            `;
        });

        html += lista
            .filter((nodo) => !usados.has(nodo))
            .map(renderizarNodoUnidad)
            .join("");

        return html;
    }

    function renderizarNodoUnidad(nodo) {
        if (!nodo) return "";

        if (nodo.carpeta && Array.isArray(nodo.archivos)) {
            const contexto = nodo.etiqueta
                ? `<span class="pw-unidad-carpeta-contexto">${escaparHtml(nodo.etiqueta)}</span>`
                : "";

            return `
                <details class="pw-unidad-carpeta">
                    <summary class="pw-unidad-carpeta-nombre">
                        <span class="pw-unidad-carpeta-chevron" aria-hidden="true">
                            <svg viewBox="0 0 24 24" focusable="false">
                                <path d="M9 7l5 5-5 5"></path>
                            </svg>
                        </span>
                        <strong>${escaparHtml(nodo.carpeta)}</strong>
                        ${contexto}
                    </summary>
                    <div class="pw-unidad-arbol-nivel pw-unidad-arbol-subnivel">
                        ${renderizarNodosUnidad(nodo.archivos)}
                    </div>
                </details>
            `;
        }

        if (nodo.ruta) {
            return renderizarArchivoUnidad(nodo);
        }

        return "";
    }

    function renderizarArchivoUnidad(archivo) {
        const tipoReal = String(
            archivo.tipo || obtenerTipoDesdeRuta(archivo.ruta) || "archivo"
        ).toLowerCase();
        const tipos = {
            markdown: "MD",
            md: "MD",
            txt: "TXT",
            html: "HTML",
            css: "CSS",
            js: "JS",
            json: "JSON",
            drawio: "DRAWIO",
            png: "PNG",
            jpg: "JPG",
            jpeg: "JPG",
            gif: "GIF",
            webp: "WEBP",
            svg: "SVG",
            pdf: "PDF",
            pptx: "PPTX",
            ppt: "PPT",
            xml: "XML"
        };
        const tipo = tipos[tipoReal] || tipoReal.toUpperCase().slice(0, 8);
        const href = generarRutaVisorArchivoUnidad({
            ...archivo,
            tipo: tipoReal
        });
        const etiqueta = archivo.etiqueta
            ? `<span class="pw-unidad-archivo-etiqueta">${escaparHtml(archivo.etiqueta)}</span>`
            : "";

        return `
            <a class="pw-unidad-archivo" href="${href}" role="treeitem">
                <span class="pw-unidad-archivo-tipo">${tipo}</span>
                <span class="pw-unidad-archivo-datos">
                    <span class="pw-unidad-archivo-nombre">${escaparHtml(archivo.nombre)}</span>
                    ${etiqueta}
                </span>
                <span class="pw-unidad-archivo-accion">Abrir</span>
            </a>
        `;
    }

    function generarRutaVisorArchivoUnidad(archivo) {
        const rutaAbsoluta = new URL(archivo.ruta, window.location.href).href;
        const parametros = new URLSearchParams({
            archivo: rutaAbsoluta,
            tipo: archivo.tipo,
            titulo: archivo.nombre
        });

        return `vistas/trabajo.html?${parametros.toString()}`;
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
        if (["pdf", "pptx", "ppt"].includes(tipo)) return "Documentos";
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
            pdf: "PDF",
            pptx: "PPTX",
            ppt: "PPT"
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
