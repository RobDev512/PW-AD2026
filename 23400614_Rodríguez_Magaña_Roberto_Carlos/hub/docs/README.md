# Portafolio Académico de Programación Web

Hub académico para reunir, organizar y visualizar los trabajos realizados durante la materia de **Programación Web**.

## Estudiante

**Roberto Carlos Rodríguez Magaña**  
**Número de control:** 23400614  
**Carrera:** Ingeniería en Sistemas Computacionales  
**Institución:** Instituto Tecnológico de Tepic

---

# Estado del Hub

El desarrollo técnico principal quedó cerrado originalmente con **15 fases completadas**.

Posteriormente se abrió una **última Fase 16** para realizar un refinamiento final de identidad visual y experiencia de contenidos.

Estado actual del roadmap:

**15 de 16 fases completadas.**

La incorporación normal de nuevas actividades de U3, U4 y U5 continúa considerándose contenido académico y mantenimiento.

Actualmente:

- U1: completada;
- U2: completada;
- U3: actual;
- U4: pendiente;
- U5: pendiente.

---

# Vista predeterminada

El Hub abre en el perfil **Minimal** para presentar primero lo esencial:

- identidad académica;
- unidades;
- trabajos.

Desde Configuración se pueden activar las herramientas complementarias.

---

# Funciones principales

El Hub incluye:

- carga dinámica de unidades mediante JSON;
- progreso del curso;
- tarjetas y vistas previas de trabajos;
- explorador general con búsqueda y filtros;
- favoritos mediante `localStorage`;
- soporte para destacados;
- actividad reciente;
- estadísticas académicas;
- historial interactivo;
- roadmap visual;
- visor Markdown para la documentación del Hub;
- navegación agrupada y dinámica;
- diseño responsive;
- soporte para media pantalla y pestañas verticales;
- iconos SVG;
- animaciones suaves;
- panel de personalización;
- perfiles de visualización;
- colores de acento;
- densidad visual.

La Fase 16 ampliará la experiencia visual e integrará correctamente los archivos Markdown de las actividades para evitar que se abran como texto plano.

---

# Arquitectura actual

```text
hub/
├── index.html
├── css/
│   ├── estilos.css
│   ├── navegacion.css
│   ├── actividad.css
│   ├── estadisticas.css
│   ├── trabajos.css
│   ├── historial.css
│   ├── roadmap.css
│   └── personalizacion.css
├── data/
│   └── unidades.json
├── docs/
│   ├── README.md
│   ├── HISTORIAL.md
│   ├── ROADMAP.md
│   └── CIERRE.md
└── js/
    ├── hub.js
    ├── navegacion.js
    ├── actividad.js
    ├── estadisticas.js
    ├── trabajos.js
    ├── historial.js
    ├── roadmap.js
    └── personalizacion.js
```

---

# Fuente única: repositorio GitHub

El Hub utiliza directamente los archivos versionados del repositorio.

`data/unidades.json`, los documentos Markdown y los trabajos de cada unidad forman parte de la misma estructura del repositorio.

No se mantiene una segunda copia del sitio en `publicacion/`.

Cuando el repositorio se sirve mediante GitHub Pages, los `fetch()` relativos del Hub leen los archivos publicados por GitHub Pages a partir del repositorio.

---

# Fuentes de datos

## `data/unidades.json`

Contiene unidades, temas, estados, trabajos, rutas, tipos y descripciones.

## `docs/HISTORIAL.md`

Registra hechos que ya ocurrieron y alimenta Historial, Actividad reciente y parte de las estadísticas.

## `docs/ROADMAP.md`

Documenta las **16 fases** de evolución técnica del Hub.

Actualmente las primeras 15 están completadas y la Fase 16 se encuentra pendiente.

---

# Fase 16

La última fase contempla principalmente:

- logo propio del Hub;
- favicon;
- banner o hero principal;
- mejoras de identidad visual;
- refinamiento de tarjetas, botones e indicadores;
- renderizado interno de archivos Markdown de actividades;
- estilos específicos para contenido Markdown;
- revisión responsive y de coherencia visual.

---

# Flujo para nuevas actividades

Una nueva actividad normalmente requiere:

1. guardar el archivo con un nombre descriptivo en su unidad;
2. agregarlo a `data/unidades.json`;
3. registrar un evento en `docs/HISTORIAL.md` cuando sea relevante;
4. hacer commit y push.

No es necesario duplicar archivos ni regenerar una carpeta de publicación.

---

# Desarrollo local

Debido al uso de `fetch()`, se recomienda ejecutar el Hub con **Live Server**, **Live Preview** o cualquier servidor HTTP local.

---

# Repositorio

El Hub forma parte de:

`RobDev512/PW-AD2026`

Ruta del Hub:

`23400614_Rodríguez_Magaña_Roberto_Carlos/hub/`

El acceso publicado mediante GitHub Pages utiliza directamente la ruta `/hub/`.

La carpeta del estudiante ya no utiliza un `index.html` adicional de redirección fuera del Hub.

---

# Nota académica

El Hub funciona como portafolio complementario, índice y registro visual de Programación Web.
