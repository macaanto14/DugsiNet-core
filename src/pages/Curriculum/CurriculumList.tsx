import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { curriculumApi } from '../../lib/curriculum';
import { Course } from '../../types/curriculum';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const CurriculumList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await curriculumApi.getCourses();
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === '' || course.grade_level.toString() === selectedGrade;
    const matchesDepartment = selectedDepartment === '' || course.subject?.department === selectedDepartment;
    
    return matchesSearch && matchesGrade && matchesDepartment;
  });

  const departments = [...new Set(courses.map(course => course.subject?.department).filter(Boolean))];
  const grades = [...new Set(courses.map(course => course.grade_level))].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Management</h1>
          <p className="text-gray-600 mt-2">Manage courses, subjects, and curriculum structure</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/curriculum/subjects"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <BookOpen className="w-5 h-5" />
            <span>Manage Subjects</span>
          </Link>
          <Link
            to="/curriculum/courses/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Course</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{course.name}</h3>
                  {course.is_mandatory && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-blue-600 font-medium">{course.code}</p>
                <p className="text-sm text-gray-600">{course.subject?.department}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Grade {course.grade_level}
                </span>
              </div>
            </div>

            {course.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>{course.credits} Credits</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{course.duration_weeks} Weeks</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{course.teachers?.length || 0} Teacher(s)</span>
              </div>
            </div>

            {course.learning_objectives && course.learning_objectives.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Learning Objectives:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {course.learning_objectives.slice(0, 2).map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span className="line-clamp-1">{objective}</span>
                    </li>
                  ))}
                  {course.learning_objectives.length > 2 && (
                    <li className="text-blue-600">+{course.learning_objectives.length - 2} more</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Link
                  to={`/curriculum/courses/${course.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/curriculum/courses/${course.id}/edit`}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  course.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or create a new course.</p>
          <Link
            to="/curriculum/courses/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default CurriculumList;