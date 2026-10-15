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
