/*
    =========================================================
    PW HUB - SINCRONIZACIÓN AUTOMÁTICA DE TRABAJOS
    =========================================================

    El Hub mantiene unidades.json como catálogo base y fuente
    de metadatos bonitos.

    Cuando existe conexión:
    1. consulta el árbol público de GitHub;
    2. detecta trabajos nuevos dentro de U1, U2, U3, U4 y U5;
    3. conserva nombres/descripciones manuales de unidades.json;
    4. agrega automáticamente los archivos nuevos;
    5. guarda el último catálogo detectado como respaldo local;
    6. comparte ese mismo catálogo con todas las secciones del Hub;
    7. registra estado, novedades y fechas para PW Hub v1.1.0.

    Sin conexión:
    - usa unidades.json;
    - complementa con la última detección guardada.

    También registra el Service Worker del portafolio.
*/

const PW_HUB_GITHUB = {
    propietario: "RobDev512",
    repositorio: "PW-AD2026",
    rama: "main",
    raiz:
        "23400614_Rodríguez_Magaña_Roberto_Carlos"
};

const PW_HUB_SYNC = {
    claveSnapshot:
        "pw-hub-trabajos-github-v1",

    claveUltimaConsulta:
        "pw-hub-ultima-consulta-github-v1",

    intervaloMinimo:
        60 * 1000,

    tiempoMaximoConsulta:
        4500,

    tamanoMaximoCache:
        10 * 1024 * 1024,

    claveRutasConocidas:
        "pw-hub-rutas-conocidas-v1",

    claveNuevosPendientes:
        "pw-hub-nuevos-pendientes-v1",

    claveFechasGitHub:
        "pw-hub-fechas-github-v1",

    vigenciaFechasGitHub:
        24 * 60 * 60 * 1000
};

const PW_HUB_ARCHIVOS_IGNORADOS =
    new Set([
        "base.html"
    ]);

/*
   Catálogo compartido.

   Varias secciones del Hub consultan data/unidades.json por
   separado. Interceptamos únicamente esa petición y devolvemos
   una copia del mismo catálogo ya fusionado con GitHub.

   Así Unidades, resumen, Todos los trabajos, Estadísticas y
   cualquier consumidor futuro de unidades.json ven exactamente
   los mismos trabajos sin tener que duplicar lógica.
*/
const PW_HUB_FETCH_ORIGINAL =
    window.fetch.bind(window);

const PW_HUB_URL_CATALOGO =
    new URL(
        "data/unidades.json",
        window.location.href
    );

let promesaCatalogoHubSincronizado =
    null;

let estadoSincronizacionHub = {
    estado: "sincronizando",
    origen: "inicio",
    ultimaSincronizacion: null
};

const promesasFechasGitHubHub =
    new Map();


window.sincronizarTrabajosGitHub =
    sincronizarTrabajosGitHub;

window.obtenerDatosHubSincronizados =
    obtenerDatosHubSincronizados;

window.PWHubSync = {
    obtenerEstado:
        obtenerEstadoSincronizacionHub,

    obtenerNuevos:
        obtenerTrabajosNuevosHub,

    esNuevo:
        esTrabajoNuevoHub,

    marcarVisto:
        marcarTrabajoVistoHub,

    obtenerFechaActualizacion:
        obtenerFechaActualizacionTrabajoHub,

    normalizarRuta:
        normalizarRutaTrabajoHub
};

window.forzarSincronizacionTrabajosHub =
    () => {
        promesaCatalogoHubSincronizado =
            null;

        try {
            localStorage.removeItem(
                PW_HUB_SYNC.claveUltimaConsulta
            );
        } catch {
            // No es crítico si localStorage no está disponible.
        }

        actualizarEstadoSincronizacionHub(
            "sincronizando",
            {
                origen: "manual"
            }
        );
    };


window.fetch =
    async (
        entrada,
        opciones
    ) => {
        if (
            !esSolicitudCatalogoHub(
                entrada,
                opciones
            )
        ) {
            return PW_HUB_FETCH_ORIGINAL(
                entrada,
                opciones
            );
        }

        const datos =
            await obtenerDatosHubSincronizados();

        return new Response(
            JSON.stringify(datos),
            {
                status:
                    200,

                headers: {
                    "Content-Type":
                        "application/json; charset=utf-8",

                    "Cache-Control":
                        "no-store",

                    "X-PW-Hub-Catalogo":
                        "sincronizado"
                }
            }
        );
    };


