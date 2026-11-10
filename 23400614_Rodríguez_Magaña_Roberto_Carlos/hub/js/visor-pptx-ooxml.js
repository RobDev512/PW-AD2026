/* PW Hub · lector OOXML de presentaciones PowerPoint.
   Interpreta en el navegador figuras, texto enriquecido, imágenes y conectores
   directamente del PPTX, sin convertir el archivo a PDF ni descargarlo.
   Soporte acotado: no interpreta SmartArt complejo, animaciones ni gráficos 3D.
*/
const EMU = 914400;
const PX_POR_PULGADA = 100;
const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_HTML = 'http://www.w3.org/1999/xhtml';
const DECODER = new TextDecoder('utf-8');
const child = (n,tag) => n ? Array.from(n.children).find(v=>v.localName===tag)||null : null;
const kids = (n,tag) => n ? Array.from(n.children).filter(v=>!tag||v.localName===tag) : [];
const deep = (n,tag) => n ? Array.from(n.getElementsByTagName('*')).find(v=>v.localName===tag)||null : null;
const descendants = (n,tag) => n ? Array.from(n.getElementsByTagName('*')).filter(v=>v.localName===tag) : [];
const attr = (n,key,fallback='')=> n?.getAttribute(key)??fallback;
const locAttr = (n,key)=>Array.from(n?.attributes||[]).find(a=>a.localName===key)?.value || '';
const emu = v => Number(v||0) / EMU * PX_POR_PULGADA;
const svg = (name,values={})=>{const n=document.createElementNS(NS_SVG,name);for(const [k,v] of Object.entries(values))n.setAttribute(k,String(v));return n;};
const html = (name)=>document.createElementNS(NS_HTML,name);
const color = (part,def=null)=>{
    const solid=part?.localName==='solidFill' ? part : child(part,'solidFill');
    if(!solid)return def;
    const rgb=child(solid,'srgbClr');
    if(rgb)return '#'+attr(rgb,'val','000000');
    const sys=child(solid,'sysClr');
    if(sys)return '#'+attr(sys,'lastClr','000000');
    return def;
};
function archivosZip(buffer){
    const bytes=new Uint8Array(buffer);
    const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    const files=new Map();
    let fin=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(dv.getUint32(i,true)===0x06054b50){fin=i;break;}}
    if(fin<0)throw Error('ZIP del PowerPoint no reconocido');
    let pos=dv.getUint32(fin+16,true);
    const total=dv.getUint16(fin+10,true);
    for(let i=0;i<total;i++){
        if(dv.getUint32(pos,true)!==0x02014b50)throw Error('Directorio ZIP inválido');
        const metodo=dv.getUint16(pos+10,true),len=dv.getUint32(pos+20,true);
        const nlen=dv.getUint16(pos+28,true),extra=dv.getUint16(pos+30,true),coment=dv.getUint16(pos+32,true);
        const local=dv.getUint32(pos+42,true),nombre=DECODER.decode(bytes.subarray(pos+46,pos+46+nlen));
        files.set(nombre,{metodo,len,local});pos+=46+nlen+extra+coment;
    }
    async function leer(name){
        const f=files.get(name);
        if(!f)return null;
        const desde=f.local+30+dv.getUint16(f.local+26,true)+dv.getUint16(f.local+28,true);
        const compressed=bytes.slice(desde,desde+f.len);
        if(f.metodo===0)return compressed;
        if(f.metodo!==8||typeof DecompressionStream!=='function')throw Error('Descompresión ZIP no disponible en este navegador');
        const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Uint8Array(await new Response(stream).arrayBuffer());
    }
    async function xml(name){
        const b=await leer(name);if(!b)return null;
        const d=new DOMParser().parseFromString(DECODER.decode(b),'application/xml');
        if(d.getElementsByTagName('parsererror').length)throw Error('OOXML no válido: '+name);
        return d;
    }
    return {leer,xml};
}
function rutaDestino(base,target){
    if(!target||/^https?:/i.test(target))return null;
    const parts=(base.replace(/[^/]*$/,'')+target).split('/');
    const normalized=[];
    for(const p of parts){if(p==='..')normalized.pop();else if(p&&p!=='.')normalized.push(p);}
    return normalized.join('/');
}
async function relaciones(zip,ruta){
    const nombre=ruta.replace(/^(.*\/)([^/]+)$/,'$1_rels/$2.rels');
    const doc=await zip.xml(nombre);const map=new Map();
    for(const n of descendants(doc,'Relationship')){
        if(attr(n,'TargetMode')==='External')continue;
        map.set(attr(n,'Id'),rutaDestino(ruta,attr(n,'Target')));
    }
    return map;
}
function caja(shape){
    const xfrm=child(child(shape,'spPr'),'xfrm');
    const o=child(xfrm,'off'),e=child(xfrm,'ext');
    return {x:emu(attr(o,'x')),y:emu(attr(o,'y')),w:emu(attr(e,'cx')),h:emu(attr(e,'cy'))};
}
function crearForma(shape,box){
    const sp=child(shape,'spPr');
    const geo=child(sp,'prstGeom');
    const kind=attr(geo,'prst','rect');
    const noFill=!!child(sp,'noFill');
    const fill=noFill?'none':color(sp,'none');
    const ln=child(sp,'ln');
    const stroke=child(ln,'noFill')?'none':color(ln,'none');
    const sw=ln&&stroke!=='none'?Math.max(.5,emu(attr(ln,'w')||'12700')):0;
    if(kind==='leftBrace'){
        const {x,y,w,h}=box;
        const path=`M ${x+w} ${y} Q ${x+w*.25} ${y} ${x+w*.25} ${y+h*.07} L ${x+w*.25} ${y+h*.45} Q ${x+w*.25} ${y+h*.5} ${x} ${y+h*.5} Q ${x+w*.25} ${y+h*.5} ${x+w*.25} ${y+h*.55} L ${x+w*.25} ${y+h*.93} Q ${x+w*.25} ${y+h} ${x+w} ${y+h}`;
        return svg('path',{d:path,fill:'none',stroke, 'stroke-width':sw,'stroke-linecap':'round'});
    }
    if(kind==='line'||(box.w===0||box.h===0)){
        return svg('line',{x1:box.x,y1:box.y,x2:box.x+box.w,y2:box.y+box.h,stroke, 'stroke-width':sw||1.2});
    }
    const rect=svg('rect',{x:box.x,y:box.y,width:box.w,height:box.h,fill,stroke,'stroke-width':sw});
    if(kind==='roundRect'){
        const gd=deep(geo,'gd');
        const matched=attr(gd,'fmla').match(/val\s+(\d+)/);
        const fraction=matched?Number(matched[1])/100000:.2;
        const r=Math.min(box.w,box.h)*Math.min(.5,Math.max(0,fraction));
        rect.setAttribute('rx',String(r));rect.setAttribute('ry',String(r));
    }
    return rect;
}
function textoDeForma(shape,box){
    const tx=child(shape,'txBody');
    if(!tx)return null;
    const paragraphs=kids(tx,'p');
    if(!paragraphs.some(p=>descendants(p,'t').some(t=>t.textContent?.length)))return null;
    const body=child(tx,'bodyPr');
    const insets={left:emu(attr(body,'lIns')),right:emu(attr(body,'rIns')),top:emu(attr(body,'tIns')),bottom:emu(attr(body,'bIns'))};
    const fo=svg('foreignObject',{x:box.x,y:box.y,width:box.w,height:box.h});
    const shell=html('div');
    Object.assign(shell.style,{
        boxSizing:'border-box',width:'100%',height:'100%',overflow:'hidden',
        padding:`${insets.top}px ${insets.right}px ${insets.bottom}px ${insets.left}px`,
        display:'flex',flexDirection:'column',justifyContent:attr(body,'anchor')==='ctr'?'center':attr(body,'anchor')==='b'?'flex-end':'flex-start',
        fontFamily:'Roboto Condensed, Arial Narrow, sans-serif'
    });
    for(const p of paragraphs){
        const pp=child(p,'pPr');const alineacion=attr(pp,'algn','l');
        const pn=html('div');
        Object.assign(pn.style,{
            textAlign:alineacion==='ctr'?'center':alineacion==='r'?'right':'left',
            whiteSpace:'pre-wrap',overflowWrap:'normal',wordBreak:'normal',
            flexShrink:'0',minHeight:'0',lineHeight:'1.02'
        });
        const sp=child(pp,'lnSpc');
        const pct=child(sp,'spcPct');
        if(pct)pn.style.lineHeight=String(Number(attr(pct,'val'))/100000);
        const pts=child(sp,'spcPts');
        if(pts)pn.style.lineHeight=(Number(attr(pts,'val'))/100*PX_POR_PULGADA/72)+'px';
        const marr=Number(attr(pp,'marL')||0);
        if(marr)pn.style.paddingLeft=emu(marr)+'px';
        const ind=Number(attr(pp,'indent')||0);
        if(ind)pn.style.textIndent=emu(ind)+'px';
        const bullet=child(pp,'buChar');
        if(bullet){const bu=html('span');bu.textContent=attr(bullet,'char','•')+'  ';pn.append(bu);}
        let pxMax=0;
        for(const item of kids(p)){
            if(item.localName==='br'){pn.append(html('br'));continue;}
            if(item.localName!=='r'&&item.localName!=='fld')continue;
            const t=child(item,'t');if(!t)continue;
            const rpr=child(item,'rPr')||child(item,'pPr');
            const span=html('span');span.textContent=t.textContent||'';
            const pt=Number(attr(rpr,'sz')||1500)/100;
            const px=pt*PX_POR_PULGADA/72;
            span.style.fontSize=px+'px';pxMax=Math.max(px,pxMax);
            const family=attr(child(rpr,'latin'),'typeface','Roboto Condensed');
            span.style.fontFamily=`"${family.replace(/["<>]/g,'')}", "${/mono/i.test(family)?'Consolas':'Roboto Condensed'}", ${/mono/i.test(family)?'monospace':'"Arial Narrow", sans-serif'}`;
            if(attr(rpr,'b')==='1')span.style.fontWeight='700';
            if(attr(rpr,'i')==='1')span.style.fontStyle='italic';
            span.style.color=color(rpr,'#1a1a1a');
            pn.append(span);
        }
        if(pxMax&&pn.style.lineHeight==='1.02')pn.style.lineHeight='1';
        shell.append(pn);
    }
    fo.append(shell);return fo;
}
function bytesBase64(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.slice(i,i+8192));return btoa(s);}
async function imagenDeForma(shape,box,rels,zip){
    const fill=child(shape,'blipFill');const blip=child(fill,'blip');
    const ruta=rels.get(locAttr(blip,'embed'));
    if(!ruta)return null;
    const bytes=await zip.leer(ruta);if(!bytes)return null;
    const ext=ruta.split('.').pop().toLowerCase();
    const mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',svg:'image/svg+xml',webp:'image/webp'}[ext];
    if(!mime)return null;
    const n=svg('image',{x:box.x,y:box.y,width:box.w,height:box.h,href:`data:${mime};base64,${bytesBase64(bytes)}`,preserveAspectRatio:'xMidYMid meet'});
    return n;
}
export async function abrirPptxOOXML(buffer){
    const zip=archivosZip(buffer);
    const pres=await zip.xml('ppt/presentation.xml');
    const slideSize=deep(pres,'sldSz');
    if(!slideSize)throw Error('PowerPoint sin dimensiones de diapositiva');
    const width=emu(attr(slideSize,'cx')),height=emu(attr(slideSize,'cy'));
    const list=descendants(pres,'sldId');
    const relPres=await relaciones(zip,'ppt/presentation.xml');
    const rutas=list.map((id,i)=>relPres.get(locAttr(id,'id'))||`ppt/slides/slide${i+1}.xml`);
    if(!rutas.length)throw Error('PowerPoint sin diapositivas');
    async function renderSlide(index){
        const ruta=rutas[index],doc=await zip.xml(ruta),rel=await relaciones(zip,ruta);
        if(!doc)throw Error('No se encontró el contenido de la diapositiva');
        const tree=deep(doc,'spTree');
        const out=svg('svg',{xmlns:NS_SVG,viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':`Diapositiva ${index+1} del PowerPoint`});
        out.style.cssText='display:block;max-width:100%;max-height:100%;width:100%;height:auto;object-fit:contain;background:#fff;box-shadow:0 8px 25px #0007;';
        out.append(svg('rect',{x:0,y:0,width,height,fill:'#ffffff'}));
        let shapes=0,visibles=0;
        for(const part of kids(tree)){
            if(!['sp','pic','cxnSp'].includes(part.localName))continue;
            const box=caja(part);
            if(![box.x,box.y,box.w,box.h].every(Number.isFinite))continue;
            if(part.localName==='pic'){
                const im=await imagenDeForma(part,box,rel,zip);
                if(im){out.append(im);visibles++;}
            }else{
                const forma=crearForma(part,box);
                if(forma){out.append(forma);visibles++;}
                const texto=textoDeForma(part,box);
                if(texto){out.append(texto);visibles++;}
            }
            shapes++;
        }
        // Rechazar presentaciones que este intérprete aún no admite,
        // en lugar de anunciar una vista fiel si faltan elementos.
        if(shapes===0||visibles===0)throw Error('Sin elementos compatibles en la diapositiva');
        return {svg:out,shapes,width,height};
    }
    return {slideCount:rutas.length,renderSlide};
}
