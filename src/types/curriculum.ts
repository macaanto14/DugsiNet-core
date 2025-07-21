export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  grade_level: number;
  department: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  subject_id: string;
  name: string;
  code: string;
  description?: string;
  academic_year_id?: string;
  grade_level: number;
  credits: number;
  duration_weeks: number;
  is_mandatory: boolean;
  prerequisites: string[];
  learning_objectives: string[];
  syllabus_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subject?: Subject;
  academic_year?: { name: string };
  teachers?: CourseTeacher[];
  topics?: CurriculumTopic[];
}

export interface CourseTeacher {
  id: string;
  course_id: string;
  staff_id: string;
  role: 'primary' | 'assistant' | 'substitute';
  assigned_at: string;
  staff?: {
    id: string;
    first_name: string;
    last_name: string;
    employee_id: string;
  };
}

export interface CurriculumTopic {
  id: string;
  course_id: string;
  name: string;
  description?: string;
  order_index: number;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  topic_id: string;
  name: string;
  description?: string;
  content?: string;
  order_index: number;
  duration_minutes: number;
  learning_outcomes: string[];
  materials_needed: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseMaterial {
  id: string;
  course_id: string;
  lesson_id?: string;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  is_public: boolean;
  created_at: string;
  uploader?: {
    full_name: string;
  };
}

export interface CreateCourseData {
  subject_id: string;
  name: string;
  code: string;
  description?: string;
  academic_year_id?: string;
  grade_level: number;
  credits: number;
  duration_weeks: number;
  is_mandatory: boolean;
  prerequisites: string[];
  learning_objectives: string[];
  syllabus_url?: string;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  description?: string;
  grade_level: number;
  department: string;
}

export interface CreateTopicData {
  course_id: string;
  name: string;
  description?: string;
  order_index: number;
  duration_hours: number;
}

export interface CreateLessonData {
  topic_id: string;
  name: string;
  description?: string;
  content?: string;
  order_index: number;
  duration_minutes: number;
  learning_outcomes: string[];
  materials_needed: string[];
}