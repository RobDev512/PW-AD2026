# Roberto Carlos Rodríguez Magaña

**Número de control:** 23400614<br>
**Carrera:** Ingeniería en Sistemas Computacionales<br>
**Institución:** Instituto Tecnológico de Tepic<br>
**Materia:** Programación Web

---

## Portafolio de Programación Web

Este directorio reúne las actividades, ejercicios y proyectos realizados durante la materia, además de **PW Hub**, el portafolio web que organiza el avance académico y sincroniza los trabajos publicados en GitHub.

🌐 **[Ver PW Hub en línea](https://robdev512.github.io/PW-AD2026/23400614_Rodr%C3%ADguez_Maga%C3%B1a_Roberto_Carlos/hub/)**

---

## Estado de la materia

| Unidad | Tema actual del curso | Estado |
| --- | --- | --- |
| U1 | Fundamentos Web, Git y GitHub | ✓ Completada |
| U2 | HTML | ✓ Completada |
| U3 | CSS | ✓ Completada · 10 actividades |
| U4 | Programación del lado del cliente | ✓ Completada · actividades publicadas y detección automática de nuevos archivos |
| U5 | Programación del lado del servidor | ▶ Unidad actual · práctica inicial Node.js/Express |

U4 está **completada para efectos del portafolio**: sus actividades de JavaScript ya quedaron registradas. Sus exámenes, como los de U1–U3, se gestionan fuera del repositorio. **U5 ya comenzó** con `U5/proyectoBase`, una práctica inicial de Node.js y Express. El **Proyecto final CinePass** se desarrolla en un [repositorio propio](https://github.com/RobDev512/CinePass) y se muestra en un apartado separado de U1–U5. Conserva su rúbrica de 100 puntos; la API REST completa y el CRUD siguen pendientes.

---

## Estado de PW Hub

**Versión publicada actual: v1.2.2 - Estabilidad móvil y organización académica**

**Próxima actualización planeada: v1.3.0 - Proyectos inteligentes y GitHub**

v1.2.2 consolida el responsive móvil del visor de proyectos, gestos táctiles para imágenes y Draw.io, materiales móviles, nombres académicos consistentes y árboles plegables de archivos por unidad. El panel de U4 registra sus actividades y sigue detectando archivos nuevos desde GitHub; U5 ya muestra su práctica `proyectoBase` con los archivos Node.js/Express publicados. El visor de U4 permite ejecutar ejercicios JavaScript de consola de forma aislada, sin cambiar el número de versión técnica. La Tarea 1 permite explorar PDF, PNG y PPTX por separado; la diapositiva PowerPoint se reconstruye a partir de sus propios objetos OOXML.

---

## Organización principal

```text
23400614_Rodríguez_Magaña_Roberto_Carlos/
├── U1/
├── U2/
├── U3/
├── U4/
├── U5/
│   └── proyectoBase/
├── hub/
│   ├── assets/
│   ├── css/
│   ├── data/
│   ├── docs/
│   ├── js/
│   ├── vistas/
│   └── index.html
├── Comandos_Git.md
├── Perfil.md
├── foto.jpg
├── service-worker.js
└── README.md
```

U4 contiene `U4/U4. A1. Tarea 1/` con un PDF principal, una lámina PNG y un PowerPoint editable, además de `U4. A2. Ejercicios.js`, `U4. A3. Ejercicios.js` (dos ejercicios) y `U4. Ejemplos.js`. El proyecto final **CinePass** tiene una sección propia en el Hub con rúbrica de 10 criterios (100 puntos). Su código permanece por ahora fuera de este repositorio, en [RobDev512/CinePass](https://github.com/RobDev512/CinePass), y su [vista previa pública](https://robdev512.github.io/CinePass/) muestra solo el frontend estático.

---

## Unidad 3 cerrada

U3 terminó con diez actividades. PW Hub conserva nombres editoriales consistentes y trata las actividades formadas por carpetas como un solo proyecto académico, permitiendo explorar HTML, CSS, imágenes, SVG, Draw.io y demás recursos sin convertirlos en trabajos independientes.

---

## Unidad 4 — Programación del lado del cliente

La Unidad 4 corresponde a **Programación del lado del cliente**. El catálogo conserva las actividades registradas (A1, A2 y A3) y distingue el archivo complementario `U4. Ejemplos.js`. Una entrega nueva como `U4. A4. Ejercicio.js` aparece automáticamente como **Actividad 4 - Ejercicio de JavaScript** cuando está publicada en GitHub, sin editar manualmente `unidades.json`. Los recursos internos de una misma actividad se agrupan para evitar tarjetas duplicadas. Los `.js` se pueden consultar en modo código original o abrir en el laboratorio JS para **editar una copia temporal, ejecutarla, consultar la consola, proporcionar entradas de `prompt()` y restaurar el original**. Los cambios de prueba no modifican los archivos del repositorio.

---

## Unidad 5 — Programación del lado del servidor

La primera práctica es `U5/proyectoBase`: contiene `index.js`, `package.json` y `package-lock.json`. Inicia un servidor Express en el puerto 3000, sin rutas HTTP definidas. Es código de servidor para Node.js, no un ejercicio ejecutable en el laboratorio JavaScript del navegador.

## Proyecto final — CinePass

**En desarrollo · v0.2.0 — Primera proyección.** Ya tiene Inicio y Cartelera V2 con búsqueda/filtros y un servidor Express de prueba (`/api/salud`). Faltan los módulos de reservas, asientos y boletos, persistencia de datos, API REST completa y CRUD.

- [Repositorio de CinePass](https://github.com/RobDev512/CinePass)
- [Vista previa estática](https://robdev512.github.io/CinePass/)
- [Roadmap de CinePass](https://robdev512.github.io/CinePass/roadmap.html)

CinePass se desarrolla en una carpeta/repo independiente y se integrará al portafolio más adelante. No se mueve ni se duplica en esta actualización.

---

## Funciones principales de PW Hub

- progreso académico U1–U5 y apartado independiente de proyecto final con rúbrica de evaluación;
- catálogo sincronizado con GitHub y creación automática de tarjetas para nuevos trabajos de U1–U5 (requiere conexión);
- tarjetas, vistas previas y visor completo;
- proyectos por carpeta y exploración de recursos;
- árboles plegables de archivos por unidad;
- Draw.io con Diagrama, PNG y XML;
- zoom, paneo, ajuste y pantalla completa;
- pellizco táctil para imágenes y diagramas;
- búsqueda global, filtros, favoritos y destacados;
- Historial, Roadmap y documentación Markdown;
- materiales visuales configurables;
- navegación responsive;
- respaldo offline mediante Service Worker.

---

## Documentación del Hub

La documentación técnica y de versiones está en:

```text
hub/docs/
├── README.md
├── HISTORIAL.md
├── CHANGELOG.md
└── ROADMAP.md
```

El avance académico y el versionado técnico de PW Hub son independientes: agregar una actividad normal no crea por sí sola una nueva versión del Hub.
