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

Posteriormente se abrió una **Fase 16** para realizar un refinamiento final de identidad visual y experiencia de contenidos.

Estado actual del roadmap:

**15 de 16 fases completadas. Fase 16 en progreso.**

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
- progreso del curso;
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
- renderizado interno de documentos Markdown de actividades;
- visor completo en `vistas/trabajo.html`;
- modos **Diseño** y **Código** para trabajos compatibles;
- apertura de trabajos en la misma pestaña;
- regreso al Hub mediante historial del navegador cuando es posible;
- navegación agrupada y dinámica;
- diseño responsive;
- soporte para media pantalla y pestañas verticales;
- iconos SVG;
- animaciones suaves;
- panel de personalización;
- perfiles de visualización;
- colores de acento;
- densidad visual;
- identidad visual propia de PW Hub;
- favicon propio.

---

# Arquitectura actual

```text
hub/
├── assets/
│   └── branding/
│       ├── logo-pwhub-master.png
│       ├── logo-pwhub.png
│       ├── logo-pwhub-512.png
│       ├── logo-pwhub-256.png
│       ├── logo-pwhub.webp
│       ├── logo-pwhub-horizontal.png
│       ├── logo-pwhub-compacto.png
│       ├── isotipo-pwhub.png
│       ├── isotipo-pwhub-alt-01.png
│       ├── isotipo-pwhub-alt-02.png
│       ├── isotipo-pwhub-alt-03.png
│       ├── isotipo-pwhub-alt-04.png
│       ├── favicon-512.png
│       ├── favicon-192.png
│       ├── favicon-32.png
│       └── favicon-16.png
├── css/
│   ├── estilos.css
│   ├── hero-codigo.css
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
├── js/
│   ├── hub.js
│   ├── navegacion.js
│   ├── actividad.js
│   ├── estadisticas.js
│   ├── trabajos.js
│   ├── historial.js
│   ├── roadmap.js
│   └── personalizacion.js
├── vistas/
│   └── trabajo.html
└── index.html
```

`hero-codigo.css` corresponde al hero que actualmente se encuentra en refinamiento local dentro de la Fase 16.

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

Actualmente las primeras 15 están completadas y la Fase 16 se encuentra en progreso.

---

# Fase 16

## Implementado

- familia de logo propia para PW Hub;
- isotipo principal y alternativas;
- favicon en múltiples tamaños;
- integración del favicon en el Hub y en el visor completo;
- integración de identidad visual en el encabezado;
- reorganización y formateo del código del Hub;
- reorganización de `trabajo.html` dentro de `vistas/`;
- renderizado interno de archivos Markdown;
- visor completo de trabajos;
- modos Diseño y Código;
- estilos para contenido Markdown;
- apertura de trabajos en la misma pestaña.

## En desarrollo

- hero principal generado completamente con HTML y CSS;
- integración visual de los logos de PW Hub, TecNM e Instituto Tecnológico de Tepic dentro del hero;
- reducción de la altura y refinamiento responsive del banner.

## Pendiente

- sacar el botón de Configuración de la navbar y convertirlo en control flotante fijo;
- crear una navegación móvil compacta;
- permitir que Curso y Explorar se abran dinámicamente en móvil mediante un panel apropiado;
- revisar por completo la experiencia responsive;
- refinar tarjetas, botones, estados e indicadores;
- revisar presentación de trabajos destacados;
- realizar la revisión final de navegación y coherencia visual.

---

# Navegación móvil prevista

La navegación móvil actual todavía requiere una revisión específica.

La solución prevista contempla:

- barra compacta para celular;
- accesos principales a Inicio, Curso, Explorar y GitHub;
- opciones de Curso y Explorar mediante un panel dinámico;
- Configuración separada de la navbar y disponible de forma persistente;
- evitar que la navegación ocupe gran parte de la altura de la pantalla.

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

Debido al uso de `fetch()`, se recomienda ejecutar el Hub mediante un servidor HTTP local.

Por ejemplo:

```powershell
python -m http.server 5500
```

y abrir:

```text
http://localhost:5500/hub/
```

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
