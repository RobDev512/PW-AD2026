/*
    =========================================================
    PW HUB - AJUSTE SUPERIOR DEL HERO
    =========================================================

    Este script NO cambia la composición del hero.

    Solo actúa si, estando al inicio de la página, el primer
    header aparece desplazado hacia abajo respecto del viewport.
*/

(function ajustarHeroAlBordeSuperior() {
    const header =
        document.querySelector(
            "body > .encabezado-principal.encabezado-con-hero"
        );

    if (!header) {
        return;
    }

    /*
       No intervenimos si el navegador restauró una posición
       de scroll distinta del inicio.
    */
    if (
        Math.abs(
            window.scrollY
        ) > 1
    ) {
        return;
    }

    /*
       Quitamos cualquier compensación anterior antes de medir.
    */
    header.style.removeProperty(
        "--hero-compensacion-superior"
    );

    const distancia =
        header
            .getBoundingClientRect()
            .top;

    /*
       Solo corregimos un hueco pequeño y real.
       El límite evita reaccionar a layouts o estados extraños.
    */
    if (
        distancia > 0.5 &&
        distancia < 80
    ) {
        header.style.setProperty(
            "--hero-compensacion-superior",
            `${distancia}px`
        );

        header.style.marginTop =
            `calc(-1 * var(--hero-compensacion-superior))`;
    }
})();
