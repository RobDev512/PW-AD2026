# Cierre técnico del Hub de Programación Web

## Estado

**Cierre técnico original completado. Cierre definitivo pendiente de la Fase 16.**

El cierre original se refiere al desarrollo técnico principal completado durante la Fase 15 y no depende de que la materia haya terminado.

Posteriormente se decidió abrir una última Fase 16 para realizar un refinamiento final de identidad visual y experiencia de contenidos.

La Fase 16 se encuentra actualmente **en progreso**.

---

# Criterio

El roadmap documenta mejoras del Hub como sistema.

Agregar posteriormente archivos de U3, U4 o U5 corresponde normalmente a actualización de contenido, mantenimiento y registro académico.

La Fase 16 es una excepción deliberada: se añadió como última etapa estructural para mejorar la presentación visual del Hub, el manejo de contenidos y la experiencia responsive.

---

# Funciones verificadas hasta la Fase 15

- [x] estructura del Hub;
- [x] identidad visual base;
- [x] unidades dinámicas;
- [x] datos centralizados;
- [x] vistas previas;
- [x] documentación dinámica;
- [x] roadmap visual;
- [x] historial interactivo;
- [x] explorador de trabajos;
- [x] navegación avanzada;
- [x] favoritos y destacados;
- [x] actividad reciente;
- [x] estadísticas;
- [x] responsive y media pantalla;
- [x] panel de personalización;
- [x] perfil Minimal predeterminado;
- [x] navbar dinámica;
- [x] colores de acento y densidad;
- [x] iconos SVG;
- [x] animaciones y efectos configurables;
- [x] integración con el repositorio GitHub.

---

# Avances de la Fase 16

- [x] diseñar una familia de logo propia para PW Hub;
- [x] crear logo horizontal y compacto;
- [x] crear isotipo principal y variantes;
- [x] crear favicon en múltiples tamaños;
- [x] integrar favicon en el Hub;
- [x] integrar branding en el visor de trabajos;
- [x] reorganizar y formatear el código;
- [x] mover el visor completo a `vistas/trabajo.html`;
- [x] renderizar archivos Markdown de actividades dentro del Hub;
- [x] evitar la dependencia de abrir `.md` compatibles como texto plano;
- [x] estilizar el contenido Markdown renderizado;
- [x] incorporar modos Diseño y Código;
- [x] abrir trabajos en la misma pestaña;
- [x] conservar navegación de regreso al Hub cuando el historial del navegador lo permite.
- [x] convertir el roadmap en una estructura visual jerárquica;
- [x] dibujar sus conexiones mediante Canvas;
- [x] consolidar el hero generado mediante HTML y CSS;
- [x] integrar visualmente PW Hub, TecNM e ITT dentro del hero;
- [x] reducir y equilibrar la altura del banner;
- [x] compactar el roadmap visual en pantallas amplias;
- [x] compactar el branding del hero en vistas estrechas;
- [x] corregir conexiones Canvas que podían quedar visualmente separadas;
- [x] corregir el crecimiento horizontal del Canvas al redimensionar;
- [x] impedir overflow horizontal accidental del documento;
- [x] ajustar el contenedor TecNM + ITT al contenido real en vista estrecha;
- [x] compensar el margen transparente del logo TecNM en vista estrecha;
- [x] sacar Configuración de la navbar y convertirla en control flotante;
- [x] implementar una barra inferior compacta para móvil;
- [x] convertir Curso y Explorar en paneles móviles dinámicos;
- [x] mantener acceso a Documentación desde Explorar en móvil;
- [x] restaurar sticky de navbar en escritorio y media pantalla;
- [x] sincronizar navbar con los cambios realizados desde Configuración;
- [x] limitar el ajuste óptico de TecNM a vistas angostas;
- [x] reducir el breakpoint de navegación móvil a 650 px;
- [x] separar visualmente Explorar y Documentación dentro del panel móvil;
- [x] mantener Inicio, Curso, Explorar, Documentación y GitHub en una sola fila en media pantalla;
- [x] hacer que el panel móvil respete las secciones ocultas por Configuración y los perfiles;
- [x] separar la vista visual del Roadmap de su renderizado Markdown en Documentación;
- [x] mantener compatibilidad con perfiles Minimal, Académico y Completo;
- [x] reforzar tarjetas, botones, estados e indicadores;
- [x] mejorar la jerarquía visual de los trabajos destacados;
- [x] revisar colores, sombras y espaciados;
- [x] completar la revisión responsive funcional;
- [x] completar la revisión de navegación y coherencia visual;
- [x] incorporar safe-area móvil, foco visible y movimiento reducido;

