# Changelog de PW Hub

Este documento registra la evolución de PW Hub por versiones.

A partir de **v1.0.0**, el proyecto deja de organizar su desarrollo futuro mediante fases. El roadmap histórico de 16 fases se conserva aquí como parte del registro de la primera versión estable.

> La palabra **fase** aparece en v1.0.0 únicamente porque así se documentó originalmente la construcción del Hub. Las versiones posteriores se registrarán como actualizaciones.

---

# v1.2.0 - Navegación y búsqueda global

**Estado:** Publicada · actual
**Fecha de publicación:** 2026-10-18
**Tipo:** Actualización funcional

## Implementado

- paleta global accesible con `Ctrl + K` o `Cmd + K` y botón Buscar en la navegación;
- búsqueda unificada de secciones, unidades, trabajos, eventos de Historial, versiones del Roadmap y Documentación;
- resultados con categoría visual para distinguir el tipo de destino;
- navegación directa a secciones y unidades, apertura de trabajos en el visor y acceso contextual a Historial, Roadmap y documentación Markdown;
- parámetros compartibles para búsquedas, filtros y vistas de Todos los trabajos, Historial y Roadmap;
- restauración automática de esos parámetros al abrir o regresar a una URL;
- apertura compartible de documentos y secciones de README mediante parámetros `doc` y `doc-seccion`;
- compatibilidad conservada con hashes y el router interno de v1.1.1;
- Service Worker actualizado a `pw-hub-offline-v32` en el primer candidato;
- acceso Buscar reducido a solo icono entre 651 y 1100 px para liberar espacio horizontal;
- botón de búsqueda flotante en móvil, alineado junto al acceso de Configuración y fuera de la barra inferior;
- ajuste dinámico de altura para los menús desplegables de navegación en escritorio y media pantalla, con scroll interno cuando no cabe todo el contenido;
- límites de ancho para evitar que los desplegables excedan el viewport;
- corrección dinámica del desplazamiento horizontal de los menús para impedir recortes por la izquierda o la derecha en media pantalla;
- Service Worker actualizado a `pw-hub-offline-v34` para distribuir el tercer candidato;
- alineación móvil del botón flotante Buscar con el botón de Configuración mediante medición de posición real;
- actualización de esa alineación ante scroll, resize y cambios del `visualViewport` para evitar desplazamientos al llegar al final de la página;
- Service Worker actualizado a `pw-hub-offline-v35` para distribuir el cuarto candidato.
- sexto candidato con estabilización de fondos y hover para eliminar las franjas persistentes en tarjetas, filtros y nodos repetidos;
- retirada de `backdrop-filter` solo en superficies de contenido propensas al fallo de composición, manteniendo los efectos en navegación, búsqueda, configuración y modales;
- perfil de rendimiento móvil con menos blur, animaciones y fondos complejos en pantallas pequeñas;
- Service Worker actualizado a `pw-hub-offline-v37` para distribuir el sexto candidato.
- séptimo candidato con posicionamiento móvil de Buscar completamente resuelto por CSS, sin mediciones durante el scroll;
- Buscar reutiliza la clase visual de Configuración para heredar tema, acento, material y detalles decorativos;
- recuperación del feedback visual de tarjetas en escritorio mediante transición de borde y resplandor de acento, sin traslaciones ni promoción por `transform`;
- Service Worker actualizado a `pw-hub-offline-v38` para distribuir el séptimo candidato.
- octavo candidato con Buscar apilado sobre Configuración en móvil, centrado y coloreado por el acento actual;
- Buscar conserva la misma clase visual de Configuración y vuelve a permitir sus reglas de material en móvil;
- se retira el resplandor `box-shadow` agregado en C7 y se conserva una microinteracción segura basada solo en transición del borde;
- Service Worker actualizado a `pw-hub-offline-v39` para distribuir el octavo candidato.
- noveno candidato con corrección de especificidad: los materiales alternativos ya no pueden reactivar blur/sombras sobre las superficies estabilizadas;
- retirada del `transition` global del parche visual para no sustituir las animaciones Sutil/Dinámico;
- Buscar móvil usa también `nav-configuracion`, la misma estructura interna de icono y exactamente el mismo eje X/tamaño que Configuración;
- Service Worker actualizado a `pw-hub-offline-v40` para distribuir el noveno candidato.
- décimo candidato con `microinteracciones.css` como capa visual independiente y segura;
- iluminación de borde ligada a `--acento-rgb` para Normal, Liquid Glass, Frosted Glass, Acrílico, Minimal, Neon Tech, Mate y Titanio, compatible con todas sus variantes de tema;
- microanimaciones de etiquetas, números, iconos, filtros, botones, favoritos y controles del Roadmap sin transformar superficies grandes;
- modo Dinámico ampliado con pulsos discretos en elementos pequeños solo fuera de móvil;
- perfil móvil conservado sin animaciones continuas para no perder la mejora de fluidez;
- Service Worker actualizado a `pw-hub-offline-v41` para distribuir el décimo candidato.
- undécimo candidato con corrección final del pie de Configuración: `Restablecer` permanece en una sola línea y conserva ancho automático;
- bloqueo compartido del scroll de fondo mientras Configuración o la paleta de búsqueda están abiertas, manteniendo únicamente el desplazamiento interno de cada capa;
- Service Worker actualizado a `pw-hub-offline-v42` para distribuir el undécimo candidato.
- duodécimo candidato con búsqueda global sensible a los interruptores de Contenido visible;
- secciones, unidades, Historial, Roadmap y Documentación desaparecen de la paleta cuando su vista está desactivada;
- los trabajos siguen disponibles si está activa al menos una de sus dos superficies: Unidades o Todos los trabajos;
- actualización inmediata de resultados cuando un interruptor cambia mientras la paleta está abierta;
- búsqueda global sensible a los interruptores de Contenido visible, con actualización inmediata de resultados;
- Service Worker final actualizado a `pw-hub-offline-v45` para publicar v1.2.0.