cargarRecursosNovedadesHub();

window.addEventListener(
    "offline",
    () => {
        actualizarEstadoSincronizacionHub(
            "offline",
            {
                origen: "navegador",
                ultimaSincronizacion:
                    leerSnapshotTrabajosHub()
                        ?.actualizado ||
                    estadoSincronizacionHub
                        .ultimaSincronizacion ||
                    null
            }
        );
    }
);

window.addEventListener(
    "online",
    () => {
        const snapshot =
            leerSnapshotTrabajosHub();

        actualizarEstadoSincronizacionHub(
            snapshot
                ? "cache"
                : "sincronizando",
            {
                origen:
                    snapshot
                        ? "cache"
                        : "navegador",
                ultimaSincronizacion:
                    snapshot?.actualizado || null
            }
        );
    }
);


document.addEventListener(
    "DOMContentLoaded",
    () => {
        registrarModoOfflineHub();
    }
);


async function obtenerDatosHubSincronizados() {
    if (!promesaCatalogoHubSincronizado) {
        promesaCatalogoHubSincronizado =
            cargarDatosHubSincronizados()
                .catch(
                    (error) => {
                        promesaCatalogoHubSincronizado =
                            null;

                        throw error;
                    }
                );
    }

    const datos =
        await promesaCatalogoHubSincronizado;

    return clonarDatosHub(
        datos
    );
}


async function cargarDatosHubSincronizados() {
    const respuesta =
        await PW_HUB_FETCH_ORIGINAL(
            PW_HUB_URL_CATALOGO.href,
            {
                cache:
                    "no-cache"
            }
        );

    if (!respuesta.ok) {
        throw new Error(
            "No fue posible cargar unidades.json"
        );
    }

    const datosBase =
        await respuesta.json();

    return sincronizarTrabajosGitHub(
        datosBase
    );
}


function esSolicitudCatalogoHub(
    entrada,
    opciones
) {
    try {
        const metodo =
            String(
                opciones?.method ||
                (
                    entrada instanceof Request
                        ? entrada.method
                        : "GET"
                )
            ).toUpperCase();

        if (metodo !== "GET") {
            return false;
        }

        const valor =
            entrada instanceof Request
                ? entrada.url
                : entrada;

        const url =
            new URL(
                String(valor),
                window.location.href
            );

        return (
            url.origin ===
                PW_HUB_URL_CATALOGO.origin &&
            url.pathname ===
                PW_HUB_URL_CATALOGO.pathname
        );
    } catch {
        return false;
    }
}


