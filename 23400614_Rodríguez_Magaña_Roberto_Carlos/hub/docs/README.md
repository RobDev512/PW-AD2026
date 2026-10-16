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
- apertura de trabajos en la misma pestaña;
- roadmap visual jerárquico con ramas y subramas;
- conexiones dinámicas del roadmap mediante Canvas;
- hero principal consolidado y generado completamente con HTML y CSS;
- integración visual de los logos de PW Hub, TecNM e Instituto Tecnológico de Tepic dentro del hero;
- reducción y equilibrio de la altura del banner.
- ajuste del roadmap para pantallas amplias;
- branding del hero más compacto en vistas estrechas.
- troncos Canvas continuos incluso cuando las categorías quedan por encima del centro de la fase;
- Canvas limitado al ancho visible del roadmap para evitar overflow horizontal al redimensionar;
- protección global frente a overflow horizontal provocado por elementos decorativos;
- contenedor institucional TecNM + ITT ajustado al contenido real en vistas estrechas.
- compensación del margen transparente interno del logo TecNM;
- barra móvil fija con Inicio, Curso, Explorar y GitHub;
- paneles móviles dinámicos para Curso y Explorar;
- Documentación integrada dentro de Explorar en móvil;
- Configuración flotante fuera de la navbar.
- navbar sticky restaurada en escritorio y media pantalla;
- navegación sincronizada dinámicamente con las secciones visibles de Configuración;
- compensación óptica de TecNM limitada a vistas angostas.

## Estado de la Fase 16

**Completada.**

La Fase 16 fue validada en escritorio, media pantalla, ventana angosta y celular. El Hub queda en etapa de mantenimiento: nuevas modificaciones deberán corresponder a correcciones puntuales o a la incorporación de contenidos académicos.

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

## Personalización visual avanzada

Como mejora de mantenimiento posterior al cierre de la Fase 16, Configuración permite combinar de forma independiente:

- tema oscuro: PW Dark, Obsidiana, Azul profundo, Grafito u OLED;
- estilo visual: Normal, Liquid Glass, Minimal o Neon Tech;
- color de acento;
- densidad;
- movimiento: Ninguno, Sutil o Dinámico;
- efectos al pasar el cursor.

Las preferencias anteriores se migran automáticamente y continúan guardándose únicamente en el navegador del usuario.

### Liquid Glass V2

El estilo Liquid Glass utiliza bordes especulares, transparencias multicapa, desenfoque de fondo y esquinas más suaves para lograr una apariencia más cercana al vidrio líquido moderno de iOS.

El modo Dinámico también añade microanimaciones en títulos, progreso y algunos controles, siempre respetando la preferencia del sistema para reducir movimiento.

### Apariencia avanzada V4 reparada

La versión V4 conserva la base estable de Liquid Glass V2 y aumenta la legibilidad de menús mediante blur, opacidad y contraste sin alterar `position`, `overflow` o `transform` de la navegación.

El modo Dinámico usa animaciones seguras sobre filtros, sombras, opacidad y elementos internos para evitar interferencias con la geometría del Hub.

### Liquid Glass V5 ajustado

Los menús desplegables del Hub ahora aplican un blur más notorio y un acabado de vidrio más claro. El resto de superficies glass reducen ligeramente su desenfoque para conservar profundidad sin perder definición visual.

### Liquid Glass V6

La composición del vidrio fue corregida para que el blur de los menús desplegables sea realmente visible. La navbar deja de aplicar blur como elemento padre y conserva su apariencia mediante material semitransparente, mientras los dropdowns utilizan un blur más fuerte.

El resto de tarjetas y paneles reduce ligeramente el desenfoque para mantener una apariencia más nítida.

### Liquid Glass V7

Se equilibró el material del modo Liquid Glass: los menús siguen desenfocando el contenido posterior, pero con menos blur y mayor opacidad. Las tarjetas y paneles son ahora más sólidos, manteniendo reflejos y profundidad sin verse transparentes.

### Liquid Glass V8 consolidado

`apariencia-avanzada.css` fue limpiado para retirar las versiones Liquid Glass acumuladas. Ahora existe una sola definición del estilo, con menús sólidos y blur moderado, tarjetas más definidas y una cascada CSS mucho más predecible.

