-- Ejecutar una vez con el administrador en CADA base de datos separada.
CREATE SCHEMA lab_riesgos;
REVOKE ALL ON SCHEMA lab_riesgos FROM PUBLIC;
CREATE TABLE lab_riesgos.risks (id uuid PRIMARY KEY, created_at timestamptz NOT NULL, payload jsonb NOT NULL);
CREATE TABLE lab_riesgos.login_limits (bucket text PRIMARY KEY, attempts integer NOT NULL CHECK(attempts > 0));
-- Crear el rol laboratorio_app con contraseña mediante la consola segura del proveedor.
-- No escribir contraseñas en este script ni usar el propietario como cuenta de aplicación.
GRANT USAGE ON SCHEMA lab_riesgos TO laboratorio_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON lab_riesgos.risks, lab_riesgos.login_limits TO laboratorio_app;
-- No añadir lab_riesgos a los esquemas expuestos de la Data API de Supabase.
-- La cuenta NO debe tener SUPERUSER, CREATEDB, CREATEROLE ni pertenecer al rol propietario.
