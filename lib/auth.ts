import 'server-only';
import { createHmac, timingSafeEqual, scryptSync } from 'node:crypto';
import { cookies } from 'next/headers';
export const cookieName='horizonte_session';
function secret(){const s=process.env.SESSION_SECRET;if(!s || s.length<64)throw new Error('Missing configuration');return s;}
function sign(s:string){return createHmac('sha256',secret()).update(s).digest('hex');}
export function issueSession(){const expiry=String(Date.now()+4*3600000);return `${expiry}.${sign(expiry)}`;}
export function validSession(token:string){
 try {const [expiry,signature,...rest]=token.split('.'); if(rest.length || !/^\d{13}$/.test(expiry)||!signature||!/^\w{64}$/.test(signature))return false;
 const n=Number(expiry); return n>Date.now()&&n<=Date.now()+4*3600000&&timingSafeEqual(Buffer.from(signature),Buffer.from(sign(expiry)));}catch{return false;}
}
export async function authorized(){return validSession((await cookies()).get(cookieName)?.value??'');}
export function verifyPassword(password:string){
 const [salt,hash]= (process.env.APP_PASSWORD_HASH??'').split(':');
 if(!salt||!hash||!/^[a-f0-9]{128}$/.test(hash))throw new Error('Missing configuration');
 return timingSafeEqual(scryptSync(password,salt,64),Buffer.from(hash,'hex'));
}
export function sameOrigin(request:Request){
 const expected=process.env.APP_ORIGIN;
 if(!expected)return false;
 try{return request.headers.get('origin')===new URL(expected).origin;}catch{return false;}
}
