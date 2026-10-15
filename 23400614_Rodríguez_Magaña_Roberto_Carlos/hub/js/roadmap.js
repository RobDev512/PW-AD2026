let fasesRoadmap = [];
let configuracionRoadmap = null;

let filtroRoadmapActual = "todos";
let vistaRoadmapActual = "mapa";

let controlesRoadmapConfigurados = false;
let promesaRoadmap = null;

document.addEventListener(
    "DOMContentLoaded",
    cargarRoadmap
);

async function cargarRoadmap() {
    const contenedor = document.getElementById(
        "roadmap-contenedor"
    );

    if (!contenedor) {
        return;
    }

    try {
        await asegurarDatosRoadmap();

        configurarControlesRoadmap();
        actualizarResumenRoadmap();
        renderizarRoadmap();
    }
    catch (error) {
        console.error(error);

        contenedor.innerHTML = `
            <p class="error-carga">
                No fue posible cargar el roadmap.
            </p>
        `;
    }
}

async function asegurarDatosRoadmap() {
    if (
        fasesRoadmap.length &&
        configuracionRoadmap
    ) {
        return;
    }

    if (promesaRoadmap) {
        return promesaRoadmap;
    }

    promesaRoadmap = Promise.all([
        fetch("data/roadmap.json"),
        fetch("docs/ROADMAP.md")
    ]).then(
        async ([
            respuestaConfig,
            respuestaMarkdown
        ]) => {
            if (!respuestaMarkdown.ok) {
                throw new Error(
                    "No fue posible cargar ROADMAP.md"
                );
            }

            configuracionRoadmap =
                respuestaConfig.ok
                    ? await respuestaConfig.json()
                    : crearConfiguracionRoadmapPredeterminada();

            const markdown =
                await respuestaMarkdown.text();

            fasesRoadmap =
                parsearRoadmap(markdown);

            vistaRoadmapActual =
                configuracionRoadmap
                    .vistaPredeterminada ||
                "mapa";
        }
    );

    return promesaRoadmap;
}

function crearConfiguracionRoadmapPredeterminada() {
    return {
        vistaPredeterminada: "mapa",
        expandirEstados: ["desarrollo"],
        ramas: {}
    };
}

function parsearRoadmap(markdown) {
    const encabezados = [
        ...markdown.matchAll(
            /^#\s+Fase\s+(\d+)\s*-\s*(.+)$/gm
        )
    ];

    return encabezados.map(
        (coincidencia, indice) => {
            const inicio = coincidencia.index;

            const fin =
                indice + 1 < encabezados.length
                    ? encabezados[indice + 1].index
                    : encontrarFinFasesRoadmap(
                        markdown,
                        inicio
                    );

            const bloque = markdown
                .slice(inicio, fin)
                .trim();

            const estadoOriginal =
                datoRoadmap(
                    bloque,
                    "Estado"
                ) || "Planeada";

            const secciones =
                extraerSeccionesRoadmap(
                    bloque
                );

            const objetivo =
                secciones.find(
                    seccion =>
                        normalizarTextoRoadmap(
                            seccion.titulo
                        ) === "objetivo"
                )?.contenido || "";

            return {
                numero:
                    Number(coincidencia[1]),

                titulo:
                    coincidencia[2].trim(),

                estado:
                    normalizarEstadoRoadmap(
                        estadoOriginal
                    ),

                estadoTexto:
                    estadoOriginal,

                objetivo:
                    limpiarMarkdownRoadmap(
                        objetivo
                    ),

                secciones
            };
        }
    );
}

function encontrarFinFasesRoadmap(
    markdown,
    inicio
) {
    const resto =
        markdown.slice(inicio);

    const coincidencia = resto.match(
        /\n#\s+Estado actual del roadmap\b/i
    );

    return coincidencia
        ? inicio + coincidencia.index
        : markdown.length;
}

function datoRoadmap(
    bloque,
    campo
) {
    const resultado = bloque.match(
        new RegExp(
            `\\*\\*${campo}:\\*\\*\\s*([^\\n]+)`,
            "i"
        )
    );

    return resultado
        ? resultado[1].trim()
        : "";
}

function extraerSeccionesRoadmap(bloque) {
    const coincidencias = [
        ...bloque.matchAll(
            /^##\s+(.+)$/gm
        )
    ];

    return coincidencias.map(
        (coincidencia, indice) => {
            const inicio =
                coincidencia.index +
                coincidencia[0].length;

            const fin =
                indice + 1 <
                coincidencias.length
                    ? coincidencias[
                        indice + 1
                    ].index
                    : bloque.length;

            const titulo =
                coincidencia[1].trim();

            const contenido = bloque
                .slice(inicio, fin)
                .replace(
                    /^---\s*$/gm,
                    ""
                )
                .trim();

            const estructura =
                descomponerContenidoRoadmap(
                    contenido
                );

            return {
                titulo,
                contenido,
                tipo:
                    tipoRamaRoadmap(
                        titulo
                    ),
                introduccion:
                    estructura.introduccion,
                items:
                    estructura.items
            };
        }
    );
}

