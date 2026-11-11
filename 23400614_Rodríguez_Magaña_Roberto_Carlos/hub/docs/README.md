# PW Hub - Documentación técnica

PW Hub es el portafolio académico de **Programación Web** de Roberto Carlos Rodríguez Magaña.

## Estado actual

**Versión publicada actual: v1.2.2 - Estabilidad móvil y organización académica**

La etapa de construcción inicial ya terminó. El proyecto dejó de organizar su evolución futura mediante fases y ahora utiliza un esquema de **actualizaciones versionadas**.

La incorporación normal de actividades de U1 a U5 sigue siendo contenido académico y no crea una nueva versión por sí sola.

**Detección de trabajos:** la sincronización de GitHub añade automáticamente nuevas tarjetas en U1–U5 con títulos derivados de los nombres (`Ux. Ay. Ejercicio.js` → `Actividad y - Ejercicio de JavaScript`). Una carpeta con HTML, CSS, imágenes y otros archivos se considera un solo proyecto; el árbol de archivos sigue mostrando cada recurso por separado. Las actividades y descripciones editoriales ya registradas tienen prioridad. Para detectar novedades es necesario que los archivos estén publicados en la rama `main` y que la API pública de GitHub esté accesible; la versión sin conexión conserva el catálogo conocido. El nombre del archivo permite inferir su formato, no el contenido académico exacto.


## Documentos principales

### `README.md`

Describe el funcionamiento, arquitectura y criterios actuales del Hub.

### `HISTORIAL.md`

Registra eventos académicos y técnicos que ya ocurrieron durante el desarrollo del curso y del portafolio.

### `CHANGELOG.md`

Registra la evolución de PW Hub por versiones.

La entrada **v1.0.0** conserva el desarrollo histórico de las 16 fases originales y los mantenimientos incorporados antes de congelar la base estable.

### `ROADMAP.md`

Contiene las versiones publicadas y las actualizaciones futuras planeadas.

Ya no funciona como registro de fases históricas.

---

# Estado académico

Actualmente:

- U1: completada;
- U2: completada;
- U3: completada;
- U4: actual — Programación del lado del cliente (JavaScript);
- U5: pendiente — Programación del lado del servidor.

El estado académico y el versionado de PW Hub son independientes.

**Inicio de U4 (mantenimiento académico, sin nueva versión):** el profesor confirmó U4 como Programación del lado del cliente y U5 como Programación del lado del servidor. El catálogo registra A1 (PDF, PNG y PowerPoint en su carpeta; PDF y diapositivas PPTX tienen vistas independientes), A2 (tres ejercicios JavaScript), A3 (dos ejercicios JavaScript) y `U4. Ejemplos.js` como material complementario de clase, no como actividad independiente. El visor completo añade ejecución aislada para JavaScript de U4 con consola, entradas para `prompt()` y controles Ejecutar/Detener; no requiere cambios de versión de PW Hub. La Tarea 1 dispone de visor PPTX con lectura directa OOXML de sus 69 elementos y vistas PDF/PNG independientes; si el PPTX no es compatible, no se disfraza automáticamente con un PDF. U4 continúa descubriendo nuevos archivos de GitHub.

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
- explorador de recursos para proyectos organizados por carpeta y árboles de archivos por unidad;
- vista separada de HTML renderizado, código fuente, CSS, imágenes y recursos de diseño;
- vista completa de proyectos desde `Abrir trabajo`, conservando acceso a sus recursos internos;
- visor Draw.io con diagrama interpretado desde el XML, PNG exportado y XML original;
- zoom y paneo nativos de Draw.io mediante `viewer.graph`/mxGraph;
- controles de zoom, ajuste, arrastre y pantalla completa para imágenes en la vista previa y el visor completo;
- gesto de pellizco con dos dedos para imágenes y Draw.io en pantallas táctiles, manteniendo el zoom dentro del visor;
- navegación agrupada y responsive;
- búsqueda global sensible a la configuración visible: solo indexa resultados habilitados por los interruptores del usuario;
- barra móvil compacta;
- materiales visuales preservados también en la navegación móvil mediante variantes ligeras sin blur pesado;
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
│   ├── proyectos.css
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
│   ├── proyectos.js
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

