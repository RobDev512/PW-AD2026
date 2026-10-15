/* =========================================================
   NAVEGACIÓN AGRUPADA Y AVANZADA
   ========================================================= */

const SECCIONES_NAVEGACION = [
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
];

let destinoNavegacionTemporal = null;
let bloqueoNavegacionHasta = 0;
let actualizacionNavegacionPendiente = false;
let hashInicialAplicado = false;


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarMenusDesplegables();

        configurarDocumentacionDesdeNav();

        configurarCierreExterior();

        configurarEnlacesInternos();

        configurarNavegacionActiva();

        configurarNavegacionMovil();

        configurarSincronizacionConPersonalizacion();

        aplicarHashInicialSiEsNecesario();
    }
);


/* =========================================================
   MENÚS DESPLEGABLES
   ========================================================= */

function configurarMenusDesplegables() {
    const desplegables =
        document.querySelectorAll(
            ".nav-desplegable"
        );


    desplegables.forEach(
        (desplegable) => {

            const boton =
                desplegable.querySelector(
                    ".nav-desplegable-boton"
                );


            const menu =
                desplegable.querySelector(
                    ".nav-desplegable-menu"
                );


            const elementosMenu =
                menu.querySelectorAll(
                    "a, button"
                );


            boton.addEventListener(
                "click",
                () => {

                    const abierto =
                        desplegable.classList.contains(
                            "abierto"
                        );


                    if (abierto) {
                        cerrarDesplegable(
                            desplegable
                        );
                    }

                    else {
                        abrirDesplegable(
                            desplegable
                        );
                    }
                }
            );


            boton.addEventListener(
                "keydown",
                (evento) => {

                    if (
                        evento.key ===
                            "ArrowDown" &&
                        menu.hidden
                    ) {
                        evento.preventDefault();

                        abrirDesplegable(
                            desplegable
                        );


                        const primerElemento =
                            menu.querySelector(
                                "a, button"
                            );


                        if (primerElemento) {
                            primerElemento.focus();
                        }
                    }
                }
            );


            elementosMenu.forEach(
                (elemento) => {

                    elemento.addEventListener(
                        "click",
                        () => {

                            if (
                                !elemento.hasAttribute(
                                    "data-nav-doc"
                                )
                            ) {
                                cerrarDesplegable(
                                    desplegable
                                );
                            }
                        }
                    );
                }
            );


            desplegable.addEventListener(
                "keydown",
                (evento) => {

                    if (
                        evento.key ===
                        "Escape"
                    ) {
                        cerrarDesplegable(
                            desplegable
                        );

                        boton.focus();
                    }
                }
            );
        }
    );
}


/* =========================================================
   ABRIR UN MENÚ
   ========================================================= */

function abrirDesplegable(
    desplegable
) {
    cerrarTodosLosMenus(
        desplegable
    );


    const boton =
        desplegable.querySelector(
            ".nav-desplegable-boton"
        );


    const menu =
        desplegable.querySelector(
            ".nav-desplegable-menu"
        );


    desplegable.classList.add(
        "abierto"
    );


    boton.setAttribute(
        "aria-expanded",
        "true"
    );


    menu.hidden =
        false;

    sincronizarNavegacionMovil();
}


/* =========================================================
   CERRAR UN MENÚ
   ========================================================= */

