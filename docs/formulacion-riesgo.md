# Formulación guiada

El formulario contiene proceso (3–100 caracteres), activo (plataforma web, base de datos, copias), objetivo (plazo o conservación), condición (3–500), amenaza (3–200), evento (3–500), consecuencia (3–500) y supuestos opcionales (hasta 700).

Debilidad facilita el daño; amenaza lo puede provocar; evento es lo que sucede; consecuencia es su efecto en la organización. La vista previa reúne los datos según la estructura del enunciado, pero si falta un campo de texto obligatorio muestra una lista de pendientes. Activo y objetivo tienen selecciones explícitas por defecto. La persona debe revisar la coherencia.

Además: P e I enteros 1–3; justificaciones 3–700; medida y prueba 3–1000; responsable 3–100; prioridad y estado enumerados; evidencia opcional hasta 1000, obligatoria con al menos 10 caracteres al marcar Verificada.

«Cargar ejemplo» reproduce el escenario de almacenamiento del enunciado; «Cargar segundo riesgo» prepara privilegios excesivos. «Limpiar formulario» descarta el borrador, sin borrar registros. El borrador vive en memoria y desaparece al recargar. Guardar requiere acceso al servidor, valida de nuevo y persiste en BD. Editar un registro solo lo cambia al guardar.

Todos los controles tienen etiquetas y límites. React presenta los textos como texto plano; no se usa HTML del usuario. La validación del navegador por sí sola no satisface SEG-05: se implementa también en app/api/risks/route.ts y lib/domain.ts. Las pruebas cubren vacíos, ejemplo, edición, limpieza, tipos y valores inválidos.

## Actualización parte 2

Se añade expectedEffect obligatorio (3-1000 caracteres), estados Propuesta/Implantada/Verificada y fecha de modificación. Se sustituye el aviso de borrador temporal por una explicación del guardado persistente. El formulario sin guardar conserva solo cambios locales, mientras que el listado recupera registros del servidor. Ningún cálculo de puntuación se realiza en el navegador.

