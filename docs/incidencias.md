# Registro de incidencias

## INC-01 / Exposición de credenciales / 22-10-2026

Durante la parte 1 se compartieron en el chat una cadena de conexión y una captura de terminal con contraseña web, hash y secreto de sesión. No se reproducen valores. Alcance: cuenta de aplicación de Supabase y acceso gestor de Preview. No hay evidencia de uso indebido; tampoco se ha realizado auditoría completa de accesos.

Medidas: los archivos de secretos y tmp/ están fuera de Git; se revisó el historial sin encontrar los patrones buscados. En la parte 2 se rotó SESSION_SECRET sin mostrar el nuevo valor y se redesplegará; todas las sesiones antiguas quedan invalidadas. Pendiente: el titular debe rotar la contraseña de laboratorio_app en Supabase y DATABASE_URL en Preview; generar personalmente contraseña web/hash nuevos y actualizarlos. Custodiar en Bitwarden. No se declara cerrado hasta confirmarlo.

## INC-02 / Inicio de sesión bloqueado por RLS / 22-10-2026

Los GRANT estaban presentes, pero RLS impedía insertar el contador de intentos (SQLSTATE 42501). Corrección: política limitada a laboratorio_app en login_limits y riesgos. Se mantuvo RLS. Esta decisión se recoge en el registro del grupo; la verificación definitiva corresponde a pruebas remotas.

## INC-03 / Origen distinto / 22-10-2026

Se intentó iniciar sesión desde una URL inmutable diferente del alias autorizado. Se conserva APP_ORIGIN exacto y se facilita el alias estable; no se añadieron comodines ni se eliminó la comprobación.
