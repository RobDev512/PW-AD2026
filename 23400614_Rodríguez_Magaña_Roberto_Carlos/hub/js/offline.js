/*
    =========================================================
    PW HUB - ESTADO DE CONEXIÓN
    =========================================================

    Solo se muestra cuando:
    - se pierde la conexión;
    - o acaba de recuperarse.

    No ocupa espacio permanente en la interfaz.
*/

let temporizadorEstadoConexionHub =
    null;


document.addEventListener(
    "DOMContentLoaded",
    () => {
        iniciarEstadoConexionHub();
    }
);


function iniciarEstadoConexionHub() {
    let indicador =
        document.getElementById(
            "estado-conexion-hub"
        );

    if (!indicador) {
        indicador =
            document.createElement(
                "div"
            );

        indicador.id =
            "estado-conexion-hub";

        indicador.className =
            "estado-conexion-hub";

        indicador.setAttribute(
            "role",
            "status"
        );

        indicador.setAttribute(
            "aria-live",
            "polite"
        );

        indicador.innerHTML =
            '<i aria-hidden="true"></i>' +
            '<span></span>';

        document.body.appendChild(
            indicador
        );
    }

    window.addEventListener(
        "offline",
        () => {
            mostrarEstadoConexionHub(
                "Sin conexión · usando contenido guardado",
                false,
                0
            );
        }
    );

    window.addEventListener(
        "online",
        () => {
            mostrarEstadoConexionHub(
                "Conexión recuperada",
                true,
                2600
            );

            /*
               La sincronización con GitHub podrá ejecutarse
               nuevamente en la siguiente carga.
            */
            if (
                typeof window
                    .forzarSincronizacionTrabajosHub ===
                "function"
            ) {
                window
                    .forzarSincronizacionTrabajosHub();
            }
        }
    );

    if (!navigator.onLine) {
        mostrarEstadoConexionHub(
            "Sin conexión · usando contenido guardado",
            false,
            0
        );
    }
}


function mostrarEstadoConexionHub(
    mensaje,
    recuperada,
    duracion
) {
    const indicador =
        document.getElementById(
            "estado-conexion-hub"
        );

    if (!indicador) {
        return;
    }

    const texto =
        indicador.querySelector(
            "span"
        );

    texto.textContent =
        mensaje;

    indicador.classList.toggle(
        "recuperada",
        recuperada
    );

    indicador.classList.add(
        "visible"
    );

    if (
        temporizadorEstadoConexionHub
    ) {
        window.clearTimeout(
            temporizadorEstadoConexionHub
        );

        temporizadorEstadoConexionHub =
            null;
    }

    if (
        duracion > 0
    ) {
        temporizadorEstadoConexionHub =
            window.setTimeout(
                () => {
                    indicador
                        .classList
                        .remove(
                            "visible"
                        );
                },
                duracion
            );
    }
}
