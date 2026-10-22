# Resultados de comprobación

Fecha: 22/10/2026. Entorno Windows, Git 2.55.0, Node 24.21.0, npm 11.19.0, Next.js 16.4.2. Dependencias fijadas en package-lock.json; npm informó 0 vulnerabilidades al instalar.

| Prueba | Resultado observado |
|---|---|
| npm.cmd run build | Correcto; compilación, TypeScript y generación de páginas |
| npm.cmd test | 3 pruebas correctas: nueve combinaciones P×I, dos ejemplos válidos y rechazo de tipos/límites/enumeraciones/campos extra |
| npm.cmd run test:e2e | Correcto en Chromium: lectura, POST y PUT sin sesión → 401; origen externo → 403; contraseña errónea → 401 |
| Formulario | Detecta incompletos, carga ejemplo, permite edición y limpieza |
| Persistencia | Guarda ambos riesgos, recarga y recupera registros; actualiza responsable con PUT y conserva el cambio al recargar |
| Validación servidor | Impacto 99 y JSON malformado → 400 |
| XSS | Entrada con etiqueta img se representa como texto, sin crear imágenes ni ejecutar HTML |
| Sesión | Cookie HttpOnly y SameSite Strict; cerrar sesión impide leer los registros |
| Diseño | Capturas escritorio 1280 px y móvil 390 px revisadas; sin desbordamiento horizontal |
| Informe PDF | Tres páginas renderizadas y revisadas visualmente |
| Vercel | Preview Ready, target preview confirmado por inspect; página recuperada por CLI autenticada |

Las pruebas usan secretos efímeros y una base SQLite nueva en tmp/ por ejecución. No incluyen credenciales personales. Las capturas quedan en tmp/pdfs, fuera de Git. El acceso web de Preview tiene la protección de despliegues de Vercel; no se ha desactivado.

Incidencias resueltas: la configuración de Playwright se reevaluaba en el worker y generaba una contraseña distinta; ahora conserva el valor efímero heredado. Se permitió unsafe-eval solo en desarrollo para depuración React. La primera publicación fue clasificada automáticamente como producción por Vercel pese a --target preview: se eliminó ese despliegue y se confirmó una nueva publicación con --environment preview.

## Seguridad: estado actual

SEG-01: exclusiones y revisión de archivos/historial local. SEG-02: separación server-only implementada; no se ha realizado una auditoría exhaustiva del bundle. SEG-03 y SEG-05: pruebas locales correctas. SEG-04: permisos preparados, pendientes de prueba real en Supabase. SEG-06: protección de SQLite implementada; aislamiento efectivo entre proyectos Supabase pendiente. SEG-07: errores de entrada comprobados; fallo de conexión remoto pendiente. SEG-08: Git y Preview registrados; faltan repositorio remoto, acceso del profesor y comprobaciones con Supabase.

No ejecutadas: restauración real, RPO/RTO, permisos PostgreSQL, persistencia tras redesplegar sobre Supabase, acceso del profesor y revisión personal del alumno. Los riesgos y medidas son académicos; ninguna propuesta se da por implantada.
