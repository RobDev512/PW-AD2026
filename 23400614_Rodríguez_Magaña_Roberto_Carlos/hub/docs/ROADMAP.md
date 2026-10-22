# Roadmap de actualizaciones de PW Hub

## Estado general

**Versión publicada actual: v1.2.0 - Navegación y búsqueda global**

**Parche en validación: v1.2.1 - Proyectos por carpetas y visor de recursos**

**Candidato actual: C6** - usa zoom y paneo nativos de mxGraph para mantener nítido el diagrama Draw.io y corrige la cabecera del explorador en ventanas medias al 100 % de zoom.

PW Hub terminó su etapa de construcción inicial. A partir de este punto el proyecto ya no utiliza fases: cualquier mejora futura se registra como una **actualización versionada**.

El historial completo de la construcción original y de los ajustes incorporados antes de congelar la base estable se conserva en [`CHANGELOG.md`](CHANGELOG.md), dentro de la entrada **v1.0.0**.

Este roadmap muestra la versión estable actual y la evolución técnica futura del Hub. El avance normal de U1 a U5 sigue perteneciendo al contenido académico de Programación Web y no crea nuevas versiones por sí solo.

El proyecto utiliza un versionado simple inspirado en SemVer:

- `v1.0.0`: base estable inicial;
- `v1.1.0`: primera actualización publicada;
- `v1.2.0` a `v1.9.0`: actualizaciones previstas de la primera generación estable;
- `v2.0.0`: siguiente salto mayor del Hub;
- `vX.Y.Z`: el último número queda reservado para correcciones puntuales.

Por convención de PW Hub, una serie principal llega como máximo a `.9`; después continúa con la siguiente versión mayor. No existe una fecha obligatoria para estas actualizaciones. Pueden implementarse, reordenarse, combinarse o descartarse según el tiempo disponible y las necesidades reales del portafolio.

---


# v1.0.0 - Base estable

**Estado:** Publicada

## Objetivo

Consolidar en una primera versión estable todo el desarrollo técnico, visual y documental construido antes de adoptar el roadmap por versiones.

## Implementado

- [x] identidad visual propia de PW Hub;
- [x] navegación responsive para escritorio, media pantalla y móvil;
- [x] unidades, trabajos, búsqueda, filtros, favoritos y estadísticas;
- [x] historial y documentación Markdown integrados;
- [x] tema oscuro consistente para Markdown en visor completo, Documentación, miniaturas y vistas previas;
- [x] personalización visual con materiales, paletas y movimiento;
- [x] sincronización automática de trabajos con GitHub;
- [x] funcionamiento offline con Service Worker y página de contingencia;
- [x] catálogo compartido por Unidades, resumen, Todos los trabajos y Estadísticas;
- [x] estructura estable con `hub/index.html` como HTML principal del Hub.

## Notas

El detalle completo de la construcción original, las 16 fases históricas y los mantenimientos incorporados antes de esta versión se conserva en [`CHANGELOG.md`](CHANGELOG.md).

---

# v1.1.0 - Sincronización y novedades

**Estado:** Publicada

## Objetivo

Hacer más clara la relación entre PW Hub, GitHub y los cambios recientes del portafolio.

## Implementado

- [x] mostrar un indicador discreto de sincronización;
- [x] distinguir `Sincronizado`, `Usando caché local` y `Sin conexión`;
- [x] mostrar de forma opcional el tiempo desde la última sincronización;
- [x] marcar con `NUEVO` los trabajos aparecidos desde la última visita;
- [x] retirar la marca después de que el trabajo haya sido visto;
- [x] mostrar la fecha real de última actualización de cada trabajo cuando GitHub la proporcione;
- [x] cachear fechas y estados para evitar consultas innecesarias a la API.

## Validación

La actualización fue probada en servidor local. Se verificaron el indicador de sincronización, la fecha de actualización y la insignia `NUEVO`, incluyendo su retirada al revisar el trabajo.