async function sincronizarTrabajosGitHub(
    datosBase
) {
    const datos =
        clonarDatosHub(datosBase);

    const snapshot =
        leerSnapshotTrabajosHub();

    const ultimaSincronizacion =
        snapshot?.actualizado || null;

    /*
       En file:// la API podría responder, pero el Service
       Worker no funciona. El Hub conserva el catálogo local.
    */
    if (
        window.location.protocol ===
        "file:"
    ) {
        actualizarEstadoSincronizacionHub(
            snapshot
                ? "cache"
                : "offline",
            {
                origen: "local",
                ultimaSincronizacion
            }
        );

        return snapshot
            ? fusionarTrabajosHub(
                datos,
                snapshot.trabajos,
                {
                    validarExistencia:
                        true
                }
            )
            : datos;
    }

    /*
       Si el navegador ya sabe que no existe conexión, evitamos
       una solicitud que necesariamente fallará y utilizamos la
       última copia disponible.
    */
    if (navigator.onLine === false) {
        actualizarEstadoSincronizacionHub(
            "offline",
            {
                origen:
                    snapshot
                        ? "cache"
                        : "base",
                ultimaSincronizacion
            }
        );

        if (snapshot) {
            prepararCacheOfflineHub(
                snapshot.archivosCache || []
            );

            return fusionarTrabajosHub(
                datos,
                snapshot.trabajos,
                {
                    validarExistencia:
                        true
                }
            );
        }

        return datos;
    }

    /*
       Si acabamos de consultar GitHub hace menos de un minuto,
       reutilizamos el snapshot. Evita gastar el límite público
       de la API por recargas repetidas.
    */
    if (
        snapshot &&
        consultaGitHubRecienteHub()
    ) {
        prepararCacheOfflineHub(
            snapshot.archivosCache || []
        );

        /*
           hub.js conserva por compatibilidad una llamada directa
           a sincronizarTrabajosGitHub después de leer el catálogo.
           Si esta misma carga acaba de sincronizar correctamente,
           no degradamos el indicador a "caché" por esa segunda
           llamada interna.
        */
        if (
            estadoSincronizacionHub.estado !==
            "sincronizado"
        ) {
            actualizarEstadoSincronizacionHub(
                "cache",
                {
                    origen: "cache",
                    ultimaSincronizacion
                }
            );
        }

        return fusionarTrabajosHub(
            datos,
            snapshot.trabajos,
            {
                validarExistencia:
                    true
            }
        );
    }

    actualizarEstadoSincronizacionHub(
        "sincronizando",
        {
            origen: "github",
            ultimaSincronizacion
        }
    );

    try {
        const arbol =
            await obtenerArbolGitHubHub();

        const trabajos =
            detectarTrabajosGitHubHub(
                arbol.tree || []
            );

        const archivosCache =
            detectarArchivosParaCacheHub(
                arbol.tree || []
            );

        const actualizado =
            new Date().toISOString();

        actualizarNovedadesTrabajosHub(
            trabajos
        );

        guardarSnapshotTrabajosHub({
            sha:
                arbol.sha || "",

            trabajos,

            archivosCache,

            actualizado
        });

        marcarConsultaGitHubHub();

        prepararCacheOfflineHub(
            archivosCache
        );

        actualizarEstadoSincronizacionHub(
            "sincronizado",
            {
                origen: "github",
                ultimaSincronizacion:
                    actualizado
            }
        );

        return fusionarTrabajosHub(
            datos,
            trabajos,
            {
                validarExistencia:
                    true
            }
        );
    } catch (error) {
        console.warn(
            "PW Hub: no fue posible sincronizar " +
            "el catálogo con GitHub.",
            error
        );

        if (snapshot) {
            prepararCacheOfflineHub(
                snapshot.archivosCache || []
            );

            actualizarEstadoSincronizacionHub(
                "cache",
                {
                    origen: "cache",
                    ultimaSincronizacion
                }
            );

            return fusionarTrabajosHub(
                datos,
                snapshot.trabajos,
                {
                    validarExistencia:
                        true
                }
            );
        }

        actualizarEstadoSincronizacionHub(
            "offline",
            {
                origen: "base",
                ultimaSincronizacion: null
            }
        );

        return datos;
    }
}


async function obtenerArbolGitHubHub() {
    const controlador =
        new AbortController();

    const temporizador =
        window.setTimeout(
            () => controlador.abort(),
            PW_HUB_SYNC.tiempoMaximoConsulta
        );

    const raiz =
        encodeURIComponent(
            PW_HUB_GITHUB.rama
        );

    const url =
        `https://api.github.com/repos/` +
        `${PW_HUB_GITHUB.propietario}/` +
        `${PW_HUB_GITHUB.repositorio}/` +
        `git/trees/${raiz}?recursive=1`;

    try {
        const respuesta =
            await fetch(
                url,
                {
                    headers: {
                        Accept:
                            "application/vnd.github+json"
                    },
                    signal:
                        controlador.signal
                }
            );

        if (!respuesta.ok) {
            throw new Error(
                `GitHub respondió ${respuesta.status}`
            );
        }

        const datos =
            await respuesta.json();

        if (
            !datos ||
            !Array.isArray(datos.tree)
        ) {
            throw new Error(
                "La respuesta de GitHub no contiene un árbol válido."
            );
        }

        return datos;
    } finally {
        window.clearTimeout(
            temporizador
        );
    }
}


