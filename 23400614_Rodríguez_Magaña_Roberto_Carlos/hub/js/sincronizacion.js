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
    5. guarda el último catálogo detectado como respaldo local.

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
        10 * 1024 * 1024
};

const PW_HUB_ARCHIVOS_IGNORADOS =
    new Set([
        "base.html"
    ]);


window.sincronizarTrabajosGitHub =
    sincronizarTrabajosGitHub;

window.forzarSincronizacionTrabajosHub =
    () => {
        try {
            localStorage.removeItem(
                PW_HUB_SYNC.claveUltimaConsulta
            );
        } catch {
            // No es crítico si localStorage no está disponible.
        }
    };


document.addEventListener(
    "DOMContentLoaded",
    () => {
        registrarModoOfflineHub();
    }
);


async function sincronizarTrabajosGitHub(
    datosBase
) {
    const datos =
        clonarDatosHub(datosBase);

    const snapshot =
        leerSnapshotTrabajosHub();

    /*
       En file:// la API podría responder, pero el Service
       Worker no funciona. El Hub conserva el catálogo local.
    */
    if (
        window.location.protocol ===
        "file:"
    ) {
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

        return fusionarTrabajosHub(
            datos,
            snapshot.trabajos,
            {
                validarExistencia:
                    true
            }
        );
    }

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

        guardarSnapshotTrabajosHub({
            sha:
                arbol.sha || "",

            trabajos,

            archivosCache,

            actualizado:
                new Date().toISOString()
        });

        marcarConsultaGitHubHub();

        prepararCacheOfflineHub(
            archivosCache
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
