import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/Dashboard/DashboardStats';
import { 
  Calendar, 
  Clock, 
  Bell, 
  TrendingUp, 
  Users, 
  UserCheck, 
  BookOpen,
  UserPlus,
  ClipboardList,
  CalendarDays,
  FileText,
  BarChart3,
  TestTube,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Register Student',
      description: 'Add new student to the system',
      icon: UserPlus,
      color: 'bg-green-600 hover:bg-green-700',
      path: '/students/onboarding',
      roles: ['admin', 'staff']
    },
    {
      title: 'Mark Attendance',
      description: 'Record daily attendance',
      icon: ClipboardList,
      color: 'bg-blue-600 hover:bg-blue-700',
      path: '/attendance',
      roles: ['admin', 'staff']
    },
    {
      title: "Today's Schedule",
      description: 'View class timetable',
      icon: CalendarDays,
      color: 'bg-purple-600 hover:bg-purple-700',
      path: '/timetable',
      roles: ['admin', 'staff', 'student']
    },
    {
      title: 'Create Course',
      description: 'Add new course to curriculum',
      icon: BookOpen,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      path: '/curriculum/courses/new',
      roles: ['admin', 'staff']
    },
    {
      title: 'Generate Reports',
      description: 'Create academic reports',
      icon: BarChart3,
      color: 'bg-orange-600 hover:bg-orange-700',
      path: '/documents/reports',
      roles: ['admin', 'staff']
    },
    {
      title: 'Manage Exams',
      description: 'Schedule and manage exams',
      icon: TestTube,
      color: 'bg-red-600 hover:bg-red-700',
      path: '/exams',
      roles: ['admin', 'staff']
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New student admission',
      description: 'Ahmed Ali has been admitted to Grade 7-A',
      time: '2 hours ago',
      type: 'admission',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      id: 2,
      title: 'Staff leave approved',
      description: 'Fatima Hassan\'s leave request has been approved',
      time: '4 hours ago',
      type: 'leave',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Fee payment received',
      description: 'Monthly fee payment received from Omar Said',
      time: '6 hours ago',
      type: 'payment',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 4,
      title: 'Exam schedule updated',
      description: 'Mid-term exam schedule has been updated',
      time: '1 day ago',
      type: 'exam',
      icon: Calendar,
      color: 'text-purple-600'
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: '2025-01-15',
      time: '09:00 AM',
      category: 'meeting',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      title: 'Mid-term Exams',
      date: '2025-01-20',
      time: '08:00 AM',
      category: 'exam',
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 3,
      title: 'Sports Day',
      date: '2025-01-25',
      time: '10:00 AM',
      category: 'event',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      title: 'Science Fair',
      date: '2025-01-30',
      time: '02:00 PM',
      category: 'academic',
      color: 'bg-purple-100 text-purple-800'
    },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Pending Admissions',
      message: '5 student applications awaiting approval',
      icon: AlertTriangle,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    {
      id: 2,
      type: 'info',
      title: 'Fee Reminders',
      message: '12 students have pending fee payments',
      icon: Info,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 3,
      type: 'success',
      title: 'Monthly Target',
      message: 'Attendance rate reached 95% this month',
      icon: Star,
      color: 'bg-green-50 border-green-200 text-green-800'
    }
  ];

  const todaySchedule = [
    { time: '08:00 AM', subject: 'Mathematics', class: 'Grade 7-A', teacher: 'Dr. Ahmed' },
    { time: '09:00 AM', subject: 'English', class: 'Grade 8-B', teacher: 'Ms. Sarah' },
    { time: '10:00 AM', subject: 'Science', class: 'Grade 9-A', teacher: 'Mr. Hassan' },
    { time: '11:00 AM', subject: 'History', class: 'Grade 10-C', teacher: 'Dr. Fatima' },
  ];

  const filteredQuickActions = quickActions.filter(action => hasRole(action.roles));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="text-green-100 text-lg">
              Here's what's happening at your school today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-100 text-sm">Today's Date</p>
            <p className="text-xl font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {hasRole(['admin', 'staff']) && (
        <DashboardStats />
      )}

      {/* Alerts & Notifications */}
      {hasRole(['admin', 'staff']) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border ${alert.color}`}>
              <div className="flex items-center space-x-3">
                <alert.icon className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm opacity-90">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Bell className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                  <p className="text-gray-500 text-xs mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
              <span>View Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{event.date}</span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.color}`}>
                  {event.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      {hasRole(['admin', 'staff', 'student']) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
            </div>
            <button 
              onClick={() => navigate('/timetable')}
              className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {todaySchedule.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">{item.time}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                <p className="text-sm text-gray-600">{item.class}</p>
                <p className="text-xs text-gray-500">{item.teacher}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;