function cerrarDesplegable(
    desplegable
) {
    const boton =
        desplegable.querySelector(
            ".nav-desplegable-boton"
        );


    const menu =
        desplegable.querySelector(
            ".nav-desplegable-menu"
        );


    desplegable.classList.remove(
        "abierto"
    );


    if (boton) {
        boton.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    if (menu) {
        menu.hidden =
            true;
    }

    sincronizarNavegacionMovil();
}


/* =========================================================
   CERRAR TODOS LOS MENÚS
   ========================================================= */

function cerrarTodosLosMenus(
    excepcion = null
) {
    document
        .querySelectorAll(
            ".nav-desplegable.abierto"
        )
        .forEach(
            (desplegable) => {

                if (
                    desplegable !==
                    excepcion
                ) {
                    cerrarDesplegable(
                        desplegable
                    );
                }
            }
        );
}


/* =========================================================
   SINCRONIZACIÓN CON PERSONALIZACIÓN
   ========================================================= */

/*
   personalizacion.js controla qué secciones son visibles.
   La navegación observa directamente esas secciones para
   mantenerse sincronizada sin importar el orden en que se
   ejecuten ambos scripts.
*/

const SECCIONES_CONFIG_NAV = {
    progreso: "#progreso",
    actividad: "#actividad",
    unidades: ".seccion-portafolio",
    trabajos: "#trabajos",
    estadisticas: "#estadisticas",
    historial: "#historial",
    roadmap: "#roadmap",
    documentacion: "#documentacion"
};


function configurarSincronizacionConPersonalizacion() {
    const elementosObservados =
        Object.values(
            SECCIONES_CONFIG_NAV
        )
            .map(
                selector =>
                    document.querySelector(
                        selector
                    )
            )
            .filter(Boolean);


    const observador =
        new MutationObserver(
            () => {
                sincronizarBarraConSecciones();
            }
        );


    elementosObservados.forEach(
        elemento => {
            observador.observe(
                elemento,
                {
                    attributes: true,
                    attributeFilter: [
                        "class",
                        "hidden"
                    ]
                }
            );
        }
    );


    /*
       Las unidades se crean de forma dinámica. También
       observamos su contenedor para volver a sincronizar.
    */
    const contenedorUnidades =
        document.querySelector(
            ".seccion-portafolio"
        );


    if (contenedorUnidades) {
        observador.observe(
            contenedorUnidades,
            {
                childList: true,
                subtree: true
            }
        );
    }


    const alCambiarViewport =
        () => {
            sincronizarBarraConSecciones();
        };


    if (
        typeof mediaNavegacionMovil
            .addEventListener ===
        "function"
    ) {
        mediaNavegacionMovil
            .addEventListener(
                "change",
                alCambiarViewport
            );
    }

    else {
        mediaNavegacionMovil
            .addListener(
                alCambiarViewport
            );
    }


    /*
       personalizacion.js aplica su configuración en otro
       listener de DOMContentLoaded. Esperamos un frame para
       leer el estado definitivo.
    */
    requestAnimationFrame(
        () => {
            sincronizarBarraConSecciones();
        }
    );


    setTimeout(
        () => {
            sincronizarBarraConSecciones();
        },
        0
    );
}


function seccionConfiguradaVisible(
    clave
) {
    const selector =
        SECCIONES_CONFIG_NAV[
            clave
        ];


    if (!selector) {
        return true;
    }


    const elemento =
        document.querySelector(
            selector
        );


    if (!elemento) {
        return false;
    }


    return (
        !elemento.hidden &&
        !elemento.classList.contains(
            "seccion-oculta-config"
        )
    );
}


function cambiarVisibilidadNav(
    selector,
    visible
) {
    document
        .querySelectorAll(
            selector
        )
        .forEach(
            elemento => {
                elemento.hidden =
                    !visible;
            }
        );
}


function sincronizarBarraConSecciones() {
    const progreso =
        seccionConfiguradaVisible(
            "progreso"
        );


    const unidades =
        seccionConfiguradaVisible(
            "unidades"
        );


    const actividad =
        seccionConfiguradaVisible(
            "actividad"
        );


    const trabajos =
        seccionConfiguradaVisible(
            "trabajos"
        );


    const estadisticas =
        seccionConfiguradaVisible(
            "estadisticas"
        );


    const historial =
        seccionConfiguradaVisible(
            "historial"
        );


    const roadmap =
        seccionConfiguradaVisible(
            "roadmap"
        );


    const documentacion =
        seccionConfiguradaVisible(
            "documentacion"
        );


    cambiarVisibilidadNav(
        'a[href="#progreso"]',
        progreso
    );


    [
        "unidad1",
        "unidad2",
        "unidad3",
        "unidad4",
        "unidad5"
    ].forEach(
        id => {
            cambiarVisibilidadNav(
                `a[href="#${id}"]`,
                unidades
            );
        }
    );


    cambiarVisibilidadNav(
        'a[href="#actividad"]',
        actividad
    );


    cambiarVisibilidadNav(
        'a[href="#trabajos"]',
        trabajos
    );


    cambiarVisibilidadNav(
        'a[href="#estadisticas"]',
        estadisticas
    );


    cambiarVisibilidadNav(
        'a[href="#historial"]',
        historial
    );


    cambiarVisibilidadNav(
        'a[href="#roadmap"]',
        roadmap
    );


    cambiarVisibilidadNav(
        'a[href="#documentacion"]',
        documentacion
    );


    document
        .querySelectorAll(
            "[data-nav-doc]"
        )
        .forEach(
            boton => {
                boton.hidden =
                    !documentacion;
            }
        );


    sincronizarGrupoCurso(
        progreso,
        unidades
    );


    sincronizarGrupoExplorar({
        actividad,
        trabajos,
        estadisticas,
        historial,
        roadmap,
        documentacion
    });


    sincronizarGrupoDocumentacion(
        documentacion
    );


    solicitarActualizacionNavegacion();
}


function sincronizarGrupoCurso(
    progreso,
    unidades
) {
    const desplegable =
        document
            .querySelector(
                '.nav-desplegable-boton[aria-controls="menu-curso"]'
            )
            ?.closest(
                ".nav-desplegable"
            );


    if (!desplegable) {
        return;
    }


    desplegable.hidden =
        !(progreso || unidades);


    if (desplegable.hidden) {
        cerrarDesplegable(
            desplegable
        );
    }
}


function sincronizarGrupoExplorar(
    estados
) {
    const desplegable =
        document
            .querySelector(
                '.nav-desplegable-boton[aria-controls="menu-explorar"]'
            )
            ?.closest(
                ".nav-desplegable"
            );


    if (!desplegable) {
        return;
    }


    const contenidoExplorar =
        estados.actividad ||
        estados.trabajos ||
        estados.estadisticas ||
        estados.historial ||
        estados.roadmap;


    const contenidoMovil =
        contenidoExplorar ||
        (
            mediaNavegacionMovil
                .matches &&
            estados.documentacion
        );


    const tituloExplorar =
        document.querySelector(
            '[data-nav-grupo="explorar"]'
        );


    if (tituloExplorar) {
        tituloExplorar.hidden =
            !contenidoExplorar;
    }


    const tituloDocumentacion =
        document.querySelector(
            '[data-nav-grupo="documentacion"]'
        );


    if (tituloDocumentacion) {
        tituloDocumentacion.hidden =
            !estados.documentacion;
    }


    desplegable.hidden =
        !contenidoMovil;


    if (desplegable.hidden) {
        cerrarDesplegable(
            desplegable
        );
    }
}


function sincronizarGrupoDocumentacion(
    documentacion
) {
    const desplegable =
        document.querySelector(
            ".nav-documentacion"
        );


    if (!desplegable) {
        return;
    }


    /*
       En móvil la clase CSS nav-documentacion lo oculta
       y sus accesos viven dentro de Explorar.
       Aquí conservamos el atributo hidden en false cuando
       Documentación está habilitada para que al volver a
       escritorio reaparezca inmediatamente.
    */
    desplegable.hidden =
        !documentacion;


    if (!documentacion) {
        cerrarDesplegable(
            desplegable
        );
    }
}


/* =========================================================
   NAVEGACIÓN MÓVIL
   ========================================================= */

let capaNavegacionMovil = null;

const mediaNavegacionMovil =
    window.matchMedia(
        "(max-width: 650px)"
    );


function configurarNavegacionMovil() {
    if (!capaNavegacionMovil) {
        capaNavegacionMovil =
            document.createElement(
                "button"
            );


        capaNavegacionMovil.type =
            "button";


        capaNavegacionMovil.className =
            "nav-movil-capa";


        capaNavegacionMovil.hidden =
            true;


        capaNavegacionMovil.setAttribute(
            "aria-label",
            "Cerrar menú de navegación"
        );


        document.body.appendChild(
            capaNavegacionMovil
        );


        capaNavegacionMovil.addEventListener(
            "click",
            () => {
                cerrarTodosLosMenus();
            }
        );
    }


    const alCambiar =
        () => {

            cerrarTodosLosMenus();

            sincronizarNavegacionMovil();

            solicitarActualizacionNavegacion();
        };


    if (
        typeof mediaNavegacionMovil
            .addEventListener ===
        "function"
    ) {
        mediaNavegacionMovil
            .addEventListener(
                "change",
                alCambiar
            );
    }

    else {
        mediaNavegacionMovil
            .addListener(
                alCambiar
            );
    }


    sincronizarNavegacionMovil();
}


function sincronizarNavegacionMovil() {
    if (!capaNavegacionMovil) {
        return;
    }


    const hayPanelAbierto =
        mediaNavegacionMovil.matches &&
        Boolean(
            document.querySelector(
                ".nav-desplegable.abierto"
            )
        );


    capaNavegacionMovil.hidden =
        !hayPanelAbierto;


    document.body.classList.toggle(
        "nav-movil-panel-abierto",
        hayPanelAbierto
    );
}


/* =========================================================
   DOCUMENTACIÓN DESDE LA NAV
   ========================================================= */

function configurarDocumentacionDesdeNav() {
    document
        .querySelectorAll(
            "[data-nav-doc]"
        )
        .forEach(
            (botonNav) => {

                botonNav.addEventListener(
                    "click",
                    () => {

                        const documento =
                            botonNav.dataset
                                .navDoc;


                        const botonDocumento =
                            document.querySelector(
                                `.boton-documento[data-doc="${documento}"]`
                            );


                        if (botonDocumento) {
                            botonDocumento.click();


                            setTimeout(
                                () => {

                                    const visor =
                                        document.getElementById(
                                            "visor-markdown"
                                        );


                                    if (visor) {
                                        marcarNavegacionActiva(
                                            "documentacion"
                                        );


                                        visor.scrollIntoView({
                                            behavior:
                                                "smooth",

                                            block:
                                                "start"
                                        });
                                    }
                                },
                                80
                            );
                        }


                        cerrarTodosLosMenus();
                    }
                );
            }
        );
}


/* =========================================================
   CERRAR AL HACER CLIC FUERA
   ========================================================= */

function configurarCierreExterior() {
    document.addEventListener(
        "click",
        (evento) => {

            document
                .querySelectorAll(
                    ".nav-desplegable.abierto"
                )
                .forEach(
                    (desplegable) => {

                        if (
                            !desplegable.contains(
                                evento.target
                            )
                        ) {
                            cerrarDesplegable(
                                desplegable
                            );
                        }
                    }
                );
        }
    );
}


/* =========================================================
   ENLACES INTERNOS
   ========================================================= */

function configurarEnlacesInternos() {
    document
        .querySelectorAll(
            '.navegacion-hub a[href^="#"]'
        )
        .forEach(
            (enlace) => {

                enlace.addEventListener(
                    "click",
                    (evento) => {

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


                        const idDestino =
                            href.slice(1);


                        const destino =
                            document.getElementById(
                                idDestino
                            );


                        /*
                            Las unidades se generan dinámicamente.
                            Si todavía no existen, dejamos que
                            el comportamiento normal continúe.
                        */

                        if (!destino) {
                            return;
                        }


                        evento.preventDefault();


                        iniciarNavegacionHacia(
                            idDestino
                        );


                        registrarDestinoEnURL(
                            idDestino
                        );


                        destino.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });
                    }
                );
            }
        );
}


