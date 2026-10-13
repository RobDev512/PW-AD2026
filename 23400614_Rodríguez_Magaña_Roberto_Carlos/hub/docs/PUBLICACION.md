# Publicación y versión de producción

## Estado

**Código fuente del Hub en GitHub:** Sí  
**Repositorio:** `RobDev512/PW-AD2026`  
**Carpeta:** `23400614_Rodríguez_Magaña_Roberto_Carlos/hub/`  
**Despliegue público mediante GitHub Pages:** No configurado por este documento

---

# Qué se publica en el repositorio

Se versiona el código fuente del Hub:

- HTML;
- CSS;
- JavaScript;
- JSON;
- documentación;
- logos institucionales;
- scripts de build.

No se versionan:

- `node_modules/`;
- la carpeta generada `publicacion/`.

---

# Build local

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

---

# Versión protegida

El build protegido:

- minifica HTML;
- minifica CSS;
- minifica JavaScript;
- no genera source maps;
- aplica ofuscación JavaScript opcional.

La ofuscación dificulta la lectura casual, pero no vuelve secreto el código que se ejecuta en el navegador.

---

# Actualizaciones futuras

Cuando cambie el Hub fuente:

```bash
npm run build:protegido
```

debe ejecutarse nuevamente para regenerar la versión local de producción.

Las nuevas actividades académicas pueden subirse al repositorio sin crear nuevas fases del roadmap.
