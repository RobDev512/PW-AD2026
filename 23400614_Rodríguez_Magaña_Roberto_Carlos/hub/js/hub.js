let datosHub = null;

document.addEventListener(
    "DOMContentLoaded",
    iniciarHub
);

async function iniciarHub() {
    try {
        const respuesta = await fetch(
            "data/unidades.json"
        );

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible cargar unidades.json"
            );
        }

        datosHub = await respuesta.json();

        renderizarProgresoHub(datosHub);
        renderizarResumenHub(datosHub);
        renderizarUnidadesHub(datosHub);
        configurarDocumentacionHub();
    } catch (error) {
        console.error(error);

        const unidades = document.getElementById(
            "contenedor-unidades"
        );

        if (unidades) {
            unidades.innerHTML =
                '<p class="error-carga">No fue posible cargar las unidades del Hub.</p>';
        }
    }
}

function renderizarProgresoHub(datos) {
    const contenedor = document.getElementById(
        "linea-progreso"
    );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    datos.unidades.forEach((unidad) => {
        const tarjeta = document.createElement("a");

        tarjeta.href = `#unidad${unidad.numero}`;
        tarjeta.className =
            `progreso-unidad ${unidad.estado}`;

        tarjeta.innerHTML = `
            <span class="progreso-circulo">
                U${unidad.numero}
            </span>

            <p>${unidad.titulo}</p>
        `;

        contenedor.appendChild(tarjeta);
    });
}

function renderizarResumenHub(datos) {
    const totalTrabajos = datos.unidades.reduce(
        (total, unidad) =>
            total +
            (unidad.trabajos
                ? unidad.trabajos.length
                : 0),
        0
    );

    const unidadesConTrabajos =
        datos.unidades.filter(
            (unidad) =>
                (unidad.trabajos || []).length > 0
        ).length;

    const actual = datos.unidades.find(
        (unidad) =>
            unidad.estado === "actual"
    );

    asignarTextoHub(
        "total-trabajos",
        totalTrabajos
    );

    asignarTextoHub(
        "total-unidades",
        unidadesConTrabajos
    );

    asignarTextoHub(
        "unidad-actual-resumen",
        actual
            ? `U${actual.numero}`
            : "-"
    );
}

function renderizarUnidadesHub(datos) {
    const contenedor = document.getElementById(
        "contenedor-unidades"
    );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    datos.unidades.forEach((unidad) => {
        const articulo = document.createElement(
            "article"
        );

        articulo.id = `unidad${unidad.numero}`;
        articulo.className =
            `unidad-card ${unidad.estado}`;

        articulo.innerHTML = `
            <div class="unidad-cabecera">
                <div>
                    <p class="unidad-numero">
                        Unidad ${unidad.numero}
                    </p>

                    <h3>${unidad.titulo}</h3>

                    <p class="unidad-descripcion">
                        ${unidad.descripcion}
                    </p>
                </div>

                <span class="unidad-estado ${unidad.estado}">
                    ${formatearEstadoUnidadHub(unidad.estado)}
                </span>
            </div>

            <div class="unidad-contenido">
                <aside class="unidad-temas">
                    <h4>Temas de la unidad</h4>

                    <ul>
                        ${unidad.temas
                            .map(
                                (tema) =>
                                    `<li>${tema}</li>`
                            )
                            .join("")}
                    </ul>
                </aside>

                <div class="unidad-trabajos">
                    <h4>Trabajos realizados</h4>

                    <div
                        class="unidad-trabajos-grid"
                        data-unidad-trabajos="${unidad.numero}"
                    >
                        ${
                            unidad.trabajos.length
                                ? ""
                                : `
                                    <p class="unidad-sin-trabajos">
                                        ${
                                            unidad.estado === "actual"
                                                ? "Los trabajos de esta unidad se agregarán conforme sean realizados."
                                                : "Esta unidad todavía no cuenta con trabajos registrados."
                                        }
                                    </p>
                                `
                        }
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(articulo);
        renderizarTrabajosUnidadHub(unidad);
    });
}

function renderizarTrabajosUnidadHub(unidad) {
    const contenedor = document.querySelector(
        `[data-unidad-trabajos="${unidad.numero}"]`
    );

    if (
        !contenedor ||
        unidad.trabajos.length === 0
    ) {
        return;
    }

    unidad.trabajos.forEach((trabajo) => {
        const tarjeta = document.createElement(
            "article"
        );

        const trabajoCompleto = {
            ...trabajo,
            unidad: unidad.numero,
            unidadTitulo: unidad.titulo,
            unidadEstado: unidad.estado
        };

        tarjeta.className = "unidad-trabajo";

        tarjeta.innerHTML = `
            <div class="unidad-trabajo-preview">
                ${crearPreviewMiniHub(trabajo)}
            </div>

            <div class="unidad-trabajo-info">
                <p class="unidad-trabajo-tipo">
                    ${formatearTipoHub(trabajo.tipo)}
                </p>

                <h5>${trabajo.nombre}</h5>

                <p>${trabajo.descripcion}</p>

                <div class="unidad-trabajo-acciones">
                    <button
                        type="button"
                        class="unidad-trabajo-vista-previa"
                        data-unidad-vista-previa
                    >
                        Vista previa
                    </button>

                    <a
                        href="${generarRutaVisorTrabajoHub(trabajoCompleto)}"
                        data-unidad-abrir-trabajo
                    >
                        Abrir trabajo
                    </a>
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);

        const botonVistaPrevia = tarjeta.querySelector(
            "[data-unidad-vista-previa]"
        );

        if (botonVistaPrevia) {
            botonVistaPrevia.addEventListener(
                "click",
                () => {
                    if (
                        typeof window
                            .mostrarVistaPreviaTrabajoHub ===
                        "function"
                    ) {
                        window
                            .mostrarVistaPreviaTrabajoHub(
                                trabajoCompleto
                            );
                    }
                }
            );
        }

        if (
            String(trabajo.tipo).toLowerCase() ===
            "markdown"
        ) {
            cargarMiniMarkdownHub(
                tarjeta,
                trabajo
            );

        }
    });
}