## Validación y publicación

La versión fue validada en escritorio y teléfono antes de publicarse. Se comprobaron la paleta global, los accesos responsive, los menús contenidos dentro del viewport, los estados compartibles por URL, el bloqueo del scroll de fondo en capas modales, la estabilidad visual de materiales alternativos, las microinteracciones, el perfil móvil de rendimiento y la coherencia de resultados con los interruptores de Contenido visible.

C12 cerró la validación funcional: ocultar o mostrar secciones desde Configuración actualiza la paleta sin modificar el catálogo académico base. Con esta validación, v1.2.0 pasa a estado publicada y se convierte en la versión actual del Hub.

---

# v1.1.1 - Reestructuración de navegación y vistas

**Estado:** Publicada
**Fecha de publicación:** 2026-10-18
**Tipo:** Parche de experiencia de uso y estabilidad

Este parche reorganiza el Hub para reducir el desplazamiento vertical sin convertirlo en varias páginas HTML independientes y corrige el arranque detectado durante la validación del candidato.

## Implementado

- hero institucional y navegación superior visibles como cabecera común;
- `Inicio` dedicado al Resumen académico;
- Resumen académico convertido en bloque fijo de Inicio y retirado de las opciones que pueden ocultarse;
- `Curso` con Progreso general y U1-U5 visibles dentro de la misma vista;
- `Explorar` con Actividad, Todos los trabajos, Estadísticas, Historial y Roadmap como vistas individuales;
- `Documentación` como vista propia;
- compatibilidad con hashes y botones Atrás / Adelante;
- carga directa de `vistas-internas.js` y `vistas-internas.css` desde `index.html`, sin depender del sincronizador;
- eliminación de una segunda sincronización redundante durante el arranque de `hub.js`;
- timeout independiente para la consulta del árbol de GitHub;
- la consulta del árbol de GitHub deja de ser retenida por el Service Worker;
- Service Worker actualizado a `pw-hub-offline-v30` para distribuir el cierre publicado.

## Validación

Durante las pruebas del candidato se detectó que el arranque podía quedar esperando indefinidamente o mostrar una vista incorrecta cuando navegación, personalización y sincronización competían durante la inicialización. La corrección final desacopló el router de `sincronizacion.js`, eliminó la sincronización duplicada de `hub.js` y se volvió a probar el proyecto mediante un origen local limpio.

Con esta publicación, **v1.1.1 sustituye a v1.1.0 como versión actual**, mientras v1.1.0 permanece como actualización publicada anterior.

---

# v1.1.0 - Sincronización y novedades

**Estado:** Publicada
**Fecha de publicación:** 2026-10-17
**Tipo:** Actualización funcional

La primera actualización posterior a la base estable hace visible el estado de la sincronización automática que ya utiliza PW Hub y añade señales para reconocer contenido reciente sin convertir la carga del portafolio en un proceso manual.

## Implementado

