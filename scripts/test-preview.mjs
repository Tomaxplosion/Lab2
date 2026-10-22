import { createHmac,createHash,randomUUID } from 'node:crypto';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { examples } from '../lib/domain.ts';
const deployment=process.argv[2];
if(!/^https:\/\/[a-z0-9.-]+\.vercel\.app$/.test(deployment??''))throw Error('Indica una URL de Preview válida');
const origin='https://laboratorio2-riesgos-preview-spamtom4444.vercel.app';
const secret=readFileSync('.data/preview-test-session.key','utf8').trim();
const expiry=String(Date.now()+3600000),token=expiry+'.'+createHmac('sha256',secret).update(expiry).digest('hex');
mkdirSync('tmp/evidence',{recursive:true});
let n=0;const results=[];
function request(method,path,body,authenticated=true){
 const prefix=`tmp/evidence/remote-${++n}`;
 const config=[`header = "Origin: ${origin}"`,'header = "Content-Type: application/json"'];
 if(authenticated)config.push(`header = "Cookie: horizonte_session=${token}"`);
 writeFileSync(prefix+'.cfg',config.join('\n'));
 if(body!==undefined)writeFileSync(prefix+'.body',JSON.stringify(body));
 const command=`npx.cmd --yes vercel@latest curl ${path} --deployment ${deployment} -- --silent --request ${method} --config ${prefix}.cfg ${body!==undefined?'--data-binary @'+prefix+'.body ':''}--output ${prefix}.json --write-out %{http_code}`;
 const r=spawnSync('cmd.exe',['/d','/s','/c',command],{encoding:'utf8'});
 if(r.status!==0)throw Error('Petición remota no disponible');
 const status=Number(r.stdout.trim().slice(-3));let data;try{data=JSON.parse(readFileSync(prefix+'.json','utf8'));}catch{throw Error('Respuesta remota no válida');}
 return {status,data};
}
function check(name,pass){results.push({name,pass});if(!pass)throw Error('Falló: '+name);}
let created;
try{
 const before=request('GET','/api/risks');check('Lectura autorizada',before.status===200&&Array.isArray(before.data));
 const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
 const snapshot=digest(before.data);
 check('POST sin sesión',request('POST','/api/risks',examples[0],false).status===401);
 check('PUT sin sesión',request('PUT','/api/risks',{...examples[0],id:randomUUID()},false).status===401);
 check('Rechazos no cambian BD',digest(request('GET','/api/risks').data)===snapshot);
 const marker='Prueba de entrega '+randomUUID();
 check('Crear riesgo',request('POST','/api/risks',{...examples[0],event:marker}).status===201);
 const reloaded=request('GET','/api/risks');created=reloaded.data.find(r=>r.event===marker);
 check('Persistencia en nueva petición',Boolean(created));
 check('Puntuación calculada',created.score===6&&created.level==='Alto');
 check('Modificar riesgo',request('PUT','/api/risks',{...examples[0],id:created.id,event:marker,owner:'Gestor de prueba'}).status===200);
 check('Modificación persistente',request('GET','/api/risks').data.find(r=>r.id===created.id)?.owner==='Gestor de prueba');
}catch(e){console.error(e.message);process.exitCode=1;}
finally{
 if(created){const cleanup=request('DELETE','/api/risks',{id:created.id});results.push({name:'Retirar registro de prueba',pass:cleanup.status===200});}
 writeFileSync('tmp/evidence/preview-tests.json',JSON.stringify({at:new Date().toISOString(),deployment,results},null,2));
 for(const r of results)console.log(`${r.pass?'OK':'FALLO'}: ${r.name}`);
}
