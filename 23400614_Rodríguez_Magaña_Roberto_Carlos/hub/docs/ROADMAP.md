# Roadmap del Portafolio de Programación Web

## Estado general

**15 de 16 fases completadas.**

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

**Estado:** Pendiente

## Objetivo

Realizar una última etapa de refinamiento visual y funcional del Hub, reforzando su identidad propia y mejorando la forma en que se presentan los contenidos académicos.

## Pendiente

- diseñar un logo propio para el Hub;
- crear un favicon basado en la nueva identidad visual;
- incorporar un banner o hero principal;
- mejorar la presentación visual del encabezado;
- reforzar el diseño de tarjetas, botones, estados e indicadores;
- revisar colores, sombras, espaciados y detalles visuales;
- mantener compatibilidad con los perfiles de personalización existentes;
- mejorar la presentación de trabajos destacados;
- renderizar correctamente los archivos Markdown dentro del Hub;
- evitar que los archivos `.md` de la Unidad 1 se abran como texto plano;
- integrar `Perfil.md`, `Comandos_Git.md` y demás documentos Markdown en el visor del Hub;
- aplicar estilos propios a títulos, listas, tablas, código, citas y enlaces renderizados desde Markdown;
- revisar la experiencia responsive después de los cambios visuales;
- realizar una revisión final de navegación y coherencia visual.

## Resultado esperado

El Hub contará con una identidad visual más reconocible y una experiencia de navegación más cuidada.

Los documentos Markdown podrán consultarse directamente dentro de la interfaz del portafolio con formato HTML, sin necesidad de abrir los archivos como texto plano.

Esta será la última fase de desarrollo estructural del Hub. Después de completarla, las modificaciones posteriores corresponderán únicamente al mantenimiento y a la incorporación de nuevas actividades de Programación Web.

---

# Estado actual del roadmap

**Completado: 15 / 16**

La Fase 16 corresponde al último refinamiento visual y funcional del Hub.

Una vez completada, el roadmap quedará definitivamente cerrado.
