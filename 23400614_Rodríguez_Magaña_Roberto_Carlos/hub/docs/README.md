# Portafolio Académico de Programación Web

Hub académico para reunir, organizar y visualizar los trabajos realizados durante la materia de **Programación Web**.

## Estudiante

**Roberto Carlos Rodríguez Magaña**  
**Número de control:** 23400614  
**Carrera:** Ingeniería en Sistemas Computacionales  
**Institución:** Instituto Tecnológico de Tepic

---

# Estado del Hub

El desarrollo técnico principal del Hub quedó cerrado con **15 fases completadas**.

Esto no significa que la materia haya terminado. A partir de este punto, las nuevas actividades de U3, U4 y U5 se incorporarán como **contenido académico y mantenimiento normal**, no como nuevas fases de desarrollo del Hub.

Actualmente:

- U1: completada;
- U2: completada;
- U3: actual;
- U4: pendiente;
- U5: pendiente.

---

# Vista predeterminada

El Hub abre en el perfil **Minimal** para presentar primero lo esencial del portafolio:

- identidad académica;
- unidades;
- trabajos.

Desde el botón de configuración se pueden activar las herramientas complementarias.

---

# Funciones principales

El Hub incluye:

- carga dinámica de unidades mediante JSON;
- progreso del curso;
- tarjetas de trabajos;
- vistas previas;
- explorador general;
- búsqueda y filtros;
- favoritos mediante `localStorage`;
- soporte para trabajos destacados;
- actividad reciente;
- estadísticas académicas;
- historial interactivo;
- roadmap visual;
- visor Markdown;
- navegación agrupada;
- navegación activa y offset;
- adaptación responsive;
- soporte para media pantalla y pestañas verticales;
- scrollbar personalizada;
- iconos SVG;
- animaciones suaves;
- panel de personalización;
- perfiles de visualización;
- colores de acento;
- densidad visual;
- ocultado dinámico de secciones y accesos del navbar;
- build de producción;
- minificación;
- ofuscación JavaScript opcional.

---

# Arquitectura

```text
hub/
├── index.html
├── package.json
├── build.mjs
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
│   ├── PUBLICACION.md
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

# Fuentes de datos

## `data/unidades.json`

Fuente principal del estado académico actual.

Contiene:

- unidades;
- temas;
- estados;
- trabajos;
- rutas;
- tipos;
- descripciones.

## `docs/HISTORIAL.md`

Registra hechos que ya ocurrieron.

Es utilizado por:

- Historial;
- Actividad reciente;
- Estadísticas.

## `docs/ROADMAP.md`

Documenta las 15 fases de evolución técnica del Hub.

Las 15 fases están cerradas.

---

# Personalización

La configuración se guarda localmente mediante:

```text
pw-hub-configuracion-v2
```

El usuario puede:

- elegir qué secciones visualizar;
- cambiar entre perfiles Completo, Académico y Minimal;
- cambiar el color de acento;
- elegir densidad visual;
- activar o desactivar animaciones;
- activar o desactivar efectos hover;
- restablecer la configuración.

Cuando una sección se desactiva, sus accesos correspondientes también desaparecen dinámicamente del navbar.

---

# Flujo para nuevas actividades

A partir del cierre técnico del Hub, una nueva actividad normalmente solo requiere:

1. guardar el archivo en su unidad correspondiente;
2. agregar el trabajo a `data/unidades.json`;
3. registrar un evento en `docs/HISTORIAL.md` cuando sea relevante;
4. volver a generar la versión protegida si se desea actualizar `publicacion/`.

No es necesario crear nuevas fases del roadmap.

---

# Desarrollo local

Debido al uso de `fetch()`, se recomienda ejecutar el Hub con **Live Server**, **Live Preview** o un servidor HTTP local.

---

# Build de producción

Primera instalación:

```bash
npm install
```

Build normal:

```bash
npm run build
```

Build protegido:

```bash
npm run build:protegido
```

Vista previa:

```bash
npm run preview
```

La versión protegida dificulta la lectura casual del JavaScript, pero no puede convertir código frontend en código secreto.

---

# Repositorio

El Hub forma parte del repositorio académico:

`RobDev512/PW-AD2026`

dentro de la carpeta del estudiante:

`23400614_Rodríguez_Magaña_Roberto_Carlos/hub/`

---

# Nota académica

El Hub funciona como portafolio complementario, índice y registro visual de Programación Web.

Las nuevas actividades del curso continuarán incorporándose conforme avancen U3, U4 y U5.
