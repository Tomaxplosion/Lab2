import { NextResponse } from 'next/server';
import { authorized,cookieName,issueSession,sameOrigin,verifyPassword } from '@/lib/auth';
import { loginAllowed } from '@/lib/store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){return NextResponse.json({authenticated:await authorized()},{headers:{'Cache-Control':'no-store'}});}
export async function POST(req:Request){
 if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 try{
  if(Number(req.headers.get('content-length')??0)>2048)return NextResponse.json({error:'Solicitud demasiado grande'},{status:413});
  if(!(await loginAllowed()))return NextResponse.json({error:'Demasiados intentos. Espera al siguiente intervalo de 15 minutos.'},{status:429});
  const body=await req.text();if(body.length>2048)return NextResponse.json({error:'Solicitud demasiado grande'},{status:413});
  let data;try{data=JSON.parse(body);}catch{return NextResponse.json({error:'Solicitud no válida'},{status:400});}
  if(!data||typeof data.password!=='string'||data.password.length>200||!verifyPassword(data.password))return NextResponse.json({error:'Credencial no válida'},{status:401});
  const res=NextResponse.json({ok:true});res.cookies.set(cookieName,issueSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:14400});return res;
 }catch{return NextResponse.json({error:'Acceso no disponible. Revisa la configuración del servidor.'},{status:503});}
}
export async function DELETE(req:Request){if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});const res=NextResponse.json({ok:true});res.cookies.set(cookieName,'',{maxAge:0,path:'/'});return res;}
