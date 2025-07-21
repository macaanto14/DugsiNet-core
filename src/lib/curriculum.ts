import { supabase } from './supabase';
import { 
  Subject, 
  Course, 
  CourseTeacher, 
  CurriculumTopic, 
  Lesson, 
  CourseMaterial,
  CreateCourseData,
  CreateSubjectData,
  CreateTopicData,
  CreateLessonData
} from '../types/curriculum';

export const curriculumApi = {
  // Subjects
  getSubjects: () => 
    supabase
      .from('subjects')
      .select('*')
      .order('grade_level', { ascending: true })
      .order('name', { ascending: true }),

  getSubjectById: (id: string) =>
    supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single(),

  createSubject: (data: CreateSubjectData) =>
    supabase
      .from('subjects')
      .insert(data)
      .select()
      .single(),

  updateSubject: (id: string, data: Partial<CreateSubjectData>) =>
    supabase
      .from('subjects')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

  deleteSubject: (id: string) =>
    supabase
      .from('subjects')
      .delete()
      .eq('id', id),

  // Courses
  getCourses: () =>
    supabase
      .from('courses')
      .select(`
        *,
        subject:subjects(*),
        academic_year:academic_years(name),
        teachers:course_teachers(
          id,
          role,
          assigned_at,
          staff:staff(id, first_name, last_name, employee_id)
        )
      `)
      .order('grade_level', { ascending: true })
      .order('name', { ascending: true }),

  getCourseById: (id: string) =>
    supabase
      .from('courses')
      .select(`
        *,
        subject:subjects(*),
        academic_year:academic_years(name),
        teachers:course_teachers(
          id,
          role,
          assigned_at,
          staff:staff(id, first_name, last_name, employee_id)
        ),
        topics:curriculum_topics(
          *,
          lessons:lessons(*)
        )
      `)
      .eq('id', id)
      .single(),

  createCourse: (data: CreateCourseData) =>
    supabase
      .from('courses')
      .insert(data)
      .select()
      .single(),

  updateCourse: (id: string, data: Partial<CreateCourseData>) =>
    supabase
      .from('courses')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

  deleteCourse: (id: string) =>
    supabase
      .from('courses')
      .delete()
      .eq('id', id),

  // Course Teachers
  assignTeacher: (courseId: string, staffId: string, role: 'primary' | 'assistant' | 'substitute') =>
    supabase
      .from('course_teachers')
      .insert({
        course_id: courseId,
        staff_id: staffId,
        role
      })
      .select(`
        *,
        staff:staff(id, first_name, last_name, employee_id)
      `)
      .single(),

  removeTeacher: (id: string) =>
    supabase
      .from('course_teachers')
      .delete()
      .eq('id', id),

  updateTeacherRole: (id: string, role: 'primary' | 'assistant' | 'substitute') =>
    supabase
      .from('course_teachers')
      .update({ role })
      .eq('id', id)
      .select(`
        *,
        staff:staff(id, first_name, last_name, employee_id)
      `)
      .single(),

  // Curriculum Topics
  getTopicsByCourse: (courseId: string) =>
    supabase
      .from('curriculum_topics')
      .select(`
        *,
        lessons:lessons(*)
      `)
      .eq('course_id', courseId)
      .order('order_index', { ascending: true }),

  createTopic: (data: CreateTopicData) =>
    supabase
      .from('curriculum_topics')
      .insert(data)
      .select()
      .single(),

  updateTopic: (id: string, data: Partial<CreateTopicData>) =>
    supabase
      .from('curriculum_topics')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

  deleteTopic: (id: string) =>
    supabase
      .from('curriculum_topics')
      .delete()
      .eq('id', id),

  // Lessons
  getLessonsByTopic: (topicId: string) =>
    supabase
      .from('lessons')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true }),

  createLesson: (data: CreateLessonData) =>
    supabase
      .from('lessons')
      .insert(data)
      .select()
      .single(),

  updateLesson: (id: string, data: Partial<CreateLessonData>) =>
    supabase
      .from('lessons')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

  deleteLesson: (id: string) =>
    supabase
      .from('lessons')
      .delete()
      .eq('id', id),

  // Course Materials
  getMaterialsByCourse: (courseId: string) =>
    supabase
      .from('course_materials')
      .select(`
        *,
        uploader:users(full_name)
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false }),

  uploadMaterial: (data: {
    course_id: string;
    lesson_id?: string;
    name: string;
    description?: string;
    file_url: string;
    file_type: string;
    file_size: number;
    uploaded_by: string;
    is_public: boolean;
  }) =>
    supabase
      .from('course_materials')
      .insert(data)
      .select(`
        *,
        uploader:users(full_name)
      `)
      .single(),

  deleteMaterial: (id: string) =>
    supabase
      .from('course_materials')
      .delete()
      .eq('id', id),

  // Search and Filter
  searchCourses: (query: string, filters?: {
    grade_level?: number;
    department?: string;
    is_mandatory?: boolean;
  }) => {
    let queryBuilder = supabase
      .from('courses')
      .select(`
        *,
        subject:subjects(*),
        academic_year:academic_years(name)
      `);

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,code.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (filters?.grade_level) {
      queryBuilder = queryBuilder.eq('grade_level', filters.grade_level);
    }

    if (filters?.department) {
      queryBuilder = queryBuilder.eq('subject.department', filters.department);
    }

    if (filters?.is_mandatory !== undefined) {
      queryBuilder = queryBuilder.eq('is_mandatory', filters.is_mandatory);
    }

    return queryBuilder.order('grade_level', { ascending: true }).order('name', { ascending: true });
  }
};