function descomponerContenidoRoadmap(
    contenido
) {
    const lineas = String(
        contenido || ""
    ).split(/\r?\n/);

    const introduccion = [];
    const items = [];

    let parrafoActual = [];

    function guardarParrafo() {
        const texto = parrafoActual
            .join(" ")
            .trim();

        if (texto) {
            introduccion.push(texto);
        }

        parrafoActual = [];
    }

    lineas.forEach(linea => {
        const matchItem = linea.match(
            /^\s*-\s+(?:\[(x|X| )\]\s*)?(.+)$/
        );

        if (matchItem) {
            guardarParrafo();

            items.push({
                completado:
                    Boolean(
                        matchItem[1] &&
                        matchItem[1]
                            .toLowerCase() === "x"
                    ),
                esTarea:
                    typeof matchItem[1] !==
                    "undefined",
                texto:
                    matchItem[2].trim()
            });

            return;
        }

        if (!linea.trim()) {
            guardarParrafo();
            return;
        }

        parrafoActual.push(
            linea.trim()
        );
    });

    guardarParrafo();

    return {
        introduccion,
        items
    };
}

function tipoRamaRoadmap(titulo) {
    const ramas =
        configuracionRoadmap
            ?.ramas || {};

    const clave =
        Object.keys(ramas).find(
            nombre =>
                normalizarTextoRoadmap(
                    nombre
                ) ===
                normalizarTextoRoadmap(
                    titulo
                )
        );

    return clave
        ? ramas[clave].tipo
        : "neutral";
}

function etiquetaRamaRoadmap(titulo) {
    const ramas =
        configuracionRoadmap
            ?.ramas || {};

    const clave =
        Object.keys(ramas).find(
            nombre =>
                normalizarTextoRoadmap(
                    nombre
                ) ===
                normalizarTextoRoadmap(
                    titulo
                )
        );

    return clave
        ? ramas[clave].etiqueta
        : titulo;
}

function normalizarEstadoRoadmap(estado) {
    const valor =
        normalizarTextoRoadmap(
            estado
        );

    if (valor.includes("complet")) {
        return "completada";
    }

    if (
        valor.includes("desarrollo") ||
        valor.includes("progreso") ||
        valor.includes("actual")
    ) {
        return "desarrollo";
    }

    if (
        valor.includes("vision futura") ||
        valor.includes("futuro") ||
        valor.includes("futura")
    ) {
        return "futura";
    }

    return "planeada";
}

function configurarControlesRoadmap() {
    if (
        controlesRoadmapConfigurados
    ) {
        return;
    }

    controlesRoadmapConfigurados = true;

    document
        .querySelectorAll(
            "[data-roadmap-filtro]"
        )
        .forEach(boton => {
            boton.addEventListener(
                "click",
                () => {
                    document
                        .querySelectorAll(
                            "[data-roadmap-filtro]"
                        )
                        .forEach(
                            elemento =>
                                elemento
                                    .classList
                                    .remove(
                                        "activo"
                                    )
                        );

                    boton.classList.add(
                        "activo"
                    );

                    filtroRoadmapActual =
                        boton.dataset
                            .roadmapFiltro;

                    renderizarRoadmap();
                }
            );
        });

    document
        .querySelectorAll(
            "[data-roadmap-vista]"
        )
        .forEach(boton => {
            boton.addEventListener(
                "click",
                () => {
                    document
                        .querySelectorAll(
                            "[data-roadmap-vista]"
                        )
                        .forEach(
                            elemento =>
                                elemento
                                    .classList
                                    .remove(
                                        "activo"
                                    )
                        );

                    boton.classList.add(
                        "activo"
                    );

                    vistaRoadmapActual =
                        boton.dataset
                            .roadmapVista;

                    renderizarRoadmap();
                }
            );
        });
}

function actualizarResumenRoadmap() {
    const completadas =
        fasesRoadmap.filter(
            fase =>
                fase.estado ===
                "completada"
        ).length;

    const desarrollo =
        fasesRoadmap.filter(
            fase =>
                fase.estado ===
                "desarrollo"
        ).length;

    const futuras =
        fasesRoadmap.filter(
            fase =>
                [
                    "planeada",
                    "futura"
                ].includes(
                    fase.estado
                )
        ).length;

    const porcentaje =
        fasesRoadmap.length
            ? Math.round(
                completadas /
                fasesRoadmap.length *
                100
            )
            : 0;

    asignarRoadmap(
        "roadmap-total",
        fasesRoadmap.length
    );

    asignarRoadmap(
        "roadmap-completadas",
        completadas
    );

    asignarRoadmap(
        "roadmap-desarrollo",
        desarrollo
    );

    asignarRoadmap(
        "roadmap-futuras",
        futuras
    );

    asignarRoadmap(
        "roadmap-porcentaje",
        `${porcentaje}%`
    );

    const barra =
        document.getElementById(
            "roadmap-barra-progreso"
        );

    if (barra) {
        barra.style.width =
            `${porcentaje}%`;
    }
}

