-- Change offers.deliverables from text to jsonb
-- No data migration needed — all current data is demo
ALTER TABLE offers DROP COLUMN IF EXISTS deliverables;
ALTER TABLE offers ADD COLUMN deliverables jsonb;
