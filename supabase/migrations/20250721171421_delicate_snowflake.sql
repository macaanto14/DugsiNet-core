/*
  # Curriculum Management Schema

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text, subject name)
      - `code` (text, unique subject code)
      - `description` (text, subject description)
      - `grade_level` (integer, grade level)
      - `department` (text, department name)
      - `is_active` (boolean, active status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `courses`
      - `id` (uuid, primary key)
      - `subject_id` (uuid, foreign key to subjects)
      - `name` (text, course name)
      - `code` (text, unique course code)
      - `description` (text, course description)
      - `academic_year_id` (uuid, foreign key to academic_years)
      - `grade_level` (integer, grade level)
      - `credits` (integer, course credits)
      - `duration_weeks` (integer, course duration)
      - `is_mandatory` (boolean, mandatory status)
      - `prerequisites` (text[], array of prerequisite course codes)
      - `learning_objectives` (text[], array of learning objectives)
      - `syllabus_url` (text, syllabus file URL)
      - `is_active` (boolean, active status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `course_teachers`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `staff_id` (uuid, foreign key to staff)
      - `role` (text, teacher role: primary, assistant, substitute)
      - `assigned_at` (timestamp)

    - `curriculum_topics`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `name` (text, topic name)
      - `description` (text, topic description)
      - `order_index` (integer, topic order)
      - `duration_hours` (integer, estimated hours)
      - `is_active` (boolean, active status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `lessons`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key to curriculum_topics)
      - `name` (text, lesson name)
      - `description` (text, lesson description)
      - `content` (text, lesson content)
      - `order_index` (integer, lesson order)
      - `duration_minutes` (integer, lesson duration)
      - `learning_outcomes` (text[], array of learning outcomes)
      - `materials_needed` (text[], array of required materials)
      - `is_active` (boolean, active status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `course_materials`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `lesson_id` (uuid, foreign key to lessons, nullable)
      - `name` (text, material name)
      - `description` (text, material description)
      - `file_url` (text, file URL)
      - `file_type` (text, file type)
      - `file_size` (bigint, file size in bytes)
      - `uploaded_by` (uuid, foreign key to users)
      - `is_public` (boolean, public access)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can manage all curriculum data
    - Staff can view and manage assigned courses
    - Students can view course information and materials
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  grade_level integer NOT NULL,
  department text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  academic_year_id uuid REFERENCES academic_years(id),
  grade_level integer NOT NULL,
  credits integer DEFAULT 1,
  duration_weeks integer DEFAULT 36,
  is_mandatory boolean DEFAULT false,
  prerequisites text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  syllabus_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_teachers table
CREATE TABLE IF NOT EXISTS course_teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  role text DEFAULT 'primary' CHECK (role IN ('primary', 'assistant', 'substitute')),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(course_id, staff_id, role)
);

-- Create curriculum_topics table
CREATE TABLE IF NOT EXISTS curriculum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL,
  duration_hours integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES curriculum_topics(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  content text,
  order_index integer NOT NULL,
  duration_minutes integer DEFAULT 45,
  learning_outcomes text[] DEFAULT '{}',
  materials_needed text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint DEFAULT 0,
  uploaded_by uuid REFERENCES users(id),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_grade_level ON subjects(grade_level);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department);
CREATE INDEX IF NOT EXISTS idx_courses_subject_id ON courses(subject_id);
CREATE INDEX IF NOT EXISTS idx_courses_grade_level ON courses(grade_level);
CREATE INDEX IF NOT EXISTS idx_courses_academic_year ON courses(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_course_teachers_course_id ON course_teachers(course_id);
CREATE INDEX IF NOT EXISTS idx_course_teachers_staff_id ON course_teachers(staff_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_topics_course_id ON curriculum_topics(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_topic_id ON lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON course_materials(course_id);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subjects
CREATE POLICY "Admins can manage subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Staff can read subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff')
  ));

CREATE POLICY "Students can read active subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff', 'student', 'parent')
  ));

-- Create RLS policies for courses
CREATE POLICY "Admins can manage courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Staff can read courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff')
  ));

CREATE POLICY "Students can read active courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff', 'student', 'parent')
  ));

-- Create RLS policies for course_teachers
CREATE POLICY "Admins can manage course teachers"
  ON course_teachers
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Staff can read course teachers"
  ON course_teachers
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff')
  ));

-- Create RLS policies for curriculum_topics
CREATE POLICY "Admins and assigned staff can manage topics"
  ON curriculum_topics
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM course_teachers ct
    JOIN staff s ON ct.staff_id = s.id
    WHERE ct.course_id = curriculum_topics.course_id 
    AND s.user_id = auth.uid()
  ));

CREATE POLICY "Everyone can read active topics"
  ON curriculum_topics
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create RLS policies for lessons
CREATE POLICY "Admins and assigned staff can manage lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM course_teachers ct
    JOIN staff s ON ct.staff_id = s.id
    JOIN curriculum_topics t ON ct.course_id = t.course_id
    WHERE t.id = lessons.topic_id 
    AND s.user_id = auth.uid()
  ));

CREATE POLICY "Everyone can read active lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create RLS policies for course_materials
CREATE POLICY "Admins can manage all materials"
  ON course_materials
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Staff can manage course materials"
  ON course_materials
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM course_teachers ct
    JOIN staff s ON ct.staff_id = s.id
    WHERE ct.course_id = course_materials.course_id 
    AND s.user_id = auth.uid()
  ));

CREATE POLICY "Everyone can read public materials"
  ON course_materials
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculum_topics_updated_at
  BEFORE UPDATE ON curriculum_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO subjects (name, code, description, grade_level, department) VALUES
('Mathematics', 'MATH', 'Core mathematics curriculum', 7, 'Mathematics'),
('English Language', 'ENG', 'English language and literature', 7, 'Languages'),
('Science', 'SCI', 'General science curriculum', 7, 'Science'),
('Social Studies', 'SOC', 'History, geography, and civics', 7, 'Social Studies'),
('Islamic Studies', 'ISL', 'Islamic education and values', 7, 'Religious Studies'),
('Somali Language', 'SOM', 'Somali language and culture', 7, 'Languages'),
('Physical Education', 'PE', 'Physical fitness and sports', 7, 'Physical Education'),
('Art & Crafts', 'ART', 'Creative arts and crafts', 7, 'Arts');

-- Insert sample courses
INSERT INTO courses (subject_id, name, code, description, academic_year_id, grade_level, credits, is_mandatory, learning_objectives) 
SELECT 
  s.id,
  s.name || ' - Grade 7',
  s.code || '7',
  'Grade 7 ' || s.name || ' course covering fundamental concepts',
  (SELECT id FROM academic_years WHERE is_current = true LIMIT 1),
  7,
  CASE WHEN s.code IN ('MATH', 'ENG', 'SCI') THEN 4 ELSE 2 END,
  CASE WHEN s.code IN ('MATH', 'ENG', 'SCI', 'ISL') THEN true ELSE false END,
  ARRAY['Understand basic concepts', 'Apply knowledge in practical situations', 'Develop critical thinking skills']
FROM subjects s;