function generarRutaVisorTrabajoHub(trabajo) {
    const rutaAbsoluta = new URL(
        trabajo.ruta || "",
        window.location.href
    ).href;

    const parametros = new URLSearchParams({
        archivo: rutaAbsoluta,
        tipo: String(
            trabajo.tipo || "archivo"
        ).toLowerCase(),
        titulo: trabajo.nombre || "Trabajo"
    });

    return `vistas/trabajo.html?${parametros.toString()}`;
}

function crearPreviewMiniHub(trabajo) {
    const tipo = String(
        trabajo.tipo || ""
    ).toLowerCase();

    if (
        tipo === "html" ||
        tipo === "pdf"
    ) {
        return `
            <iframe
                src="${trabajo.ruta}"
                title="Vista previa de ${trabajo.nombre}"
                loading="lazy"
            ></iframe>
        `;
    }

    if (tipo === "markdown") {
        return `
            <div class="preview-markdown-mini">
                Cargando vista previa...
            </div>
        `;
    }

    return `
        <div class="preview-markdown-mini">
            Vista previa no disponible.
        </div>
    `;
}

async function cargarMiniMarkdownHub(
    tarjeta,
    trabajo
) {
    const contenedor = tarjeta.querySelector(
        ".preview-markdown-mini"
    );

    if (!contenedor) {
        return;
    }

    try {
        const respuesta = await fetch(
            trabajo.ruta
        );

        if (!respuesta.ok) {
            throw new Error();
        }

        const markdown = await respuesta.text();

        if (window.marked) {
            contenedor.innerHTML =
                marked.parse(markdown);

            corregirRutasMarkdownHub(
                contenedor,
                trabajo.ruta
            );
        } else {
            contenedor.textContent =
                markdown.slice(0, 900);
        }
    } catch {
        contenedor.textContent =
            "No fue posible generar la vista previa.";
    }
}

function configurarDocumentacionHub() {
    const botones = document.querySelectorAll(
        ".boton-documento[data-doc]"
    );

    const cerrar = document.getElementById(
        "cerrar-documento"
    );

    botones.forEach((boton) =>
        boton.addEventListener(
            "click",
            () =>
                cargarDocumentoHub(
                    boton.dataset.doc
                )
        )
    );

    if (cerrar) {
        cerrar.addEventListener(
            "click",
            cerrarDocumentoHub
        );
    }
}

