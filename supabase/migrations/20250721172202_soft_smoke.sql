/*
  # Create Admin User

  1. New User
    - Creates admin user with email haaji.dheere@gmail.com
    - Sets up user profile with admin role
    - Password: moha983936mm

  2. Security
    - User will be created in auth.users table
    - Profile created in public.users table with admin role
*/

-- Insert user into auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'haaji.dheere@gmail.com',
  crypt('moha983936mm', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Haaji Dheere"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID we just created
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'haaji.dheere@gmail.com';
  
  -- Insert user profile into public.users table
  INSERT INTO public.users (
    id,
    email,
    role,
    full_name,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    'haaji.dheere@gmail.com',
    'admin',
    'Haaji Dheere',
    NOW(),
    NOW()
  );
END $$;