-- Evitar solapamiento de citas para el mismo doctor cuando la cita esté activa
-- Estados considerados "activas": PENDIENTE_PAGO, ACEPTADA

-- 1) Habilitar la extensión 

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2) Agregar la constraint EXCLUDE
DO $$
BEGIN
  -- Evitar duplicidad si ya existe la restricción 
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'citas_sin_solape_por_doctor'
  ) THEN
    ALTER TABLE "Cita"
      ADD CONSTRAINT citas_sin_solape_por_doctor
      EXCLUDE USING gist (
        "doctor_id" WITH =,
        tstzrange("inicio","fin",'[)') WITH &&
--¿Por qué [)?
--Es semiabierto a derecha: una cita que termina a las 10:30 y otra que empieza a las 10:30 no se consideran superpuestas.        
      )
      WHERE ("estado" IN ('PENDIENTE_PAGO','ACEPTADA'));
  END IF;
END$$;