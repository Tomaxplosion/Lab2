import { Pool } from 'pg';
import { readFileSync } from 'node:fs';
if(process.env.VERCEL)throw Error('Las migraciones solo se ejecutan en local');
if(!process.env.DATABASE_URL_ADMIN)throw Error('Configura DATABASE_URL_ADMIN en el entorno local excluido de Git');
const pool=new Pool({connectionString:process.env.DATABASE_URL_ADMIN,connectionTimeoutMillis:10000});
try{for(const file of ['db/roles.sql','db/002-riesgos.sql'])await pool.query(readFileSync(file,'utf8'));console.log('Migración aplicada sin mostrar valores sensibles');}
catch(e){console.error('Migración no aplicada. Código:',/^[A-Z0-9]{5}$/.test(e.code??'')?e.code:'INTERNAL');process.exitCode=1;}
finally{await pool.end();}