/* =========================================================
   BLOQUEO TEMPORAL DURANTE NAVEGACIÓN POR CLIC
   ========================================================= */

function iniciarNavegacionHacia(
    idDestino
) {
    destinoNavegacionTemporal =
        idDestino;


    bloqueoNavegacionHasta =
        performance.now() +
        900;


    /*
        El usuario debe ver seleccionado inmediatamente
        aquello que acaba de pulsar, sin esperar al scroll.
    */

    marcarNavegacionActiva(
        idDestino
    );


    setTimeout(
        () => {

            if (
                destinoNavegacionTemporal ===
                idDestino
            ) {
                destinoNavegacionTemporal =
                    null;


                solicitarActualizacionNavegacion();
            }
        },
        950
    );
}


/* =========================================================
   GUARDAR DESTINO EN URL
   ========================================================= */

function registrarDestinoEnURL(
    idDestino
) {
    const hash =
        `#${idDestino}`;


    if (
        window.location.hash ===
        hash
    ) {
        return;
    }


    try {
        history.pushState(
            {
                seccion:
                    idDestino
            },
            "",
            hash
        );
    }

    catch (error) {
        /*
            Algunos entornos file:// pueden ser más
            restrictivos. En ese caso no detenemos
            la navegación por un cambio de URL.
        */

        console.warn(
            "No fue posible registrar el hash en el historial.",
            error
        );
    }
}


