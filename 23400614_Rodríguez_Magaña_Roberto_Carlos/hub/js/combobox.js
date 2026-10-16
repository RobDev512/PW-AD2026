/*
    =========================================================
    PW HUB - COMBOBOX PERSONALIZADO
    =========================================================

    Mejora progresivamente todos los <select> del Hub.

    El <select> original se conserva para compatibilidad con
    trabajos.js, historial.js y personalizacion.js.
*/

const COMBOBOX_HUB = {
    abierto:
        null,

    popover:
        null
};


document.addEventListener(
    "DOMContentLoaded",
    () => {
        iniciarComboboxesHub();
    }
);


window.actualizarComboboxesHub =
    actualizarComboboxesHub;


function iniciarComboboxesHub() {
    asegurarPopoverComboboxHub();

    document
        .querySelectorAll(
            "select:not([data-combobox-native])"
        )
        .forEach(
            (select) =>
                mejorarSelectHub(
                    select
                )
        );

    document.addEventListener(
        "pointerdown",
        (evento) => {
            if (
                !COMBOBOX_HUB.abierto
            ) {
                return;
            }

            const dentroTrigger =
                COMBOBOX_HUB.abierto
                    .wrapper
                    .contains(
                        evento.target
                    );

            const dentroPopover =
                COMBOBOX_HUB.popover
                    ?.contains(
                        evento.target
                    );

            if (
                !dentroTrigger &&
                !dentroPopover
            ) {
                cerrarComboboxHub();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (evento) => {
            if (
                evento.key ===
                "Escape"
            ) {
                cerrarComboboxHub(
                    true
                );
            }
        }
    );

    window.addEventListener(
        "resize",
        cerrarComboboxHub
    );

    document.addEventListener(
        "scroll",
        () => {
            if (
                COMBOBOX_HUB.abierto
            ) {
                posicionarPopoverComboboxHub(
                    COMBOBOX_HUB.abierto
                );
            }
        },
        true
    );
}


function mejorarSelectHub(
    select
) {
    if (
        select.dataset
            .comboboxMejorado ===
        "true"
    ) {
        return;
    }

    select.dataset.comboboxMejorado =
        "true";

    select.classList.add(
        "select-nativo-pwhub"
    );

    select.tabIndex =
        -1;

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "pwhub-combobox";

    const trigger =
        document.createElement(
            "button"
        );

    trigger.type =
        "button";

    trigger.className =
        "pwhub-combobox-trigger";

    trigger.setAttribute(
        "role",
        "combobox"
    );

    trigger.setAttribute(
        "aria-haspopup",
        "listbox"
    );

    trigger.setAttribute(
        "aria-expanded",
        "false"
    );

    const idLista =
        `${select.id || "select"}-lista-pwhub`;

    trigger.setAttribute(
        "aria-controls",
        idLista
    );

    const valor =
        document.createElement(
            "span"
        );

    valor.className =
        "pwhub-combobox-valor";

    const flecha =
        document.createElement(
            "span"
        );

    flecha.className =
        "pwhub-combobox-flecha";

    flecha.setAttribute(
        "aria-hidden",
        "true"
    );

    trigger.append(
        valor,
        flecha
    );

    select.insertAdjacentElement(
        "afterend",
        wrapper
    );

    wrapper.appendChild(
        trigger
    );

    const estado = {
        select,
        wrapper,
        trigger,
        valor,
        idLista
    };

    wrapper._pwhubCombobox =
        estado;

    select._pwhubCombobox =
        estado;

    sincronizarTriggerComboboxHub(
        estado
    );

    trigger.addEventListener(
        "click",
        () => {
            if (
                select.disabled
            ) {
                return;
            }

            if (
                COMBOBOX_HUB.abierto ===
                estado
            ) {
                cerrarComboboxHub(
                    true
                );
            } else {
                abrirComboboxHub(
                    estado
                );
            }
        }
    );

    trigger.addEventListener(
        "keydown",
        (evento) => {
            if (
                [
                    "ArrowDown",
                    "ArrowUp",
                    "Enter",
                    " "
                ].includes(
                    evento.key
                )
            ) {
                evento.preventDefault();

                abrirComboboxHub(
                    estado
                );
            }
        }
    );

    select.addEventListener(
        "change",
        () => {
            sincronizarTriggerComboboxHub(
                estado
            );

            if (
                COMBOBOX_HUB.abierto ===
                estado
            ) {
                construirOpcionesComboboxHub(
                    estado
                );
            }
        }
    );

    const observador =
        new MutationObserver(
            () => {
                sincronizarTriggerComboboxHub(
                    estado
                );

                if (
                    COMBOBOX_HUB.abierto ===
                    estado
                ) {
                    construirOpcionesComboboxHub(
                        estado
                    );
                }
            }
        );

    observador.observe(
        select,
        {
            childList:
                true,

            subtree:
                true,

            attributes:
                true,

            attributeFilter: [
                "disabled",
                "label",
                "data-description",
                "data-color"
            ]
        }
    );

    const label =
        select.id
            ? document.querySelector(
                `label[for="${CSS.escape(select.id)}"]`
            )
            : null;

    if (label) {
        label.addEventListener(
            "click",
            (evento) => {
                /*
                   Evitamos que el label mande el foco al select
                   visualmente oculto.
                */
                evento.preventDefault();

                trigger.focus();
            }
        );
    }
}


function asegurarPopoverComboboxHub() {
    if (
        COMBOBOX_HUB.popover
    ) {
        return;
    }

    const popover =
        document.createElement(
            "div"
        );

    popover.className =
        "pwhub-combobox-popover";

    popover.setAttribute(
        "role",
        "listbox"
    );

    document.body.appendChild(
        popover
    );

    COMBOBOX_HUB.popover =
        popover;
}


function abrirComboboxHub(
    estado
) {
    asegurarPopoverComboboxHub();

    if (
        COMBOBOX_HUB.abierto &&
        COMBOBOX_HUB.abierto !==
            estado
    ) {
        cerrarComboboxHub();
    }

    COMBOBOX_HUB.abierto =
        estado;

    estado.wrapper.classList.add(
        "abierto"
    );

    estado.trigger.setAttribute(
        "aria-expanded",
        "true"
    );

    COMBOBOX_HUB.popover.id =
        estado.idLista;

    construirOpcionesComboboxHub(
        estado
    );

    COMBOBOX_HUB.popover
        .classList
        .add(
            "visible"
        );

    posicionarPopoverComboboxHub(
        estado
    );

    requestAnimationFrame(
        () => {
            const activa =
                COMBOBOX_HUB.popover
                    .querySelector(
                        '[aria-selected="true"]'
                    );

            activa?.scrollIntoView({
                block:
                    "nearest"
            });

            (
                activa ||
                COMBOBOX_HUB.popover
                    .querySelector(
                        ".pwhub-combobox-opcion:not([disabled])"
                    )
            )?.focus();
        }
    );
}


function cerrarComboboxHub(
    devolverFoco = false
) {
    const estado =
        COMBOBOX_HUB.abierto;

    if (!estado) {
        return;
    }

    estado.wrapper.classList.remove(
        "abierto"
    );

    estado.trigger.setAttribute(
        "aria-expanded",
        "false"
    );

    COMBOBOX_HUB.popover
        ?.classList
        .remove(
            "visible"
        );

    COMBOBOX_HUB.popover
        ?.replaceChildren();

    COMBOBOX_HUB.abierto =
        null;

    if (devolverFoco) {
        estado.trigger.focus();
    }
}


function construirOpcionesComboboxHub(
    estado
) {
    const popover =
        COMBOBOX_HUB.popover;

    popover.replaceChildren();

    const opciones =
        Array.from(
            estado.select.options
        );

    opciones.forEach(
        (option) => {
            const boton =
                document.createElement(
                    "button"
                );

            boton.type =
                "button";

            boton.className =
                "pwhub-combobox-opcion";

            boton.setAttribute(
                "role",
                "option"
            );

            boton.setAttribute(
                "aria-selected",
                String(
                    option.selected
                )
            );

            boton.disabled =
                option.disabled;

            boton.dataset.valor =
                option.value;

            const muestra =
                document.createElement(
                    "span"
                );

            muestra.className =
                "pwhub-combobox-muestra";

            if (
                option.dataset.color
            ) {
                boton.dataset.tieneColor =
                    "true";

                muestra.style
                    .setProperty(
                        "--pwhub-combobox-color",
                        option.dataset.color
                    );
            }

            const texto =
                document.createElement(
                    "span"
                );

            texto.className =
                "pwhub-combobox-texto";

            const fuerte =
                document.createElement(
                    "strong"
                );

            fuerte.textContent =
                option.textContent;

            texto.appendChild(
                fuerte
            );

            if (
                option.dataset
                    .description
            ) {
                const detalle =
                    document.createElement(
                        "small"
                    );

                detalle.textContent =
                    option.dataset
                        .description;

                texto.appendChild(
                    detalle
                );
            }

            const check =
                document.createElement(
                    "span"
                );

            check.className =
                "pwhub-combobox-check";

            check.setAttribute(
                "aria-hidden",
                "true"
            );

            boton.append(
                muestra,
                texto,
                check
            );

            boton.addEventListener(
                "click",
                () => {
                    seleccionarOpcionComboboxHub(
                        estado,
                        option.value
                    );
                }
            );

            boton.addEventListener(
                "keydown",
                (evento) => {
                    navegarOpcionesComboboxHub(
                        evento,
                        estado
                    );
                }
            );

            popover.appendChild(
                boton
            );
        }
    );
}


function seleccionarOpcionComboboxHub(
    estado,
    valor
) {
    if (
        estado.select.value !==
        valor
    ) {
        estado.select.value =
            valor;

        estado.select.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles:
                        true
                }
            )
        );
    }

    sincronizarTriggerComboboxHub(
        estado
    );

    cerrarComboboxHub(
        true
    );
}


