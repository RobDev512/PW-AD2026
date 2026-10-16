# Roadmap del Portafolio de Programación Web

## Estado general

**16 de 16 fases completadas. Roadmap estructural cerrado.**

El roadmap representa la evolución **técnica del Hub**, no el avance de las cinco unidades de la materia.

Las fases 1 a 15 documentan la construcción y cierre técnico original del Hub. Posteriormente se decidió abrir una **última Fase 16** para realizar un refinamiento final de identidad visual y experiencia de contenidos.

Agregar tareas, actividades o proyectos de U3, U4 y U5 continúa considerándose mantenimiento y actualización de contenido, salvo cuando un cambio forme parte explícita de la Fase 16.

---

# Fase 1 - Estructura inicial

**Estado:** Completada

## Objetivo

Crear una página central para reunir los trabajos realizados durante Programación Web.

---

# Fase 2 - Identidad visual

**Estado:** Completada

## Objetivo

Crear una identidad visual propia para el portafolio académico.

---

# Fase 3 - Modelo académico

**Estado:** Completada

## Objetivo

Representar unidades, estado del curso y organización académica.

---

# Fase 4 - Fuente de datos central

**Estado:** Completada

## Objetivo

Centralizar unidades y trabajos mediante `data/unidades.json`.

---

# Fase 5 - Vistas previas

**Estado:** Completada

## Objetivo

Permitir explorar trabajos directamente desde el Hub.

---

# Fase 6 - Documentación dinámica

**Estado:** Completada

## Objetivo

Integrar README, Historial y Roadmap dentro de la interfaz.

---

# Fase 7 - Roadmap visual

**Estado:** Completada

## Objetivo

Convertir `ROADMAP.md` en una representación visual e interactiva.

---

# Fase 8 - Historial interactivo

**Estado:** Completada

## Objetivo

Convertir `HISTORIAL.md` en una memoria navegable de la evolución académica y técnica.

---

# Fase 9 - Buscador y explorador de trabajos

**Estado:** Completada

## Objetivo

Facilitar la localización de actividades mediante búsqueda, filtros, ordenamiento y vistas previas.

---

# Fase 10 - Navegación avanzada

**Estado:** Completada

## Objetivo

Mantener una navegación clara y escalable.

## Implementado

- menús agrupados;
- navegación sticky;
- sección activa;
- subsección activa;
- navegación mediante hash;
- offset visual;
- soporte para unidades dinámicas;
- media pantalla;
- pestañas verticales;
- scrollbar personalizada.

---

# Fase 11 - Favoritos y destacados

**Estado:** Completada

## Objetivo

Permitir identificar trabajos importantes y guardar preferencias personales.

## Implementado

- favoritos con `localStorage`;
- persistencia;
- filtros y contadores;
- soporte para destacados desde `unidades.json`.

---

# Fase 12 - Actividad reciente

**Estado:** Completada

## Objetivo

Mostrar eventos recientes sin duplicar la fuente de datos.

## Fuente

`docs/HISTORIAL.md`

---

# Fase 13 - Estadísticas académicas

**Estado:** Completada

## Objetivo

Calcular información académica automáticamente a partir de las fuentes existentes.

## Implementado

- trabajos registrados;
- unidades completadas;
- eventos históricos;
- porcentaje académico;
- trabajos por unidad;
- tipos de trabajo;
- eventos por unidad;
- tipos de evento.

---

# Fase 14 - Preparación para publicación

**Estado:** Completada

## Objetivo

Probar una estrategia de producción separada del código fuente.

## Trabajo realizado

Durante esta fase se implementaron y probaron minificación, ausencia de source maps, ofuscación opcional y una copia separada de producción.

Posteriormente se simplificó la arquitectura: el Hub pasó a utilizar directamente los archivos versionados del repositorio y la carpeta `publicacion/` dejó de formar parte del flujo actual.

La Fase 14 permanece registrada porque documenta una etapa real de la evolución técnica, aunque sus herramientas de build ya no sean necesarias.

---

# Fase 15 - Cierre técnico y personalización final

**Estado:** Completada

## Objetivo

Cerrar la evolución técnica principal del Hub y dejar una experiencia configurable, limpia y preparada para continuar recibiendo contenido académico.