function fasesRoadmapVisibles() {
    if (
        filtroRoadmapActual ===
        "todos"
    ) {
        return fasesRoadmap;
    }

    return fasesRoadmap.filter(
        fase =>
            fase.estado ===
            filtroRoadmapActual
    );
}

function renderizarRoadmap() {
    const mapa =
        document.getElementById(
            "roadmap-contenedor"
        );

    const timeline =
        document.getElementById(
            "roadmap-timeline"
        );

    if (!mapa || !timeline) {
        return;
    }

    const fases =
        fasesRoadmapVisibles();

    if (
        vistaRoadmapActual ===
        "timeline"
    ) {
        mapa.hidden = true;
        timeline.hidden = false;

        renderizarTimelineRoadmap(
            fases
        );

        return;
    }

    mapa.hidden = false;
    timeline.hidden = true;

    renderizarMapaRoadmapEn(
        mapa,
        fases,
        {
            documento: false,
            expandirTodo: false
        }
    );
}

function renderizarMapaRoadmapEn(
    contenedor,
    fases,
    opciones = {}
) {
    contenedor.innerHTML = "";

    if (!fases.length) {
        contenedor.innerHTML = `
            <p class="estado-carga">
                No hay fases en este filtro.
            </p>
        `;

        return;
    }

    const mapa =
        document.createElement(
            "div"
        );

    mapa.className =
        opciones.documento
            ? "roadmap-mapa roadmap-mapa-documento"
            : "roadmap-mapa";

    fases.forEach(fase => {
        mapa.appendChild(
            crearNodoRoadmap(
                fase,
                opciones
            )
        );
    });

    contenedor.appendChild(mapa);

    configurarConectoresRoadmap(
        mapa
    );
}

function crearNodoRoadmap(
    fase,
    opciones
) {
    const nodo =
        document.createElement(
            "article"
        );

    nodo.className =
        `roadmap-mapa-nodo ${fase.estado}`;

    nodo.dataset.faseRoadmap =
        fase.numero;

    const expandido =
        opciones.expandirTodo ||
        debeExpandirseRoadmap(
            fase
        );

    if (expandido) {
        nodo.classList.add(
            "expandido"
        );
    }

    const eje =
        document.createElement(
            "div"
        );

    eje.className =
        "roadmap-mapa-eje";

    eje.innerHTML = `
        <span>
            ${fase.numero}
        </span>
    `;

    const principal =
        document.createElement(
            "button"
        );

    principal.type = "button";
    principal.className =
        "roadmap-nodo-principal";

    principal.setAttribute(
        "aria-expanded",
        String(expandido)
    );

    principal.innerHTML = `
        <span class="roadmap-nodo-kicker">
            Fase ${fase.numero}
        </span>

        <span class="roadmap-nodo-titulo">
            ${escaparHtmlRoadmap(
                fase.titulo
            )}
        </span>

        <span class="roadmap-nodo-pie">
            <span class="roadmap-estado">
                ${escaparHtmlRoadmap(
                    fase.estadoTexto
                )}
            </span>

            <span
                class="roadmap-nodo-toggle"
                aria-hidden="true"
            >
                ${expandido ? "−" : "+"}
            </span>
        </span>
    `;

    const ramas =
        document.createElement(
            "div"
        );

    ramas.className =
        "roadmap-ramas";

    const secciones =
        fase.secciones.length
            ? fase.secciones
            : [
                {
                    titulo: "Objetivo",
                    contenido:
                        fase.objetivo ||
                        "Evolución documentada del Hub.",
                    tipo: "objetivo",
                    introduccion: [
                        fase.objetivo ||
                        "Evolución documentada del Hub."
                    ],
                    items: []
                }
            ];

    secciones.forEach(
        (seccion, indice) => {
            ramas.appendChild(
                crearRamaRoadmap(
                    seccion,
                    indice
                )
            );
        }
    );

    principal.addEventListener(
        "click",
        () => {
            const abierto =
                nodo.classList.toggle(
                    "expandido"
                );

            principal.setAttribute(
                "aria-expanded",
                String(abierto)
            );

            const control =
                principal.querySelector(
                    ".roadmap-nodo-toggle"
                );

            if (control) {
                control.textContent =
                    abierto
                        ? "−"
                        : "+";
            }

            const mapaActual =
                nodo.closest(
                    ".roadmap-mapa"
                );

            if (mapaActual) {
                solicitarDibujoConectoresRoadmap(
                    mapaActual
                );

                setTimeout(
                    () =>
                        solicitarDibujoConectoresRoadmap(
                            mapaActual
                        ),
                    90
                );

                setTimeout(
                    () =>
                        solicitarDibujoConectoresRoadmap(
                            mapaActual
                        ),
                    480
                );
            }
        }
    );

    nodo.append(
        eje,
        principal,
        ramas
    );

    return nodo;
}