---

# Cierre de la Fase 16

- [x] validar el paquete final en escritorio;
- [x] validar el paquete final en media pantalla;
- [x] validar el paquete final en ventana angosta;
- [x] validar el paquete final en celular;
- [x] cerrar el roadmap estructural en 16 / 16 fases.

La Fase 16 queda **Completada**. No existen tareas estructurales abiertas. El Hub entra en etapa de mantenimiento y actualización de contenidos académicos.


# Pendientes para el cierre definitivo

- [ ] retirar Configuración de la navbar;
- [ ] convertir Configuración en un control flotante y siempre visible;
- [ ] rediseñar la navbar para celular;
- [ ] incorporar una barra de navegación móvil compacta;
- [ ] mostrar Curso y Explorar mediante una interacción dinámica apropiada para móvil;
- [ ] evitar que la navegación móvil ocupe gran parte de la pantalla;
- [ ] reforzar tarjetas, botones, estados e indicadores;
- [ ] revisar la presentación de trabajos destacados;
- [ ] realizar una revisión responsive completa;
- [ ] realizar la revisión visual y funcional final.

---

# Arquitectura de publicación actual

El Hub utiliza directamente los archivos versionados del repositorio.

No necesita mantener una segunda copia en `publicacion/`.

El sistema de build protegido desarrollado durante la Fase 14 queda registrado como parte de la evolución histórica, pero ya no forma parte del flujo normal del portafolio.

GitHub Pages publica el contenido versionado del repositorio y el Hub se accede mediante su ruta `/hub/`.

---

# Mantenimiento futuro

Cuando se realice una actividad nueva:

1. guardar el archivo con un nombre descriptivo en su unidad;
2. agregarlo a `data/unidades.json`;
3. actualizar `HISTORIAL.md` cuando corresponda;
4. cambiar el estado de la unidad cuando avance el curso;
5. hacer commit y push.

Después de completar la Fase 16, este flujo volverá a representar el mantenimiento normal del Hub sin nuevas fases estructurales.

---

# Fases

**15 / 16 completadas.**

**Fase 16: En progreso.**

La Fase 16 será la última fase de desarrollo estructural.

Al finalizar la navegación móvil, el control flotante de Configuración, la revisión responsive y los últimos refinamientos visuales, este documento podrá volver a marcar el Hub como **cerrado definitivamente**.

# Mantenimiento posterior al cierre

- [x] añadir variantes de tema oscuro;
- [x] añadir estilos visuales configurables;
- [x] ampliar los niveles de movimiento;
- [x] conservar compatibilidad con preferencias anteriores;
- [x] mantener la Fase 16 cerrada en 16 / 16.

Estas mejoras no modifican el estado del roadmap estructural. PW Hub permanece en etapa de mantenimiento y actualización de contenidos.

## Liquid Glass V2

- [x] reforzar bordes especulares y profundidad del vidrio;
- [x] mejorar blur y saturación;
- [x] suavizar esquinas;
- [x] ampliar microanimaciones del modo Dinámico;
- [x] conservar compatibilidad móvil y movimiento reducido.

## Apariencia avanzada V4 reparada

- [x] restaurar la base estable anterior;
- [x] evitar cambios de `position`, `overflow` y `transform` estructurales;
- [x] aumentar blur y legibilidad en menús Liquid Glass;
- [x] ampliar microanimaciones sin afectar navegación ni paneles;
- [x] conservar `prefers-reduced-motion`.

## Liquid Glass V5 ajustado

- [x] reforzar blur en menús desplegables;
- [x] reducir un poco el blur del panel lateral y superficies menores;
- [x] acercar el acabado general a un estilo tipo iPhone;
- [x] mantener intacta la geometría y el comportamiento sticky.

## Liquid Glass V6

- [x] corregir la composición de backdrop entre navbar y dropdowns;
- [x] aumentar el blur efectivo de Curso / Explorar / Documentación;
- [x] reducir el blur general de otras superficies;
- [x] conservar geometría, sticky y navegación móvil.

## Liquid Glass V7

- [x] aumentar la opacidad general del material glass;
- [x] reducir ligeramente el blur de dropdowns;
- [x] hacer más sólidas tarjetas y paneles;
- [x] mantener bordes especulares y profundidad;
- [x] conservar estabilidad estructural.

