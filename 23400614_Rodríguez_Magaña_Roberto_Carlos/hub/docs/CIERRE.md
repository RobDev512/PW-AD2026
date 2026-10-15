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

---

# Trabajo actual de la Fase 16

- [ ] finalizar el hero principal generado mediante HTML y CSS;
- [ ] cerrar el refinamiento de los logos integrados dentro del hero;
- [ ] validar proporciones y altura del banner en distintos tamaños de pantalla.

El hero ya fue desarrollado y probado localmente, pero permanece marcado como trabajo actual hasta completar su revisión responsive.

---

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
