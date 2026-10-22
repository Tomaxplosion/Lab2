# Registro del grupo

Integrantes confirmados por el usuario: **Alex Serrano, Alba Prats y Tomás Juan**. Fecha: 22/10/2026. Entrega completa: viernes 30/10/2026 a las 23:59, PDU, una por grupo.

## Quién hizo qué

| Integrante | Trabajo y commits propios |
|---|---|
| Alex Serrano | Pendiente de indicar y contrastar con su cuenta GitHub |
| Alba Prats | Pendiente de indicar y contrastar con su cuenta GitHub |
| Tomás Juan | Interlocución y configuración del proveedor comunicada en el chat; pendiente de confirmar reparto y vincular commits personales |

Los commits generados por el asistente utilizan la identidad ya configurada en este repositorio; no acreditan por sí mismos participación individual. No se reescribe el historial ni se crean autores ficticios. Cada integrante debe revisar, aportar y guardar sus cambios con su cuenta. Quién realiza la entrega: pendiente de confirmar.

## Decisiones revisadas

El usuario identifica como revisión compartida los fallos de acceso tratados en la conversación y el contraste de tecnologías. Se concretan las decisiones documentadas sin atribuirlas individualmente:

- La IA propuso inicialmente conceder permisos CRUD como solución al acceso. La comprobación mostró que RLS seguía bloqueando las filas. Se corrigió mediante políticas solo para laboratorio_app, manteniendo RLS. La diferencia entre privilegios de tabla y políticas por fila explica por qué GRANT no bastaba.
- Se contrastó la integración Supabase SDK con una conexión PostgreSQL de servidor. Se eligió pg y Transaction pooler para conservar los secretos en servidor y aplicar un rol mínimo. Las dependencias Supabase añadidas previamente por el usuario no se retiran sin necesidad; no se emplean para autenticar este perfil.
- La parte 1 calculaba el nivel también en el navegador. La parte 2 lo corrige: función única de servidor y endpoint de evaluación; el navegador solo presenta el resultado.

Cada integrante debe completar con sus palabras una decisión revisada, qué cambió y por qué, y asociarla a sus commits. Esta revisión individual está pendiente; la lista anterior no la sustituye.

## Pregunta de cierre

Recomendamos primero copias separadas y restauración completa probada. Protege la conservación de registros confirmados y permite medir si el servicio vuelve antes de incumplir el plazo de siete días. Simularíamos la pérdida de instancia en pruebas, restauraríamos la copia y compararíamos integridad, recuentos y matrículas completas. Mediríamos RPO y RTO contra los límites aprobados por dirección; 1 hora y 4 horas son propuestas, no requisitos ya aprobados. La medida sigue siendo propuesta hasta implantarla y aportar evidencia; no reduce automáticamente la valoración inicial.

Repositorio remoto configurado localmente: https://github.com/Tomaxplosion/Lab2. Visibilidad privada y acceso del profesor pendientes de verificación; no se inventan esas evidencias.
