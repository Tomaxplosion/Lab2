import { randomBytes,scryptSync } from 'node:crypto';
import { existsSync,writeFileSync } from 'node:fs';
if(existsSync('.env.development.local')){console.error('Ya existe .env.development.local; no se modifica.');process.exit(1);}
const password=randomBytes(18).toString('base64url'),salt=randomBytes(16).toString('hex');
writeFileSync('.env.development.local',`APP_ENV=development\nAPP_ORIGIN=http://127.0.0.1:3000\nAPP_PASSWORD_HASH=${salt}:${scryptSync(password,salt,64).toString('hex')}\nSESSION_SECRET=${randomBytes(48).toString('hex')}\nDATABASE_URL=\n`);
console.log('Configura DATABASE_URL con la BD PostgreSQL exclusiva de desarrollo. Guarda la contraseña web en Bitwarden:');
console.log(password);
