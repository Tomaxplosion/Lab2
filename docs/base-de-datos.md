# Base de datos y persistencia

Proveedor: Supabase PostgreSQL, elección del grupo en lugar del Neon orientativo. El 22/10/2026 el usuario confirmó que ejecutó db/roles.sql y db/002-riesgos.sql sin errores desde SQL Editor.

## Modelo

Tabla `lab_riesgos.riesgos`: UUID, proceso, activo, objetivo, condición, amenaza, evento, consecuencia, supuestos, probabilidad, impacto, dos justificaciones, score, level, medida, prioridad, expectedEffect, effectiveness, owner, status, evidence, created_at y updated_at. Tipos varchar acotados, smallint para escalas y timestamptz para fechas. Los nombres camelCase están entrecomillados en SQL. La API devuelve createdAt y updatedAt en ISO.

La función única lib/scoring.ts calcula puntuación y nivel en el servidor, tanto al guardar como al leer. El cliente pide la vista previa a POST /api/evaluation. No admite score o level enviados por el usuario. La conversión SQL de datos históricos aplica la fórmula solo al migrar.

## Cuentas

- laboratorio_migrator: propietaria del esquema y de las tablas nuevas; solo migraciones. Se crea NOLOGIN para no inventar ni guardar credenciales. Si el grupo desea usarla desde local, activa LOGIN y establece contraseña personalmente en el proveedor.
- laboratorio_app: cuenta de ejecución, USAGE del esquema y SELECT/INSERT/UPDATE/DELETE sobre riesgos y login_limits. Sin CREATE sobre el esquema, sin ser propietaria ni miembro de migrator. RLS permite filas únicamente a ese rol. No hay acceso concedido a anon/authenticated ni se expone el esquema en Data API.
- postgres: administrador del proveedor, utilizado personalmente para el alta inicial y delegación. No es la cuenta de Vercel.

DATABASE_URL usa laboratorio_app. DATABASE_URL_ADMIN es solo local y usa la cuenta de migraciones; no configurar en Vercel. La pertenencia del administrador inicial a migrator no se concede a laboratorio_app.

## Aplicación de migración

Sobre la BD de la parte 1: ejecutar primero db/roles.sql y después db/002-riesgos.sql en SQL Editor como postgres. La segunda migración copia los UUID y datos de lab_riesgos.risks a la tabla estructurada, sin borrar el original. Es reejecutable: no sustituye registros ya migrados. En una instalación nueva, crear antes el esquema de parte 1 y el rol según docs/supabase.md.

Alternativa local: `node --env-file=.env.migrations.local scripts/migrate.mjs`, con DATABASE_URL_ADMIN configurada personalmente en ese archivo excluido. El script rechaza Vercel y solo muestra códigos de error. No se ha ejecutado esta alternativa ni se presume que la cuenta migrator tenga LOGIN.

La aplicación conserva temporalmente un adaptador para la tabla antigua si aún no existe riesgos. Tras la migración usa automáticamente la tabla nueva. La ruta normal de desarrollo requiere una BD PostgreSQL distinta de Preview. SQLite solo se admite con APP_ENV=test y TEST_DATABASE=sqlite, nunca en Vercel ni producción.

## Comprobación

Entrar, cargar un ejemplo, completar efecto esperado y guardar. Recargar y abrir Detalle técnico: conservar UUID, contenido y fecha de creación. Editar y guardar: updatedAt debe cambiar. Repetir tras otro despliegue. Ejecutar como rol de aplicación pruebas de DDL denegado solo en una tabla desechable del entorno de pruebas; nunca borrar datos reales.
