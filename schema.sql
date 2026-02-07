-- Database Schema for Whoz Nexx Sports
-- Updated: Feb 25, 2026

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (parents/guardians)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  name TEXT,
  role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kids table (comprehensive registration)
CREATE TABLE kids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('football', 'baseball', 'soccer', 'basketball')),
  gender TEXT,
  school TEXT,
  grade TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  medical_notes TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  parent_phone TEXT,
  shirt_size TEXT CHECK (shirt_size IN ('YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL')),
  special_requests TEXT,
  registered_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for kids
CREATE POLICY "Parents can view own kids" ON kids
  FOR SELECT USING (
    parent_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert own kids" ON kids
  FOR INSERT WITH CHECK (
    parent_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all kids" ON kids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user signup (now stores phone)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Migration: Add new columns to existing kids table (run if upgrading)
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS gender TEXT;
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS school TEXT;
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS grade TEXT;
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'));
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS medical_notes TEXT;
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS parent_phone TEXT;
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS shirt_size TEXT CHECK (shirt_size IN ('YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL'));
-- ALTER TABLE kids ADD COLUMN IF NOT EXISTS special_requests TEXT;