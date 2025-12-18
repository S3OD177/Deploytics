-- Add events jsonb array column
ALTER TABLE alert_rules ADD COLUMN IF NOT EXISTS events jsonb DEFAULT '[]'::jsonb;

-- Migrate existing event_type data to events array
UPDATE alert_rules 
SET events = jsonb_build_array(event_type) 
WHERE events = '[]'::jsonb AND event_type IS NOT NULL;

-- Drop generic event_type column
ALTER TABLE alert_rules DROP COLUMN IF EXISTS event_type;
