const ALLOWED=new Set(['reyesdeloeste.com.ar','www.reyesdeloeste.com.ar']);
exports.handler=async(event)=>{
 try{
 const raw=event.queryStringParameters?.url;
 if(!raw)return {statusCode:400,body:'Falta URL'};
 const u=new URL(raw);
 if(u.protocol!=='https:'||!ALLOWED.has(u.hostname)||u.port||u.username||u.password)return {statusCode:403,body:'Origen no permitido'};
 const r=await fetch(u.href,{redirect:'follow',signal:AbortSignal.timeout(16000)});
 const final=new URL(r.url);
 if(!ALLOWED.has(final.hostname)||final.protocol!=='https:')return {statusCode:403,body:'Redirección no permitida'};
 if(!r.ok)return {statusCode:502,body:'No se pudo descargar foto'};
 const type=r.headers.get('content-type')||'';
 if(!type.startsWith('image/'))return {statusCode:415,body:'No es una imagen'};
 const buf=Buffer.from(await r.arrayBuffer());
 if(buf.length>8*1024*1024)return {statusCode:413,body:'Imagen demasiado grande'};
 return {statusCode:200,isBase64Encoded:true,headers:{'Content-Type':type,'Cache-Control':'public, max-age=3600'},body:buf.toString('base64')};
 }catch(e){return {statusCode:502,body:'Error al obtener la imagen'}}
};
