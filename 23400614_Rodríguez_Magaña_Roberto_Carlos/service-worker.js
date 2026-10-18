/*
    =========================================================
    PW HUB - SERVICE WORKER
    =========================================================

    Objetivo:
    - mantener el portafolio como sitio web normal;
    - permitir una copia offline después de una visita online;
    - actualizar contenido desde red cuando exista conexión;
    - cachear los archivos de U1-U5 detectados por GitHub.

    No agrega instalación ni manifest de PWA.
*/

const VERSION_CACHE =
    "pw-hub-offline-v30";

const CACHE_SHELL =
    `${VERSION_CACHE}-shell`;

const CACHE_RUNTIME =
    `${VERSION_CACHE}-runtime`;

const CACHE_GITHUB =
    `${VERSION_CACHE}-github`;

const URL_MARKED =
    "https://cdn.jsdelivr.net/npm/marked/marked.min.js";


const ARCHIVOS_SHELL = [
    "hub/",
    "hub/index.html",
    "hub/vistas/offline.html",

    "hub/css/actividad.css",
    "hub/css/apariencia-avanzada.css?v=19",
    "hub/css/combobox.css",
    "hub/css/offline.css",
    "hub/css/estadisticas.css",
    "hub/css/estilos.css",
    "hub/css/hero-codigo.css?v=18",
    "hub/css/hero-movil-fix.css",
    "hub/css/historial.css",
    "hub/css/markdown-oscuro.css?v=1",
    "hub/css/novedades.css?v=1.1.0",
    "hub/css/vistas-internas.css?v=1.1.1",
    "hub/css/navegacion.css",
    "hub/css/personalizacion.css",
    "hub/css/refinamiento-final.css",
    "hub/css/roadmap.css",
    "hub/css/trabajos.css",

    "hub/js/actividad.js",
    "hub/js/combobox.js",
    "hub/js/offline.js",
    "hub/js/estadisticas.js",
    "hub/js/historial.js",
    "hub/js/hub.js?v=1.1.1",
    "hub/js/navegacion.js?v=1.1.1",
    "hub/js/personalizacion.js?v=1.1.1",
    "hub/js/roadmap.js",
    "hub/js/sincronizacion.js?v=1.1.1",
    "hub/js/novedades.js?v=1.1.0",
    "hub/js/vistas-internas.js?v=1.1.1",
    "hub/js/trabajos.js",

    "hub/data/roadmap.json",
    "hub/data/unidades.json",

    "hub/docs/CHANGELOG.md",
    "hub/docs/HISTORIAL.md",
    "hub/docs/README.md",
    "hub/docs/ROADMAP.md",

    "hub/vistas/trabajo.html",

    "hub/assets/branding/favicon-16.png",
    "hub/assets/branding/favicon-32.png",
    "hub/assets/branding/favicon-192.png",
    "hub/assets/branding/isotipo-pwhub.png",
    "hub/assets/branding/logo-pwhub-horizontal.png",

    "Perfil.md",
    "Comandos_Git.md"
];


self.addEventListener(
    "install",
    (evento) => {
        evento.waitUntil(
            instalarCacheHub()
        );
    }
);


self.addEventListener(
    "activate",
    (evento) => {
        evento.waitUntil(
            activarCacheHub()
        );
    }
);


self.addEventListener(
    "fetch",
    (evento) => {
        const peticion =
            evento.request;

        if (
            peticion.method !==
            "GET"
        ) {
            return;
        }

        const url =
            new URL(
                peticion.url
            );

        /*
           La consulta del árbol de GitHub se deja pasar directamente
           a la red. sincronizacion.js ya controla su timeout y fallback
           local; no conviene que el Service Worker pueda prolongarla.
        */
        if (
            esConsultaArbolGitHubHub(
                url
            )
        ) {
            return;
        }

        const dentroDelPortafolio =
            peticion.url.startsWith(
                self.registration.scope
            );

        const esMarked =
            peticion.url ===
            URL_MARKED;

        if (
            !dentroDelPortafolio &&
            !esMarked
        ) {
            return;
        }

        if (
            peticion.mode ===
                "navigate" ||
            peticion.destination ===
                "document" ||
            /\.(?:html?|md|json)$/i.test(
                url.pathname
            )
        ) {
            evento.respondWith(
                redPrimeroHub(
                    peticion,
                    CACHE_RUNTIME
                )
            );

            return;
        }

        evento.respondWith(
            cachePrimeroHub(
                peticion
            )
        );
    }
);


self.addEventListener(
    "message",
    (evento) => {
        const datos =
            evento.data;

        if (
            !datos ||
            datos.tipo !==
                "CACHEAR_PORTAFOLIO" ||
            !Array.isArray(
                datos.rutas
            )
        ) {
            return;
        }

        evento.waitUntil(
            cachearArchivosPortafolioHub(
                datos.rutas
            )
        );
    }
);


