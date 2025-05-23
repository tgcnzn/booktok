/*
  # Fix Registration Policies

  1. Changes
    - Add policy for profile creation during signup
    - Fix profile selection policy
    - Add function to handle profile creation

  2. Security
    - Maintain RLS while allowing necessary operations
    - Ensure proper access control
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create more specific policies
CREATE POLICY "Users can create their initial profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    CASE 
      WHEN auth.uid() = id THEN true
      WHEN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
      ) THEN true
      ELSE false
    END
  );

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (
    CASE
      WHEN auth.uid() = id THEN true
      WHEN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
      ) THEN true
      ELSE false
    END
  );

-- Function to ensure profile exists after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'participant')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();