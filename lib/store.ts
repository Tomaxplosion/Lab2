import 'server-only';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Pool } from 'pg';
import { randomUUID } from 'node:crypto';
import type { Risk, RiskInput } from './domain';
let sqlite: DatabaseSync | undefined;
let pool: Pool | undefined;
function local() {
 if(process.env.VERCEL || process.env.APP_ENV !== 'development') throw new Error('Database required');
 if(!sqlite){const dir=process.env.LOCAL_DATA_DIR??'.data';mkdirSync(dir,{recursive:true}); sqlite=new DatabaseSync(join(dir,'development.sqlite')); sqlite.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS risks (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS login_limits (bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL)');}
 return sqlite;
}
function remote() {return pool ??= new Pool({connectionString:process.env.DATABASE_URL,max:3});}
export async function listRisks():Promise<Risk[]> {
 const rows=process.env.DATABASE_URL ? (await remote().query('SELECT id, created_at, payload FROM lab_riesgos.risks ORDER BY created_at DESC, id')).rows : local().prepare('SELECT * FROM risks ORDER BY created_at DESC, id').all();
 return rows.map((r:any)=>({...JSON.parse(typeof r.payload==='string'?r.payload:JSON.stringify(r.payload)),id:r.id,createdAt:new Date(r.created_at).toISOString()}));
}
export async function saveRisk(input:RiskInput,id?:string) {
 const key=id??randomUUID(), createdAt=new Date().toISOString();
 if(process.env.DATABASE_URL){
  if(id) return (await remote().query('UPDATE lab_riesgos.risks SET payload=$1 WHERE id=$2',[JSON.stringify(input),id])).rowCount===1;
  await remote().query('INSERT INTO lab_riesgos.risks(id,created_at,payload) VALUES($1,$2,$3)',[key,createdAt,JSON.stringify(input)]);
 } else {
  if(id) return local().prepare('UPDATE risks SET payload=? WHERE id=?').run(JSON.stringify(input),id).changes===1;
  local().prepare('INSERT INTO risks VALUES(?,?,?)').run(key,createdAt,JSON.stringify(input));
 }
 return true;
}
export async function loginAllowed() {
 // Límite global persistente: no se confía en cabeceras IP controlables por el cliente.
 const bucket=String(Math.floor(Date.now()/900000));
 if(process.env.DATABASE_URL){
  const r=await remote().query('INSERT INTO lab_riesgos.login_limits(bucket,attempts) VALUES($1,1) ON CONFLICT(bucket) DO UPDATE SET attempts=login_limits.attempts+1 RETURNING attempts',[bucket]);
  await remote().query('DELETE FROM lab_riesgos.login_limits WHERE bucket < $1',[String(Number(bucket)-2)]);
  return r.rows[0].attempts<=30;
 }
 const db=local(); db.prepare('DELETE FROM login_limits WHERE bucket < ?').run(String(Number(bucket)-2));
 const row=db.prepare('INSERT INTO login_limits VALUES(?,1) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts').get(bucket);
 return Number(row?.attempts)<=30;
}
