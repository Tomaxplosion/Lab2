# Gestión de secretos

No introducir credenciales en el chat, Git, capturas o documentos. Bitwarden custodia los valores, pero no configura automáticamente Vercel. No compartir la contraseña maestra ni la bóveda personal.

| Variable | Finalidad y lugar | Sustitución |
|---|---|---|
| APP_ENV | development local, preview o production en servidor | Definir separadamente por entorno |
| APP_ORIGIN | Origen exacto permitido, sin ruta, para impedir escrituras entre sitios | En Preview usar alias estable HTTPS propio; no usar comodines |
| APP_PASSWORD_HASH | Sal aleatoria y hash scrypt de 64 bytes, `sal:hex`; solo servidor | Generar con setup-local en un directorio local aislado; guardar la contraseña en Bitwarden; cambiarla actualizando el hash |
| SESSION_SECRET | Secreto HMAC aleatorio de al menos 64 caracteres, solo servidor | Generar aleatoriamente; rotarlo al cambiar acceso o por exposición; invalida todas las sesiones |
| DATABASE_URL | Conexión PostgreSQL con rol de ejecución limitado y TLS verificado | Crear credencial independiente de administrador; rotar en proveedor y Vercel y redesplegar |

.env.development.local y .data están fuera de Git. La plantilla no contiene valores reales. No usar NEXT_PUBLIC_ para estas variables. El comando setup-local genera secretos distintos y no sobrescribe configuraciones existentes; se ejecuta personalmente para no exponer valores en la conversación.

Para Vercel se necesitan bases de datos separadas para desarrollo, Preview y producción, no solo nombres distintos de variable. Usar el modo TLS con verificación de certificado recomendado por el proveedor; no desactivar rejectUnauthorized. No reutilizar el usuario propietario del esquema.

Si hay exposición, revocar o rotar de inmediato, invalidar sesiones, revisar accesos y eliminar el secreto del historial según el procedimiento del repositorio. Borrar únicamente el último archivo no revoca el valor expuesto. No registrar cuerpos de login, cookies ni cadenas de conexión.

La política vigente de entornos y rotación de la parte 2 se detalla en docs/gestion-secretos.md e incidencias.md; prevalece sobre las notas iniciales.
