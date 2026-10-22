# Laboratorio de gestión de riesgos

Aplicación académica para identificar, evaluar y comunicar riesgos y priorizar medidas de protección. Caso ficticio: Academia Horizonte, campaña de matrícula de siete días. Next.js y TypeScript, compatible con Vercel, sin IA integrada.

## Ejecutar en Windows

Requisitos comprobados: Git 2.55.0, Node.js 24.21.0 y npm 11.19.0. Usar Node 24 por `node:sqlite`. PowerShell bloquea npm.ps1; los comandos usan npm.cmd sin cambiar la política del equipo.

```powershell
npm.cmd ci
npm.cmd run setup:local
npm.cmd run dev
```

Abrir http://127.0.0.1:3000. El comando de configuración genera .env.development.local y muestra la contraseña **solo en tu terminal**: guardarla en Bitwarden. No se ha generado una contraseña personal durante la preparación. No compartirla en el chat. Si ya existe .env.development.local, el script no la sobrescribe.

La configuración inicial incorpora los dos riesgos completos del caso si la base de datos está vacía. Al entrar, revisarlos en «Resumen para dirección», donde también se responde a la pregunta de cierre. «Identificar un riesgo» permite cargar los ejemplos, editarlos y guardarlos. En una BD nueva de Preview, revisar y guardar ambos ejemplos desde el formulario.

SQLite guarda los registros en .data/development.sqlite. Recargar o reiniciar conserva los datos. SQLite está prohibido en Vercel y fuera del entorno development; allí es obligatoria PostgreSQL. No se usa localStorage como protección o persistencia principal.

## Comprobar

```powershell
npm.cmd test
npm.cmd run build
$env:PLAYWRIGHT_BROWSERS_PATH="$PWD/tmp/browsers"
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

Las pruebas de navegador usan secretos efímeros, una BD aislada en tmp/ y el puerto 3100. No apuntar esa ejecución a producción. La prueba cubre accesos sin sesión, origen externo, entrada inválida, borrador, edición, limpieza, guardado, recarga y salida. Ver [resultados](docs/pruebas.md).

## Documentación y entrega

- [Caso](docs/caso.md) y [escalas y evaluación](docs/evaluacion-riesgos.md).
- [Fuentes oficiales](docs/fuentes.md) y [requisitos de seguridad](docs/requisitos-seguridad.md).
- [Formulación guiada](docs/formulacion-riesgo.md) y [gestión de secretos](docs/secretos.md).
- [Decisión de IA revisada](docs/decision-ia.md), [pruebas](docs/pruebas.md) y [despliegue](docs/despliegue.md).

## GitHub privado y Vercel Preview

Crear un repositorio **privado** vacío desde GitHub, añadir su URL con `git remote add origin URL_DEL_REPOSITORIO` y subir la rama con `git push -u origin HEAD`. Invitar al profesor desde Settings / Collaborators. No se ha enviado ninguna invitación ni subido el proyecto a una cuenta.

Preview: https://laboratorio2-riesgos-preview-spamtom4444.vercel.app. La página está publicada; el registro remoto requiere configurar **Supabase** y las variables de acceso. Ver [Supabase](docs/supabase.md) y [despliegue](docs/despliegue.md). Vercel puede pedir acceso a la cuenta por su protección de Preview. No ejecutar `--prod`.

Adaptación didáctica, sin declaración de conformidad completa con ENS o NIST. La cuenta compartida del laboratorio protege el acceso, pero no ofrece atribución individual ni MFA.
