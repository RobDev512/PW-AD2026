/* PW Hub v1.2.2 — Vista PowerPoint (.pptx), mantenimiento U4 C8.
   Interpreta primero los objetos OOXML del PPTX: textos, figuras, imágenes
   y conectores, sin sustituir el PowerPoint por PDF/PNG.
   Conserva pptx-browser como motor alternativo bajo demanda.
   El archivo PPTX no se envía a servidores externos en el modo local.
   La vista Office es opcional cuando el PPTX ya es público en GitHub Pages.
*/
const MOTOR_PPTX = "https://cdn.jsdelivr.net/npm/pptx-browser@4.1.5/+esm";
const MOTOR_PPTX_ALTERNO = "https://esm.sh/pptx-browser@4.1.5";
let motorPromesa = null;

function asegurarEstilosPptx() {
    if (document.getElementById("pw-estilos-visor-pptx")) return;
    const estilo = document.createElement("style");
    estilo.id = "pw-estilos-visor-pptx";
    estilo.textContent = `
        .pw-pptx-visor { display:flex; flex-direction:column; width:100%; height:100%; min-height:0; min-width:0; background:#080f16; color:#e9f3f9; }
        .pw-pptx-barra { flex:0 0 auto; display:flex; gap:8px; align-items:center; flex-wrap:wrap; padding:10px 12px; border-bottom:1px solid #244053; background:#101b26; }
        .pw-pptx-barra button, .pw-pptx-barra a { min-height:32px; padding:6px 10px; display:inline-flex; align-items:center; justify-content:center; color:#dcecf7; border:1px solid #2e5168; background:#0d202d; font:700 12px system-ui,sans-serif; text-decoration:none; border-radius:7px; cursor:pointer; }
        .pw-pptx-barra button:hover, .pw-pptx-barra a:hover { border-color:#42d0ff; color:#fff; }
        .pw-pptx-barra button:disabled { opacity:.4; cursor:default; }
        .pw-pptx-contador { margin-right:auto; font:700 12px system-ui,sans-serif; white-space:nowrap; }
        .pw-pptx-lienzo { flex:1 1 auto; min-height:0; min-width:0; overflow:auto; display:flex; justify-content:center; align-items:flex-start; padding:16px; overscroll-behavior:contain; }
        .pw-pptx-lienzo canvas { max-width:100%; height:auto; display:block; background:white; box-shadow:0 10px 35px #0009; }
        .pw-pptx-lienzo svg { max-width:100%; max-height:100%; height:auto; display:block; flex:0 1 auto; }
        .pw-pptx-lienzo iframe { display:block; width:100%; height:100%; min-height:320px; border:0; background:#fff; }
        .pw-pptx-lienzo.pw-pptx-office, .pw-pptx-lienzo.pw-pptx-respaldo { padding:0; display:block; }
        .pw-pptx-lienzo.pw-pptx-respaldo img { object-fit:contain; display:block; width:100%; height:100%; max-height:100%; background:#0b141c; }
        .pw-pptx-barra [hidden] { display:none !important; }
        .pw-pptx-estado { margin:auto; max-width:650px; padding:22px; text-align:center; line-height:1.6; color:#c2d0db; font-size:13px; }
        .pw-pptx-estado strong { display:block; font-size:15px; color:#fff; margin-bottom:6px; }
        .pw-pptx-estado a { color:#49d5ff; }
        .pw-pptx-nota { flex:0 0 auto; padding:7px 12px; background:#101b26; border-top:1px solid #244053; font:11px system-ui,sans-serif; color:#b5c5cf; }
        .pw-pptx-visor:fullscreen { width:100vw; height:100vh; background:#080f16; }
        @media(max-width:580px) { .pw-pptx-barra { gap:5px; padding:7px; } .pw-pptx-barra button,.pw-pptx-barra a { font-size:11px; padding:5px 7px; } .pw-pptx-lienzo { padding:6px; } .pw-pptx-nota { font-size:10px; } }
    `;
    document.head.appendChild(estilo);
    // Las fuentes originales de esta presentación utilizan Roboto Condensed.
    // Cargarla por CSS si hay conexión; el visor también funciona con fuentes
    // alternativas cuando se consulta sin internet.
    if (!document.getElementById("pw-pptx-fuente-condensada")) {
        const fuente = document.createElement("link");
        fuente.id = "pw-pptx-fuente-condensada";
        fuente.rel = "stylesheet";
        fuente.href = "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap";
        document.head.appendChild(fuente);
    }
}


