/*
  # DugsiNet School Management System Database Schema

  1. New Tables
    - `users` - User accounts with role-based access
    - `academic_years` - Academic year management
    - `classes` - Class/grade management
    - `students` - Student information and records
    - `staff` - Staff information and records
    - `attendance` - Attendance tracking for students and staff

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles

  3. Authentication
    - Uses Supabase Auth for user management
    - Role-based permissions (admin, staff, student, parent)
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'student', 'parent');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE staff_status AS ENUM ('active', 'inactive', 'on_leave');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Academic Years table
CREATE TABLE IF NOT EXISTS academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level integer NOT NULL,
  section text NOT NULL DEFAULT 'A',
  academic_year_id uuid REFERENCES academic_years(id),
  class_teacher_id uuid REFERENCES users(id),
  capacity integer DEFAULT 30,
  current_enrollment integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  gr_number text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender gender_type NOT NULL,
  class_id uuid REFERENCES classes(id),
  admission_date date DEFAULT CURRENT_DATE,
  previous_school text,
  parent_id uuid REFERENCES users(id),
  address text NOT NULL,
  emergency_contact text NOT NULL,
  photo_url text,
  status student_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender gender_type NOT NULL,
  department text NOT NULL,
  position text NOT NULL,
  hire_date date DEFAULT CURRENT_DATE,
  salary numeric(10,2) DEFAULT 0,
  status staff_status DEFAULT 'active',
  address text NOT NULL,
  emergency_contact text NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id),
  staff_id uuid REFERENCES staff(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  status attendance_status NOT NULL DEFAULT 'present',
  remarks text,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT attendance_person_check CHECK (
    (student_id IS NOT NULL AND staff_id IS NULL) OR 
    (student_id IS NULL AND staff_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for academic_years
CREATE POLICY "Everyone can read academic years"
  ON academic_years
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage academic years"
  ON academic_years
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for classes
CREATE POLICY "Everyone can read classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and staff can manage classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- RLS Policies for students
CREATE POLICY "Students can read own data"
  ON students
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    parent_id = auth.uid()
  );

CREATE POLICY "Admins and staff can read all students"
  ON students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can manage students"
  ON students
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for staff
CREATE POLICY "Staff can read own data"
  ON staff
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all staff"
  ON staff
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage staff"
  ON staff
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for attendance
CREATE POLICY "Students can read own attendance"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    ) OR
    staff_id IN (
      SELECT id FROM staff WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and staff can read all attendance"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins and staff can manage attendance"
  ON attendance
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_students_gr_number ON students(gr_number);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_staff_employee_id ON staff(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_staff_id ON attendance(staff_id);

-- Insert default academic year
INSERT INTO academic_years (name, start_date, end_date, is_current)
VALUES ('2024-2025', '2024-09-01', '2025-06-30', true)
ON CONFLICT DO NOTHING;

-- Insert default classes
DO $$
DECLARE
    current_year_id uuid;
BEGIN
    SELECT id INTO current_year_id FROM academic_years WHERE is_current = true LIMIT 1;
    
    INSERT INTO classes (name, grade_level, section, academic_year_id) VALUES
    ('Grade 1-A', 1, 'A', current_year_id),
    ('Grade 2-A', 2, 'A', current_year_id),
    ('Grade 3-A', 3, 'A', current_year_id),
    ('Grade 4-A', 4, 'A', current_year_id),
    ('Grade 5-A', 5, 'A', current_year_id),
    ('Grade 6-A', 6, 'A', current_year_id),
    ('Grade 7-A', 7, 'A', current_year_id),
    ('Grade 8-A', 8, 'A', current_year_id)
    ON CONFLICT DO NOTHING;
END $$;

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'student')::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON academic_years FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();