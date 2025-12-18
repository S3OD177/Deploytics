-- Add environment support to integrations table
-- This allows tracking multiple deployments per project/provider (e.g., production, staging)

-- Step 1: Add environment column with default
ALTER TABLE public.integrations 
  ADD COLUMN environment TEXT NOT NULL DEFAULT 'production';

-- Step 2: Drop old unique constraint
ALTER TABLE public.integrations 
  DROP CONSTRAINT integrations_project_id_provider_key;

-- Step 3: Add new unique constraint including environment
ALTER TABLE public.integrations 
  ADD CONSTRAINT integrations_project_id_provider_environment_key 
  UNIQUE (project_id, provider, environment);

-- Step 4: Add index for faster queries
CREATE INDEX integrations_environment_idx ON public.integrations(environment);
