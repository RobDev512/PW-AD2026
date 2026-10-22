# PW Hub - Documentación técnica

PW Hub es el portafolio académico de **Programación Web** de Roberto Carlos Rodríguez Magaña.

## Estado actual

**Versión publicada actual: v1.2.0 - Navegación y búsqueda global**

**Parche en validación: v1.2.1-c6 - Proyectos por carpetas y visor de recursos**

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
- explorador de recursos para actividades organizadas por carpeta en U2 y U3;
- vista separada de HTML renderizado, código fuente, CSS, imágenes y recursos de diseño;
- visor Draw.io con diagrama interpretado desde el XML, PNG exportado y XML original;
- navegación agrupada y responsive;
- búsqueda global sensible a la configuración visible: solo indexa resultados habilitados por los interruptores del usuario;
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
│   ├── trabajos.js
│   └── proyectos.js
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

El roadmap conserva `v1.0.0` como base histórica, `v1.1.0` y `v1.1.1` como actualizaciones publicadas anteriores y marca `v1.2.0` como versión publicada actual. `v1.2.1` se mantiene en validación como parche de proyectos por carpeta; desde `v1.3.0` continúan las actualizaciones menores planeadas.

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

---

## v1.2.0 publicada: navegación y búsqueda global

El candidato actual añade una paleta global con `Ctrl + K` / `Cmd + K`. En escritorio amplio conserva el acceso Buscar en la navegación; entre 651 y 1100 px ese acceso se reduce al icono de lupa y en móvil se presenta como botón flotante anclado por CSS directamente sobre Configuración. Ambos botones comparten la misma superficie visual para responder al tema, acento y material seleccionados, y Buscar usa explícitamente el color de acento actual. El índice combina secciones, unidades, trabajos, Historial, Roadmap y Documentación sin sustituir los buscadores específicos que ya existen.

Los filtros y búsquedas de las vistas principales pueden reflejarse en parámetros de URL y restaurarse al abrir un enlace compartido. Los hashes de v1.1.1 continúan siendo la referencia principal para seleccionar Inicio, Curso, Explorar y Documentación.

Recursos nuevos del candidato:

```text
hub/css/busqueda-global.css
hub/js/busqueda-global.js
```


### Integración responsive del candidato 4

Los desplegables de Curso, Explorar y Documentación limitan dinámicamente su altura al espacio visible cuando se abren fuera de móvil y corrigen su posición horizontal para no salir del viewport. El cuarto candidato probó una alineación móvil calculada con JavaScript. Ese enfoque quedó sustituido posteriormente por un anclaje completamente CSS para evitar desplazamientos temporales durante el scroll y los cambios del `visualViewport`.

### Estabilidad visual y rendimiento del candidato 6

Durante la validación del candidato 5 se comprobó que las franjas podían persistir aun sin `backdrop-filter`. Las capturas mostraron que el problema también coincidía con superficies semitransparentes que cambiaban de capa de composición mediante `transform` durante `:hover`. El candidato 6 vuelve opacos los fondos de tarjetas repetidas en materiales de vidrio, elimina la traslación hover de esas tarjetas y estabiliza su composición; los candidatos posteriores afinan el realce para conservar únicamente una transición de borde segura. En móvil añade un perfil ligero: elimina blur de fondo en controles fijos, simplifica fondos y reduce transiciones/animaciones costosas para mejorar la fluidez del scroll.

### Candidato 9 de v1.2.0

La corrección actual identifica que el fallo de franjas era específico de los materiales alternativos: sus reglas `!important` podían superar al parche anterior. C9 estabiliza las superficies con selectores material-aware de mayor especificidad, elimina blur/sombra solo en contenido repetido y deja intactas las transiciones del sistema Sutil/Dinámico. En escritorio, el hover se limita a un cambio suave de borde al color de acento. En móvil, Buscar utiliza las mismas clases, estructura interna, tamaño y eje X que Configuración y se coloca exactamente una fila por encima.

### Candidato 10 de v1.2.0