function crearRamaRoadmap(
    seccion,
    indice
) {
    const rama =
        document.createElement(
            "section"
        );

    rama.className =
        `roadmap-rama ${
            seccion.tipo ||
            "neutral"
        }`;

    rama.style.setProperty(
        "--roadmap-rama-indice",
        indice
    );

    const cabecera =
        document.createElement(
            "div"
        );

    cabecera.className =
        "roadmap-rama-cabecera";

    cabecera.innerHTML = `
        <span
            class="roadmap-rama-punto"
        ></span>

        <h4>
            ${escaparHtmlRoadmap(
                etiquetaRamaRoadmap(
                    seccion.titulo
                )
            )}
        </h4>
    `;

    const cuerpo =
        document.createElement(
            "div"
        );

    cuerpo.className =
        "roadmap-rama-cuerpo";

    if (
        seccion.introduccion &&
        seccion.introduccion.length
    ) {
        seccion.introduccion.forEach(
            parrafo => {
                const hojaTexto =
                    document.createElement(
                        "div"
                    );

                hojaTexto.className =
                    "roadmap-hoja roadmap-hoja-texto";

                hojaTexto.innerHTML = `
                    <span class="roadmap-hoja-punto"></span>

                    <div>
                        ${
                            window.marked
                                ? marked.parse(parrafo)
                                : `<p>${escaparHtmlRoadmap(parrafo)}</p>`
                        }
                    </div>
                `;

                cuerpo.appendChild(
                    hojaTexto
                );
            }
        );
    }

    if (
        seccion.items &&
        seccion.items.length
    ) {
        seccion.items.forEach(
            (item, itemIndice) => {
                cuerpo.appendChild(
                    crearHojaRoadmap(
                        item,
                        seccion,
                        itemIndice
                    )
                );
            }
        );
    }

    if (!cuerpo.children.length) {
        const hojaTexto =
            document.createElement(
                "div"
            );

        hojaTexto.className =
            "roadmap-hoja roadmap-hoja-texto";

        hojaTexto.innerHTML = `
            <span class="roadmap-hoja-punto"></span>

            <div>
                ${
                    window.marked
                        ? marked.parse(
                            seccion.contenido
                        )
                        : `<p>${escaparHtmlRoadmap(
                            limpiarMarkdownRoadmap(
                                seccion.contenido
                            )
                        )}</p>`
                }
            </div>
        `;

        cuerpo.appendChild(
            hojaTexto
        );
    }

    rama.append(
        cabecera,
        cuerpo
    );

    return rama;
}

function crearHojaRoadmap(
    item,
    seccion,
    indice
) {
    const hoja =
        document.createElement(
            "div"
        );

    const tipo =
        item.esTarea
            ? (
                item.completado
                    ? "completada"
                    : (
                        seccion.tipo ===
                        "desarrollo"
                            ? "desarrollo"
                            : "pendiente"
                    )
            )
            : (
                seccion.tipo ||
                "neutral"
            );

    hoja.className =
        `roadmap-hoja ${tipo}`;

    hoja.dataset.itemRoadmap =
        indice + 1;

    const htmlTexto =
        window.marked
            ? marked.parseInline(
                item.texto
            )
            : escaparHtmlRoadmap(
                item.texto
            );

    if (item.esTarea) {
        hoja.classList.add(
            "roadmap-hoja-tarea"
        );

        const icono =
            item.completado
                ? "✓"
                : "•";

        hoja.innerHTML = `
            <span
                class="roadmap-hoja-icono"
                aria-hidden="true"
            >
                ${icono}
            </span>

            <p>
                ${htmlTexto}
            </p>
        `;
    }
    else {
        hoja.classList.add(
            "roadmap-hoja-texto"
        );

        hoja.innerHTML = `
            <span
                class="roadmap-hoja-punto"
                aria-hidden="true"
            ></span>

            <p>
                ${htmlTexto}
            </p>
        `;
    }

    return hoja;
}

function debeExpandirseRoadmap(
    fase
) {
    const estados =
        configuracionRoadmap
            ?.expandirEstados ||
        ["desarrollo"];

    return estados.includes(
        fase.estado
    );
}

