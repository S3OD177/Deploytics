-- Add external_id for linking to Vercel/Provider ID
ALTER TABLE deployments ADD COLUMN IF NOT EXISTS external_id text;

-- Add cost for tracking estimated spend
ALTER TABLE deployments ADD COLUMN IF NOT EXISTS cost numeric DEFAULT 0;

-- Optional: Index on external_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_deployments_external_id ON deployments(external_id);