/* =========================================================
   NAVEGACIÓN ACTIVA
   ========================================================= */

function configurarNavegacionActiva() {
    window.addEventListener(
        "scroll",
        solicitarActualizacionNavegacion,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        solicitarActualizacionNavegacion
    );


    window.addEventListener(
        "popstate",
        () => {

            const idDestino =
                obtenerIdDesdeHash();


            const destino =
                document.getElementById(
                    idDestino
                );


            if (destino) {
                iniciarNavegacionHacia(
                    idDestino
                );


                destino.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start"
                });
            }
        }
    );


    /*
        Las unidades aparecen después de leer unidades.json.
        Cuando cambie el contenido, volvemos a comprobar
        la navegación y el hash inicial.
    */

    const contenedorUnidades =
        document.getElementById(
            "contenedor-unidades"
        );


    if (contenedorUnidades) {
        const observador =
            new MutationObserver(
                () => {

                    aplicarHashInicialSiEsNecesario();

                    solicitarActualizacionNavegacion();
                }
            );


        observador.observe(
            contenedorUnidades,
            {
                childList: true,
                subtree: true
            }
        );
    }


    solicitarActualizacionNavegacion();
}


/* =========================================================
   SOLICITAR ACTUALIZACIÓN
   ========================================================= */

function solicitarActualizacionNavegacion() {
    if (
        actualizacionNavegacionPendiente
    ) {
        return;
    }


    actualizacionNavegacionPendiente =
        true;


    requestAnimationFrame(
        () => {

            actualizarSeccionActiva();


            actualizacionNavegacionPendiente =
                false;
        }
    );
}


