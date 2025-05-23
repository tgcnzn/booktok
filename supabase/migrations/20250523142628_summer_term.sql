/*
  # Initial Schema for Literary Contest Platform

  1. Tables
    - `profiles`
      - User profiles with roles (participant, judge, admin)
    - `submissions`
      - Contest submissions with stage tracking
    - `votes`
      - Public votes for finalists
    - `settings`
      - System settings
    - `deletion_requests`
      - GDPR data deletion requests

  2. Security
    - Enable RLS on all tables
    - Add policies for each table to control access
*/

-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('participant', 'judge', 'admin')) DEFAULT 'participant',
  assigned_genre TEXT CHECK (assigned_genre IN ('fiction', 'non-fiction', 'poetry')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  genre TEXT NOT NULL CHECK (genre IN ('fiction', 'non-fiction', 'poetry')),
  synopsis TEXT NOT NULL,
  video_url TEXT NOT NULL,
  manuscript_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'selected', 'rejected', 'finalist', 'winner')) DEFAULT 'pending',
  stage TEXT NOT NULL CHECK (stage IN ('submission', 'manuscript', 'voting')) DEFAULT 'submission',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, submission_id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to increment votes
CREATE OR REPLACE FUNCTION increment_vote(submission_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE submissions
  SET votes = votes + 1
  WHERE id = submission_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get participants with submission counts
CREATE OR REPLACE FUNCTION get_participants_with_submissions()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ,
  submission_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    COUNT(s.id) AS submission_count
  FROM
    profiles p
    LEFT JOIN submissions s ON p.id = s.user_id
  WHERE
    p.role = 'participant'
  GROUP BY
    p.id
  ORDER BY
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get judges with evaluation counts
CREATE OR REPLACE FUNCTION get_judges_with_evaluations()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ,
  assigned_genre TEXT,
  evaluation_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    p.assigned_genre,
    0::BIGINT AS evaluation_count  -- Placeholder for future evaluation tracking
  FROM
    profiles p
  WHERE
    p.role = 'judge'
  ORDER BY
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Submissions Policies
CREATE POLICY "Public submissions are viewable by everyone"
  ON submissions FOR SELECT
  USING (stage = 'voting' AND status = 'finalist');

CREATE POLICY "Users can view their own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Judges can view all submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'judge' OR role = 'admin')
    )
  );

CREATE POLICY "Users can create their own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Votes Policies
CREATE POLICY "Votes are viewable by admins only"
  ON votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Settings Policies
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage settings"
  ON settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Deletion Requests Policies
CREATE POLICY "Users can create deletion requests for themselves"
  ON deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own deletion requests"
  ON deletion_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all deletion requests"
  ON deletion_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage deletion requests"
  ON deletion_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert initial admin user and settings
INSERT INTO settings (key, value) VALUES ('voting_enabled', 'true');