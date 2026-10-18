# PW Hub - Documentación técnica

PW Hub es el portafolio académico de **Programación Web** de Roberto Carlos Rodríguez Magaña.

## Estado actual

**Versión publicada actual: v1.1.1 - Reestructuración de navegación y vistas**

La etapa de construcción inicial ya terminó. El proyecto dejó de organizar su evolución futura mediante fases y ahora utiliza un esquema de **actualizaciones versionadas**.

La incorporación normal de actividades de U1 a U5 sigue siendo contenido académico y no crea una nueva versión por sí sola.

## Documentos principales

### `README.md`

Describe el funcionamiento, arquitectura y criterios actuales del Hub.

### `HISTORIAL.md`

Registra eventos académicos y técnicos que ya ocurrieron durante el desarrollo del curso y del portafolio.

### `CHANGELOG.md`

Registra la evolución de PW Hub por versiones.

La entrada **v1.0.0** conserva el desarrollo histórico de las 16 fases originales y los mantenimientos incorporados antes de congelar la base estable.

### `ROADMAP.md`

Contiene únicamente las actualizaciones futuras planeadas.

Ya no funciona como registro de fases históricas.

---

# Estado académico

Actualmente:

- U1: completada;
- U2: completada;
- U3: actual;
- U4: pendiente;
- U5: pendiente.

El estado académico y el versionado de PW Hub son independientes.

---

# Funciones principales

PW Hub incluye:

- carga dinámica de unidades;
- progreso del curso;
- tarjetas y vistas previas de trabajos;
- explorador general con búsqueda y filtros;
- favoritos con `localStorage`;
- soporte para destacados;
- actividad reciente;
- estadísticas académicas;
- historial interactivo;
- roadmap visual de actualizaciones;
- visor Markdown para documentación;
- renderizado interno de actividades Markdown;
- tema oscuro integrado para la vista renderizada de archivos `.md`;
- visor completo en `vistas/trabajo.html`;
- modos **Diseño** y **Código**;
- navegación agrupada y responsive;
- barra móvil compacta;
- Configuración flotante;
- perfiles de visualización;
- materiales y paletas configurables;
- sincronización automática de trabajos desde GitHub;
- indicador de estado de sincronización y tiempo desde la última consulta;
- detección de trabajos nuevos desde la última visita;
- fechas de actualización obtenidas desde GitHub con caché local;
- respaldo mediante caché local;
- página offline propia.

---

# Arquitectura actual

```text
hub/
├── assets/
│   └── branding/
├── css/
│   ├── actividad.css
│   ├── apariencia-avanzada.css
│   ├── combobox.css
│   ├── estadisticas.css
│   ├── estilos.css
│   ├── hero-codigo.css
│   ├── hero-movil-fix.css
│   ├── historial.css
│   ├── navegacion.css
│   ├── novedades.css
│   ├── offline.css
│   ├── personalizacion.css
│   ├── refinamiento-final.css
│   ├── roadmap.css
│   └── trabajos.css
├── data/
│   ├── roadmap.json
│   └── unidades.json
├── docs/
│   ├── README.md
│   ├── HISTORIAL.md
│   ├── CHANGELOG.md
│   └── ROADMAP.md
├── js/
│   ├── actividad.js
│   ├── combobox.js
│   ├── estadisticas.js
│   ├── historial.js
│   ├── hub.js
│   ├── navegacion.js
│   ├── novedades.js
│   ├── offline.js
│   ├── personalizacion.js
│   ├── roadmap.js
│   ├── sincronizacion.js
│   └── trabajos.js
├── vistas/
│   ├── trabajo.html
│   └── offline.html
└── index.html
```

`hub/index.html` es el único HTML situado directamente en la raíz de `hub/`.

---

# Fuentes de datos

## `data/unidades.json`

Funciona como catálogo base y capa de metadatos.

Los nombres, descripciones, destacados y otros datos personalizados pueden mantenerse aquí.

## Sincronización con GitHub

`js/sincronizacion.js` complementa el catálogo base con los trabajos reales publicados dentro de U1-U5.

La detección automática considera principalmente:

- HTML;
- HTM;
- PDF;
- Markdown.

Un `README.md` situado directamente en la raíz de una unidad se considera documentación de carpeta y no trabajo. Un README dentro de un subproyecto sí puede representar la actividad.

La sincronización también evita conservar rutas manuales obsoletas cuando un archivo compatible fue renombrado o eliminado.

Todas las secciones relacionadas con trabajos reutilizan el mismo catálogo sincronizado durante cada carga.

## Estado y novedades de v1.1.0

La versión v1.1.0 añade una capa visual sobre esa sincronización sin cambiar el catálogo académico base. `sincronizacion.js` expone el estado actual y `novedades.js` lo presenta dentro del Hub.

El navegador conserva localmente:

- rutas conocidas del último árbol válido;
- trabajos nuevos pendientes de revisar;
- última sincronización disponible;
- fechas de actualización consultadas a GitHub.

La primera ejecución de v1.1.0 toma los trabajos ya existentes como línea base para evitar marcar todo el portafolio como nuevo. En consultas posteriores, una ruta nueva dentro de U1-U5 recibe la insignia `NUEVO` hasta que el usuario abre el trabajo o su vista previa.

Las fechas reales se consultan con el endpoint de commits por ruta y se cachean durante 24 horas. Si no hay conexión, el Hub conserva la última fecha conocida y evita nuevas solicitudes.

