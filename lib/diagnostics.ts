import 'server-only';
import { randomUUID } from 'node:crypto';
export function diagnostic(operation:string,error:unknown){
 const reference=randomUUID();
 const raw=(error as {code?:unknown})?.code;
 const code=typeof raw==='string'&&/^[A-Z0-9_]{2,20}$/.test(raw)?raw:'INTERNAL';
 // Lista blanca: nunca registrar message, stack, consulta, URL, cookies o entradas.
 console.error(JSON.stringify({reference,operation,code,at:new Date().toISOString()}));
 return reference;
}