## Implementado

- panel de configuración;
- perfil Minimal predeterminado;
- perfiles Completo y Académico;
- selección de secciones visibles;
- navbar sincronizada con las secciones activas;
- desaparición dinámica de submenús sin contenido;
- colores de acento;
- densidad visual;
- iconografía SVG;
- animaciones suaves;
- control de animaciones y efectos;
- respeto por `prefers-reduced-motion`;
- revisión del comportamiento responsive;
- documentación final del funcionamiento;
- integración del Hub con el repositorio académico.

## Resultado

La Fase 15 cerró correctamente el desarrollo técnico principal del Hub en ese momento.

Las modificaciones posteriores ligadas únicamente al contenido real de Programación Web continúan siendo mantenimiento normal:

- nuevas actividades;
- tareas;
- prácticas;
- proyectos;
- cambios de estado de U3, U4 y U5.

Posteriormente se decidió abrir una última fase de refinamiento visual y funcional sin invalidar el cierre histórico de esta fase.

---

# Fase 16 - Identidad visual y experiencia de contenidos

**Estado:** Completada

## Objetivo

Realizar una última etapa de refinamiento visual y funcional del Hub, reforzando su identidad propia y mejorando la forma en que se presentan los contenidos académicos.

## Implementado

- [x] diseñar una familia de logo propia para PW Hub;
- [x] crear versiones horizontal, compacta e isotipo;
- [x] conservar variantes alternativas del isotipo;
- [x] crear favicon en 16, 32, 192 y 512 píxeles;
- [x] integrar favicon en el Hub principal;
- [x] integrar favicon e isotipo en el visor de trabajos;
- [x] reorganizar y formatear el código del Hub;
- [x] mover el visor completo a `vistas/trabajo.html`;
- [x] renderizar documentos Markdown dentro de la interfaz;
- [x] evitar que los documentos Markdown compatibles dependan de abrirse como texto plano;
- [x] integrar `Perfil.md`, `Comandos_Git.md` y otros trabajos Markdown mediante el visor;
- [x] incorporar modos **Diseño** y **Código** en la vista completa;
- [x] mantener un solo modo activo;
- [x] aplicar estilos propios a títulos, listas, tablas, código, citas y enlaces Markdown;
- [x] abrir los trabajos en la misma pestaña;
- [x] conservar el regreso al Hub mediante el historial del navegador cuando es posible.
- [x] convertir el roadmap de fases en un mapa visual jerárquico;
- [x] representar categorías y tareas como ramas y subramas;
- [x] dibujar las conexiones del roadmap mediante Canvas para mantener líneas continuas y adaptables;
- [x] consolidar el hero principal generado con HTML y CSS;
- [x] terminar la integración visual de los logos de PW Hub, TecNM e Instituto Tecnológico de Tepic dentro del hero;
- [x] reducir y equilibrar la altura del banner;
- [x] limitar el ancho del roadmap visual en pantallas amplias para evitar separaciones excesivas entre fases y ramas;
- [x] compactar el branding del hero en vistas estrechas y mantener el logo horizontal de PW Hub;
- [x] corregir el tronco Canvas del roadmap para que conecte también categorías situadas por encima del centro de la tarjeta de fase;
- [x] corregir el cálculo de ancho del Canvas para evitar crecimiento horizontal acumulativo al redimensionar la ventana;
- [x] impedir que decoraciones visuales generen scroll horizontal de página;
- [x] corregir el ancho del contenedor institucional en vista estrecha para eliminar el espacio libre antes del logo TecNM;
- [x] compensar el margen transparente interno del PNG oficial de TecNM en vistas estrechas;
- [x] sacar el botón de Configuración de la navbar;
- [x] convertir Configuración en un botón flotante y siempre accesible;
- [x] rediseñar la navegación para celular;
- [x] implementar una barra móvil fija y compacta con Inicio, Curso, Explorar y GitHub;
- [x] convertir Curso y Explorar en paneles inferiores dinámicos para móvil;
- [x] integrar los accesos de Documentación dentro de Explorar en móvil;
- [x] evitar que la navegación móvil ocupe gran parte de la altura de la pantalla;
- [x] restaurar la navegación sticky original en escritorio y media pantalla;
- [x] mantener el rediseño de barra inferior limitado exclusivamente a vistas angostas y móviles;
- [x] sincronizar dinámicamente la barra con las secciones activadas o desactivadas desde Configuración;
- [x] restaurar la posición normal del logo TecNM en media pantalla y limitar su compensación óptica a vistas angostas;
- [x] ajustar el breakpoint de navegación móvil a 650 px para considerar el viewport real con barra lateral del navegador, zoom y escala del sistema;
- [x] mantener escritorio y media pantalla con la navegación horizontal sticky;
- [x] agregar títulos internos `Explorar` y `Documentación` dentro del panel móvil combinado;
- [x] mantener la navbar horizontal de media pantalla en una sola fila, compactando botones y espacios sin ocultar accesos;
- [x] corregir el panel móvil para que respete las opciones ocultas por Configuración y el perfil Minimal, incluyendo Documentación;
- [x] separar correctamente las dos vistas del Roadmap: `Ver visual` mantiene el diagrama interactivo y `Ver Markdown` renderiza `ROADMAP.md` dentro del visor de Documentación;

