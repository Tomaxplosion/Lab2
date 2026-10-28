# Laboratorio de gestión de riesgos

Aplicación académica para identificar, evaluar y comunicar riesgos de la Academia Horizonte. Next.js y TypeScript, PostgreSQL Supabase, sin IA integrada. Partes 1 y 2. Solo datos ficticios.

## Ejecutar en Windows

Node 24, Git y npm. PowerShell: usar npm.cmd si la política bloquea npm.ps1.

1. npm.cmd ci
2. npm.cmd run setup:local (no sobrescribe configuración existente).
3. Configurar personalmente DATABASE_URL en .env.development.local, con un proyecto PostgreSQL exclusivo de desarrollo. Generar secretos distintos de Preview y guardar la contraseña en Bitwarden.
4. Aplicar el esquema y roles según docs/base-de-datos.md. npm.cmd run dev y abrir http://127.0.0.1:3000.

La ruta normal exige PostgreSQL. SQLite queda restringido a pruebas automáticas. No se guardan registros solo en el navegador. Cargar los dos ejemplos del formulario, revisar sus supuestos y guardar. Los datos migrados sin efecto esperado específico requieren revisión.

## Pruebas y despliegue

npm.cmd test; npm.cmd run build; npm.cmd run test:e2e. Ver docs/pruebas.md. Para migrar desde local opcionalmente: node --env-file=.env.migrations.local scripts/migrate.mjs. DATABASE_URL_ADMIN nunca se configura en Vercel. El grupo ha elegido ejecutar las migraciones desde SQL Editor.

Publicar únicamente con npx.cmd vercel deploy --environment preview; verificar target preview y Ready. Actualizar el alias estable con vercel alias set. Nunca usar --prod. Preview: https://laboratorio2-riesgos-preview-spamtom4444.vercel.app. Su protección Vercel sigue activa; iniciar sesión en Vercel no sustituye la contraseña del gestor.
URL compartible: https://laboratorio2-riesgos-preview-spamtom4444.vercel.app/?_vercel_share=i34Fl319Dpn2xo6aeuvUe0x6mNFeDxF2

## Documentación

- [Fuentes](docs/fuentes.md), [caso](docs/caso.md), [evaluación](docs/evaluacion-riesgos.md), [formulación](docs/formulacion-riesgo.md).
- [Base de datos](docs/base-de-datos.md), [Supabase](docs/supabase.md), [gestión de secretos](docs/gestion-secretos.md), [notas de secretos parte 1](docs/secretos.md).
- [Requisitos de seguridad](docs/requisitos-seguridad.md), [pruebas](docs/pruebas.md), [incidencias](docs/incidencias.md).
- [Despliegue](docs/despliegue.md), [versión de entrega](docs/version-entrega.md), [registro del grupo](docs/registro-grupo.md), [decisión IA parte 1](docs/decision-ia.md), [texto para PDU](docs/entrega-pdu.md).

## Entrega

Fecha: viernes 30/10/2026, 23:59, tarea Entrega Laboratorio 2, una entrega por grupo. Entregar texto con integrantes, URL Preview, URL repositorio, SHA de entrega-l2 y quién entrega. Adjuntar output/pdf/Entrega_Laboratorio_2.pdf (requisitos, pruebas y registro del grupo).

El repositorio debe ser privado y accesible al profesor. Cada integrante debe aportar sus commits y revisión propia; no se fabrican autores. Pendientes concretos en docs/registro-grupo.md e incidencias.md. La etiqueta identifica la revisión técnica preparada; no acredita las acciones personales pendientes. Vaultwarden es opcional y no se añade para evitar desplazar requisitos obligatorios.

Estado de publicación de la parte 2: Vercel ha bloqueado la nueva Preview por permisos del autor Git. El enlace estable aún sirve parte 1; no contiene estos cambios hasta resolverlo. Consultar docs/despliegue.md.
