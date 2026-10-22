-- Ejecutar con postgres desde SQL Editor, sobre la base de esta práctica.
-- Permite acceso solo al rol del servidor; no concede acceso a anon ni authenticated.
BEGIN;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='lab_riesgos' AND tablename='risks' AND policyname='laboratorio_app_access') THEN
    CREATE POLICY laboratorio_app_access ON lab_riesgos.risks
      FOR ALL TO laboratorio_app USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='lab_riesgos' AND tablename='login_limits' AND policyname='laboratorio_app_access') THEN
    CREATE POLICY laboratorio_app_access ON lab_riesgos.login_limits
      FOR ALL TO laboratorio_app USING (true) WITH CHECK (true);
  END IF;
END $$;
COMMIT;
