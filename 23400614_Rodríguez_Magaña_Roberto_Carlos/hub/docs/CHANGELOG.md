# Changelog de PW Hub

Este documento registra la evolución de PW Hub por versiones.

A partir de **v1.0.0**, el proyecto deja de organizar su desarrollo futuro mediante fases. El roadmap histórico de 16 fases se conserva aquí como parte del registro de la primera versión estable.

> La palabra **fase** aparece en v1.0.0 únicamente porque así se documentó originalmente la construcción del Hub. Las versiones posteriores se registrarán como actualizaciones.

---

# v1.0.0 - Base estable

**Estado:** Publicada conceptualmente  
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
