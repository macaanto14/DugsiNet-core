import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { curriculumApi } from '../../lib/curriculum';
import { Course, CurriculumTopic, Lesson } from '../../types/curriculum';
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  Clock, 
  BookOpen, 
  Star,
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  Download
} from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await curriculumApi.getCourseById(id);
      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        <p className="text-gray-500 mb-4">The course you're looking for doesn't exist.</p>
        <Link
          to="/curriculum"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Curriculum
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/curriculum')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
              {course.is_mandatory && (
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-gray-600 mt-2">{course.code} • {course.subject?.department}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/curriculum/courses/${course.id}/topics/new`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Topic</span>
          </Link>
          <Link
            to={`/curriculum/courses/${course.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Course</span>
          </Link>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Grade Level</p>
                <p className="text-lg text-gray-900">Grade {course.grade_level}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Credits</p>
                <p className="text-lg text-gray-900">{course.credits}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-lg text-gray-900">{course.duration_weeks} weeks</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <p className="text-lg text-gray-900">
                  {course.is_mandatory ? 'Mandatory' : 'Elective'}
                </p>
              </div>
            </div>

            {course.description && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{course.description}</p>
              </div>
            )}
          </div>

          {/* Learning Objectives */}
          {course.learning_objectives && course.learning_objectives.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Objectives</h2>
              <ul className="space-y-2">
                {course.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-900">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
              <div className="flex flex-wrap gap-2">
                {course.prerequisites.map((prerequisite, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                  >
                    {prerequisite}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Topics</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {course.topics?.length || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Teachers</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {course.teachers?.length || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {course.topics?.reduce((total, topic) => total + topic.duration_hours, 0) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Teachers */}
          {course.teachers && course.teachers.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Teachers</h3>
              <div className="space-y-3">
                {course.teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {teacher.staff?.first_name?.charAt(0)}{teacher.staff?.last_name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {teacher.staff?.first_name} {teacher.staff?.last_name}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{teacher.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syllabus */}
          {course.syllabus_url && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h3>
              <a
                href={course.syllabus_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Course Syllabus</p>
                  <p className="text-sm text-gray-600">PDF Document</p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Curriculum Topics</h2>
            <Link
              to={`/curriculum/courses/${course.id}/topics/new`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              <span>Add Topic</span>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {course.topics && course.topics.length > 0 ? (
            <div className="space-y-4">
              {course.topics
                .sort((a, b) => a.order_index - b.order_index)
                .map((topic) => (
                  <div key={topic.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {expandedTopics.has(topic.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{topic.name}</h3>
                          {topic.description && (
                            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{topic.duration_hours}h</span>
                        <span>{topic.lessons?.length || 0} lessons</span>
                      </div>
                    </button>

                    {expandedTopics.has(topic.id) && topic.lessons && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-4">
                          <div className="space-y-2">
                            {topic.lessons
                              .sort((a, b) => a.order_index - b.order_index)
                              .map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-900">{lesson.name}</h4>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {lesson.duration_minutes}min
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Link
                              to={`/curriculum/topics/${topic.id}/lessons/new`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              + Add Lesson
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No topics yet</h3>
              <p className="text-gray-500 mb-4">Start building your curriculum by adding topics.</p>
              <Link
                to={`/curriculum/courses/${course.id}/topics/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Topic
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;