/*
    =========================================================
    PW HUB v1.1.0 - SINCRONIZACIÓN Y NOVEDADES
    =========================================================

    Capa visual para:
    - estado de sincronización con GitHub;
    - tiempo desde la última sincronización;
    - trabajos marcados como NUEVO;
    - fecha real de última actualización cuando GitHub
      puede proporcionarla.

    La lógica de datos vive en sincronizacion.js.
*/

(() => {
    "use strict";

    const SELECTOR_TARJETA =
        ".unidad-trabajo, .trabajo-explorador";

    let observador = null;
    let temporizadorEscaneo = null;
    let temporizadorEstado = null;
    let intentosInicio = 0;


    function iniciarNovedadesHub() {
        if (!window.PWHubSync) {
            intentosInicio += 1;

            if (intentosInicio <= 30) {
                window.setTimeout(
                    iniciarNovedadesHub,
                    100
                );
            }

            return;
        }

        crearIndicadorSincronizacionHub();
        actualizarIndicadorSincronizacionHub();
        decorarTarjetasHub();
        configurarObservadorHub();
        configurarEventosHub();

        temporizadorEstado =
            window.setInterval(
                actualizarIndicadorSincronizacionHub,
                60 * 1000
            );
    }


    function crearIndicadorSincronizacionHub() {
        if (
            document.getElementById(
                "pw-sync-estado"
            )
        ) {
            return;
        }

        const titulo =
            document.querySelector(
                ".seccion-resumen .titulo-seccion"
            );

        if (!titulo) {
            return;
        }

        const indicador =
            document.createElement(
                "div"
            );

        indicador.id = "pw-sync-estado";
        indicador.className =
            "pw-sync-estado";
        indicador.setAttribute(
            "role",
            "status"
        );
        indicador.setAttribute(
            "aria-live",
            "polite"
        );
        indicador.title =
            "Estado del catálogo sincronizado con GitHub";

        indicador.innerHTML = `
            <span class="pw-sync-principal">
                <span
                    class="pw-sync-punto"
                    aria-hidden="true"
                ></span>

                <span class="pw-sync-texto">
                    Sincronizando...
                </span>
            </span>

            <span
                class="pw-sync-separador"
                aria-hidden="true"
            >
                ·
            </span>

            <span class="pw-sync-tiempo"></span>

            <span
                class="pw-sync-nuevos"
                hidden
            ></span>
        `;

        titulo.appendChild(
            indicador
        );
    }


    function actualizarIndicadorSincronizacionHub() {
        const indicador =
            document.getElementById(
                "pw-sync-estado"
            );

        if (!indicador || !window.PWHubSync) {
            return;
        }

        const estado =
            window.PWHubSync.obtenerEstado();

        const texto =
            indicador.querySelector(
                ".pw-sync-texto"
            );

        const tiempo =
            indicador.querySelector(
                ".pw-sync-tiempo"
            );

        const nuevos =
            indicador.querySelector(
                ".pw-sync-nuevos"
            );

        indicador.dataset.estado =
            estado.estado ||
            "sincronizando";

        if (texto) {
            texto.textContent =
                etiquetaEstadoHub(
                    estado.estado
                );
        }

        if (tiempo) {
            tiempo.textContent =
                textoTiempoSincronizacionHub(
                    estado
                );

            tiempo.hidden =
                !tiempo.textContent;
        }

        const totalNuevos =
            window.PWHubSync
                .obtenerNuevos()
                .length;

        if (nuevos) {
            nuevos.hidden =
                totalNuevos === 0;

            nuevos.textContent =
                totalNuevos === 1
                    ? "1 nuevo"
                    : `${totalNuevos} nuevos`;
        }
    }


    function etiquetaEstadoHub(
        estado
    ) {
        const etiquetas = {
            sincronizado:
                "Sincronizado",
            cache:
                "Usando caché local",
            offline:
                "Sin conexión",
            sincronizando:
                "Sincronizando..."
        };

        return (
            etiquetas[estado] ||
            "Sincronizando..."
        );
    }


    function textoTiempoSincronizacionHub(
        estado
    ) {
        const fecha =
            estado?.ultimaSincronizacion;

        if (!fecha) {
            return "";
        }

        const relativo =
            formatearTiempoRelativoHub(
                fecha
            );

        if (!relativo) {
            return "";
        }

        return estado.estado ===
            "sincronizado"
            ? `Actualizado ${relativo}`
            : `Última sincronización ${relativo}`;
    }


    function formatearTiempoRelativoHub(
        fecha
    ) {
        const instante =
            new Date(fecha);

        if (
            Number.isNaN(
                instante.getTime()
            )
        ) {
            return "";
        }

        const diferencia =
            Date.now() -
            instante.getTime();

        if (diferencia < 60 * 1000) {
            return "ahora";
        }

        const minutos =
            Math.floor(
                diferencia /
                (60 * 1000)
            );

        if (minutos < 60) {
            return `hace ${minutos} min`;
        }

        const horas =
            Math.floor(
                minutos / 60
            );

        if (horas < 24) {
            return `hace ${horas} h`;
        }

        const dias =
            Math.floor(
                horas / 24
            );

        return `hace ${dias} d`;
    }


    function configurarEventosHub() {
        window.addEventListener(
            "pw-hub:sincronizacion",
            actualizarIndicadorSincronizacionHub
        );

        window.addEventListener(
            "pw-hub:novedades",
            () => {
                actualizarIndicadorSincronizacionHub();
                actualizarBadgesNuevosHub();
            }
        );

        document.addEventListener(
            "click",
            manejarTrabajoVistoHub,
            true
        );

        window.addEventListener(
            "beforeunload",
            () => {
                if (temporizadorEstado) {
                    window.clearInterval(
                        temporizadorEstado
                    );
                }
            },
            {
                once: true
            }
        );
    }


    function configurarObservadorHub() {
        if (observador || !document.body) {
            return;
        }

        observador =
            new MutationObserver(
                programarEscaneoHub
            );

        observador.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    function programarEscaneoHub() {
        if (temporizadorEscaneo) {
            window.clearTimeout(
                temporizadorEscaneo
            );
        }

        temporizadorEscaneo =
            window.setTimeout(
                () => {
                    temporizadorEscaneo =
                        null;
                    decorarTarjetasHub();
                },
                80
            );
    }


    function decorarTarjetasHub() {
        document
            .querySelectorAll(
                SELECTOR_TARJETA
            )
            .forEach(
                decorarTarjetaHub
            );
    }


    function decorarTarjetaHub(
        tarjeta
    ) {
        const ruta =
            obtenerRutaTarjetaHub(
                tarjeta
            );

        if (!ruta) {
            return;
        }

        tarjeta.dataset.pwRutaTrabajo =
            ruta;

        actualizarBadgeTarjetaHub(
            tarjeta,
            ruta
        );

        if (
            tarjeta.dataset
                .pwFechaSolicitada ===
            "true"
        ) {
            return;
        }

        tarjeta.dataset.pwFechaSolicitada =
            "true";

        cargarFechaTarjetaHub(
            tarjeta,
            ruta
        );
    }


    function actualizarBadgesNuevosHub() {
        document
            .querySelectorAll(
                SELECTOR_TARJETA
            )
            .forEach(
                (tarjeta) => {
                    const ruta =
                        tarjeta.dataset
                            .pwRutaTrabajo ||
                        obtenerRutaTarjetaHub(
                            tarjeta
                        );

                    if (!ruta) {
                        return;
                    }

                    actualizarBadgeTarjetaHub(
                        tarjeta,
                        ruta
                    );
                }
            );
    }


    function actualizarBadgeTarjetaHub(
        tarjeta,
        ruta
    ) {
        const esNuevo =
            window.PWHubSync.esNuevo(
                ruta
            );

        let badge =
            tarjeta.querySelector(
                ":scope .pw-badge-nuevo"
            );

        if (!esNuevo) {
            if (badge) {
                badge.remove();
            }

            tarjeta.classList.remove(
                "pw-trabajo-nuevo"
            );
            return;
        }

        tarjeta.classList.add(
            "pw-trabajo-nuevo"
        );

        if (badge) {
            return;
        }

        badge =
            document.createElement(
                "span"
            );

        badge.className =
            "pw-badge-nuevo";
        badge.textContent =
            "NUEVO";

        const tipoUnidad =
            tarjeta.querySelector(
                ".unidad-trabajo-tipo"
            );

        if (tipoUnidad) {
            tipoUnidad.appendChild(
                badge
            );
            return;
        }

        const cabecera =
            tarjeta.querySelector(
                ".trabajo-explorador-cabecera"
            );

        const favorito =
            cabecera?.querySelector(
                ".trabajo-favorito"
            );

        if (cabecera) {
            cabecera.insertBefore(
                badge,
                favorito || null
            );
        }
    }


    async function cargarFechaTarjetaHub(
        tarjeta,
        ruta
    ) {
        try {
            const fecha =
                await window.PWHubSync
                    .obtenerFechaActualizacion(
                        ruta
                    );

            if (
                !fecha ||
                !tarjeta.isConnected ||
                tarjeta.dataset
                    .pwRutaTrabajo !==
                    ruta
            ) {
                return;
            }

            mostrarFechaTarjetaHub(
                tarjeta,
                fecha
            );
        } catch {
            // La fecha es informativa y no debe bloquear tarjetas.
        }
    }


    function mostrarFechaTarjetaHub(
        tarjeta,
        fecha
    ) {
        const fechaObj =
            new Date(fecha);

        if (
            Number.isNaN(
                fechaObj.getTime()
            )
        ) {
            return;
        }

        let elemento =
            tarjeta.querySelector(
                ":scope .pw-fecha-actualizacion"
            );

        if (!elemento) {
            elemento =
                document.createElement(
                    "p"
                );

            elemento.className =
                "pw-fecha-actualizacion";

            const acciones =
                tarjeta.querySelector(
                    ".unidad-trabajo-acciones, .trabajo-acciones"
                );

            if (acciones) {
                acciones.parentNode.insertBefore(
                    elemento,
                    acciones
                );
            } else {
                tarjeta.appendChild(
                    elemento
                );
            }
        }

        elemento.textContent =
            `Actualizado ${formatearFechaHub(fechaObj)}`;
        elemento.title =
            fechaObj.toLocaleString(
                "es-MX"
            );
    }


    function formatearFechaHub(
        fecha
    ) {
        return new Intl.DateTimeFormat(
            "es-MX",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        ).format(fecha);
    }


    function manejarTrabajoVistoHub(
        evento
    ) {
        const accion =
            evento.target.closest(
                [
                    ".unidad-trabajo-vista-previa",
                    "[data-unidad-abrir-trabajo]",
                    ".trabajo-preview",
                    "[data-trabajo-abrir]"
                ].join(", ")
            );

        if (!accion) {
            return;
        }

        const tarjeta =
            accion.closest(
                SELECTOR_TARJETA
            );

        if (!tarjeta) {
            return;
        }

        const ruta =
            tarjeta.dataset
                .pwRutaTrabajo ||
            obtenerRutaTarjetaHub(
                tarjeta
            );

        if (!ruta) {
            return;
        }

        const cambio =
            window.PWHubSync
                .marcarVisto(
                    ruta
                );

        if (cambio) {
            actualizarBadgeTarjetaHub(
                tarjeta,
                ruta
            );
            actualizarIndicadorSincronizacionHub();
        }
    }


    function obtenerRutaTarjetaHub(
        tarjeta
    ) {
        const enlace =
            tarjeta.querySelector(
                'a[href*="vistas/trabajo.html"]'
            );

        if (!enlace) {
            return "";
        }

        try {
            const visor =
                new URL(
                    enlace.href,
                    window.location.href
                );

            const archivo =
                visor.searchParams.get(
                    "archivo"
                );

            if (!archivo) {
                return "";
            }

            return convertirArchivoARutaHub(
                archivo
            );
        } catch {
            return "";
        }
    }


    function convertirArchivoARutaHub(
        archivo
    ) {
        try {
            const urlArchivo =
                new URL(
                    archivo,
                    window.location.href
                );

            const raizPortafolio =
                new URL(
                    "../",
                    window.location.href
                );

            if (
                urlArchivo.origin !==
                raizPortafolio.origin
            ) {
                return "";
            }

            let ruta =
                decodeURIComponent(
                    urlArchivo.pathname
                );

            const base =
                decodeURIComponent(
                    raizPortafolio.pathname
                );

            if (ruta.startsWith(base)) {
                ruta =
                    ruta.slice(
                        base.length
                    );
            }

            ruta =
                ruta.replace(
                    /^\/+/, 
                    ""
                );

            return window.PWHubSync
                .normalizarRuta(
                    ruta
                );
        } catch {
            return "";
        }
    }


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarNovedadesHub,
            {
                once: true
            }
        );
    } else {
        iniciarNovedadesHub();
    }
})();
