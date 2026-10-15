const CLAVE_CONFIGURACION_HUB = "pw-hub-configuracion-v3";

const CLAVES_CONFIGURACION_ANTERIORES = [
    "pw-hub-configuracion-v2",
    "pw-hub-configuracion-v1"
];

const CONFIGURACION_PREDETERMINADA = {
    tema: "pw-dark",
    estilo: "normal",
    acento: "cian",
    densidad: "normal",
    movimiento: "sutil",
    animaciones: true,
    efectos: true,
    secciones: {
        encabezado: true,
        progreso: true,
        resumen: false,
        actividad: false,
        unidades: true,
        trabajos: true,
        estadisticas: false,
        historial: false,
        roadmap: false,
        documentacion: false
    }
};

const SELECTORES_SECCIONES = {
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

const SELECTORES_NAVEGACION = {
    progreso: ['a[href="#progreso"]'],
    actividad: ['a[href="#actividad"]'],
    unidades: [
        'a[href="#unidad1"]',
        'a[href="#unidad2"]',
        'a[href="#unidad3"]',
        'a[href="#unidad4"]',
        'a[href="#unidad5"]'
    ],
    trabajos: ['a[href="#trabajos"]'],
    estadisticas: ['a[href="#estadisticas"]'],
    historial: ['a[href="#historial"]'],
    roadmap: ['a[href="#roadmap"]'],
    documentacion: ['a[href="#documentacion"]']
};

const ICONOS_HUB = {
    settings: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="3"></circle>
            <path
                d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.38.38.72.66 1 .28.28.62.5 1 .6h.1v4h-.1a1.7 1.7 0 0 0-1.66.4Z"
            ></path>
        </svg>
    `,
    home: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="m3 11 9-8 9 8"></path>
            <path d="M5 10v10h14V10"></path>
            <path d="M9 20v-6h6v6"></path>
        </svg>
    `,
    course: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z"></path>
            <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z"></path>
        </svg>
    `,
    explore: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9"></circle>
            <path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7Z"></path>
        </svg>
    `,
    docs: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M6 3h8l4 4v14H6Z"></path>
            <path d="M14 3v5h5"></path>
            <path d="M9 13h6"></path>
            <path d="M9 17h6"></path>
        </svg>
    `,
    github: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M8 9 4 12l4 3"></path>
            <path d="m16 9 4 3-4 3"></path>
            <path d="m14 5-4 14"></path>
        </svg>
    `,
    sparkles: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2Z"></path>
            <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z"></path>
            <path d="m5 13 .7 1.8 1.8.7-1.8.7L5 18l-.7-1.8-1.8-.7 1.8-.7Z"></path>
        </svg>
    `,
    eye: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
            <circle cx="12" cy="12" r="2.5"></circle>
        </svg>
    `,
    palette: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3a9 9 0 1 0 0 18h1.4a2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3H18a3 3 0 0 0 3-3A8.4 8.4 0 0 0 12 3Z"></path>
            <circle cx="7.5" cy="10" r=".7"></circle>
            <circle cx="10" cy="6.8" r=".7"></circle>
            <circle cx="14" cy="6.8" r=".7"></circle>
        </svg>
    `,
    layout: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M9 9v11"></path>
        </svg>
    `,
    motion: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M4 8h7"></path>
            <path d="M2 12h9"></path>
            <path d="M5 16h6"></path>
            <path d="m15 6 5 6-5 6Z"></path>
        </svg>
    `
};

let configuracionHub = cargarConfiguracionHub();
let observadorAnimaciones = null;

aplicarAparienciaBaseHub();

document.addEventListener("DOMContentLoaded", () => {
    aplicarIconosHub();
    configurarPanelPersonalizacion();
    sincronizarControlesPersonalizacion();
    aplicarConfiguracionHub(false);
    iniciarAnimacionesHub();
});

function cargarConfiguracionHub() {
    try {
        let guardada = localStorage.getItem(
            CLAVE_CONFIGURACION_HUB
        );

        let fueMigrada = false;

        if (!guardada) {
            for (
                const claveAnterior
                of CLAVES_CONFIGURACION_ANTERIORES
            ) {
                guardada =
                    localStorage.getItem(
                        claveAnterior
                    );

                if (guardada) {
                    fueMigrada = true;
                    break;
                }
            }
        }

        if (!guardada) {
            return clonarConfiguracionPredeterminada();
        }

        const datos = JSON.parse(guardada);

        const configuracion = {
            ...clonarConfiguracionPredeterminada(),
            ...datos,
            secciones: {
                ...CONFIGURACION_PREDETERMINADA.secciones,
                ...(datos.secciones || {})
            }
        };

        migrarPerfilMinimalAnterior(
            configuracion
        );

        migrarAparienciaAnterior(
            configuracion
        );

        if (fueMigrada) {
            localStorage.setItem(
                CLAVE_CONFIGURACION_HUB,
                JSON.stringify(
                    configuracion
                )
            );
        }

        return configuracion;
    } catch (error) {
        console.warn(
            "No fue posible cargar la personalización del Hub.",
            error
        );

        return clonarConfiguracionPredeterminada();
    }
}

function migrarAparienciaAnterior(
    configuracion
) {
    if (!configuracion.tema) {
        configuracion.tema =
            "pw-dark";
    }

    if (!configuracion.estilo) {
        configuracion.estilo =
            "normal";
    }

    if (!configuracion.movimiento) {
        configuracion.movimiento =
            configuracion.animaciones === false
                ? "ninguno"
                : "sutil";
    }

    configuracion.animaciones =
        configuracion.movimiento !==
        "ninguno";
}

function aplicarAparienciaBaseHub() {
    document.documentElement.dataset.tema =
        configuracionHub.tema;

    document.documentElement.dataset.estilo =
        configuracionHub.estilo;

    document.documentElement.dataset.acento =
        configuracionHub.acento;

    document.documentElement.dataset.movimiento =
        configuracionHub.movimiento;

    document.documentElement.style.colorScheme =
        "dark";
}

function migrarPerfilMinimalAnterior(configuracion) {
    const secciones = configuracion.secciones;

    const eraMinimalAnterior =
        secciones.encabezado === true &&
        secciones.progreso === false &&
        secciones.resumen === false &&
        secciones.actividad === false &&
        secciones.unidades === true &&
        secciones.trabajos === true &&
        secciones.estadisticas === false &&
        secciones.historial === false &&
        secciones.roadmap === false &&
        secciones.documentacion === false;

    if (eraMinimalAnterior) {
        secciones.progreso = true;
    }
}

function clonarConfiguracionPredeterminada() {
    return JSON.parse(
        JSON.stringify(CONFIGURACION_PREDETERMINADA)
    );
}

function guardarConfiguracionHub() {
    try {
        localStorage.setItem(
            CLAVE_CONFIGURACION_HUB,
            JSON.stringify(configuracionHub)
        );
    } catch (error) {
        console.warn(
            "No fue posible guardar la personalización del Hub.",
            error
        );
    }
}

function configurarPanelPersonalizacion() {
    const abrir = document.getElementById(
        "abrir-personalizacion"
    );

    const cerrar = document.getElementById(
        "cerrar-personalizacion"
    );

    const capa = document.getElementById(
        "personalizacion-capa"
    );

    const panel = document.getElementById(
        "panel-personalizacion"
    );

    if (!abrir || !cerrar || !capa || !panel) {
        return;
    }

    abrir.addEventListener(
        "click",
        abrirPanelPersonalizacion
    );

    cerrar.addEventListener(
        "click",
        cerrarPanelPersonalizacion
    );

    capa.addEventListener(
        "click",
        cerrarPanelPersonalizacion
    );

    document.addEventListener("keydown", (evento) => {
        if (
            evento.key === "Escape" &&
            panel.classList.contains("abierto")
        ) {
            cerrarPanelPersonalizacion();
        }
    });

    document
        .querySelectorAll("[data-seccion-visible]")
        .forEach((input) => {
            input.addEventListener("change", () => {
                const clave =
                    input.dataset.seccionVisible;

                configuracionHub.secciones[clave] =
                    input.checked;

                aplicarConfiguracionHub();
            });
        });

    document
        .querySelectorAll("[data-tema-hub]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                configuracionHub.tema =
                    boton.dataset.temaHub;

                aplicarConfiguracionHub();
            });
        });

    document
        .querySelectorAll("[data-estilo-hub]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                configuracionHub.estilo =
                    boton.dataset.estiloHub;

                aplicarConfiguracionHub();
            });
        });

    document
        .querySelectorAll("[data-movimiento-hub]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                configuracionHub.movimiento =
                    boton.dataset.movimientoHub;

                configuracionHub.animaciones =
                    configuracionHub.movimiento !==
                    "ninguno";

                aplicarConfiguracionHub();
            });
        });

    document
        .querySelectorAll("[data-acento-hub]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                configuracionHub.acento =
                    boton.dataset.acentoHub;

                aplicarConfiguracionHub();
            });
        });

    document
        .querySelectorAll("[data-densidad-hub]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                configuracionHub.densidad =
                    boton.dataset.densidadHub;

                aplicarConfiguracionHub();
            });
        });

    document
        .querySelectorAll("[data-perfil-hub]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                aplicarPerfilHub(
                    boton.dataset.perfilHub
                );
            });
        });

    const efectos = document.getElementById(
        "config-efectos"
    );

    if (efectos) {
        efectos.addEventListener(
            "change",
            () => {
                configuracionHub.efectos =
                    efectos.checked;

                aplicarConfiguracionHub();
            }
        );
    }

    const restablecer = document.getElementById(
        "restablecer-personalizacion"
    );

    if (restablecer) {
        restablecer.addEventListener(
            "click",
            () => {
                configuracionHub =
                    clonarConfiguracionPredeterminada();

                aplicarConfiguracionHub();
            }
        );
    }
}

function abrirPanelPersonalizacion() {
    const boton = document.getElementById(
        "abrir-personalizacion"
    );

    const panel = document.getElementById(
        "panel-personalizacion"
    );

    const capa = document.getElementById(
        "personalizacion-capa"
    );

    if (!boton || !panel || !capa) {
        return;
    }

    capa.hidden = false;

    requestAnimationFrame(() => {
        capa.classList.add("visible");
    });

    panel.classList.add("abierto");
    panel.setAttribute("aria-hidden", "false");
    boton.setAttribute("aria-expanded", "true");

    document.body.classList.add(
        "personalizacion-abierta"
    );

    const botonCerrar = document.getElementById(
        "cerrar-personalizacion"
    );

    if (botonCerrar) {
        botonCerrar.focus();
    }
}

function cerrarPanelPersonalizacion() {
    const boton = document.getElementById(
        "abrir-personalizacion"
    );

    const panel = document.getElementById(
        "panel-personalizacion"
    );

    const capa = document.getElementById(
        "personalizacion-capa"
    );

    if (!boton || !panel || !capa) {
        return;
    }

    panel.classList.remove("abierto");
    panel.setAttribute("aria-hidden", "true");
    boton.setAttribute("aria-expanded", "false");

    capa.classList.remove("visible");

    document.body.classList.remove(
        "personalizacion-abierta"
    );

    window.setTimeout(() => {
        if (!panel.classList.contains("abierto")) {
            capa.hidden = true;
        }
    }, 260);

    boton.focus();
}

function aplicarPerfilHub(perfil) {
    const todas = Object.fromEntries(
        Object.keys(SELECTORES_SECCIONES).map(
            (clave) => [clave, true]
        )
    );

    if (perfil === "completo") {
        configuracionHub.secciones = {
            ...todas
        };
    }

    if (perfil === "academico") {
        configuracionHub.secciones = {
            ...todas,
            historial: false,
            roadmap: false,
            documentacion: false
        };
    }

    if (perfil === "minimal") {
        configuracionHub.secciones = {
            encabezado: true,
            progreso: true,
            resumen: false,
            actividad: false,
            unidades: true,
            trabajos: true,
            estadisticas: false,
            historial: false,
            roadmap: false,
            documentacion: false
        };
    }

    aplicarConfiguracionHub();
}

function aplicarConfiguracionHub(guardar = true) {
    configuracionHub.animaciones =
        configuracionHub.movimiento !==
        "ninguno";

    document.documentElement.dataset.tema =
        configuracionHub.tema;

    document.documentElement.dataset.estilo =
        configuracionHub.estilo;

    document.documentElement.dataset.acento =
        configuracionHub.acento;

    document.documentElement.dataset.movimiento =
        configuracionHub.movimiento;

    document.body.dataset.densidad =
        configuracionHub.densidad;

    document.body.dataset.animaciones =
        configuracionHub.animaciones
            ? "on"
            : "off";

    document.body.dataset.efectos =
        configuracionHub.efectos
            ? "on"
            : "off";

    Object.entries(SELECTORES_SECCIONES).forEach(
        ([clave, selector]) => {
            const elemento =
                document.querySelector(selector);

            if (!elemento) {
                return;
            }

            const visible =
                configuracionHub.secciones[clave] !== false;

            elemento.classList.toggle(
                "seccion-oculta-config",
                !visible
            );
        }
    );

    sincronizarControlesPersonalizacion();
    sincronizarNavegacionHub();
    actualizarAnimacionesHub();

    if (guardar) {
        guardarConfiguracionHub();
    }
}

function sincronizarControlesPersonalizacion() {
    document
        .querySelectorAll("[data-seccion-visible]")
        .forEach((input) => {
            const clave =
                input.dataset.seccionVisible;

            input.checked =
                configuracionHub.secciones[clave] !== false;
        });

    document
        .querySelectorAll("[data-tema-hub]")
        .forEach((boton) => {
            const activo =
                boton.dataset.temaHub ===
                configuracionHub.tema;

            boton.classList.toggle(
                "activo",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );
        });

    document
        .querySelectorAll("[data-estilo-hub]")
        .forEach((boton) => {
            const activo =
                boton.dataset.estiloHub ===
                configuracionHub.estilo;

            boton.classList.toggle(
                "activo",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );
        });

    document
        .querySelectorAll("[data-movimiento-hub]")
        .forEach((boton) => {
            const activo =
                boton.dataset.movimientoHub ===
                configuracionHub.movimiento;

            boton.classList.toggle(
                "activo",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );
        });

    document
        .querySelectorAll("[data-acento-hub]")
        .forEach((boton) => {
            const activo =
                boton.dataset.acentoHub ===
                configuracionHub.acento;

            boton.classList.toggle(
                "activo",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );
        });

    document
        .querySelectorAll("[data-densidad-hub]")
        .forEach((boton) => {
            const activo =
                boton.dataset.densidadHub ===
                configuracionHub.densidad;

            boton.classList.toggle(
                "activo",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );
        });

    const efectos = document.getElementById(
        "config-efectos"
    );

    if (efectos) {
        efectos.checked =
            configuracionHub.efectos;
    }

    actualizarEstadoPerfiles();
}

function actualizarEstadoPerfiles() {
    document
        .querySelectorAll("[data-perfil-hub]")
        .forEach((boton) => {
            boton.setAttribute(
                "aria-pressed",
                "false"
            );
        });

    const perfil = detectarPerfilActual();

    if (!perfil) {
        return;
    }

    const boton = document.querySelector(
        `[data-perfil-hub="${perfil}"]`
    );

    if (boton) {
        boton.setAttribute(
            "aria-pressed",
            "true"
        );
    }
}

function detectarPerfilActual() {
    const secciones =
        configuracionHub.secciones;

    const todasVisibles =
        Object.keys(SELECTORES_SECCIONES).every(
            (clave) => secciones[clave] !== false
        );

    if (todasVisibles) {
        return "completo";
    }

    const esMinimal =
        secciones.encabezado !== false &&
        secciones.progreso !== false &&
        secciones.resumen === false &&
        secciones.actividad === false &&
        secciones.unidades !== false &&
        secciones.trabajos !== false &&
        secciones.estadisticas === false &&
        secciones.historial === false &&
        secciones.roadmap === false &&
        secciones.documentacion === false;

    if (esMinimal) {
        return "minimal";
    }

    const esAcademico =
        secciones.encabezado !== false &&
        secciones.progreso !== false &&
        secciones.resumen !== false &&
        secciones.actividad !== false &&
        secciones.unidades !== false &&
        secciones.trabajos !== false &&
        secciones.estadisticas !== false &&
        secciones.historial === false &&
        secciones.roadmap === false &&
        secciones.documentacion === false;

    if (esAcademico) {
        return "academico";
    }

    return null;
}

function sincronizarNavegacionHub() {
    Object.entries(SELECTORES_NAVEGACION).forEach(
        ([clave, selectores]) => {
            const visible =
                configuracionHub.secciones[clave] !== false;

            selectores.forEach((selector) => {
                document
                    .querySelectorAll(selector)
                    .forEach((elemento) => {
                        elemento.hidden = !visible;
                    });
            });
        }
    );

    sincronizarAccionesDocumentacion();
    sincronizarMenusVacios();
}

function sincronizarAccionesDocumentacion() {
    const documentacionVisible =
        configuracionHub.secciones.documentacion !== false;

    document
        .querySelectorAll("[data-nav-doc]")
        .forEach((boton) => {
            boton.hidden =
                !documentacionVisible;
        });
}

function sincronizarMenusVacios() {
    document
        .querySelectorAll(".nav-desplegable")
        .forEach((desplegable) => {
            const boton =
                desplegable.querySelector(
                    ".nav-desplegable-boton"
                );

            const menu =
                desplegable.querySelector(
                    ".nav-desplegable-menu"
                );

            if (!boton || !menu) {
                return;
            }

            const elementosUtiles = [
                ...menu.querySelectorAll(
                    "a, .nav-menu-accion"
                )
            ];

            const hayContenidoVisible =
                elementosUtiles.some(
                    (elemento) => !elemento.hidden
                );

            desplegable.hidden =
                !hayContenidoVisible;

            menu
                .querySelectorAll(
                    ".nav-separador"
                )
                .forEach((separador) => {
                    const anterior =
                        buscarElementoNavegable(
                            separador,
                            "previousElementSibling"
                        );

                    const siguiente =
                        buscarElementoNavegable(
                            separador,
                            "nextElementSibling"
                        );

                    separador.hidden =
                        !anterior ||
                        !siguiente ||
                        anterior.hidden ||
                        siguiente.hidden;
                });
        });
}

function buscarElementoNavegable(
    elemento,
    direccion
) {
    let actual = elemento[direccion];

    while (
        actual &&
        actual.classList.contains("nav-separador")
    ) {
        actual = actual[direccion];
    }

    return actual;
}

function aplicarIconosHub() {
    const configuracion = document.querySelector(
        ".nav-configuracion-icono"
    );

    if (configuracion) {
        configuracion.innerHTML =
            ICONOS_HUB.settings;
    }

    insertarIconoNav(
        '.navegacion-interior > a[href="#inicio"]',
        "home"
    );

    insertarIconoNav(
        '.nav-desplegable-boton[aria-controls="menu-curso"]',
        "course"
    );

    insertarIconoNav(
        '.nav-desplegable-boton[aria-controls="menu-explorar"]',
        "explore"
    );

    insertarIconoNav(
        '.nav-desplegable-boton[aria-controls="menu-documentacion"]',
        "docs"
    );

    insertarIconoNav(
        ".navegacion-hub .nav-github",
        "github"
    );

    document
        .querySelectorAll("[data-icono-config]")
        .forEach((elemento) => {
            const nombre =
                elemento.dataset.iconoConfig;

            if (ICONOS_HUB[nombre]) {
                elemento.innerHTML =
                    ICONOS_HUB[nombre];
            }
        });
}

function insertarIconoNav(selector, icono) {
    const elemento =
        document.querySelector(selector);

    if (
        !elemento ||
        !ICONOS_HUB[icono] ||
        elemento.querySelector(".icono-nav")
    ) {
        return;
    }

    const contenedor =
        document.createElement("span");

    contenedor.className = "icono-nav";
    contenedor.setAttribute(
        "aria-hidden",
        "true"
    );

    contenedor.innerHTML =
        ICONOS_HUB[icono];

    elemento.prepend(contenedor);
}

function iniciarAnimacionesHub() {
    if (
        !("IntersectionObserver" in window)
    ) {
        document
            .querySelectorAll(".hub-reveal")
            .forEach((elemento) => {
                elemento.classList.add(
                    "hub-visible"
                );
            });

        return;
    }

    observadorAnimaciones =
        new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (
                        entrada.isIntersecting
                    ) {
                        entrada.target.classList.add(
                            "hub-visible"
                        );

                        observadorAnimaciones.unobserve(
                            entrada.target
                        );
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin:
                    "0px 0px -30px 0px"
            }
        );

    actualizarAnimacionesHub();
}

function actualizarAnimacionesHub() {
    const elementos = document.querySelectorAll(
        ".encabezado-principal, main > section, footer"
    );

    elementos.forEach((elemento) => {
        if (
            elemento.classList.contains(
                "seccion-oculta-config"
            )
        ) {
            elemento.classList.remove(
                "hub-visible"
            );

            return;
        }

        elemento.classList.add(
            "hub-reveal"
        );

        if (!configuracionHub.animaciones) {
            elemento.classList.add(
                "hub-visible"
            );

            return;
        }

        if (observadorAnimaciones) {
            observadorAnimaciones.observe(
                elemento
            );
        } else {
            elemento.classList.add(
                "hub-visible"
            );
        }
    });
}
