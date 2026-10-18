let actualizacionesRoadmap = [];
let configuracionRoadmap = null;

let filtroRoadmapActual = "todos";

let controlesRoadmapConfigurados = false;
let promesaRoadmap = null;


/*
   Estilo Markdown compartido del Hub.

   roadmap.js ya forma parte del shell global de index.html.
   Aprovechamos su carga para registrar una hoja dedicada que
   unifica el tema oscuro del visor de Documentación, las
   miniaturas Markdown por unidad y el modal de Vista previa.
*/
cargarEstilosMarkdownOscuroHub();


function cargarEstilosMarkdownOscuroHub() {
    if (
        document.querySelector(
            "link[data-pw-markdown-oscuro]"
        )
    ) {
        return;
    }

    const enlace =
        document.createElement(
            "link"
        );

    enlace.rel =
        "stylesheet";

    enlace.href =
        "css/markdown-oscuro.css?v=1";

    enlace.dataset.pwMarkdownOscuro =
        "true";

    document.head.appendChild(
        enlace
    );
}


document.addEventListener(
    "DOMContentLoaded",
    cargarRoadmap
);


async function cargarRoadmap() {
    const contenedor =
        document.getElementById(
            "roadmap-contenedor"
        );

    if (!contenedor) {
        return;
    }

    try {
        actualizarEtiquetasRoadmap();

        await asegurarDatosRoadmap();

        configurarControlesRoadmap();
        actualizarResumenRoadmap();
        renderizarRoadmap();
    } catch (error) {
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
        actualizacionesRoadmap.length &&
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

            actualizacionesRoadmap =
                parsearRoadmap(markdown);
        }
    );

    return promesaRoadmap;
}


function crearConfiguracionRoadmapPredeterminada() {
    return {
        expandirEstados: [
            "desarrollo"
        ],

        ramas: {}
    };
}


