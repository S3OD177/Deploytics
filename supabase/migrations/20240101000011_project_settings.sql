-- Add settings jsonb column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb;