- indicador discreto con estados `Sincronizado`, `Usando caché local`, `Sin conexión` y transición de sincronización;
- tiempo relativo desde la última sincronización conocida;
- detección local de trabajos nuevos comparando el árbol actual con las rutas conocidas;
- insignia `NUEVO` persistente hasta abrir el trabajo o su vista previa;
- fecha real de última actualización consultada desde el historial de commits de GitHub cuando está disponible;
- caché local de fechas durante 24 horas para reducir solicitudes repetidas;
- reutilización del snapshot existente cuando la API no puede consultarse;
- nueva capa visual `css/novedades.css` y módulo `js/novedades.js`;
- Service Worker actualizado para incluir los recursos de v1.1.0.

## Validación

La actualización fue validada en servidor local antes de su publicación. Se comprobó el indicador de sincronización, la fecha de actualización y el ciclo de la insignia `NUEVO`. Con esta publicación, **v1.1.0 sustituye a v1.0.0 como versión actual**, mientras v1.0.0 permanece como base estable histórica.

---

# v1.0.0 - Base estable

**Estado:** Publicada
**Fecha de consolidación:** 2026-10-17
**Tipo:** Versión base estable

Esta entrada consolida todo el desarrollo realizado desde la estructura inicial hasta el estado actual del Hub. No implica por sí sola la creación de un tag de Git: define el punto de partida del nuevo esquema de versiones.

## Resultado general

PW Hub queda establecido como un portafolio académico web con:

- identidad visual propia;
- navegación responsive de escritorio y móvil;
- unidades y trabajos cargados dinámicamente;
- explorador general de actividades;
- favoritos y destacados;
- actividad reciente;
- estadísticas académicas;
- historial interactivo;
- roadmap visual;
- visor interno de Markdown;
- renderizado Markdown en tema oscuro dentro del visor completo;
- visor completo de trabajos;
- personalización avanzada;
- sincronización automática con GitHub;
- funcionamiento offline después de una visita con conexión;
- documentación técnica y académica integrada.

---

## Construcción histórica de v1.0.0

### Fase histórica 1 - Estructura inicial

**Estado:** Completada

Se creó una página central para reunir los trabajos realizados durante Programación Web.

### Fase histórica 2 - Identidad visual

**Estado:** Completada

Se definió una identidad visual propia para el portafolio académico.

### Fase histórica 3 - Modelo académico

**Estado:** Completada

Se representaron unidades, estado del curso y organización académica.

### Fase histórica 4 - Fuente de datos central

**Estado:** Completada

Se centralizaron unidades y trabajos mediante `data/unidades.json`.

### Fase histórica 5 - Vistas previas

**Estado:** Completada

Se incorporó la exploración de trabajos directamente desde el Hub.

### Fase histórica 6 - Documentación dinámica

**Estado:** Completada

Se integraron README, Historial y Roadmap dentro de la interfaz.

### Fase histórica 7 - Roadmap visual

**Estado:** Completada

Se convirtió `ROADMAP.md` en una representación visual e interactiva.

### Fase histórica 8 - Historial interactivo

**Estado:** Completada

Se convirtió `HISTORIAL.md` en una memoria navegable de la evolución académica y técnica.

### Fase histórica 9 - Buscador y explorador de trabajos

**Estado:** Completada

Se añadieron búsqueda, filtros, ordenamiento y vistas previas para localizar actividades.

### Fase histórica 10 - Navegación avanzada

**Estado:** Completada

Se implementaron:

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

### Fase histórica 11 - Favoritos y destacados

**Estado:** Completada

Se implementaron:

- favoritos con `localStorage`;
- persistencia;
- filtros y contadores;
- soporte para destacados desde `unidades.json`.

### Fase histórica 12 - Actividad reciente

**Estado:** Completada

Se creó la vista de actividad reciente utilizando `docs/HISTORIAL.md` como fuente para evitar duplicar información.

### Fase histórica 13 - Estadísticas académicas

**Estado:** Completada

Se añadieron cálculos automáticos de:

- trabajos registrados;
- unidades completadas;
- eventos históricos;
- porcentaje académico;
- trabajos por unidad;
- tipos de trabajo;
- eventos por unidad;
- tipos de evento.

### Fase histórica 14 - Preparación para publicación

**Estado:** Completada históricamente

Se probaron minificación, ausencia de source maps, ofuscación opcional y una copia separada de producción.

Posteriormente se simplificó la arquitectura: GitHub Pages pasó a utilizar directamente los archivos versionados del repositorio y `publicacion/` dejó de formar parte del flujo actual.

