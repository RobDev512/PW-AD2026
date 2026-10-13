import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { transform } from "esbuild";
import { minify as minifyHtml } from "html-minifier-terser";
import JavaScriptObfuscator from "javascript-obfuscator";

const __filename = fileURLToPath(import.meta.url);
const HUB_ROOT = path.dirname(__filename);
const STUDENT_ROOT = path.dirname(HUB_ROOT);
const OUTPUT_ROOT = path.join(STUDENT_ROOT, "publicacion");
const OUTPUT_HUB = path.join(OUTPUT_ROOT, "hub");
const USAR_OFUSCACION = process.argv.includes("--obfuscate");
const procesados = new Set();
const advertencias = [];

async function existe(ruta) {
    try {
        await fs.access(ruta);
        return true;
    } catch {
        return false;
    }
}

async function crearDirectorio(ruta) {
    await fs.mkdir(ruta, { recursive: true });
}

function estaDentroDe(rutaPadre, rutaHija) {
    const relativa = path.relative(rutaPadre, rutaHija);
    return (relativa !== "" && !relativa.startsWith("..") && !path.isAbsolute(relativa)) || rutaPadre === rutaHija;
}

function esReferenciaExterna(referencia) {
    const valor = referencia.trim();
    return valor === "" || valor.startsWith("#") || valor.startsWith("http://") || valor.startsWith("https://") || valor.startsWith("//") || valor.startsWith("mailto:") || valor.startsWith("tel:") || valor.startsWith("data:") || valor.startsWith("javascript:");
}

function limpiarReferencia(referencia) {
    return referencia.trim().replace(/^<|>$/g, "").split("#")[0].split("?")[0].trim();
}

async function procesarJavaScript(codigo) {
    const resultado = await transform(codigo, {
        loader: "js",
        minifyWhitespace: true,
        minifySyntax: true,
        minifyIdentifiers: false,
        legalComments: "none",
        sourcemap: false,
        target: "es2018"
    });

    let salida = resultado.code;

    if (USAR_OFUSCACION) {
        salida = JavaScriptObfuscator.obfuscate(salida, {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            identifierNamesGenerator: "hexadecimal",
            renameGlobals: false,
            selfDefending: false,
            simplify: true,
            splitStrings: false,
            stringArray: true,
            stringArrayCallsTransform: false,
            stringArrayEncoding: ["base64"],
            stringArrayThreshold: 0.55,
            unicodeEscapeSequence: false
        }).getObfuscatedCode();
    }

    return salida;
}

async function procesarCss(codigo) {
    const resultado = await transform(codigo, {
        loader: "css",
        minify: true,
        legalComments: "none",
        sourcemap: false
    });
    return resultado.code;
}

async function procesarHtml(codigo) {
    return minifyHtml(codigo, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: false,
        sortClassName: false,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: false
    });
}

async function copiarArchivoProcesado(origen, destino) {
    await crearDirectorio(path.dirname(destino));
    const extension = path.extname(origen).toLowerCase();

    if (extension === ".js") {
        const codigo = await fs.readFile(origen, "utf8");
        await fs.writeFile(destino, await procesarJavaScript(codigo), "utf8");
        return;
    }

    if (extension === ".css") {
        const codigo = await fs.readFile(origen, "utf8");
        await fs.writeFile(destino, await procesarCss(codigo), "utf8");
        return;
    }

    if (extension === ".html" || extension === ".htm") {
        const codigo = await fs.readFile(origen, "utf8");
        await fs.writeFile(destino, await procesarHtml(codigo), "utf8");
        return;
    }

    if (extension === ".json") {
        try {
            const contenido = JSON.parse(await fs.readFile(origen, "utf8"));
            await fs.writeFile(destino, JSON.stringify(contenido), "utf8");
            return;
        } catch {}
    }

    await fs.copyFile(origen, destino);
}

async function copiarCarpeta(origen, destino) {
    if (!(await existe(origen))) return;
    const entradas = await fs.readdir(origen, { withFileTypes: true });

    for (const entrada of entradas) {
        const origenEntrada = path.join(origen, entrada.name);
        const destinoEntrada = path.join(destino, entrada.name);
        if (entrada.isDirectory()) {
            await copiarCarpeta(origenEntrada, destinoEntrada);
        } else {
            await copiarArchivoProcesado(origenEntrada, destinoEntrada);
        }
    }
}

function extraerReferenciasHtml(contenido) {
    const referencias = [];
    const expresion = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
    for (const coincidencia of contenido.matchAll(expresion)) referencias.push(coincidencia[1]);
    return referencias;
}

function extraerReferenciasMarkdown(contenido) {
    const referencias = [];
    const expresion = /!?\[[^\]]*\]\(([^)]+)\)/g;
    for (const coincidencia of contenido.matchAll(expresion)) referencias.push(coincidencia[1].trim().split(/\s+/)[0]);
    return referencias;
}

