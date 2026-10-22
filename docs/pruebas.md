# Pruebas de seguridad y funcionamiento

Fecha: 22/10/2026. Commit técnico: 061330d3f8fc5cc6c5e7f115ac50ad190a3cc025. Windows, Node 24.21.0, Next 16.4.2, Chromium Playwright. Resultados realmente ejecutados:

| Prueba | Resultado | Evidencia | Límite |
|---|---|---|---|
| Construcción y TypeScript | Correcto | npm.cmd run build | No valida el proveedor |
| Nueve combinaciones | Correcto | tests/domain.test.ts, lib/scoring.ts | Función pura invocada solo por servidor y pruebas |
| Validación | Correcto | Vacío, longitud excesiva, enum inválido, tipos, P fuera de rango, score inyectado, evidencia vacía | 5 pruebas unitarias en total |
| Persistencia local | Correcto | Crear ambos ejemplos, recargar navegador y editar responsable | SQLite aislada solo de prueba |
| Escritura no autorizada | Correcto | POST, PUT, DELETE 401; lectura autorizada antes/después idéntica | API local; prueba remota registrada debajo |
| Origen y sesión | Correcto | Origen externo 403, cookie HttpOnly/SameSite, logout y 401 | Secure se aplica en producción HTTPS |
| Cálculo en servidor | Correcto | API evaluation prueba las nueve combinaciones; score no se acepta como entrada | El navegador no calcula clasificación |
| XSS y secretos navegador | Correcto | Texto img no crea imagen; HTML y todos los scripts cargados sin contraseña efímera ni conexión PostgreSQL | Comprobación por marcadores/patrones, no auditoría formal |
| Historial Git | Correcto en revisión ejecutada | scripts/check-secrets.mjs recorre blobs únicos de todos los commits; evidencia tmp/evidence/secret-scan.json | No detecta todos los formatos posibles ni resuelve exposición en chat |

## Las nueve combinaciones

| Probabilidad | Impacto | Puntuación | Nivel |
|---|---|---|---|
| 1 | 1 | 1 | Bajo |
| 1 | 2 | 2 | Bajo |
| 1 | 3 | 3 | Medio |
| 2 | 1 | 2 | Bajo |
| 2 | 2 | 4 | Medio |
| 2 | 3 | 6 | Alto |
| 3 | 1 | 3 | Medio |
| 3 | 2 | 6 | Alto |
| 3 | 3 | 9 | Alto |

## Reproducción

npm.cmd test; npm.cmd run build; npm.cmd run test:e2e. Navegador en tmp/browsers. La prueba fija DATABASE_URL y DATABASE_URL_ADMIN vacías y genera secretos distintos, por lo que nunca modifica la BD de Preview. El informe de escáner no contiene valores. Verificación remota: node scripts/test-preview.mjs URL_PREVIEW, usando sesión efímera firmada con un secreto de prueba que no se imprime y protección de despliegue vía CLI oficial. No prueba la contraseña personal del gestor.

Incidencias anteriores conservadas: fallo RLS (42501) y origen no autorizado. Se corrigen con políticas del rol y alias estable. No se ocultan fallos ni se desactiva RLS.

## Resultado remoto de esta parte

NO EJECUTADO: Vercel bloqueó el despliegue dpl_CZGfjGSB5JuhUp3JJYqfynHwkcWo por falta de permisos del autor de commits. inspect: target preview, status Blocked. El titular confirmó que no puede corregir la vinculación GitHub/Vercel ahora. No se han ejecutado ni se dan por aprobadas las pruebas 3 y 4 sobre la nueva versión remota.

La migración SQL fue confirmada sin errores por el usuario, pero no se leyó la conexión administrativa ni se suplantó al propietario. La prueba automatizada scripts/test-preview.mjs está preparada: crea un riesgo ficticio, lo recupera en peticiones separadas, comprueba edición y rechazo sin sesión sin cambiar BD, y retira únicamente su registro de prueba. Ejecutarla cuando la Preview sea Ready.

Resultado local final: 5 unitarias correctas; 1 prueba integral Chromium correcta con todas sus aserciones; construcción y TypeScript correctos. Revisión del historial con 68 blobs en la ejecución del commit técnico: 0 hallazgos de los patrones buscados. El escáner se vuelve a ejecutar al cerrar la entrega.


Commit de las pruebas finales ejecutadas: 08c42e215027c94355342dfc84834d6f3dba2e4d. Incluye comparación literal de las nueve combinaciones y comprobación de contraseña, hash y secreto efímeros ausentes del JS enviado al navegador.