function renderizarTimelineRoadmap(
    fases
) {
    const contenedor =
        document.getElementById(
            "roadmap-timeline"
        );

    contenedor.innerHTML = "";

    if (!fases.length) {
        contenedor.innerHTML = `
            <p class="estado-carga">
                No hay fases en este filtro.
            </p>
        `;

        return;
    }

    fases.forEach(fase => {
        const item =
            document.createElement(
                "article"
            );

        item.className =
            `roadmap-timeline-item ${fase.estado}`;

        item.innerHTML = `
            <div class="roadmap-timeline-numero">
                ${fase.numero}
            </div>

            <div>
                <p class="roadmap-timeline-kicker">
                    ${escaparHtmlRoadmap(
                        fase.estadoTexto
                    )}
                </p>

                <h3>
                    Fase ${fase.numero} ·
                    ${escaparHtmlRoadmap(
                        fase.titulo
                    )}
                </h3>

                <p>
                    ${escaparHtmlRoadmap(
                        fase.objetivo ||
                        "Evolución documentada del Hub académico."
                    )}
                </p>
            </div>
        `;

        contenedor.appendChild(
            item
        );
    });
}

async function renderizarRoadmapDocumento(
    contenedor
) {
    await asegurarDatosRoadmap();

    contenedor.innerHTML = "";

    const introduccion =
        document.createElement(
            "div"
        );

    introduccion.className =
        "roadmap-documento-intro";

    const completadas =
        fasesRoadmap.filter(
            fase =>
                fase.estado ===
                "completada"
        ).length;

    introduccion.innerHTML = `
        <div>
            <p class="roadmap-documento-kicker">
                Mapa completo
            </p>

            <h4>
                Evolución técnica de PW Hub
            </h4>

            <p class="roadmap-documento-ayuda">
                Cada fase se divide en ramas y cada viñeta
                se representa como una subrama independiente.
            </p>
        </div>

        <div class="roadmap-documento-resumen">
            <span>
                <strong>${completadas}</strong>
                completadas
            </span>

            <span>
                <strong>${fasesRoadmap.length}</strong>
                fases
            </span>
        </div>
    `;

    const mapaCompleto =
        document.createElement(
            "div"
        );

    mapaCompleto.className =
        "roadmap-documento-contenedor";

    contenedor.append(
        introduccion,
        mapaCompleto
    );

    renderizarMapaRoadmapEn(
        mapaCompleto,
        fasesRoadmap,
        {
            documento: true,
            expandirTodo: true
        }
    );
}

/* =========================================================
   CONECTORES CANVAS
   Dibuja el árbol directamente sobre un <canvas> superpuesto
   al roadmap. Las posiciones se calculan desde los elementos
   reales del DOM, por lo que las líneas se adaptan al layout.
   ========================================================= */

const mapasRoadmapCanvas =
    new Set();

let frameRoadmapCanvas = null;
let resizeRoadmapCanvasConfigurado = false;

function configurarConectoresRoadmap(
    mapa
) {
    if (!mapa) {
        return;
    }

    mapasRoadmapCanvas.add(mapa);

    let canvas =
        mapa.querySelector(
            ":scope > .roadmap-conectores-canvas"
        );

    if (!canvas) {
        canvas =
            document.createElement(
                "canvas"
            );

        canvas.className =
            "roadmap-conectores-canvas";

        canvas.setAttribute(
            "aria-hidden",
            "true"
        );

        mapa.prepend(canvas);
    }

    if (
        typeof ResizeObserver !==
        "undefined"
    ) {
        const observador =
            new ResizeObserver(
                () => {
                    solicitarDibujoConectoresRoadmap(
                        mapa
                    );
                }
            );

        observador.observe(mapa);

        mapa._observadorRoadmapCanvas =
            observador;
    }

    if (
        !resizeRoadmapCanvasConfigurado
    ) {
        resizeRoadmapCanvasConfigurado =
            true;

        window.addEventListener(
            "resize",
            () => {
                solicitarDibujoConectoresRoadmap();
            },
            {
                passive: true
            }
        );
    }

    solicitarDibujoConectoresRoadmap(
        mapa
    );
}

function solicitarDibujoConectoresRoadmap(
    mapaEspecifico = null
) {
    if (mapaEspecifico) {
        mapasRoadmapCanvas.add(
            mapaEspecifico
        );
    }

    if (frameRoadmapCanvas) {
        cancelAnimationFrame(
            frameRoadmapCanvas
        );
    }

    frameRoadmapCanvas =
        requestAnimationFrame(
            () => {
                frameRoadmapCanvas = null;

                [
                    ...mapasRoadmapCanvas
                ].forEach(mapa => {
                    if (!mapa.isConnected) {
                        if (
                            mapa._observadorRoadmapCanvas
                        ) {
                            mapa
                                ._observadorRoadmapCanvas
                                .disconnect();
                        }

                        mapasRoadmapCanvas
                            .delete(mapa);

                        return;
                    }

                    dibujarConectoresRoadmap(
                        mapa
                    );
                });
            }
        );
}