function extraerReferenciasCss(contenido) {
    const referencias = [];
    const urls = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
    for (const coincidencia of contenido.matchAll(urls)) referencias.push(coincidencia[1]);
    const imports = /@import\s+(?:url\()?["']([^"']+)["']/gi;
    for (const coincidencia of contenido.matchAll(imports)) referencias.push(coincidencia[1]);
    return referencias;
}

async function copiarDependencia(origen) {
    const rutaNormalizada = path.normalize(origen);
    if (procesados.has(rutaNormalizada)) return;
    procesados.add(rutaNormalizada);

    if (!estaDentroDe(STUDENT_ROOT, rutaNormalizada)) {
        advertencias.push(`Se omitió una ruta fuera de la carpeta del estudiante: ${rutaNormalizada}`);
        return;
    }

    if (!(await existe(rutaNormalizada))) {
        advertencias.push(`No se encontró el recurso: ${rutaNormalizada}`);
        return;
    }

    const estadisticas = await fs.stat(rutaNormalizada);
    if (estadisticas.isDirectory()) {
        for (const nombre of await fs.readdir(rutaNormalizada)) await copiarDependencia(path.join(rutaNormalizada, nombre));
        return;
    }

    const relativa = path.relative(STUDENT_ROOT, rutaNormalizada);
    const destino = path.join(OUTPUT_ROOT, relativa);
    await copiarArchivoProcesado(rutaNormalizada, destino);

    const extension = path.extname(rutaNormalizada).toLowerCase();
    let referencias = [];

    if ([".html", ".htm", ".md", ".css"].includes(extension)) {
        const contenido = await fs.readFile(rutaNormalizada, "utf8");
        if (extension === ".html" || extension === ".htm") referencias = extraerReferenciasHtml(contenido);
        if (extension === ".md") referencias = extraerReferenciasMarkdown(contenido);
        if (extension === ".css") referencias = extraerReferenciasCss(contenido);
    }

    for (const referenciaOriginal of referencias) {
        if (esReferenciaExterna(referenciaOriginal)) continue;
        const referencia = limpiarReferencia(referenciaOriginal);
        if (!referencia) continue;
        const dependencia = referencia.startsWith("/")
            ? path.join(STUDENT_ROOT, referencia.slice(1))
            : path.resolve(path.dirname(rutaNormalizada), referencia);
        await copiarDependencia(dependencia);
    }
}

async function copiarTrabajosAcademicos() {
    const rutaDatos = path.join(HUB_ROOT, "data", "unidades.json");
    const datos = JSON.parse(await fs.readFile(rutaDatos, "utf8"));
    const trabajos = datos.unidades.flatMap((unidad) => unidad.trabajos || []);

    for (const trabajo of trabajos) {
        if (!trabajo.ruta || esReferenciaExterna(trabajo.ruta)) continue;
        const origen = path.resolve(HUB_ROOT, limpiarReferencia(trabajo.ruta));
        await copiarDependencia(origen);
    }
}

async function crearPaginaRaiz() {
    const contenido = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0;url=./hub/">
<title>Programación Web</title>
</head>
<body>
<p><a href="./hub/">Abrir portafolio</a></p>
</body>
</html>`;
    await fs.writeFile(path.join(OUTPUT_ROOT, "index.html"), await procesarHtml(contenido), "utf8");
}

async function compilarHub() {
    console.log("\nConstruyendo versión de publicación...");
    console.log(USAR_OFUSCACION ? "Modo: minificado + ofuscación JavaScript." : "Modo: minificado.");

    await fs.rm(OUTPUT_ROOT, { recursive: true, force: true });
    await crearDirectorio(OUTPUT_HUB);

    await copiarArchivoProcesado(path.join(HUB_ROOT, "index.html"), path.join(OUTPUT_HUB, "index.html"));

    for (const carpeta of ["assets", "css", "js", "data", "docs"]) {
        await copiarCarpeta(path.join(HUB_ROOT, carpeta), path.join(OUTPUT_HUB, carpeta));
    }

    await copiarTrabajosAcademicos();
    await crearPaginaRaiz();

    console.log(`\nVersión generada en:\n${OUTPUT_ROOT}`);

    if (advertencias.length > 0) {
        console.log("\nAdvertencias:");
        advertencias.forEach((advertencia) => console.log(`- ${advertencia}`));
    }

    console.log("\nLa carpeta de código fuente no fue modificada.");
    console.log("No se generaron source maps.");
    console.log("\nPara probar la versión generada:");
    console.log("npm run preview");
    console.log("\nDespués abre:");
    console.log("http://localhost:4173/");

    if (USAR_OFUSCACION) {
        console.log("\nImportante: la ofuscación dificulta leer el JavaScript, pero no puede hacerlo secreto.");
    }

    console.log("");
}

compilarHub().catch((error) => {
    console.error("\nLa compilación falló:");
    console.error(error);
    process.exitCode = 1;
});
