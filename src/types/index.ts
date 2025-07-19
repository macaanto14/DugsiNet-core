export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'student' | 'parent';
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  gr_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  class_id: string;
  admission_date: string;
  previous_school?: string;
  parent_id?: string;
  address: string;
  emergency_contact: string;
  photo_url?: string;
  status: 'active' | 'inactive' | 'graduated';
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  user_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  department: string;
  position: string;
  hire_date: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  address: string;
  emergency_contact: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  grade_level: number;
  section: string;
  academic_year: string;
  class_teacher_id?: string;
  capacity: number;
  current_enrollment: number;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id?: string;
  staff_id?: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  remarks?: string;
  created_by: string;
  created_at: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}