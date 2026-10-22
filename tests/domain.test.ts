import test from 'node:test';
import { level } from '../lib/scoring.ts';
import assert from 'node:assert/strict';
import { examples,riskSchema,statement } from '../lib/domain.ts';
test('las nueve combinaciones respetan la escala',()=>{const expected=[[1,1,1,'Bajo'],[1,2,2,'Bajo'],[1,3,3,'Medio'],[2,1,2,'Bajo'],[2,2,4,'Medio'],[2,3,6,'Alto'],[3,1,3,'Medio'],[3,2,6,'Alto'],[3,3,9,'Alto']] as const;for(const [p,i,score,label] of expected)assert.deepEqual(level(p,i),{score,label});});
test('los dos riesgos están completos y no fingen medidas verificadas',()=>{for(const r of examples){assert.equal(riskSchema.safeParse(r).success,true);assert.equal(r.status,'Propuesta');assert.ok(statement(r).includes(r.objective));}});
test('rechaza tipos, límites, valores no permitidos y campos extra',()=>{for(const change of [{probability:4},{impact:'3'},{process:'a'},{condition:'x'.repeat(501)},{asset:'servidor'},{admin:true},{status:'Verificada',evidence:''}])assert.equal(riskSchema.safeParse({...examples[0],...change}).success,false);});
test('obligatorios vacíos y puntuación inyectada se rechazan',()=>{for(const change of [{process:''},{score:1},{level:'Bajo'},{expectedEffect:''}])assert.equal(riskSchema.safeParse({...examples[0],...change}).success,false);});
test('valores fuera de escala no producen clasificaciones',()=>{for(const [p,i] of [[0,1],[4,2],[1,1.5],[NaN,3]])assert.throws(()=>level(p,i),RangeError);});