Esta etapa se conserva porque representa una decisión técnica real, aunque su sistema de build ya no sea necesario.

### Fase histórica 15 - Cierre técnico y personalización final

**Estado:** Completada

Se incorporaron:

- panel de Configuración;
- perfil Minimal predeterminado;
- perfiles Completo y Académico;
- selección de secciones visibles;
- navbar sincronizada con secciones activas;
- desaparición dinámica de submenús sin contenido;
- colores de acento;
- densidad visual;
- iconografía SVG;
- animaciones suaves;
- control de animaciones y efectos;
- respeto por `prefers-reduced-motion`;
- revisión responsive;
- documentación del funcionamiento;
- integración con el repositorio académico.

### Fase histórica 16 - Identidad visual y experiencia de contenidos

**Estado:** Completada

La última fase histórica reforzó la identidad y la experiencia general del Hub.

#### Branding

- [x] familia de logo propia de PW Hub;
- [x] logo horizontal y compacto;
- [x] isotipo principal y variantes;
- [x] favicon en 16, 32, 192 y 512 px;
- [x] integración del favicon en el Hub y visor de trabajos;
- [x] integración visual de PW Hub, TecNM e Instituto Tecnológico de Tepic.

#### Visor y documentos

- [x] reorganización y formateo del código;
- [x] traslado del visor a `vistas/trabajo.html`;
- [x] renderizado interno de Markdown;
- [x] integración de `Perfil.md`, `Comandos_Git.md` y trabajos Markdown;
- [x] modos **Diseño** y **Código**;
- [x] estilos propios para títulos, listas, tablas, código, citas y enlaces;
- [x] apertura de trabajos en la misma pestaña;
- [x] regreso al Hub mediante historial del navegador cuando es posible.

#### Roadmap visual histórico

- [x] mapa visual jerárquico;
- [x] ramas y subramas;
- [x] conexiones mediante Canvas;
- [x] corrección de ramas situadas por encima del centro del nodo principal;
- [x] prevención de crecimiento horizontal acumulativo del Canvas;
- [x] limitación del ancho visual para evitar espacios excesivos.

#### Hero y responsive

- [x] hero principal generado mediante HTML y CSS;
- [x] reducción y equilibrio de la altura del banner;
- [x] branding compacto en vistas estrechas;
- [x] corrección del contenedor TecNM + ITT;
- [x] compensación del margen transparente del PNG oficial de TecNM;
- [x] protección frente a overflow horizontal accidental.

#### Navegación

- [x] Configuración fuera de la navbar y disponible como control flotante;
- [x] barra móvil fija y compacta;
- [x] Inicio, Curso, Explorar y GitHub en navegación móvil;
- [x] Curso y Explorar como paneles inferiores dinámicos;
- [x] Documentación integrada dentro de Explorar en móvil;
- [x] navegación sticky restaurada en escritorio y media pantalla;
- [x] rediseño móvil limitado a vistas angostas;
- [x] sincronización con las secciones activadas o desactivadas;
- [x] breakpoint móvil ajustado a 650 px;
- [x] navbar horizontal compacta en media pantalla;
- [x] respeto de perfiles y secciones ocultas desde Configuración.

#### Refinamiento final

- [x] compatibilidad con los perfiles existentes;
- [x] refuerzo de tarjetas, botones, estados e indicadores;
- [x] mejora de trabajos destacados;
- [x] revisión de colores, sombras y espaciados;
- [x] validación en escritorio;
- [x] validación en media pantalla;
- [x] validación en ventana angosta;
- [x] validación en celular;
- [x] safe-area móvil;
- [x] foco visible;
- [x] respeto por movimiento reducido.

---

## Mantenimiento absorbido en v1.0.0

Después del cierre histórico de las 16 fases se realizaron correcciones y ampliaciones antes de fijar la base estable v1.0.0. Todo este trabajo forma parte de la versión inicial consolidada.

### Personalización visual avanzada

Se mantuvo el color de acento como ajuste independiente y se amplió la personalización con:

- temas oscuros adicionales;
- materiales visuales;
- niveles de movimiento Ninguno, Sutil y Dinámico;
- control independiente de efectos hover;
- previsualizaciones dentro de Configuración;
- migración de preferencias anteriores;
- compatibilidad con `prefers-reduced-motion`.

### Evolución de Liquid Glass

La apariencia Liquid Glass pasó por varias iteraciones internas hasta consolidar una implementación estable:

