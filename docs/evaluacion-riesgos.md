# Evaluación de riesgos

Horizonte: próxima campaña de matrícula de siete días. Puntuación = probabilidad × impacto. Bajo: 1–2; medio: 3–4; alto: 6–9. Estas reglas son propias del ejercicio y no se atribuyen a ENS ni NIST.

## Escalas

| Valor | Probabilidad | Impacto |
|---|---|---|
| 1 | Baja: razones justificadas para considerar poco probable el evento | Menor: no compromete plazo ni pierde registros confirmados |
| 2 | Media: evento plausible sin razones para considerarlo poco probable | Significativo: recuperación relevante, objetivo todavía alcanzable |
| 3 | Alta: indicios concretos de evento probable durante la campaña | Grave: incumplimiento del plazo o pérdida irrecuperable de registros |

Se exige justificar ambos valores. La información ausente se registra como supuesto o pendiente; no se transforma en probabilidad alta.

## Riesgo 1: pérdida de registros confirmados

Debido a que no se ha probado la restauración de las copias, un fallo del almacenamiento podría provocar pérdida de acceso a los registros confirmados de la base de datos, causando imposibilidad de reconstruir parte de las matrículas y dificultando conservar y recuperar registros del proceso de matrícula.

P=2: plausible, sin indicios de fallo inminente. La falta de restauraciones probadas crea incertidumbre, no demuestra frecuencia alta. I=3: si la copia no es recuperable, se pierden registros confirmados de manera definitiva. Resultado: **6, alto**.

Supuesto: se desconoce si las copias recuperan todos los registros. Medida prioritaria 1: copias horarias cifradas en almacenamiento separado y restauración completa aislada antes de la campaña. Responsable: sistemas. Prueba: simular pérdida de instancia, restaurar, medir tiempo y comparar integridad y matrículas. RPO ≤ 1 hora y RTO ≤ 4 horas son criterios propuestos, pendientes de aprobar por dirección. Estado: propuesta, sin evidencia de implantación.

## Riesgo 2: alteración por privilegios excesivos

Debido a los permisos administrativos de la cuenta de aplicación, su uso indebido tras un posible compromiso podría provocar borrado o alteración de tablas de la base de datos, interrumpiendo matrículas y dificultando completar las solicitudes dentro de los siete días.

P=2: plausible por los privilegios, sin evidencia de intrusión. I=3: la interrupción y reconstrucción pueden superar el plazo. Resultado: **6, alto**. Supuestos: posible obtención de la cuenta y tiempo de recuperación desconocido.

Medida prioritaria 2: cuenta exclusiva con CRUD sobre tablas autorizadas, migraciones separadas y rotación de credencial. Responsable: administración de BD. Prueba: CRUD permitido; CREATE, DROP y acceso a otras tablas denegados. Estado: propuesta; prueba PostgreSQL pendiente de disponer de proveedor.

## Respuesta a dirección

Si solo puede aprobarse una medida, priorizar la restauración probada y las copias separadas: permite demostrar que los registros se conservan y que el servicio puede volver antes de comprometer el plazo. El mínimo privilegio sigue siendo necesario, pero no recupera por sí mismo registros perdidos por un fallo físico. La prioridad se revisará si aparecen indicios de compromiso activo.

Una medida propuesta o implantada no reduce automáticamente la puntuación. Incluso después de verificarla, la reevaluación debe justificar nuevos valores; la aplicación conserva la evaluación inicial hasta una edición explícita.
