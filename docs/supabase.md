# Conexión a Supabase

Proveedor confirmado por el alumno: Supabase. La aplicación utiliza PostgreSQL mediante pg en el servidor; no necesita claves anon o service_role en el navegador. Consulta oficial 22/10/2026: [conexiones](https://supabase.com/docs/guides/database/connecting-to-postgres), [roles](https://supabase.com/docs/guides/database/postgres/roles).

## Pasos en el panel del titular

1. Seleccionar un proyecto de práctica exclusivo de Preview. No usar datos reales ni compartir la BD con producción. Si se crea uno nuevo, revisar personalmente el plan y sus condiciones.
2. Crear `laboratorio_app` como rol LOGIN, sin SUPERUSER, CREATEDB, CREATEROLE, BYPASSRLS ni membresía de roles administrativos. Introducir su contraseña mediante el canal seguro del proveedor y custodiarla en Bitwarden; no pegarla en el chat ni en archivos versionados.
3. Ejecutar db/schema.sql con el administrador en SQL Editor. Crea el esquema **lab_riesgos**, que no debe añadirse a los esquemas expuestos por la Data API. El rol de ejecución solo recibe USAGE sobre ese esquema y CRUD sobre sus dos tablas. Mantener anon y authenticated sin acceso.
4. En Connect, elegir Supavisor Transaction pooler para serverless, puerto 6543, o el modo admitido por el proyecto. Para el rol personalizado usar `laboratorio_app.REFERENCIA_PROYECTO` según el formato del pooler. Codificar caracteres reservados de contraseña en la URL. pg no usa consultas preparadas con nombre en este proyecto.
5. Usar la cadena como DATABASE_URL en **Vercel / laboratorio2-riesgos / Settings / Environment Variables / Preview**. Activar TLS con verificación de certificado siguiendo la configuración de Supabase. No desactivar la verificación del certificado para resolver errores.
6. Configurar también APP_ENV=preview, APP_ORIGIN con el alias HTTPS Preview, APP_PASSWORD_HASH y SESSION_SECRET distintos de desarrollo. El panel debe ocultar los valores. Regenerar la Preview tras los cambios.

## Pruebas de permisos (con la cuenta de ejecución)

```sql
SELECT current_user;
SELECT has_schema_privilege(current_user, 'lab_riesgos', 'USAGE'); -- true
SELECT has_schema_privilege(current_user, 'lab_riesgos', 'CREATE'); -- false
SELECT has_table_privilege(current_user, 'lab_riesgos.risks', 'SELECT,INSERT,UPDATE,DELETE'); -- true
```

En esta BD de prueba intentar crear una tabla en lab_riesgos y ejecutar DROP sobre una tabla desechable propiedad del administrador: ambos deben fallar. Probar acceso a una tabla de prueba ajena, también denegado. No ensayar borrados sobre datos reales. Confirmar en pg_roles que el rol no tiene atributos administrativos ni membresías que le concedan derechos adicionales.

Comprobar escritura/lectura desde la aplicación, recarga y acceso no autorizado. La prueba de persistencia debe repetirse después de un nuevo despliegue, para confirmar que los datos viven en Supabase.

## Bloqueo actual

No hay conector Supabase ni navegador conectado en esta sesión (inventario vacío). No se ha accedido a tu proyecto Supabase, creado roles, ejecutado el esquema ni configurado DATABASE_URL. Estas acciones deben completarse en el panel o en una sesión conectada. El código está preparado; no se afirma que la base remota esté configurada.

Actualización parte 2: el usuario confirmó roles.sql y 002-riesgos.sql ejecutados sin errores. El bloqueo actual es la autorización de despliegue de Vercel, no una afirmación de fallo en esas migraciones. Ver despliegue.md.
