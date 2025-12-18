
-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  badge_id TEXT NOT NULL, -- e.g., 'night-owl', 'speed-demon'
  awarded_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_id)
);

-- RLS for user_badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

-- Create project_predictions table
CREATE TABLE IF NOT EXISTS project_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  prediction_type TEXT NOT NULL, -- e.g., 'velocity', 'risk'
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1.0),
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ
);

-- RLS for project_predictions
ALTER TABLE project_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view predictions for their projects"
  ON project_predictions FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );

-- Function to award a badge (can be called by Edge Functions or Triggers)
CREATE OR REPLACE FUNCTION award_badge(p_user_id UUID, p_badge_id TEXT, p_metadata JSONB DEFAULT '{}'::jsonb)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_badges (user_id, badge_id, metadata)
  VALUES (p_user_id, p_badge_id, p_metadata)
  ON CONFLICT (user_id, badge_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