function detectarTrabajosGitHubHub(
    elementos
) {
    const prefijo =
        `${PW_HUB_GITHUB.raiz}/`;

    const trabajos = [];

    elementos
        .filter(
            (elemento) =>
                elemento &&
                elemento.type === "blob" &&
                typeof elemento.path === "string" &&
                elemento.path.startsWith(prefijo)
        )
        .forEach((elemento) => {
            const ruta =
                elemento.path.slice(
                    prefijo.length
                );

            const coincidencia =
                ruta.match(
                    /^U([1-5])\/(.+)$/i
                );

            if (!coincidencia) {
                return;
            }

            const unidad =
                Number(
                    coincidencia[1]
                );

            const rutaUnidad =
                coincidencia[2];

            if (
                !esTrabajoVisibleHub(
                    rutaUnidad
                )
            ) {
                return;
            }

            const tipo =
                obtenerTipoTrabajoHub(
                    rutaUnidad
                );

            trabajos.push({
                unidad,
                ruta:
                    `U${unidad}/${rutaUnidad}`,
                tipo,
                nombre:
                    generarNombreTrabajoHub(
                        rutaUnidad
                    ),
                descripcion:
                    `Trabajo ${formatearTipoAutoHub(tipo)} ` +
                    `detectado automáticamente en U${unidad}.`
            });
        });

    return trabajos.sort(
        compararTrabajosHub
    );
}


function esTrabajoVisibleHub(
    rutaUnidad
) {
    const partes =
        rutaUnidad.split("/");

    const archivo =
        partes.at(-1) || "";

    const archivoMinusculas =
        archivo.toLowerCase();

    if (
        archivo.startsWith(".") ||
        PW_HUB_ARCHIVOS_IGNORADOS.has(
            archivoMinusculas
        )
    ) {
        return false;
    }

    /*
       README.md en la raíz de cada unidad funciona como
       documentación de carpeta, no como trabajo.

       Un README dentro de un proyecto sí puede representar
       el trabajo, como catalogo-peliculas/README.md.
    */
    if (
        partes.length === 1 &&
        archivoMinusculas ===
            "readme.md"
    ) {
        return false;
    }

    return (
        archivoMinusculas.endsWith(
            ".html"
        ) ||
        archivoMinusculas.endsWith(
            ".htm"
        ) ||
        archivoMinusculas.endsWith(
            ".pdf"
        ) ||
        archivoMinusculas.endsWith(
            ".md"
        )
    );
}


function obtenerTipoTrabajoHub(
    ruta
) {
    const extension =
        (ruta.split(".").pop() || "")
            .toLowerCase();

    const mapa = {
        html: "html",
        htm: "html",
        md: "markdown",
        pdf: "pdf"
    };

    return (
        mapa[extension] ||
        "archivo"
    );
}