### Liquid Glass V9

Se restauró el acabado Liquid Glass V2 en prácticamente todo el Hub. El refinamiento posterior se limita a los menús desplegables, que utilizan blur moderado y un material sólido para mejorar la separación respecto al contenido de fondo.

### Liquid Glass V10

Se restauró de forma real el acabado V2, incluyendo el blur visible de la navbar y los bordes especulares tipo iPhone. El blur de la navegación se aplica mediante una capa visual interna para permitir que los dropdowns mantengan un desenfoque independiente.

### Veinte temas oscuros

PW Hub dispone ahora de 20 variantes de tema oscuro. Las quince incorporaciones finales son Carbono, Medianoche, Índigo, Pizarra, Bosque nocturno, Esmeralda negra, Vino oscuro, Ciruela, Cobre nocturno, Ámbar oscuro, Acero, Tormenta, Eclipse, Terminal y Cobalto.

Los temas pueden combinarse libremente con el color de acento, el estilo visual y el nivel de movimiento.

### Sincronización de trabajos

El catálogo visual del Hub se construye a partir de `data/unidades.json` y se complementa automáticamente con el contenido real de las carpetas `U1` a `U5` publicado en GitHub.

Los trabajos registrados manualmente conservan sus nombres y descripciones. Cuando aparece un nuevo HTML, PDF o Markdown compatible, el Hub lo incorpora sin exigir editar inmediatamente `unidades.json`.

La última detección se guarda en el navegador y el Service Worker mantiene una copia offline del portafolio. El modo sin conexión es una función de respaldo y no convierte PW Hub en una aplicación instalable.

### Renombres y archivos eliminados

La sincronización automática también controla rutas obsoletas. Cuando un trabajo HTML, PDF o Markdown registrado manualmente cambia de nombre o desaparece de GitHub, el Hub deja de mostrar la tarjeta antigua después de sincronizar el árbol actual del repositorio.

Esto evita previews 404 causados por renombres posteriores.

### Apariencia compacta

La personalización reúne ahora **Tema** y **Material** dentro de una sola sección de Apariencia. Las 20 variantes oscuras y los cuatro materiales continúan siendo combinables, pero la configuración ocupa considerablemente menos altura, especialmente en pantallas móviles.

Liquid Glass V11 conserva el aspecto aprobado de V10 y refina el material mediante iluminación direccional del borde, saturación del fondo y menor dependencia de un blur intenso.

### Materiales y paletas compatibles

La sección Apariencia utiliza ahora una relación Material → Paleta. Cada material ofrece únicamente las variantes oscuras que mejor combinan con sus propiedades visuales.

Los ocho materiales son Normal, Liquid Glass, Frosted Glass, Acrílico, Minimal, Neon Tech, Mate y Titanio.

Todos los combobox del Hub comparten además un componente visual propio, evitando los desplegables nativos del navegador y limitando su altura en pantallas pequeñas.

### Página sin conexión

PW Hub incluye una página offline propia para los casos en los que una navegación no pueda resolverse ni desde internet ni desde la caché local.

Los recursos y trabajos visitados anteriormente siguen abriéndose directamente desde la caché. La página de error solo actúa como último fallback.

El Hub también muestra un pequeño indicador únicamente cuando la conexión se pierde o acaba de recuperarse.

### Paneles flotantes del hero en móvil

En pantallas de hasta 420 px el hero conserva ahora los paneles flotantes **HTML**, **CSS** y **JS**. La corrección está aislada en un archivo responsive específico y no altera otros tamaños de pantalla.

### Hero sin relleno superior

El espacio previo al branding fue retirado directamente desde
`hero-codigo.css`. El archivo usa una URL versionada para asegurar que
la corrección sustituya cualquier copia anterior almacenada por el modo
offline.

### Movimiento sutil corregido

El modo **Sutil** conserva ahora su animación de entrada, pero los
elementos marcados como visibles regresan correctamente a su posición
natural. Esto elimina el desplazamiento permanente de 18 px que afectaba
al encabezado principal.
