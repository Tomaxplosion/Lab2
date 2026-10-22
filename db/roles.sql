-- Ejecutar como propietario en Supabase SQL Editor. Nunca incluir contraseñas en Git.
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='laboratorio_migrator') THEN
  CREATE ROLE laboratorio_migrator NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='laboratorio_app') THEN
  CREATE ROLE laboratorio_app NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
 END IF;
END $$;
GRANT laboratorio_migrator TO CURRENT_USER;
ALTER SCHEMA lab_riesgos OWNER TO laboratorio_migrator;
GRANT USAGE,CREATE ON SCHEMA lab_riesgos TO laboratorio_migrator;
REVOKE CREATE ON SCHEMA lab_riesgos FROM laboratorio_app;
-- Activar LOGIN y fijar contraseñas en el proveedor. No conceder migrator a app.