async function cargarDocumentoHub(nombre) {
    const titulo = document.getElementById(
        "titulo-documento"
    );

    const contenido = document.getElementById(
        "contenido-markdown"
    );

    const cerrar = document.getElementById(
        "cerrar-documento"
    );

    const visor = document.getElementById(
        "visor-markdown"
    );

    if (
        !titulo ||
        !contenido ||
        !cerrar ||
        !visor
    ) {
        return;
    }

    contenido.innerHTML =
        '<p class="mensaje-visor">Cargando documento...</p>';

    try {
        const respuesta = await fetch(
            `docs/${nombre}`
        );

        if (!respuesta.ok) {
            throw new Error(
                "Documento no disponible"
            );
        }

        const markdown =
            await respuesta.text();

        titulo.textContent =
            nombre.replace(
                ".md",
                ""
            );

        /*
           El visor de Documentación siempre muestra el
           archivo Markdown renderizado.

           El roadmap visual ya tiene su propia sección
           interactiva en #roadmap, por lo que ROADMAP.md
           no debe convertirse nuevamente en diagrama aquí.
        */
        contenido.classList.remove(
            "contenido-roadmap-visual"
        );

        contenido.innerHTML =
            window.marked
                ? marked.parse(
                    markdown
                )
                : `<pre>${escaparHtmlHub(markdown)}</pre>`;

        corregirRutasMarkdownHub(
            contenido,
            `docs/${nombre}`
        );

        cerrar.hidden = false;

        visor.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
    catch (error) {
        console.error(error);

        contenido.classList.remove(
            "contenido-roadmap-visual"
        );

        contenido.innerHTML = `
            <p class="error-carga">
                No fue posible cargar ${nombre}.
            </p>
        `;
    }
}

function cerrarDocumentoHub() {
    const titulo = document.getElementById(
        "titulo-documento"
    );

    const contenido = document.getElementById(
        "contenido-markdown"
    );

    const cerrar = document.getElementById(
        "cerrar-documento"
    );

    if (titulo) {
        titulo.textContent =
            "Documentación del Hub";
    }

    if (contenido) {
        contenido.classList.remove(
            "contenido-roadmap-visual"
        );

        contenido.innerHTML =
            '<p class="mensaje-visor">Selecciona README, Historial o Roadmap para visualizarlo aquí.</p>';
    }

    if (cerrar) {
        cerrar.hidden = true;
    }
}

function corregirRutasMarkdownHub(
    contenedor,
    rutaDocumento
) {
    const ultimaBarra =
        rutaDocumento.lastIndexOf("/");

    const carpetaBase =
        ultimaBarra >= 0
            ? rutaDocumento.slice(
                0,
                ultimaBarra + 1
            )
            : "";

    contenedor
        .querySelectorAll("img, a")
        .forEach((elemento) => {
            const atributo =
                elemento.tagName === "IMG"
                    ? "src"
                    : "href";

            const valor =
                elemento.getAttribute(
                    atributo
                );

            if (
                !valor ||
                !esRutaRelativaHub(valor)
            ) {
                return;
            }

            elemento.setAttribute(
                atributo,
                carpetaBase + valor
            );
        });
}

function asignarTextoHub(id, valor) {
    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function formatearEstadoUnidadHub(estado) {
    return {
        completada: "Completada",
        actual: "Unidad actual",
        pendiente: "Pendiente"
    }[estado] || estado;
}

function formatearTipoHub(tipo) {
    const valor = String(
        tipo || "archivo"
    ).toLowerCase();

    const mapa = {
        html: "HTML",
        markdown: "Markdown",
        md: "Markdown",
        pdf: "PDF",
        texto: "Texto",
        txt: "Texto"
    };

    return (
        mapa[valor] ||
        (
            valor.charAt(0).toUpperCase() +
            valor.slice(1)
        )
    );
}

function esRutaRelativaHub(ruta) {
    return !(
        ruta.startsWith("http://") ||
        ruta.startsWith("https://") ||
        ruta.startsWith("#") ||
        ruta.startsWith("mailto:") ||
        ruta.startsWith("data:")
    );
}

function escaparHtmlHub(texto) {
    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;
}
