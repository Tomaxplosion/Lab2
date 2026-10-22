# Requisitos de seguridad - estado final

Fecha: 22/10/2026. Versión técnica: 061330d. Adaptación didáctica de ENS RD 311/2022 y NIST SP 800-53 Rev. 5; no acredita conformidad completa. Referencias y condiciones en fuentes.md. Estado: cumplido, parcial o pendiente según evidencia, sin atribuir resultados no ejecutados.

| ID | Estado | Implementación y referencia | Prueba y evidencia |
|---|---|---|---|
| SEG-01 | Parcial | Exclusiones de archivos sensibles; custodia en Bitwarden. IA-5 apoya gestión de autenticadores; Git es requisito propio | Escáner de todo el historial: sin patrones encontrados. Hubo exposición en chat/captura y queda rotación personal pendiente; incidencias.md |
| SEG-02 | Cumplido | pg y módulos server-only; nunca NEXT_PUBLIC para secretos. IA-5, relación parcial | Chromium comprueba HTML y JS contra contraseña efímera y cadenas PostgreSQL; sin coincidencias. No equivale a auditoría exhaustiva |
| SEG-03 | Parcial | Perfil gestor, scrypt, sesión HMAC 4 h, HttpOnly/Secure en HTTPS/SameSite Strict, autorización GET/POST/PUT/DELETE y Origin exacto. ENS op.acc.4.1 | Pruebas locales sin sesión: 401 y BD idéntica. Origen ajeno: 403. Pruebas remotas en pruebas.md |
| SEG-04 | Parcial | Rol app CRUD, migrator propietario separado, RLS limitado a app. ENS op.acc.4.2 y AC-6 | Usuario confirma SQL ejecutado. CRUD remoto preparado pero no ejecutado por bloqueo; falta prueba de denegación DDL y auditoría de membresías con la cuenta real |
| SEG-05 | Cumplido | Zod estricto de servidor, límites, enumeraciones, tipos, UUID y evidencia. NIST SI-10 y apoyo ENS mp.sw.1 | Vacío, texto largo, valor ajeno, P=4, score inyectado y JSON malformado rechazados; unitarias/API |
| SEG-06 | Parcial | PostgreSQL en desarrollo y Preview; SQLite solo pruebas aisladas. DATABASE_URL_ADMIN solo local. ENS mp.sw.1 como apoyo | Secretos efímeros de prueba distintos, SESSION_SECRET Preview rotado. Falta configurar y verificar BD PostgreSQL de desarrollo distinta de Preview |
| SEG-07 | Cumplido | Errores públicos genéricos con referencia; diagnóstico interno solo operation, code, reference, fecha. Requisito del laboratorio, apoyo op.exp.2 | Entradas inválidas sin SQL, rutas, stacks ni credenciales; logger por lista blanca, no serializa excepciones |
| SEG-08 | Parcial | Commits por etapas, lockfile, Preview y etiqueta entrega-l2. Requisito del laboratorio | Versiones y pruebas documentadas; faltan aportaciones personales identificadas, URL repositorio confirmada y acceso profesor |

## Explicación de decisiones

Se requieren GRANT y políticas RLS: conceder privilegios a una tabla no autoriza automáticamente sus filas. Se concede acceso solo al rol del servidor. La contraseña no se almacena en claro: scrypt con sal; el secreto HMAC es distinto. El servidor valida y calcula la puntuación aunque el navegador sea modificado. Una medida propuesta no reduce el riesgo. Los errores internos se identifican por referencia sin divulgar datos de conexión.

Limitaciones: un único perfil compartido, sin identidad individual ni MFA. El límite global de 30 solicitudes de acceso por intervalo de 15 minutos también cuenta accesos correctos y puede bloquear temporalmente a un usuario legítimo. Cerrar sesión elimina la cookie local; rotar SESSION_SECRET invalida todas. La CSP conserva inline por Next y unsafe-eval exclusivamente en desarrollo.

## Bloqueo final verificado

La Preview de parte 2 está Blocked por permisos del autor Git (Vercel), no por un fallo de construcción. La URL estable conserva parte 1. Las pruebas remotas requeridas siguen pendientes. SEG-03 se considera **parcial en el despliegue** aunque su implementación y pruebas locales estén completas; SEG-08 permanece parcial. La rotación de SESSION_SECRET está guardada en Preview y surtirá efecto al lograr un despliegue nuevo Ready.