## Liquid Glass V8 consolidado

- [x] retirar parches Liquid Glass V2-V7;
- [x] consolidar el estilo en una sola definición;
- [x] mantener menús con opacidad alta y blur moderado;
- [x] reducir el blur de superficies generales;
- [x] conservar navegación y geometría estables.

## Liquid Glass V9

- [x] restaurar tarjetas y paneles al aspecto V2;
- [x] restaurar Configuración y botón flotante al aspecto V2;
- [x] conservar únicamente el ajuste de blur en dropdowns;
- [x] evitar transparencia excesiva en menús.

## Liquid Glass V10

- [x] restaurar el blur de la navbar;
- [x] restaurar bordes especulares tipo iPhone;
- [x] conservar apariencia V2 en el resto del Hub;
- [x] mantener blur independiente de dropdowns;
- [x] no alterar geometría ni comportamiento sticky.

## Cierre final de apariencia

- [x] conservar los 5 temas oscuros originales;
- [x] añadir 15 temas oscuros nuevos;
- [x] completar 20 variantes de tema;
- [x] conservar los cuatro estilos visuales;
- [x] conservar tres niveles de movimiento;
- [x] mantener Liquid Glass V10 como versión final validada;
- [x] cerrar la etapa de ampliación visual.

A partir de este punto, el sistema de apariencia se considera finalizado y entra únicamente en mantenimiento correctivo.

## Cierre de sincronización y modo offline

- [x] U3 muestra Flexbox y CSS Grid como parte del catálogo base;
- [x] los nuevos trabajos compatibles pueden detectarse desde GitHub;
- [x] `unidades.json` sigue funcionando como fallback local;
- [x] el último catálogo sincronizado queda disponible sin conexión;
- [x] el Service Worker cachea el Hub y archivos del portafolio;
- [x] no se añadió instalación ni `manifest.webmanifest`;
- [x] el diseño y la apariencia avanzada permanecen sin cambios.

Con esta mejora el Hub queda preparado para crecer con futuras entregas sin requerir registrar manualmente cada archivo nuevo antes de que sea visible.

## Corrección de renombres

- [x] corregir la ruta de `Ejercicio0CSS.html`;
- [x] registrar el nuevo `Ejercicio1.html`;
- [x] evitar tarjetas 404 cuando un trabajo sea renombrado;
- [x] renovar la caché offline a versión 2.

## Cierre de apariencia compacta

- [x] unificar Tema y Estilo visual bajo Apariencia;
- [x] mantener 20 temas oscuros;
- [x] mantener Normal, Liquid Glass, Minimal y Neon Tech;
- [x] reducir sustancialmente el desplazamiento vertical de Configuración en celular;
- [x] conservar compatibilidad con configuraciones guardadas anteriores;
- [x] refinar Liquid Glass sin modificar la estructura del layout;
- [x] evitar que archivos temporales vuelvan a Git;
- [x] actualizar caché offline a versión 3.

Con este ajuste, la interfaz de personalización vuelve a considerarse cerrada salvo mantenimiento correctivo.

## Cierre de materiales y combobox

- [x] reemplazar combobox nativos por controles visuales propios;
- [x] relacionar cada material con paletas compatibles;
- [x] disponer de 8 materiales visuales;
- [x] conservar las 20 paletas dentro del sistema;
- [x] mejorar Liquid Glass sin alterar la geometría;
- [x] utilizar refracción SVG solo como mejora progresiva;
- [x] mantener fallback compatible y rendimiento móvil;
- [x] renovar caché offline a versión 4.

## Cierre del modo sin conexión

- [x] cachear el shell principal;
- [x] cachear trabajos detectados dentro de U1-U5;
- [x] conservar el último catálogo sincronizado;
- [x] soportar renombres sin tarjetas 404;
- [x] añadir página offline visual;
- [x] mostrar estado de conexión de manera no invasiva;
- [x] mantener el sitio no instalable;
- [x] actualizar Service Worker a versión 5.

Con este bloque se considera terminado el soporte offline planificado para PW Hub.

## Corrección final del hero móvil

- [x] mostrar HTML y CSS flotantes en `<= 420px`;
- [x] conservar JS y el editor existente;
- [x] no alterar ninguna otra vista;
- [x] actualizar la caché offline a versión 6.