- V2: bordes especulares, blur, saturación y profundidad;
- V4: reparación de regresiones causadas por animaciones estructurales;
- V5: ajuste de blur entre menús y superficies;
- V6: separación del backdrop de navbar y dropdowns;
- V7: mayor solidez visual;
- V8: consolidación de reglas acumuladas;
- V9: restauración del acabado V2 en superficies generales;
- V10: restauración real del blur de navbar mediante capa interna;
- V11: borde direccional, color bleed y equilibrio de legibilidad;
- V12: refracción SVG progresiva en superficies compatibles.

### Paletas, materiales y combobox

- [x] 20 variantes de tema oscuro;
- [x] 8 materiales: Normal, Liquid Glass, Frosted Glass, Acrílico, Minimal, Neon Tech, Mate y Titanio;
- [x] relación Material → Paleta;
- [x] combobox visuales propios;
- [x] menús compactos con desplazamiento interno;
- [x] compatibilidad con configuraciones guardadas anteriormente.

### Sincronización automática con GitHub

- [x] detección de trabajos desde el árbol público del repositorio;
- [x] detección de HTML, PDF y Markdown compatibles dentro de U1-U5;
- [x] `unidades.json` conservado como catálogo base y capa de metadatos;
- [x] snapshot local como respaldo;
- [x] protección frente a renombres y rutas obsoletas;
- [x] retiro de tarjetas que producirían 404 después de una sincronización;
- [x] reutilización de una sola sincronización efectiva por carga;
- [x] catálogo compartido entre Unidades, resumen, Todos los trabajos y Estadísticas.

### Modo sin conexión

- [x] Service Worker para shell y recursos académicos;
- [x] caché de archivos detectados;
- [x] caché del catálogo sincronizado;
- [x] página offline con identidad de PW Hub;
- [x] indicador discreto al perder o recuperar conexión;
- [x] mantenimiento del sitio como web convencional, sin instalación PWA;
- [x] evolución de la caché hasta `pw-hub-offline-v13` antes del nuevo esquema de versiones.

### Ajustes finales del hero

- [x] restauración de paneles flotantes HTML y CSS en móvil `<= 420px`;
- [x] eliminación del espacio superior no deseado del hero;
- [x] corrección del `translateY(18px)` persistente del modo Sutil;
- [x] desplazamiento óptico de `.hero-institucion` 4 px hacia abajo;
- [x] desplazamiento óptico del logo PW Hub 7 px hacia abajo únicamente en escritorio (`min-width: 651px`);
- [x] conservación de la geometría general del hero y de la navegación.

### Markdown oscuro unificado

- [x] sustituir el fondo claro del modo Diseño para archivos `.md` en el visor completo;
- [x] aplicar tema oscuro al visor incrustado de Documentación;
- [x] aplicar tema oscuro a las miniaturas Markdown de las unidades;
- [x] aplicar tema oscuro al modal de Vista previa del explorador;
- [x] utilizar colores coherentes para títulos, enlaces, tablas, citas y código;
- [x] conservar intacta la presentación original de HTML y PDF;
- [x] mantener estilos compartidos del Hub principal en `css/markdown-oscuro.css`;
- [x] renovar la caché offline a `pw-hub-offline-v18`.

### Organización final de vistas

- [x] `hub/index.html` queda como único HTML directamente en la raíz de `hub/`;
- [x] `trabajo.html` permanece en `hub/vistas/`;
- [x] `offline.html` fue trasladado a `hub/vistas/offline.html`;
- [x] rutas del Service Worker actualizadas para la nueva ubicación.

---

## Estado de v1.0.0

**Base estable consolidada.**

No quedan fases abiertas. Desde esta versión:

- el trabajo académico normal de U1-U5 se registra como contenido;
- las correcciones pequeñas pueden utilizar versiones `v1.x.y`;
- las mejoras funcionales planeadas se registran en `ROADMAP.md` como versiones `v1.x.0`;
- el historial detallado de eventos académicos y técnicos continúa en `HISTORIAL.md`.

---

## Hotfix visual sobre v1.1.1

### Franja inferior en tarjetas y filtros

- [x] corregir el artefacto visual observado en Roadmap, filtros y paneles translúcidos de GitHub Pages/Edge;
- [x] aislar el pintado de las superficies afectadas para evitar filtraciones visuales en el borde inferior;
- [x] añadir `css/parche-franja-visual.css` como ajuste puntual sin modificar la estructura del Hub;
- [x] renovar la caché offline a `pw-hub-offline-v31`.