function dibujarConectoresRoadmap(
    mapa
) {
    const canvas =
        mapa.querySelector(
            ":scope > .roadmap-conectores-canvas"
        );

    if (!canvas) {
        return;
    }

    const rectMapa =
        mapa.getBoundingClientRect();

    const ancho =
        Math.max(
            1,
            Math.ceil(
                mapa.scrollWidth
            ),
            Math.ceil(
                rectMapa.width
            )
        );

    const alto =
        Math.max(
            1,
            Math.ceil(
                mapa.scrollHeight
            ),
            Math.ceil(
                rectMapa.height
            )
        );

    const dpr =
        Math.max(
            1,
            window.devicePixelRatio || 1
        );

    canvas.style.width =
        `${ancho}px`;

    canvas.style.height =
        `${alto}px`;

    canvas.width =
        Math.round(
            ancho * dpr
        );

    canvas.height =
        Math.round(
            alto * dpr
        );

    const contexto =
        canvas.getContext("2d");

    if (!contexto) {
        return;
    }

    contexto.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    contexto.clearRect(
        0,
        0,
        ancho,
        alto
    );

    contexto.lineCap =
        "round";

    contexto.lineJoin =
        "round";

    const nodos = [
        ...mapa.querySelectorAll(
            ".roadmap-mapa-nodo"
        )
    ];

    dibujarEjePrincipalCanvas(
        contexto,
        mapa,
        nodos
    );

    nodos.forEach(nodo => {
        dibujarArbolFaseCanvas(
            contexto,
            mapa,
            nodo
        );
    });
}

function dibujarEjePrincipalCanvas(
    contexto,
    mapa,
    nodos
) {
    const puntos = nodos
        .map(nodo =>
            nodo.querySelector(
                ":scope > .roadmap-mapa-eje span"
            )
        )
        .filter(Boolean)
        .map(elemento =>
            geometriaRoadmapCanvas(
                elemento,
                mapa
            )
        )
        .filter(Boolean);

    if (puntos.length < 2) {
        return;
    }

    const x =
        promedioRoadmapCanvas(
            puntos.map(
                punto => punto.cx
            )
        );

    dibujarLineaCanvas(
        contexto,
        [
            {
                x,
                y: puntos[0].cy
            },
            {
                x,
                y:
                    puntos[
                        puntos.length - 1
                    ].cy
            }
        ],
        colorRoadmapCanvas(
            "eje"
        ),
        2
    );
}

function dibujarArbolFaseCanvas(
    contexto,
    mapa,
    nodo
) {
    const circulo =
        nodo.querySelector(
            ":scope > .roadmap-mapa-eje span"
        );

    const principal =
        nodo.querySelector(
            ":scope > .roadmap-nodo-principal"
        );

    if (
        !circulo ||
        !principal
    ) {
        return;
    }

    const geoCirculo =
        geometriaRoadmapCanvas(
            circulo,
            mapa
        );

    const geoPrincipal =
        geometriaRoadmapCanvas(
            principal,
            mapa
        );

    if (
        !geoCirculo ||
        !geoPrincipal
    ) {
        return;
    }

    dibujarConexionNodoCanvas(
        contexto,
        geoCirculo,
        geoPrincipal,
        colorRoadmapCanvas(
            "fase"
        ),
        1.2
    );

    if (
        !nodo.classList.contains(
            "expandido"
        )
    ) {
        return;
    }

    const ramas = [
        ...nodo.querySelectorAll(
            ":scope > .roadmap-ramas > .roadmap-rama"
        )
    ];

    const categorias = ramas
        .map(rama => ({
            rama,
            cabecera:
                rama.querySelector(
                    ":scope > .roadmap-rama-cabecera"
                )
        }))
        .filter(
            item => item.cabecera
        );

    /*
       Tronco compartido entre la fase y TODAS sus categorías.
       No se dibuja una ruta separada por categoría.
    */
    dibujarTroncoCompartidoCanvas(
        contexto,
        mapa,
        geoPrincipal,
        categorias.map(
            item => item.cabecera
        ),
        colorRoadmapCanvas(
            "categoria"
        ),
        1.25,
        32
    );

    categorias.forEach(
        ({ rama, cabecera }) => {
            const geoCabecera =
                geometriaRoadmapCanvas(
                    cabecera,
                    mapa
                );

            if (!geoCabecera) {
                return;
            }

            const hojas = [
                ...rama.querySelectorAll(
                    ":scope > .roadmap-rama-cuerpo > .roadmap-hoja"
                )
            ];

            if (!hojas.length) {
                return;
            }

            /*
               Cada categoría tiene UN solo tronco.
               Todas las viñetas salen de ese tronco.
            */
            dibujarTroncoCompartidoCanvas(
                contexto,
                mapa,
                geoCabecera,
                hojas,
                colorRoadmapCanvas(
                    obtenerTipoRamaRoadmapCanvas(
                        rama
                    )
                ),
                1.15,
                28
            );
        }
    );
}