/* =========================================================
   CALCULAR SECCIÓN ACTIVA
   ========================================================= */

function actualizarSeccionActiva() {
    /*
        Mientras ocurre un scroll iniciado desde la nav,
        conservamos seleccionado el destino elegido.
        Esto evita que durante la animación se resalte
        temporalmente la sección anterior.
    */

    if (
        destinoNavegacionTemporal &&
        performance.now() <
            bloqueoNavegacionHasta
    ) {
        marcarNavegacionActiva(
            destinoNavegacionTemporal
        );

        return;
    }


    destinoNavegacionTemporal =
        null;


    /*
        Cerca del inicio de la página siempre gana Inicio.
    */

    if (
        window.scrollY <
        160
    ) {
        marcarNavegacionActiva(
            "inicio"
        );


        sincronizarHashSinCrearEntrada(
            "inicio"
        );

        return;
    }


    const nav =
        document.querySelector(
            ".navegacion-principal"
        );


    const alturaNav =
        nav
            ? nav.offsetHeight
            : 70;


    /*
        Usamos una línea de lectura dentro del viewport,
        no solamente la parte superior de la pantalla.

        Esto corrige el desfase de una sección que ocurría
        con U1/U2/U3 y con Trabajos.
    */

    const lineaActivacion =
        Math.max(
            alturaNav + 120,
            window.innerHeight *
                0.42
        );


    let idActivo =
        null;


    /*
        Primero buscamos la sección que realmente contiene
        la línea de activación.
    */

    for (
        const id of
        SECCIONES_NAVEGACION
    ) {
        const seccion =
            document.getElementById(
                id
            );


        if (!seccion) {
            continue;
        }


        const rect =
            seccion.getBoundingClientRect();


        if (
            rect.top <=
                lineaActivacion &&
            rect.bottom >
                lineaActivacion
        ) {
            idActivo =
                id;

            break;
        }
    }


    /*
        Si estamos en un espacio entre dos secciones,
        elegimos la sección cuyo inicio esté más cerca
        de la línea de lectura.
    */

    if (!idActivo) {
        let distanciaMenor =
            Number.POSITIVE_INFINITY;


        SECCIONES_NAVEGACION.forEach(
            (id) => {

                const seccion =
                    document.getElementById(
                        id
                    );


                if (!seccion) {
                    return;
                }


                const rect =
                    seccion
                        .getBoundingClientRect();


                const distancia =
                    Math.abs(
                        rect.top -
                        lineaActivacion
                    );


                if (
                    distancia <
                    distanciaMenor
                ) {
                    distanciaMenor =
                        distancia;

                    idActivo =
                        id;
                }
            }
        );
    }


    /*
        Al final de la página debe quedar activa
        Documentación.
    */

    const cercaDelFinal =
        window.innerHeight +
        window.scrollY >=
        document.documentElement.scrollHeight -
        10;


    if (
        cercaDelFinal &&
        document.getElementById(
            "documentacion"
        )
    ) {
        idActivo =
            "documentacion";
    }


    if (!idActivo) {
        idActivo =
            "inicio";
    }


    marcarNavegacionActiva(
        idActivo
    );


    sincronizarHashSinCrearEntrada(
        idActivo
    );
}


