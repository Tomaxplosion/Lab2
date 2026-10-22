import { NextResponse } from 'next/server';
import { authorized,sameOrigin } from '@/lib/auth';
import { riskSchema } from '@/lib/domain';
import { listRisks,saveRisk,deleteRisk } from '@/lib/store';
import { diagnostic } from '@/lib/diagnostics';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
 if(!(await authorized()))return NextResponse.json({error:'Acceso requerido'},{status:401});
 try{return NextResponse.json(await listRisks(),{headers:{'Cache-Control':'no-store'}});}catch(e){return NextResponse.json({error:'No se pudieron recuperar los registros',reference:diagnostic('risks.list',e)},{status:503});}
}
async function write(req:Request,update:boolean){
 if(!(await authorized()))return NextResponse.json({error:'Acceso requerido'},{status:401});
 if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 try{
  if(Number(req.headers.get('content-length')??0)>20000)return NextResponse.json({error:'Solicitud demasiado grande'},{status:413});
  const raw=await req.text();if(raw.length>20000)return NextResponse.json({error:'Solicitud demasiado grande'},{status:413});
  let body;try{body=JSON.parse(raw);}catch{return NextResponse.json({error:'JSON no válido'},{status:400});}
  if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Se espera un objeto de riesgo'},{status:400});
  const id=update?body.id:undefined;if(update&&(typeof id!=='string'||! /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)))return NextResponse.json({error:'Identificador no válido'},{status:400});
  if(update){body={...body};delete body.id;}
  const result=riskSchema.safeParse(body);
  if(!result.success)return NextResponse.json({error:'Revisa los campos',fields:result.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`)},{status:400});
  const saved=await saveRisk(result.data,id);if(!saved)return NextResponse.json({error:'Registro no encontrado'},{status:404});
  return NextResponse.json({ok:true},{status:update?200:201});
 }catch(e){return NextResponse.json({error:'No se pudo guardar el registro',reference:diagnostic('risks.save',e)},{status:503});}
}
export async function POST(req:Request){return write(req,false);}
export async function PUT(req:Request){return write(req,true);}
export async function DELETE(req:Request){
 if(!await authorized())return NextResponse.json({error:'Acceso requerido'},{status:401});
 if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 try{
  const text=await req.text();if(text.length>100)return NextResponse.json({error:'Solicitud demasiado grande'},{status:413});
  let body;try{body=JSON.parse(text);}catch{return NextResponse.json({error:'JSON no válido'},{status:400});}
  if(!body||Object.keys(body).length!==1||typeof body.id!=='string'||! /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.id))return NextResponse.json({error:'Identificador no válido'},{status:400});
  return await deleteRisk(body.id)?NextResponse.json({ok:true}):NextResponse.json({error:'Registro no encontrado'},{status:404});
 }catch(e){return NextResponse.json({error:'No se pudo eliminar el registro',reference:diagnostic('risks.delete',e)},{status:503});}
}
