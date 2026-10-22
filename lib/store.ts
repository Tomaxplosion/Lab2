import 'server-only';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Pool } from 'pg';
import { randomUUID } from 'node:crypto';
import { level } from './scoring';
import type { Risk,RiskInput } from './domain';
let sqlite:DatabaseSync|undefined;
let pool:Pool|undefined;
const fields=['process','asset','objective','condition','threat','event','consequence','assumptions','probability','impact','probabilityReason','impactReason','measure','priority','expectedEffect','effectiveness','owner','status','evidence'] as const;
function local(){
 if(process.env.VERCEL||process.env.APP_ENV!=='test'||process.env.TEST_DATABASE!=='sqlite')throw new Error('PostgreSQL required');
 if(!sqlite){const dir=process.env.LOCAL_DATA_DIR??'tmp/test-db';mkdirSync(dir,{recursive:true});sqlite=new DatabaseSync(join(dir,'test.sqlite'));sqlite.exec('CREATE TABLE IF NOT EXISTS risks (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS login_limits (bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL)');}return sqlite;
}
function remote(){return pool??=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:10000});}
async function structured(){return Boolean((await remote().query("SELECT to_regclass('lab_riesgos.riesgos') IS NOT NULL AS ready")).rows[0].ready);}
function record(row:any):Risk{
 const value=row.payload?(typeof row.payload==='string'?JSON.parse(row.payload):row.payload):row;
 const evaluation=level(value.probability,value.impact);
 const input=Object.fromEntries(fields.map(f=>[f,value[f]])) as RiskInput;
 return {...input,status:value.status==='En implantación'?'Implantada':value.status,expectedEffect:value.expectedEffect??'Pendiente de concretar tras migrar la parte 1',id:row.id,createdAt:new Date(row.created_at).toISOString(),updatedAt:new Date(row.updated_at??value.updatedAt??row.created_at).toISOString(),score:evaluation.score,level:evaluation.label};
}
export async function listRisks():Promise<Risk[]>{
 if(!process.env.DATABASE_URL)return local().prepare('SELECT * FROM risks ORDER BY created_at DESC,id').all().map(record);
 const table=await structured()?'riesgos':'risks';return (await remote().query(`SELECT * FROM lab_riesgos.${table} ORDER BY created_at DESC,id`)).rows.map(record);
}
export async function saveRisk(input:RiskInput,id?:string){
 const key=id??randomUUID(),now=new Date().toISOString(),evaluation=level(input.probability,input.impact);
 if(!process.env.DATABASE_URL){if(id)return local().prepare('UPDATE risks SET payload=?,updated_at=? WHERE id=?').run(JSON.stringify(input),now,id).changes===1;local().prepare('INSERT INTO risks VALUES(?,?,?,?)').run(key,now,now,JSON.stringify(input));return true;}
 if(!await structured()){
  // Compatibilidad temporal hasta que el titular ejecute la migración en Supabase.
  const payload=JSON.stringify({...input,updatedAt:now});
  if(id)return (await remote().query('UPDATE lab_riesgos.risks SET payload=$1 WHERE id=$2',[payload,id])).rowCount===1;
  await remote().query('INSERT INTO lab_riesgos.risks VALUES($1,$2,$3)',[key,now,payload]);return true;
 }
 const columns=[...fields,'score','level'];const values:unknown[]=[...fields.map(f=>input[f]),evaluation.score,evaluation.label];
 if(id){values.push(now,id);return (await remote().query(`UPDATE lab_riesgos.riesgos SET ${columns.map((c,i)=>`"${c}"=$${i+1}`).join(',')},updated_at=$${values.length-1} WHERE id=$${values.length}`,values)).rowCount===1;}
 values.push(key,now,now);await remote().query(`INSERT INTO lab_riesgos.riesgos (${[...columns,'id','created_at','updated_at'].map(c=>`"${c}"`).join(',')}) VALUES (${values.map((_,i)=>`$${i+1}`).join(',')})`,values);return true;
}
export async function deleteRisk(id:string){if(!process.env.DATABASE_URL)return local().prepare('DELETE FROM risks WHERE id=?').run(id).changes===1;const table=await structured()?'riesgos':'risks';return (await remote().query(`DELETE FROM lab_riesgos.${table} WHERE id=$1`,[id])).rowCount===1;}
export async function loginAllowed(){
 const bucket=String(Math.floor(Date.now()/900000));
 if(process.env.DATABASE_URL){const r=await remote().query('INSERT INTO lab_riesgos.login_limits(bucket,attempts) VALUES($1,1) ON CONFLICT(bucket) DO UPDATE SET attempts=login_limits.attempts+1 RETURNING attempts',[bucket]);await remote().query('DELETE FROM lab_riesgos.login_limits WHERE bucket < $1',[String(Number(bucket)-2)]);return r.rows[0].attempts<=30;}
 const db=local();db.prepare('DELETE FROM login_limits WHERE bucket < ?').run(String(Number(bucket)-2));return Number(db.prepare('INSERT INTO login_limits VALUES(?,1) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts').get(bucket)?.attempts)<=30;
}
