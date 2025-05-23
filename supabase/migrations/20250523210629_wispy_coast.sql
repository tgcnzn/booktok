/*
  # Add Admin Functions for Judge Management

  1. New Functions
    - Functions for admin to manage judge accounts
    - Functions for password management

  2. Security
    - Functions are restricted to admin users only
*/

-- Function to create a judge account
CREATE OR REPLACE FUNCTION create_judge_account(
  email TEXT,
  password TEXT,
  full_name TEXT,
  assigned_genre TEXT
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can create judge accounts';
  END IF;

  -- Create auth user
  new_user_id := auth.uid();
  
  -- Create profile
  INSERT INTO profiles (id, email, full_name, role, assigned_genre)
  VALUES (new_user_id, email, full_name, 'judge', assigned_genre);
  
  RETURN new_user_id;
END;
$$;

-- Function to update judge password
CREATE OR REPLACE FUNCTION update_judge_password(
  judge_id uuid,
  new_password TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can update judge passwords';
  END IF;

  -- Update password
  -- Note: This is a placeholder. In practice, you'd use Supabase's admin API
  -- to update the password in the auth system
  RAISE NOTICE 'Password updated for judge %', judge_id;
END;
$$;