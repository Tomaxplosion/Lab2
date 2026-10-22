import { randomBytes, scryptSync, randomUUID } from 'node:crypto';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { examples } from '../lib/domain.ts';
if (existsSync('.env.development.local')) { console.error('Ya existe .env.development.local; no se modifica.'); process.exit(1); }
const password=randomBytes(18).toString('base64url'), salt=randomBytes(16).toString('hex');
mkdirSync('.data',{recursive:true});
const db=new DatabaseSync('.data/development.sqlite');
db.exec('CREATE TABLE IF NOT EXISTS risks (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload TEXT NOT NULL)');
if(Number(db.prepare('SELECT COUNT(*) AS n FROM risks').get().n)===0){for(const risk of examples)db.prepare('INSERT INTO risks VALUES(?,?,?)').run(randomUUID(),new Date().toISOString(),JSON.stringify(risk));}
db.close();
writeFileSync('.env.development.local',`APP_ENV=development\nAPP_ORIGIN=http://127.0.0.1:3000\nAPP_PASSWORD_HASH=${salt}:${scryptSync(password,salt,64).toString('hex')}\nSESSION_SECRET=${randomBytes(48).toString('hex')}\n`);
console.log('Configuración local creada y excluida de Git. Guarda esta contraseña en Bitwarden:');
console.log(password);
