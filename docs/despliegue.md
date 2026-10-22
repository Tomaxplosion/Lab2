# Despliegue y entrega externa

Fecha: 22/10/2026. **Estado: Preview publicada, configuración de Supabase pendiente.** Alias estable: https://laboratorio2-riesgos-preview-spamtom4444.vercel.app. Vercel confirma target preview y estado Ready. Proveedor confirmado: Supabase; ver [configuración](supabase.md). No se sustituye la BD por almacenamiento efímero en Vercel.

La página y el contexto están publicados. El registro remoto no puede utilizarse hasta configurar DATABASE_URL y los secretos de acceso. La protección de despliegues de Vercel está activa y puede pedir iniciar sesión. El titular está autenticado en la CLI; no hay navegador conectado para operar Supabase.

## Procedimiento para completar

1. Autenticarse personalmente con la CLI oficial: `npx.cmd vercel login`. Completar la autorización en el navegador, sin enviar credenciales al chat.
2. Ejecutar `npx.cmd vercel link --project laboratorio2-riesgos`, creando el proyecto si aún no existe. Seleccionar Next.js y Node 24. No activar producción.
3. Crear una BD PostgreSQL exclusiva de Preview y otra para producción si se habilita en el futuro. Un administrador ejecuta db/schema.sql tras crear laboratorio_app. Usar una contraseña distinta de la administrativa.
4. Configurar APP_ENV=preview, DATABASE_URL, APP_PASSWORD_HASH, SESSION_SECRET y APP_ORIGIN como variables **Preview** de Vercel. Introducir secretos en el panel o entradas ocultas de la CLI, no como argumentos visibles. Usar un alias estable Preview para APP_ORIGIN.
5. Comprobar `.vercelignore` y `git status`. Ejecutar `npm.cmd ci`, `npm.cmd test`, `npm.cmd run build`. Guardar el commit y registrar `git rev-parse HEAD`.
6. Ejecutar `npx.cmd vercel deploy --environment preview` sin `--prod`. Asignar el alias estable Preview configurado como APP_ORIGIN con `npx.cmd vercel alias set URL_PREVIEW ALIAS_PREVIEW`. El alias permite mantener comprobaciones de Origin estrictas entre despliegues. Con CLI 65.1.0 se observó que --target preview no impidió la asignación inicial a producción: ese despliegue se retiró. Usar --environment preview e inspeccionar el resultado.
7. Abrir el alias HTTPS, comprobar título, descripción y aviso. Entrar, revisar y guardar ambos ejemplos, recargar, editar y comprobar acceso sin sesión. Repetir pruebas contra PostgreSQL de Preview. Las cookies Secure requieren HTTPS.
8. Registrar abajo URL, alias, SHA de origen, fecha y pruebas. Guardar capturas solo de nombres y ámbitos de variables, sin revelar valores. Adjuntar resultados de privilegios de BD.

Para GitHub: crear repositorio privado, añadir remote y hacer push, conceder acceso al profesor desde el panel. El PDF original, .env.local, .data y dependencias están excluidos. Nunca subir la carpeta completa como ZIP sin revisar exclusiones.

## Registro pendiente

| Evidencia | Estado |
|---|---|
| URL y alias Preview | Alias indicado arriba; target preview y Ready verificados |
| Commit desplegado | Se registra en docs/version-entrega.md tras la publicación final |
| Repositorio privado / acceso profesor | Pendiente de cuenta y destinatario |
| Variables separadas y permisos PostgreSQL | Pendiente de proveedor |
| Pruebas sobre URL remota | Página recuperada mediante CLI autenticada; pruebas de BD pendientes |

No declarar la práctica completamente entregada hasta completar estas evidencias. El proyecto local sí puede construirse y probarse sin cuentas externas.
