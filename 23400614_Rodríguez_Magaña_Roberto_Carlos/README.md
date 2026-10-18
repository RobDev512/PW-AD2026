# Roberto Carlos Rodríguez Magaña

**Número de control:** 23400614  
**Carrera:** Ingeniería en Sistemas Computacionales  
**Institución:** Instituto Tecnológico de Tepic  
**Materia:** Programación Web

---

## Portafolio de Programación Web

Esta carpeta contiene las actividades, ejercicios y proyectos realizados durante la materia de **Programación Web**.

También incluye **PW Hub**, un portafolio web que organiza y presenta el avance académico de forma visual.

🌐 **[Ver portafolio en línea](https://robdev512.github.io/PW-AD2026/23400614_Rodr%C3%ADguez_Maga%C3%B1a_Roberto_Carlos/hub/)**

---

## Estado de la materia

| Unidad | Tema | Estado |
| --- | --- | --- |
| U1 | Introducción a las Aplicaciones Web | ✓ Completada |
| U2 | HTML y CSS | ✓ Completada |
| U3 | Programación del lado del cliente | 🟡 En curso |
| U4 | Programación del lado del servidor | ⏳ Pendiente |
| U5 | Cómputo en la nube y servicios | ⏳ Pendiente |

---

## Estado de PW Hub

**Versión publicada actual: v1.1.1 - Reestructuración de navegación y vistas**

La base inicial quedó consolidada en v1.0.0. **v1.1.0** incorporó sincronización y novedades, y **v1.1.1** publica la reestructuración de navegación y las correcciones de estabilidad del arranque.

El proyecto ya no utiliza fases para organizar su evolución futura. Las mejoras posteriores se documentan como **actualizaciones versionadas**.

La construcción histórica de las 16 fases originales se conserva en:

```text
hub/docs/CHANGELOG.md
```

La versión estable actual y las actualizaciones propuestas se encuentran en:

```text
hub/docs/ROADMAP.md
```

El mapa conserva `v1.0.0` como base estable histórica, `v1.1.0` como actualización publicada anterior y marca `v1.1.1` como versión publicada actual. Las mejoras previstas continúan desde `v1.2.0` hasta `v1.9.0`, reservando `v2.0.0` para el siguiente salto mayor del Hub.

El avance académico de U1-U5 y las versiones de PW Hub son independientes.

---

## Organización de archivos

```text
23400614_Rodríguez_Magaña_Roberto_Carlos/
├── U1/
├── U2/
├── U3/
├── hub/
│   ├── assets/
│   │   └── branding/
│   ├── css/
│   ├── data/
│   ├── docs/
│   │   ├── README.md
│   │   ├── HISTORIAL.md
│   │   ├── CHANGELOG.md
│   │   └── ROADMAP.md
│   ├── js/
│   ├── vistas/
│   │   ├── trabajo.html
│   │   └── offline.html
│   └── index.html
├── Comandos_Git.md
├── Perfil.md
├── foto.jpg
└── README.md
```

Cada carpeta de unidad contiene ejercicios, actividades y proyectos desarrollados durante el curso.

---

## Funciones principales de PW Hub

El Hub incluye:

- visualización de las cinco unidades;
- progreso académico;
- vistas previas de actividades;
- explorador de trabajos con búsqueda y filtros;
- favoritos y destacados;
- actividad reciente;
- estadísticas académicas;
- historial del portafolio;
- roadmap visual de actualizaciones;
- visor interno de Markdown;
- renderizado Markdown con tema oscuro integrado en visor completo, Documentación, miniaturas y vistas previas;
- visor completo con modos **Diseño** y **Código**;
- navegación responsive;
- Configuración flotante;
- perfiles visuales;
- materiales y paletas configurables;
- identidad propia mediante logo, isotipo y favicon;
- sincronización automática con GitHub;
- estado visible de sincronización, novedades y fechas de actualización incorporados en v1.1.0;
- respaldo offline mediante Service Worker;
- página offline propia.

---

## Sincronización de trabajos

PW Hub mantiene `hub/data/unidades.json` como catálogo base y fuente de metadatos, pero complementa automáticamente esa información con los archivos publicados en U1-U5.

Los nuevos HTML, PDF y Markdown compatibles pueden aparecer en el Hub después de ser subidos al repositorio sin tener que registrar manualmente cada ruta en todas las secciones.

Un solo catálogo sincronizado alimenta:

- Unidades;
- resumen general;
- Todos los trabajos;
- Estadísticas.

`unidades.json` sigue siendo útil para nombres, descripciones, destacados y otros metadatos personalizados.

La versión v1.1.0 añade un indicador de estado, conserva la última sincronización conocida, marca con `NUEVO` los trabajos detectados después de la primera visita y consulta la fecha del último commit por ruta cuando GitHub la proporciona.

---

## Documentación

La documentación principal se encuentra en:

```text
hub/docs/
```

### `README.md`

Arquitectura y funcionamiento actual.

### `HISTORIAL.md`

Eventos académicos y técnicos que ya ocurrieron.

### `CHANGELOG.md`

Historial de versiones. `v1.0.0` contiene el desarrollo histórico completo de la etapa basada en fases.

### `ROADMAP.md`

Actualizaciones futuras planeadas para PW Hub.

---

## Versionado

El Hub utiliza a partir de v1.0.0 un esquema tipo SemVer como referencia:

```text
v1.0.0  Base estable
v1.1.0  Nueva actualización funcional
v1.1.1  Corrección puntual
```

Las versiones planeadas son opcionales y no tienen una fecha obligatoria de implementación.

---

## Identidad visual

Los recursos de marca de PW Hub se encuentran en:

```text
hub/assets/branding/
```

La familia incluye:

- logo maestro;
- logo horizontal;
- logo compacto;
- isotipo principal y variantes;
- favicon en varios tamaños.

El hero principal está construido con HTML y CSS y combina la identidad de PW Hub con los elementos institucionales del TecNM y del Instituto Tecnológico de Tepic.

---

## Apariencia

PW Hub dispone de ocho materiales visuales:

- Normal;
- Liquid Glass;
- Frosted Glass;
- Acrílico;
- Minimal;
- Neon Tech;
- Mate;
- Titanio.

Los materiales se combinan con paletas compatibles, color de acento, densidad y niveles de movimiento.

Las preferencias se guardan localmente en el navegador.

---

## Navegación por vistas internas

La versión **v1.1.1** reorganiza `hub/index.html` para reducir el desplazamiento vertical manteniendo una sola página principal.

La cabecera visual permanece común a todas las vistas. Inicio conserva el Resumen académico; Curso reúne Progreso y U1-U5; Explorar presenta cada herramienta extensa de forma independiente; y Documentación mantiene su propio contexto.

El router vive en:

```text
hub/js/vistas-internas.js
```

y se carga directamente desde `hub/index.html`, separado de la lógica de sincronización.

---

## Modo sin conexión

Después de una visita con internet, el Service Worker puede reutilizar recursos guardados y trabajos cacheados.

Si una navegación no está disponible ni en red ni en caché, PW Hub muestra:

```text
hub/vistas/offline.html
```

La base v1.0.0 sigue siendo un sitio web convencional y no una PWA instalable. La instalación se conserva como posibilidad futura dentro del roadmap.

---


### Markdown oscuro consistente

La base v1.0.0 utiliza tema oscuro en las cuatro superficies donde se renderiza Markdown: visor completo, visor incrustado de Documentación, miniaturas de trabajos por unidad y modal de Vista previa. Los HTML y PDF conservan su presentación original.


## Flujo para nuevas actividades

Una actividad nueva normalmente requiere:

1. guardar el trabajo en la unidad correspondiente;
2. hacer commit y push;
3. dejar que el sincronizador lo detecte si el formato es compatible;
4. editar `unidades.json` solo cuando se deseen metadatos personalizados;
5. registrar el evento en `HISTORIAL.md` cuando sea relevante.

---

## Tecnologías utilizadas

- HTML;
- CSS;
- JavaScript;
- Markdown;
- JSON;
- Git;
- GitHub;
- GitHub Pages;
- Service Worker / Cache API.

---

## Repositorio

**[RobDev512/PW-AD2026](https://github.com/RobDev512/PW-AD2026)**

Git y GitHub se utilizan para mantener el historial de cambios y registrar las actividades realizadas durante el curso.

---

## Autor

**Roberto Carlos Rodríguez Magaña**  
Ingeniería en Sistemas Computacionales  
Instituto Tecnológico de Tepic