function dibujarConexionNodoCanvas(
    contexto,
    desde,
    hacia,
    color,
    grosor
) {
    const haciaDerecha =
        hacia.cx >= desde.cx;

    const inicioX =
        haciaDerecha
            ? desde.right
            : desde.left;

    const finX =
        haciaDerecha
            ? hacia.left
            : hacia.right;

    /*
       Si el centro del círculo queda dentro de la altura
       de la tarjeta, la conexión puede ser completamente
       horizontal. Esto evita el pequeño tramo vertical que
       se veía pegado al borde izquierdo de la tarjeta.
    */
    const haySuperposicionVertical =
        desde.cy >= hacia.top &&
        desde.cy <= hacia.bottom;

    if (haySuperposicionVertical) {
        dibujarLineaCanvas(
            contexto,
            [
                {
                    x: inicioX,
                    y: desde.cy
                },
                {
                    x: finX,
                    y: desde.cy
                }
            ],
            color,
            grosor
        );

        return;
    }

    const medioX =
        (
            inicioX +
            finX
        ) / 2;

    dibujarLineaCanvas(
        contexto,
        [
            {
                x: inicioX,
                y: desde.cy
            },
            {
                x: medioX,
                y: desde.cy
            },
            {
                x: medioX,
                y: hacia.cy
            },
            {
                x: finX,
                y: hacia.cy
            }
        ],
        color,
        grosor
    );
}

function dibujarTroncoCompartidoCanvas(
    contexto,
    mapa,
    padre,
    hijosElementos,
    color,
    grosor,
    desplazamiento
) {
    const hijos =
        hijosElementos
            .map(elemento =>
                geometriaRoadmapCanvas(
                    elemento,
                    mapa
                )
            )
            .filter(Boolean);

    if (!hijos.length) {
        return;
    }

    const primerHijo =
        hijos[0];

    const ultimoHijo =
        hijos[
            hijos.length - 1
        ];

    const apilados =
        primerHijo.top >=
        padre.bottom - 2;

    if (apilados) {
        dibujarTroncoVerticalCanvas(
            contexto,
            padre,
            hijos,
            color,
            grosor,
            desplazamiento
        );

        return;
    }

    dibujarTroncoLateralCanvas(
        contexto,
        padre,
        hijos,
        color,
        grosor
    );
}

function dibujarTroncoVerticalCanvas(
    contexto,
    padre,
    hijos,
    color,
    grosor,
    desplazamiento
) {
    const primerHijo =
        hijos[0];

    const ultimoHijo =
        hijos[
            hijos.length - 1
        ];

    /*
       El tronco arranca EXACTAMENTE en el borde inferior
       del padre y llega hasta el centro del último hijo.
    */
    let troncoX =
        padre.left +
        desplazamiento;

    const limite =
        primerHijo.left - 12;

    troncoX =
        Math.min(
            troncoX,
            limite
        );

    troncoX =
        Math.max(
            padre.left + 10,
            troncoX
        );

    dibujarLineaCanvas(
        contexto,
        [
            {
                x: troncoX,
                y: padre.bottom
            },
            {
                x: troncoX,
                y: ultimoHijo.cy
            }
        ],
        color,
        grosor
    );

    hijos.forEach(hijo => {
        dibujarLineaCanvas(
            contexto,
            [
                {
                    x: troncoX,
                    y: hijo.cy
                },
                {
                    x: hijo.left,
                    y: hijo.cy
                }
            ],
            color,
            grosor
        );
    });
}

function dibujarTroncoLateralCanvas(
    contexto,
    padre,
    hijos,
    color,
    grosor
) {
    const primerHijo =
        hijos[0];

    const ultimoHijo =
        hijos[
            hijos.length - 1
        ];

    const haciaDerecha =
        primerHijo.cx >=
        padre.cx;

    const inicioX =
        haciaDerecha
            ? padre.right
            : padre.left;

    const finX =
        haciaDerecha
            ? primerHijo.left
            : primerHijo.right;

    const troncoX =
        (
            inicioX +
            finX
        ) / 2;

    dibujarLineaCanvas(
        contexto,
        [
            {
                x: inicioX,
                y: padre.cy
            },
            {
                x: troncoX,
                y: padre.cy
            },
            {
                x: troncoX,
                y: ultimoHijo.cy
            }
        ],
        color,
        grosor
    );

    hijos.forEach(hijo => {
        dibujarLineaCanvas(
            contexto,
            [
                {
                    x: troncoX,
                    y: hijo.cy
                },
                {
                    x:
                        haciaDerecha
                            ? hijo.left
                            : hijo.right,
                    y: hijo.cy
                }
            ],
            color,
            grosor
        );
    });
}