---

# Roadmap por versiones

El roadmap visual lee:

```text
hub/docs/ROADMAP.md
```

y su configuración complementaria:

```text
hub/data/roadmap.json
```

El Roadmap utiliza una sola vista visual ramificada. La cronología de hechos realizados se consulta en Historial y el detalle por versión en Changelog, por lo que no mantiene una segunda línea de tiempo dentro del Roadmap.

Cada actualización se declara con el formato:

```markdown
# v1.1.0 - Nombre de la actualización

**Estado:** Planeada

## Objetivo
...

## Planeado
- [ ] ...

## Resultado esperado
...
```

Los estados reconocidos son:

- Publicada / Completada / Implementada;
- En desarrollo;
- Planeada;
- Visión futura.

El roadmap conserva `v1.0.0` como base histórica, `v1.1.0` como actualización publicada anterior y marca `v1.1.1` como versión publicada actual. El Changelog conserva el detalle de cada versión; las versiones posteriores representan trabajo planeado o futuro.

---

# Versionado

PW Hub utiliza un versionado simple inspirado en SemVer:

```text
v1.0.0  Base estable
v1.1.0  Actualización funcional
v1.1.1  Corrección puntual de v1.1.0
v1.9.0  Última actualización menor de la serie v1
v2.0.0  Siguiente salto mayor
```

Por convención del proyecto, cada serie principal llega como máximo a `.9`; después continúa con la siguiente versión mayor. No existe obligación de implementar todas las versiones del roadmap ni de hacerlo en un calendario fijo.

Las propuestas pueden:

- cambiar de orden;
- combinarse;
- dividirse;
- descartarse;
- aplazarse.

---

# Apariencia

PW Hub conserva ocho materiales visuales:

- Normal;
- Liquid Glass;
- Frosted Glass;
- Acrílico;
- Minimal;
- Neon Tech;
- Mate;
- Titanio.

Cada material ofrece únicamente las paletas compatibles definidas por el sistema.

La configuración continúa siendo local al navegador y mantiene compatibilidad con preferencias guardadas anteriormente.

---

# Modo sin conexión

PW Hub utiliza un Service Worker para conservar:

- el shell principal;
- documentación;
- recursos visuales;
- trabajos detectados que sean compatibles con la caché.

Si una navegación no puede resolverse ni desde la red ni desde caché, se utiliza:

```text
hub/vistas/offline.html
```

El modo offline sigue siendo un respaldo. En v1.0.0 PW Hub **no es una PWA instalable**.

La posibilidad de instalación está registrada como actualización futura en el roadmap.

---

# Flujo normal para actividades nuevas

Cuando se realiza una actividad nueva:

1. guardar el trabajo dentro de la unidad correspondiente;
2. hacer commit y push al repositorio;
3. permitir que PW Hub lo detecte automáticamente si su formato es compatible;
4. actualizar `data/unidades.json` solo cuando se necesiten metadatos personalizados;
5. registrar un evento en `HISTORIAL.md` cuando sea relevante académica o técnicamente.

No es necesario mantener una segunda copia de publicación.

---


## Renderizado Markdown oscuro

PW Hub mantiene una apariencia oscura coherente para los archivos Markdown en todas sus superficies internas: Documentación, miniaturas de unidades, Vista previa del explorador y visor completo. La hoja `css/markdown-oscuro.css` concentra los estilos compartidos del Hub principal; `vistas/trabajo.html` conserva su propio tema para el visor completo.


## Vistas internas de v1.1.1

La versión v1.1.1 reorganiza la navegación sin dividir PW Hub en múltiples páginas HTML.

La estructura prevista es:

- `Inicio`: Resumen académico fijo;
- `Curso`: Progreso general y U1-U5 juntos;
- `Explorar`: una herramienta extensa por vista;
- `Documentación`: centro documental y visor Markdown.

`hub/js/vistas-internas.js` se carga directamente desde `hub/index.html` después de los módulos principales. La sincronización automática conserva una responsabilidad separada y ya no inicia el router.

El Resumen académico forma parte estructural de Inicio y no aparece entre los controles que pueden ocultarse desde Personalización.

### Arranque y sincronización

`hub.js` utiliza directamente el catálogo devuelto por la lectura de `data/unidades.json`. Como `sincronizacion.js` ya intercepta esa lectura y devuelve el catálogo fusionado, no se realiza una segunda sincronización redundante.

La consulta del árbol de GitHub conserva un límite de espera propio. Si GitHub no responde, el Hub puede recurrir al snapshot o al catálogo base en lugar de mantener indefinidamente los estados de carga.

---

# Desarrollo local

Debido al uso de `fetch()`, el Hub debe probarse mediante un servidor HTTP local.

Ejemplo:

```powershell
python -m http.server 5500 --bind 0.0.0.0
```

Después:

```text
http://localhost:5500/hub/
```

---

# Publicación

PW Hub se publica mediante GitHub Pages utilizando directamente los archivos versionados del repositorio.

Repositorio:

```text
RobDev512/PW-AD2026
```

Ruta:

```text
23400614_Rodríguez_Magaña_Roberto_Carlos/hub/
```

---

# Criterio de evolución

PW Hub se considera un proyecto terminado en su base v1.0.0.

Las futuras versiones son mejoras opcionales. Si ninguna se implementa, el estado actual continúa siendo válido y estable.
