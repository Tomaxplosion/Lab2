# Caso ficticio: Academia Horizonte

La Academia Horizonte gestiona matrículas mediante una plataforma web. La campaña dura siete días. Su objetivo es que las solicitudes puedan completarse dentro del plazo y que los registros confirmados se conserven y puedan recuperarse.

Activos: plataforma web, base de datos de matrículas y copias de seguridad.

Condiciones conocidas del caso: hay una única instancia de base de datos; no se ha probado la restauración de las copias; la cuenta de aplicación tiene permisos administrativos.

Estas condiciones pertenecen exclusivamente al caso ficticio. La implementación entregada usa SQLite en desarrollo y prevé PostgreSQL con un rol limitado en Vercel. No describe datos o sistemas reales.
