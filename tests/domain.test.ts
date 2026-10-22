import test from 'node:test';
import assert from 'node:assert/strict';
import { examples,level,riskSchema,statement } from '../lib/domain.ts';
test('las nueve combinaciones respetan la escala',()=>{for(let p=1;p<=3;p++)for(let i=1;i<=3;i++){const s=p*i;assert.deepEqual(level(p,i),{score:s,label:s<=2?'Bajo':s<=4?'Medio':'Alto'});}});
test('los dos riesgos están completos y no fingen medidas verificadas',()=>{for(const r of examples){assert.equal(riskSchema.safeParse(r).success,true);assert.equal(r.status,'Propuesta');assert.ok(statement(r).includes(r.objective));}});
test('rechaza tipos, límites, valores no permitidos y campos extra',()=>{for(const change of [{probability:4},{impact:'3'},{process:'a'},{condition:'x'.repeat(501)},{asset:'servidor'},{admin:true},{status:'Verificada',evidence:''}])assert.equal(riskSchema.safeParse({...examples[0],...change}).success,false);});