## Resultado esperado

El usuario podrá identificar rápidamente qué cambió, cuándo se actualizó y de dónde proviene el catálogo visible.

---

# v1.1.1 - Reestructuración de navegación y vistas

**Estado:** Publicada

## Objetivo

Reducir el desplazamiento vertical de `hub/index.html` y hacer que la barra superior funcione como selector de contextos, sin adelantar las funciones planeadas para v1.2.0.

## Implementado

- [x] conservar hero y navegación en todas las vistas;
- [x] reservar Inicio para el Resumen académico;
- [x] mantener el Resumen académico siempre disponible;
- [x] agrupar Progreso general y U1-U5 dentro de Curso;
- [x] mostrar cada herramienta de Explorar de forma independiente;
- [x] conservar Documentación como vista propia;
- [x] mantener hashes y Atrás / Adelante;
- [x] desacoplar el router de `sincronizacion.js`;
- [x] evitar la segunda sincronización redundante de `hub.js`;
- [x] añadir un límite de espera independiente a la consulta de GitHub.

## Validación

La versión fue probada en servidor local después de reconstruir el arranque desde el estado real del proyecto. Se verificó la carga estable del Hub, el Resumen académico fijo en Inicio, Curso con U1-U5 agrupadas, las vistas individuales de Explorar y la separación entre navegación y sincronización.

## Resultado

El Hub conserva su identidad visual, reduce recorridos verticales innecesarios y mantiene un arranque estable incluso cuando GitHub tarda o no responde.

---

# v1.2.0 - Navegación y búsqueda global

**Estado:** Publicada · actual

## Objetivo

Convertir la navegación y la búsqueda en un sistema rápido y compartible para todo el Hub.

## Implementado

- [x] abrir una paleta de comandos con `Ctrl + K` o `Cmd + K`;
- [x] buscar secciones, unidades y trabajos desde la paleta;
- [x] extender la búsqueda a Historial, Roadmap y Documentación;
- [x] diferenciar visualmente el tipo de cada resultado;
- [x] reflejar filtros, búsquedas y selección de unidad en la URL;
- [x] restaurar automáticamente el estado al abrir un enlace compartido;
- [x] conservar compatibilidad con la navegación mediante hashes.
- [x] respetar los interruptores de Contenido visible al construir los resultados de la búsqueda global.

## Validación

- [x] validar C9 en Normal y en los siete materiales alternativos, confirmando ausencia de franjas y recuperación del hover/animaciones;
- [x] validar Buscar móvil con la misma geometría, color de acento y material que Configuración;
- [x] validar C10 con iluminación de bordes en todos los materiales/temas sin reaparición de franjas;
- [x] validar las nuevas microinteracciones en modos Sutil y Dinámico, además del perfil ligero de móvil;
- [x] validar C11 con `Restablecer` en una sola línea en móvil y escritorio;
- [x] validar que Configuración y Búsqueda bloqueen el scroll de fondo sin impedir su desplazamiento interno;
- [x] validar C12 ocultando y mostrando secciones desde Configuración y comprobando que la paleta se actualice en tiempo real;

C9 quedó validado como base estable, C10 confirmó que las microinteracciones y bordes de acento pueden ampliarse sin reintroducir franjas ni degradar el perfil móvil, C11 cerró correctamente las capas modales y C12 confirmó la coherencia entre Configuración y Búsqueda. La paleta ofrece únicamente contenido habilitado por los interruptores visibles sin alterar el catálogo académico.

## Resultado

PW Hub dispone de una experiencia unificada para localizar contenido, ejecutar accesos rápidos y compartir vistas concretas del portafolio, con comportamiento consistente en escritorio y móvil.

---

# v1.2.1 - Proyectos por carpetas y visor de recursos

**Estado:** En validación · Candidato 5

## Objetivo

Adaptar el Hub a la organización real de las actividades de U2 y U3, que ahora pueden vivir dentro de carpetas con página principal, imágenes, CSS y archivos de diseño.

