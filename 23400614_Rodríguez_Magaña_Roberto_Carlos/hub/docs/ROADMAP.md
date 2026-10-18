# Roadmap de actualizaciones de PW Hub

## Estado general

**Versión publicada actual: v1.1.0 - Sincronización y novedades**

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

**Estado:** Publicada · actual

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

# v1.2.0 - Navegación y búsqueda global

**Estado:** Planeada

## Objetivo

Convertir la navegación y la búsqueda en un sistema rápido y compartible para todo el Hub.

## Planeado

- [ ] abrir una paleta de comandos con `Ctrl + K` o `Cmd + K`;
- [ ] buscar secciones, unidades y trabajos desde la paleta;
- [ ] extender la búsqueda a Historial, Roadmap y Documentación;
- [ ] diferenciar visualmente el tipo de cada resultado;
- [ ] reflejar filtros, búsquedas y selección de unidad en la URL;
- [ ] restaurar automáticamente el estado al abrir un enlace compartido;
- [ ] conservar compatibilidad con la navegación mediante hashes.

## Resultado esperado

Una sola experiencia permitirá localizar contenido, ejecutar accesos rápidos y compartir vistas concretas del portafolio.

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
