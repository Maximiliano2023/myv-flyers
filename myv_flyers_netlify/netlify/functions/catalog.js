const SOURCES=['https://www.electrobazarmyv.com/api/catalog','https://electrobazarmyv.com/api/catalog'];
exports.handler=async()=>{
 for(const url of SOURCES){try{
 const r=await fetch(url,{headers:{'Accept':'application/json'},signal:AbortSignal.timeout(18000)});
 if(!r.ok)continue;
 const data=await r.json();
 if(!Array.isArray(data.products))continue;
 return {statusCode:200,headers:{'Content-Type':'application/json','Cache-Control':'public, max-age=120'},body:JSON.stringify({products:data.products,updatedAt:data.updatedAt,count:data.products.length})};
 }catch(e){console.error('catalog',e.message)}}
 return {statusCode:502,body:JSON.stringify({error:'No se pudo consultar el catálogo de la tienda.'})};
};
