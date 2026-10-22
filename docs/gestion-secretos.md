# Entornos y gestión de secretos

| Variable | Finalidad | Entorno y custodia | Cambio |
|---|---|---|---|
| DATABASE_URL | PostgreSQL con laboratorio_app | Servidor local o Preview, BD distintas; Bitwarden y variables del entorno | Rotar contraseña en Supabase, actualizar variable, redesplegar |
| DATABASE_URL_ADMIN | Migraciones exclusivamente | Solo local, .env.migrations.local excluido; Bitwarden | Cambiar credencial de migrator y archivo local; nunca Vercel |
| APP_PASSWORD_HASH | Sal y hash scrypt del perfil gestor | Servidor; distinto por entorno; secreto en Vercel, contraseña en Bitwarden | Generar personalmente contraseña y hash nuevos, sustituir y redesplegar |
| SESSION_SECRET | Firma HMAC de sesiones | Servidor; aleatorio, al menos 64 caracteres, distinto por entorno | Rotar e invalidar todas las sesiones; redesplegar |
| APP_ORIGIN | Origen exacto autorizado | Configuración local o alias estable Preview | Actualizar si cambia dominio y redesplegar |
| APP_ENV | Selección explícita de entorno | development, preview, production o test | Establecer según destino |

Generación personal: el comando `npm.cmd run setup:local` genera hash scrypt con sal y secreto criptográfico; muestra la contraseña solo en tu terminal, no sobrescribe el archivo existente. Guardar la contraseña en Bitwarden. No compartir contraseñas, hashes, cadenas de conexión ni capturas con esos valores.

## Separación comprobada y límites

Preview tiene variables de servidor en Vercel. SESSION_SECRET se ha rotado durante esta parte por su exposición anterior; no se imprime. Las pruebas locales generan sus propios secretos efímeros y BD SQLite aislada, con DATABASE_URL y DATABASE_URL_ADMIN vacías expresamente. Esto verifica aislamiento de pruebas, pero no demuestra dos bases PostgreSQL reales.

La BD PostgreSQL de desarrollo distinta de Preview está pendiente de configurar por el grupo. No se consultan secretos existentes para comparar sus valores. El grupo debe confirmar separación de cuentas, proyectos y contraseña de acceso. No se usa Neon y no existen ramas Neon de Preview que documentar. No se ha publicado en producción.

El secreto de sesión publicado en la captura ha sido sustituido. Siguen pendientes de rotación personal la contraseña de la BD y la de la web expuestas previamente; consultar docs/incidencias.md. No basta con borrar el mensaje o el archivo.

## Estado efectivo al cierre

Vercel ha guardado el nuevo secreto de sesión, pero ha bloqueado el redespliegue por permisos del autor. Por tanto, la invalidación de sesiones en la aplicación publicada está pendiente de que una nueva Preview alcance Ready. No se afirma revocación efectiva hasta entonces.

