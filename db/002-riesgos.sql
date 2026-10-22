BEGIN;
CREATE TABLE IF NOT EXISTS lab_riesgos.riesgos (
 id uuid PRIMARY KEY, process varchar(100) NOT NULL,
 asset varchar(30) NOT NULL CHECK(asset IN ('plataforma web','base de datos','copias de seguridad')),
 objective varchar(60) NOT NULL CHECK(objective IN ('completar solicitudes en plazo','conservar y recuperar registros')),
 condition varchar(500) NOT NULL, threat varchar(200) NOT NULL, event varchar(500) NOT NULL,
 consequence varchar(500) NOT NULL, assumptions varchar(700) NOT NULL DEFAULT '',
 probability smallint NOT NULL CHECK(probability BETWEEN 1 AND 3), impact smallint NOT NULL CHECK(impact BETWEEN 1 AND 3),
 "probabilityReason" varchar(700) NOT NULL, "impactReason" varchar(700) NOT NULL,
 score smallint NOT NULL CHECK(score IN (1,2,3,4,6,9)), level varchar(5) NOT NULL CHECK(level IN ('Bajo','Medio','Alto')),
 measure varchar(1000) NOT NULL, priority varchar(40) NOT NULL CHECK(priority IN ('1 - Inmediata','2 - Antes de campaña','3 - Planificada')),
 "expectedEffect" varchar(1000) NOT NULL, effectiveness varchar(1000) NOT NULL, owner varchar(100) NOT NULL,
 status varchar(15) NOT NULL CHECK(status IN ('Propuesta','Implantada','Verificada')), evidence varchar(1000) NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
-- Copia los datos de parte 1 sin borrar la tabla original. La fórmula SQL solo convierte datos históricos.
INSERT INTO lab_riesgos.riesgos
SELECT id,payload->>'process',payload->>'asset',payload->>'objective',payload->>'condition',payload->>'threat',payload->>'event',payload->>'consequence',COALESCE(payload->>'assumptions',''),
 (payload->>'probability')::smallint,(payload->>'impact')::smallint,payload->>'probabilityReason',payload->>'impactReason',
 (payload->>'probability')::smallint*(payload->>'impact')::smallint,
 CASE WHEN (payload->>'probability')::int*(payload->>'impact')::int<=2 THEN 'Bajo' WHEN (payload->>'probability')::int*(payload->>'impact')::int<=4 THEN 'Medio' ELSE 'Alto' END,
 payload->>'measure',payload->>'priority',COALESCE(payload->>'expectedEffect','Pendiente de concretar tras migrar la parte 1'),payload->>'effectiveness',payload->>'owner',
 CASE WHEN payload->>'status'='En implantación' THEN 'Implantada' ELSE payload->>'status' END,COALESCE(payload->>'evidence',''),created_at,COALESCE((payload->>'updatedAt')::timestamptz,created_at)
FROM lab_riesgos.risks ON CONFLICT(id) DO NOTHING;
ALTER TABLE lab_riesgos.riesgos ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='lab_riesgos' AND tablename='riesgos' AND policyname='laboratorio_app_access') THEN
  CREATE POLICY laboratorio_app_access ON lab_riesgos.riesgos FOR ALL TO laboratorio_app USING(true) WITH CHECK(true);
 END IF;
END $$;
REVOKE ALL ON lab_riesgos.riesgos FROM PUBLIC;
GRANT USAGE ON SCHEMA lab_riesgos TO laboratorio_app;
GRANT SELECT,INSERT,UPDATE,DELETE ON lab_riesgos.riesgos,lab_riesgos.login_limits TO laboratorio_app;
ALTER TABLE lab_riesgos.riesgos OWNER TO laboratorio_migrator;
ALTER TABLE lab_riesgos.login_limits OWNER TO laboratorio_migrator;
COMMIT;
