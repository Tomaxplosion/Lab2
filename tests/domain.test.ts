import test from 'node:test';
import { level } from '../lib/scoring.ts';
import assert from 'node:assert/strict';
import { examples,riskSchema,statement } from '../lib/domain.ts';
test('las nueve combinaciones respetan la escala',()=>{for(let p=1;p<=3;p++)for(let i=1;i<=3;i++){const s=p*i;assert.deepEqual(level(p,i),{score:s,label:s<=2?'Bajo':s<=4?'Medio':'Alto'});}});
test('los dos riesgos están completos y no fingen medidas verificadas',()=>{for(const r of examples){assert.equal(riskSchema.safeParse(r).success,true);assert.equal(r.status,'Propuesta');assert.ok(statement(r).includes(r.objective));}});
test('rechaza tipos, límites, valores no permitidos y campos extra',()=>{for(const change of [{probability:4},{impact:'3'},{process:'a'},{condition:'x'.repeat(501)},{asset:'servidor'},{admin:true},{status:'Verificada',evidence:''}])assert.equal(riskSchema.safeParse({...examples[0],...change}).success,false);});
test('obligatorios vacíos y puntuación inyectada se rechazan',()=>{for(const change of [{process:''},{score:1},{level:'Bajo'},{expectedEffect:''}])assert.equal(riskSchema.safeParse({...examples[0],...change}).success,false);});
test('valores fuera de escala no producen clasificaciones',()=>{for(const [p,i] of [[0,1],[4,2],[1,1.5],[NaN,3]])assert.throws(()=>level(p,i),RangeError);});