Tras validar C9, el décimo candidato amplía la respuesta visual sin modificar la estrategia de estabilidad. Se añade `hub/css/microinteracciones.css`, una capa independiente que ilumina bordes con el color de acento en todos los materiales y temas y anima únicamente elementos pequeños —etiquetas, iconos, números, filtros, botones y controles del Roadmap—. Las tarjetas grandes de materiales alternativos continúan sin blur, sombra, filtro ni transformaciones de hover para no reintroducir las franjas de composición. El modo Dinámico añade pulsos discretos solo fuera de móvil; en teléfono se conserva el perfil ligero y únicamente existe feedback de toque.

### Candidato 11 de v1.2.0

Tras validar las microinteracciones de C10, el undécimo candidato realiza dos ajustes de cierre sin alterar la apariencia ya aprobada. El botón `Restablecer` del pie de Configuración conserva su texto en una sola línea mediante ancho automático, y Búsqueda Global observa el estado del panel de Configuración para aplicar un bloqueo común del scroll de fondo. Los contenedores internos de Configuración y de la paleta mantienen su propio desplazamiento con `overscroll-behavior`, evitando el scroll encadenado hacia la página.

---

## Ajuste de búsqueda de v1.2.0 - Candidato 12

La paleta global filtra sus resultados según los interruptores de **Contenido visible**. Las unidades requieren la sección Unidades; Historial, Roadmap y Documentación requieren sus vistas correspondientes. Un trabajo sigue apareciendo cuando está habilitada al menos una de las dos superficies que lo exponen: Unidades o Todos los trabajos. El filtrado se evalúa en tiempo real y no modifica el catálogo base.

### Publicación final de v1.2.0

Tras validar C12 en escritorio y móvil, v1.2.0 queda publicada como versión actual. La publicación conserva la búsqueda global, navegación responsive, URLs compartibles, correcciones de composición para materiales alternativos, microinteracciones seguras, perfil móvil optimizado y bloqueo modal del scroll de fondo. El Service Worker final utiliza `pw-hub-offline-v45`.
---

## v1.2.1-c6 en validación: proyectos por carpetas y visor de recursos

Este parche amplía la forma de presentar actividades compuestas por varios archivos sin cambiar el catálogo académico ni registrar los recursos internos como trabajos independientes.

Las actividades de U2 y U3 cuya página principal está dentro de una carpeta propia se reconocen como **proyectos por carpeta**. Al abrir su vista previa, `js/proyectos.js` construye un explorador de recursos sobre el modal existente.

El explorador permite:

- alternar entre **Diseño** y **Código HTML** para páginas `.html`;
- consultar archivos `.css`, `.js`, `.json`, `.txt`, XML y otros archivos textuales como código;
- visualizar imágenes por separado;
- mantener PDF y Markdown compatibles con el visor;
- tratar `.drawio` como recurso de diseño con tres vistas independientes: diagrama interpretado desde el XML, exportación PNG asociada y código XML original;
- descubrir recursos desde el árbol público de GitHub solo al abrir un proyecto y reutilizar un caché temporal para evitar consultas repetidas;
- recurrir a un inventario local de los proyectos actuales cuando GitHub no está disponible.

`css/proyectos.css` mantiene superficies opacas y evita blur, filtros y sombras complejas sobre paneles grandes para no reintroducir los artefactos de composición corregidos durante v1.2.0. En C6, el modal de proyecto conserva un alto estable, la lista de archivos y la superficie de vista se desplazan de forma independiente y las páginas HTML/PDF usan únicamente el scroll de su iframe. El explorador mantiene dos columnas en anchos intermedios y la cabecera respeta el apilado de `trabajos.css` cuando el ancho efectivo baja de 750 px, evitando títulos comprimidos.

Los archivos `.drawio` incorporan tres modos cuando existe una exportación PNG asociada: **Diagrama**, que entrega el XML real al visor oficial `viewer-static.min.js` de diagrams.net; **PNG**, que muestra la exportación estática; y **XML**, que presenta el código fuente original. En C6 el visor se crea con `GraphViewer.createViewerForElement()` para conservar la instancia de `viewer.graph`. Los controles del Hub utilizan `zoomIn()`, `zoomOut()`, `fit()` y la traslación nativa de mxGraph; ya no se aplica `transform: scale()` sobre el diagrama completo, por lo que el texto conserva nitidez al acercarse. Si no está disponible la conexión con diagrams.net, PNG y XML continúan funcionando.