function navegarOpcionesComboboxHub(
    evento,
    estado
) {
    const botones =
        Array.from(
            COMBOBOX_HUB.popover
                .querySelectorAll(
                    ".pwhub-combobox-opcion:not([disabled])"
                )
        );

    const actual =
        document.activeElement;

    const indice =
        botones.indexOf(
            actual
        );

    if (
        evento.key ===
        "ArrowDown"
    ) {
        evento.preventDefault();

        botones[
            Math.min(
                indice + 1,
                botones.length - 1
            )
        ]?.focus();

        return;
    }

    if (
        evento.key ===
        "ArrowUp"
    ) {
        evento.preventDefault();

        botones[
            Math.max(
                indice - 1,
                0
            )
        ]?.focus();

        return;
    }

    if (
        evento.key ===
            "Home"
    ) {
        evento.preventDefault();
        botones[0]?.focus();
        return;
    }

    if (
        evento.key ===
            "End"
    ) {
        evento.preventDefault();
        botones.at(-1)?.focus();
        return;
    }

    if (
        evento.key ===
            "Enter" ||
        evento.key ===
            " "
    ) {
        evento.preventDefault();

        if (
            actual?.dataset
                ?.valor !==
            undefined
        ) {
            seleccionarOpcionComboboxHub(
                estado,
                actual.dataset.valor
            );
        }
    }
}