## En validación

- [x] reconocer como proyecto una actividad de U2/U3 cuya ruta principal está dentro de una carpeta;
- [x] mantener una sola tarjeta académica por actividad;
- [x] explorar los archivos internos desde la vista previa;
- [x] separar Diseño y Código HTML;
- [x] visualizar imágenes y consultar CSS/otros archivos textuales;
- [x] interpretar el XML de archivos Draw.io mediante el visor oficial de diagrams.net;
- [x] ofrecer modos separados Diagrama, PNG y XML cuando existe una exportación visual asociada;
- [x] permitir consultar el XML original de Draw.io;
- [x] mover y ampliar/reducir el diagrama dentro de un lienzo de tamaño estable;
- [x] ofrecer pantalla completa propia sin apilar lightboxes externos;
- [x] mantener el explorador lado a lado en anchos intermedios de escritorio;
- [x] mantener scroll independiente en la lista de recursos y el panel de contenido;
- [x] descubrir recursos bajo demanda y reutilizar un caché temporal;
- [x] conservar un inventario de respaldo para los proyectos actuales;
- [ ] validar el candidato en PC y móvil;
- [ ] validar materiales alternativos sin reaparición de franjas;
- [ ] publicar el parche tras la validación final.

## Límite del parche

Este visor no sustituye la evolución planeada de v1.3.0. La siguiente versión menor conserva el objetivo de detectar proyectos de forma más inteligente, reconocer puntos de entrada y metadatos y conectarlos de manera más profunda con GitHub.

---

# v1.3.0 - Proyectos inteligentes y GitHub

**Estado:** Planeada

## Objetivo

Hacer que la sincronización entienda mejor proyectos formados por varios archivos y conectarlos directamente con su fuente en GitHub.

## Planeado

- [ ] añadir la acción `Ver en GitHub` a los trabajos compatibles;
- [ ] generar enlaces a archivos o carpetas reales del repositorio;
- [ ] reconocer `index.html` como posible punto de entrada de un proyecto;
- [ ] evitar registrar CSS, JS, imágenes y recursos internos como trabajos separados;
- [ ] conservar compatibilidad con HTML, PDF y Markdown individuales;
- [ ] definir reglas para proyectos anidados;
- [ ] permitir un archivo opcional como `hub.json` dentro de un proyecto;
- [ ] aceptar nombre, descripción, tecnologías y destacado desde esos metadatos;
- [ ] conservar `unidades.json` como catálogo base y fallback.

## Resultado esperado

Subir una carpeta de proyecto podrá bastar para que PW Hub la detecte, la agrupe y la presente correctamente sin mantenimiento repetitivo.

---

# v1.4.0 - Ciclo de actualización del Hub

**Estado:** Planeada

## Objetivo

Informar de forma clara cuando exista una versión nueva del propio PW Hub.

## Planeado

- [ ] detectar un Service Worker actualizado;
- [ ] mostrar un aviso discreto de actualización disponible;
- [ ] permitir actualizar de forma controlada;
- [ ] evitar recargas inesperadas durante el uso del Hub;
- [ ] mostrar la versión actual cuando resulte útil para diagnóstico.

## Resultado esperado

Las mejoras publicadas podrán llegar al navegador sin depender de que el usuario borre caché o adivine cuándo recargar.

---

# v1.5.0 - Presentación y exportación

**Estado:** Planeada

## Objetivo

Preparar PW Hub para exposiciones, revisiones académicas e impresión sin crear una segunda versión del sitio.

## Planeado

- [ ] añadir un modo presentación que oculte controles secundarios;
- [ ] priorizar hero, progreso, resumen y trabajos destacados;
- [ ] simplificar temporalmente la navegación durante una exposición;
- [ ] restaurar la vista normal al salir del modo presentación;
- [ ] crear estilos `@media print` específicos;
- [ ] incluir identidad, unidades, trabajos y estadísticas en impresión;
- [ ] conservar enlaces útiles al exportar a PDF desde el navegador.