function dibujarLineaCanvas(
    contexto,
    puntos,
    color,
    grosor
) {
    if (
        !puntos ||
        puntos.length < 2
    ) {
        return;
    }

    contexto.save();

    contexto.strokeStyle =
        color;

    contexto.lineWidth =
        grosor;

    contexto.beginPath();

    contexto.moveTo(
        alinearPixelCanvas(
            puntos[0].x,
            grosor
        ),
        alinearPixelCanvas(
            puntos[0].y,
            grosor
        )
    );

    for (
        let i = 1;
        i < puntos.length;
        i += 1
    ) {
        contexto.lineTo(
            alinearPixelCanvas(
                puntos[i].x,
                grosor
            ),
            alinearPixelCanvas(
                puntos[i].y,
                grosor
            )
        );
    }

    contexto.stroke();
    contexto.restore();
}

function geometriaRoadmapCanvas(
    elemento,
    mapa
) {
    if (
        !elemento ||
        !mapa
    ) {
        return null;
    }

    const estilo =
        window.getComputedStyle(
            elemento
        );

    if (
        estilo.display === "none" ||
        estilo.visibility === "hidden"
    ) {
        return null;
    }

    const rect =
        elemento.getBoundingClientRect();

    const base =
        mapa.getBoundingClientRect();

    if (
        rect.width === 0 &&
        rect.height === 0
    ) {
        return null;
    }

    const left =
        rect.left -
        base.left +
        mapa.scrollLeft;

    const top =
        rect.top -
        base.top +
        mapa.scrollTop;

    return {
        left,
        top,
        right:
            left +
            rect.width,
        bottom:
            top +
            rect.height,
        width:
            rect.width,
        height:
            rect.height,
        cx:
            left +
            rect.width / 2,
        cy:
            top +
            rect.height / 2
    };
}

function colorRoadmapCanvas(
    tipo
) {
    const estilos =
        getComputedStyle(
            document.documentElement
        );

    const azul =
        estilos
            .getPropertyValue(
                "--azul-claro"
            )
            .trim() ||
        "#35c9f3";

    const verde =
        estilos
            .getPropertyValue(
                "--verde"
            )
            .trim() ||
        "#49dda9";

    const colores = {
        eje:
            "rgba(53, 201, 243, 0.46)",

        fase:
            "rgba(113, 143, 163, 0.34)",

        categoria:
            "rgba(53, 201, 243, 0.28)",

        completada:
            colorConAlphaRoadmapCanvas(
                verde,
                0.55
            ),

        desarrollo:
            colorConAlphaRoadmapCanvas(
                azul,
                0.62
            ),

        planeada:
            "rgba(240, 189, 98, 0.55)",

        futura:
            "rgba(199, 167, 255, 0.52)",

        objetivo:
            "rgba(122, 151, 169, 0.34)",

        neutral:
            "rgba(122, 151, 169, 0.34)"
    };

    return colores[tipo] ||
        colores.neutral;
}

function colorConAlphaRoadmapCanvas(
    color,
    alpha
) {
    const valor =
        String(color || "")
            .trim();

    const hex =
        valor.match(
            /^#([0-9a-f]{6})$/i
        );

    if (hex) {
        const numero =
            parseInt(
                hex[1],
                16
            );

        const r =
            numero >> 16;

        const g =
            (
                numero >> 8
            ) & 255;

        const b =
            numero & 255;

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return valor;
}

function obtenerTipoRamaRoadmapCanvas(
    rama
) {
    const tipos = [
        "completada",
        "desarrollo",
        "planeada",
        "futura",
        "objetivo",
        "neutral"
    ];

    return tipos.find(
        tipo =>
            rama.classList.contains(
                tipo
            )
    ) || "neutral";
}

function promedioRoadmapCanvas(
    valores
) {
    if (!valores.length) {
        return 0;
    }

    return valores.reduce(
        (total, valor) =>
            total + valor,
        0
    ) / valores.length;
}

function alinearPixelCanvas(
    valor,
    grosor
) {
    /*
       Para líneas de 1px o cercanas a 1px, el .5 evita
       el desenfoque típico del canvas.
    */
    return grosor <= 1.5
        ? Math.round(valor) + .5
        : Math.round(valor);
}

function limpiarMarkdownRoadmap(
    texto
) {
    return String(
        texto || ""
    )
        .replace(
            /\[[ xX]\]\s*/g,
            ""
        )
        .replace(
            /[`*_>#]/g,
            ""
        )
        .replace(
            /^\s*-\s+/gm,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
}

function normalizarTextoRoadmap(
    texto
) {
    return String(
        texto || ""
    )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();
}

function asignarRoadmap(
    id,
    valor
) {
    const elemento =
        document.getElementById(
            id
        );

    if (elemento) {
        elemento.textContent =
            valor;
    }
}

function escaparHtmlRoadmap(
    texto
) {
    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(
            texto || ""
        );

    return div.innerHTML;
}

window.renderizarRoadmapDocumento =
    renderizarRoadmapDocumento;