async function instalarCacheHub() {
    const cache =
        await caches.open(
            CACHE_SHELL
        );

    await Promise.allSettled(
        ARCHIVOS_SHELL.map(
            async (ruta) => {
                const url =
                    new URL(
                        ruta,
                        self.registration.scope
                    );

                const respuesta =
                    await fetch(
                        url,
                        {
                            cache:
                                "reload"
                        }
                    );

                if (
                    respuesta.ok
                ) {
                    await cache.put(
                        url,
                        respuesta
                    );
                }
            }
        )
    );

    try {
        const respuesta =
            await fetch(
                URL_MARKED,
                {
                    mode:
                        "cors"
                }
            );

        if (
            respuesta.ok
        ) {
            await cache.put(
                URL_MARKED,
                respuesta
            );
        }
    } catch {
        // Opcional.
    }

    await self.skipWaiting();
}


async function activarCacheHub() {
    const cachesActuales =
        new Set([
            CACHE_SHELL,
            CACHE_RUNTIME,
            CACHE_GITHUB
        ]);

    const nombres =
        await caches.keys();

    await Promise.all(
        nombres
            .filter(
                (nombre) =>
                    nombre.startsWith(
                        "pw-hub-offline-"
                    ) &&
                    !cachesActuales.has(
                        nombre
                    )
            )
            .map(
                (nombre) =>
                    caches.delete(
                        nombre
                    )
            )
    );

    await self.clients.claim();
}


async function redPrimeroHub(
    peticion,
    nombreCache
) {
    const cache =
        await caches.open(
            nombreCache
        );

    try {
        const respuesta =
            await fetch(
                peticion
            );

        if (
            respuesta &&
            (
                respuesta.ok ||
                respuesta.type ===
                    "opaque"
            )
        ) {
            await cache.put(
                peticion,
                respuesta.clone()
            );
        }

        return respuesta;
    } catch {
        const guardada =
            await buscarEnCachesHub(
                peticion
            );

        if (guardada) {
            return guardada;
        }

        if (
            peticion.mode ===
            "navigate"
        ) {
            const offline =
                new URL(
                    "hub/vistas/offline.html",
                    self.registration.scope
                );

            const fallback =
                await buscarEnCachesHub(
                    offline
                );

            if (fallback) {
                return fallback;
            }
        }

        throw new Error(
            "Recurso no disponible sin conexión."
        );
    }
}


async function cachePrimeroHub(
    peticion
) {
    const guardada =
        await buscarEnCachesHub(
            peticion
        );

    if (guardada) {
        actualizarEnSegundoPlanoHub(
            peticion
        );

        return guardada;
    }

    const respuesta =
        await fetch(
            peticion
        );

    if (
        respuesta &&
        (
            respuesta.ok ||
            respuesta.type ===
                "opaque"
        )
    ) {
        const cache =
            await caches.open(
                CACHE_RUNTIME
            );

        await cache.put(
            peticion,
            respuesta.clone()
        );
    }

    return respuesta;
}


async function actualizarEnSegundoPlanoHub(
    peticion
) {
    try {
        const respuesta =
            await fetch(
                peticion
            );

        if (
            respuesta &&
            (
                respuesta.ok ||
                respuesta.type ===
                    "opaque"
            )
        ) {
            const cache =
                await caches.open(
                    CACHE_RUNTIME
                );

            await cache.put(
                peticion,
                respuesta
            );
        }
    } catch {
        // Offline: conservamos la copia existente.
    }
}


async function buscarEnCachesHub(
    peticion
) {
    return (
        await caches.match(
            peticion,
            {
                ignoreSearch:
                    false
            }
        )
    );
}


async function cachearArchivosPortafolioHub(
    rutas
) {
    const cache =
        await caches.open(
            CACHE_RUNTIME
        );

    const unicas = [
        ...new Set(
            rutas.filter(
                (ruta) =>
                    typeof ruta ===
                        "string" &&
                    ruta.length > 0
            )
        )
    ];

    const tamanoLote =
        6;

    for (
        let indice = 0;
        indice < unicas.length;
        indice += tamanoLote
    ) {
        const lote =
            unicas.slice(
                indice,
                indice + tamanoLote
            );

        await Promise.allSettled(
            lote.map(
                async (ruta) => {
                    const url =
                        new URL(
                            ruta,
                            self.registration.scope
                        );

                    const respuesta =
                        await fetch(
                            url,
                            {
                                cache:
                                    "reload"
                            }
                        );

                    if (
                        respuesta.ok
                    ) {
                        await cache.put(
                            url,
                            respuesta
                        );
                    }
                }
            )
        );
    }
}


function esConsultaArbolGitHubHub(
    url
) {
    return (
        url.hostname ===
            "api.github.com" &&
        url.pathname.includes(
            "/RobDev512/PW-AD2026/" +
            "git/trees/"
        )
    );
}
