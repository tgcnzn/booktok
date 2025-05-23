/*
  # Fix Profile Creation and Role Assignment

  1. Changes
    - Simplify profile creation trigger
    - Fix role assignment from metadata
    - Update RLS policies
    - Add admin functions for user management

  2. Security
    - Maintain RLS
    - Add proper role checks
*/

-- Drop existing function and recreate with fixes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'participant'),
    new.raw_user_meta_data->>'full_name'
  );
  
  RETURN new;
END;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- Create new policies
CREATE POLICY "Enable read access to own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update access to own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for new users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin has full access"
  ON profiles FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Function to create a judge (admin only)
CREATE OR REPLACE FUNCTION create_judge(
  judge_email TEXT,
  judge_name TEXT,
  judge_genre TEXT DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can create judges
  IF NOT (auth.jwt() ->> 'role' = 'admin') THEN
    RAISE EXCEPTION 'Only administrators can create judges';
  END IF;

  -- Create profile with judge role
  INSERT INTO profiles (id, email, full_name, role, assigned_genre)
  VALUES (
    auth.uid(),
    judge_email,
    judge_name,
    'judge',
    judge_genre
  );
END;
$$;