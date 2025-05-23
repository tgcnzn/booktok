/*
  # Fix Profile Policies to Prevent Recursion

  1. Changes
    - Remove recursive policy checks
    - Simplify profile access controls
    - Add admin bypass policy
    - Fix profile creation flow
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their initial profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Admin full access"
  ON profiles
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update the handle_new_user function to use metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role from metadata, default to 'participant'
  user_role := COALESCE(new.raw_app_meta_data->>'role', 'participant');
  
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id,
    new.email,
    user_role,
    new.raw_app_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name;
    
  RETURN new;
END;
$$;