function sincronizarTriggerComboboxHub(
    estado
) {
    const seleccionada =
        estado.select
            .selectedOptions[0];

    estado.valor.textContent =
        seleccionada
            ? seleccionada.textContent
            : "Seleccionar";

    estado.trigger.disabled =
        estado.select.disabled;

    estado.trigger.setAttribute(
        "aria-disabled",
        String(
            estado.select.disabled
        )
    );
}


function posicionarPopoverComboboxHub(
    estado
) {
    const popover =
        COMBOBOX_HUB.popover;

    if (
        !popover ||
        !popover.classList
            .contains(
                "visible"
            )
    ) {
        return;
    }

    const rect =
        estado.trigger
            .getBoundingClientRect();

    const margen =
        8;

    const ancho =
        Math.max(
            210,
            Math.min(
                rect.width,
                window.innerWidth -
                    margen * 2
            )
        );

    popover.style.width =
        `${ancho}px`;

    /*
       Necesitamos medirlo después de establecer el ancho.
    */
    const altoPopover =
        Math.min(
            popover.scrollHeight,
            Math.min(
                292,
                window.innerHeight -
                    margen * 2
            )
        );

    const espacioAbajo =
        window.innerHeight -
        rect.bottom -
        margen;

    const espacioArriba =
        rect.top -
        margen;

    const abrirArriba =
        espacioAbajo <
            Math.min(
                altoPopover,
                190
            ) &&
        espacioArriba >
            espacioAbajo;

    let top =
        abrirArriba
            ? rect.top -
                altoPopover -
                6
            : rect.bottom +
                6;

    top =
        Math.max(
            margen,
            Math.min(
                top,
                window.innerHeight -
                    altoPopover -
                    margen
            )
        );

    let left =
        rect.left;

    left =
        Math.max(
            margen,
            Math.min(
                left,
                window.innerWidth -
                    ancho -
                    margen
            )
        );

    popover.style.top =
        `${top}px`;

    popover.style.left =
        `${left}px`;
}


function actualizarComboboxesHub() {
    document
        .querySelectorAll(
            "select:not([data-combobox-native])"
        )
        .forEach(
            (select) => {
                if (
                    select.dataset
                        .comboboxMejorado !==
                    "true"
                ) {
                    mejorarSelectHub(
                        select
                    );
                }

                if (
                    select._pwhubCombobox
                ) {
                    sincronizarTriggerComboboxHub(
                        select._pwhubCombobox
                    );
                }
            }
        );
}
