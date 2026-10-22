import { test,expect } from '@playwright/test';
import { examples } from '../../lib/domain';
test('protección, validación, formulario, persistencia y sesión',async({page,request})=>{
 expect((await request.get('/api/risks')).status()).toBe(401);
 expect((await request.post('/api/risks',{data:examples[0]})).status()).toBe(401);
 expect((await request.put('/api/risks',{data:examples[0]})).status()).toBe(401);
 expect((await request.post('/api/session',{data:{password:'incorrecta'},headers:{Origin:'https://ajeno.invalid'}})).status()).toBe(403);
 expect((await request.post('/api/session',{data:{password:'incorrecta'},headers:{Origin:'http://127.0.0.1:3100'}})).status()).toBe(401);
 await page.goto('/');await expect(page.getByRole('heading',{name:'Laboratorio de gestión de riesgos'})).toBeVisible();
 await page.getByLabel('Contraseña de acceso').fill(process.env.TEST_PASSWORD!);
 await page.getByRole('button',{name:'Entrar al laboratorio'}).click();
 await expect(page.getByRole('button',{name:'Cerrar sesión'})).toBeVisible();
 const session=(await page.context().cookies()).find(c=>c.name==='horizonte_session');expect(session?.httpOnly).toBe(true);expect(session?.sameSite).toBe('Strict');
 await page.getByRole('button',{name:'Identificar un riesgo'}).click();
 await expect(page.getByText('Falta completar:')).toBeVisible();
 await page.getByRole('button',{name:'Cargar ejemplo',exact:true}).click();
 await expect(page.getByLabel('Proceso o servicio')).toHaveValue('matrícula');
 await page.getByLabel('Proceso o servicio').fill('matrícula de prueba');
 await page.getByRole('button',{name:'Limpiar formulario'}).click();
 await expect(page.getByLabel('Proceso o servicio')).toHaveValue('');
 await page.getByRole('button',{name:'Cargar ejemplo',exact:true}).click();
 await page.getByRole('button',{name:'Guardar riesgo',exact:false}).click();
 await expect(page.getByRole('status')).toContainText('Riesgo guardado');
 await page.reload();await expect(page.getByRole('heading',{name:examples[0].event,exact:true}).first()).toBeVisible();
 const api=page.context().request;
 const before=await (await api.get('/api/risks')).json();
 expect((await request.post('/api/risks',{data:examples[0]})).status()).toBe(401);
 expect((await request.put('/api/risks',{data:{...examples[0],id:before[0].id}})).status()).toBe(401);
 expect((await request.delete('/api/risks',{data:{id:before[0].id}})).status()).toBe(401);
 expect(await (await api.get('/api/risks')).json()).toEqual(before);
 expect(before[0].score).toBe(6);expect(before[0].level).toBe('Alto');expect(before[0].updatedAt).toBeTruthy();
 expect((await api.post('/api/risks',{data:{...examples[0],score:1},headers:{Origin:'http://127.0.0.1:3100'}})).status()).toBe(400);
 for(const p of [1,2,3])for(const i of [1,2,3]){const r=await api.post('/api/evaluation',{data:{probability:p,impact:i},headers:{Origin:'http://127.0.0.1:3100'}});expect((await r.json()).score).toBe(p*i);}
 expect((await api.post('/api/risks',{data:{...examples[0],impact:99},headers:{Origin:'http://127.0.0.1:3100'}})).status()).toBe(400);
 expect((await api.post('/api/risks',{data:examples[0],headers:{Origin:'https://ajeno.invalid'}})).status()).toBe(403);
 expect((await api.post('/api/risks',{data:'{',headers:{Origin:'http://127.0.0.1:3100','Content-Type':'application/json'}})).status()).toBe(400);
 await page.getByRole('button',{name:'Identificar un riesgo'}).click();
 await page.getByRole('button',{name:'Cargar segundo riesgo'}).click();
 await page.getByRole('button',{name:'Guardar riesgo',exact:false}).click();
 await expect(page.getByRole('heading',{name:examples[1].event,exact:true}).first()).toBeVisible();
 // La edición de un registro existente persiste tras recargar.
 await page.getByRole('button',{name:'Editar evaluación'}).first().click();
 await page.getByLabel('Responsable',{exact:true}).fill('Responsable revisado');
 await page.getByRole('button',{name:'Guardar cambios'}).click();
 await expect(page.getByRole('status')).toContainText('Riesgo guardado');
 await page.reload();await expect(page.getByText('Responsable: Responsable revisado',{exact:true})).toBeVisible();
 await page.screenshot({path:'tmp/pdfs/app-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'tmp/pdfs/app-mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 // Los textos del usuario son texto plano y no crean elementos HTML.
 const xss=await api.post('/api/risks',{data:{...examples[0],event:'<img src=x onerror=alert(1)>'},headers:{Origin:'http://127.0.0.1:3100'}});expect(xss.status()).toBe(201);
 await page.reload();await expect(page.getByRole('heading',{name:'<img src=x onerror=alert(1)>',exact:true})).toBeVisible();await expect(page.locator('article img')).toHaveCount(0);
 const html=await page.content();expect(html).not.toContain(process.env.TEST_PASSWORD!);
 for(const src of await page.locator('script[src]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')!))){const js=await (await api.get(src)).text();expect(js).not.toContain(process.env.TEST_PASSWORD!);expect(js).not.toMatch(/postgres(?:ql)?:\/\/[^\s]+:[^\s]+@/);}
 await page.getByRole('button',{name:'Cerrar sesión'}).click();
 await expect(page.getByLabel('Contraseña de acceso')).toBeVisible();
 expect((await api.get('/api/risks')).status()).toBe(401);
});
