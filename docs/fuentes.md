# Fuentes y condiciones de reutilización

Consulta: 22 de octubre de 2026. Resúmenes propios; no se redistribuyen normas completas. El enunciado local es Laboratorio_2_Gestion_de_riesgos.pdf (11 páginas). No se presupone permiso para publicar ese PDF; se excluye de la entrega Git.

| Fuente | Versión y apartados verificados | Uso |
|---|---|---|
| [ENS, Real Decreto 311/2022](https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191) | Texto consolidado, última actualización indicada 06/11/2024; anexo II: op.acc.4, op.exp.2 y mp.sw.1 | Derechos limitados por defecto, configuración segura, desarrollo y separación de pruebas. Texto consolidado informativo; no certificación jurídica. |
| [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) | Septiembre de 2020, actualizaciones 10/12/2020. PDF oficial, AC-6 (p. 36), IA-5 (p. 138) y SI-10 (p. 350), numeración impresa | Mínimo privilegio, gestión de autenticadores y validación de entradas. La ficha advierte de Release 5.2.0 de 27/08/2025; se mantiene la edición solicitada por el laboratorio. |
| [PDF oficial NIST](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf) | 492 páginas; controles comprobados en el texto | Verificación de nombres y contenido, no reproducción íntegra. |
| [Condiciones de uso NIST](https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications) | Página web sin revisión numerada; sección NIST Technical Series Publications | Obras de empleados NIST sin copyright en EE. UU.; permiso mundial descrito para reimpresión, con matices para terceros. Aquí solo se enlaza y resume con atribución. |
| [Autenticación Next.js](https://nextjs.org/docs/app/guides/authentication) | Documentación App Router, v16.4.2 mostrada en la consulta | Comprobación de autorización en cada operación del servidor. |

El ENS se enlaza y resume con palabras propias, sin redistribuir el documento. Las licencias de dependencias constan en sus paquetes y package-lock.json fija las versiones. Esta selección didáctica no acredita conformidad completa con ENS ni NIST.

Proveedor confirmado: Supabase. Documentación oficial de [conexiones PostgreSQL](https://supabase.com/docs/guides/database/connecting-to-postgres) y [roles](https://supabase.com/docs/guides/database/postgres/roles), páginas sin revisión numerada, consultadas el 22/10/2026. Se usan para elegir pooler serverless y un rol personalizado. Solo se enlazan y resumen.