function parsearRoadmap(markdown) {
    const encabezados = [
        ...String(markdown || "")
            .matchAll(
                /^#\s+(v\d+\.\d+\.\d+)\s*-\s*(.+)$/gmi
            )
    ];

    return encabezados.map(
        (coincidencia, indice) => {
            const inicio =
                coincidencia.index;

            const fin =
                indice + 1 <
                    encabezados.length
                    ? encabezados[
                        indice + 1
                    ].index
                    : markdown.length;

            const bloque =
                markdown
                    .slice(
                        inicio,
                        fin
                    )
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
                    (seccion) =>
                        normalizarTextoRoadmap(
                            seccion.titulo
                        ) ===
                        "objetivo"
                )?.contenido || "";

            const version =
                normalizarVersionRoadmap(
                    coincidencia[1]
                );

            return {
                version,

                versionCorta:
                    versionCortaRoadmap(
                        version
                    ),

                titulo:
                    coincidencia[2]
                        .trim(),

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


function normalizarVersionRoadmap(
    version
) {
    const valor =
        String(version || "")
            .trim();

    return valor.startsWith("v")
        ? valor
        : `v${valor}`;
}


function versionCortaRoadmap(
    version
) {
    const coincidencia =
        String(version || "")
            .match(
                /^v(\d+)\.(\d+)/i
            );

    return coincidencia
        ? `${coincidencia[1]}.${coincidencia[2]}`
        : String(version || "")
            .replace(/^v/i, "");
}


function datoRoadmap(
    bloque,
    campo
) {
    const resultado =
        bloque.match(
            new RegExp(
                `\\*\\*${campo}:\\*\\*\\s*([^\\n]+)`,
                "i"
            )
        );

    return resultado
        ? resultado[1].trim()
        : "";
}


function extraerSeccionesRoadmap(
    bloque
) {
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
                coincidencia[1]
                    .trim();

            const contenido =
                bloque
                    .slice(
                        inicio,
                        fin
                    )
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
    const lineas =
        String(
            contenido || ""
        ).split(/\r?\n/);

    const introduccion = [];
    const items = [];

    let parrafoActual = [];

    function guardarParrafo() {
        const texto =
            parrafoActual
                .join(" ")
                .trim();

        if (texto) {
            introduccion.push(
                texto
            );
        }

        parrafoActual = [];
    }

    lineas.forEach(
        (linea) => {
            const matchItem =
                linea.match(
                    /^\s*-\s+(?:\[(x|X| )\]\s*)?(.+)$/
                );

            if (matchItem) {
                guardarParrafo();

                items.push({
                    completado:
                        Boolean(
                            matchItem[1] &&
                            matchItem[1]
                                .toLowerCase() ===
                                "x"
                        ),

                    esTarea:
                        typeof matchItem[1] !==
                        "undefined",

                    texto:
                        matchItem[2]
                            .trim()
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
        }
    );

    guardarParrafo();

    return {
        introduccion,
        items
    };
}


function tipoRamaRoadmap(
    titulo
) {
    const ramas =
        configuracionRoadmap
            ?.ramas || {};

    const clave =
        Object.keys(ramas)
            .find(
                (nombre) =>
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


function etiquetaRamaRoadmap(
    titulo
) {
    const ramas =
        configuracionRoadmap
            ?.ramas || {};

    const clave =
        Object.keys(ramas)
            .find(
                (nombre) =>
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


function normalizarEstadoRoadmap(
    estado
) {
    const valor =
        normalizarTextoRoadmap(
            estado
        );

    if (
        valor.includes(
            "public"
        ) ||
        valor.includes(
            "complet"
        ) ||
        valor.includes(
            "implement"
        )
    ) {
        return "completada";
    }

    if (
        valor.includes(
            "desarrollo"
        ) ||
        valor.includes(
            "progreso"
        ) ||
        valor.includes(
            "actual"
        )
    ) {
        return "desarrollo";
    }

    if (
        valor.includes(
            "vision futura"
        ) ||
        valor.includes(
            "futuro"
        ) ||
        valor.includes(
            "futura"
        )
    ) {
        return "futura";
    }

    return "planeada";
}


function actualizarEtiquetasRoadmap() {
    integrarChangelogDocumentacionRoadmap();

    /*
       El Roadmap conserva una sola representación visual.
       La cronología de hechos realizados ya pertenece a
       Historial y el detalle por versión a Changelog.
    */
    const controlesVista =
        document.querySelector(
            ".roadmap-vistas"
        );

    if (controlesVista) {
        controlesVista.remove();
    }

    const timeline =
        document.getElementById(
            "roadmap-timeline"
        );

    if (timeline) {
        timeline.remove();
    }

    const seccion =
        document.querySelector(
            ".seccion-roadmap"
        );

    if (seccion) {
        const descripcion =
            seccion.querySelector(
                ".titulo-seccion > p:last-child"
            );

        if (descripcion) {
            descripcion.textContent =
                "Mapa visual de la versión estable actual y de las actualizaciones planeadas para PW Hub.";
        }
    }

    const etiquetasResumen = {
        "roadmap-total":
            "Actualizaciones",

        "roadmap-completadas":
            "Publicadas",

        "roadmap-desarrollo":
            "En desarrollo",

        "roadmap-futuras":
            "Planeadas / futuras"
    };

    Object.entries(
        etiquetasResumen
    ).forEach(
        ([id, texto]) => {
            const valor =
                document.getElementById(
                    id
                );

            const etiqueta =
                valor?.parentElement
                    ?.querySelector("p");

            if (etiqueta) {
                etiqueta.textContent =
                    texto;
            }
        }
    );

    const etiquetaProgreso =
        document.querySelector(
            ".roadmap-progreso-cabecera span:first-child"
        );

    if (etiquetaProgreso) {
        etiquetaProgreso.textContent =
            "Progreso de actualizaciones";
    }

    const textosFiltros = {
        todos:
            "Todas",

        completada:
            "Publicadas",

        desarrollo:
            "En desarrollo",

        planeada:
            "Planeadas",

        futura:
            "Visión futura"
    };

    Object.entries(
        textosFiltros
    ).forEach(
        ([estado, texto]) => {
            const boton =
                document.querySelector(
                    `[data-roadmap-filtro="${estado}"]`
                );

            if (boton) {
                boton.textContent =
                    texto;
            }
        }
    );

    const tarjetaRoadmap =
        [
            ...document.querySelectorAll(
                ".tarjeta-documento"
            )
        ].find(
            (tarjeta) =>
                normalizarTextoRoadmap(
                    tarjeta.querySelector("h3")
                        ?.textContent
                ) ===
                "roadmap"
        );

    if (tarjetaRoadmap) {
        const descripcion =
            tarjetaRoadmap.querySelector(
                "h3 + p"
            );

        if (descripcion) {
            descripcion.textContent =
                "Fuente principal de las actualizaciones planeadas para el portafolio.";
        }
    }
}


function integrarChangelogDocumentacionRoadmap() {
    const contenedor =
        document.querySelector(
            ".contenedor-documentos"
        );

    if (
        !contenedor ||
        contenedor.querySelector(
            "[data-changelog-doc]"
        )
    ) {
        return;
    }

    const tarjetaRoadmap =
        [
            ...contenedor.querySelectorAll(
                ".tarjeta-documento"
            )
        ].find(
            (tarjeta) =>
                normalizarTextoRoadmap(
                    tarjeta.querySelector("h3")
                        ?.textContent
                ) ===
                "roadmap"
        );

    const tarjeta =
        document.createElement(
            "article"
        );

    tarjeta.className =
        "tarjeta-documento";

    tarjeta.innerHTML = `
        <p class="tipo-documento">Versiones</p>
        <h3>Changelog</h3>
        <p>Registro de versiones de PW Hub. v1.0.0 conserva la construcción histórica completa.</p>
        <button
            class="boton-documento"
            type="button"
            data-changelog-doc
        >
            Ver Changelog
        </button>
    `;

    const boton =
        tarjeta.querySelector(
            "[data-changelog-doc]"
        );

    if (boton) {
        boton.addEventListener(
            "click",
            () => {
                if (
                    typeof window
                        .cargarDocumentoHub ===
                    "function"
                ) {
                    window
                        .cargarDocumentoHub(
                            "CHANGELOG.md"
                        );
                }
            }
        );
    }

    if (tarjetaRoadmap) {
        contenedor.insertBefore(
            tarjeta,
            tarjetaRoadmap
        );
    } else {
        contenedor.appendChild(
            tarjeta
        );
    }
}


function configurarControlesRoadmap() {
    if (
        controlesRoadmapConfigurados
    ) {
        return;
    }

    controlesRoadmapConfigurados =
        true;

    document
        .querySelectorAll(
            "[data-roadmap-filtro]"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    () => {
                        document
                            .querySelectorAll(
                                "[data-roadmap-filtro]"
                            )
                            .forEach(
                                (elemento) =>
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
            }
        );


}


function actualizarResumenRoadmap() {
    const publicadas =
        actualizacionesRoadmap.filter(
            (actualizacion) =>
                actualizacion.estado ===
                "completada"
        ).length;

    const desarrollo =
        actualizacionesRoadmap.filter(
            (actualizacion) =>
                actualizacion.estado ===
                "desarrollo"
        ).length;

    const futuras =
        actualizacionesRoadmap.filter(
            (actualizacion) =>
                [
                    "planeada",
                    "futura"
                ].includes(
                    actualizacion.estado
                )
        ).length;

    const porcentaje =
        actualizacionesRoadmap.length
            ? Math.round(
                publicadas /
                actualizacionesRoadmap.length *
                100
            )
            : 0;

    asignarRoadmap(
        "roadmap-total",
        actualizacionesRoadmap.length
    );

    asignarRoadmap(
        "roadmap-completadas",
        publicadas
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


function actualizacionesRoadmapVisibles() {
    if (
        filtroRoadmapActual ===
        "todos"
    ) {
        return actualizacionesRoadmap;
    }

    return actualizacionesRoadmap.filter(
        (actualizacion) =>
            actualizacion.estado ===
            filtroRoadmapActual
    );
}


function renderizarRoadmap() {
    const mapa =
        document.getElementById(
            "roadmap-contenedor"
        );

    if (!mapa) {
        return;
    }

    mapa.hidden = false;

    renderizarMapaRoadmapEn(
        mapa,
        actualizacionesRoadmapVisibles(),
        {
            documento: false,
            expandirTodo: false
        }
    );
}


function renderizarMapaRoadmapEn(
    contenedor,
    actualizaciones,
    opciones = {}
) {
    contenedor.innerHTML = "";

    if (!actualizaciones.length) {
        contenedor.innerHTML = `
            <p class="estado-carga">
                No hay actualizaciones en este filtro.
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

    actualizaciones.forEach(
        (actualizacion) => {
            mapa.appendChild(
                crearNodoRoadmap(
                    actualizacion,
                    opciones
                )
            );
        }
    );

    contenedor.appendChild(
        mapa
    );

    configurarEnlacesDocumentacionRoadmap(
        mapa
    );

    configurarConectoresRoadmap(
        mapa
    );
}


function configurarEnlacesDocumentacionRoadmap(
    contenedor
) {
    if (!contenedor) {
        return;
    }

    const documentos =
        new Set([
            "README.md",
            "HISTORIAL.md",
            "CHANGELOG.md",
            "ROADMAP.md"
        ]);

    contenedor
        .querySelectorAll("a[href]")
        .forEach((enlace) => {
            const href =
                String(
                    enlace.getAttribute(
                        "href"
                    ) || ""
                )
                    .replace(/^\.\//, "")
                    .split("#")[0];

            if (
                !documentos.has(href)
            ) {
                return;
            }

            enlace.addEventListener(
                "click",
                (evento) => {
                    evento.preventDefault();

                    /*
                       Los enlaces de documentación que aparecen
                       dentro del Roadmap deben funcionar incluso
                       cuando la sección Documentación está oculta
                       por el perfil Minimal.

                       Por eso se abren en el visor completo de
                       Markdown, en lugar de depender del visor
                       incrustado de #documentacion.
                    */
                    const archivo =
                        new URL(
                            `docs/${href}`,
                            window.location.href
                        ).href;

                    const titulo =
                        href.replace(
                            /\.md$/i,
                            ""
                        );

                    const parametros =
                        new URLSearchParams({
                            archivo,
                            tipo: "markdown",
                            titulo
                        });

                    window.location.href =
                        `vistas/trabajo.html?${parametros.toString()}`;
                }
            );
        });
}


function crearNodoRoadmap(
    actualizacion,
    opciones
) {
    const nodo =
        document.createElement(
            "article"
        );

    nodo.className =
        `roadmap-mapa-nodo ${actualizacion.estado}`;

    nodo.dataset.versionRoadmap =
        actualizacion.version;

    const expandido =
        opciones.expandirTodo ||
        debeExpandirseRoadmap(
            actualizacion
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
            ${escaparHtmlRoadmap(
                actualizacion.versionCorta
            )}
        </span>
    `;

    const principal =
        document.createElement(
            "button"
        );

    principal.type =
        "button";

    principal.className =
        "roadmap-nodo-principal";

    principal.setAttribute(
        "aria-expanded",
        String(expandido)
    );

    principal.innerHTML = `
        <span class="roadmap-nodo-kicker">
            ${escaparHtmlRoadmap(
                actualizacion.version
            )}
        </span>

        <span class="roadmap-nodo-titulo">
            ${escaparHtmlRoadmap(
                actualizacion.titulo
            )}
        </span>

        <span class="roadmap-nodo-pie">
            <span class="roadmap-estado">
                ${escaparHtmlRoadmap(
                    actualizacion.estadoTexto
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
        actualizacion.secciones.length
            ? actualizacion.secciones
            : [
                {
                    titulo:
                        "Objetivo",

                    contenido:
                        actualizacion.objetivo ||
                        "Actualización planeada de PW Hub.",

                    tipo:
                        "objetivo",

                    introduccion: [
                        actualizacion.objetivo ||
                        "Actualización planeada de PW Hub."
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
            (parrafo) => {
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
                                    parrafo
                                )
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
    } else {
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
    actualizacion
) {
    const estados =
        configuracionRoadmap
            ?.expandirEstados ||
        [
            "desarrollo"
        ];

    return estados.includes(
        actualizacion.estado
    );
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

    const publicadas =
        actualizacionesRoadmap.filter(
            (actualizacion) =>
                actualizacion.estado ===
                "completada"
        ).length;

    introduccion.innerHTML = `
        <div>
            <p class="roadmap-documento-kicker">
                Mapa completo
            </p>

            <h4>
                Actualizaciones de PW Hub
            </h4>

            <p class="roadmap-documento-ayuda">
                Cada versión se divide en objetivos, alcance y
                resultados esperados mediante ramas independientes.
            </p>
        </div>

        <div class="roadmap-documento-resumen">
            <span>
                <strong>${publicadas}</strong>
                publicadas
            </span>

            <span>
                <strong>${actualizacionesRoadmap.length}</strong>
                actualizaciones
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
        actualizacionesRoadmap,
        {
            documento: true,
            expandirTodo: true
        }
    );
}


/* =========================================================
   CONECTORES CANVAS
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

    mapasRoadmapCanvas.add(
        mapa
    );

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

        mapa.prepend(
            canvas
        );
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

        observador.observe(
            mapa
        );

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
                frameRoadmapCanvas =
                    null;

                [
                    ...mapasRoadmapCanvas
                ].forEach(
                    (mapa) => {
                        if (!mapa.isConnected) {
                            if (
                                mapa._observadorRoadmapCanvas
                            ) {
                                mapa
                                    ._observadorRoadmapCanvas
                                    .disconnect();
                            }

                            mapasRoadmapCanvas
                                .delete(
                                    mapa
                                );

                            return;
                        }

                        dibujarConectoresRoadmap(
                            mapa
                        );
                    }
                );
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
            window.devicePixelRatio ||
            1
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
        canvas.getContext(
            "2d"
        );

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

    nodos.forEach(
        (nodo) => {
            dibujarArbolActualizacionCanvas(
                contexto,
                mapa,
                nodo
            );
        }
    );
}


function dibujarEjePrincipalCanvas(
    contexto,
    mapa,
    nodos
) {
    const puntos =
        nodos
            .map(
                (nodo) =>
                    nodo.querySelector(
                        ":scope > .roadmap-mapa-eje span"
                    )
            )
            .filter(Boolean)
            .map(
                (elemento) =>
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
                (punto) =>
                    punto.cx
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


function dibujarArbolActualizacionCanvas(
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
            "actualizacion"
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

    const categorias =
        ramas
            .map(
                (rama) => ({
                    rama,
                    cabecera:
                        rama.querySelector(
                            ":scope > .roadmap-rama-cabecera"
                        )
                })
            )
            .filter(
                (item) =>
                    item.cabecera
            );

    dibujarTroncoCompartidoCanvas(
        contexto,
        mapa,
        geoPrincipal,
        categorias.map(
            (item) =>
                item.cabecera
        ),
        colorRoadmapCanvas(
            "categoria"
        ),
        1.25,
        32
    );

    categorias.forEach(
        ({
            rama,
            cabecera
        }) => {
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
        hacia.cx >=
        desde.cx;

    const inicioX =
        haciaDerecha
            ? desde.right
            : desde.left;

    const finX =
        haciaDerecha
            ? hacia.left
            : hacia.right;

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
            .map(
                (elemento) =>
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

    hijos.forEach(
        (hijo) => {
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
        }
    );
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

    const centrosY = [
        padre.cy,
        ...hijos.map(
            (hijo) =>
                hijo.cy
        )
    ];

    const inicioTroncoY =
        Math.min(
            ...centrosY
        );

    const finTroncoY =
        Math.max(
            ...centrosY
        );

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
            }
        ],
        color,
        grosor
    );

    dibujarLineaCanvas(
        contexto,
        [
            {
                x: troncoX,
                y: inicioTroncoY
            },
            {
                x: troncoX,
                y: finTroncoY
            }
        ],
        color,
        grosor
    );

    hijos.forEach(
        (hijo) => {
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
        }
    );
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
        estilo.display ===
            "none" ||
        estilo.visibility ===
            "hidden"
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

        actualizacion:
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
        (tipo) =>
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