- [x] mantener compatibilidad con los perfiles de personalización existentes;
- [x] reforzar el diseño de tarjetas, botones, estados e indicadores;
- [x] mejorar la presentación de trabajos destacados;
- [x] revisar colores, sombras, espaciados y detalles visuales restantes;
- [x] realizar una revisión responsive completa;
- [x] realizar una revisión final de navegación y coherencia visual.

## Validación final

- [x] validar el refinamiento final en escritorio;
- [x] validar el refinamiento final en media pantalla;
- [x] validar el refinamiento final en ventana angosta;
- [x] validar el refinamiento final en celular.

La validación final confirmó el funcionamiento del hero, roadmap Canvas, navegación sticky, barra móvil, paneles dinámicos, Configuración flotante, perfiles de personalización y visor de Documentación.

## Pendiente

No quedan cambios estructurales o funcionales pendientes. Los cambios posteriores se consideran mantenimiento, correcciones puntuales o incorporación de nuevas actividades académicas.

## Resultado esperado

El Hub contará con una identidad visual reconocible, una navegación clara en escritorio y móvil y una experiencia de consulta consistente para archivos HTML, Markdown y otros trabajos compatibles.

Esta será la última fase de desarrollo estructural del Hub. Después de completarla, las modificaciones posteriores corresponderán únicamente al mantenimiento y a la incorporación de nuevas actividades de Programación Web.

---

# Estado actual del roadmap

**Completado: 16 / 16**

**Fase actual: Ninguna - Desarrollo estructural completado**

La Fase 16 fue validada y marcada como **Completada**. El roadmap estructural queda cerrado en **16 / 16 fases**. A partir de este punto, el Hub entra en etapa de mantenimiento y actualización de contenidos académicos.

---

# Mejoras posteriores al cierre

## Personalización visual avanzada

**Estado:** Implementada

Después del cierre estructural en **16 / 16 fases**, PW Hub recibió una ampliación de mantenimiento visual sin reabrir la Fase 16.

### Implementado

- [x] mantener el color de acento como ajuste independiente;
- [x] añadir cinco variantes de tema oscuro: PW Dark, Obsidiana, Azul profundo, Grafito y OLED;
- [x] añadir cuatro estilos visuales: Normal, Liquid Glass, Minimal y Neon Tech;
- [x] añadir tres niveles de movimiento: Ninguno, Sutil y Dinámico;
- [x] conservar el control independiente de efectos al pasar el cursor;
- [x] añadir previsualizaciones visuales dentro de Configuración;
- [x] migrar automáticamente preferencias guardadas desde `pw-hub-configuracion-v2` y `pw-hub-configuracion-v1`;
- [x] guardar la nueva configuración en `pw-hub-configuracion-v3`;
- [x] respetar `prefers-reduced-motion` incluso cuando se selecciona el modo Dinámico.
- [x] refinar Liquid Glass con bordes especulares, mayor blur, saturación y profundidad inspirados en el vidrio líquido de iOS;
- [x] añadir microanimaciones dinámicas adicionales para títulos, progreso actual y botones de documentación;
- [x] corregir la regresión visual causada por animaciones que interferían con `position`, `overflow` y `transform` estructurales;
- [x] aumentar blur y contraste de los menús Liquid Glass sin modificar su geometría;
- [x] ampliar el modo Dinámico únicamente con animaciones seguras sobre contenido, filtros, sombras y elementos internos;

