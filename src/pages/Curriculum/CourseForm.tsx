import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { curriculumApi } from '../../lib/curriculum';
import { db } from '../../lib/supabase';
import { Subject, CreateCourseData, Course } from '../../types/curriculum';
import { AcademicYear } from '../../types';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreateCourseData>();

  const watchedObjectives = watch('learning_objectives') || [];
  const watchedPrerequisites = watch('prerequisites') || [];

  useEffect(() => {
    loadFormData();
    if (isEditing) {
      loadCourse();
    }
  }, [id]);

  const loadFormData = async () => {
    try {
      const [subjectsResult, academicYearsResult] = await Promise.all([
        curriculumApi.getSubjects(),
        db.getAcademicYears()
      ]);

      if (subjectsResult.error) throw subjectsResult.error;
      if (academicYearsResult.error) throw academicYearsResult.error;

      setSubjects(subjectsResult.data || []);
      setAcademicYears(academicYearsResult.data || []);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const loadCourse = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await curriculumApi.getCourseById(id);
      if (error) throw error;
      
      if (data) {
        reset({
          subject_id: data.subject_id,
          name: data.name,
          code: data.code,
          description: data.description || '',
          academic_year_id: data.academic_year_id || '',
          grade_level: data.grade_level,
          credits: data.credits,
          duration_weeks: data.duration_weeks,
          is_mandatory: data.is_mandatory,
          prerequisites: data.prerequisites,
          learning_objectives: data.learning_objectives,
          syllabus_url: data.syllabus_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: CreateCourseData) => {
    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await curriculumApi.updateCourse(id!, data);
        if (error) throw error;
      } else {
        const { error } = await curriculumApi.createCourse(data);
        if (error) throw error;
      }
      
      navigate('/curriculum');
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLearningObjective = () => {
    const current = watchedObjectives;
    setValue('learning_objectives', [...current, '']);
  };

  const removeLearningObjective = (index: number) => {
    const current = watchedObjectives;
    setValue('learning_objectives', current.filter((_, i) => i !== index));
  };

  const updateLearningObjective = (index: number, value: string) => {
    const current = watchedObjectives;
    const updated = [...current];
    updated[index] = value;
    setValue('learning_objectives', updated);
  };

  const addPrerequisite = () => {
    const current = watchedPrerequisites;
    setValue('prerequisites', [...current, '']);
  };

  const removePrerequisite = (index: number) => {
    const current = watchedPrerequisites;
    setValue('prerequisites', current.filter((_, i) => i !== index));
  };

  const updatePrerequisite = (index: number, value: string) => {
    const current = watchedPrerequisites;
    const updated = [...current];
    updated[index] = value;
    setValue('prerequisites', updated);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/curriculum')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update course information and curriculum' : 'Add a new course to the curriculum'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                {...register('subject_id', { required: 'Subject is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code}) - Grade {subject.grade_level}
                  </option>
                ))}
              </select>
              {errors.subject_id && (
                <p className="text-red-600 text-sm mt-1">{errors.subject_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                {...register('academic_year_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select academic year</option>
                {academicYears.map(year => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.is_current && '(Current)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Course name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <input
                type="text"
                {...register('code', { required: 'Course code is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course code"
              />
              {errors.code && (
                <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level *
              </label>
              <select
                {...register('grade_level', { 
                  required: 'Grade level is required',
                  valueAsNumber: true 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select grade level</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
              {errors.grade_level && (
                <p className="text-red-600 text-sm mt-1">{errors.grade_level.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credits *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                {...register('credits', { 
                  required: 'Credits is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Credits must be at least 1' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter credits"
              />
              {errors.credits && (
                <p className="text-red-600 text-sm mt-1">{errors.credits.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Weeks) *
              </label>
              <input
                type="number"
                min="1"
                max="52"
                {...register('duration_weeks', { 
                  required: 'Duration is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Duration must be at least 1 week' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter duration in weeks"
              />
              {errors.duration_weeks && (
                <p className="text-red-600 text-sm mt-1">{errors.duration_weeks.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Syllabus URL
              </label>
              <input
                type="url"
                {...register('syllabus_url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter syllabus document URL"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course description"
            />
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('is_mandatory')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                This is a mandatory course
              </span>
            </label>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Learning Objectives</h2>
            <button
              type="button"
              onClick={addLearningObjective}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              <span>Add Objective</span>
            </button>
          </div>

          <div className="space-y-3">
            {watchedObjectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateLearningObjective(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter learning objective"
                />
                <button
                  type="button"
                  onClick={() => removeLearningObjective(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {watchedObjectives.length === 0 && (
              <p className="text-gray-500 text-sm">No learning objectives added yet.</p>
            )}
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Prerequisites</h2>
            <button
              type="button"
              onClick={addPrerequisite}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prerequisite</span>
            </button>
          </div>

          <div className="space-y-3">
            {watchedPrerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter prerequisite course code"
                />
                <button
                  type="button"
                  onClick={() => removePrerequisite(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {watchedPrerequisites.length === 0 && (
              <p className="text-gray-500 text-sm">No prerequisites added yet.</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/curriculum')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;