/*
   Recuperación directa de láminas embebidas en el PPTX (sin servicios externos).
   Resuelve el caso de una presentación compuesta por una infografía exportada
   como imagen: pptx-browser puede dibujar decoraciones, pero no el blip/pic.
   Se usa solo si la imagen cubre un área importante de la diapositiva; para
   presentaciones hechas con texto y formas complejas se conserva el respaldo.
*/
async function reconstruirImagenesDePptx(buffer, numeroDiapositiva, canvas) {
    const bytes = new Uint8Array(buffer);
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const td = new TextDecoder("utf-8");
    const archivos = new Map();
    const fin = Math.max(0, bytes.length - 65557);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= fin; i--) {
        if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) return false;
    let pos = dv.getUint32(eocd + 16, true);
    const cantidad = dv.getUint16(eocd + 10, true);
    for (let n = 0; n < cantidad; n++) {
        if (pos + 46 > bytes.length || dv.getUint32(pos, true) !== 0x02014b50) return false;
        const metodo = dv.getUint16(pos + 10, true);
        const longitud = dv.getUint32(pos + 20, true);
        const nombreLen = dv.getUint16(pos + 28, true);
        const extraLen = dv.getUint16(pos + 30, true);
        const comentarioLen = dv.getUint16(pos + 32, true);
        const local = dv.getUint32(pos + 42, true);
        const nombre = td.decode(bytes.subarray(pos + 46, pos + 46 + nombreLen));
        archivos.set(nombre, {metodo, longitud, local});
        pos += 46 + nombreLen + extraLen + comentarioLen;
    }
    const leer = async nombre => {
        const f = archivos.get(nombre);
        if (!f || f.local + 30 > bytes.length || dv.getUint32(f.local, true) !== 0x04034b50) return null;
        const desde = f.local + 30 + dv.getUint16(f.local + 26, true) + dv.getUint16(f.local + 28, true);
        if (desde + f.longitud > bytes.length) return null;
        const comprimido = bytes.slice(desde, desde + f.longitud);
        if (f.metodo === 0) return comprimido;
        if (f.metodo !== 8 || typeof DecompressionStream !== "function") return null;
        const flujo = new Blob([comprimido]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        return new Uint8Array(await new Response(flujo).arrayBuffer());
    };
    const leerXml = async nombre => {
        const datos = await leer(nombre);
        if (!datos) return null;
        const doc = new DOMParser().parseFromString(td.decode(datos), "application/xml");
        return doc.getElementsByTagName("parsererror").length ? null : doc;
    };
    const buscar = (raiz, nombre) => [...(raiz?.getElementsByTagName("*") || [])].filter(x => x.localName === nombre);
    const primero = (raiz, nombre) => buscar(raiz, nombre)[0] || null;
    const atributo = (nodo, nombre) => {
        if (!nodo) return "";
        for (const a of nodo.attributes || []) if (a.localName === nombre) return a.value;
        return "";
    };
    const rutaRelativa = (ruta, target) => {
        if (!target || /^(?:https?:|data:)/i.test(target)) return null;
        return new URL(target, "https://pptx.local/" + ruta).pathname.slice(1);
    };
    const relaciones = async ruta => {
        const nombre = ruta.replace(/^(.*\/)?([^/]+)$/, (_,carpeta,archivo) => `${carpeta || ""}_rels/${archivo}.rels`);
        const doc = await leerXml(nombre);
        const mapa = new Map();
        for (const x of buscar(doc,"Relationship")) {
            const id=x.getAttribute("Id"), destino=x.getAttribute("Target");
            if (id && destino && x.getAttribute("TargetMode") !== "External") mapa.set(id, rutaRelativa(ruta,destino));
        }
        return mapa;
    };

    const pres = await leerXml("ppt/presentation.xml");
    const tam = primero(pres, "sldSz");
    const ancho = Number(tam?.getAttribute("cx")) || 12192000;
    const alto = Number(tam?.getAttribute("cy")) || 6858000;
    const relPres = await relaciones("ppt/presentation.xml");
    const ids = buscar(pres, "sldId");
    let rutaSlide = relPres.get(atributo(ids[numeroDiapositiva],"id"));
    if (!rutaSlide) rutaSlide = `ppt/slides/slide${numeroDiapositiva+1}.xml`;
    const slide = await leerXml(rutaSlide);
    if (!slide) return false;
    const relSlide = await relaciones(rutaSlide);
    const fuentes = [];
    for (const pic of buscar(slide, "pic")) {
        const relleno = primero(pic,"blipFill");
        const blip = primero(relleno,"blip");
        const id = atributo(blip,"embed");
        const rutaMedia = relSlide.get(id);
        const xfrm = primero(primero(pic,"spPr"),"xfrm");
        const off = primero(xfrm,"off"), ext=primero(xfrm,"ext");
        if (!rutaMedia || !off || !ext) continue;
        const box = {
            x:Number(off.getAttribute("x")), y:Number(off.getAttribute("y")),
            w:Number(ext.getAttribute("cx")), h:Number(ext.getAttribute("cy"))
        };
        if (![box.x,box.y,box.w,box.h].every(Number.isFinite) || box.w<=0 || box.h<=0) continue;
        const rect = primero(relleno,"srcRect");
        const crop = rect ? ["l","t","r","b"].map(k=>Number(rect.getAttribute(k)||0)/100000) : [0,0,0,0];
        fuentes.push({rutaMedia,box,crop});
    }
    // Para una imagen de fondo insertada como relleno de diapositiva.
    const fondo = primero(primero(slide,"bgPr"),"blip");
    if (fondo) {
        const rutaMedia = relSlide.get(atributo(fondo,"embed"));
        if (rutaMedia) fuentes.unshift({rutaMedia,box:{x:0,y:0,w:ancho,h:alto},crop:[0,0,0,0]});
    }
    // Un conjunto de fotos pequeñas no constituye una diapositiva completa.
    // Exigir al menos una imagen dominante evita presentar una falsa vista.
    const grande = fuentes.some(({box})=> {
        const x1=Math.max(0,box.x), y1=Math.max(0,box.y);
        const x2=Math.min(ancho,box.x+box.w), y2=Math.min(alto,box.y+box.h);
        return Math.max(0,x2-x1)*Math.max(0,y2-y1)/(ancho*alto) >= .52;
    });
    if (!grande) return false;
    const contexto = canvas.getContext("2d", {willReadFrequently:true});
    if (!contexto) return false;
    // No borrar el dibujo existente hasta confirmar que se han decodificado
    // los medios. En diapositivas gráficas, la ilustración es la propia lámina.
    const medios = [];
    try {
        for (const f of fuentes) {
            const datos = await leer(f.rutaMedia);
            if (!datos || !/\.(?:png|jpe?g|gif|webp|svg)$/i.test(f.rutaMedia)) continue;
            const ext=f.rutaMedia.split(".").pop().toLowerCase();
            const mime={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml"}[ext];
            const url=URL.createObjectURL(new Blob([datos],{type:mime}));
            let img;
            try {
                img=new Image();
                img.src=url;
                await img.decode();
            } finally { URL.revokeObjectURL(url); }
            if (img.naturalWidth > 0) medios.push({...f,img});
        }
        if (!medios.length) return false;
        contexto.fillStyle="#ffffff";
        contexto.fillRect(0,0,canvas.width,canvas.height);
        for (const {img,box,crop} of medios) {
            const [l,t,r,b]=crop;
            const sx=img.naturalWidth*l, sy=img.naturalHeight*t;
            const sw=img.naturalWidth*Math.max(.001,1-l-r);
            const sh=img.naturalHeight*Math.max(.001,1-t-b);
            contexto.drawImage(img,sx,sy,sw,sh,
                box.x/ancho*canvas.width,box.y/alto*canvas.height,
                box.w/ancho*canvas.width,box.h/alto*canvas.height);
        }
        return true;
    } catch(error) {
        console.warn("PW Hub: no se pudieron recuperar las imágenes internas del PPTX.",error);
        return false;
    }
}

async function obtenerMotorPptx() {
    if (!motorPromesa) {
        motorPromesa = import(MOTOR_PPTX)
            .catch(() => import(MOTOR_PPTX_ALTERNO))
            .then(modulo => {
                if (typeof modulo.PptxRenderer !== "function") throw new Error("El motor PPTX no expuso PptxRenderer.");
                return modulo.PptxRenderer;
            })
            .catch(error => { motorPromesa = null; throw error; });
    }
    return motorPromesa;
}

/**
 * @param {{ruta:string,nombre:string,contenedor:HTMLElement,vigente?:()=>boolean}} opciones
 * @returns {Promise<void>}
 */
export async function montarVisorPptx({ruta, nombre, contenedor, vigente = () => true}) {
    asegurarEstilosPptx();
    if (typeof contenedor.pwPptxCleanup === "function") contenedor.pwPptxCleanup();
    let destruido = false, renderer = null, diapositiva = 0, secuencia = 0;
    let bytesPptx = null;
    let rendererOOXML = null;
    let observador = null;
    const abortController = new AbortController();
    const activo = () => !destruido && vigente() && contenedor.isConnected;
    contenedor.pwPptxCleanup = () => {
        if (destruido) return;
        destruido = true;
        abortController.abort();
        observador?.disconnect();
        renderer?.destroy();
        renderer = null;
    };

    const visor = document.createElement("div");
    visor.className = "pw-pptx-visor";
    visor.innerHTML = `
        <div class="pw-pptx-barra" role="toolbar" aria-label="Controles de la presentación">
            <span class="pw-pptx-contador" aria-live="polite">Preparando PowerPoint…</span>
            <button type="button" data-pptx="prev" disabled aria-label="Diapositiva anterior">◀ Anterior</button>
            <button type="button" data-pptx="next" disabled aria-label="Diapositiva siguiente">Siguiente ▶</button>
            <button type="button" data-pptx="full" title="Pantalla completa">⛶</button>
            <a data-pptx="original" download title="Guardar el PowerPoint original en tu dispositivo">Descargar PPTX</a>
        </div>
        <div class="pw-pptx-lienzo"><div class="pw-pptx-estado" role="status">Cargando diapositivas desde el PowerPoint original…</div></div>
        <div class="pw-pptx-nota">Vista local de las diapositivas del PPTX. La tipografía y algunos efectos pueden variar.</div>
    `;
    contenedor.replaceChildren(visor);

    const barra = visor.querySelector(".pw-pptx-barra");
    const lienzo = visor.querySelector(".pw-pptx-lienzo");
    const contador = barra.querySelector(".pw-pptx-contador");
    const anterior = barra.querySelector('[data-pptx="prev"]');
    const siguiente = barra.querySelector('[data-pptx="next"]');
    barra.querySelector('[data-pptx="original"]').href = ruta;
    const URLPUBLICA = new URL(ruta, document.baseURI);
    const enPages = URLPUBLICA.protocol === "https:" && URLPUBLICA.hostname === "robdev512.github.io" && URLPUBLICA.pathname.startsWith("/PW-AD2026/");
    let modoOffice = false;
    let enRespaldo = false;
    let canvas = document.createElement("canvas");
    const nota = visor.querySelector(".pw-pptx-nota");
    const estadoInicialNota = nota.textContent;

    // Detecta un lienzo que aparentemente solo tiene fondo y ornamentos.
    // Evita declarar exitosa una vista casi en blanco, como ocurre con
    // algunos recursos PowerPoint que el motor local no interpreta.
    const estaCasiVacio = (lienzoCanvas) => {
        try {
            const contexto = lienzoCanvas.getContext("2d", {willReadFrequently: true});
            const ancho = lienzoCanvas.width;
            const alto = lienzoCanvas.height;
            if (!contexto || ancho < 100 || alto < 100) return false;
            const pixels = contexto.getImageData(0, 0, ancho, alto).data;
            const pasoX = Math.max(2, Math.floor(ancho / 65));
            const pasoY = Math.max(2, Math.floor(alto / 40));
            let muestras = 0, marcas = 0;
            // Ignora la cabecera: puede quedar pintada aunque toda la zona
            // principal de la diapositiva esté vacía.
            for (let y = Math.floor(alto * 0.20); y < alto * 0.92; y += pasoY) {
                for (let x = Math.floor(ancho * 0.07); x < ancho * 0.93; x += pasoX) {
                    const i = (y * ancho + x) * 4;
                    if (pixels[i+3] < 100) continue;
                    muestras++;
                    const r=pixels[i], g=pixels[i+1], b=pixels[i+2];
                    if (Math.min(r,g,b) < 224 || Math.max(r,g,b)-Math.min(r,g,b)>24) marcas++;
                }
            }
            return muestras > 50 && marcas / muestras < 0.007;
        } catch {
            // La lectura de píxeles puede estar bloqueada por una imagen
            // externa. En tal caso no declaramos la diapositiva vacía.
            return false;
        }
    };

    // El PDF y el PNG son recursos independientes. No deben reemplazar automáticamente
    // la vista PPTX cuando falle la interpretación de una diapositiva.

    const mostrarError = async error => {
        if (!activo()) return;
        console.warn("PW Hub: error al interpretar PPTX", error);
        // También funciona si el motor externo no carga o falla al pintar.
        // Antes de recurrir a una exportación, extraer la lámina del PPTX.
        if (bytesPptx && !modoOffice) {
            try {
                const recuperado = document.createElement("canvas");
                recuperado.width = 1280;
                recuperado.height = 720;
                if (await reconstruirImagenesDePptx(bytesPptx, diapositiva, recuperado)) {
                    if (!activo()) return;
                    lienzo.classList.remove("pw-pptx-office", "pw-pptx-respaldo");
                    lienzo.replaceChildren(recuperado);
                    recuperado.style.width = "100%";
                    recuperado.style.maxWidth = "1280px";
                    contador.textContent = `PowerPoint · diapositiva ${diapositiva + 1} (imagen interna)`;
                    anterior.hidden = true;
                    siguiente.hidden = true;
                    nota.textContent = "Imagen recuperada del archivo PowerPoint original (no del PDF). Animaciones y objetos editables pueden variar.";
                    return;
                }
            } catch (problema) {
                console.warn("PW Hub: tampoco fue posible recuperar los medios del PPTX", problema);
            }
        }
        // Sin reemplazar automáticamente un PowerPoint por un PDF:
        // el PDF se encuentra como recurso independiente del proyecto.
        lienzo.classList.remove("pw-pptx-office", "pw-pptx-respaldo");
        lienzo.innerHTML = "";
        const estado = document.createElement("div");
        estado.className = "pw-pptx-estado";
        const titulo = document.createElement("strong");
        titulo.textContent = "No se pudo interpretar la presentación";
        const parrafo = document.createElement("p");
        parrafo.textContent = "Comprueba que el archivo PPTX exista y que tengas conexión para cargar el visor. El PowerPoint original no se ha modificado.";
        const enlace = document.createElement("a");
        enlace.href = ruta;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = "Descargar PPTX original";
        enlace.setAttribute("download", "");
        estado.append(titulo, parrafo, enlace);
        lienzo.append(estado);
        contador.textContent = "Vista no disponible";
    };

    const mostrarDiapositiva = async (indice) => {
        if (!activo() || (!renderer && !rendererOOXML) || modoOffice) return;
        const cantidadDiapositivas = rendererOOXML?.slideCount || renderer.slideCount;
        diapositiva = Math.max(0, Math.min(cantidadDiapositivas - 1, indice));
        const turno = ++secuencia;
        contador.textContent = `Diapositiva ${diapositiva + 1} de ${cantidadDiapositivas}`;
        anterior.disabled = diapositiva === 0;
        siguiente.disabled = diapositiva >= cantidadDiapositivas - 1;
        lienzo.classList.remove("pw-pptx-office", "pw-pptx-respaldo");
        enRespaldo = false;
        anterior.hidden = false;
        siguiente.hidden = false;
        nota.textContent = estadoInicialNota;
        if (rendererOOXML) {
            try {
                const resultado = await rendererOOXML.renderSlide(diapositiva);
                if (!activo() || turno !== secuencia || modoOffice) return;
                lienzo.replaceChildren(resultado.svg);
                nota.textContent = "Vista interpretada directamente desde los objetos, textos e imágenes del PPTX (OOXML). No es el PDF ni el PNG exportado.";
            } catch (error) {
                await mostrarError(error);
            }
            return;
        }
        if (!lienzo.contains(canvas)) lienzo.replaceChildren(canvas);
        try {
            await renderer.renderSlide(diapositiva, canvas, 1280);
            if (!activo() || turno !== secuencia || modoOffice) return;
            canvas.style.width = "100%";
            canvas.style.maxWidth = "1280px";
            if (estaCasiVacio(canvas)) {
                let dibujada = false;
                try {
                    dibujada = bytesPptx && await reconstruirImagenesDePptx(bytesPptx, diapositiva, canvas);
                } catch (error) {
                    console.warn("PW Hub: reconstrucción PPTX no disponible", error);
                }
                if (dibujada && !estaCasiVacio(canvas)) {
                    nota.textContent = "Vista reconstruida desde imágenes incrustadas en el PPTX original. No es la exportación PDF; las animaciones y algunos elementos editables pueden diferir.";
                } else {
                    await mostrarError(new Error("El motor local no pudo representar esta diapositiva. Abre el PDF como recurso independiente si deseas consultar su exportación."));
                }
            }
        } catch (error) { await mostrarError(error); }
    };

    anterior.addEventListener("click", () => { if (!enRespaldo) mostrarDiapositiva(diapositiva - 1); });
    siguiente.addEventListener("click", () => { if (!enRespaldo) mostrarDiapositiva(diapositiva + 1); });
    barra.querySelector('[data-pptx="full"]').addEventListener("click", () => {
        if (document.fullscreenElement === visor) document.exitFullscreen?.();
        else visor.requestFullscreen?.().catch(() => {});
    });
    visor.addEventListener("keydown", evento => {
        if (evento.target instanceof HTMLElement && evento.target.closest("button,a")) return;
        if (evento.key === "ArrowLeft") mostrarDiapositiva(diapositiva - 1);
        if (evento.key === "ArrowRight") mostrarDiapositiva(diapositiva + 1);
    });
    visor.tabIndex = 0;

    // Office Web permite una representación de mayor fidelidad cuando el
    // PPTX ya es accesible públicamente por HTTPS. No funciona en localhost.
    if (enPages) {
        const botonOffice = document.createElement("button");
        botonOffice.type = "button";
        botonOffice.textContent = "Vista Office";
        botonOffice.title = "Abrir la presentación mediante Microsoft Office Online";
        barra.insertBefore(botonOffice, barra.querySelector('[data-pptx="full"]'));
        botonOffice.addEventListener("click", () => {
            modoOffice = !modoOffice;
            botonOffice.textContent = modoOffice ? "Vista local" : "Vista Office";
            anterior.hidden = modoOffice;
            siguiente.hidden = modoOffice;
            if (modoOffice) {
                contador.textContent = "PowerPoint · Microsoft Office";
                lienzo.classList.remove("pw-pptx-respaldo");
                lienzo.classList.add("pw-pptx-office");
                const iframe = document.createElement("iframe");
                iframe.title = `Presentación Office: ${nombre}`;
                iframe.loading = "lazy";
                iframe.referrerPolicy = "no-referrer";
                iframe.src = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(URLPUBLICA.href);
                lienzo.replaceChildren(iframe);
            } else {
                mostrarDiapositiva(diapositiva);
            }
        });
    }

    try {
        const respuesta = await fetch(ruta, {signal: abortController.signal});
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} al abrir el PPTX`);
        const bytes = await respuesta.arrayBuffer();
        bytesPptx = bytes;
        if (!activo()) return;
        // Prioridad: interpretar el PowerPoint real desde OOXML. Este lector
        // conserva la geometría de textos, figuras, imágenes y colores,
        // sin sustituir la diapositiva por una exportación PDF.
        try {
            const {abrirPptxOOXML} = await import("./visor-pptx-ooxml.js");
            rendererOOXML = await abrirPptxOOXML(bytes);
            if (!activo()) return;
            await mostrarDiapositiva(0);
            observador = new MutationObserver(() => {
                if (!contenedor.isConnected || !contenedor.contains(visor)) contenedor.pwPptxCleanup?.();
            });
            observador.observe(contenedor, {childList:true});
            return;
        } catch (errorOoxml) {
            rendererOOXML = null;
            console.warn("PW Hub: interpretación OOXML no disponible; se intentará el motor alternativo.",errorOoxml);
        }
        const Motor = await obtenerMotorPptx();
        if (!activo()) return;
        const instancia = new Motor();
        await instancia.load(bytes);
        if (!activo()) { instancia.destroy(); return; }
        if (!instancia.slideCount) { instancia.destroy(); throw new Error("Presentación sin diapositivas"); }
        renderer = instancia;
        await mostrarDiapositiva(0);
        // Limpiar recursos al retirar el visor del DOM (p. ej. cambiar trabajo).
        observador = new MutationObserver(() => {
            if (!contenedor.isConnected || !contenedor.contains(visor)) contenedor.pwPptxCleanup?.();
        });
        observador.observe(contenedor, {childList:true});
    } catch (error) {
        if (error?.name === "AbortError" || !activo()) return;
        await mostrarError(error);
    }
}
