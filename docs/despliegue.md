# Despliegue - partes 1 y 2

Fecha: 22/10/2026 (Europe/Madrid). Código parte 2: 061330d3f8fc5cc6c5e7f115ac50ad190a3cc025.

## Estado verificado

Alias de parte 1 aún operativo: https://laboratorio2-riesgos-preview-spamtom4444.vercel.app

Intento de parte 2: https://laboratorio2-riesgos-prjveu678-spamtom4444-2887.vercel.app

Deployment: dpl_CZGfjGSB5JuhUp3JJYqfynHwkcWo. CLI 65.1.0, inspect confirma target preview y **Blocked**. Motivo: el autor de los commits no tiene permiso para desplegar en el proyecto. No se usa --prod. No se cambió el alias para apuntar a un despliegue bloqueado.

El usuario confirmó migraciones roles.sql y 002-riesgos.sql ejecutadas sin errores. El secreto de sesión nuevo está en variables Preview, pero su aplicación depende del siguiente despliegue Ready. La contraseña de BD y la web requieren rotación personal por exposición anterior; ver incidencias.md.

## Para completar cuando el titular tenga acceso

1. Vincular la cuenta GitHub Tomaxplosion en Vercel y confirmar autorización del autor en el proyecto laboratorio2-riesgos. No reescribir autores ni desactivar controles para eludir la restricción.
2. npm.cmd ci; npm.cmd test; npm.cmd run build; comprobar que el árbol está limpio y anotar git rev-parse entrega-l2.
3. npx.cmd vercel deploy --yes --environment preview. Inspeccionar target preview y Ready. Actualizar alias: npx.cmd vercel alias set URL_NUEVA laboratorio2-riesgos-preview-spamtom4444.vercel.app.
4. Ejecutar node scripts/test-preview.mjs URL_NUEVA en esta misma máquina si conserva la clave local de prueba generada. No copiar ni publicar esa clave. La prueba firma una sesión de gestor y usa la CLI autenticada para la protección Vercel; no demuestra la contraseña personal.
5. Abrir el alias en navegador, entrar con la contraseña del gestor, crear un riesgo, recargar y comprobar conservación; probar rechazo de escritura sin sesión. Guardar evidencias sin secretos.
6. Confirmar que el repositorio https://github.com/Tomaxplosion/Lab2 es privado, subir commits y etiqueta (git push origin HEAD; git push origin entrega-l2), dar acceso al profesor. No se ha verificado visibilidad, invitación ni push durante esta parte.
7. Actualizar resultados y, si cambia el código final de entrega, revisar la etiqueta con el grupo antes de entregarla. Fecha límite 30/10/2026 a las 23:59.

La entrega técnica local no equivale a una entrega completa en PDU. Vaultwarden opcional no se ha añadido.
