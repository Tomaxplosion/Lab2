import { randomBytes } from 'node:crypto';
import { mkdirSync,writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const secret=randomBytes(48).toString('hex');
const r=spawnSync('cmd.exe',['/d','/s','/c','npx.cmd --yes vercel@latest env add SESSION_SECRET --environment preview --sensitive --force --yes --project laboratorio2-riesgos'],{input:secret,encoding:'utf8'});
if(r.status!==0){console.error('No se pudo rotar SESSION_SECRET');process.exit(1);}
mkdirSync('.data',{recursive:true});writeFileSync('.data/preview-test-session.key',secret,{mode:0o600});
console.log('SESSION_SECRET rotado en Preview. Valor oculto; las sesiones anteriores quedan invalidadas al redesplegar.');