/* =========================================================
   MARCAR PADRE E HIJO ACTIVOS
   ========================================================= */

function marcarNavegacionActiva(
    idActivo
) {
    document
        .querySelectorAll(
            ".navegacion-hub .nav-activo"
        )
        .forEach(
            (elemento) =>

                elemento.classList.remove(
                    "nav-activo"
                )
        );


    document
        .querySelectorAll(
            ".navegacion-hub .nav-subactivo"
        )
        .forEach(
            (elemento) =>

                elemento.classList.remove(
                    "nav-subactivo"
                )
        );


    if (
        idActivo ===
        "inicio"
    ) {
        activarEnlacePrincipal(
            "#inicio"
        );

        return;
    }


    if (
        idActivo ===
            "progreso" ||
        /^unidad[1-5]$/.test(
            idActivo
        )
    ) {
        activarPadre(
            "menu-curso"
        );


        activarSubEnlace(
            `#${idActivo}`
        );

        return;
    }


    if (
        [
            "actividad",
            "trabajos",
            "estadisticas",
            "historial",
            "roadmap"
        ].includes(
            idActivo
        )
    ) {
        activarPadre(
            "menu-explorar"
        );


        activarSubEnlace(
            `#${idActivo}`
        );

        return;
    }


    if (
        idActivo ===
        "documentacion"
    ) {
        if (
            window.matchMedia(
                "(max-width: 650px)"
            ).matches
        ) {
            activarPadre(
                "menu-explorar"
            );
        }

        else {
            activarPadre(
                "menu-documentacion"
            );
        }


        activarSubEnlace(
            "#documentacion"
        );
    }
}


/* =========================================================
   ACTIVAR ENLACE PRINCIPAL
   ========================================================= */

function activarEnlacePrincipal(
    selector
) {
    const enlace =
        document.querySelector(
            `.navegacion-interior > a[href="${selector}"]`
        );


    if (enlace) {
        enlace.classList.add(
            "nav-activo"
        );
    }
}


/* =========================================================
   ACTIVAR PADRE
   ========================================================= */

function activarPadre(
    idMenu
) {
    const boton =
        document.querySelector(
            `.nav-desplegable-boton[aria-controls="${idMenu}"]`
        );


    if (boton) {
        boton.classList.add(
            "nav-activo"
        );
    }
}


/* =========================================================
   ACTIVAR SUBENLACE
   ========================================================= */

function activarSubEnlace(
    selector
) {
    const enlace =
        document.querySelector(
            `.nav-desplegable-menu a[href="${selector}"]`
        );


    if (enlace) {
        enlace.classList.add(
            "nav-subactivo"
        );
    }
}


/* =========================================================
   SINCRONIZAR HASH SIN CREAR HISTORIAL
   ========================================================= */

function sincronizarHashSinCrearEntrada(
    idActivo
) {
    const nuevoHash =
        `#${idActivo}`;


    if (
        window.location.hash ===
        nuevoHash
    ) {
        return;
    }


    try {
        history.replaceState(
            history.state,
            "",
            nuevoHash
        );
    }

    catch (error) {
        /*
            No es un error crítico para el funcionamiento
            visual, especialmente trabajando con file://.
        */
    }
}


/* =========================================================
   OBTENER ID DESDE HASH
   ========================================================= */

function obtenerIdDesdeHash() {
    const id =
        window.location.hash
            .replace(
                "#",
                ""
            );


    return id ||
        "inicio";
}


/* =========================================================
   HASH INICIAL
   ========================================================= */

function aplicarHashInicialSiEsNecesario() {
    if (
        hashInicialAplicado
    ) {
        return;
    }


    const id =
        obtenerIdDesdeHash();


    if (
        id === "inicio"
    ) {
        hashInicialAplicado =
            true;


        marcarNavegacionActiva(
            "inicio"
        );

        return;
    }


    const destino =
        document.getElementById(
            id
        );


    /*
        Si todavía no existe porque es una unidad dinámica,
        esperamos al MutationObserver.
    */

    if (!destino) {
        return;
    }


    hashInicialAplicado =
        true;


    iniciarNavegacionHacia(
        id
    );


    setTimeout(
        () => {

            destino.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"
            });
        },
        100
    );
}
