# Requisitos de seguridad y aceptación

Estado inicial de todos: **pendiente**. Estado actual diferenciado por entorno en docs/pruebas.md. Referencias verificadas y versiones en [fuentes](fuentes.md). Las asociaciones expresan apoyo conceptual; no equivalencia ni conformidad completa.

| ID | Finalidad y referencia | Implementación | Prueba de aceptación | Evidencia esperada |
|---|---|---|---|---|
| SEG-01 | Evitar exposición. IA-5, apoyo a custodia de autenticadores; exclusión de Git es requisito del laboratorio | .gitignore, .env.example vacía, configuración generada localmente | Inspeccionar archivos versionados e historial; ningún secreto real | Lista de archivos y revisión del historial |
| SEG-02 | Mantener secretos en servidor. IA-5, relación parcial | módulos server-only; sin NEXT_PUBLIC_ para secretos; respuestas genéricas | Buscar marcadores secretos en JS de navegador, HTML y errores | Resultado de búsqueda sin coincidencias |
| SEG-03 | Solo acceso autorizado. ENS op.acc.4.1 | sesión HMAC expirable, cookie HttpOnly/Secure/SameSite, control en GET/POST/PUT, comprobación Origin | Leer/escribir sin sesión → 401; origen ajeno → 403 | Prueba HTTP y navegador |
| SEG-04 | Mínimo privilegio. ENS op.acc.4.2, NIST AC-6 | rol de aplicación separado de propietario; SQL en db/schema.sql | CRUD permitido y DDL/acceso ajeno denegado con rol real | Capturas sin secretos de permisos y consultas; pendiente PostgreSQL |
| SEG-05 | Validar datos. NIST SI-10; ENS mp.sw.1, apoyo al desarrollo seguro | Zod estricto en servidor: tipos, límites, enumeraciones, evidencia requerida para verificar; SQL parametrizado | P=4, tipo incorrecto, texto largo, campos extra y JSON inválido rechazados | Unitarias y pruebas API |
| SEG-06 | Aislar entornos. ENS mp.sw.1, separación de desarrollo; detalle de Preview es propio | SQLite solo development; en Vercel exigir PostgreSQL; cuentas/BD y secretos distintos por entorno | Comparar configuración saneada y comprobar aislamiento entre dos BD | Configuración sin valores, pendiente servicios externos |
| SEG-07 | No revelar detalles internos. Requisito del laboratorio; op.exp.2 apoya configuración segura | errores genéricos sin stack ni credenciales; no imprimir cuerpos o variables | Solicitud inválida y BD no disponible devuelven errores públicos seguros | Respuestas HTTP saneadas |
| SEG-08 | Entrega trazable. Requisito del laboratorio | commits, lockfile, registro de pruebas y despliegue | Comparar commit con despliegue Preview y abrir URL | SHA, URL, fecha y resultado; pendiente Vercel |

## Límites explícitos

Autenticación de grupo, sin identidad individual ni MFA. Límite global de 30 intentos por 15 minutos, persistente en BD para soportar varias instancias; puede bloquear temporalmente el acceso legítimo si un tercero agota el cupo. Las sesiones duran cuatro horas: cerrar sesión borra la cookie del navegador; rotar SESSION_SECRET invalida todas las sesiones. La CSP permite scripts inline por compatibilidad con Next; no se presenta como endurecimiento completo. Los textos se escapan con React.

Las pruebas locales no demuestran los permisos del proveedor ni la separación efectiva de datos de Vercel. No marcar SEG-04, SEG-06 o la parte desplegada de SEG-08 como cumplidos hasta adjuntar esas evidencias.