El roadmap conserva `v1.0.0` como base histórica y las versiones `v1.1.0`, `v1.1.1`, `v1.2.0` y `v1.2.1` como publicaciones anteriores. `v1.2.2` es la versión publicada actual. Desde `v1.3.0` continúan las actualizaciones menores planeadas.

---

# Versionado

PW Hub utiliza un versionado simple inspirado en SemVer:

```text
v1.0.0  Base estable
v1.1.0  Actualización funcional
v1.1.1  Corrección puntual de v1.1.0
v1.2.2  Hotfix móvil sobre v1.2.1
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

El modo offline sigue siendo un respaldo. PW Hub **no es una PWA instalable** en la serie v1 actual.

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

---

## v1.2.0 publicada: navegación y búsqueda global

v1.2.0 consolidó la paleta global con `Ctrl + K` / `Cmd + K`, la búsqueda de secciones, unidades, trabajos, Historial, Roadmap y Documentación, las URLs compartibles y la integración responsive del acceso Buscar. Durante sus candidatos se estabilizaron también las superficies visuales de materiales alternativos, se añadieron microinteracciones seguras y se coordinó el bloqueo del scroll entre Configuración y Búsqueda.

La publicación final de v1.2.0 utiliza `pw-hub-offline-v45`.

---

## v1.2.1 publicada: proyectos por carpetas y visor de recursos

v1.2.1 amplía la presentación de actividades compuestas por varios archivos sin cambiar el catálogo académico ni registrar los recursos internos como trabajos independientes.

Las actividades de U2 y U3 cuya página principal está dentro de una carpeta propia se reconocen como **proyectos por carpeta**. Al abrir su vista previa, `js/proyectos.js` construye un explorador de recursos sobre el modal existente.

El explorador permite:

- alternar entre **Diseño** y **Código HTML** para páginas `.html`;
- consultar archivos `.css`, `.js`, `.json`, `.txt`, XML y otros archivos textuales como código;
- visualizar imágenes por separado;
- mantener PDF y Markdown compatibles con el visor;
- tratar `.drawio` como recurso de diseño con tres vistas independientes: diagrama interpretado desde el XML, exportación PNG asociada y código XML original;
- descubrir recursos desde el árbol público de GitHub solo al abrir un proyecto y reutilizar un caché temporal para evitar consultas repetidas;
- recurrir a un inventario local de los proyectos actuales cuando GitHub no está disponible;
- abrir el proyecto completo desde `vistas/trabajo.html`, conservando su lista de recursos;
- ampliar imágenes con zoom, ajuste, arrastre y pantalla completa tanto en el Hub como en el visor completo.

`css/proyectos.css` mantiene superficies grandes relativamente opacas y evita reintroducir filtros, blur o composición pesada en los paneles estabilizados durante v1.2.0. El modal conserva un alto estable, la lista de archivos y la superficie de vista se desplazan de forma independiente y las páginas HTML/PDF usan únicamente el scroll de su iframe. El responsive se apoya en anchos flexibles, `min-width: 0`, `minmax(...)` y adaptación según el espacio efectivo del explorador.

Los archivos `.drawio` se renderizan mediante `GraphViewer.createViewerForElement()` y conservan acceso a `viewer.graph`. Los controles del Hub utilizan `zoomIn()`, `zoomOut()`, `fit()` y la traslación nativa de mxGraph; no se aplica `transform: scale()` sobre el diagrama completo. El cierre de C9 también elimina la toolbar vacía de GraphViewer, evita que Configuración quede encima del modal y añade zoom interactivo a imágenes.

La publicación final utiliza `pw-hub-offline-v51`.

---

## v1.2.2 publicada: estabilidad móvil y organización académica

v1.2.2 cerró en C11. El parche comenzó como una corrección móvil del visor de proyectos y terminó consolidando también el catálogo académico y la representación responsive de los archivos de cada unidad después del cierre de U3.

La versión incorpora:

- distribución móvil estable del toolbar y del workspace completo;
- apilado correcto entre explorador de archivos y recurso seleccionado;
- pellizco con dos dedos para imágenes y Draw.io mediante mxGraph nativo;
- continuidad entre zoom táctil, arrastre con un dedo y controles manuales;
- navegación móvil sensible al material elegido; Liquid Glass recupera transparencia y `backdrop-filter` localizado únicamente en la barra y sus menús, sin aplicarlo a las superficies repetidas del contenido;
- nombres consistentes para las diez actividades de U3 y estado académico de U3 como completada;
- títulos del curso ajustados a U1 Fundamentos Web, Git y GitHub, U2 HTML y U3 CSS;
- U4 y U5 preparadas inicialmente con títulos provisionales; posteriormente confirmadas por el profesor como Programación del lado del cliente y Programación del lado del servidor;
- árboles plegables de archivos para U1–U3;
- actividades de clase de U1 diferenciadas de los entregables principales;
- paneles de archivos de U4/U5 visibles en estado vacío y preparados para habilitarse automáticamente al detectar contenido en GitHub;
- colocación de **Archivos de la unidad** bajo **Temas de la unidad** en la columna lateral de escritorio, regresando al flujo vertical en anchos reducidos;
- scroll interno para árboles extensos y chips de extensión indivisibles para conservar etiquetas como `HTML`, `PNG` o `JSON` en una sola línea;
- chevrons SVG centrados y estructura plegable para carpetas internas.

La publicación final utiliza `pw-hub-offline-v52` para invalidar la caché de v1.2.1 y redistribuir los recursos actualizados.

### Ajuste del visor de U4 (mantenimiento C2)

El laboratorio JavaScript ofrece código editable temporal, consola, respuestas para `prompt()` y ejecución aislada en un iframe con Worker; permite restaurar el original sin escribir sobre el repositorio. La previsualización de U4 reconoce el PNG de la Tarea 1 y código JS. La versión publicada se mantiene en **v1.2.2**.

**Mantenimiento C3:** el laboratorio del visor completo se ajusta a la altura del viewport, con desplazamiento independiente para editor y consola. Cada mensaje `console.log` se presenta en una fila separada con hora; los resultados se agrupan por ejecución y se conservan hasta usar **Limpiar**. No cambia el número de versión.

**Laboratorio JS de U4 (C4, en validación):** `prompt()` abre una pregunta interactiva cuando el programa la solicita; la pregunta y el campo de respuesta permanecen visibles al pie de la consola, sin listas precargadas. El Worker espera la respuesta, con pausa del temporizador de cómputo mientras el usuario escribe. Todos los modos del visor mantienen su desplazamiento dentro del área de visualización de la pantalla. La adaptación de `prompt()` está orientada a ejercicios de consola sencillos; no equivale a un IDE ni al entorno completo de Node.js.

**Mantenimiento U4 C7 (en validación):** el visor de PowerPoint intenta reconstruir las imágenes principales incorporadas en el propio PPTX cuando el motor local dibuja casi en blanco; si tampoco puede, ofrece el PDF/PNG como vista alternativa claramente identificada; conserva Vista Office cuando el PPTX sea público y renombra la acción de descarga. Cancelar un `prompt()` ahora detiene el ejercicio en ejecución, evitando reintentos continuos. No modifica el número de versión pública.

### Actividad 3 de U4 (mantenimiento académico C10)

`U4. A3. Ejercicios.js` se añade como tercera actividad principal de Programación del lado del cliente. Contiene dos ejercicios; los temas concretos quedan pendientes de revisión del código. Se mantiene PW Hub v1.2.2 y el visor de JavaScript existente.