function generarNombreTrabajoHub(
    rutaUnidad
) {
    const partes =
        rutaUnidad.split("/");

    const archivo =
        partes.at(-1) || rutaUnidad;

    /*
       Para README.md de un subproyecto usamos el nombre
       de la carpeta contenedora.
    */
    const base =
        archivo.toLowerCase() ===
            "readme.md" &&
        partes.length > 1
            ? partes.at(-2)
            : archivo.replace(
                /\.[^.]+$/,
                ""
            );

    const especiales = {
        flex:
            "Ejemplo Flexbox",

        grid:
            "Ejemplo CSS Grid"
    };

    const especial =
        especiales[
            base.toLowerCase()
        ];

    if (especial) {
        return especial;
    }

    let nombre =
        base
            .replace(
                /[-_]+/g,
                " "
            )
            .replace(
                /([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g,
                "$1 $2"
            )
            .replace(
                /([A-Za-zÁÉÍÓÚÑáéíóúñ])(\d+)/g,
                "$1 $2"
            )
            .replace(
                /(\d+)([A-Za-zÁÉÍÓÚÑáéíóúñ])/g,
                "$1 $2"
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    nombre =
        nombre
            .replace(
                /\bcss\b/gi,
                "CSS"
            )
            .replace(
                /\bhtml\b/gi,
                "HTML"
            )
            .replace(
                /\bjs\b/gi,
                "JS"
            );

    if (!nombre) {
        return "Trabajo";
    }

    return (
        nombre.charAt(0).toUpperCase() +
        nombre.slice(1)
    );
}


function fusionarTrabajosHub(
    datos,
    detectados,
    opciones = {}
) {
    if (
        !datos ||
        !Array.isArray(datos.unidades) ||
        !Array.isArray(detectados)
    ) {
        return datos;
    }

    const porUnidad =
        new Map();

    detectados.forEach(
        (trabajo) => {
            if (
                !porUnidad.has(
                    trabajo.unidad
                )
            ) {
                porUnidad.set(
                    trabajo.unidad,
                    []
                );
            }

            porUnidad
                .get(trabajo.unidad)
                .push(trabajo);
        }
    );

    datos.unidades.forEach(
        (unidad) => {
            const manuales =
                Array.isArray(
                    unidad.trabajos
                )
                    ? unidad.trabajos
                    : [];

            /*
               Si GitHub está disponible, una ruta manual que ya
               no existe no debe seguir produciendo una tarjeta 404.

               Esto cubre renombres como:
               Ejercicio1CSS.html -> Ejercicio0CSS.html

               Solo validamos archivos que el sincronizador sabe
               detectar. Otros tipos manuales se conservan.
            */
            const rutasDetectadas =
                new Set(
                    (
                        porUnidad.get(
                            unidad.numero
                        ) || []
                    ).map(
                        (trabajo) =>
                            trabajo.ruta
                    )
                );

            const manualesValidos =
                manuales.filter(
                    (trabajo) => {
                        if (
                            !opciones
                                .validarExistencia
                        ) {
                            return true;
                        }

                        const ruta =
                            normalizarRutaTrabajoHub(
                                trabajo.ruta
                            );

                        const tipo =
                            obtenerTipoTrabajoHub(
                                ruta
                            );

                        const tipoValidable =
                            [
                                "html",
                                "markdown",
                                "pdf"
                            ].includes(
                                tipo
                            );

                        if (
                            !tipoValidable ||
                            !/^U[1-5]\//i.test(
                                ruta
                            )
                        ) {
                            return true;
                        }

                        return rutasDetectadas.has(
                            ruta
                        );
                    }
                );

            const rutasManuales =
                new Set(
                    manualesValidos
                        .map(
                            (trabajo) =>
                                normalizarRutaTrabajoHub(
                                    trabajo.ruta
                                )
                        )
                        .filter(Boolean)
                );

            const nuevos =
                (
                    porUnidad.get(
                        unidad.numero
                    ) || []
                )
                    .filter(
                        (trabajo) =>
                            !rutasManuales.has(
                                trabajo.ruta
                            )
                    )
                    .map(
                        (trabajo) => ({
                            nombre:
                                trabajo.nombre,

                            ruta:
                                `../${trabajo.ruta}`,

                            tipo:
                                trabajo.tipo,

                            descripcion:
                                trabajo.descripcion,

                            automatico:
                                true
                        })
                    );

            unidad.trabajos = [
                ...manualesValidos,
                ...nuevos
            ];
        }
    );

    return datos;
}


function normalizarRutaTrabajoHub(
    ruta
) {
    if (!ruta) {
        return "";
    }

    let valor =
        String(ruta)
            .replace(
                /\\/g,
                "/"
            )
            .trim();

    while (
        valor.startsWith("../")
    ) {
        valor =
            valor.slice(3);
    }

    while (
        valor.startsWith("./")
    ) {
        valor =
            valor.slice(2);
    }

    return valor;
}


function compararTrabajosHub(
    a,
    b
) {
    if (
        a.unidad !==
        b.unidad
    ) {
        return (
            a.unidad -
            b.unidad
        );
    }

    return a.ruta.localeCompare(
        b.ruta,
        "es",
        {
            numeric: true,
            sensitivity: "base"
        }
    );
}


function formatearTipoAutoHub(
    tipo
) {
    const mapa = {
        html: "HTML",
        markdown: "Markdown",
        pdf: "PDF"
    };

    return (
        mapa[tipo] ||
        "del portafolio"
    );
}


function detectarArchivosParaCacheHub(
    elementos
) {
    const prefijo =
        `${PW_HUB_GITHUB.raiz}/`;

    const permitidosRaiz =
        new Set([
            "Perfil.md",
            "Comandos_Git.md",
            "foto.jpg"
        ]);

    return elementos
        .filter(
            (elemento) => {
                if (
                    !elemento ||
                    elemento.type !== "blob" ||
                    typeof elemento.path !== "string" ||
                    !elemento.path.startsWith(prefijo)
                ) {
                    return false;
                }

                const ruta =
                    elemento.path.slice(
                        prefijo.length
                    );

                const dentroUnidad =
                    /^U[1-5]\//i.test(
                        ruta
                    );

                const raizPermitida =
                    permitidosRaiz.has(
                        ruta
                    );

                const tamano =
                    Number(
                        elemento.size || 0
                    );

                return (
                    (
                        dentroUnidad ||
                        raizPermitida
                    ) &&
                    (
                        !tamano ||
                        tamano <=
                            PW_HUB_SYNC
                                .tamanoMaximoCache
                    )
                );
            }
        )
        .map(
            (elemento) =>
                elemento.path.slice(
                    prefijo.length
                )
        );
}


/* =========================================================
   PW HUB v1.1.0 - ESTADO, NOVEDADES Y FECHAS
   ========================================================= */

function cargarRecursosNovedadesHub() {
    const enlaceExistente =
        document.querySelector(
            "link[data-pw-novedades]"
        );

    if (!enlaceExistente) {
        const enlace =
            document.createElement(
                "link"
            );

        enlace.rel = "stylesheet";
        enlace.href =
            new URL(
                "css/novedades.css?v=1.1.0",
                window.location.href
            ).href;
        enlace.dataset.pwNovedades =
            "1.1.0";

        document.head.appendChild(
            enlace
        );
    }

    const scriptExistente =
        document.querySelector(
            "script[data-pw-novedades]"
        );

    if (scriptExistente) {
        return;
    }

    const script =
        document.createElement(
            "script"
        );

    script.src =
        new URL(
            "js/novedades.js?v=1.1.0",
            window.location.href
        ).href;
    script.async = false;
    script.dataset.pwNovedades =
        "1.1.0";

    document.head.appendChild(
        script
    );
}


function actualizarEstadoSincronizacionHub(
    estado,
    detalles = {}
) {
    estadoSincronizacionHub = {
        ...estadoSincronizacionHub,
        ...detalles,
        estado,
        actualizadoEn:
            new Date().toISOString()
    };

    window.dispatchEvent(
        new CustomEvent(
            "pw-hub:sincronizacion",
            {
                detail:
                    obtenerEstadoSincronizacionHub()
            }
        )
    );
}


function obtenerEstadoSincronizacionHub() {
    return {
        ...estadoSincronizacionHub
    };
}


function leerRutasConocidasHub() {
    try {
        const valor =
            localStorage.getItem(
                PW_HUB_SYNC.claveRutasConocidas
            );

        if (valor === null) {
            return null;
        }

        const rutas =
            JSON.parse(valor);

        return new Set(
            Array.isArray(rutas)
                ? rutas
                : []
        );
    } catch {
        return null;
    }
}


function guardarRutasConocidasHub(
    rutas
) {
    try {
        localStorage.setItem(
            PW_HUB_SYNC.claveRutasConocidas,
            JSON.stringify(
                [...rutas].sort()
            )
        );
    } catch {
        // La detección de novedades no debe bloquear el Hub.
    }
}


function leerNuevosPendientesHub() {
    try {
        const valor =
            localStorage.getItem(
                PW_HUB_SYNC.claveNuevosPendientes
            );

        const rutas =
            valor
                ? JSON.parse(valor)
                : [];

        return new Set(
            Array.isArray(rutas)
                ? rutas
                : []
        );
    } catch {
        return new Set();
    }
}


function guardarNuevosPendientesHub(
    rutas
) {
    try {
        localStorage.setItem(
            PW_HUB_SYNC.claveNuevosPendientes,
            JSON.stringify(
                [...rutas].sort()
            )
        );
    } catch {
        // El catálogo sigue funcionando aunque no haya storage.
    }
}


function actualizarNovedadesTrabajosHub(
    trabajos
) {
    const actuales =
        new Set(
            (trabajos || [])
                .map(
                    (trabajo) =>
                        normalizarRutaTrabajoHub(
                            trabajo.ruta
                        )
                )
                .filter(Boolean)
        );

    const conocidos =
        leerRutasConocidasHub();

    const pendientes =
        leerNuevosPendientesHub();

    /*
       En la primera ejecución de v1.1.0 tomamos el estado
       actual como línea base. Así los trabajos históricos no
       aparecen falsamente como NUEVOS.
    */
    if (conocidos === null) {
        guardarRutasConocidasHub(
            actuales
        );

        const vigentes =
            new Set(
                [...pendientes].filter(
                    (ruta) =>
                        actuales.has(ruta)
                )
            );

        guardarNuevosPendientesHub(
            vigentes
        );

        notificarNovedadesHub(
            vigentes
        );

        return;
    }

    actuales.forEach(
        (ruta) => {
            if (!conocidos.has(ruta)) {
                pendientes.add(ruta);
            }
        }
    );

    const vigentes =
        new Set(
            [...pendientes].filter(
                (ruta) =>
                    actuales.has(ruta)
            )
        );

    guardarRutasConocidasHub(
        actuales
    );
    guardarNuevosPendientesHub(
        vigentes
    );

    notificarNovedadesHub(
        vigentes
    );
}


function obtenerTrabajosNuevosHub() {
    return [
        ...leerNuevosPendientesHub()
    ];
}


function esTrabajoNuevoHub(
    ruta
) {
    const normalizada =
        normalizarRutaTrabajoHub(
            ruta
        );

    return leerNuevosPendientesHub()
        .has(normalizada);
}


function marcarTrabajoVistoHub(
    ruta
) {
    const normalizada =
        normalizarRutaTrabajoHub(
            ruta
        );

    if (!normalizada) {
        return false;
    }

    const pendientes =
        leerNuevosPendientesHub();

    if (!pendientes.delete(normalizada)) {
        return false;
    }

    guardarNuevosPendientesHub(
        pendientes
    );

    notificarNovedadesHub(
        pendientes
    );

    return true;
}


function notificarNovedadesHub(
    pendientes =
        leerNuevosPendientesHub()
) {
    window.dispatchEvent(
        new CustomEvent(
            "pw-hub:novedades",
            {
                detail: {
                    rutas:
                        [...pendientes],
                    total:
                        pendientes.size
                }
            }
        )
    );
}


function leerCacheFechasGitHubHub() {
    try {
        const valor =
            localStorage.getItem(
                PW_HUB_SYNC.claveFechasGitHub
            );

        const datos =
            valor
                ? JSON.parse(valor)
                : {};

        return (
            datos &&
            typeof datos === "object" &&
            !Array.isArray(datos)
        )
            ? datos
            : {};
    } catch {
        return {};
    }
}


function guardarCacheFechasGitHubHub(
    cache
) {
    try {
        localStorage.setItem(
            PW_HUB_SYNC.claveFechasGitHub,
            JSON.stringify(cache)
        );
    } catch {
        // Las fechas son una mejora opcional.
    }
}


async function obtenerFechaActualizacionTrabajoHub(
    ruta
) {
    const normalizada =
        normalizarRutaTrabajoHub(
            ruta
        );

    if (!normalizada) {
        return null;
    }

    const cache =
        leerCacheFechasGitHubHub();

    const guardada =
        cache[normalizada];

    const vigente =
        guardada &&
        Number.isFinite(
            Number(guardada.consultado)
        ) &&
        (
            Date.now() -
            Number(guardada.consultado)
        ) <
            PW_HUB_SYNC
                .vigenciaFechasGitHub;

    if (vigente) {
        return guardada.fecha || null;
    }

    if (navigator.onLine === false) {
        return guardada?.fecha || null;
    }

    if (
        promesasFechasGitHubHub.has(
            normalizada
        )
    ) {
        return promesasFechasGitHubHub.get(
            normalizada
        );
    }

    const promesa =
        consultarFechaActualizacionGitHubHub(
            normalizada,
            guardada?.fecha || null
        )
            .finally(
                () => {
                    promesasFechasGitHubHub.delete(
                        normalizada
                    );
                }
            );

    promesasFechasGitHubHub.set(
        normalizada,
        promesa
    );

    return promesa;
}


async function consultarFechaActualizacionGitHubHub(
    ruta,
    fechaAnterior = null
) {
    const rutaRepositorio =
        `${PW_HUB_GITHUB.raiz}/${ruta}`;

    const parametros =
        new URLSearchParams({
            sha:
                PW_HUB_GITHUB.rama,
            path:
                rutaRepositorio,
            per_page:
                "1"
        });

    const url =
        `https://api.github.com/repos/` +
        `${PW_HUB_GITHUB.propietario}/` +
        `${PW_HUB_GITHUB.repositorio}/` +
        `commits?${parametros.toString()}`;

    let fecha =
        fechaAnterior;

    try {
        const respuesta =
            await PW_HUB_FETCH_ORIGINAL(
                url,
                {
                    headers: {
                        Accept:
                            "application/vnd.github+json"
                    }
                }
            );

        if (respuesta.ok) {
            const commits =
                await respuesta.json();

            const ultimo =
                Array.isArray(commits)
                    ? commits[0]
                    : null;

            fecha =
                ultimo?.commit?.committer?.date ||
                ultimo?.commit?.author?.date ||
                fechaAnterior ||
                null;
        }
    } catch {
        // Conservamos la fecha ya cacheada cuando exista.
    }

    const cache =
        leerCacheFechasGitHubHub();

    cache[ruta] = {
        fecha,
        consultado:
            Date.now()
    };

    guardarCacheFechasGitHubHub(
        cache
    );

    return fecha;
}


function guardarSnapshotTrabajosHub(
    snapshot
) {
    try {
        localStorage.setItem(
            PW_HUB_SYNC.claveSnapshot,
            JSON.stringify(snapshot)
        );
    } catch (error) {
        console.warn(
            "PW Hub: no se pudo guardar " +
            "el catálogo local.",
            error
        );
    }
}


function leerSnapshotTrabajosHub() {
    try {
        const valor =
            localStorage.getItem(
                PW_HUB_SYNC.claveSnapshot
            );

        return valor
            ? JSON.parse(valor)
            : null;
    } catch {
        return null;
    }
}


function marcarConsultaGitHubHub() {
    try {
        localStorage.setItem(
            PW_HUB_SYNC.claveUltimaConsulta,
            String(Date.now())
        );
    } catch {
        // La sincronización sigue funcionando sin este dato.
    }
}


function consultaGitHubRecienteHub() {
    try {
        const valor =
            Number(
                localStorage.getItem(
                    PW_HUB_SYNC
                        .claveUltimaConsulta
                )
            );

        return (
            Number.isFinite(valor) &&
            valor > 0 &&
            (
                Date.now() -
                valor
            ) <
                PW_HUB_SYNC
                    .intervaloMinimo
        );
    } catch {
        return false;
    }
}


function clonarDatosHub(
    datos
) {
    if (
        typeof structuredClone ===
        "function"
    ) {
        return structuredClone(
            datos
        );
    }

    return JSON.parse(
        JSON.stringify(datos)
    );
}


async function registrarModoOfflineHub() {
    if (
        !(
            "serviceWorker" in
            navigator
        ) ||
        ![
            "http:",
            "https:"
        ].includes(
            window.location.protocol
        )
    ) {
        return;
    }

    try {
        await navigator
            .serviceWorker
            .register(
                "../service-worker.js",
                {
                    scope:
                        "../"
                }
            );

        await navigator
            .serviceWorker
            .ready;
    } catch (error) {
        console.warn(
            "PW Hub: el modo offline " +
            "no pudo registrarse.",
            error
        );
    }
}


function prepararCacheOfflineHub(
    rutas
) {
    if (
        !Array.isArray(rutas) ||
        rutas.length === 0 ||
        !(
            "serviceWorker" in
            navigator
        )
    ) {
        return;
    }

    navigator
        .serviceWorker
        .ready
        .then(
            (registro) => {
                const worker =
                    registro.active ||
                    registro.waiting ||
                    registro.installing;

                if (!worker) {
                    return;
                }

                worker.postMessage({
                    tipo:
                        "CACHEAR_PORTAFOLIO",

                    rutas:
                        rutas
                });
            }
        )
        .catch(
            () => {
                // No bloqueamos el Hub si no hay Service Worker.
            }
        );
}
