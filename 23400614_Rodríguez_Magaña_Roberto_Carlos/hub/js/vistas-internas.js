/*
    =========================================================
    PW HUB v1.1.1 - VISTAS INTERNAS
    =========================================================

    Objetivo:
    - conservar el hero y la navegación como cabecera común;
    - mostrar Resumen académico en Inicio;
    - agrupar Progreso + U1-U5 dentro de Curso;
    - mostrar una sola herramienta de Explorar por vez;
    - mantener Documentación como vista propia;
    - conservar hashes y Atrás / Adelante del navegador.

    El módulo se carga directamente desde index.html, después de
    personalizacion.js. No depende de sincronizacion.js.
*/

(() => {
    "use strict";

    const VERSION = "1.1.1";

    const DESTINOS = new Set([
        "inicio",
        "progreso",
        "unidad1",
        "unidad2",
        "unidad3",
        "unidad4",
        "unidad5",
        "actividad",
        "trabajos",
        "estadisticas",
        "historial",
        "roadmap",
        "documentacion"
    ]);

    const SELECTORES = {
        encabezado: ".encabezado-principal",
        progreso: "#progreso",
        resumen: ".seccion-resumen",
        actividad: "#actividad",
        unidades: ".seccion-portafolio",
        trabajos: "#trabajos",
        estadisticas: "#estadisticas",
        historial: "#historial",
        roadmap: "#roadmap",
        documentacion: "#documentacion"
    };

    const CLASE_OCULTA = "hub-vista-oculta";

    let iniciado = false;
    let destinoActual = "inicio";
    let observadorUnidades = null;
    let observadorConfiguracion = null;
    let reaplicacionPendiente = false;

    window.PWHubVistasInternas = {
        version: VERSION,

        get activo() {
            return iniciado;
        },

        obtenerActual() {
            return destinoActual;
        },

        navegar: navegarA,

        aplicarHash() {
            aplicarDesdeHash(true);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciar,
            { once: true }
        );
    } else {
        iniciar();
    }


    function iniciar() {
        if (iniciado) {
            return;
        }

        iniciado = true;

        document.documentElement.classList.add(
            "hub-vistas-internas"
        );

        document.body.classList.add(
            "hub-vistas-internas"
        );

        configurarEnlaces();
        configurarHistorial();
        observarUnidades();
        observarPersonalizacion();

        aplicarDesdeHash(true);

        // hub.js crea las unidades después de resolver el catálogo.
        // Una reaplicación corta mantiene la vista correcta incluso
        // si el render termina después de DOMContentLoaded.
        window.setTimeout(
            () => aplicarDesdeHash(false),
            0
        );

        window.setTimeout(
            () => aplicarDesdeHash(false),
            250
        );
    }


    function configurarEnlaces() {
        document.addEventListener(
            "click",
            (evento) => {
                const objetivo =
                    evento.target instanceof Element
                        ? evento.target
                        : null;

                if (!objetivo) {
                    return;
                }

                /*
                   Los botones de documentación necesitan que su vista
                   sea visible antes de que navegacion.js abra el Markdown.
                   No detenemos su listener original.
                */
                if (
                    objetivo.closest(
                        "[data-nav-doc]"
                    )
                ) {
                    mostrarVista(
                        "documentacion",
                        false
                    );

                    registrarHash(
                        "documentacion",
                        true
                    );

                    return;
                }

                /*
                   "Ver en historial" conserva su listener original para
                   rellenar el buscador, pero primero hacemos visible
                   Historial.
                */
                if (
                    objetivo.closest(
                        "[data-actividad-evento]"
                    )
                ) {
                    mostrarVista(
                        "historial",
                        false
                    );

                    registrarHash(
                        "historial",
                        true
                    );

                    return;
                }

                const enlace =
                    objetivo.closest(
                        'a[href^="#"]'
                    );

                if (!enlace) {
                    return;
                }

                const href =
                    enlace.getAttribute(
                        "href"
                    );

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                let destino =
                    normalizarDestino(
                        href.slice(1)
                    );

                if (!DESTINOS.has(destino)) {
                    return;
                }

                evento.preventDefault();
                evento.stopImmediatePropagation();

                destino =
                    resolverDestinoDisponible(
                        destino
                    );

                registrarHash(
                    destino,
                    true
                );

                mostrarVista(
                    destino,
                    true
                );

                if (
                    typeof window
                        .cerrarTodosLosMenus ===
                    "function"
                ) {
                    window.cerrarTodosLosMenus();
                }
            },
            true
        );
    }


    function configurarHistorial() {
        window.addEventListener(
            "popstate",
            () => {
                aplicarDesdeHash(true);
            }
        );

        window.addEventListener(
            "hashchange",
            () => {
                aplicarDesdeHash(true);
            }
        );
    }


    function observarUnidades() {
        const contenedor =
            document.getElementById(
                "contenedor-unidades"
            );

        if (!contenedor) {
            return;
        }

        observadorUnidades =
            new MutationObserver(
                () => {
                    if (
                        /^unidad[1-5]$/.test(
                            destinoActual
                        )
                    ) {
                        desplazarA(
                            destinoActual
                        );
                    }
                }
            );

        observadorUnidades.observe(
            contenedor,
            {
                childList: true
            }
        );
    }


    function observarPersonalizacion() {
        const elementos =
            Object.values(
                SELECTORES
            )
                .map(
                    (selector) =>
                        document.querySelector(
                            selector
                        )
                )
                .filter(Boolean);

        observadorConfiguracion =
            new MutationObserver(
                (mutaciones) => {
                    const cambio =
                        mutaciones.some(
                            (mutacion) => {
                                if (
                                    mutacion.type !==
                                        "attributes" ||
                                    mutacion.attributeName !==
                                        "class"
                                ) {
                                    return false;
                                }

                                const antes =
                                    String(
                                        mutacion.oldValue || ""
                                    )
                                        .split(/\s+/)
                                        .includes(
                                            "seccion-oculta-config"
                                        );

                                const despues =
                                    mutacion.target
                                        .classList
                                        .contains(
                                            "seccion-oculta-config"
                                        );

                                return antes !== despues;
                            }
                        );

                    if (!cambio) {
                        return;
                    }

                    solicitarReaplicacion();
                }
            );

        elementos.forEach(
            (elemento) => {
                observadorConfiguracion.observe(
                    elemento,
                    {
                        attributes: true,
                        attributeFilter: [
                            "class"
                        ],
                        attributeOldValue: true
                    }
                );
            }
        );
    }


    function solicitarReaplicacion() {
        if (reaplicacionPendiente) {
            return;
        }

        reaplicacionPendiente = true;

        requestAnimationFrame(
            () => {
                reaplicacionPendiente = false;

                const resuelto =
                    resolverDestinoDisponible(
                        destinoActual
                    );

                if (
                    resuelto !==
                    destinoActual
                ) {
                    registrarHash(
                        resuelto,
                        false
                    );
                }

                mostrarVista(
                    resuelto,
                    false
                );
            }
        );
    }


    function aplicarDesdeHash(
        desplazar
    ) {
        let destino =
            normalizarDestino(
                window.location.hash
                    .replace(/^#/, "")
            );

        if (!DESTINOS.has(destino)) {
            destino = "inicio";
        }

        destino =
            resolverDestinoDisponible(
                destino
            );

        registrarHash(
            destino,
            false
        );

        mostrarVista(
            destino,
            desplazar
        );
    }


    function navegarA(
        destino,
        opciones = {}
    ) {
        destino =
            normalizarDestino(
                destino
            );

        if (!DESTINOS.has(destino)) {
            destino = "inicio";
        }

        destino =
            resolverDestinoDisponible(
                destino
            );

        registrarHash(
            destino,
            opciones.registrar !== false
        );

        mostrarVista(
            destino,
            opciones.desplazar !== false
        );
    }


    function mostrarVista(
        destino,
        desplazar
    ) {
        destinoActual = destino;

        const grupo =
            obtenerGrupo(
                destino
            );

        document.body.dataset.hubVista =
            grupo;

        document.body.dataset.hubDestino =
            destino;

        const visibles =
            clavesVisibles(
                destino
            );

        Object.entries(
            SELECTORES
        ).forEach(
            ([clave, selector]) => {
                const elemento =
                    document.querySelector(
                        selector
                    );

                if (!elemento) {
                    return;
                }

                elemento.classList.toggle(
                    CLASE_OCULTA,
                    !visibles.has(
                        clave
                    )
                );
            }
        );

        /*
           Resumen académico es estructural y no participa ya en
           Personalización.
        */
        const resumen =
            document.querySelector(
                SELECTORES.resumen
            );

        if (resumen) {
            resumen.classList.remove(
                "seccion-oculta-config"
            );
        }

        if (
            typeof window
                .marcarNavegacionActiva ===
            "function"
        ) {
            window.marcarNavegacionActiva(
                destino
            );
        }

        document.title =
            tituloPara(
                destino
            );

        window.dispatchEvent(
            new CustomEvent(
                "pw-hub:vista",
                {
                    detail: {
                        destino,
                        grupo,
                        version:
                            VERSION
                    }
                }
            )
        );

        if (desplazar) {
            desplazarA(
                destino
            );
        }
    }


    function clavesVisibles(
        destino
    ) {
        if (destino === "inicio") {
            return new Set([
                "encabezado",
                "resumen"
            ]);
        }

        if (
            destino === "progreso" ||
            /^unidad[1-5]$/.test(
                destino
            )
        ) {
            const visibles =
                new Set([
                    "encabezado"
                ]);

            if (
                estaHabilitada(
                    "progreso"
                )
            ) {
                visibles.add(
                    "progreso"
                );
            }

            if (
                estaHabilitada(
                    "unidades"
                )
            ) {
                visibles.add(
                    "unidades"
                );
            }

            return visibles;
        }

        if (
            [
                "actividad",
                "trabajos",
                "estadisticas",
                "historial",
                "roadmap"
            ].includes(
                destino
            )
        ) {
            return new Set([
                "encabezado",
                destino
            ]);
        }

        if (destino === "documentacion") {
            return new Set([
                "encabezado",
                "documentacion"
            ]);
        }

        return new Set([
            "encabezado",
            "resumen"
        ]);
    }


    function resolverDestinoDisponible(
        destino
    ) {
        if (destino === "inicio") {
            return "inicio";
        }

        if (destino === "progreso") {
            if (
                estaHabilitada(
                    "progreso"
                )
            ) {
                return destino;
            }

            if (
                estaHabilitada(
                    "unidades"
                )
            ) {
                return "unidad1";
            }

            return "inicio";
        }

        if (
            /^unidad[1-5]$/.test(
                destino
            )
        ) {
            if (
                estaHabilitada(
                    "unidades"
                )
            ) {
                return destino;
            }

            if (
                estaHabilitada(
                    "progreso"
                )
            ) {
                return "progreso";
            }

            return "inicio";
        }

        const clave =
            destino;

        return estaHabilitada(
            clave
        )
            ? destino
            : "inicio";
    }


    function estaHabilitada(
        clave
    ) {
        if (clave === "resumen") {
            return true;
        }

        const selector =
            SELECTORES[clave];

        if (!selector) {
            return false;
        }

        const elemento =
            document.querySelector(
                selector
            );

        return Boolean(
            elemento &&
            !elemento.classList.contains(
                "seccion-oculta-config"
            )
        );
    }


    function desplazarA(
        destino
    ) {
        requestAnimationFrame(
            () => {
                if (destino === "inicio") {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "auto"
                    });

                    return;
                }

                const objetivo =
                    document.getElementById(
                        destino
                    ) ||
                    (
                        /^unidad[1-5]$/.test(
                            destino
                        )
                            ? document.querySelector(
                                ".seccion-portafolio"
                            )
                            : null
                    );

                if (!objetivo) {
                    return;
                }

                objetivo.scrollIntoView({
                    behavior: "auto",
                    block: "start"
                });
            }
        );
    }


    function registrarHash(
        destino,
        crearEntrada
    ) {
        const hash =
            `#${destino}`;

        if (
            window.location.hash ===
            hash
        ) {
            return;
        }

        try {
            if (crearEntrada) {
                history.pushState(
                    {
                        vistaHub:
                            destino
                    },
                    "",
                    hash
                );
            } else {
                history.replaceState(
                    history.state,
                    "",
                    hash
                );
            }
        } catch {
            window.location.hash =
                hash;
        }
    }


    function obtenerGrupo(
        destino
    ) {
        if (destino === "inicio") {
            return "inicio";
        }

        if (
            destino === "progreso" ||
            /^unidad[1-5]$/.test(
                destino
            )
        ) {
            return "curso";
        }

        if (destino === "documentacion") {
            return "documentacion";
        }

        return "explorar";
    }


    function normalizarDestino(
        destino
    ) {
        return String(
            destino || "inicio"
        )
            .replace(/^#/, "")
            .trim()
            .toLowerCase() ||
            "inicio";
    }


    function tituloPara(
        destino
    ) {
        const titulos = {
            inicio:
                "PW Hub - Portafolio de Programación Web",
            progreso:
                "Curso - PW Hub",
            unidad1:
                "Unidad 1 - PW Hub",
            unidad2:
                "Unidad 2 - PW Hub",
            unidad3:
                "Unidad 3 - PW Hub",
            unidad4:
                "Unidad 4 - PW Hub",
            unidad5:
                "Unidad 5 - PW Hub",
            actividad:
                "Actividad reciente - PW Hub",
            trabajos:
                "Todos los trabajos - PW Hub",
            estadisticas:
                "Estadísticas - PW Hub",
            historial:
                "Historial - PW Hub",
            roadmap:
                "Roadmap - PW Hub",
            documentacion:
                "Documentación - PW Hub"
        };

        return titulos[destino] ||
            titulos.inicio;
    }
})();