Esta mejora pertenece a la etapa de **mantenimiento y evolución visual** posterior al cierre del roadmap estructural.

- [x] ajustar el modo Liquid Glass hacia un efecto más cercano al estilo iPhone;
- [x] aumentar el blur real en menús desplegables;
- [x] reducir ligeramente el blur del resto de superficies glass para ganar nitidez;

- [x] resolver el aislamiento de backdrop causado por el blur de la navbar padre;
- [x] hacer visible el blur real de los menús desplegables usando material más translúcido;
- [x] reducir el blur general de tarjetas y paneles para acercar Liquid Glass al acabado de iPhone;

- [x] equilibrar transparencia y blur del Liquid Glass para evitar superficies demasiado transparentes;
- [x] reducir ligeramente el blur de los menús sin perder desenfoque;
- [x] aumentar la solidez visual de tarjetas, paneles y Configuración;

- [x] consolidar `apariencia-avanzada.css` y retirar los parches acumulados V2-V7;
- [x] dejar una única implementación de Liquid Glass con valores claros de opacidad y blur;
- [x] conservar temas, estilos, animaciones y preferencias existentes sin cambiar la estructura del Hub;

- [x] restaurar el aspecto Liquid Glass V2 para tarjetas, paneles, Configuración y superficies generales;
- [x] limitar el nuevo refinamiento únicamente a los menús desplegables;
- [x] aplicar blur moderado y visible en Curso / Explorar / Documentación sin volverlos excesivamente transparentes;

- [x] restaurar el blur visual de la navbar Liquid Glass tal como se veía en V2;
- [x] conservar los bordes especulares tipo iPhone de V2;
- [x] mover técnicamente el blur de la navbar a una capa visual interna para permitir blur independiente en los dropdowns;
- [x] mantener el resto de tarjetas, paneles y Configuración exactamente con la apariencia V2;

- [x] añadir 15 variantes adicionales de tema oscuro;
- [x] alcanzar 20 temas oscuros configurables en total;
- [x] conservar el color de acento como ajuste independiente;
- [x] mantener compatibilidad con Normal, Liquid Glass, Minimal y Neon Tech;

### Mejoras posteriores al cierre: sincronización y resiliencia

- [x] sincronización automática de trabajos desde GitHub;
- [x] detección de nuevos HTML, PDF y Markdown dentro de U1-U5;
- [x] mantener `unidades.json` como catálogo base y capa de metadatos;
- [x] registrar Flexbox y CSS Grid en el fallback local de U3;
- [x] guardar el último catálogo detectado para funcionamiento sin conexión;
- [x] añadir Service Worker sin convertir el Hub en aplicación instalable;
- [x] cachear el Hub y los archivos académicos visitables para uso offline posterior.

El roadmap estructural permanece cerrado en **16/16**. Estas tareas corresponden únicamente a mantenimiento posterior al cierre.

- [x] detectar y retirar referencias obsoletas tras renombrar trabajos en GitHub;
- [x] actualizar U3 de `Ejercicio1CSS.html` a `Ejercicio0CSS.html`;
- [x] registrar `Ejercicio1.html` como **Receta Pan Francés con CSS**;
- [x] renovar la versión de caché offline para evitar conservar rutas antiguas.

- [x] fusionar tema oscuro y estilo visual en una sola sección compacta de **Apariencia**;
- [x] reemplazar las 20 tarjetas de tema por un selector compacto;
- [x] conservar las 20 variantes y los 4 materiales visuales sin perder combinaciones;
- [x] refinar Liquid Glass con borde especular direccional y mayor color bleed;
- [x] reducir ligeramente el blur general sin cambiar la geometría del Hub;
- [x] excluir `README_CAMBIOS.md` y `README_PRUEBA.md` mediante `.gitignore`;
- [x] renovar la caché offline a `pw-hub-offline-v3`.