## Resultado esperado

El mismo Hub podrá utilizarse tanto como portafolio interactivo como evidencia presentable o imprimible.

---

# v1.6.0 - Diagnóstico y actividad del repositorio

**Estado:** Planeada

## Objetivo

Añadir herramientas técnicas para comprender la salud del Hub y los cambios automáticos detectados en el repositorio.

## Planeado

- [ ] comprobar rutas de trabajos y detectar referencias 404;
- [ ] mostrar estado del Service Worker y cachés;
- [ ] mostrar última sincronización con GitHub;
- [ ] indicar versión actual del Hub;
- [ ] crear un bloque separado de actividad automática del repositorio;
- [ ] registrar apariciones, renombres o retiros detectados por sincronización;
- [ ] evitar mezclar esos eventos con el historial académico de `HISTORIAL.md`;
- [ ] reutilizar snapshots locales cuando sea posible.

## Resultado esperado

Los problemas técnicos y los cambios detectados automáticamente podrán revisarse sin contaminar el historial editorial del curso.

---

# v1.7.0 - Accesibilidad y teclado

**Estado:** Visión futura

## Objetivo

Revisar de forma integral la accesibilidad del Hub y reforzar su uso sin mouse.

## Planeado

- [ ] revisar orden y visibilidad del foco;
- [ ] completar navegación por teclado en controles y paneles;
- [ ] usar `aria-live` en resultados dinámicos relevantes;
- [ ] revisar contraste de materiales y paletas;
- [ ] validar movimiento reducido;
- [ ] asegurar que la paleta de comandos y la búsqueda global sean utilizables completamente con teclado.

## Resultado esperado

La interfaz será más consistente para usuarios de teclado y tecnologías de asistencia.

---

# v1.8.0 - Configuración portátil

**Estado:** Visión futura

## Objetivo

Permitir respaldar y restaurar las preferencias visuales del Hub.

## Planeado

- [ ] exportar configuración a JSON;
- [ ] importar una configuración compatible;
- [ ] validar versión y valores antes de aplicarlos;
- [ ] mantener las preferencias locales como comportamiento predeterminado;
- [ ] permitir trasladar una configuración entre navegadores o equipos.

## Resultado esperado

La personalización dejará de depender exclusivamente del almacenamiento de un solo navegador.

---

# v1.9.0 - Acerca de PW Hub

**Estado:** Visión futura

## Objetivo

Crear una ficha técnica compacta que documente identidad, arquitectura, tecnologías y evolución del proyecto.

## Planeado

- [ ] mostrar la versión actual;
- [ ] resumir tecnologías utilizadas;
- [ ] enlazar Changelog y Roadmap;
- [ ] incluir créditos técnicos del proyecto;
- [ ] ofrecer acceso desde la paleta `Ctrl + K` si ya existe;
- [ ] mantener esta información separada del contenido académico de U1-U5.

## Resultado esperado

PW Hub contará con una identidad técnica propia y una referencia clara de su versión antes del siguiente salto mayor.

---

# v2.0.0 - PW Hub instalable

**Estado:** Visión futura

## Objetivo

Convertir opcionalmente la base web y offline existente en una PWA instalable, tratándolo como un salto mayor del proyecto.

## Planeado

- [ ] crear `manifest.webmanifest`;
- [ ] reutilizar la familia de iconos existente;
- [ ] definir nombre, colores y comportamiento de apertura;
- [ ] revisar la estrategia offline antes de habilitar instalación;
- [ ] integrar correctamente el ciclo de actualización del Service Worker;
- [ ] validar instalación en escritorio y móvil;
- [ ] conservar el funcionamiento normal desde navegador sin exigir instalación.

## Resultado esperado

PW Hub podrá instalarse opcionalmente como aplicación sin dejar de funcionar como un portafolio web convencional.
