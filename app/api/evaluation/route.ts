import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorized,sameOrigin } from '@/lib/auth';
import { level } from '@/lib/scoring';
export async function POST(req:Request){
 if(!await authorized())return NextResponse.json({error:'Acceso requerido'},{status:401});
 if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 const raw=await req.text();
 if(raw.length>200)return NextResponse.json({error:'Solicitud demasiado grande'},{status:413});
 try{
  const r=z.object({probability:z.number().int().min(1).max(3),impact:z.number().int().min(1).max(3)}).strict().safeParse(JSON.parse(raw));
  if(!r.success)return NextResponse.json({error:'Probabilidad e impacto deben ser enteros entre 1 y 3'},{status:400});
  return NextResponse.json(level(r.data.probability,r.data.impact),{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Solicitud no válida'},{status:400});}
}