El roadmap estructural continúa cerrado en **16/16**.

- [x] convertir todos los selects del Hub en combobox personalizados;
- [x] evitar los menús nativos largos y cuadrados del navegador;
- [x] hacer que el material determine qué paletas oscuras son compatibles;
- [x] añadir Frosted Glass, Acrílico, Mate y Titanio;
- [x] conservar Normal, Liquid Glass, Minimal y Neon Tech;
- [x] refinar Liquid Glass a V12 con refracción SVG progresiva en Chromium/Edge;
- [x] limitar la refracción costosa a navegación y superficies flotantes;
- [x] actualizar la caché offline a `pw-hub-offline-v4`.

El roadmap estructural permanece cerrado en **16/16**.

- [x] añadir una página offline explícita y coherente con la identidad visual del Hub;
- [x] mostrar la página offline solo cuando una navegación no esté disponible ni en red ni en caché;
- [x] mantener accesibles las páginas previamente cacheadas sin redirecciones innecesarias;
- [x] añadir un indicador discreto de estado únicamente al perder o recuperar conexión;
- [x] conservar el portafolio como sitio web normal, sin manifest ni instalación;
- [x] actualizar la caché del Service Worker a `pw-hub-offline-v5`.

El roadmap estructural permanece cerrado en **16/16**.

- [x] restaurar los paneles flotantes **HTML** y **CSS** únicamente en móvil (`<= 420px`);
- [x] aplicar la corrección mediante un override aislado del hero;
- [x] conservar sin cambios escritorio, tablet, branding, editor y navegación;
- [x] renovar la caché offline a `pw-hub-offline-v6`.

El roadmap estructural continúa cerrado en **16/16**.

- [x] corregir el `padding-top` directamente en `hero-codigo.css`;
- [x] eliminar el relleno superior de escritorio y móvil sin desplazar contenedores;
- [x] forzar una URL nueva `hero-codigo.css?v=18` para evitar CSS antiguo del Service Worker;
- [x] conservar el ajuste móvil de los paneles HTML y CSS;
- [x] renovar la caché offline a `pw-hub-offline-v10`.

El roadmap estructural permanece cerrado en **16/16**.

- [x] corregir el estado visible del movimiento sutil;
- [x] devolver `.hub-reveal.hub-visible` a `translateY(0)`;
- [x] eliminar el desplazamiento permanente de 18 px del encabezado;
- [x] conservar el efecto de entrada sutil para el resto de secciones;
- [x] invalidar específicamente la caché de `apariencia-avanzada.css`;
- [x] renovar la caché offline a `pw-hub-offline-v11`.

El roadmap estructural permanece cerrado en **16/16**.

### Alineación óptica del bloque institucional del hero

- [x] identificar `.hero-institucion` como el contenedor visual de TecNM + ITT;
- [x] desplazar únicamente ese contenedor 4 px hacia abajo;
- [x] mantener inmóviles el logo PW Hub, `.hero-branding` y el hero completo;
- [x] conservar la misma corrección en escritorio y celular;
- [x] renovar la caché offline a `pw-hub-offline-v12`.

El roadmap estructural permanece cerrado en **16/16**. Esta corrección es
mantenimiento posterior al cierre y no constituye una Fase 17.

### Catálogo automático global y reorganización de vistas

- [x] conservar `unidades.json` como catálogo base y fuente de metadatos;
- [x] compartir un único catálogo sincronizado durante cada carga;
- [x] evitar consultas duplicadas a GitHub para las distintas secciones;
- [x] alimentar Unidades, resumen, Todos los trabajos y Estadísticas con el mismo catálogo;
- [x] mantener compatibilidad con el respaldo local cuando no existe conexión;
- [x] trasladar `hub/offline.html` a `hub/vistas/offline.html`;
- [x] conservar `hub/index.html` como único HTML directamente en la raíz del Hub;
- [x] renovar la caché offline a `pw-hub-offline-v13`.

El roadmap estructural permanece cerrado en **16/16**. Este bloque corresponde
a mantenimiento posterior al cierre y no crea una Fase 17.
